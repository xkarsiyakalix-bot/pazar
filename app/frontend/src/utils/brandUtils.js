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
    { name: 'Enza Home', slug: 'enza-home', category: 'Mobilya' }
];

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
        .replace(/['’´]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/[\s_]+/g, '-')
        .replace(/^-+|-+$/g, '');
};

export const findBrandBySlug = (slug) => {
    if (!slug) return null;
    const cleanSlug = slug.toLowerCase().trim();

    // 1. Direct match in POPULAR_BRANDS
    const brand = POPULAR_BRANDS.find(b => 
        b.slug === cleanSlug || 
        (b.aliases && b.aliases.includes(cleanSlug)) ||
        slugifyBrand(b.name) === cleanSlug
    );
    if (brand) return brand;

    return null;
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
