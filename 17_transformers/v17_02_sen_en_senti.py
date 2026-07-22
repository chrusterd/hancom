from transformers import pipeline  # 핵심 진입점 → 태스크명만으로 모델·토크나이저 자동 결합

# 1. 감정 분석 파이프라인 생성
# (왜) 모델 로드 + 토크나이저 + 후처리 단계를 매번 직접 짜기 번거로움 → 한 줄로 묶기
# (어떻게) 태스크명 "sentiment-analysis" → HF 검증 기본 모델(distilbert-sst2) 자동 다운로드
classifier = pipeline("sentiment-analysis")  # 최초 1회 ~/.cache 저장 → 이후 즉시 로드

# 2. 분석할 문장 입력 → 추론 실행
# 내부 흐름: 문자열 → 토크나이즈(단어 조각화) → 모델 forward → softmax → 라벨·점수 산출
answer = input("기분을 입력해주세요 : ")
# text = "I'm feeling really great today"
results = classifier(answer)  # 반환 형태: [{'label': str, 'score': float}] 리스트

# 3. 결과 확인 (results[0] = 첫 입력에 대한 결과 dict)
print(f"감정 분석 결과 : {results[0]['label']}")    # 'label' 키 → 'POSITIVE' 또는 'NEGATIVE' 두 값
# → POSITIVE
print(f"감정 분석 점수 : {results[0]['score']:.4f}")  # 'score' 키 → 0~1 확률, :.4f 로 소수 4자리 포맷
# → 0.9998  (1에 가까울수록 모델 확신도 높음)