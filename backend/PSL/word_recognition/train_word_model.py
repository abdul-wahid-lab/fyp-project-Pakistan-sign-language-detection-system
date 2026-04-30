# -*- coding: utf-8 -*-
"""
Train word recognition model from wordDataset in main_dataset.db.
Uses the same pipeline as the alphabet model (right hand, 42 features).
Run from backend/ directory:
    python -m PSL.word_recognition.train_word_model
"""

import sys
import pickle
import sqlite3
import numpy as np

from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.model_selection import train_test_split
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout
from tensorflow.keras.utils import to_categorical

DB_PATH    = "data/db/main_dataset.db"
MODEL_OUT  = "data/models/word_model.h5"
SCALER_OUT = "data/models/word_scaler.pkl"
LE_OUT     = "data/models/word_label_encoder.pkl"


def load_dataset(word_labels):
    conn = sqlite3.connect(DB_PATH)
    cur  = conn.cursor()

    cols = [f"x{i}" for i in range(1, 22)] + [f"y{i}" for i in range(1, 22)]
    placeholders = ",".join(["?"] * len(word_labels))
    sql = f"SELECT {','.join(cols)}, label FROM rightHandDataset WHERE label IN ({placeholders})"
    cur.execute(sql, word_labels)
    rows = cur.fetchall()
    conn.close()

    X = np.array([list(r[:-1]) for r in rows], dtype=np.float32)
    y = np.array([r[-1] for r in rows])
    return X, y


def build_model(input_dim, num_classes):
    model = Sequential([
        Dense(256, activation="relu", input_shape=(input_dim,)),
        Dropout(0.3),
        Dense(128, activation="relu"),
        Dropout(0.3),
        Dense(64, activation="relu"),
        Dense(num_classes, activation="softmax"),
    ])
    model.compile(optimizer="adam", loss="categorical_crossentropy", metrics=["accuracy"])
    return model


def main():
    import argparse
    import os
    parser = argparse.ArgumentParser()
    parser.add_argument("dataset_root", help="Path to the word image dataset root (same folder used for insertion)")
    args = parser.parse_args()

    word_labels = [
        d for d in os.listdir(args.dataset_root)
        if os.path.isdir(os.path.join(args.dataset_root, d))
    ]
    if not word_labels:
        print("No label folders found in dataset root.")
        sys.exit(1)
    print(f"Word labels: {word_labels}")

    print("Loading dataset from DB...")
    X, y_raw = load_dataset(word_labels)
    if len(X) == 0:
        print("No samples found in rightHandDataset for these labels.")
        sys.exit(1)

    print(f"Total samples: {len(X)}  Features: {X.shape[1]}")

    le = LabelEncoder()
    y_enc = le.fit_transform(y_raw)
    y_cat = to_categorical(y_enc)
    num_classes = len(le.classes_)
    print(f"Classes ({num_classes}): {list(le.classes_)}")

    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    X_train, X_test, y_train, y_test = train_test_split(
        X_scaled, y_cat, test_size=0.2, random_state=42, stratify=y_enc
    )

    print("\nTraining model...")
    model = build_model(X.shape[1], num_classes)
    model.fit(X_train, y_train, epochs=50, batch_size=32,
              validation_data=(X_test, y_test), verbose=1)

    loss, acc = model.evaluate(X_test, y_test, verbose=0)
    print(f"\nTest accuracy: {acc*100:.2f}%")

    model.save(MODEL_OUT)
    pickle.dump(scaler, open(SCALER_OUT, "wb"))
    pickle.dump(le, open(LE_OUT, "wb"))
    print(f"\nSaved:\n  {MODEL_OUT}\n  {SCALER_OUT}\n  {LE_OUT}")


if __name__ == "__main__":
    main()
