import cv2
from ultralytics import solutions

# 1. 비디오 경로 설정 (공공 CCTV HLS 스트림)
cap = cv2.VideoCapture("http://210.99.70.120:1935/live/cctv013.stream/playlist.m3u8")

# 2. 속도 추정 객체 생성 및 모델 로드
yolo_speed = solutions.SpeedEstimator(
    model="yolo11n.pt",            # 사용할 YOLO 모델 파일
    show=True,                     # 결과 화면 실시간 표시
    max_speed=120,                 # 최대 속도 상한 (km/h) — 상한 초과값은 표시 안 됨
    meter_per_pixel=0.15,           # 픽셀 1개 = 실제 0.5m (환경별 직접 보정 필수)
    classes=[2, 5, 7],                   # COCO class 2 = car (차량만 추적)
    line_width=2                   # 바운딩 박스 선 두께
)

# 3. 프레임 처리 루프
while cap.isOpened():
    success, frame = cap.read()                # 한 프레임 읽기
    if not success:
        print("프레임 읽기 실패")
        break

    # 3-1. 속도 계산 및 추적 수행 (프레임 입력 → 속도 표시 영상 출력)
    yolo_speed(frame)

    # 3-2. q 키 입력 시 종료
    if cv2.waitKey(5) & 0xFF == ord('q'):
        print("q 키를 눌러서 종료합니다.")
        break

# 4. 자원 해제
cap.release()