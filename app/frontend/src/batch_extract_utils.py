
import os

input_file = '/Volumes/Kerem Aydin/Projeler/Kleinanzegen/TÜRKCE/25.01.2026/app/frontend/src/components.js'
base_dir = '/Volumes/Kerem Aydin/Projeler/Kleinanzegen/TÜRKCE/25.01.2026/app/frontend/src/components'

extractions = [
    {
        'name': 'ListingCountdown',
        'start': 7428,
        'end': 7511,
        'imports': """import React, { useState, useEffect } from 'react';
"""
    },
    {
        'name': 'GalleryInfoModal',
        'start': 4077,
        'end': 4158,
        'imports': """import React from 'react';
import { t } from '../translations';
"""
    }
]

with open(input_file, 'r') as f:
    lines = f.readlines()

for ext in extractions:
    path = os.path.join(base_dir, f"{ext['name']}.js")
    os.makedirs(os.path.dirname(path), exist_ok=True)
    
    content = "".join(lines[ext['start']-1:ext['end']])
    
    with open(path, 'w') as f:
        f.write(ext['imports'])
        f.write("\n")
        f.write(content)
        f.write(f"\\nexport default {ext['name']};\\n")
    
    print(f"Extracted {ext['name']} to {path}")
