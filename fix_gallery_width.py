#!/usr/bin/env python3
import os
import re

# Directory containing the files
src_dir = "/Volumes/Kerem Aydin/Projeler/Kleinanzegen/24.11.2025/app/frontend/src"

# Get all JS files
js_files = [f for f in os.listdir(src_dir) if f.endswith('.js') and 'Page.js' in f]

# Pattern to find CategoryGallery without wrapper
pattern = re.compile(r'(\s*)<CategoryGallery\n', re.MULTILINE)

# Pattern to check if already wrapped
wrapped_pattern = re.compile(r'<div style=\{\{ maxWidth: [\'"]960px[\'"] \}\}>\s*<CategoryGallery', re.MULTILINE)

fixed_files = []

for filename in js_files:
    filepath = os.path.join(src_dir, filename)
    
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Skip if no CategoryGallery
        if '<CategoryGallery' not in content:
            continue
            
        # Skip if already wrapped with 960px
        if wrapped_pattern.search(content):
            print(f"✓ {filename} - Already fixed")
            continue
        
        # Find CategoryGallery and wrap it
        lines = content.split('\n')
        new_lines = []
        i = 0
        modified = False
        
        while i < len(lines):
            line = lines[i]
            
            # Check if this line contains <CategoryGallery
            if '<CategoryGallery' in line and 'import' not in line:
                # Get indentation
                indent = len(line) - len(line.lstrip())
                indent_str = ' ' * indent
                
                # Check if previous line is already a wrapper div
                if i > 0 and 'maxWidth' in lines[i-1]:
                    new_lines.append(line)
                    i += 1
                    continue
                
                # Add wrapper div before CategoryGallery
                new_lines.append(f"{indent_str}<div style={{{{ maxWidth: '960px' }}}}>")
                new_lines.append(line)
                
                # Find the closing tag
                depth = 1
                i += 1
                while i < len(lines) and depth > 0:
                    current_line = lines[i]
                    if '<CategoryGallery' in current_line:
                        depth += 1
                    if '/>' in current_line or '</CategoryGallery>' in current_line:
                        depth -= 1
                    
                    new_lines.append(current_line)
                    
                    if depth == 0:
                        # Add closing div after CategoryGallery
                        new_lines.append(f"{indent_str}</div>")
                        modified = True
                        break
                    i += 1
            else:
                new_lines.append(line)
            
            i += 1
        
        if modified:
            # Write back
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write('\n'.join(new_lines))
            fixed_files.append(filename)
            print(f"✓ {filename} - Fixed!")
        else:
            print(f"- {filename} - No changes needed")
            
    except Exception as e:
        print(f"✗ {filename} - Error: {e}")

print(f"\n{'='*50}")
print(f"Total files fixed: {len(fixed_files)}")
if fixed_files:
    print("\nFixed files:")
    for f in fixed_files:
        print(f"  - {f}")
