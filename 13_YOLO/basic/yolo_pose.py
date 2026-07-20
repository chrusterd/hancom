from ultralytics import YOLO
import cv2


# 1. 모델 로드
model = YOLO("yolo11n-pose.pt")

# 2. 모델 추론
results = model("input_pose1.jpg")

# 3. 결과 시각화
result_image = results[0].plot()

# 4. 결과 이미지 저장
output_image_path = "./result_pose1.jpg"
cv2.imwrite(output_image_path, result_image)
print(f"저장되었습니다. {output_image_path}")