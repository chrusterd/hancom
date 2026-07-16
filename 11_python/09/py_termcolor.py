from termcolor import colored

# colored(문자열, 글자색, 배경색, attrs=[스타일])
result = colored("Hello", "red", "on_green", ["bold"])
print(result)