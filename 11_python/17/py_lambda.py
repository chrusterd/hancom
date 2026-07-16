# 람다 공식
# 함수명 = lambda 매개변수(파라미터) : 반환값

# def add(a, b):
#     return a + b
# print(add(7, 3))
# 10
# add = lambda a, b : a + b
# print(add(7, 3))
# 10

import pyfiglet
# 글자를 넣으면 큰 그림 글씨로 출력(pyfiglet)해 주는 lambda 함수

figlet = lambda user_input : pyfiglet.figlet_format(user_input)


while True:
    user_input = input("영어나 숫자, 기호만 그림으로 변환됩니다. 알맞은 값만 입력해주세요: ")
    try:
        print(figlet(user_input))
        break          # 성공하면 루프 종료
    except ValueError:
        print("잘못된 입력입니다. 다시 시도하세요.")