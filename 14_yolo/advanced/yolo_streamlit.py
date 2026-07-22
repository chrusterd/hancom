from ultralytics import solutions

# 1. Streamlit 추론 인스턴스 생성
inf = solutions.Inference(model="yolo11n.pt")

# 2. 웹 UI 시작 (브라우저 자동 오픈)
inf.inference()