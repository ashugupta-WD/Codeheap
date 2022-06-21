my_dict1 = {'a' : 1, 'b' : 2, 'c' : 3}
my_dict2 = {'d' : 4, 'e' : 5, 'f' : 6}

# Method 1
result = { **my_dict1, **my_dict2}
print(result)

# Method 2
result = my_dict1.copy()
result.update(my_dict2)
print(result)

# Method 3
result = {key: value for d in (my_dict1, my_dict2) for key, value in d.items()}
print(result)
