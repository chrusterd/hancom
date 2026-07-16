name = "King"
age = 99
# 기존 방식 (불편함)
print("저는", name, "입니다. 나이는", age, "살입니다.")
# f-string 방식 (권장)
print(f"저는 {name}입니다. 나이는 {age}살입니다.")

print(f"소수점 2자리까지 출력: {3.141592:.2f}")  # 3.14
print(f"정수 5자리로 출력: {42:05d}")  # 00042
print(f"왼쪽 정렬: {'left':<10}")  # left
print("저는 {name}입니다. 나이는 {age}살입니다.".format(name=name, age=age))  # format 방식