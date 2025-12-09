import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
} from 'react';
import axios from 'axios';
import './EmotionDetector.css';

const API_BASE_URL = 'https://emotions-tt57.onrender.com';


/* ----------------------------- Helper functions ----------------------------- */

function roundRect(ctx, x, y, width, height, radius = 5, fill, stroke) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + width, y, x + width, y + height, radius);
  ctx.arcTo(x + width, y + height, x, y + height, radius);
  ctx.arcTo(x, y + height, x, y, radius);
  ctx.arcTo(x, y, x + width, y, radius);
  ctx.closePath();
  if (fill) ctx.fill();
  if (stroke) ctx.stroke();
}

function hexToRgba(hex, alpha = 1) {
  const c = hex.replace('#', '');
  const bigint = parseInt(c, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function getEmotionColor(emotion) {
  const colors = {
    angry: '#FF6B6B',
    disgust: '#95E1D3',
    fear: '#FFE66D',
    happy: '#4ECDC4',
    neutral: '#95A5A6',
    sad: '#3498DB',
    surprise: '#E74C3C',
  };
  return colors[emotion] || '#FFFFFF';
}

/* ------------------------------ Main component ------------------------------ */

const EmotionDetector = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);        // active MediaStream
  const tempCanvasRef = useRef(null);    // reused small canvas for backend

  const [isRunning, setIsRunning] = useState(false);
  const [emotions, setEmotions] = useState([]);
  const [stats, setStats] = useState({});
  const [emotionCounts, setEmotionCounts] = useState({});
  const [connectionStatus, setConnectionStatus] = useState('connecting');

  const [finalizedEmotion, setFinalizedEmotion] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  /* ---------------------- Backend health check loop ----------------------- */

  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/health`);
        setConnectionStatus(
          response.data.model_loaded ? 'connected' : 'model-error'
        );
      } catch (error) {
        setConnectionStatus('disconnected');
      }
    };

    checkBackend();
    const interval = setInterval(checkBackend, 5000);
    return () => clearInterval(interval);
  }, []);

  /* --------------------------- Webcam init/cleanup --------------------------- */

  useEffect(() => {
    let isCancelled = false;

    const setupWebcam = async () => {
      if (!isRunning) return;
      const videoElement = videoRef.current;
      if (!videoElement) return;

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 640 },
            height: { ideal: 640 }, // closer to square
          },
        });

        if (!isCancelled) {
          videoElement.srcObject = stream;
          streamRef.current = stream;
        }
      } catch (err) {
        console.error('Error accessing webcam:', err);
        setConnectionStatus('webcam-error');
      }
    };

    setupWebcam();

    return () => {
      isCancelled = true;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
      const videoElement = videoRef.current;
      if (videoElement) {
        videoElement.srcObject = null;
        videoElement.pause();
      }
    };
  }, [isRunning]);

  /* --------------------------- Draw results helper --------------------------- */

  const drawResults = useCallback((ctx, emotionsData, dims = {}) => {
    if (!emotionsData || emotionsData.length === 0) return;

    const { canvasW = 640, canvasH = 480 } = dims;

    emotionsData.forEach((emotion) => {
      const baseColor = getEmotionColor(emotion.emotion);

      const margin = 14;
      const x = Math.max(0, emotion.x - margin);
      const y = Math.max(0, emotion.y - margin * 1.2);
      const w = Math.min(canvasW - x, emotion.width + margin * 2);
      const h = Math.min(canvasH - y, emotion.height + margin * 2);

      const radius = 14;

      ctx.fillStyle = hexToRgba(baseColor, 0.18);
      roundRect(ctx, x, y, w, h, radius, true, false);

      const lw = Math.max(4, Math.round(Math.min(canvasW, canvasH) / 140));
      ctx.strokeStyle = baseColor;
      ctx.lineWidth = lw;
      roundRect(ctx, x, y, w, h, radius, false, true);

      ctx.strokeStyle = hexToRgba('#ffffff', 0.7);
      ctx.lineWidth = Math.max(2, lw - 2);
      roundRect(ctx, x + 4, y + 4, w - 8, h - 8, radius - 4, false, true);

      ctx.font = '700 20px Poppins, system-ui, sans-serif';
      const label = `${emotion.emotion.toUpperCase()} ${(emotion.confidence * 100).toFixed(1)}%`;
      const textW = ctx.measureText(label).width + 20;
      const labelH = 34;
      const labelX = x;
      const labelY = Math.max(0, y - labelH - 4);

      ctx.fillStyle = baseColor;
      ctx.fillRect(labelX, labelY, textW, labelH);

      ctx.fillStyle = '#0f172a';
      ctx.textBaseline = 'middle';
      ctx.fillText(label, labelX + 10, labelY + labelH / 2);
    });
  }, []);

  /* -------------------------- Main detection loop --------------------------- */

  useEffect(() => {
    if (!isRunning) return;

    let cancelled = false;

    const detect = async () => {
      if (cancelled) return;

      if (!videoRef.current || !canvasRef.current) {
        if (!cancelled && isRunning) {
          setTimeout(detect, 120);
        }
        return;
      }

      const videoElement = videoRef.current;
      const canvasElement = canvasRef.current;

      try {
        const ctx = canvasElement.getContext('2d');

        const vw = videoElement.videoWidth || 480;
        const vh = videoElement.videoHeight || 480; // square fallback

        canvasElement.width = vw;
        canvasElement.height = vh;

        ctx.clearRect(0, 0, vw, vh);

        // Draw mirrored video to canvas – smooth live preview
        ctx.save();
        ctx.translate(vw, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(videoElement, 0, 0, vw, vh);
        ctx.restore();

        // Reuse small canvas for backend to reduce work & lag
        let tempCanvas = tempCanvasRef.current;
        if (!tempCanvas) {
          tempCanvas = document.createElement('canvas');
          tempCanvasRef.current = tempCanvas;
        }

        const sendW = 160;
        const sendH = 160;
        tempCanvas.width = sendW;
        tempCanvas.height = sendH;

        const tctx = tempCanvas.getContext('2d');
        tctx.drawImage(videoElement, 0, 0, sendW, sendH);
        const imageData = tempCanvas.toDataURL('image/jpeg', 0.5);

        const response = await axios.post(
          `${API_BASE_URL}/api/detect-emotion`,
          { image: imageData }
        );

        const raw = response.data.emotions || [];

        const scaleX = vw / sendW;
        const scaleY = vh / sendH;

        // Convert from model coords (unmirrored) to mirrored canvas coords
        const detected = raw.map((e) => {
          const baseW = e.width * scaleX;
          const baseH = e.height * scaleY;
          const baseX = e.x * scaleX;
          const baseY = e.y * scaleY;

          const mirroredX = vw - (baseX + baseW);

          return {
            ...e,
            x: mirroredX,
            y: baseY,
            width: baseW,
            height: baseH,
          };
        });

        setEmotions(detected);

        if (detected.length > 0) {
          setEmotionCounts((prev) => {
            const next = { ...prev };
            detected.forEach((result) => {
              next[result.emotion] = (next[result.emotion] || 0) + 1;
            });
            return next;
          });

          const avgConfidence = (
            detected.reduce((sum, e) => sum + e.confidence, 0) /
            detected.length
          ).toFixed(3);

          setStats({
            totalDetected: detected.length,
            avgConfidence,
            dominantEmotion: detected[0].emotion,
          });
        }

        // Draw boxes on top of mirrored frame
        drawResults(ctx, detected, {
          canvasW: canvasElement.width,
          canvasH: canvasElement.height,
        });
      } catch (err) {
        console.error('Detection error:', err);
      } finally {
        if (!cancelled && isRunning) {
          // tight loop – most lag is backend now
          setTimeout(detect, 60);
        }
      }
    };

    detect();

    return () => {
      cancelled = true;
    };
  }, [isRunning, drawResults]);

  /* ------------------------------ UI handlers ------------------------------- */

  const startDetection = () => {
    setIsRunning(true);
    setFinalizedEmotion(null);
    setSuggestions([]);
  };

  const stopDetection = () => {
    setIsRunning(false);

    const videoElement = videoRef.current;
    const stream = streamRef.current || (videoElement && videoElement.srcObject);

    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (videoElement) {
      videoElement.srcObject = null;
      videoElement.pause();
    }

    const canvasElement = canvasRef.current;
    if (canvasElement) {
      const ctx = canvasElement.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
      }
    }

    setEmotions([]);
    setStats({});
  };

  const resetStats = () => {
    setEmotionCounts({});
    setStats({});
    setEmotions([]);
    setFinalizedEmotion(null);
    setSuggestions([]);
  };

  const finalizeEmotion = () => {
    let chosen =
      stats.dominantEmotion || Object.keys(emotionCounts)[0] || null;
    if (!chosen && emotions.length > 0) chosen = emotions[0].emotion;
    setFinalizedEmotion(chosen);

    const map = {
      happy: [
        {
          title: 'Comedy Movie Night',
          desc: 'Keep the good vibes — watch a light comedy.',
        },
        { title: 'Dance Playlist', desc: 'Uplifting tracks to keep you moving.' },
      ],
      sad: [
        { title: 'Comfort Music', desc: 'Soothing acoustic tracks.' },
        {
          title: 'Feel-Good Documentary',
          desc: 'Stories that uplift and inspire.',
        },
      ],
      angry: [
        {
          title: 'High-Energy Workout',
          desc: 'Channel energy into motion.',
        },
        {
          title: 'Meditation Session',
          desc: 'Short guided breathing.',
        },
      ],
      surprise: [
        { title: 'Thriller Short', desc: 'Quick suspenseful clip.' },
        { title: 'Puzzle Game', desc: 'Engaging brain teaser.' },
      ],
      fear: [
        {
          title: 'Relaxing Nature Sounds',
          desc: 'Calming audio for grounding.',
        },
        {
          title: 'Guided Breath',
          desc: '2-minute grounding exercise.',
        },
      ],
      disgust: [
        {
          title: 'Comedy Sketches',
          desc: 'Light content to shift mood.',
        },
        { title: 'Cooking Show', desc: 'Satisfying and wholesome.' },
      ],
      neutral: [
        {
          title: 'Popular Series',
          desc: 'Start a trending show episode.',
        },
        {
          title: 'Explore New Music',
          desc: 'Discover something new.',
        },
      ],
    };

    setSuggestions(map[chosen] || []);
  };

  /* --------------------------------- JSX ------------------------------------ */

  return (
    <div className="emotion-detector">
      <div className="header">
        <h1>🎭 Facial Emotion Recognition</h1>
        <div className={`status-indicator ${connectionStatus}`}>
          {connectionStatus === 'connected'
            ? '✓ Connected'
            : '✗ ' + connectionStatus}
        </div>
      </div>

      {/* Brown heading just under outer page header */}
      <h2 className="live-title">Live Detection</h2>

      <div className="main-layout">
        {/* Top: centered video (canvas is visible) */}
        <div className="video-row">
          <div className="video-container">
            <video
              ref={videoRef}
              autoPlay
              muted
              className="video-feed"
            />
            <canvas
              ref={canvasRef}
              className="canvas-overlay"
              style={{ opacity: isRunning ? 1 : 0 }}
            />
            {!isRunning && (
              <div className="start-prompt">
                Tap <span>Start</span> to begin live detection
              </div>
            )}
          </div>
        </div>

        {/* Bottom: controls + stats */}
        <div className="info-row">
          <div className="controls-card">
            <h2 className="panel-title">Controls</h2>

            <div className="controls-buttons">
              <button
                onClick={startDetection}
                className="btn btn-start"
                disabled={
                  isRunning || connectionStatus !== 'connected'
                }
              >
                ▶ Start
              </button>

              <button
                onClick={stopDetection}
                className="btn btn-stop"
                disabled={!isRunning}
              >
                ⏹ Stop
              </button>

              <button
                onClick={resetStats}
                className="btn btn-reset"
              >
                Reset
              </button>
            </div>

            <button
              onClick={finalizeEmotion}
              className="btn btn-finalize"
              disabled={!stats.dominantEmotion}
            >
              📌 Capture &amp; Finalize Emotion
            </button>

            {finalizedEmotion && (
              <p className="finalized-label">
                Finalized:&nbsp;
                <strong>{finalizedEmotion}</strong>
              </p>
            )}
          </div>

          <div className="stats-frequency-wrapper">
            <div className="stats">
              <h3>Current Statistics</h3>
              {Object.keys(stats).length > 0 ? (
                <>
                  <p>
                    <span className="label">Faces Detected</span>
                    <span className="value">
                      {stats.totalDetected}
                    </span>
                  </p>
                  <p>
                    <span className="label">Avg Confidence</span>
                    <span className="value">
                      {stats.avgConfidence}
                    </span>
                  </p>
                  <p>
                    <span className="label">Dominant Emotion</span>
                    <span className="value highlight">
                      {stats.dominantEmotion}
                    </span>
                  </p>
                </>
              ) : (
                <p className="placeholder">No detection data yet</p>
              )}
            </div>

            <div className="emotion-counts">
              <h3>Emotion Frequency</h3>
              {Object.keys(emotionCounts).length > 0 ? (
                <div className="counts-list">
                  {Object.entries(emotionCounts)
                    .sort((a, b) => b[1] - a[1])
                    .map(([emotion, count]) => (
                      <div key={emotion} className="count-item">
                        <span className="emotion-label">{emotion}</span>
                        <div className="count-bar">
                          <div
                            className="count-fill"
                            style={{
                              width: `${
                                (count /
                                  Math.max(
                                    ...Object.values(emotionCounts)
                                  )) * 100
                              }%`,
                              backgroundColor: getEmotionColor(emotion),
                            }}
                          />
                        </div>
                        <span className="count-value">{count}</span>
                      </div>
                    ))}
                </div>
              ) : (
                <p className="placeholder">No emotion data yet</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {suggestions && suggestions.length > 0 && (
        <div
          className="finalize-panel"
          style={{ maxWidth: 1200, margin: '24px auto 0' }}
        >
          <h2 className="panel-title">Suggested Content</h2>
          <div
            className="suggestions"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: 12,
            }}
          >
            {suggestions.map((s, i) => {
              const makeGreen = i >= suggestions.length - 2; // last two cards
              return (
                <div
                  key={i}
                  className="card"
                  style={{
                    padding: 14,
                    borderRadius: 10,
                    background: 'rgba(255,255,255,0.06)',
                  }}
                >
                  <h4
                    style={{
                      margin: '0 0 6px',
                      color: makeGreen ? '#4ade80' : '#e5e7eb',
                    }}
                  >
                    {s.title}
                  </h4>
                  <p
                    style={{
                      margin: 0,
                      opacity: 0.9,
                      color: makeGreen ? '#bbf7d0' : '#cbd5ff',
                    }}
                  >
                    {s.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default EmotionDetector;
