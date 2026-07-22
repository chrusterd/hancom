from ultralytics import solutions
import cv2

# 1. 비디오 경로 설정 (CCTV 스트림)
cap = cv2.VideoCapture("http://210.99.70.120:1935/live/cctv013.stream/playlist.m3u8")

# 2. 구역 좌표 설정 (dict 형식 — 키로 영역 구분)
region_points = {
    "region-01": [(192, 175), (180, 410), (439, 386), (273, 168)],
    "region-02": [(408, 429), (217, 427), (116, 256), (196, 145), (349, 125), (512, 181), (539, 314)]
}

# 3. 모델 로드 및 구역 객체 생성
yolo_region = solutions.RegionCounter(
    model="yolo11n.pt",
    show=True,
    region=region_points,
    conf=0.1            # 낮은 임계값 — CCTV 저화질 대응
)

# 4. 프레임 처리
while cap.isOpened():
    success, frame = cap.read()
    if not success:
        print("프레임 읽기 실패")
        break

    # 4-1. 프레임 크기 조정 (좌표계 통일)
    re_frame = cv2.resize(frame, (640, 480))

    # 4-2. 구역 내 객체 수 계산
    yolo_region(re_frame)

    # 4-3. q키를 눌러서 종료
    if cv2.waitKey(1) & 0xFF == ord('q'):
        print("q 키를 눌러서 종료")
        break

# 5. 자원 해제
cap.release()
cv2.destroyAllWindows()