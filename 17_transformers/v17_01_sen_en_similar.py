# 1. 라이브러리 불러오기
from sentence_transformers import SentenceTransformer, util
# SentenceTransformer → 사전 학습 임베딩 모델 로더 클래스
# util               → 코사인 유사도·검색 등 보조 함수 묶음

# 2. 사전 학습 모델 로드
# (왜) 임베딩 모델을 직접 학습하려면 대용량 코퍼스·GPU·수일이 필요 → HF에 공개된 가중치 재사용
# (어떻게) 최초 호출 시 ~/.cache/torch/sentence_transformers/ 에 다운로드 후 재사용
model = SentenceTransformer("all-MiniLM-L6-v2")
"""
all-MiniLM-L6-v2 모델 설명
 - 경량 6레이어 트랜스포머, 384차원 벡터 출력
 - 영어 문장을 의미 공간에 매핑 (방향이 곧 의미)
 - 특징
   1. 빠른 연산 속도 (CPU·모바일 가능)
   2. 의미 보존력 우수 (어순 변화에 강건)
   3. 검색·추천·중복 탐지·클러스터링에 표준 모델
"""

# 3. 비교할 두 문장 정의
# 의미상 완전히 다른 문장 예시 → 낮은 유사도 기대
# sen1 = "The cat is sleeping on the sofa"
# sen2 = "Tomorrow, I have a math exam at school"

# 어순만 다르고 의미가 같은 문장 → 높은 유사도 기대
sen1 = "He was reading a book in the library on Monday, Tuesday and Wednesday."
sen2 = "He was at the library reading a book on Sunday, Thursday, Friday and Saturday."

# 4. 문장 → 숫자 좌표로 바꾸기 (인코딩)
# (쉽게) 문장 한 개를 숫자 384개로 표현 → 의미가 비슷하면 숫자 묶음도 비슷한 모양
# 컴퓨터는 글자보다 숫자를 잘 이해 → 비교·계산하려면 먼저 숫자로 변환 필수
emb1 = model.encode(sen1, convert_to_tensor=True)  # 결과를 Tensor(파이토치 숫자 상자)로 받기
emb2 = model.encode(sen2, convert_to_tensor=True)
# emb1 모양 = 숫자 384개짜리 리스트 (문장 하나 = 384차원 공간의 점 하나)

# 5. 두 좌표가 얼마나 같은 방향인지 측정 (코사인 유사도)
# (쉽게) 두 화살표 사이 각도만 봄 → 0도면 1(똑같음), 90도면 0(무관), 180도면 -1(반대)
# 화살표 길이는 무시, 방향만 비교 → 문장 길이 영향 없음
cos_sim = util.pytorch_cos_sim(emb1, emb2)
# 값 범위 해석
#  -1 : 완전히 반대 의미
#   0 : 의미 무관
#   1 : 완전히 동일 의미

# 6. 결과 출력
# .item() → 0차원 Tensor를 파이썬 float 으로 변환 → f-string 포매팅 가능
print(f"두 문장의 유사도 : {cos_sim.item():.4f}")  # 예) 두 문장의 유사도 : 0.9421