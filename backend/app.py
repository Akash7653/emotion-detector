import os
import numpy as np
import cv2

from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Path to the saved Keras model
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "facialemotionmodel.h5")

EMOTIONS = ["angry", "disgust", "fear", "happy", "neutral", "sad", "surprise"]

# Global model reference (lazy-loaded)
model = None


def load_model():
    """
    Lazily load the Keras model the first time it's needed.
    Do NOT call this from /api/health.
    """
    global model
    if model is not None:
        return model

    try:
        from tensorflow import keras

        print(f"Loading model from {MODEL_PATH} ...", flush=True)
        model = keras.models.load_model(MODEL_PATH, compile=False)
        print(f"✓ Model loaded from {MODEL_PATH}", flush=True)
    except Exception as e:
        # Log the error; keep model as None so endpoints can return 500
        print(f"✗ Failed to load model: {e}", flush=True)
        model = None

    return model


@app.route("/")
def index():
    return "Emotion detection backend running", 200


@app.route("/api/health", methods=["GET"])
def health():
    """
    health check for Render.
    IMPORTANT: Do NOT load the model here.
    Render calls this very frequently; loading TF here kills the worker.
    """
    return jsonify(
        {
            "status": "ok",
            "emotions_supported": EMOTIONS,
            "model_loaded": model is not None,
        }
    )


@app.route("/api/detect", methods=["POST"])
def detect():
    """
    Main prediction endpoint. This is where we lazy-load the model.
    """
    mdl = load_model()
    if mdl is None:
        return jsonify({"error": "Model not loaded on server"}), 500

    if "image" not in request.files:
        return jsonify({"error": "No image file provided under 'image' field"}), 400

    file = request.files["image"]
    image_bytes = file.read()

    # Decode image using OpenCV
    np_arr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
    if img is None:
        return jsonify({"error": "Could not decode image"}), 400

    # Convert to grayscale + resize to 48x48 (like training)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    face = cv2.resize(gray, (48, 48))
    face = face.astype("float32") / 255.0
    face = np.expand_dims(face, axis=(0, -1))  # shape: (1, 48, 48, 1)

    # Predict
    preds = mdl.predict(face)[0]  # shape: (7,)
    top_idx = int(np.argmax(preds))
    top_emotion = EMOTIONS[top_idx]
    top_conf = float(preds[top_idx])

    probs = {EMOTIONS[i]: float(preds[i]) for i in range(len(EMOTIONS))}

    return jsonify(
        {
            "emotion": top_emotion,
            "confidence": top_conf,
            "probabilities": probs,
        }
    )


if __name__ == "__main__":
    # For local testing
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
