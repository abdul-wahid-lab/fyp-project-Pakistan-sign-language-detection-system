"""
Run this once from inside the backend/ directory:
    cd backend
    python convert_models.py

Outputs (copy to linguasign_mobile/assets/models/):
    data/models/alphabet_model.tflite
    data/models/word_model.tflite
    data/models/alphabet_scaler.json
    data/models/word_scaler.json
    data/models/alphabet_labels.json
    data/models/word_labels.json
"""

import json
import pickle
import numpy as np
import tensorflow as tf

# ── helpers ────────────────────────────────────────────────────────────────────

def h5_to_tflite(h5_path: str, tflite_path: str):
    model = tf.keras.models.load_model(h5_path)
    converter = tf.lite.TFLiteConverter.from_keras_model(model)
    converter.optimizations = [tf.lite.Optimize.DEFAULT]   # float16 quantisation
    tflite_model = converter.convert()
    with open(tflite_path, "wb") as f:
        f.write(tflite_model)
    print(f"  saved {tflite_path}  ({len(tflite_model)//1024} KB)")


def export_scaler(pkl_path: str, json_path: str):
    scaler = pickle.load(open(pkl_path, "rb"))
    data = {
        "mean":  scaler.mean_.tolist(),
        "scale": scaler.scale_.tolist(),
    }
    with open(json_path, "w") as f:
        json.dump(data, f)
    print(f"  saved {json_path}")


def export_labels(pkl_path: str, json_path: str):
    le = pickle.load(open(pkl_path, "rb"))
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(le.classes_.tolist(), f, ensure_ascii=False)
    print(f"  saved {json_path}  ({len(le.classes_)} classes)")


# ── alphabet ───────────────────────────────────────────────────────────────────
print("\n── Alphabet model ──")
h5_to_tflite(
    "data/models/alphabet_model.h5",
    "data/models/alphabet_model.tflite",
)
export_scaler(
    "data/models/alphabet_scaler.pkl",
    "data/models/alphabet_scaler.json",
)
export_labels(
    "data/models/alphabet_label_encoder.pkl",
    "data/models/alphabet_labels.json",
)

# ── word ───────────────────────────────────────────────────────────────────────
print("\n── Word model ──")
h5_to_tflite(
    "data/models/word_model.h5",
    "data/models/word_model.tflite",
)
export_scaler(
    "data/models/word_scaler.pkl",
    "data/models/word_scaler.json",
)
export_labels(
    "data/models/word_label_encoder.pkl",
    "data/models/word_labels.json",
)

print("\nDone. Copy the 6 output files to linguasign_mobile/assets/models/")
