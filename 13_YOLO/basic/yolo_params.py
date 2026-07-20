from ultralytics import YOLO
import cv2

# 1. 모델 로드
model = YOLO("yolo11n.pt")

# 2. 모델 파라미터
model(
    "input_params.jpg", # 추론할 이미지 경로
    save=True,
    # conf=0.5 # 이 이상의 신뢰도만 보이게
    # max_det=3 # 신뢰도 상위 3개까지
    # save_crop=True # 탐지된 객체별 폴더 생성
    # save_txt=True # 탐지된 좌표값 텍스트 파일로 만들기
    # save_conf=True # 이미지에 신뢰도 표시. default 상태
    classes=[60, 75],
)