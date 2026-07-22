# import urllib.request   # 인터넷 주소로 자료 요청하는 도구
# import ssl               # SSL 연결 방식 조정하는 도구 (인증서 문제 우회용)
import os                # 환경 변수 읽는 도구
import requests          # 인터넷 주소로 자료 요청하는 도구
import json              # 글자로 된 자료를 사전(dict) 모양으로 바꾸는 도구
import pandas as pd      # 자료를 엑셀 같은 표로 다루는 도구
from dotenv import load_dotenv   # .env 파일 읽는 도구

load_dotenv()

# 1. 인증 키 → 정부 사이트에서 받은 "비밀 번호", 이게 있어야 자료 줌 (.env 에서 로드)
key = os.getenv("ITS_API_KEY")

# 2. 도로 유형 (its=일반도로, ex=고속도로) → 어느 도로 CCTV 가져올지 선택
Type = "its"

# 3. 관심 영역 (경도·위도 범위) → 지도 위에 사각형 그려서 그 안 CCTV만 요청
minX, maxX = 120.95, 127.02   # 동서(가로) 범위 → 한국 전체 가로
minY, maxY = 30.55, 37.69     # 남북(세로) 범위 → 한국 전체 세로
getType = "json"              # 응답 형식 → JSON(글자로 정리된 자료)

# 4. API URL 조립 → 위 정보를 모두 합쳐서 "자료 요청 주소" 한 줄로 만듦
url_cctv = (
    f"https://openapi.its.go.kr:9443/cctvInfo"
    f"?apiKey={key}&type={Type}&cctvType=1"
    f"&minX={minX}&maxX={maxX}"
    f"&minY={minY}&maxY={maxY}&getType={getType}"
)

# 5. 요청 → 응답 : 만든 주소로 "자료 주세요" 보내고 봉투(response) 받음
#    (왜 SSL 컨텍스트?) 이 서버 인증서가 urllib 기본 검증 방식과 안 맞아
#                       ASN1 NOT_ENOUGH_DATA 에러 남 → 검증 완화해서 우회 시도했으나
#                       핸드셰이크 자체가 깨져서 urllib로는 해결 안 됨
# context = ssl.create_default_context()
# context.check_hostname = False
# context.verify_mode = ssl.CERT_NONE
# response = urllib.request.urlopen(url_cctv, context=context)
response = requests.get(url_cctv)

# 6. bytes → str → dict : 봉투 뜯기 (왜 두 번 변환?)
#    (왜 디코딩?) 서버는 인터넷 전송용 bytes(0·1 묶음)로 보냄
#                 → 사람·파이썬이 읽으려면 한글 str(글자)로 풀어야 함
#    (왜 JSON 파싱?) str은 글자 덩어리일 뿐 → 값 꺼내려면
#                    dict(파이썬 사전) 형태여야 ["키"]로 접근 가능
# json_str = response.read().decode("utf-8")   # bytes → str (사람 글자)
# json_object = json.loads(json_str)            # str → dict (사전 모양)
json_object = response.json()   # bytes → str → dict 자동 처리 (requests가 알아서 함)


# 7. 데이터프레임 변환 → 사전(dict)이 중첩되어 깊이 들어가기 번거로움
#    → 평평한 표(DataFrame)로 펴서 한눈에 보고 행/열 인덱싱
cctv_play = pd.json_normalize(
    json_object["response"]["data"], sep=''
)

# 8. 77번 CCTV URL 출력 → 표에서 77번째 줄 CCTV 영상 주소 꺼내 화면에 보여줌
test_url = cctv_play["cctvurl"][77]
print(f"선택된 CCTV URL : {test_url}")