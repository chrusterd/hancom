import os
from huggingface_hub import InferenceClient

client = InferenceClient(
    provider = "auto",
    api_key = os.environ["HF_TOKEN"],
)

answer = input("생성할 이미지를 설명해주세요: ")

# output is a PIL.Image object
image = client.text_to_image(
    answer,
    model="black-forest-labs/FLUX.1-dev",
)

# 3단계 → PIL.Image.save() 호출, 확장자로 포맷 자동 결정
image.save("tti_result.jpg")

print("전체 코드가 잘 실행됐습니다.")