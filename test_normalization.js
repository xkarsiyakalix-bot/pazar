// Test normalization logic
const subCategoryMap = {
    'Babysitter & Çocuk Bakımı': 'Bebek Bakıcısı & Kreş',
    'Otomobil, Bisiklet & Tekne': 'Otomobil, Bisiklet & Tekne',
    'Ev & Bahçe Hizmetleri': 'Ev & Bahçe',
    'Sanatçılar & Müzisyenler': 'Sanatçı & Müzisyen',
    'Seyahat & Etkinlik Hizmetleri': 'Seyahat & Etkinlik',
    'Nakliye & Taşıma': 'Taşımacılık & Nakliye',
};

const testSubCat = 'Nakliye & Taşıma';
const normalized = subCategoryMap[testSubCat] || testSubCat;
const key = `Hizmetler|${normalized}`;

console.log('Input:', testSubCat);
console.log('Normalized:', normalized);
console.log('Key:', key);
console.log('Expected key:', 'Hizmetler|Taşımacılık & Nakliye');
