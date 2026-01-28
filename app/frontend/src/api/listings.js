import { supabase } from '../lib/supabase';

/**
 * Fetch all listings with optional filters
 * @param {Object} filters - Filter options
 * @param {string} filters.category - Main category
 * @param {string} filters.subCategory - Sub category
 * @param {number} filters.priceMin - Minimum price
 * @param {number} filters.priceMax - Maximum price
 * @param {string} filters.city - City filter
 * @param {string} filters.search - Search term
 * @returns {Promise<Array>} Array of listings
 */
import { getCache, setCache, clearCache } from '../utils/cache';

/**
 * Helper to mask promotion flags if the promotion has expired
 * @param {Object} listing - The listing object
 * @returns {Object} Transformation listing
 */
export const applyPromotionExpiry = (listing) => {
    if (!listing) return listing;


    const now = new Date();
    const expiry = listing.promotion_expiry ? new Date(listing.promotion_expiry) : null;

    if (expiry && expiry < now) {
        return {
            ...listing,
            is_top: false,
            is_gallery: false,
            is_highlighted: false,
            is_multi_bump: false,
            package_type: 'basic',
            promotion_expiry: null // Treat as none
        };
    }
    return listing;
};

/**
 * Fetch all listings with optional filters, pagination and caching
 * @param {Object} filters - Filter options
 * @param {string} filters.category - Main category
 * @param {string} filters.subCategory - Sub category
 * @param {number} filters.priceMin - Minimum price
 * @param {number} filters.priceMax - Maximum price
 * @param {string} filters.city - City filter
 * @param {string} filters.search - Search term
 * @param {number} filters.page - Page number (1-based)
 * @param {number} filters.limit - Items per page
 * @returns {Promise<Array>} Array of listings
 */
export const fetchListings = async (filters = {}, options = { count: true }) => {
    // Generate cache key based on filters - v3 for subcategory mapping fix + force-premium override
    const cacheKey = 'v3_' + JSON.stringify(filters);
    const cachedData = getCache(cacheKey);

    if (cachedData) {
        return cachedData;
    }

    let query = supabase
        .from('listings')
        .select(filters.select || '*', options.count ? { count: 'exact' } : {})
        .eq('status', 'active')
        .or(`expiry_date.gt.${new Date().toISOString()},expiry_date.is.null`);

    // Applying sort based on filters
    if (filters.sort_by_newest || filters.sort_by === 'created_at') {
        query = query.order('created_at', { ascending: false });
    } else {
        // Default priority sorting: Promoted first (TOP), then newest
        // We prioritize 'z_premium' by sorting package_type DESC
        query = query
            .order('is_top', { ascending: false })
            .order('package_type', { ascending: false })
            .order('created_at', { ascending: false });
    }

    if (filters.category) {
        // Bilingual Main Category Mapping
        const mainCategoryMapping = {
            'Eğitim & Kurslar': ['Eğitim & Kurslar', 'Unterricht & Kurse'],
            'Komşu Yardımı': ['Komşu Yardımı', 'Nachbarschaftshilfe'],
            'Ücretsiz & Takas': ['Ücretsiz & Takas', 'Zu verschenken & Tauschen'],
            'Hizmetler': ['Hizmetler', 'Dienstleistungen'],
            'Biletler': ['Biletler', 'Eintrittskarten & Tickets'],
            'Müzik, Film & Kitap': ['Müzik, Film & Kitap', 'Müzik, Filme & Bücher', 'Musik, Filme & Bücher', 'Musik, Film & Bücher'],
            'Eğlence, Hobi & Mahalle': ['Eğlence, Hobi & Mahalle', 'Freizeit, Hobby & Nachbarschaft'],
            'İş İlanları': ['İş İlanları', 'Jobs'],
            'Aile, Çocuk & Bebek': ['Aile, Çocuk & Bebek', 'Familie, Kind & Baby'],
            'Evcil Hayvanlar': ['Evcil Hayvanlar', 'Haustiere'],
            'Elektronik': ['Elektronik', 'Elektronik'],
            'Moda & Güzellik': ['Moda & Güzellik', 'Mode & Beauty'],
            'Ev & Bahçe': ['Ev & Bahçe', 'Haus & Garten'],
            'Emlak': ['Emlak', 'Immobilien'],
            'Otomobil, Bisiklet & Tekne': ['Otomobil, Bisiklet & Tekne', 'Auto, Rad & Boot', 'Otomobil, Bisiklet & Tekne Servisi']
        };

        const mappedCategory = mainCategoryMapping[filters.category];

        if (mappedCategory) {
            query = query.in('category', mappedCategory);
        } else {
            // Fallback for cases not in mapping or exact matches
            if (filters.category.includes('Musik') && filters.category.includes('Bücher')) {
                query = query.in('category', ['Musik, Filme & Bücher', 'Musik, Film & Bücher', 'Müzik, Film & Kitap']);
            } else {
                query = query.eq('category', filters.category);
            }
        }
    }

    // Bilingual subcategory mapping
    const bilingualMapping = {
        // Eğitim & Kurslar
        'Bilgisayar Kursları': ['Bilgisayar Kursları', 'Computerkurse'],
        'Ezoterizm & Spiritüalizm': ['Ezoterizm & Spiritüalizm', 'Esoterik & Spirituelles'],
        'Yemek & Pastacılık': ['Yemek & Pastacılık', 'Kochen & Backen'],
        'Sanat & Tasarım': ['Sanat & Tasarım', 'Kunst & Gestaltung'],
        'Müzik & Şan': ['Müzik & Şan', 'Musik & Gesang'],
        'Özel Ders': ['Özel Ders', 'Nachhilfe'],
        'Spor Kursları': ['Spor Kursları', 'Sportkurse'],
        'Dil Kursları': ['Dil Kursları', 'Sprachkurse'],
        'Dans Kursları': ['Dans Kursları', 'Tanzkurse'],
        'Sürekli Eğitim': ['Sürekli Eğitim', 'Weiterbildung'],
        'Diğer Eğitim & Kurslar': ['Diğer Eğitim & Kurslar', 'Weitere Unterricht & Kurse', 'Sonstige Unterricht & Kurse'],

        // Evcil Hayvanlar (Already handled but good to unify)
        'Balıklar': ['Balıklar', 'Balık', 'Fische'],
        'Köpekler': ['Köpekler', 'Köpek', 'Hunde'],
        'Kediler': ['Kediler', 'Kedi', 'Katzen'],
        'Küçük Hayvanlar': ['Küçük Hayvanlar', 'Küçükbaş Hayvanlar', 'Kleintiere'],
        'Çiftlik Hayvanları': ['Çiftlik Hayvanları', 'Kümes Hayvanları', 'Nutztiere'],
        'Atlar': ['Atlar', 'At', 'Pferde'],
        'Kuşlar': ['Kuşlar', 'Kuş', 'Vögel'],
        'Aksesuarlar': ['Aksesuarlar', 'Hayvan Aksesuarları', 'Zubehör'],
        'Hayvan Bakımı & Eğitimi': ['Hayvan Bakımı & Eğitimi', 'Hayvan Bakımı & Eğitim', 'Tierbetreuung & Training'],
        'Hayvan Bakımı & Eğitim': ['Hayvan Bakımı & Eğitimi', 'Hayvan Bakımı & Eğitim', 'Tierbetreuung & Training'],
        'Kayıp Hayvanlar': ['Kayıp Hayvanlar', 'Vermisste Tiere'],

        // Aile, Çocuk & Bebek
        'Bebek Odası Mobilyaları': ['Bebek Odası Mobilyaları', 'Çocuk Odası Mobilyaları', 'Kinderzimmermöbel'],
        'Oyuncaklar': ['Oyuncaklar', 'Oyuncak', 'Spielzeug'],

        // Otomobil, Bisiklet & Tekne
        'Otomobiller': ['Otomobiller', 'Autos'],
        'Autos': ['Otomobiller', 'Autos'],
        'Bisiklet & Aksesuarlar': ['Bisiklet & Aksesuarlar', 'Bisiklet & Aksesuarları', 'Fahrräder & Zubehör'],
        'Bisiklet & Aksesuarları': ['Bisiklet & Aksesuarlar', 'Bisiklet & Aksesuarları', 'Fahrräder & Zubehör'],
        'Otomobil, Bisiklet & Tekne': ['Otomobil, Bisiklet & Tekne', 'Otomobil, Bisiklet & Tekne Servisi', 'Oto, Bisiklet & Tekne Servisi', 'Auto, Rad & Boot'],
        'Yaşlı Bakımı': ['Yaşlı Bakımı', 'Seniorenbetreuung'],
        'Bebek Bakıcısı & Kreş': ['Bebek Bakıcısı & Kreş', 'Babysitter & Çocuk Bakımı', 'Babysitter/-in & Kinderbetreuung'],
        'Babysitter & Çocuk Bakımı': ['Bebek Bakıcısı & Kreş', 'Babysitter & Çocuk Bakımı', 'Babysitter/-in & Kinderbetreuung'],
        'Elektronik': ['Elektronik', 'Elektronik Servisler', 'Elektronik Hizmetler'],
        'Ev & Bahçe': ['Ev & Bahçe', 'Ev & Bahçe Hizmetleri', 'Haus & Garten', 'Ev Hizmetleri'],
        'Ev Hizmetleri': ['Ev Hizmetleri', 'Ev & Bahçe Hizmetleri', 'Haus & Garten'],
        'Sanatçılar & Müzisyenler': ['Sanatçılar & Müzisyenler', 'Sanatçı & Müzisyen', 'Künstler & Musiker'],
        'Seyahat & Etkinlik': ['Seyahat & Etkinlik', 'Seyahat & Etkinlik Hizmetleri', 'Reise & Veranstaltungen'],
        'Hayvan Bakımı & Eğitimi': ['Hayvan Bakımı & Eğitimi', 'Hayvan Bakımı & Eğitim', 'Tierbetreuung & Training'],
        'Hayvan Bakımı & Eğitim': ['Hayvan Bakımı & Eğitimi', 'Hayvan Bakımı & Eğitim', 'Tierbetreuung & Training'],
        'Taşımacılık & Nakliye': ['Taşımacılık & Nakliye', 'Umzug & Transport'],
        'Taşımacılık & Nakliye': ['Taşımacılık & Nakliye', 'Umzug & Transport'],
        'Diğer Hizmetler': ['Diğer Hizmetler', 'Weitere Dienstleistungen'],

        // Moda & Güzellik
        'Kadın Giyimi': ['Kadın Giyimi', 'Kadın Giyim', 'Damenbekleidung', 'Damenmode'],
        'Erkek Giyimi': ['Erkek Giyimi', 'Erkek Giyim', 'Herrenbekleidung', 'Herrenmode'],
        'Kadın Ayakkabıları': ['Kadın Ayakkabıları', 'Damenschuhe'],
        'Erkek Ayakkabıları': ['Erkek Ayakkabıları', 'Herrenschuhe'],
        'Çanta & Aksesuarlar': ['Çanta & Aksesuarlar', 'Taschen & Accessoires'],
        'Saat & Takı': ['Saat & Takı', 'Uhren & Schmuck'],
        'Güzellik & Sağlık': ['Güzellik & Sağlık', 'Beauty & Gesundheit', 'Kişisel Bakım & Sağlık'],
        'Diğer Moda & Güzellik': ['Diğer Moda & Güzellik', 'Sonstige Mode & Beauty'],

        // Müzik, Film & Kitap
        'Kitap & Dergi': ['Kitap & Dergi', 'Bücher & Zeitschriften'],
        'Kırtasiye': ['Kırtasiye', 'Büro & Schreibwaren'],
        'Çizgi Romanlar': ['Çizgi Romanlar', 'Comics'],
        'Ders Kitapları, Okul & Eğitim': ['Ders Kitapları, Okul & Eğitim', 'Fachbücher, Schule & Studium'],
        'Film & DVD': ['Film & DVD', 'Filme & DVDs'],
        'Müzik & CD\'ler': ['Müzik & CD\'ler', 'Musik & CDs'],
        'Müzik Enstrümanları': ['Müzik Enstrümanları', 'Musikinstrumente'],
        'Diğer Müzik, Film & Kitap': ['Diğer Müzik, Film & Kitap', 'Weitere Musik, Filme & Bücher']
    };

    if (filters.subCategory) {
        const mappedSubCategory = bilingualMapping[filters.subCategory];
        if (mappedSubCategory) {
            query = query.in('sub_category', mappedSubCategory);
        } else {
            // Fallback to singular mapping logic if present, or direct value
            const legacyMapping = {
                'Balıklar': 'Balık',
                'Köpekler': 'Köpek',
                'Kediler': 'Kedi',
                'Küçük Hayvanlar': 'Küçükbaş Hayvanlar',
                'Çiftlik Hayvanları': 'Kümes Hayvanları',
                'Atlar': 'At',
                'Kuşlar': 'Kuş',
                'Aksesuarlar': 'Hayvan Aksesuarları'
            }[filters.subCategory];

            query = query.eq('sub_category', legacyMapping || filters.subCategory);
        }
    }

    // Unified filter handling
    const processFilter = (filterKey, tableField) => {
        const value = filters[filterKey] || filters[tableField];
        if (value) {
            const valuesArray = typeof value === 'string' ? value.split(',').filter(Boolean) : (Array.isArray(value) ? value : [value]);
            if (valuesArray.length > 0) {
                query = query.in(tableField, valuesArray);
            }
        }
    };

    // Common Filters
    if (filters.priceMin || filters.min_price) {
        query = query.gte('price', filters.priceMin || filters.min_price);
    }
    if (filters.priceMax || filters.max_price) {
        query = query.lte('price', filters.priceMax || filters.max_price);
    }
    if (filters.city) {
        query = query.eq('city', filters.city);
    }
    if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }

    // Range Filters (Generic)
    Object.keys(filters).forEach(key => {
        if (key.endsWith('_min')) {
            const tableField = key.replace('_min', '');
            query = query.gte(tableField, filters[key]);
        } else if (key.endsWith('_max')) {
            const tableField = key.replace('_max', '');
            query = query.lte(tableField, filters[key]);
        }
    });

    // Mapping of frontend filter keys to backend column names
    const commonMappings = {
        'federalState': 'federal_state',
        'federal_state': 'federal_state',
        'location': 'federal_state',
        'offerType': 'offer_type',
        'offer_type': 'offer_type',
        'sellerType': 'seller_type',
        'seller_type': 'seller_type',
        'providerType': 'seller_type',
        'condition': 'condition',
        'zustand': 'condition',
        'versand': 'versand_art',
        'versandArt': 'versand_art',
        'versand_art': 'versand_art'
    };

    Object.entries(commonMappings).forEach(([fKey, tField]) => processFilter(fKey, tField));

    // Immobilendetails & Specific Fields
    const immobilienFields = [
        'wohnungstyp', 'haustyp', 'grundstuecksart', 'objektart',
        'garage_type', 'available_from', 'commission', 'online_viewing',
        'rooms', 'floor', 'construction_year', 'warm_rent', 'price_per_sqm',
        'auf_zeit_wg_art', 'rental_type', 'angebotsart'
    ];

    immobilienFields.forEach(field => {
        if (filters[field]) {
            if (field === 'available_from' && typeof filters[field] === 'string' && filters[field].length <= 7) {
                // Handle partial month match YYYY-MM
                query = query.ilike('available_from', `${filters[field]}%`);
            } else {
                processFilter(field, field);
            }
        }
    });

    // Array/Features Fields (Supabase .overlaps())
    const arrayFields = ['amenities', 'general_features', 'apartment_features', 'house_features'];
    arrayFields.forEach(field => {
        const value = filters[field];
        if (value) {
            const valuesArray = typeof value === 'string' ? value.split(',').filter(Boolean) : (Array.isArray(value) ? value : [value]);
            if (valuesArray.length > 0) {
                query = query.overlaps(field, valuesArray);
            }
        }
    });

    // Dynamic Category-specific "Art" filters
    Object.keys(filters).forEach(key => {
        if ((key.endsWith('Art') || key.endsWith('_art')) && !commonMappings[key] && !immobilienFields.includes(key)) {
            // Convert camelCase to snake_case for table field if necessary
            const tableField = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`).replace(/^_/, '');
            processFilter(key, tableField);
        }
    });



    // Pagination
    if (filters.page && filters.limit) {
        const from = (filters.page - 1) * filters.limit;
        const to = from + filters.limit - 1;
        query = query.range(from, to);
    }

    let timeoutId;
    try {
        const timeoutPromise = new Promise((_, reject) => {
            timeoutId = setTimeout(() => reject(new Error('Request timed out')), 15000);
        });

        const { data, error, count } = await Promise.race([query, timeoutPromise]);
        if (timeoutId) clearTimeout(timeoutId);

        if (error) {
            console.error('Error fetching listings:', error);
            throw error;
        }

        // Transform data to use plural forms for pet subcategories to match frontend expectations
        const transformedData = (data || []).map(item => {

            if (item.category === 'Evcil Hayvanlar') {
                const subCategoryMapping = {
                    'Balık': 'Balıklar',
                    'Köpek': 'Köpekler',
                    'Kedi': 'Kediler',
                    'Küçükbaş Hayvanlar': 'Küçük Hayvanlar',
                    'Kümes Hayvanları': 'Çiftlik Hayvanları',
                    'At': 'Atlar',
                    'Kuş': 'Kuşlar',
                    'Hayvan Aksesuarları': 'Aksesuarlar'
                };
                return applyPromotionExpiry({
                    ...item,
                    sub_category: subCategoryMapping[item.sub_category] || item.sub_category
                });
            }
            return applyPromotionExpiry(item);
        });

        // Cache the result
        setCache(cacheKey, transformedData);

        return transformedData;
    } catch (error) {
        if (timeoutId) clearTimeout(timeoutId);
        if (error.message === 'Request timed out') {
            console.warn('fetchListings timed out');
            return [];
        }
        console.error('Error in fetchListings:', error);
        throw error;
    }
};

/**
 * Fetch single listing by ID
 * @param {string} id - Listing ID
 * @returns {Promise<Object>} Listing object
 */
export const fetchListingById = async (id) => {
    const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('id', id)
        .single();


    if (data && data.category === 'Evcil Hayvanlar') {
        const subCategoryMapping = {
            'Balık': 'Balıklar',
            'Köpek': 'Köpekler',
            'Kedi': 'Kediler',
            'Küçükbaş Hayvanlar': 'Küçük Hayvanlar',
            'Kümes Hayvanları': 'Çiftlik Hayvanları',
            'At': 'Atlar',
            'Kuş': 'Kuşlar',
            'Hayvan Aksesuarları': 'Aksesuarlar'
        };
        data.sub_category = subCategoryMapping[data.sub_category] || data.sub_category;
    }
    return applyPromotionExpiry(data);
};

/**
 * Create new listing
 * @param {Object} listingData - Listing data
 * @returns {Promise<Object>} Created listing
 */
export const createListing = async (listingData) => {
    // Clear cache to ensure new listing appears immediately
    clearCache();

    // Pet subcategories are now normalized to plural in the DB, so we don't need to force singular.
    // However, if we need to support legacy or specific mapping, we can add it here.
    // For now, we prefer saving what the frontend sends (which is plural 'Kediler' etc.)

    const now = new Date();
    const expiryDate = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000); // 90 days from now

    const finalListingData = {
        ...listingData,
        expiry_date: listingData.expiry_date || expiryDate.toISOString()
    };

    const { data, error } = await supabase
        .from('listings')
        .insert([finalListingData])
        .select()
        .single();

    if (error) {
        console.error('Error creating listing:', error);
        throw error;
    }

    return data;
};

/**
 * Update listing
 * @param {string} id - Listing ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<Object>} Updated listing
 */
export const updateListing = async (id, updates) => {
    // Clear cache to ensure updates are reflected immediately
    clearCache();

    // Pet subcategories are now normalized to plural in the DB.
    // We remove the singular forcing logic to maintain consistency with the normalized data.

    const { data, error } = await supabase
        .from('listings')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('Error updating listing:', error);
        throw error;
    }

    return data;
};

/**
 * Delete listing (soft delete by setting status to 'deleted')
 * @param {string} id - Listing ID
 */
export const deleteListing = async (id) => {
    // Clear cache to ensure deleted listing invalidation
    clearCache();

    const { error } = await supabase
        .from('listings')
        .update({ status: 'deleted' })
        .eq('id', id);

    if (error) {
        console.error('Error deleting listing:', error);
        throw error;
    }
};

/**
 * Increment view count for a listing
 * @param {string} id - Listing ID
 */
export const incrementViews = async (id) => {
    // Get current listing
    const { data: listing } = await supabase
        .from('listings')
        .select('views')
        .eq('id', id)
        .single();

    if (listing) {
        // Increment views
        await supabase
            .from('listings')
            .update({ views: (listing.views || 0) + 1 })
            .eq('id', id);
    }
};

/**
 * Fetch listings by user ID
 * @param {string} userId - User ID
 * @returns {Promise<Array>} Array of user's listings
 */
export const fetchUserListings = async (userId) => {
    try {
        // First, get all listings
        const { data: listings, error: listingsError } = await supabase
            .from('listings')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (listingsError) {
            console.error('Error fetching user listings:', listingsError);
            throw listingsError;
        }

        if (!listings || listings.length === 0) {
            return [];
        }

        const listingIds = listings.map(l => l.id);

        // Fetch all favorites for these listings in one query
        const { data: favorites, error: favoritesError } = await supabase
            .from('favorites')
            .select('listing_id')
            .in('listing_id', listingIds);

        if (favoritesError) {
            console.error('Error fetching favorites counts:', favoritesError);
            // Don't fail completely, just return listings with 0 counts
            return listings.map(l => ({ ...l, favorite_count: 0 }));
        }

        // Count favorites per listing
        const favoritesCountMap = favorites.reduce((acc, fav) => {
            acc[fav.listing_id] = (acc[fav.listing_id] || 0) + 1;
            return acc;
        }, {});

        const listingsWithCounts = listings.map(listing => ({
            ...listing,
            favorite_count: favoritesCountMap[listing.id] || 0
        }));

        return listingsWithCounts.map(l => applyPromotionExpiry(l));
    } catch (error) {
        console.error('Error in fetchUserListings:', error);
        return [];
    }
};

/**
 * Fetch only category and sub_category for all active listings
 * Optimized for sidebar counts
 * @returns {Promise<Array>} Array of {category, sub_category}
 */
export const fetchCategoryCounts = async () => {
    try {

        const cacheKey = 'category_counts';
        const cachedData = getCache(cacheKey);
        if (cachedData) {
            console.log('Serving category counts from cache');
            return cachedData;
        }

        const query = supabase
            .from('listings')
            .select('category, sub_category')
            .eq('status', 'active')
            .or(`expiry_date.gt.${new Date().toISOString()},expiry_date.is.null`);

        let timeoutId;
        const timeoutPromise = new Promise((_, reject) => {
            timeoutId = setTimeout(() => reject(new Error('Request timed out')), 10000);
        });

        const { data, error } = await Promise.race([query, timeoutPromise]);
        if (timeoutId) clearTimeout(timeoutId);

        if (error) throw error;

        // Transform subcategories to plural forms to match frontend expectations
        const transformedData = (data || []).map(item => {
            if (item.category === 'Evcil Hayvanlar') {
                const subCategoryMapping = {
                    'Balık': 'Balıklar',
                    'Köpek': 'Köpekler',
                    'Kedi': 'Kediler',
                    'Küçükbaş Hayvanlar': 'Küçük Hayvanlar',
                    'Kümes Hayvanları': 'Çiftlik Hayvanları',
                    'At': 'Atlar',
                    'Kuş': 'Kuşlar',
                    'Hayvan Aksesuarları': 'Aksesuarlar'
                };
                return {
                    ...item,
                    sub_category: subCategoryMapping[item.sub_category] || item.sub_category
                };
            }
            if (item.category === 'Aile, Çocuk & Bebek') {
                const subCategoryMapping = {
                    'Bebek Bakıcısı & Kreş': 'Babysitter & Çocuk Bakımı',
                    'Oyuncak': 'Oyuncaklar',
                    'Çocuk Odası Mobilyaları': 'Bebek Odası Mobilyaları'
                };
                return {
                    ...item,
                    sub_category: subCategoryMapping[item.sub_category] || item.sub_category
                };
            }
            if (item.category === 'Emlak') {
                const subCategoryMapping = {
                    'Satılık Daireler': 'Satılık Daire',
                    'Kiralık Daireler': 'Kiralık Daire',
                    'Satılık Evler': 'Satılık Müstakil Ev',
                    'Kiralık Evler': 'Kiralık Müstakil Ev',
                    'Tatil ve Yurt Dışı Emlak': 'Tatil Evi & Yurt Dışı Emlak'
                };
                return {
                    ...item,
                    sub_category: subCategoryMapping[item.sub_category] || item.sub_category
                };
            }
            if (item.category === 'Biletler') {
                const subCategoryMapping = {
                    'Spor Etkinlikleri': 'Spor',
                    'Çocuk Etkinlikleri': 'Çocuk'
                };
                return {
                    ...item,
                    sub_category: subCategoryMapping[item.sub_category] || item.sub_category
                };
            }
            return item;
        });

        setCache(cacheKey, transformedData);
        return transformedData;
    } catch (error) {
        if (typeof timeoutId !== 'undefined') clearTimeout(timeoutId);
        console.error('Error fetching category counts:', error);
        return [];
    }
};
/**
 * Fetch total number of active listings
 * @returns {Promise<number>} Total count
 */
export const fetchTotalActiveListingsCount = async () => {
    try {
        const { count, error } = await supabase
            .from('listings')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'active')
            .or(`expiry_date.gt.${new Date().toISOString()},expiry_date.is.null`);

        if (error) throw error;
        return count || 0;
    } catch (error) {
        console.error('Error fetching total listing count:', error);
        return 0; // Fallback
    }
};

/**
 * Fetch stats for a specific category to calculate sidebar counts correctly
 * @param {string} category - Category name
 * @param {string} subCategory - Optional subcategory name to filter by
 * @returns {Promise<Array>} Array of listing metadata
 */
export const fetchCategoryStats = async (category, subCategory = null) => {
    try {
        let query = supabase
            .from('listings')
            .select('*');

        if (category.includes('Musik') && category.includes('Bücher')) {
            query = query.in('category', ['Musik, Filme & Bücher', 'Musik, Film & Bücher', 'Müzik, Film & Kitap']);
        } else {
            // Bilingual Main Category Mapping
            const mainCategoryMapping = {
                'Eğitim & Kurslar': ['Eğitim & Kurslar', 'Unterricht & Kurse'],
                'Komşu Yardımı': ['Komşu Yardımı', 'Nachbarschaftshilfe'],
                'Ücretsiz & Takas': ['Ücretsiz & Takas', 'Zu verschenken & Tauschen'],
                'Hizmetler': ['Hizmetler', 'Dienstleistungen'],
                'Biletler': ['Biletler', 'Eintrittskarten & Tickets'],
                'Müzik, Film & Kitap': ['Müzik, Film & Kitap', 'Müzik, Filme & Bücher', 'Musik, Filme & Bücher', 'Musik, Film & Bücher'],
                'Eğlence, Hobi & Mahalle': ['Eğlence, Hobi & Mahalle', 'Freizeit, Hobby & Nachbarschaft'],
                'İş İlanları': ['İş İlanları', 'Jobs'],
                'Aile, Çocuk & Bebek': ['Aile, Çocuk & Bebek', 'Familie, Kind & Baby'],
                'Evcil Hayvanlar': ['Evcil Hayvanlar', 'Haustiere'],
                'Elektronik': ['Elektronik', 'Elektronik'],
                'Moda & Güzellik': ['Moda & Güzellik', 'Mode & Beauty'],
                'Ev & Bahçe': ['Ev & Bahçe', 'Haus & Garten'],
                'Emlak': ['Emlak', 'Immobilien'],
                'Otomobil, Bisiklet & Tekne': ['Otomobil, Bisiklet & Tekne', 'Auto, Rad & Boot', 'Otomobil, Bisiklet & Tekne Servisi']
            };

            const mappedCategory = mainCategoryMapping[category];
            if (mappedCategory) {
                query = query.in('category', mappedCategory);
            } else {
                query = query.eq('category', category);
            }
        }

        // Filter by subcategory if provided
        if (subCategory) {
            const bilingualSubMapping = {
                'Kadın Giyimi': ['Kadın Giyimi', 'Kadın Giyim', 'Damenbekleidung', 'Damenmode'],
                'Erkek Giyimi': ['Erkek Giyimi', 'Erkek Giyim', 'Herrenbekleidung', 'Herrenmode'],
                'Kadın Ayakkabıları': ['Kadın Ayakkabıları', 'Damenschuhe'],
                'Erkek Ayakkabıları': ['Erkek Ayakkabıları', 'Herrenschuhe'],
                'Çanta & Aksesuarlar': ['Çanta & Aksesuarlar', 'Taschen & Accessoires'],
                'Saat & Takı': ['Saat & Takı', 'Uhren & Schmuck'],
                'Güzellik & Sağlık': ['Güzellik & Sağlık', 'Beauty & Gesundheit', 'Kişisel Bakım & Sağlık'],
                'Diğer Moda & Güzellik': ['Diğer Moda & Güzellik', 'Sonstige Mode & Beauty']
            };

            const mappedSubCategory = bilingualSubMapping[subCategory];
            if (mappedSubCategory) {
                query = query.in('sub_category', mappedSubCategory);
            } else {
                query = query.eq('sub_category', subCategory);
            }
        }

        query = query.eq('status', 'active')
            .gt('expiry_date', new Date().toISOString());

        const reverseSubCategoryMapping = {
            'Balıklar': 'Balık',
            'Köpekler': 'Köpek',
            'Kediler': 'Kedi',
            'Küçük Hayvanlar': 'Küçükbaş Hayvanlar',
            'Çiftlik Hayvanları': 'Kümes Hayvanları',
            'Atlar': 'At',
            'Kuşlar': 'Kuş',
            'Aksesuarlar': 'Hayvan Aksesuarları'
        };

        const { data, error } = await query;

        // Transform data to use plural forms for pet subcategories to match frontend expectations
        const transformedData = (data || []).map(item => {
            if (item.category === 'Evcil Hayvanlar') {
                const subCategoryMapping = {
                    'Balık': 'Balıklar',
                    'Köpek': 'Köpekler',
                    'Kedi': 'Kediler',
                    'Küçükbaş Hayvanlar': 'Küçük Hayvanlar',
                    'Kümes Hayvanları': 'Çiftlik Hayvanları',
                    'At': 'Atlar',
                    'Kuş': 'Kuşlar',
                    'Hayvan Aksesuarları': 'Aksesuarlar'
                };
                return applyPromotionExpiry({
                    ...item,
                    sub_category: subCategoryMapping[item.sub_category] || item.sub_category
                });
            }
            return applyPromotionExpiry(item);
        });

        if (error) throw error;
        return transformedData;
    } catch (error) {
        console.error('Error fetching category stats:', error);
        return [];
    }
};

/**
 * DEBUG: Fetch raw listings without filters to inspect DB content
 */
export const fetchRawDebugListings = async () => {
    const { data, error } = await supabase
        .from('listings')
        .select('id, title, category, sub_category, status, created_at')
        .limit(20);

    if (error) {
        console.error('Debug fetch error:', error);
        return [{ error: error.message }];
    }
    return data;
};

/**
 * Check if a user has remaining listing slots for the current month
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Object containing canAdd, limit, currentCount, and tier
 */
export const checkUserListingLimit = async (userId) => {
    try {
        // 1. Fetch user subscription details
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('subscription_tier, extra_paid_listings, subscription_expiry')
            .eq('id', userId)
            .single();

        if (profileError) throw profileError;

        // 2. Count active listings created in the last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const { count, error: countError } = await supabase
            .from('listings')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId)
            .neq('status', 'deleted')
            .gte('created_at', thirtyDaysAgo.toISOString());

        if (countError) throw countError;

        // 3. Define tier limits
        const TIER_LIMITS = {
            'free': 20,
            'pack1': 40,
            'pack2': 70,
            'unlimited': 999999
        };

        const tier = profile.subscription_tier || 'free';
        let baseLimit = TIER_LIMITS[tier] || 20;

        // Handle expired subscriptions (revert to free)
        if (profile.subscription_expiry && new Date(profile.subscription_expiry) < new Date()) {
            baseLimit = 20;
        }

        const totalLimit = baseLimit + (profile.extra_paid_listings || 0);
        const currentCount = count || 0;

        return {
            canAdd: currentCount < totalLimit,
            limit: totalLimit,
            currentCount: currentCount,
            tier: tier,
            isUnlimited: tier === 'unlimited',
            remaining: Math.max(0, totalLimit - currentCount)
        };
    } catch (error) {
        console.error('Error checking listing limit:', error);
        // Fallback to allowing in case of error, but log it
        return { canAdd: true, limit: 20, currentCount: 0, tier: 'free' };
    }
};
