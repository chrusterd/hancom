from transformers import pipeline

# 1. 요약 파이프라인 생성
# (왜) T5는 "task prefix + 입력 → 출력" 형태로 학습된 다목적 모델 → pipeline이 "summarize: " 접두사 자동 부착
summarizer = pipeline("summarization", model="t5-small")  # 약 240MB 경량 버전

# 2. 요약할 원문 (영어 단락)
text = """A special 25th anniversary edition of the extraordinary international bestseller, 
including a new Foreword by Paulo Coelho.
Combining magic, mysticism, wisdom and wonder into an inspiring tale of self-discovery, 
The Alchemist has become a modern classic, selling millions of copies around the world and transforming 
the lives of countless readers across generations.
Paulo Coelho's masterpiece tells the mystical story of Santiago, 
an Andalusian shepherd boy who yearns to travel in search of a worldly treasure. 
His quest will lead him to riches far different-and far more satisfying-than he ever imagined. 
Santiago's journey teaches us about the essential wisdom of listening to our hearts, 
of recognizing opportunity and learning to read the omens strewn along life's path, and, most importantly, 
to follow our dreams."""

# 3. 요약 실행 (길이 옵션 지정)
# (왜) 기본값은 모델마다 다름 → 명시 지정해야 결과 길이 예측 가능
summary = summarizer(
    text,
    min_length=20,   # 최소 토큰 수 → 너무 짧은 요약 방지
    max_length=60,   # 최대 토큰 수 → 길이 폭주 방지
    do_sample=False  # 결정적(greedy) 생성 → 매번 동일 결과
)  # 반환: [{'summary_text': str}] 리스트

# 4. 결과 텍스트 추출 → 출력
sum_text = summary[0]['summary_text']  # 첫 결과의 'summary_text' 키 → 요약 문자열
print(f"요약된 문장 : {sum_text}")