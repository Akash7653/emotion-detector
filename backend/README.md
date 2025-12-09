# Backend - Emotion Detection API

## Overview

Flask-based REST API for real-time facial emotion detection.

## Installation

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

## Running the Server

```bash
python app.py
```

Server will run on `http://localhost:5000`

## API Endpoints

### Health Check
```
GET /api/health
```

### Detect Emotions
```
POST /api/detect-emotion
Content-Type: application/json

{
  "image": "data:image/jpeg;base64,..."
}
```

## Features

- Real-time emotion detection
- Multiple face detection
- Confidence scoring
- CORS-enabled for frontend integration
- Health check endpoint
- Error handling

## Model

- Pre-trained CNN model
- 7 emotion classes
- 48x48 input size
- ~50MB weights file

## Configuration

- Port: 5000 (configurable in app.py)
- Debug: True (change to False in production)
- CORS: Enabled for all origins

## Dependencies

See `requirements.txt` for complete list of dependencies.
