# colors = ["red", "green", "blue"]
# 순서 있음, 수정 가능, 중복 허용

# print(colors[0])  # red
# print(colors[-1])  # blue
# print(colors[0:2])  # ['red', 'green']
# print(colors[1:3])  # ['green', 'blue']

# colors[-1] = "yellow"  # blue => yellow
# colors.append("purple")  # 맨 뒤에 추가
# colors.insert(1, "orange")  # 1번 인덱스에 추가
# colors.remove("green")  # green 제거
# print(colors)  # ['red', 'orange', 'yellow', 'purple']

numbers = [8, 5, 3, 2, 7]
numbers.reverse()  # 순서 뒤집기
# numbers.sort()  # 오름차순 정렬
# numbers.sort(reverse=True)  # 내림차순 정렬
print(numbers)
print(2 in numbers)  # True
