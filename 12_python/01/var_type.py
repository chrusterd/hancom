x = 10                                # int ( 주석 => Ctrl + /)
y = 3.14                              # float
name = 'Python'                       # str
is_fun = True                         # bool
colors = ['red', 'green', 'blue']     # list(순서 있음, 수정 가능)
coords = (10, 10)                     # tuple(순서 있음, 수정 불가)
person = {'name': 'Alice', 'age': 30} # dict(키-값 쌍)
nums = {1, 2, 3}                      # set(순서 없음, 중복 불가)
nothing = None                        # NoneType(값이 없음)

# 네이밍 스타일 (Python)
# snke_case => 변수, 함수, 모듈
# PascalCase => 클래스
# camelCase => JS

# print(isinstance(x, int))        # True
# print(isinstance(y, float))      # True
print(type(x))        # <class 'int'>
# print(type(y))        # <class 'float'>
# print(type(name))     # <class 'str'>
# print(type(is_fun))   # <class 'bool'>
# print(type(colors))   # <class 'list'>
# print(type(coords))   # <class 'tuple'>
# print(type(person))   # <class 'dict'>
# print(type(nums))     # <class 'set'>
# print(type(nothing))  # <class 'NoneType'>