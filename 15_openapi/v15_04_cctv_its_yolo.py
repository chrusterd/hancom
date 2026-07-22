from ultralytics import YOLO
import cv2
from v15_03_cctv_its_def import its_cctv     # 앞서 만든 함수 가져오기

# 함수 한 줄로 URL 획득 → (왜?) STEP 02·03 코드 17줄이 이제 1줄로 압축
test_url = its_cctv(50)              # 50번 CCTV 선택, 다른 번호로 자유 변경

cap = cv2.VideoCapture(test_url)   # URL → 프레임 캡처 객체
model = YOLO("yolo11n.pt")           # 학습된 가중치 로드

while cap.isOpened():
    success, frame = cap.read()
    if not success:
        print("프레임 읽기 실패")
        break

    results = model(frame)             # 탐지 실행
    annotated = results[0].plot()        # 박스·라벨 그리기

    cv2.namedWindow("ITS_YOLO", cv2.WINDOW_AUTOSIZE)    # 창 크기 자동
    cv2.imshow("ITS_YOLO", annotated)

    if cv2.waitKey(1) & 0xFF == ord('q'):              # q → 종료
        break

cap.release()                # 스트림 해제 (필수)
cv2.destroyAllWindows()        # 창 모두 닫기