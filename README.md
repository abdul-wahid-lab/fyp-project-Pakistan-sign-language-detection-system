# Pakistan Sign Language Detection System

A real-time Pakistani Sign Language (PSL) recognition system that translates hand gestures into Urdu text and speech using computer vision and machine learning.

![PSL Detection](frontend/public/images/preview.png)

---

## Features

- **Real-time detection** — recognizes 38 PSL alphabet letters via webcam
- **Sentence builder** — accept letters → build words → compose full sentences
- **Urdu speech output** — speaks detected words using pre-recorded audio or browser TTS
- **Word mode** — switch between letter-by-letter and full-word detection
- **Adjustable speed** — tune detection cooldown from 300ms to 3 seconds
- **Modern UI** — dark-themed Next.js frontend with live camera feed

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15, TypeScript, Tailwind CSS |
| Backend | FastAPI, Python 3.10+ |
| ML / CV | MediaPipe, TensorFlow, scikit-learn, OpenCV |
| Speech | Pre-recorded Urdu audio + Web Speech API fallback |

---

## Project Structure

```
├── backend/
│   ├── main.py                  # FastAPI entry point
│   ├── routers/                 # API route handlers
│   ├── services/                # Detection & capture logic
│   ├── core/                    # Config & dependencies
│   ├── data/
│   │   ├── models/              # Trained ML models (.h5, .pkl)
│   │   ├── learn/               # Guide images for the Learn Signs page
│   │   └── speech/              # Urdu audio files (.mp3)
│   ├── Keypoints/               # Captured keypoint JSON files
│   └── requirements.txt
│
└── frontend/
    ├── app/
    │   ├── page.tsx             # Landing page
    │   ├── sign/page.tsx        # Detection page
    │   └── components/          # Reusable UI components
    └── public/                  # Static assets
```

---

## Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+
- A webcam

---

### 1. Clone the repository

```bash
git clone https://github.com/abdul-wahid-lab/fyp-project-Pakistan-sign-language-detection-system.git
cd fyp-project-Pakistan-sign-language-detection-system
```

---

### 2. Set up the backend

```bash
cd backend
```

Create and activate a virtual environment:

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS / Linux
python -m venv venv
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create a `.env` file in the `backend/` folder:

```env
CAMERA_INDEX=0
MODEL_PATH=data/models/alphabet_model.h5
LABEL_ENCODER_PATH=data/models/alphabet_label_encoder.pkl
SCALER_PATH=data/models/alphabet_scaler.pkl
WORD_MODEL_PATH=data/models/word_model.h5
WORD_LABEL_ENCODER_PATH=data/models/word_label_encoder.pkl
WORD_SCALER_PATH=data/models/word_scaler.pkl
```

Start the backend server:

```bash
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

---

### 3. Set up the frontend

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

---

### 4. Open the app

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## How to Use

1. **Open the app** at `http://localhost:3000`
2. **Click "Start Detection"** on the homepage
3. Allow camera access when prompted
4. **Make a PSL hand sign** in front of your webcam
5. The detected letter appears in the **Detected Letter** panel
6. Click **Accept Letter** to add it to your current word
7. Once a word is complete, click **Add Word to Sentence**
8. Use **Speak Sentence** to hear the output in Urdu
9. Click any word in the sentence to remove it
10. Use the **Detection Speed** slider to adjust how fast letters are detected

### Tips

- Use good lighting for best accuracy
- Keep your hand centered in the camera frame
- Enable **Word Mode** to detect full words directly (experimental)
- Toggle **Enable Speech** to automatically speak each word as it's added

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/start-capture` | Open webcam and begin frame capture |
| `POST` | `/api/stop-capture` | Release webcam |
| `POST` | `/api/match` | Run detection on current frame, return label |
| `GET` | `/api/stream` | MJPEG live video stream |
| `GET` | `/audio/{word}.mp3` | Serve Urdu audio file for a word |

---

## Model Details

- **Architecture:** Dense neural network trained on MediaPipe hand keypoints
- **Input:** 63 keypoint values (21 landmarks × XYZ) per frame
- **Output:** 38 PSL alphabet classes
- **Training data:** Custom-collected PSL keypoint dataset

---

## License

This project was developed as a Final Year Project (FYP).

---

## Author

**Abdul Wahid** — [abdul-wahid-lab](https://github.com/abdul-wahid-lab)
