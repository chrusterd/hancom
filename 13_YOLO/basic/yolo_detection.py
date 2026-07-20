from ultralytics import YOLO
import cv2

# 1. 모델 로드
model = YOLO("yolo11n.pt")

# 2. 모델 추론
results = model("input_det4.jpg")

# 3. 결과 시각화
results_image = results[0].plot()

# 4. 결과 이미지 저장
output_image_path = "./result_det4.jpg"
cv2.imwrite(output_image_path, results_image)