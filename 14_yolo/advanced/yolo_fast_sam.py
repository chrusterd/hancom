from ultralytics import FastSAM
import cv2
import ssl, os
ssl._create_default_https_context = ssl._create_unverified_context
os.environ["CURL_CA_BUNDLE"] = ""
os.environ["REQUESTS_CA_BUNDLE"] = ""

# 1. 입력 이미지 경로 지정
source = "./yolo_fast_sam_1.jpg"

# 2. FastSAM 소형 모델 로드 (s = small, 가장 가벼움)
model = FastSAM("FastSAM-s.pt")

# 3. 텍스트 프롬프트로 "강아지"만 골라서 세그먼트
results = model(source, texts="dog")

# 4. 결과 마스크를 원본 위에 그려서 이미지로 만들기
output_path = "output_result_1.jpg"
output_image = results[0].plot()   # 마스크가 합성된 numpy 이미지 배열

# 5. 결과 저장
cv2.imwrite(output_path, output_image)

# output_image는 이미지 '배열'이라 그대로 출력하면 숫자가 수천 줄 쏟아짐 → 경로를 출력
print(f"결과 이미지가 저장 됐습니다. {output_path}")