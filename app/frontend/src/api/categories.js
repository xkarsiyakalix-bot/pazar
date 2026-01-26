import { supabase } from '../lib/supabase';

/**
 * Fetch all categories with their subcategories
 * @returns {Promise<Array>} Array of categories with nested subcategories
 */
export const fetchCategories = async () => {
    try {
        const { data: categories, error: categoriesError } = await supabase
            .from('categories')
            .select('*')
            .order('display_order', { ascending: true });

        if (categoriesError) {
            console.error('Error fetching categories:', categoriesError);
            throw categoriesError;
        }

        // Fetch subcategories for each category
        const categoriesWithSubs = await Promise.all(
            (categories || []).map(async (category) => {
                const { data: subcategories, error: subsError } = await supabase
                    .from('subcategories')
                    .select('*')
                    .eq('category_id', category.id)
                    .order('display_order', { ascending: true });

                if (subsError) {
                    console.error('Error fetching subcategories:', subsError);
                }

                return {
                    ...category,
                    subcategories: subcategories || []
                };
            })
        );

        return categoriesWithSubs;
    } catch (error) {
        console.error('Error in fetchCategories:', error);
        return [];
    }
};

/**
 * Fetch single category by slug
 * @param {string} slug - Category slug
 * @returns {Promise<Object>} Category object with subcategories
 */
export const fetchCategoryBySlug = async (slug) => {
    try {
        const { data: category, error: categoryError } = await supabase
            .from('categories')
            .select('*')
            .eq('slug', slug)
            .single();

        if (categoryError) {
            console.error('Error fetching category:', categoryError);
            throw categoryError;
        }

        // Fetch subcategories
        const { data: subcategories, error: subsError } = await supabase
            .from('subcategories')
            .select('*')
            .eq('category_id', category.id)
            .order('display_order', { ascending: true });

        if (subsError) {
            console.error('Error fetching subcategories:', subsError);
        }

        return {
            ...category,
            subcategories: subcategories || []
        };
    } catch (error) {
        console.error('Error in fetchCategoryBySlug:', error);
        return null;
    }
};

/**
 * Fetch subcategory by category slug and subcategory slug
 * @param {string} categorySlug - Category slug
 * @param {string} subcategorySlug - Subcategory slug
 * @returns {Promise<Object>} Subcategory object
 */
export const fetchSubcategoryBySlug = async (categorySlug, subcategorySlug) => {
    try {
        // First get category
        const { data: category } = await supabase
            .from('categories')
            .select('id')
            .eq('slug', categorySlug)
            .single();

        if (!category) return null;

        // Then get subcategory
        const { data: subcategory, error } = await supabase
            .from('subcategories')
            .select('*')
            .eq('category_id', category.id)
            .eq('slug', subcategorySlug)
            .single();

        if (error) {
            console.error('Error fetching subcategory:', error);
            throw error;
        }

        return subcategory;
    } catch (error) {
        console.error('Error in fetchSubcategoryBySlug:', error);
        return null;
    }
};

/**
 * Fetch categories with real listing counts from Supabase
 * @returns {Promise<Array>} Array of categories with real counts
 */
export const fetchCategoriesWithCounts = async () => {
    try {
        // Fetch all listings to count by category and subcategory
        const { data: listings, error: listingsError } = await supabase
            .from('listings')
            .select('category, sub_category');

        if (listingsError) {
            console.error('Error fetching listings for counts:', listingsError);
            throw listingsError;
        }

        // Count listings by category
        const categoryCounts = {};
        const subcategoryCounts = {};

        // Subcategory normalization map (DB name -> Display name)
        const subCategoryMap = {
            'Babysitter & Çocuk Bakımı': 'Bebek Bakıcısı & Kreş',
            'Otomobil, Bisiklet & Tekne': 'Otomobil, Bisiklet & Tekne',
            'Ev & Bahçe Hizmetleri': 'Ev & Bahçe',
            'Sanatçılar & Müzisyenler': 'Sanatçı & Müzisyen',
            'Seyahat & Etkinlik Hizmetleri': 'Seyahat & Etkinlik',
            'Nakliye & Taşıma': 'Taşımacılık & Nakliye',
            'Çocuk Etkinlikleri': 'Çocuk',
            'Hayvan Bakımı & Eğitim': 'Hayvan Bakımı & Eğitimi',
            'Tatil ve Yurt Dışı Emlak': 'Tatil Evi & Yurt Dışı Emlak',
            'Satılık Daireler': 'Satılık Daire',
            'Kiralık Daireler': 'Kiralık Daire',
            'Satılık Evler': 'Satılık Müstakil Ev',
            'Kiralık Evler': 'Kiralık Müstakil Ev',
            // Add more mappings as needed
        };

        listings.forEach(listing => {
            let category = listing.category || 'Sonstige';
            let subCategory = listing.sub_category;

            // Normalize category name
            if (category === 'Verschenken & Tauschen' || category === 'Zu verschenken & Tauschen') {
                category = 'Ücretsiz & Takas';
            } else if (category === 'Musik, Film & Bücher' || category === 'Musik, Filme & Bücher') {
                category = 'Müzik, Film & Kitap';
            }

            // Count main categories
            categoryCounts[category] = (categoryCounts[category] || 0) + 1;

            // Count subcategories with normalization
            if (subCategory) {
                // Normalize subcategory name if mapping exists
                const normalizedSubCat = subCategoryMap[subCategory] || subCategory;
                const key = `${category}|${normalizedSubCat}`;
                subcategoryCounts[key] = (subcategoryCounts[key] || 0) + 1;
            }
        });

        // Define category structure with real counts
        const categories = [
            { name: 'Tüm Kategoriler', count: listings.length },
            {
                name: 'Otomobil, Bisiklet & Tekne',
                count: categoryCounts['Otomobil, Bisiklet & Tekne'] || categoryCounts['Auto, Rad & Boot'] || 0,
                subcategories: [
                    { name: 'Otomobiller', count: subcategoryCounts['Otomobil, Bisiklet & Tekne|Otomobiller'] || subcategoryCounts['Auto, Rad & Boot|Autos'] || 0 },
                    { name: 'Oto Parça & Lastik', count: subcategoryCounts['Otomobil, Bisiklet & Tekne|Oto Parça & Lastik'] || subcategoryCounts['Auto, Rad & Boot|Autoteile & Reifen'] || 0 },
                    { name: 'Tekne & Tekne Malzemeleri', count: subcategoryCounts['Otomobil, Bisiklet & Tekne|Tekne & Tekne Malzemeleri'] || subcategoryCounts['Auto, Rad & Boot|Boote & Bootszubehör'] || 0 },
                    { name: 'Bisiklet & Aksesuarlar', count: subcategoryCounts['Otomobil, Bisiklet & Tekne|Bisiklet & Aksesuarlar'] || subcategoryCounts['Auto, Rad & Boot|Fahrräder & Zubehör'] || 0 },
                    { name: 'Motosiklet & Scooter', count: subcategoryCounts['Otomobil, Bisiklet & Tekne|Motosiklet & Scooter'] || subcategoryCounts['Auto, Rad & Boot|Motorräder & Motorroller'] || 0 },
                    { name: 'Motosiklet Parça & Aksesuarlar', count: subcategoryCounts['Otomobil, Bisiklet & Tekne|Motosiklet Parça & Aksesuarlar'] || subcategoryCounts['Auto, Rad & Boot|Motorradteile & Zubehör'] || 0 },
                    { name: 'Ticari Araçlar & Römorklar', count: subcategoryCounts['Otomobil, Bisiklet & Tekne|Ticari Araçlar & Römorklar'] || subcategoryCounts['Auto, Rad & Boot|Nutzfahrzeuge & Anhänger'] || 0 },
                    { name: 'Tamir & Servis', count: subcategoryCounts['Otomobil, Bisiklet & Tekne|Tamir & Servis'] || subcategoryCounts['Auto, Rad & Boot|Reparaturen & Dienstleistungen'] || 0 },
                    { name: 'Karavan & Motokaravan', count: subcategoryCounts['Otomobil, Bisiklet & Tekne|Karavan & Motokaravan'] || subcategoryCounts['Auto, Rad & Boot|Wohnwagen & Wohnmobile'] || 0 },
                    { name: 'Diğer Otomobil, Bisiklet & Tekne', count: subcategoryCounts['Otomobil, Bisiklet & Tekne|Diğer Otomobil, Bisiklet & Tekne'] || subcategoryCounts['Auto, Rad & Boot|Weiteres Auto, Rad & Boot'] || 0 },
                ]
            },
            {
                name: 'Emlak',
                count: categoryCounts['Emlak'] || 0,
                subcategories: [
                    { name: 'Geçici Konaklama & Paylaşımlı Ev', count: subcategoryCounts['Emlak|Geçici Konaklama & Paylaşımlı Ev'] || 0 },
                    { name: 'Konteyner', count: subcategoryCounts['Emlak|Konteyner'] || 0 },
                    { name: 'Satılık Daire', count: subcategoryCounts['Emlak|Satılık Daire'] || 0 },
                    { name: 'Tatil Evi & Yurt Dışı Emlak', count: subcategoryCounts['Emlak|Tatil Evi & Yurt Dışı Emlak'] || 0 },
                    { name: 'Garaj & Otopark', count: subcategoryCounts['Emlak|Garaj & Otopark'] || 0 },
                    { name: 'Ticari Emlak', count: subcategoryCounts['Emlak|Ticari Emlak'] || 0 },
                    { name: 'Arsa & Bahçe', count: subcategoryCounts['Emlak|Arsa & Bahçe'] || 0 },
                    { name: 'Satılık Müstakil Ev', count: subcategoryCounts['Emlak|Satılık Müstakil Ev'] || 0 },
                    { name: 'Kiralık Müstakil Ev', count: subcategoryCounts['Emlak|Kiralık Müstakil Ev'] || 0 },
                    { name: 'Kiralık Daire', count: subcategoryCounts['Emlak|Kiralık Daire'] || 0 },
                    { name: 'Yeni Projeler', count: subcategoryCounts['Emlak|Yeni Projeler'] || 0 },
                    { name: 'Taşımacılık & Nakliye', count: subcategoryCounts['Emlak|Taşımacılık & Nakliye'] || 0 },
                    { name: 'Diğer Emlak', count: subcategoryCounts['Emlak|Diğer Emlak'] || 0 },
                    { name: 'Satılık Yazlık', count: subcategoryCounts['Emlak|Satılık Yazlık'] || 0 },
                ]
            },
            {
                name: 'Ev & Bahçe',
                count: categoryCounts['Ev & Bahçe'] || 0,
                subcategories: [
                    { name: 'Banyo', count: subcategoryCounts['Ev & Bahçe|Banyo'] || 0 },
                    { name: 'Ofis', count: subcategoryCounts['Ev & Bahçe|Ofis'] || 0 },
                    { name: 'Dekorasyon', count: subcategoryCounts['Ev & Bahçe|Dekorasyon'] || 0 },
                    { name: 'Ev Hizmetleri', count: subcategoryCounts['Ev & Bahçe|Ev Hizmetleri'] || 0 },
                    { name: 'Bahçe Malzemeleri & Bitkiler', count: subcategoryCounts['Ev & Bahçe|Bahçe Malzemeleri & Bitkiler'] || 0 },
                    { name: 'Ev Tekstili', count: subcategoryCounts['Ev & Bahçe|Ev Tekstili'] || 0 },
                    { name: 'Ev Tadilatı', count: subcategoryCounts['Ev & Bahçe|Ev Tadilatı'] || 0 },
                    { name: 'Mutfak & Yemek Odası', count: subcategoryCounts['Ev & Bahçe|Mutfak & Yemek Odası'] || 0 },
                    { name: 'Lamba & Aydınlatma', count: subcategoryCounts['Ev & Bahçe|Lamba & Aydınlatma'] || 0 },
                    { name: 'Yatak Odası', count: subcategoryCounts['Ev & Bahçe|Yatak Odası'] || 0 },
                    { name: 'Oturma Odası', count: subcategoryCounts['Ev & Bahçe|Oturma Odası'] || 0 },
                    { name: 'Diğer Ev & Bahçe', count: subcategoryCounts['Ev & Bahçe|Diğer Ev & Bahçe'] || 0 },
                ]
            },
            {
                name: 'Moda & Güzellik',
                count: categoryCounts['Moda & Güzellik'] || 0,
                subcategories: [
                    { name: 'Güzellik & Sağlık', count: subcategoryCounts['Moda & Güzellik|Güzellik & Sağlık'] || 0 },
                    { name: 'Kadın Giyimi', count: subcategoryCounts['Moda & Güzellik|Kadın Giyimi'] || 0 },
                    { name: 'Kadın Ayakkabıları', count: subcategoryCounts['Moda & Güzellik|Kadın Ayakkabıları'] || 0 },
                    { name: 'Erkek Giyimi', count: subcategoryCounts['Moda & Güzellik|Erkek Giyimi'] || 0 },
                    { name: 'Erkek Ayakkabıları', count: subcategoryCounts['Moda & Güzellik|Erkek Ayakkabıları'] || 0 },
                    { name: 'Çanta & Aksesuarlar', count: subcategoryCounts['Moda & Güzellik|Çanta & Aksesuarlar'] || 0 },
                    { name: 'Saat & Takı', count: subcategoryCounts['Moda & Güzellik|Saat & Takı'] || 0 },
                    { name: 'Diğer Moda & Güzellik', count: subcategoryCounts['Moda & Güzellik|Diğer Moda & Güzellik'] || 0 },
                ]
            },
            {
                name: 'Elektronik',
                count: categoryCounts['Elektronik'] || 0,
                subcategories: [
                    { name: 'Ses & Hifi', count: subcategoryCounts['Elektronik|Ses & Hifi'] || 0 },
                    { name: 'Elektronik Hizmetler', count: subcategoryCounts['Elektronik|Elektronik Hizmetler'] || 0 },
                    { name: 'Fotoğraf & Kamera', count: subcategoryCounts['Elektronik|Fotoğraf & Kamera'] || 0 },
                    { name: 'Cep Telefonu & Telefon', count: subcategoryCounts['Elektronik|Cep Telefonu & Telefon'] || 0 },
                    { name: 'Ev Aletleri', count: subcategoryCounts['Elektronik|Ev Aletleri'] || 0 },
                    { name: 'Konsollar', count: subcategoryCounts['Elektronik|Konsollar'] || 0 },
                    { name: 'Dizüstü Bilgisayarlar', count: subcategoryCounts['Elektronik|Dizüstü Bilgisayarlar'] || 0 },
                    { name: 'Bilgisayarlar', count: subcategoryCounts['Elektronik|Bilgisayarlar'] || 0 },
                    { name: 'Bilgisayar Aksesuarları & Yazılım', count: subcategoryCounts['Elektronik|Bilgisayar Aksesuarları & Yazılım'] || 0 },
                    { name: 'Tabletler & E-Okuyucular', count: subcategoryCounts['Elektronik|Tabletler & E-Okuyucular'] || 0 },
                    { name: 'TV & Video', count: subcategoryCounts['Elektronik|TV & Video'] || 0 },
                    { name: 'Video Oyunları', count: subcategoryCounts['Elektronik|Video Oyunları'] || 0 },
                    { name: 'Diğer Elektronik', count: subcategoryCounts['Elektronik|Diğer Elektronik'] || 0 },
                ]
            },
            {
                name: 'Evcil Hayvanlar',
                count: categoryCounts['Evcil Hayvanlar'] || 0,
                subcategories: [
                    { name: 'Balıklar', count: subcategoryCounts['Evcil Hayvanlar|Balıklar'] || 0 },
                    { name: 'Köpekler', count: subcategoryCounts['Evcil Hayvanlar|Köpekler'] || 0 },
                    { name: 'Kediler', count: subcategoryCounts['Evcil Hayvanlar|Kediler'] || 0 },
                    { name: 'Küçük Hayvanlar', count: subcategoryCounts['Evcil Hayvanlar|Küçük Hayvanlar'] || 0 },
                    { name: 'Çiftlik Hayvanları', count: subcategoryCounts['Evcil Hayvanlar|Çiftlik Hayvanları'] || 0 },
                    { name: 'Atlar', count: subcategoryCounts['Evcil Hayvanlar|Atlar'] || 0 },
                    { name: 'Hayvan Bakımı & Eğitimi', count: subcategoryCounts['Evcil Hayvanlar|Hayvan Bakımı & Eğitimi'] || 0 },
                    { name: 'Kayıp Hayvanlar', count: subcategoryCounts['Evcil Hayvanlar|Kayıp Hayvanlar'] || 0 },
                    { name: 'Kuşlar', count: subcategoryCounts['Evcil Hayvanlar|Kuşlar'] || 0 },
                    { name: 'Aksesuarlar', count: subcategoryCounts['Evcil Hayvanlar|Aksesuarlar'] || 0 },
                ]
            },
            {
                name: 'Aile, Çocuk & Bebek',
                count: categoryCounts['Aile, Çocuk & Bebek'] || 0,
                subcategories: [
                    { name: 'Yaşlı Bakımı', count: subcategoryCounts['Aile, Çocuk & Bebek|Yaşlı Bakımı'] || 0 },
                    { name: 'Bebek & Çocuk Giyimi', count: subcategoryCounts['Aile, Çocuk & Bebek|Bebek & Çocuk Giyimi'] || 0 },
                    { name: 'Bebek & Çocuk Ayakkabıları', count: subcategoryCounts['Aile, Çocuk & Bebek|Bebek & Çocuk Ayakkabıları'] || 0 },
                    { name: 'Bebek Gereçleri', count: subcategoryCounts['Aile, Çocuk & Bebek|Bebek Gereçleri'] || 0 },
                    { name: 'Bebek Koltuğu & Oto Koltukları', count: subcategoryCounts['Aile, Çocuk & Bebek|Bebek Koltuğu & Oto Koltukları'] || 0 },
                    { name: 'Babysitter & Çocuk Bakımı', count: subcategoryCounts['Aile, Çocuk & Bebek|Babysitter & Çocuk Bakımı'] || 0 },
                    { name: 'Bebek Arabaları & Pusetler', count: subcategoryCounts['Aile, Çocuk & Bebek|Bebek Arabaları & Pusetler'] || 0 },
                    { name: 'Bebek Odası Mobilyaları', count: subcategoryCounts['Aile, Çocuk & Bebek|Bebek Odası Mobilyaları'] || 0 },
                    { name: 'Oyuncaklar', count: subcategoryCounts['Aile, Çocuk & Bebek|Oyuncaklar'] || 0 },
                    { name: 'Diğer Aile, Çocuk & Bebek', count: subcategoryCounts['Aile, Çocuk & Bebek|Diğer Aile, Çocuk & Bebek'] || 0 },
                ]
            },
            {
                name: 'İş İlanları',
                count: categoryCounts['İş İlanları'] || 0,
                subcategories: [
                    { name: 'Mesleki Eğitim', count: subcategoryCounts['İş İlanları|Mesleki Eğitim'] || 0 },
                    { name: 'İnşaat, El Sanatları & Üretim', count: subcategoryCounts['İş İlanları|İnşaat, El Sanatları & Üretim'] || 0 },
                    { name: 'Ofis İşleri & Yönetim', count: subcategoryCounts['İş İlanları|Ofis İşleri & Yönetim'] || 0 },
                    { name: 'Gastronomi & Turizm', count: subcategoryCounts['İş İlanları|Gastronomi & Turizm'] || 0 },
                    { name: 'Müşteri Hizmetleri & Çağrı Merkezi', count: subcategoryCounts['İş İlanları|Müşteri Hizmetleri & Çağrı Merkezi'] || 0 },
                    { name: 'Mini & Ek İşler', count: subcategoryCounts['İş İlanları|Mini & Ek İşler'] || 0 },
                    { name: 'Staj', count: subcategoryCounts['İş İlanları|Staj'] || 0 },
                    { name: 'Sosyal Sektör & Bakım', count: subcategoryCounts['İş İlanları|Sosyal Sektör & Bakım'] || 0 },
                    { name: 'Nakliye, Lojistik & Trafik', count: subcategoryCounts['İş İlanları|Nakliye, Lojistik & Trafik'] || 0 },
                    { name: 'Satış, Satın Alma & Pazarlama', count: subcategoryCounts['İş İlanları|Satış, Satın Alma & Pazarlama'] || 0 },
                    { name: 'Diğer İş İlanları', count: subcategoryCounts['İş İlanları|Diğer İş İlanları'] || 0 },
                ]
            },
            {
                name: 'Eğlence, Hobi & Mahalle',
                count: categoryCounts['Eğlence, Hobi & Mahalle'] || categoryCounts['Freizeit, Hobby & Nachbarschaft'] || 0,
                subcategories: [
                    { name: 'Ezoterizm & Spiritüalizm', count: subcategoryCounts['Eğlence, Hobi & Mahalle|Ezoterizm & Spiritüalizm'] || subcategoryCounts['Freizeit, Hobby & Nachbarschaft|Esoterik & Spirituelles'] || 0 },
                    { name: 'Yiyecek & İçecek', count: subcategoryCounts['Eğlence, Hobi & Mahalle|Yiyecek & İçecek'] || subcategoryCounts['Freizeit, Hobby & Nachbarschaft|Essen & Trinken'] || 0 },
                    { name: 'Boş Zaman Aktiviteleri', count: subcategoryCounts['Eğlence, Hobi & Mahalle|Boş Zaman Aktiviteleri'] || subcategoryCounts['Freizeit, Hobby & Nachbarschaft|Freizeitaktivitäten'] || 0 },
                    { name: 'El Sanatları & Hobi', count: subcategoryCounts['Eğlence, Hobi & Mahalle|El Sanatları & Hobi'] || subcategoryCounts['Freizeit, Hobby & Nachbarschaft|Handarbeit, Basteln & Kunsthandwerk'] || 0 },
                    { name: 'Sanat & Antikalar', count: subcategoryCounts['Eğlence, Hobi & Mahalle|Sanat & Antikalar'] || subcategoryCounts['Freizeit, Hobby & Nachbarschaft|Kunst & Antiquitäten'] || 0 },
                    { name: 'Sanatçılar & Müzisyenler', count: subcategoryCounts['Eğlence, Hobi & Mahalle|Sanatçılar & Müzisyenler'] || subcategoryCounts['Freizeit, Hobby & Nachbarschaft|Künstler/-in & Musiker/-in'] || 0 },
                    { name: 'Model Yapımı', count: subcategoryCounts['Eğlence, Hobi & Mahalle|Model Yapımı'] || subcategoryCounts['Freizeit, Hobby & Nachbarschaft|Modellbau'] || 0 },
                    { name: 'Seyahat & Etkinlik Hizmetleri', count: subcategoryCounts['Eğlence, Hobi & Mahalle|Seyahat & Etkinlik Hizmetleri'] || subcategoryCounts['Freizeit, Hobby & Nachbarschaft|Reise & Eventservices'] || 0 },
                    { name: 'Koleksiyon', count: subcategoryCounts['Eğlence, Hobi & Mahalle|Koleksiyon'] || subcategoryCounts['Freizeit, Hobby & Nachbarschaft|Sammeln'] || 0 },
                    { name: 'Spor & Kamp', count: subcategoryCounts['Eğlence, Hobi & Mahalle|Spor & Kamp'] || subcategoryCounts['Freizeit, Hobby & Nachbarschaft|Sport & Camping'] || 0 },
                    { name: 'Bit Pazarı', count: subcategoryCounts['Eğlence, Hobi & Mahalle|Bit Pazarı'] || subcategoryCounts['Freizeit, Hobby & Nachbarschaft|Trödel'] || 0 },
                    { name: 'Kayıp & Buluntu', count: subcategoryCounts['Eğlence, Hobi & Mahalle|Kayıp & Buluntu'] || subcategoryCounts['Freizeit, Hobby & Nachbarschaft|Verloren & Gefunden'] || 0 },
                    { name: 'Diğer Eğlence, Hobi & Mahalle', count: subcategoryCounts['Eğlence, Hobi & Mahalle|Diğer Eğlence, Hobi & Mahalle'] || subcategoryCounts['Freizeit, Hobby & Nachbarschaft|Weiteres Freizeit, Hobby & Nachbarschaft'] || 0 },
                ]
            },
            {
                name: 'Müzik, Film & Kitap',
                count: categoryCounts['Müzik, Film & Kitap'] || categoryCounts['Musik, Filme & Bücher'] || 0,
                subcategories: [
                    { name: 'Kitap & Dergi', count: subcategoryCounts['Müzik, Film & Kitap|Kitap & Dergi'] || subcategoryCounts['Musik, Filme & Bücher|Bücher & Zeitschriften'] || 0 },
                    { name: 'Ofis & Kırtasiye', count: subcategoryCounts['Müzik, Film & Kitap|Ofis & Kırtasiye'] || subcategoryCounts['Musik, Filme & Bücher|Büro & Schreibwaren'] || 0 },
                    { name: 'Çizgi Romanlar', count: subcategoryCounts['Müzik, Film & Kitap|Çizgi Romanlar'] || subcategoryCounts['Musik, Filme & Bücher|Comics'] || 0 },
                    { name: 'Ders Kitapları, Okul & Eğitim', count: subcategoryCounts['Müzik, Film & Kitap|Ders Kitapları, Okul & Eğitim'] || subcategoryCounts['Musik, Filme & Bücher|Fachbücher, Schule & Studium'] || 0 },
                    { name: 'Film & DVD', count: subcategoryCounts['Müzik, Film & Kitap|Film & DVD'] || subcategoryCounts['Musik, Filme & Bücher|Film & DVD'] || 0 },
                    { name: 'Müzik & CDler', count: subcategoryCounts['Müzik, Film & Kitap|Müzik & CDler'] || subcategoryCounts['Musik, Filme & Bücher|Musik & CDs'] || 0 },
                    { name: 'Müzik Enstrümanları', count: subcategoryCounts['Müzik, Film & Kitap|Müzik Enstrümanları'] || subcategoryCounts['Musik, Filme & Bücher|Musikinstrumente'] || 0 },
                    { name: 'Diğer Müzik, Film & Kitap', count: subcategoryCounts['Müzik, Film & Kitap|Diğer Müzik, Film & Kitap'] || subcategoryCounts['Musik, Filme & Bücher|Weitere Musik, Filme & Bücher'] || 0 },
                ]
            },
            {
                name: 'Biletler',
                count: categoryCounts['Biletler'] || categoryCounts['Eintrittskarten & Tickets'] || 0,
                subcategories: [
                    { name: 'Tren & Toplu Taşıma', count: subcategoryCounts['Biletler|Tren & Toplu Taşıma'] || subcategoryCounts['Eintrittskarten & Tickets|Bahn & ÖPNV'] || 0 },
                    { name: 'Komedi & Kabare', count: subcategoryCounts['Biletler|Komedi & Kabare'] || subcategoryCounts['Eintrittskarten & Tickets|Comedy & Kabarett'] || 0 },
                    { name: 'Hediye Çekleri', count: subcategoryCounts['Biletler|Hediye Çekleri'] || subcategoryCounts['Eintrittskarten & Tickets|Gutscheine'] || 0 },
                    { name: 'Çocuk', count: subcategoryCounts['Biletler|Çocuk'] || subcategoryCounts['Eintrittskarten & Tickets|Kinder'] || 0 },
                    { name: 'Konserler', count: subcategoryCounts['Biletler|Konserler'] || subcategoryCounts['Eintrittskarten & Tickets|Konzerte'] || 0 },
                    { name: 'Spor', count: subcategoryCounts['Biletler|Spor'] || subcategoryCounts['Eintrittskarten & Tickets|Sport'] || 0 },
                    { name: 'Tiyatro & Müzikal', count: subcategoryCounts['Biletler|Tiyatro & Müzikal'] || subcategoryCounts['Eintrittskarten & Tickets|Theater & Musical'] || 0 },
                    { name: 'Diğer Biletler', count: subcategoryCounts['Biletler|Diğer Biletler'] || subcategoryCounts['Eintrittskarten & Tickets|Weitere Eintrittskarten & Tickets'] || 0 },
                ]
            },
            {
                name: 'Hizmetler',
                count: categoryCounts['Hizmetler'] || 0,
                subcategories: [
                    { name: 'Yaşlı Bakımı', count: subcategoryCounts['Hizmetler|Yaşlı Bakımı'] || 0 },
                    { name: 'Otomobil, Bisiklet & Tekne', count: subcategoryCounts['Hizmetler|Otomobil, Bisiklet & Tekne'] || 0 },
                    { name: 'Bebek Bakıcısı & Kreş', count: subcategoryCounts['Hizmetler|Bebek Bakıcısı & Kreş'] || 0 },
                    { name: 'Elektronik', count: subcategoryCounts['Hizmetler|Elektronik'] || 0 },
                    { name: 'Ev & Bahçe', count: subcategoryCounts['Hizmetler|Ev & Bahçe'] || 0 },
                    { name: 'Sanatçı & Müzisyen', count: subcategoryCounts['Hizmetler|Sanatçı & Müzisyen'] || 0 },
                    { name: 'Seyahat & Etkinlik', count: subcategoryCounts['Hizmetler|Seyahat & Etkinlik'] || 0 },
                    { name: 'Evcil Hayvan Bakımı & Eğitim', count: subcategoryCounts['Hizmetler|Evcil Hayvan Bakımı & Eğitim'] || 0 },
                    { name: 'Taşımacılık & Nakliye', count: subcategoryCounts['Hizmetler|Taşımacılık & Nakliye'] || 0 },
                    { name: 'Diğer Hizmetler', count: subcategoryCounts['Hizmetler|Diğer Hizmetler'] || 0 },
                ]
            },
            {
                name: 'Ücretsiz & Takas',
                count: categoryCounts['Ücretsiz & Takas'] || 0,
                subcategories: [
                    { name: 'Takas', count: subcategoryCounts['Ücretsiz & Takas|Takas'] || 0 },
                    { name: 'Kiralama', count: subcategoryCounts['Ücretsiz & Takas|Kiralama'] || 0 },
                    { name: 'Ücretsiz', count: subcategoryCounts['Ücretsiz & Takas|Ücretsiz'] || 0 },
                ]
            },
            {
                name: 'Eğitim & Kurslar',
                count: categoryCounts['Eğitim & Kurslar'] || 0,
                subcategories: [
                    { name: 'Bilgisayar Kursları', count: subcategoryCounts['Eğitim & Kurslar|Bilgisayar Kursları'] || 0 },
                    { name: 'Ezoterizm & Spiritüalizm', count: subcategoryCounts['Eğitim & Kurslar|Ezoterizm & Spiritüalizm'] || 0 },
                    { name: 'Yemek & Pastacılık', count: subcategoryCounts['Eğitim & Kurslar|Yemek & Pastacılık'] || 0 },
                    { name: 'Sanat & Tasarım', count: subcategoryCounts['Eğitim & Kurslar|Sanat & Tasarım'] || 0 },
                    { name: 'Müzik & Şan', count: subcategoryCounts['Eğitim & Kurslar|Müzik & Şan'] || 0 },
                    { name: 'Özel Ders', count: subcategoryCounts['Eğitim & Kurslar|Özel Ders'] || 0 },
                    { name: 'Spor Kursları', count: subcategoryCounts['Eğitim & Kurslar|Spor Kursları'] || 0 },
                    { name: 'Dil Kursları', count: subcategoryCounts['Eğitim & Kurslar|Dil Kursları'] || 0 },
                    { name: 'Dans Kursları', count: subcategoryCounts['Eğitim & Kurslar|Dans Kursları'] || 0 },
                    { name: 'Sürekli Eğitim', count: subcategoryCounts['Eğitim & Kurslar|Sürekli Eğitim'] || 0 },
                    { name: 'Diğer Eğitim & Kurslar', count: subcategoryCounts['Eğitim & Kurslar|Diğer Eğitim & Kurslar'] || 0 },
                ]
            },
            {
                name: 'Komşu Yardımı',
                count: categoryCounts['Komşu Yardımı'] || 0,
                subcategories: [
                    { name: 'Komşu Yardımı', count: subcategoryCounts['Komşu Yardımı|Komşu Yardımı'] || 0 },
                ]
            }
        ];

        return categories;
    } catch (error) {
        console.error('Error in fetchCategoriesWithCounts:', error);
        return [];
    }
};
