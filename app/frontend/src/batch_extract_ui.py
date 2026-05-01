
import os

input_file = '/Volumes/Kerem Aydin/Projeler/Kleinanzegen/TÜRKCE/25.01.2026/app/frontend/src/components.js'
base_dir = '/Volumes/Kerem Aydin/Projeler/Kleinanzegen/TÜRKCE/25.01.2026/app/frontend/src/components'

extractions = [
    {
        'name': 'SearchSection',
        'start': 2378,
        'end': 3545,
        'imports': """import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { t } from '../translations';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
"""
    },
    {
        'name': 'CategoryGallery',
        'start': 4160,
        'end': 4518,
        'imports': """import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { t } from '../translations';
import { LazyImage } from './LazyImage';
import { useIsMobile } from '../hooks/useIsMobile';
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
        f.write(f"\nexport default {ext['name']};\n")
    
    print(f"Extracted {ext['name']} to {path}")
