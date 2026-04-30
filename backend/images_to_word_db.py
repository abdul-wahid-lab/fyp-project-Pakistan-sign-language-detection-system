# -*- coding: utf-8 -*-
"""
Process a word image dataset and insert normalized keypoints into poseDataset.

Dataset structure expected:
    <dataset_root>/
        <word_label>/
            image1.jpg
            image2.jpg
            ...

Run from backend/ directory:
    python images_to_word_db.py <path_to_dataset_root>

Example:
    python images_to_word_db.py D:/my_word_dataset
"""

import os
import sys
import math
import sqlite3
import cv2
import mediapipe as mp

import PSL.helper.helperFunc as helper
import PSL.helper.scale as scale
import PSL.helper.normalize as norm

DB_PATH = "data/db/main_dataset.db"

mp_holistic = mp.solutions.holistic

POSE_MAP = [
    (0, None), (11, 12), (12, None), (14, None), (16, None),
    (11, None), (13, None), (15, None), (23, 24), (24, None),
    (26, None), (28, None), (23, None), (25, None), (27, None),
    (5, None),  (2, None), (8, None),  (7, None),
]


def get_pose_kp(pose_landmarks, w, h):
    if pose_landmarks is None:
        return [0.0] * 57
    lm = pose_landmarks.landmark
    result = []
    for idx_a, idx_b in POSE_MAP:
        if idx_b is None:
            p = lm[idx_a]
            x, y, c = p.x * w, p.y * h, p.visibility
        else:
            pa, pb = lm[idx_a], lm[idx_b]
            x = ((pa.x + pb.x) / 2) * w
            y = ((pa.y + pb.y) / 2) * h
            c = (pa.visibility + pb.visibility) / 2
        result.extend([x, y, c])
    return result


def get_hand_kp(hand_landmarks, w, h):
    if hand_landmarks is None:
        return [0.0] * 63
    result = []
    for lm in hand_landmarks.landmark:
        result.extend([lm.x * w, lm.y * h, 1.0])
    return result


def extract_features(image_path, holistic):
    img = cv2.imread(image_path)
    if img is None:
        return None
    h, w = img.shape[:2]
    rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    results = holistic.process(rgb)

    pose_kp  = get_pose_kp(results.pose_landmarks, w, h)
    rhand_kp = get_hand_kp(results.right_hand_landmarks, w, h)
    lhand_kp = get_hand_kp(results.left_hand_landmarks, w, h)

    # Confidence check
    r_conf = sum(rhand_kp[i] for i in range(2, len(rhand_kp), 3))
    l_conf = sum(lhand_kp[i] for i in range(2, len(lhand_kp), 3))

    if r_conf <= 12:
        return None
    if not (l_conf > 12 or l_conf < 2):
        return None

    # Normalize pose
    pose_points = helper.removePoints(pose_kp)
    p1 = [pose_points[0], pose_points[1]]
    p2 = [pose_points[2], pose_points[3]]
    distance = math.sqrt((p1[0]-p2[0])**2 + (p1[1]-p2[1])**2)
    if distance == 0:
        return None
    scaled_results, _ = norm.scaleBody(pose_points, distance)
    poseResults, _    = norm.moveBody(scaled_results)

    # Normalize right hand
    hand_right_points = helper.removePoints(rhand_kp)
    p1 = [hand_right_points[0], hand_right_points[1]]
    p2 = [hand_right_points[18], hand_right_points[19]]
    distance = math.sqrt((p1[0]-p2[0])**2 + (p1[1]-p2[1])**2)
    if distance == 0:
        return None
    RightResult, _ = scale.scalePoints(hand_right_points, distance)
    handRightResults, _ = norm.move_to_wrist(RightResult, poseResults[8], poseResults[9])

    # Normalize left hand
    if l_conf > 3:
        hand_left_points = helper.removePoints(lhand_kp)
        p1 = [hand_left_points[0], hand_left_points[1]]
        p2 = [hand_left_points[18], hand_left_points[19]]
        distance = math.sqrt((p1[0]-p2[0])**2 + (p1[1]-p2[1])**2)
        if distance != 0:
            LeftResult, _ = scale.scalePoints(hand_left_points, distance)
            handLeftResults, _ = norm.move_to_wrist(LeftResult, poseResults[14], poseResults[15])
        else:
            handLeftResults, _ = norm.move_to_wrist(hand_left_points, poseResults[14], poseResults[15])
    else:
        handLeftResults = [0.0] * 42

    posePoints = []
    for x in range(18):
        posePoints.append(poseResults[x])
    for x in range(30, 38):
        posePoints.append(poseResults[x])

    return handRightResults, handLeftResults, posePoints


def build_insert_sql():
    r_cols = [f"Rx{i}" for i in range(1, 22)] + [f"Ry{i}" for i in range(1, 22)]
    l_cols = [f"Lx{i}" for i in range(1, 22)] + [f"Ly{i}" for i in range(1, 22)]
    p_cols = [f"Px{i}" for i in range(1, 14)] + [f"Py{i}" for i in range(1, 14)]
    all_cols = r_cols + l_cols + p_cols + ["label"]
    placeholders = ",".join(["?"] * len(all_cols))
    return f"INSERT INTO poseDataset ({','.join(all_cols)}) VALUES ({placeholders})"


def cols_to_row(handR, handL, pose, label):
    # handR = [x1,y1, x2,y2, ..., x21,y21] = 42 values
    Rx = handR[0::2]  # x values
    Ry = handR[1::2]  # y values
    Lx = handL[0::2]
    Ly = handL[1::2]
    # pose = 26 values (13 keypoints as x,y)
    Px = pose[0::2]
    Py = pose[1::2]
    return Rx + Ry + Lx + Ly + Px + Py + [label]


def main():
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("dataset_root", help="Path to image dataset root folder")
    parser.add_argument("--clear", action="store_true", help="Delete existing poseDataset rows before inserting")
    args = parser.parse_args()

    if not os.path.isdir(args.dataset_root):
        print(f"ERROR: '{args.dataset_root}' is not a valid directory.")
        sys.exit(1)

    dataset_root = args.dataset_root
    conn = sqlite3.connect(DB_PATH)
    cur  = conn.cursor()

    if args.clear:
        cur.execute("DELETE FROM poseDataset")
        conn.commit()
        print("Cleared existing poseDataset rows.")

    sql  = build_insert_sql()

    IMAGE_EXTS = {".jpg", ".jpeg", ".png", ".bmp", ".webp"}
    total_inserted = 0
    total_skipped  = 0

    with mp_holistic.Holistic(
        static_image_mode=True,
        min_detection_confidence=0.5
    ) as holistic:
        for label in sorted(os.listdir(dataset_root)):
            label_dir = os.path.join(dataset_root, label)
            if not os.path.isdir(label_dir):
                continue

            inserted = skipped = 0
            for fname in os.listdir(label_dir):
                if os.path.splitext(fname)[1].lower() not in IMAGE_EXTS:
                    continue
                img_path = os.path.join(label_dir, fname)
                feats = extract_features(img_path, holistic)
                if feats is None:
                    skipped += 1
                    continue
                handR, handL, pose = feats
                row = cols_to_row(handR, handL, pose, label)
                cur.execute(sql, row)
                inserted += 1

            conn.commit()
            print(f"  {label}: {inserted} inserted, {skipped} skipped (low confidence)")
            total_inserted += inserted
            total_skipped  += skipped

    conn.close()
    print(f"\nDone. Total inserted: {total_inserted}, skipped: {total_skipped}")
    print(f"Now run: python -m PSL.word_recognition.train_word_model")


if __name__ == "__main__":
    main()
