import pyfiglet
from termcolor import colored

sentence = "Hello World!"
print(sentence)
colored_s = colored(sentence, "black", "on_light_green", ["bold"])
print(colored_s)
figlet_s = pyfiglet.figlet_format(sentence)
print(figlet_s)
colored_figlet = colored(figlet_s, "light_green", "on_light_cyan", ["bold"])
print(colored_figlet)