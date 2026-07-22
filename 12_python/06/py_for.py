mixed = [1, "Hello", 3.14, True, [1, 2, 3], (4, 5), {"name": "Alice"}, {1, 2, 3}, None]

for index, item in enumerate(mixed):
    print(f"{index}: {item} is {type(item)}.")