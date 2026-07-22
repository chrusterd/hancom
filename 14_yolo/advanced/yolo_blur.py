from ultralytics import solutions
import cv2

# 1. 비디오 경로 설정 (0 = 웹캠, 파일 경로·RTSP도 가능)
cap = cv2.VideoCapture(0)

# 2. 모델 로드 + 블러 객체 생성
blurrer = solutions.ObjectBlurrer(
    model="yolo11n.pt",
    show=True,
    blur_ratio=1.0,     # 블러 강도 (0.0~1.0, 높을수록 더 흐림)
    classes=[0]
)

# 3. 비디오 프레임 처리
while cap.isOpened():
    success, frame = cap.read()
    if not success:
        print("웹캠 읽기 실패")
        break

    # 3-1. 탐지 → 박스 영역 자동 블러 (show=True면 내부에서 창까지 표시)
    frame = cv2.flip(frame, 1)   # 좌우반전 먼저
    blurrer(frame)  # 반전된 frame으로 탐지+블러+표시

    # 3-2. q 키로 종료
    # waitKey가 없으면 창이 갱신되지 않아 '응답 없음'이 되고 q로 끌 수도 없음
    if cv2.waitKey(1) & 0xFF == ord('q'):
        print("q키를 눌러서 종료")
        break

# 4. 자원 해제
cap.release()
cv2.destroyAllWindows()    # show=True로 열린 창 정리