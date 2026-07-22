from ultralytics import solutions
import cv2
import os
from dotenv import load_dotenv

load_dotenv()

# 1. 비디오/스트림 경로 설정 (RTSP, 파일, 웹캠 모두 가능)
stream_url = "http://210.99.70.120:1935/live/cctv001.stream/playlist.m3u8"
cap = cv2.VideoCapture(stream_url)
assert cap.isOpened(), "스트림 열기 실패 — 경로/네트워크 확인"

# 2. 이메일 정보 설정 (Gmail 앱 비밀번호 사용, .env 에서 로드)
from_email = os.environ["GMAIL_FROM"]
password   = os.environ["GMAIL_APP_PASSWORD"]  # 일반 비밀번호 아님 (앱 비밀번호 전용)
to_email   = os.environ["GMAIL_TO"]

# 3. 모델 로드 및 알람 객체 생성
gmail_alarm = solutions.SecurityAlarm(
    model="yolo11n.pt",
    show=True,
    records=4,      # 동일 객체 N회 감지 시 1회 메일 (기본 5)
    classes=[2]     # 탐지 대상 클래스 (2 = 자동차)
)

# 4. SMTP 서버 인증 (1회만 실행 → 세션 유지)
gmail_alarm.authenticate(from_email, password, to_email)

# 5. 비디오 프레임 처리
while cap.isOpened():
    success, frame = cap.read()
    if not success:
        print("스트림 읽기 실패 . . .")
        break

    # 탐지 → 추적 → 임계치 도달 시 메일 발송 (내부 자동 처리)
    gmail_alarm(frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        print("q키를 눌러서 종료")
        break

# 6. 자원 해제
cap.release()
cv2.destroyAllWindows()