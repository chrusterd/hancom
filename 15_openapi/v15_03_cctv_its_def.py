# import urllib.request, json
import os
import requests
import pandas as pd
from dotenv import load_dotenv

load_dotenv()

# (왜 함수화?) STEP 02 코드 한 덩어리 → 매번 복붙 비효율
#              함수로 묶으면 다른 파일에서 1줄로 재사용, 입력값(인덱스)만 바꿔 호출
def its_cctv(cctv_index=77):     # 매개변수 기본값 77 → 안 넣어도 동작
    key = os.getenv("ITS_API_KEY")
    Type, getType = "its", "json"
    minX, maxX, minY, maxY = 120.95, 127.02, 30.55, 37.69

    url_cctv = (
        f"https://openapi.its.go.kr:9443/cctvInfo"
        f"?apiKey={key}&type={Type}&cctvType=1"
        f"&minX={minX}&maxX={maxX}"
        f"&minY={minY}&maxY={maxY}&getType={getType}"
    )
    # response = urllib.request.urlopen(url_cctv)
    # json_object = json.loads(response.read().decode("utf-8"))
    response = requests.get(url_cctv)
    json_object = response.json()
    cctv_play = pd.json_normalize(
        json_object["response"]["data"], sep=''
    )
    test_url = cctv_play["cctvurl"][cctv_index]
    print(f"선택된 CCTV URL : {test_url},  CCTV 번호 : {cctv_index}")
    return test_url      # 함수 결과 → 호출한 쪽이 받아 사용