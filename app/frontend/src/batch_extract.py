
import os

input_file = '/Volumes/Kerem Aydin/Projeler/Kleinanzegen/TÜRKCE/25.01.2026/app/frontend/src/components.js'
base_dir = '/Volumes/Kerem Aydin/Projeler/Kleinanzegen/TÜRKCE/25.01.2026/app/frontend/src'

extractions = [
    {
        'name': 'ProductDetail',
        'type': 'pages',
        'start': 7907,
        'end': 11063,
        'imports': """import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { t } from '../translations';
import { useIsMobile } from '../hooks/useIsMobile';
import LoadingSpinner from '../components/LoadingSpinner';
import { LazyImage } from '../components/LazyImage';
import { formatLastSeen } from '../utils/formatUtils';
"""
    },
    {
        'name': 'Checkout',
        'type': 'pages',
        'start': 864,
        'end': 1291,
        'imports': """import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { t } from '../translations';
"""
    },
    {
        'name': 'SellerPage',
        'type': 'pages',
        'start': 11173,
        'end': 11847,
        'imports': """import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { t } from '../translations';
import { LazyImage } from '../components/LazyImage';
"""
    }
]

with open(input_file, 'r') as f:
    lines = f.readlines()

for ext in extractions:
    path = os.path.join(base_dir, ext['type'], f"{ext['name']}.js")
    os.makedirs(os.path.dirname(path), exist_ok=True)
    
    content = "".join(lines[ext['start']-1:ext['end']])
    
    with open(path, 'w') as f:
        f.write(ext['imports'])
        f.write("\n")
        f.write(content)
        f.write(f"\nexport default {ext['name']};\n")
    
    print(f"Extracted {ext['name']} to {path}")
