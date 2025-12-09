from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np
import base64
from io import BytesIO
from PIL import Image
import os
import threading

app = Flask(__name__)
CORS(app)

# Base directory for model path
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

model = None
model_loaded = False


def load_model():
    """Load the emotion detection model asynchronously"""
    global model, model_loaded
    if model_loaded:
        return
    try:
        from tensorflow import keras

        model_path = os.path.join(BASE_DIR, "facialemotionmodel.h5")
        model = keras.models.load_model(model_path)
        print(f"✓ Model loaded from {model_path}")
        model_loaded = True
    except Exception as e:
        print(f"Error loading model: {e}")
        # mark as loaded to avoid infinite "model not loaded yet" loop
        model_loaded = True


# Start model loading in background
threading.Thread(target=load_model, daemon=True).start()

# Haar cascade
haar_file = cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
face_cascade = cv2.CascadeClassifier(haar_file)

# Label mapping must match your training
EMOTION_LABELS = {
    0: "angry",
    1: "disgust",
    2: "fear",
    3: "happy",
    4: "neutral",
    5: "sad",
    6: "surprise",
}


def extract_features(image):
    """Prepare 48x48 grayscale image for the model"""
    feature = np.array(image).reshape(1, 48, 48, 1)
    return feature / 255.0


def process_frame(frame):
    """Detect faces and predict emotions on a single BGR frame"""
    if model is None:
        return {"error": "Model not loaded yet. Try again in a few seconds."}

    try:
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = face_cascade.detectMultiScale(gray, 1.3, 5)

        emotions_found = []

        for (x, y, w, h) in faces:
            face_roi = gray[y : y + h, x : x + w]
            face_roi = cv2.resize(face_roi, (48, 48))

            features = extract_features(face_roi)
            prediction = model.predict(features, verbose=0)

            idx = int(np.argmax(prediction))
            emotion = EMOTION_LABELS[idx]
            confidence = float(prediction[0][idx])

            emotions_found.append(
                {
                    "emotion": emotion,
                    "confidence": confidence,
                    "x": int(x),
                    "y": int(y),
                    "width": int(w),
                    "height": int(h),
                }
            )

        return {"faces_count": len(faces), "emotions": emotions_found}

    except Exception as e:
        return {"error": f"Detection failed: {str(e)}"}


@app.route("/api/detect-emotion", methods=["POST"])
def detect_emotion_endpoint():
    """API endpoint for receiving image and returning predicted emotion"""
    try:
        data = request.json or {}
        image_data = data.get("image", "")

        if "," in image_data:
            # strip data URL prefix if present
            image_data = image_data.split(",", 1)[1]

        # base64 → PIL → numpy → OpenCV BGR
        image = Image.open(BytesIO(base64.b64decode(image_data)))
        frame = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)

        result = process_frame(frame)
        return jsonify(result)

    except Exception as e:
        return jsonify({"error": str(e)}), 400


@app.route("/api/health", methods=["GET"])
def health():
    """Health check endpoint"""
    return jsonify(
        {
            "status": "ok",
            "model_loaded": model_loaded,
            "emotions_supported": list(EMOTION_LABELS.values()),
        }
    )


if __name__ == "__main__":
    # Local run (Render / gunicorn will ignore this and use `gunicorn app:app`)
    port = int(os.environ.get("PORT", 5000))
    app.run(
        debug=True,
        host="0.0.0.0",
        port=port,
        threaded=True,
    )
