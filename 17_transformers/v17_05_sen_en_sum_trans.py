# 1. 라이브러리 불러오기
from transformers import pipeline          # 요약 모델 호출용
from deep_translator import GoogleTranslator  # 구글 번역 래퍼 → API 키 불필요

# 2. 영어 → 한국어 번역 함수 정의
# (왜) 매번 source·target 지정 반복 번거로움 → 함수로 감싸 한 줄 호출
def trans_en_to_ko(sentence):
    """
    주어진 영어 문장을 한국어로 번역하는 함수
    """
    translated_sen = GoogleTranslator(source='en', target='ko').translate(sentence)  # source 출발 / target 도착 언어 → 구글 서버 요청 → 한국어 문자열 반환
    return translated_sen

# 3. 요약 파이프라인 생성
# (왜) 토크나이저·모델·후처리 직접 짜기 번거로움 → "summarization" 한 줄로 결합
summarizer = pipeline(
    "summarization",
    model="t5-small"   # 약 240MB 경량 영어 요약 모델
)

# 4. 요약할 영어 원문 (긴 단락)
text = """
A special 25th anniversary edition of the extraordinary international bestseller, including a new Foreword by Paulo Coelho.
Combining magic, mysticism, wisdom and wonder into an inspiring tale of self-discovery, The Alchemist has become a modern classic, selling millions of copies around the world and transforming the lives of countless readers across generations.
Paulo Coelho's masterpiece tells the mystical story of Santiago, an Andalusian shepherd boy who yearns to travel in search of a worldly treasure. His quest will lead him to riches far different-and far more satisfying-than he ever imagined. Santiago's journey teaches us about the essential wisdom of listening to our hearts, of recognizing opportunity and learning to read the omens strewn along life's path, and, most importantly, to follow our dreams.
"""

# 5. 요약문 생성 (T5 인코더가 문맥 압축 → 디코더가 짧은 문장 생성)
summary = summarizer(text)  # 반환: [{'summary_text': str}] 리스트

# 6. 요약문 텍스트 추출
sum_text = summary[0]["summary_text"]  # 첫 결과의 'summary_text' 키 → 요약 문자열

# 7. 영어 요약문 출력
print(f"요약된 영어 문장 : {sum_text}")

# 8. 요약문 → 한국어 번역
# (왜) T5는 영어만 잘함 → 결과를 한국어로 옮기려면 외부 번역기 결합 필수
# kr_sum_text = GoogleTranslator(source='en', target='ko').translate(sum_text)   # ← 함수 안 쓰는 1줄 버전 (동일 동작)
kr_sum_text = trans_en_to_ko(sum_text)  # 함수 호출 → 가독성 ↑, 재사용 ↑

# 9. 한국어 번역문 출력
print(f"번역된 한국어 문장 : {kr_sum_text}")