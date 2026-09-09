import cv2
import mediapipe as mp
import json
import os
import time
import threading

mp_holistic = mp.solutions.holistic
mp_drawing = mp.solutions.drawing_utils
mp_drawing_styles = mp.solutions.drawing_styles

_latest_frame = None
_frame_lock = threading.Lock()

_POSE_MAP = [
    (0, None),
    (11, 12),
    (12, None),
    (14, None),
    (16, None),
    (11, None),
    (13, None),
    (15, None),
    (23, 24),
    (24, None),
    (26, None),
    (28, None),
    (23, None),
    (25, None),
    (27, None),
    (5,  None),
    (2,  None),
    (8,  None),
    (7,  None),
]


def _get_pose_keypoints(pose_landmarks, frame_w, frame_h):
    if pose_landmarks is None:
        return [0.0] * 57

    lm = pose_landmarks.landmark
    result = []

    for idx_a, idx_b in _POSE_MAP:
        if idx_b is None:
            p = lm[idx_a]
            x = p.x * frame_w
            y = p.y * frame_h
            c = p.visibility
        else:
            pa = lm[idx_a]
            pb = lm[idx_b]
            x = ((pa.x + pb.x) / 2) * frame_w
            y = ((pa.y + pb.y) / 2) * frame_h
            c = (pa.visibility + pb.visibility) / 2
        result.extend([x, y, c])

    return result


def _get_hand_keypoints(hand_landmarks, frame_w, frame_h):
    if hand_landmarks is None:
        return [0.0] * 63

    result = []
    for lm in hand_landmarks.landmark:
        result.extend([lm.x * frame_w, lm.y * frame_h, 1.0])
    return result


def _save_keypoints_json(pose_kp, hand_right_kp, hand_left_kp, output_path):
    data = {
        "version": 1.3,
        "people": [
            {
                "person_id": [-1],
                "pose_keypoints_2d": pose_kp,
                "face_keypoints_2d": [],
                "hand_left_keypoints_2d": hand_left_kp,
                "hand_right_keypoints_2d": hand_right_kp,
                "pose_keypoints_3d": [],
                "face_keypoints_3d": [],
                "hand_left_keypoints_3d": [],
                "hand_right_keypoints_3d": []
            }
        ]
    }
    with open(output_path, 'w') as f:
        json.dump(data, f)


def _capture_loop(output_dir, stop_event, camera_index=0):
    cap = cv2.VideoCapture(camera_index)
    if not cap.isOpened():
        print('ERROR: Cannot open camera', camera_index)
        return

    frame_count = 1

    with mp_holistic.Holistic(
        min_detection_confidence=0.5,
        min_tracking_confidence=0.5
    ) as holistic:
        while not stop_event.is_set():
            ret, frame = cap.read()
            if not ret:
                time.sleep(0.01)
                continue

            frame_h, frame_w = frame.shape[:2]
            rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            results = holistic.process(rgb)

            pose_kp = _get_pose_keypoints(results.pose_landmarks, frame_w, frame_h)
            hand_right_kp = _get_hand_keypoints(results.right_hand_landmarks, frame_w, frame_h)
            hand_left_kp = _get_hand_keypoints(results.left_hand_landmarks, frame_w, frame_h)

            filename = f'{frame_count:012d}_keypoints.json'
            _save_keypoints_json(pose_kp, hand_right_kp, hand_left_kp,
                                 os.path.join(output_dir, filename))
            frame_count += 1

            annotated = frame.copy()
            if results.pose_landmarks:
                mp_drawing.draw_landmarks(
                    annotated, results.pose_landmarks,
                    mp_holistic.POSE_CONNECTIONS,
                    landmark_drawing_spec=mp_drawing_styles.get_default_pose_landmarks_style()
                )
            if results.left_hand_landmarks:
                mp_drawing.draw_landmarks(
                    annotated, results.left_hand_landmarks,
                    mp_holistic.HAND_CONNECTIONS,
                    mp_drawing.DrawingSpec(color=(121, 22, 76), thickness=2, circle_radius=4),
                    mp_drawing.DrawingSpec(color=(121, 44, 250), thickness=2, circle_radius=2),
                )
            if results.right_hand_landmarks:
                mp_drawing.draw_landmarks(
                    annotated, results.right_hand_landmarks,
                    mp_holistic.HAND_CONNECTIONS,
                    mp_drawing.DrawingSpec(color=(245, 117, 66), thickness=2, circle_radius=4),
                    mp_drawing.DrawingSpec(color=(245, 66, 230), thickness=2, circle_radius=2),
                )

            _, jpeg = cv2.imencode('.jpg', annotated, [cv2.IMWRITE_JPEG_QUALITY, 70])
            global _latest_frame
            with _frame_lock:
                _latest_frame = jpeg.tobytes()

            time.sleep(0.05)

    cap.release()
    with _frame_lock:
        _latest_frame = None


_capture_thread = None
_stop_event = None


def start_capture(output_dir='Keypoints', camera_index=0):
    global _capture_thread, _stop_event
    stop_capture()
    os.makedirs(output_dir, exist_ok=True)
    _stop_event = threading.Event()
    _capture_thread = threading.Thread(
        target=_capture_loop,
        args=(output_dir, _stop_event, camera_index),
        daemon=True
    )
    _capture_thread.start()
    print('MediaPipe capture started, writing to', output_dir)


def stop_capture():
    global _capture_thread, _stop_event
    if _stop_event:
        _stop_event.set()
    if _capture_thread:
        _capture_thread.join(timeout=3)
    _capture_thread = None
    _stop_event = None
    print('MediaPipe capture stopped')
