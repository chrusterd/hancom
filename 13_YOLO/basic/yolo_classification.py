from ultralytics import YOLO
import cv2

# 1. 모델 로드
model = YOLO("yolo11n-cls.pt")

# 2. 모델 추론
results = model("./input2.jpg")

# 3. 결과 시각화
result_image = results[0].plot()

# 4. 결과 이미지 저장
output_image_path = "./result2.jpg"
cv2.imwrite(output_image_path, result_image)
print(f"사진이 잘 저장되었습니다. => {output_image_path}")