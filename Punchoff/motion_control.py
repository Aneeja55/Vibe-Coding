import cv2
import mediapipe as mp
import numpy as np
import time

mp_pose = mp.solutions.pose
pose = mp_pose.Pose()
mp_draw = mp.solutions.drawing_utils

# Store previous landmark positions to compute velocity
prev_positions = {}
last_detected = {"gesture": None, "time": 0}

# Constants
PUNCH_THRESHOLD = 60  # pixels/frame
BLOCK_Y_THRESHOLD = 0.4  # relative y position of wrists

def detect_gesture(landmarks, image_shape):
    global prev_positions, last_detected
    h, w = image_shape

    def get_point(idx):
        lm = landmarks[idx]
        return np.array([lm.x * w, lm.y * h])

    gestures = []

    # Get landmarks
    if all(i in range(len(landmarks)) for i in [11, 13, 15, 12, 14, 16]):
        right_wrist = get_point(16)
        right_elbow = get_point(14)
        right_shoulder = get_point(12)

        left_wrist = get_point(15)
        left_elbow = get_point(13)
        left_shoulder = get_point(11)

        # --- Detect Punch (Right/Left) ---
        for side, wrist, elbow in [("right", right_wrist, right_elbow), ("left", left_wrist, left_elbow)]:
            prev = prev_positions.get(side)
            prev_positions[side] = wrist

            if prev is not None:
                speed = np.linalg.norm(wrist - prev)
                direction = wrist - elbow

                if speed > PUNCH_THRESHOLD and direction[0] > 0:  # mostly forward
                    if time.time() - last_detected["time"] > 1:
                        last_detected["gesture"] = f"{side.upper()}_PUNCH"
                        last_detected["time"] = time.time()
                        gestures.append(f"{side.upper()}_PUNCH")

        # --- Detect Block ---
        avg_wrist_y = (left_wrist[1] + right_wrist[1]) / 2
        nose_y = landmarks[0].y * h
        if avg_wrist_y < nose_y + BLOCK_Y_THRESHOLD * h:
            if time.time() - last_detected["time"] > 1:
                last_detected["gesture"] = "BLOCK"
                last_detected["time"] = time.time()
                gestures.append("BLOCK")

    return gestures

def test_gesture():
    cap = cv2.VideoCapture(0)
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
        image_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        result = pose.process(image_rgb)

        if result.pose_landmarks:
            mp_draw.draw_landmarks(frame, result.pose_landmarks, mp_pose.POSE_CONNECTIONS)
            gestures = detect_gesture(result.pose_landmarks.landmark, frame.shape[:2])
            for gesture in gestures:
                cv2.putText(frame, f"Gesture: {gesture}", (30, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0,255,0), 2)

        cv2.imshow("Gesture Test - Q to Quit", frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    test_gesture()
