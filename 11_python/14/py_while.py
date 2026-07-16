def meters_to_feet(meters):
    return meters * 3.28084

while True:
    user_input = input("미터 값을 입력해주세요: ")
    try:
        meters = float(user_input)
        feet = meters_to_feet(meters)
        print(f"{meters}m는 {feet}ft입니다.")
        break          # 성공하면 루프 종료
    except ValueError:
        print("숫자를 입력해주세요. 다시 시도하세요.")