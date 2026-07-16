from termcolor import colored

def highlight(text:str, color:str, bgcolor:str, style:list) -> str:
    """
    text와 color를 입력받아서 text 색상을 변경하는 함수
    """
    color_text = colored(text, color, bgcolor, style)
    return color_text

ct = highlight("Hello", "red", "on_green", ["bold"])
print(ct)