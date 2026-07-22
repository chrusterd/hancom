# import pytesseract
# from PIL import Image
# import os
#
# # 1. Tesseract 실행 파일 경로 지정
# pytesseract.pytesseract.tesseract_cmd = "C:/Program Files/Tesseract-OCR/tesseract.exe"
#
# # 2. 이미지 불러오기
# image = Image.open("./eng_kor.jpg")
#
# # 3. OCR 수행
# results = pytesseract.image_to_string(
#     image,
#     lang='eng+kor'
# )
#
# # 4. 결과 출력
# print(results)
# # Optical Character
# # Recognition (OCR)

import easyocr

# 1. Reader 생성 (한국어 + 영어, GPU 없으면 gpu=False)
reader = easyocr.Reader(['ko', 'en'], gpu=False)

# 2. OCR 수행
results = reader.readtext('./eng_kor.jpg')

# 3. 결과 출력
for bbox, text, conf in results:
    print(f"{text} (conf: {conf:.2f})")
