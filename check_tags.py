import re

def check_balancing(filename):
    with open(filename, 'r') as f:
        content = f.read()

    # Find all <div or </div tags with their positions
    # We use regex to find start and end tags
    # This is a bit naive but should work for standard JSX
    tags = []
    # Regex for <div (possibly with props)
    for m in re.finditer(r'<div(?:\s|>|/|$)', content):
        if content[m.start():m.start()+6] != '<div />': # ignore self-closing if any
             tags.append(('open', m.start()))
    
    # Regex for </div
    for m in re.finditer(r'</div\s*>', content):
        tags.append(('close', m.start()))

    # Sort tags by position
    tags.sort(key=lambda x: x[1])

    stack = []
    errors = []
    
    for tag_type, pos in tags:
        line_num = content.count('\n', 0, pos) + 1
        if tag_type == 'open':
            stack.append(line_num)
        else:
            if not stack:
                errors.append(f"Extra closing tag at line {line_num}")
            else:
                stack.pop()
    
    for line in stack:
        errors.append(f"Unclosed opening tag from line {line}")
    
    return errors

errors = check_balancing('app/frontend/src/components.js')
if not errors:
    print("All good!")
else:
    for err in errors:
        print(err)
