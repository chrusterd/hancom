import os
import requests


def download_file(url, save_path):
    # 이미 다운로드된 파일이면 중복 다운로드 방지
    if os.path.exists(save_path):
        return
    # 저장 폴더 없으면 생성
    os.makedirs(os.path.dirname(save_path), exist_ok=True)
    # URL에서 데이터 요청
    response = requests.get(url)
    # 응답 코드 4xx/5xx면 예외 발생
    response.raise_for_status()
    # 바이너리 모드로 파일 저장 (이미지 데이터)
    with open(save_path, "wb") as f:
        f.write(response.content)


# 작은 차량 이미지 (멀리서 찍은 도로)
download_file(
    "https://raw.githubusercontent.com/obss/sahi/main/demo/demo_data/small-vehicles1.jpeg",
    "demo_data/small-vehicles1.jpeg",
)

# 항공 촬영 지형 이미지
download_file(
    "https://raw.githubusercontent.com/obss/sahi/main/demo/demo_data/terrain2.png",
    "demo_data/terrain2.png",
)