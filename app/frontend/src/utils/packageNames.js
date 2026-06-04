/**
 * Merkezi paket adı çözümleyici.
 * Veritabanındaki package_type değerini kullanıcıya gösterilecek Türkçe isme çevirir.
 */
export const PACKAGE_NAMES = {
    // Görünürlük paketleri
    'bump':                    'Yukarı Çıkar',
    'highlight':               'Öne Çıkan',
    'multi-bump':              'Tekrarlı Yukarı Çıkarma',
    'z_multi_bump':            'Tekrarlı Yukarı Çıkarma',
    'premium':                 'Premium',
    'z_premium':               'Premium',
    'plus':                    'Plus',
    'budget':                  'Öne Çıkan',
    'top':                     'Üst Sıra',
    'galerie':                 'Vitrin',
    'gallery':                 'Vitrin',
    'galeri':                  'Vitrin',
    'vitrin':                  'Vitrin',
    // Abonelikler
    'subscription_unlimited':  'Sınırsız Abonelik',
    'subscription_pack1':      'Kurumsal Paket 1',
    'subscription_pack2':      'Kurumsal Paket 2',
    // Diğer
    'extension':               'Süre Uzatma',
    'verlängerung':            'Süre Uzatma',
    'basic':                   'Standart',
};

/**
 * package_type değerinden kullanıcı dostu paket adını döndürür.
 * @param {string} packageType - Veritabanındaki package_type değeri
 * @param {string} [fallback] - Tanımlanamadığında gösterilecek değer (varsayılan: orijinal değer)
 * @returns {string}
 */
export const getPackageName = (packageType, fallback) => {
    if (!packageType) return fallback ?? '—';
    const key = packageType.toLowerCase().trim();
    return PACKAGE_NAMES[key] ?? fallback ?? packageType;
};
