# LinguaSign — Pakistan Sign Language Detection System

A real-time Pakistani Sign Language (PSL) recognition system that translates hand gestures into Urdu text and speech, with a full learning platform built on top.

---

## Features

### Detection
- **Real-time recognition** — detects 37 PSL alphabet letters and 5 common words via webcam
- **Sentence builder** — accept letters → build words → compose full sentences
- **Urdu speech output** — plays pre-recorded Urdu audio for detected signs
- **Word mode** — switch between letter-by-letter and full-word detection
- **Adjustable speed** — tune detection cooldown from 300 ms to 3 seconds

### Learning Platform
- **Dashboard** — day streak tracker, weekly activity chart, signs-detected counter, recent history
- **Learn page** — browse all 37 PSL letters with hover-to-reveal sign images; quick quiz on PSL words
- **Live Learn** — real-time webcam practice with collapsible letter sidebar
- **Live Quiz** — timed quiz mode using the live camera
- **Dictionary** — searchable reference for all letters and words

### UI / UX
- **Light & dark mode** — persisted theme toggle across all pages
- **Collapsible sidebar** — fold to icon-only view; hover the hand logo to reveal the expand button
- **Fully responsive** — mobile-optimised layouts at 860 px and 560 px breakpoints
- **Design system** — custom `ls-*` CSS classes, green accent, display font, Urdu font support

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15 (App Router), TypeScript |
| Styling | Custom CSS design system (`globals.css`) |
| Backend | FastAPI, Python 3.9+ |
| ML / CV | MediaPipe, TensorFlow / Keras, scikit-learn, OpenCV |
| Speech | Pre-recorded Urdu MP3 audio + Web Speech API fallback |

---

## Project Structure

```
├── backend/
│   ├── main.py                        # FastAPI entry point
│   ├── routers/                       # API route handlers (capture, recognition)
│   ├── services/                      # Detection, capture, speech logic
│   ├── core/                          # Config & shared dependencies
│   ├── PSL/word_recognition/          # Word-level model helpers
│   ├── data/
│   │   ├── models/                    # Trained ML models (.h5, .pkl, scaler)
│   │   └── speech/                    # Urdu audio files (.mp3)
│   ├── Keypoints/                     # Captured keypoint JSON files
│   └── requirements.txt
│
└── frontend/
    └── app/
        ├── page.tsx                   # Landing / home page
        ├── layout.tsx                 # Root layout with sidebar shell
        ├── globals.css                # Full design system
        ├── sign/page.tsx              # Live detection page
        ├── dashboard/page.tsx         # Progress dashboard
        ├── learn/page.tsx             # Alphabet + quiz learning page
        ├── live-learn/page.tsx        # Webcam practice with letter panel
        ├── live-quiz/page.tsx         # Timed webcam quiz
        ├── dictionary/page.tsx        # PSL reference dictionary
        ├── lib/history.ts             # localStorage activity & streak logic
        └── components/ls/
            ├── Components.tsx         # AppShell, Sidebar, TopBar, shared UI
            └── Icons.tsx              # Icon library
```

---

## Getting Started

### Prerequisites

- Python 3.9+
- Node.js 18+
- A webcam

### 1. Clone the repository

```bash
git clone https://github.com/abdul-wahid-lab/fyp-project-Pakistan-sign-language-detection-system.git
cd fyp-project-Pakistan-sign-language-detection-system
```

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

Start the backend:

```bash
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

### 3. Set up the frontend

```bash
cd frontend
npm install
npm run dev
```

### 4. Open the app

Visit [http://localhost:3000](http://localhost:3000)

---

## How to Use

1. Open the app and navigate to **Sign Detector** from the sidebar
2. Click **Start Detection** and allow camera access
3. Make a PSL hand sign in front of your webcam
4. The detected letter appears in the **Detected Letter** panel
5. Click **Accept Letter** to add it to your current word
6. Click **Add Word to Sentence** when a word is complete
7. Use **Speak Sentence** to hear the output in Urdu
8. Adjust the **Detection Speed** slider as needed

To learn PSL signs, visit the **Learn** page — hover any letter card to see its hand sign image, or take the quick quiz on common words.

### Tips

- Use good lighting for best accuracy
- Keep your hand centered in the camera frame
- Enable **Word Mode** to detect full words directly
- Toggle **Enable Speech** to automatically speak each word as it's added

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/start-capture` | Open webcam and begin frame capture |
| `POST` | `/api/stop-capture` | Release webcam |
| `POST` | `/api/match` | Run detection on current frame, return label |
| `GET` | `/api/stream` | MJPEG live video stream |
| `GET` | `/audio/{word}.mp3` | Serve Urdu audio for a detected sign |

---

## Model Details

- **Architecture:** Dense neural network trained on MediaPipe hand keypoints
- **Input:** 63 keypoint values (21 landmarks × XYZ) per frame
- **Labels:** 37 PSL alphabet classes + 5 word classes
- **Training data:** Custom-collected PSL keypoint dataset with confusion-matrix-guided refinement

---

## License

Developed as a Final Year Project (FYP).

---

## Author

**Abdul Wahid** — [abdul-wahid-lab](https://github.com/abdul-wahid-lab)
