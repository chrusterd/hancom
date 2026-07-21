from ultralytics import solutions
import ssl, os
ssl._create_default_https_context = ssl._create_unverified_context
os.environ["CURL_CA_BUNDLE"] = ""
os.environ["REQUESTS_CA_BUNDLE"] = ""

# 1. 검색 앱 생성 — CPU에서 동작 (GPU면 "cuda")
app = solutions.SearchApp(
    # data="path/to/img/directory",  # 내 사진 폴더 (선택)
    device="cpu"
)

# 2. 웹 서버 실행 → 브라우저에서 자동 오픈
app.run(debug=True)   # 개발용 / 운영 시 False