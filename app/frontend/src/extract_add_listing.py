
import sys

input_file = '/Volumes/Kerem Aydin/Projeler/Kleinanzegen/TÜRKCE/25.01.2026/app/frontend/src/components.js'
output_file = '/Volumes/Kerem Aydin/Projeler/Kleinanzegen/TÜRKCE/25.01.2026/app/frontend/src/pages/AddListing.js'

start_line = 4776
end_line = 7142

imports = """import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { t, getCategoryTranslation } from '../translations';
import { turkeyCities } from '../data/turkey_cities';
import LoadingSpinner from '../components/LoadingSpinner';
import { FashionFields } from '../components/AddListing/FashionFields';
import { RealEstateFields } from '../components/AddListing/RealEstateFields';
import { VehicleFields } from '../components/AddListing/VehicleFields';
import { ElectronicFields } from '../components/AddListing/ElectronicFields';
import { HomeGardenFields } from '../components/AddListing/HomeGardenFields';
import { JobFields } from '../components/AddListing/JobFields';
import { HobbyFields } from '../components/AddListing/HobbyFields';
import { EducationFields } from '../components/AddListing/EducationFields';
import { ServiceFields } from '../components/AddListing/ServiceFields';
import { FamilyFields } from '../components/AddListing/FamilyFields';
import { PetFields } from '../components/AddListing/PetFields';
import { useIsMobile } from '../hooks/useIsMobile';
import { compressImage } from '../utils/imageUtils';

"""

with open(input_file, 'r') as f:
    lines = f.readlines()

content = "".join(lines[start_line-1:end_line])

with open(output_file, 'w') as f:
    f.write(imports)
    f.write(content)
    f.write("\nexport default AddListing;\n")

print(f"Successfully extracted {end_line - start_line + 1} lines to {output_file}")
