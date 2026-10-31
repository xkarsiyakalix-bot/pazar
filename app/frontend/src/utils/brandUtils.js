export const POPULAR_BRANDS = [
    // Otomotiv
    { name: 'BMW', slug: 'bmw', category: 'Otomobil' },
    { name: 'Mercedes-Benz', slug: 'mercedes-benz', aliases: ['mercedes'], category: 'Otomobil' },
    { name: 'Audi', slug: 'audi', category: 'Otomobil' },
    { name: 'Volkswagen', slug: 'volkswagen', aliases: ['vw'], category: 'Otomobil' },
    { name: 'Ford', slug: 'ford', category: 'Otomobil' },
    { name: 'Opel', slug: 'opel', category: 'Otomobil' },
    { name: 'Renault', slug: 'renault', category: 'Otomobil' },
    { name: 'Fiat', slug: 'fiat', category: 'Otomobil' },
    { name: 'Toyota', slug: 'toyota', category: 'Otomobil' },
    { name: 'Honda', slug: 'honda', category: 'Otomobil' },
    { name: 'Hyundai', slug: 'hyundai', category: 'Otomobil' },
    { name: 'Peugeot', slug: 'peugeot', category: 'Otomobil' },
    { name: 'Seat', slug: 'seat', category: 'Otomobil' },
    { name: 'Skoda', slug: 'skoda', category: 'Otomobil' },
    { name: 'Volvo', slug: 'volvo', category: 'Otomobil' },
    { name: 'Nissan', slug: 'nissan', category: 'Otomobil' },
    { name: 'Porsche', slug: 'porsche', category: 'Otomobil' },
    { name: 'Tesla', slug: 'tesla', category: 'Otomobil' },
    { name: 'Citroën', slug: 'citroen', category: 'Otomobil' },
    { name: 'Dacia', slug: 'dacia', category: 'Otomobil' },
    { name: 'Alfa Romeo', slug: 'alfa-romeo', category: 'Otomobil' },
    { name: 'Kia', slug: 'kia', category: 'Otomobil' },
    { name: 'Mazda', slug: 'mazda', category: 'Otomobil' },
    { name: 'Mini', slug: 'mini', category: 'Otomobil' },
    { name: 'Suzuki', slug: 'suzuki', category: 'Otomobil' },
    { name: 'Yamaha', slug: 'yamaha', category: 'Motosiklet' },

    // Giyim & Moda & Spor
    { name: 'Nike', slug: 'nike', category: 'Moda' },
    { name: 'Adidas', slug: 'adidas', category: 'Moda' },
    { name: 'Puma', slug: 'puma', category: 'Moda' },
    { name: 'Zara', slug: 'zara', category: 'Moda' },
    { name: 'H&M', slug: 'hm', aliases: ['h-m', 'h&m'], category: 'Moda' },
    { name: 'Mango', slug: 'mango', category: 'Moda' },
    { name: 'LC Waikiki', slug: 'lc-waikiki', aliases: ['lcw'], category: 'Moda' },
    { name: 'Koton', slug: 'koton', category: 'Moda' },
    { name: 'Mavi', slug: 'mavi', category: 'Moda' },
    { name: 'DeFacto', slug: 'defacto', category: 'Moda' },
    { name: 'Tommy Hilfiger', slug: 'tommy-hilfiger', category: 'Moda' },
    { name: 'Calvin Klein', slug: 'calvin-klein', category: 'Moda' },
    { name: 'Lacoste', slug: 'lacoste', category: 'Moda' },
    { name: 'Polo Ralph Lauren', slug: 'ralph-lauren', aliases: ['polo-ralph-lauren'], category: 'Moda' },
    { name: 'Hugo Boss', slug: 'hugo-boss', aliases: ['boss'], category: 'Moda' },
    { name: 'Levi\'s', slug: 'levis', aliases: ['levi-s'], category: 'Moda' },
    { name: 'Vans', slug: 'vans', category: 'Moda' },
    { name: 'Converse', slug: 'converse', category: 'Moda' },
    { name: 'New Balance', slug: 'new-balance', category: 'Moda' },
    { name: 'Under Armour', slug: 'under-armour', category: 'Moda' },
    { name: 'Skechers', slug: 'skechers', category: 'Moda' },
    { name: 'Columbia', slug: 'columbia', category: 'Moda' },
    { name: 'The North Face', slug: 'the-north-face', category: 'Moda' },
    { name: 'Gucci', slug: 'gucci', category: 'Moda' },
    { name: 'Prada', slug: 'prada', category: 'Moda' },
    { name: 'Chanel', slug: 'chanel', category: 'Moda' },
    { name: 'Louis Vuitton', slug: 'louis-vuitton', category: 'Moda' },

    // Teknoloji & Elektronik
    { name: 'Apple', slug: 'apple', aliases: ['iphone', 'ipad', 'macbook'], category: 'Elektronik' },
    { name: 'Samsung', slug: 'samsung', category: 'Elektronik' },
    { name: 'Xiaomi', slug: 'xiaomi', aliases: ['redmi', 'poco'], category: 'Elektronik' },
    { name: 'Huawei', slug: 'huawei', category: 'Elektronik' },
    { name: 'Sony', slug: 'sony', aliases: ['playstation', 'ps4', 'ps5'], category: 'Elektronik' },
    { name: 'LG', slug: 'lg', category: 'Elektronik' },
    { name: 'Philips', slug: 'philips', category: 'Elektronik' },
    { name: 'Asus', slug: 'asus', category: 'Elektronik' },
    { name: 'Lenovo', slug: 'lenovo', category: 'Elektronik' },
    { name: 'Dell', slug: 'dell', category: 'Elektronik' },
    { name: 'HP', slug: 'hp', category: 'Elektronik' },
    { name: 'Acer', slug: 'acer', category: 'Elektronik' },
    { name: 'MSI', slug: 'msi', category: 'Elektronik' },
    { name: 'Monster', slug: 'monster', category: 'Elektronik' },
    { name: 'Casper', slug: 'casper', category: 'Elektronik' },
    { name: 'Canon', slug: 'canon', category: 'Elektronik' },
    { name: 'Nikon', slug: 'nikon', category: 'Elektronik' },
    { name: 'Microsoft', slug: 'microsoft', aliases: ['xbox'], category: 'Elektronik' },
    { name: 'Nintendo', slug: 'nintendo', category: 'Elektronik' },
    { name: 'JBL', slug: 'jbl', category: 'Elektronik' },
    { name: 'Dyson', slug: 'dyson', category: 'Elektronik' },

    // Beyaz Eşya & Ev Aletleri
    { name: 'Bosch', slug: 'bosch', category: 'Beyaz Eşya' },
    { name: 'Siemens', slug: 'siemens', category: 'Beyaz Eşya' },
    { name: 'Arçelik', slug: 'arcelik', aliases: ['arcelik'], category: 'Beyaz Eşya' },
    { name: 'Beko', slug: 'beko', category: 'Beyaz Eşya' },
    { name: 'Vestel', slug: 'vestel', category: 'Beyaz Eşya' },
    { name: 'Profilo', slug: 'profilo', category: 'Beyaz Eşya' },
    { name: 'Tefal', slug: 'tefal', category: 'Ev Aletleri' },
    { name: 'Karaca', slug: 'karaca', category: 'Ev & Yaşam' },
    { name: 'Korkmaz', slug: 'korkmaz', category: 'Ev & Yaşam' },
    { name: 'IKEA', slug: 'ikea', category: 'Mobilya' },
    { name: 'İstikbal', slug: 'istikbal', category: 'Mobilya' },
    { name: 'Bellona', slug: 'bellona', category: 'Mobilya' },
    { name: 'Enza Home', slug: 'enza-home', category: 'Mobilya' },
    { name: 'Doğtaş', slug: 'dogtas', category: 'Mobilya' },
    { name: 'Kelebek Mobilya', slug: 'kelebek-mobilya', aliases: ['kelebek'], category: 'Mobilya' },
    { name: 'Çilek Mobilya', slug: 'cilek-mobilya', aliases: ['cilek'], category: 'Mobilya' },
    { name: 'Mondi', slug: 'mondi', category: 'Mobilya' },
    { name: 'Alfemo', slug: 'alfemo', category: 'Mobilya' },
    { name: 'Yıldız Entegre', slug: 'yildiz-entegre', category: 'Mobilya' },
    { name: 'Mudo', slug: 'mudo', category: 'Ev & Yaşam' },
    { name: 'English Home', slug: 'english-home', category: 'Ev & Yaşam' },
    { name: 'Madame Coco', slug: 'madame-coco', category: 'Ev & Yaşam' },
    { name: 'Müjde', slug: 'mujde', category: 'Ev & Yaşam' },
    { name: 'Linens', slug: 'linens', category: 'Ev & Yaşam' },
    { name: 'Sunny', slug: 'sunny', category: 'Ev Aletleri' },
    { name: 'Homend', slug: 'homend', category: 'Ev Aletleri' },
    { name: 'Fakir', slug: 'fakir', category: 'Ev Aletleri' },
    { name: 'Philips', slug: 'philips', category: 'Ev Aletleri' },
    { name: 'Braun', slug: 'braun', category: 'Ev Aletleri' },
    { name: 'Grundig', slug: 'grundig', aliases: ['grundig'], category: 'Beyaz Eşya' },
    { name: 'Whirlpool', slug: 'whirlpool', category: 'Beyaz Eşya' },
    { name: 'Electrolux', slug: 'electrolux', category: 'Beyaz Eşya' },
    { name: 'Miele', slug: 'miele', category: 'Beyaz Eşya' },
    { name: 'Indesit', slug: 'indesit', category: 'Beyaz Eşya' },
    { name: 'Altus', slug: 'altus', category: 'Beyaz Eşya' },
    { name: 'Emsal', slug: 'emsal', category: 'Ev & Yaşam' },
    { name: 'Iittala', slug: 'iittala', category: 'Ev & Yaşam' },
    { name: 'WMF', slug: 'wmf', category: 'Ev & Yaşam' },
    { name: 'Villeroy & Boch', slug: 'villeroy-boch', category: 'Ev & Yaşam' }
];

// allBrands.json is NOT statically imported here to keep the main bundle small.
// It is loaded on-demand via dynamic import and cached after first load.
let _allBrandsCache = null;

const loadAllBrands = async () => {
    if (!_allBrandsCache) {
        const mod = await import('../data/allBrands.json');
        _allBrandsCache = mod.default;
    }
    return _allBrandsCache;
};

export const slugifyBrand = (text) => {
    if (!text || typeof text !== 'string') return '';
    
    const trMap = {
        'ç': 'c', 'Ç': 'c',
        'ğ': 'g', 'Ğ': 'g',
        'ş': 's', 'Ş': 's',
        'ü': 'u', 'Ü': 'u',
        'ı': 'i', 'İ': 'i',
        'ö': 'o', 'Ö': 'o'
    };

    let slug = text;
    for (const [key, value] of Object.entries(trMap)) {
        slug = slug.replace(new RegExp(key, 'g'), value);
    }

    return slug
        .toLowerCase()
        .trim()
        .replace(/&/g, '')
        .replace(/[''´]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/[\s_]+/g, '-')
        .replace(/^-+|-+$/g, '');
};

/**
 * Synchronously checks POPULAR_BRANDS first (always in bundle).
 * For an exhaustive check against all 2,500+ brands, use findBrandBySlugAsync.
 */
export const findBrandBySlug = (slug) => {
    if (!slug) return null;
    const cleanSlug = slug.toLowerCase().trim();

    // 1. If allBrands is already cached (loaded by BrandPage/BrandsDirectoryPage), use it
    if (_allBrandsCache) {
        if (_allBrandsCache[cleanSlug]) return _allBrandsCache[cleanSlug];
        // Fallback search through aliases & names
        for (const key in _allBrandsCache) {
            const item = _allBrandsCache[key];
            if (item.aliases && item.aliases.includes(cleanSlug)) return item;
            if (slugifyBrand(item.name) === cleanSlug) return item;
        }
    }

    // 2. Synchronous match in POPULAR_BRANDS (always available, covers top ~95 brands)
    const brand = POPULAR_BRANDS.find(b =>
        b.slug === cleanSlug ||
        (b.aliases && b.aliases.includes(cleanSlug)) ||
        slugifyBrand(b.name) === cleanSlug
    );
    return brand || null;
};

/**
 * Async version — loads all 2,500+ brands if needed. Use in SmartRoute for
 * slugs that weren't matched by the synchronous findBrandBySlug.
 */
export const findBrandBySlugAsync = async (slug) => {
    if (!slug) return null;
    const syncResult = findBrandBySlug(slug);
    if (syncResult) return syncResult;

    const allBrandsData = await loadAllBrands();
    const cleanSlug = slug.toLowerCase().trim();

    if (allBrandsData[cleanSlug]) return allBrandsData[cleanSlug];

    for (const key in allBrandsData) {
        const item = allBrandsData[key];
        if (item.aliases && item.aliases.includes(cleanSlug)) return item;
        if (slugifyBrand(item.name) === cleanSlug) return item;
    }

    return null;
};

/** Async — loads all brands data on demand and dynamically merges any custom user brands in active listings */
export const getAllBrandsList = async () => {
    const allBrandsData = await loadAllBrands();
    const list = Object.values(allBrandsData);

    try {
        const { supabase } = await import('../lib/supabase');
        const { data } = await supabase
            .from('listings')
            .select('marke')
            .eq('status', 'active')
            .not('marke', 'is', null)
            .neq('marke', '')
            .limit(200);

        if (data && data.length > 0) {
            const existingSlugs = new Set(list.map(b => b.slug));
            data.forEach(item => {
                const bName = item.marke?.trim();
                if (!bName || ['diğer', 'diger', 'andere', 'other'].includes(bName.toLowerCase())) return;
                const bSlug = slugifyBrand(bName);
                if (bSlug && !existingSlugs.has(bSlug)) {
                    existingSlugs.add(bSlug);
                    list.push({
                        name: bName,
                        slug: bSlug,
                        category: 'Markalar'
                    });
                }
            });
        }
    } catch (_) {}

    return list;
};

/**
 * Fast search across all brands with ranking (starts-with, exact, category boost).
 * Dynamically loads allBrands.json on demand.
 */
export const searchBrandsAsync = async (query, categoryFilter = null, limit = 15) => {
    const cleanQuery = (query || '').trim().toLocaleLowerCase('tr-TR');
    const allBrandsData = await loadAllBrands();
    const allList = Object.values(allBrandsData);

    // If query is empty, return popular / category-specific brands
    if (!cleanQuery) {
        if (categoryFilter) {
            const catLower = categoryFilter.toLowerCase();
            const catMatches = allList.filter(b => b.category && b.category.toLowerCase().includes(catLower));
            if (catMatches.length > 0) return catMatches.slice(0, limit);
        }
        return POPULAR_BRANDS.slice(0, limit);
    }

    const cleanSlugQuery = slugifyBrand(cleanQuery);

    // Score and rank matches
    const scored = [];
    for (const b of allList) {
        if (!b || !b.name) continue;
        const nameLower = b.name.toLocaleLowerCase('tr-TR');
        const slugLower = (b.slug || '').toLowerCase();

        let score = 0;
        if (nameLower === cleanQuery || slugLower === cleanSlugQuery) {
            score = 100; // Exact match
        } else if (nameLower.startsWith(cleanQuery)) {
            score = 80; // Starts with query
        } else if (slugLower.startsWith(cleanSlugQuery)) {
            score = 70;
        } else if (nameLower.includes(` ${cleanQuery}`)) {
            score = 60; // Word boundary match
        } else if (nameLower.includes(cleanQuery)) {
            score = 40; // Substring match
        } else if (b.aliases && b.aliases.some(a => a.toLowerCase().includes(cleanSlugQuery))) {
            score = 30; // Alias match
        }

        if (score > 0) {
            if (categoryFilter && b.category && b.category.toLowerCase().includes(categoryFilter.toLowerCase())) {
                score += 15; // Category relevance boost
            }
            scored.push({ brand: b, score });
        }
    }

    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, limit).map(s => s.brand);
};

/** Async — loads all brands data on demand, grouped alphabetically. */
export const getAlphabeticalBrands = async () => {
    const list = await getAllBrandsList();
    const groups = {};

    list.forEach(brand => {
        if (!brand || !brand.name) return;
        const firstChar = brand.name.trim().charAt(0).toLocaleUpperCase('tr-TR');
        let letter = firstChar;

        if (/[0-9]/.test(firstChar)) {
            letter = '0-9';
        } else if (!/[A-ZÇĞİÖŞÜ]/.test(firstChar)) {
            letter = '#';
        }

        if (!groups[letter]) {
            groups[letter] = [];
        }
        groups[letter].push(brand);
    });

    // Her harf içindeki markaları alfabetik sırala
    Object.keys(groups).forEach(letter => {
        groups[letter].sort((a, b) => a.name.localeCompare(b.name, 'tr-TR'));
    });

    return groups;
};

export const extractListingBrand = (listing) => {
    if (!listing) return null;
    const brand = listing.marke ||
        listing.car_brand ||
        listing.brand ||
        listing.carBrand ||
        listing.damenbekleidung_marke ||
        listing.damenschuhe_marke ||
        listing.herrenbekleidung_marke ||
        listing.herrenschuhe_marke;

    if (!brand || typeof brand !== 'string') return null;
    const trimmed = brand.trim();
    if (['diğer', 'diger', 'andere', 'other'].includes(trimmed.toLowerCase())) {
        return null;
    }
    return trimmed;
};

export const formatBrandDisplayName = (slug, foundBrand = null) => {
    if (foundBrand && foundBrand.name) return foundBrand.name;
    if (!slug) return '';
    return slug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

export const matchesSpecificModel = (targetModel, listingModel, listingTitle) => {
    if (!targetModel) return true;
    const cleanTarget = String(targetModel).trim();
    const cleanTargetLower = cleanTarget.toLowerCase();

    // 1. Exact match on explicit model column
    if (listingModel && String(listingModel).trim().toLowerCase() === cleanTargetLower) {
        return true;
    }

    // 2. Title matching
    if (!listingTitle) return false;
    const title = String(listingTitle).trim();

    // Escape regex special characters
    const escaped = cleanTarget.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');

    // Word boundary check for the model phrase
    const phraseRegex = new RegExp('(?:^|[\\s([/\\-_])' + escaped + '(?=[\\s)\\-_,.:;!?]|$)', 'i');
    if (!phraseRegex.test(title)) return false;

    // Disambiguation: if target is NOT Max/Plus/Air, do not match titles that have Max/Plus/Air immediately after
    if (!cleanTargetLower.includes('max')) {
        const afterMaxRegex = new RegExp(escaped + '\\s+(?:max)', 'i');
        if (afterMaxRegex.test(title)) return false;
    }
    if (!cleanTargetLower.includes('plus')) {
        const afterPlusRegex = new RegExp(escaped + '\\s+(?:plus)', 'i');
        if (afterPlusRegex.test(title)) return false;
    }
    if (!cleanTargetLower.includes('pro')) {
        const afterProRegex = new RegExp(escaped + '\\s+(?:pro)', 'i');
        if (afterProRegex.test(title)) return false;
    }
    if (!cleanTargetLower.includes('air')) {
        const afterAirRegex = new RegExp(escaped + '\\s+(?:air)', 'i');
        if (afterAirRegex.test(title)) return false;
    }
    if (!cleanTargetLower.includes('mini')) {
        const afterMiniRegex = new RegExp(escaped + '\\s+(?:mini)', 'i');
        if (afterMiniRegex.test(title)) return false;
    }

    return true;
};
