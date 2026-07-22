from ultralytics import solutions
import cv2

# 1. 비디오 경로 설정 (CCTV 스트림)
cap = cv2.VideoCapture("http://210.99.70.120:1935/live/cctv013.stream/playlist.m3u8")

# 2. 카운팅 선 설정 (2점 — 시작점 → 끝점)
count_points = [(0, 440), (640, 350)]   # 좌하 → 우상 사선

# 3. 모델 로드 및 카운터 객체 생성
counter = solutions.ObjectCounter(
    model="yolo11n.pt",        # YOLO11 nano 모델 — 속도 우선
    show=True,                  # 결과 창 실시간 표시 (IN/OUT 라벨 포함)
    region=count_points         # 2점 리스트 → 가상 선 (4점 주면 RegionCounter 동작)
)

# 4. 프레임 처리
while cap.isOpened():
    success, frame = cap.read()
    if not success:
        print("프레임 읽기 실패")
        break

    # 4-1. 프레임 리사이즈 (선 좌표계와 일치 필수)
    re_frame = cv2.resize(frame, (640, 480))

    # 4-2. 탐지 + 트래킹 + 선 통과 판정 + IN/OUT 카운트 (한 줄에서 모두 처리)
    counter(re_frame)

    # 4-3. q 키로 종료
    # waitKey가 없으면 창이 갱신되지 않아 '응답 없음'이 되고 q로 끌 수도 없음
    if cv2.waitKey(1) & 0xFF == ord('q'):
        print("Q 키를 눌러서 종료")
        break

# 5. 자원 해제
cap.release()
cv2.destroyAllWindows()    # show=True로 열린 창 정리