from transformers import pipeline  # 태스크명만으로 모델·토크나이저 자동 결합

# 1. 텍스트 생성 파이프라인 생성
# (왜) GPT-2는 디코더 전용 LM → 다음 토큰 확률 분포 출력. 토크나이저·샘플링 직접 짜기 번거로움 → pipeline 한 줄로 묶기
generator = pipeline(
    "text-generation", 
    # model="gpt2"
    model="skt/kogpt2-base-v2"
    )  # 최초 1회 모델(~500MB) 다운로드 후 캐시

# 2. 시드 문장 입력 (이어 쓸 첫 부분)
answer = input("생성 문장을 입력해주세요 : ")

# 3. 생성 실행 → 토큰 단위로 max_new_tokens만큼 예측
# (왜) max_new_tokens 미설정 시 무한 생성 위험 → 길이 제한 필수
result = generator(
    answer,
    max_new_tokens=50,       # 추가 생성할 토큰 수 → 길수록 추론 시간 ↑
    num_return_sequences=1,  # 반환 문장 개수 → 2 이상이면 후보 비교 가능
    truncation=True          # 입력이 모델 최대 길이 초과 시 자르기
)

# 4. 결과 출력 (반환은 [{'generated_text': str}] 리스트)
print(result[0]["generated_text"])