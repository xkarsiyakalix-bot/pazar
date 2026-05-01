
import os

input_file = '/Volumes/Kerem Aydin/Projeler/Kleinanzegen/TÜRKCE/25.01.2026/app/frontend/src/components.js'
base_dir = '/Volumes/Kerem Aydin/Projeler/Kleinanzegen/TÜRKCE/25.01.2026/app/frontend/src/components'

extractions = [
    {
        'name': 'ListingCard',
        'start': 3546,
        'end': 3765,
        'imports': """import React from 'react';
import { Link } from 'react-router-dom';
import { t } from '../translations';
import { LazyImage } from './LazyImage';
import { generateListingNumber } from '../utils/listingUtils';
"""
    },
    {
        'name': 'ListingGrid',
        'start': 3766,
        'end': 3882,
        'imports': """import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { ListingCard } from './ListingCard';
import LoadingSpinner from './LoadingSpinner';
"""
    },
    {
        'name': 'HorizontalListingCard',
        'start': 7143,
        'end': 7427,
        'imports': """import React from 'react';
import { Link } from 'react-router-dom';
import { t } from '../translations';
import { LazyImage } from './LazyImage';
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
