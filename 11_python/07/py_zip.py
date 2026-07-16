names = ["뽀삐", "초코", "쿠키"]
scores = [95, 88, 72]

# for name, score in zip(names, scores):
#     print(f"{name}: {score}점")
# 출력:
# 뽀삐: 95점
# 초코: 88점
# 쿠키: 72점

pairs = list(zip(names, scores))
print(pairs)  # [('뽀삐', 95), ('초코', 88), ('쿠키', 72)]

keys = ["name", "age", "city"]
values = ["Alice", 30, "New York"]
person_info = dict(zip(keys, values))
print(person_info)  # {'name': 'Alice', 'age': 30, 'city': 'New York'}    