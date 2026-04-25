"""
Convert an image dataset to the training database.

Folder structure expected:
    dataset_path/
        label_name/
            image1.jpg
            image2.jpg
            ...

Run from the backend/ directory:
    python images_to_db.py --dataset path/to/your/dataset
    python images_to_db.py --dataset path/to/your/dataset --clear
"""

import os
import sys
import math
import sqlite3
import argparse
import cv2
import mediapipe as mp

sys.path.insert(0, os.path.dirname(__file__))
import PSL.helper.scale as scale
import PSL.helper.move as move

mp_hands = mp.solutions.hands
DB_PATH = "data\\db\\main_dataset.db"


def extract_keypoints(image_path):
    """Run MediaPipe on one image, return flat [x1,y1,...,x21,y21] or None."""
    frame = cv2.imread(image_path)
    if frame is None:
        return None

    frame_h, frame_w = frame.shape[:2]
    rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

    with mp_hands.Hands(static_image_mode=True, max_num_hands=1,
                        min_detection_confidence=0.5) as hands:
        results = hands.process(rgb)

    if not results.multi_hand_landmarks:
        return None

    hand = results.multi_hand_landmarks[0]
    keypoints = []
    for lm in hand.landmark:
        keypoints.append(lm.x * frame_w)
        keypoints.append(lm.y * frame_h)

    return keypoints  # 42 values


def normalize_keypoints(keypoints):
    """Scale and center keypoints the same way the existing pipeline does."""
    p1 = [keypoints[0], keypoints[1]]
    p2 = [keypoints[18], keypoints[19]]
    distance = math.sqrt((p1[0] - p2[0]) ** 2 + (p1[1] - p2[1]) ** 2)

    if distance == 0:
        return None

    result, _ = scale.scalePoints(keypoints, distance)
    normalized, _ = move.centerPoints(result)
    return normalized


def ensure_table(conn):
    conn.execute("""
        CREATE TABLE IF NOT EXISTS rightHandDataset (
            id INTEGER PRIMARY KEY,
            x1 DOUBLE, y1 DOUBLE, x2 DOUBLE, y2 DOUBLE,
            x3 DOUBLE, y3 DOUBLE, x4 DOUBLE, y4 DOUBLE,
            x5 DOUBLE, y5 DOUBLE, x6 DOUBLE, y6 DOUBLE,
            x7 DOUBLE, y7 DOUBLE, x8 DOUBLE, y8 DOUBLE,
            x9 DOUBLE, y9 DOUBLE, x10 DOUBLE, y10 DOUBLE,
            x11 DOUBLE, y11 DOUBLE, x12 DOUBLE, y12 DOUBLE,
            x13 DOUBLE, y13 DOUBLE, x14 DOUBLE, y14 DOUBLE,
            x15 DOUBLE, y15 DOUBLE, x16 DOUBLE, y16 DOUBLE,
            x17 DOUBLE, y17 DOUBLE, x18 DOUBLE, y18 DOUBLE,
            x19 DOUBLE, y19 DOUBLE, x20 DOUBLE, y20 DOUBLE,
            x21 DOUBLE, y21 DOUBLE,
            label VARCHAR(30)
        )
    """)
    conn.commit()


def process_dataset(dataset_path, db_path, clear_existing):
    conn = sqlite3.connect(db_path)
    ensure_table(conn)

    if clear_existing:
        conn.execute("DELETE FROM rightHandDataset")
        conn.commit()
        print("Cleared existing records.")

    image_exts = {".jpg", ".jpeg", ".png", ".bmp"}
    total, inserted, skipped = 0, 0, 0

    for label_entry in sorted(os.scandir(dataset_path), key=lambda e: e.name):
        if not label_entry.is_dir():
            continue
        label = label_entry.name
        label_count = 0

        for img_entry in os.scandir(label_entry.path):
            if not img_entry.is_file():
                continue
            if os.path.splitext(img_entry.name)[1].lower() not in image_exts:
                continue

            total += 1
            kp = extract_keypoints(img_entry.path)
            if kp is None:
                skipped += 1
                continue

            norm = normalize_keypoints(kp)
            if norm is None:
                skipped += 1
                continue

            placeholders = ",".join(["?"] * 42)
            conn.execute(
                f"INSERT INTO rightHandDataset VALUES (NULL, {placeholders}, ?)",
                norm[:42] + [label]
            )
            label_count += 1
            inserted += 1

        print(f"  {label}: {label_count} images inserted")

    conn.commit()
    conn.close()
    print(f"\nDone. {inserted}/{total} inserted, {skipped} skipped (no hand detected).")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--dataset", default="C:\\path\\to\\your\\dataset",
                        help="Path to image dataset (subfolders = labels)")
    parser.add_argument("--db", default=DB_PATH,
                        help=f"SQLite database path (default: {DB_PATH})")
    parser.add_argument("--clear", action="store_true",
                        help="Delete existing records before inserting")
    args = parser.parse_args()

    process_dataset(args.dataset, args.db, args.clear)
