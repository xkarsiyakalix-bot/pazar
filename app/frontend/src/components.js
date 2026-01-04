import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useLocation, useSearchParams } from 'react-router-dom';
import { carBrands } from './data/carBrands';
import { turkeyCities } from './data/turkey_cities';
import { useAuth } from './contexts/AuthContext';
import { ReservationButton } from './ReservationButton';
import { ProductSEO } from './SEO';
import { getOptimizedImageUrl } from './utils/imageUtils';
import RatingDisplay from './components/RatingDisplay';
import { t, getCategoryTranslation } from './translations';
import { FashionFields } from './components/AddListing/FashionFields';
import { RealEstateFields } from './components/AddListing/RealEstateFields';
import { VehicleFields } from './components/AddListing/VehicleFields';
import { ElectronicFields } from './components/AddListing/ElectronicFields';
import { HomeGardenFields } from './components/AddListing/HomeGardenFields';
import { JobFields } from './components/AddListing/JobFields';
import { HobbyFields } from './components/AddListing/HobbyFields';
import { EducationFields } from './components/AddListing/EducationFields';
import { ServiceFields } from './components/AddListing/ServiceFields';
import { FamilyFields } from './components/AddListing/FamilyFields';
import { PetFields } from './components/AddListing/PetFields';
import PromotionModal from './components/Account/PromotionModal';
import { useIsMobile } from './hooks/useIsMobile';

export const LazyImage = ({ src, alt, className, imgClassName, ...props }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={`relative overflow-hidden ${className}`} {...props}>
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse z-0" />
      )}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        onError={() => setIsLoaded(true)}
        className={`w-full h-full transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'} ${imgClassName || 'object-cover'} relative z-10`}
      />
    </div>
  );
};

// Helper function to format "Last Seen" status
export const formatLastSeen = (lastSeenDate) => {
  if (!lastSeenDate) return 'Az önce aktifti';

  const now = new Date();
  const lastSeen = new Date(lastSeenDate);
  const diffInMinutes = Math.floor((now - lastSeen) / (1000 * 60));

  if (diffInMinutes < 1) return 'Az önce aktifti';
  if (diffInMinutes < 60) return `${diffInMinutes} dakika önce aktifti`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} saat önce aktifti`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) return 'Dün aktifti';
  if (diffInDays < 7) return `${diffInDays} gün önce aktifti`;

  return lastSeen.toLocaleDateString('tr-TR');
};

// Mock data for categories
const categories = [
  { name: 'Tüm Kategoriler', count: 0 },
  {
    name: 'Otomobil, Bisiklet & Tekne',
    count: 0,
    subcategories: [
      { name: 'Otomobiller', count: 0 },
      { name: 'Oto Parça & Lastik', count: 0 },
      { name: 'Tekne & Tekne Malzemeleri', count: 0 },
      { name: 'Bisiklet & Aksesuarlar', count: 0 },
      { name: 'Motosiklet & Scooter', count: 0 },
      { name: 'Motosiklet Parça & Aksesuarlar', count: 0 },
      { name: 'Ticari Araçlar & Römorklar', count: 0 },
      { name: 'Tamir & Servis', count: 0 },
      { name: 'Karavan & Motokaravan', count: 0 },
      { name: 'Diğer Otomobil, Bisiklet & Tekne', count: 0 },
    ]
  },
  {
    name: 'Emlak',
    count: 0,
    subcategories: [
      { name: 'Geçici Konaklama & Paylaşımlı Ev', count: 0 },
      { name: 'Konteyner', count: 0 },
      { name: 'Satılık Daire', count: 0 },
      { name: 'Tatil Evi & Yurt Dışı Emlak', count: 0 },
      { name: 'Garaj & Otopark', count: 0 },
      { name: 'Ticari Emlak', count: 0 },
      { name: 'Arsa & Bahçe', count: 0 },
      { name: 'Satılık Müstakil Ev', count: 0 },
      { name: 'Kiralık Müstakil Ev', count: 0 },
      { name: 'Kiralık Daire', count: 0 },
      { name: 'Yeni Projeler', count: 0 },
      { name: 'Taşımacılık & Nakliye', count: 0 },
      { name: 'Diğer Emlak', count: 0 },
    ]
  },
  {
    name: 'Ev & Bahçe',
    count: 0,
    subcategories: [
      { name: 'Banyo', count: 0 },
      { name: 'Ofis', count: 0 },
      { name: 'Dekorasyon', count: 0 },
      { name: 'Ev Hizmetleri', count: 0 },
      { name: 'Bahçe Malzemeleri & Bitkiler', count: 0 },
      { name: 'Ev Tekstili', count: 0 },
      { name: 'Ev Tadilatı', count: 0 },
      { name: 'Mutfak & Yemek Odası', count: 0 },
      { name: 'Lamba & Aydınlatma', count: 0 },
      { name: 'Yatak Odası', count: 0 },
      { name: 'Oturma Odası', count: 0 },
      { name: 'Diğer Ev & Bahçe', count: 0 },
    ]
  },
  {
    name: 'Moda & Güzellik',
    count: 0,
    subcategories: [
      { name: 'Güzellik & Sağlık', count: 0 },
      { name: 'Kadın Giyimi', count: 0 },
      { name: 'Kadın Ayakkabıları', count: 0 },
      { name: 'Erkek Giyimi', count: 0 },
      { name: 'Erkek Ayakkabıları', count: 0 },
      { name: 'Çanta & Aksesuarlar', count: 0 },
      { name: 'Saat & Takı', count: 0 },
      { name: 'Diğer Moda & Güzellik', count: 0 },
    ]
  },
  {
    name: 'Elektronik',
    count: 0,
    subcategories: [
      { name: 'Ses & Hifi', count: 0 },
      { name: 'Elektronik Hizmetler', count: 0 },
      { name: 'Fotoğraf & Kamera', count: 0 },
      { name: 'Cep Telefonu & Telefon', count: 0 },
      { name: 'Ev Aletleri', count: 0 },
      { name: 'Konsollar', count: 0 },
      { name: 'Dizüstü Bilgisayarlar', count: 0 },
      { name: 'Bilgisayarlar', count: 0 },
      { name: 'Bilgisayar Aksesuarları & Yazılım', count: 0 },
      { name: 'Tabletler & E-Okuyucular', count: 0 },
      { name: 'TV & Video', count: 0 },
      { name: 'Video Oyunları', count: 0 },
      { name: 'Diğer Elektronik', count: 0 },
    ]
  },
  {
    name: 'Evcil Hayvanlar',
    count: 0,
    subcategories: [
      { name: 'Balıklar', count: 0 },
      { name: 'Köpekler', count: 0 },
      { name: 'Kediler', count: 0 },
      { name: 'Küçük Hayvanlar', count: 0 },
      { name: 'Çiftlik Hayvanları', count: 0 },
      { name: 'Atlar', count: 0 },
      { name: 'Hayvan Bakımı & Eğitim', count: 0 },
      { name: 'Kayıp Hayvanlar', count: 0 },
      { name: 'Kuşlar', count: 0 },
      { name: 'Aksesuarlar', count: 0 },
    ]
  },
  {
    name: 'Aile, Çocuk & Bebek',
    count: 0,
    subcategories: [
      { name: 'Yaşlı Bakımı', count: 0 },
      { name: 'Bebek & Çocuk Giyimi', count: 0 },
      { name: 'Bebek & Çocuk Ayakkabıları', count: 0 },
      { name: 'Bebek Ekipmanları', count: 0 },
      { name: 'Bebek Koltuğu & Oto Koltukları', count: 0 },
      { name: 'Babysitter & Çocuk Bakımı', count: 0 },
      { name: 'Bebek Arabaları & Pusetler', count: 0 },
      { name: 'Bebek Odası Mobilyaları', count: 0 },
      { name: 'Oyuncaklar', count: 0 },
      { name: 'Diğer Aile, Çocuk & Bebek', count: 0 },
    ]
  },
  {
    name: 'İş İlanları',
    count: 0,
    subcategories: [
      { name: 'Mesleki Eğitim', count: 0 },
      { name: 'İnşaat, El Sanatları & Üretim', count: 0 },
      { name: 'Büro İşleri & Yönetim', count: 0 },
      { name: 'Gastronomi & Turizm', count: 0 },
      { name: 'Müşteri Hizmetleri & Çağrı Merkezi', count: 0 },
      { name: 'Ek İşler', count: 0 },
      { name: 'Staj', count: 0 },
      { name: 'Sosyal Sektör & Bakım', count: 0 },
      { name: 'Taşımacılık & Lojistik', count: 0 },
      { name: 'Satış & Pazarlama', count: 0 },
      { name: 'Diğer İş İlanları', count: 0 },
    ]
  },
  {
    name: 'Eğlence, Hobi & Mahalle',
    count: 0,
    subcategories: [
      { name: 'Ezoterizm & Spiritüalizm', count: 0 },
      { name: 'Yiyecek & İçecek', count: 0 },
      { name: 'Boş Zaman Aktiviteleri', count: 0 },
      { name: 'El Sanatları & Hobi', count: 0 },
      { name: 'Sanat & Antikalar', count: 0 },
      { name: 'Sanatçılar & Müzisyenler', count: 0 },
      { name: 'Model Yapımı', count: 0 },
      { name: 'Seyahat & Etkinlik Hizmetleri', count: 0 },
      { name: 'Koleksiyon', count: 0 },
      { name: 'Spor & Camping', count: 0 },
      { name: 'Bit Pazarı', count: 0 },
      { name: 'Kayıp & Buluntu', count: 0 },
      { name: 'Diğer Eğlence, Hobi & Mahalle', count: 0 },
    ]
  },
  {
    name: 'Müzik, Film & Kitap',
    count: 0,
    subcategories: [
      { name: 'Kitap & Dergi', count: 0 },
      { name: 'Kırtasiye', count: 0 },
      { name: 'Çizgi Romanlar', count: 0 },
      { name: 'Ders Kitapları, Okul & Eğitim', count: 0 },
      { name: 'Film & DVD', count: 0 },
      { name: "Müzik & CD'ler", count: 0 },
      { name: 'Müzik Enstrümanları', count: 0 },
      { name: 'Diğer Müzik, Film & Kitap', count: 0 },
    ]
  },
  {
    name: 'Biletler',
    count: 0,
    subcategories: [
      { name: 'Tren & Toplu Taşıma', count: 0 },
      { name: 'Komedi & Kabare', count: 0 },
      { name: 'Hediye Çekleri', count: 0 },
      { name: 'Çocuk Etkinlikleri', count: 0 },
      { name: 'Konserler', count: 0 },
      { name: 'Spor', count: 0 },
      { name: 'Tiyatro & Müzikal', count: 0 },
      { name: 'Diğer Biletler', count: 0 },
    ]
  },
  {
    name: 'Hizmetler',
    count: 0,
    subcategories: [
      { name: 'Yaşlı Bakımı', count: 0 },
      { name: 'Otomobil, Bisiklet & Tekne', count: 0 },
      { name: 'Babysitter & Çocuk Bakımı', count: 0 },
      { name: 'Elektronik', count: 0 },
      { name: 'Ev & Bahçe', count: 0 },
      { name: 'Sanatçılar & Müzisyenler', count: 0 },
      { name: 'Seyahat & Etkinlik', count: 0 },
      { name: 'Hayvan Bakımı & Eğitim', count: 0 },
      { name: 'Taşımacılık & Nakliye', count: 0 },
      { name: 'Diğer Hizmetler', count: 0 },
    ]
  },
  {
    name: 'Ücretsiz & Takas',
    count: 0,
    subcategories: [
      { name: 'Takas', count: 0 },
      { name: 'Kiralama', count: 0 },
      { name: 'Ücretsiz', count: 0 },
    ]
  },
  {
    name: 'Eğitim & Kurslar',
    count: 0,
    subcategories: [
      { name: 'Bilgisayar Kursları', count: 0 },
      { name: 'Ezoterizm & Spiritüalizm', count: 0 },
      { name: 'Yemek & Pastacılık', count: 0 },
      { name: 'Sanat & Tasarım', count: 0 },
      { name: 'Müzik & Şan', count: 0 },
      { name: 'Özel Ders', count: 0 },
      { name: 'Spor Kursları', count: 0 },
      { name: 'Dil Kursları', count: 0 },
      { name: 'Dans Kursları', count: 0 },
      { name: 'Sürekli Eğitim', count: 0 },
      { name: 'Diğer Eğitim & Kurslar', count: 0 },
    ]
  },
  {
    name: 'Komşu Yardımı',
    count: 3,
    subcategories: [
      { name: 'Komşu Yardımı', count: 3 },
    ]
  }

];

// Mock data for listings
// İlan numarası oluşturma fonksiyonu
export const generateListingNumber = (listing) => {
  // Use listing_number from database if available, otherwise fallback to ID-based number
  if (listing && listing.listing_number) {
    return listing.listing_number.toString();
  }
  // Fallback for old listings without listing_number
  return `${1000 + (parseInt(listing?.id?.substring(0, 8), 16) % 9000)}`;
};

export const mockListings = [
  {
    id: 1,
    sellerId: 1,
    listingNumber: 'KA-12345678',
    title: 'Belini Unterschrank Küche 60 cm Breite. SDSZ...',
    price: '189,00 ₺',
    shipping: '+ 49,00 ₺ Kargo',
    location: 'Preis von 7 Uhr',
    postalCode: '10115',
    city: 'Berlin',
    viewCount: 1247,
    image: 'https://images.unsplash.com/photo-1586208958839-06c17cacdf08?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzZ8MHwxfHNlYXJjaHwxfHxraXRjaGVuJTIwY2FiaW5ldHxlbnwwfHx8fDE3NTMzNzc1MDZ8MA&ixlib=rb-4.1.0&q=85',
    isTop: true,
    date: '20.11.2025',
    category: 'Haus & Garten',
    subCategory: 'Küche & Esszimmer',
    condition: 'İkinci El',
    address: 'Musterstraße 123',
    showFullAddress: true,
    description: 'Hochwertiger Belini Unterschrank für Ihre Küche. Breite: 60 cm. Perfekt für moderne Kücheneinrichtungen. Der Schrank ist in sehr gutem Zustand und wurde nur wenig genutzt. Alle Türen und Schubladen funktionieren einwandfrei. Selbstabholung bevorzugt, Versand möglich gegen Aufpreis.'
  },
  {
    id: 2,
    sellerId: 1,
    listingNumber: 'KA-23456789',
    title: 'Belini Hängeschrank Küche SG2. Breite 60 cm...',
    price: '104,90 ₺',
    shipping: '+ 29,00 ₺ Kargo',
    location: 'Preis von 7 Uhr',
    postalCode: '10115',
    city: 'Berlin',
    viewCount: 892,
    image: 'https://images.unsplash.com/photo-1596552183299-000ef779e88d?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzZ8MHwxfHNlYXJjaHwyfHxraXRjaGVuJTIwY2FiaW5ldHxlbnwwfHx8fDE3NTMzNzc1MDZ8MA&ixlib=rb-4.1.0&q=85',
    isTop: true,
    date: '19.11.2025',
    category: 'Ev & Bahçe',
    subCategory: 'Mutfak & Yemek Odası',
    condition: 'İkinci El',
    showFullAddress: false,
    description: 'Moderner Belini Hängeschrank für Ihre Küche. Breite: 60 cm. Ideal für zusätzlichen Stauraum. Der Schrank ist in sehr gutem Zustand, nur minimale Gebrauchsspuren. Alle Funktionen einwandfrei. Versand möglich oder Selbstabholung in Berlin.'
  },
  {
    id: 3,
    sellerId: 2,
    listingNumber: 'KA-34567890',
    title: 'Flex-Well Glashaengeschrank Küche - 60 cm breit...',
    price: '119,00 ₺',
    shipping: '+ 29,00 ₺ Kargo',
    location: 'Preis von 7 Uhr',
    postalCode: '80331',
    city: 'München',
    viewCount: 1534,
    image: 'https://images.unsplash.com/photo-1672137233327-37b0c1049e77?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzl8MHwxfHNlYXJjaHwyfHx3YXJkcm9iZXxlbnwwfHx8fDE3NTMzNzc1MTN8MA&ixlib=rb-4.1.0&q=85',
    isTop: true,
    date: '18.11.2025',
    category: 'Ev & Bahçe',
    subCategory: 'Mutfak & Yemek Odası',
    condition: 'İkinci El',
    description: 'Eleganter Flex-Well Glashaengeschrank mit 60 cm Breite. Perfekt für moderne Küchen. Der Schrank verfügt über Glastüren ve bietet viel Stauraum. Sehr guter Zustand, kaum Gebrauchsspuren. Ideal für Küchenrenovierungen.'
  },
  {
    id: 4,
    sellerId: 2,
    listingNumber: 'KA-45678901',
    title: 'Flex-Well Kurzhängeschrank Küche - 50 cm breit...',
    price: '53,90 ₺',
    shipping: '+ 29,00 ₺ Kargo',
    location: 'Preis von 7 Uhr',
    postalCode: '80331',
    city: 'München',
    viewCount: 678,
    image: 'https://images.unsplash.com/photo-1558997519-83ea9252edf8?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzl8MHwxfHNlYXJjaHwzfHx3YXJkcm9iZXxlbnwwfHx8fDE3NTMzNzc1MTN8MA&ixlib=rb-4.1.0&q=85',
    isTop: true,
    date: '17.11.2025',
    stock: 2,
    category: 'Haus & Garten',
    condition: 'Yeni',
    description: 'Kompakter Flex-Well Kurzhängeschrank, 50 cm breit. Ideal für kleinere Küchen oder als Ergänzung. Der Schrank ist in gutem Zustand und funktioniert einwandfrei. Preiswert und praktisch.'
  },
  {
    id: 5,
    sellerId: 3,
    listingNumber: 'KA-EL-001',
    title: 'Samsung Galaxy S23 Ultra 256GB - Phantom Black',
    price: '899,00 ₺',
    shipping: '+ 5,90 ₺ Kargo',
    location: 'Hamburg',
    postalCode: '20095',
    city: 'Hamburg',
    viewCount: 456,
    image: 'https://images.unsplash.com/photo-1592890288564-76628a30a657?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzR8MHwxfHNlYXJjaHwxfHxzbWFydHBob25lfGVufDB8fHx8MTc1MzM3NzUyMXww&ixlib=rb-4.1.0&q=85',
    isTop: true,
    date: '16.11.2025',
    category: 'Elektronik',
    subCategory: 'Handy & Telefon',
    condition: 'Yeni Gibi',
    description: 'Samsung Galaxy S23 Ultra in Phantom Black mit 256GB Speicher. Nur 2 Monate alt, in perfektem Zustand. Inkl. Originalverpackung, Ladegerät und Schutzhülle. Keine Kratzer oder Gebrauchsspuren. Ein absolutes Flaggschiff-Smartphone mit hervorragender Kamera und Performance!'
  },
  {
    id: 6,
    sellerId: 3,
    listingNumber: 'KA-EL-002',
    title: 'Apple iPhone 14 Pro 128GB - Space Black',
    price: '799,00 ₺',
    shipping: '+ 5,90 ₺ Kargo',
    location: 'Hamburg',
    postalCode: '20095',
    city: 'Hamburg',
    viewCount: 321,
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzR8MHwxfHNlYXJjaHwyfHxzbWFydHBob25lfGVufDB8fHx8MTc1MzM3NzUyMXww&ixlib=rb-4.1.0&q=85',
    isTop: true,
    date: '15.11.2025',
    category: 'Elektronik',
    subCategory: 'Cep Telefonu & Telefon',
    condition: 'İkinci El',
    description: 'iPhone 14 Pro in Space Black, 128GB. Sehr guter Zustand, nur leichte Gebrauchsspuren. Display ohne Kratzer. Akku-Gesundheit bei 95%. Inkl. Originalverpackung und Lightning-Kabel. Perfekt für alle, die ein hochwertiges iPhone suchen!'
  },
];

// Local Job Mappings to ensure translation if import fails
const localJobMappings = {
  'Vollzeit': 'Tam Zamanlı',
  'Teilzeit': 'Yarı Zamanlı',
  'Minijob': 'Mini İş',
  'Praktikum': 'Staj',
  'Werkstudent': 'Çalışan Öğrenci',
  'Selbstständig': 'Serbest Çalışan',
  'Angebote': 'Satılık',
  'Gesuche': 'Aranıyor',
  'Privat': 'Bireysel',
  'Gewerblich': 'Kurumsal',
  'Bauhelfer/-in': 'İnşaat Yardımcısı',
  'Dachdecker/-in': 'Çatı Ustası',
  'Elektriker/-in': 'Elektrikçi',
  'Fliesenleger/-in': 'Fayansçı',
  'Maler/-in': 'Boyacı',
  'Maurer/-in': 'Duvarcı',
  'Produktionshelfer/-in': 'Üretim Yardımcısı',
  'Schlosser/-in': 'Çilingir',
  'Tischler/-in': 'Marangoz',
  'Buchhalter/-in': 'Muhasebeci',
  'Bürokaufmann/-frau': 'Ofis Elemanı',
  'Sachbearbeiter/-in': 'Dosya Sorumlusu',
  'Sekretär/-in': 'Sekreter',
  'Barkeeper/-in': 'Barmen/Barmaid',
  'Hotelfachmann/-frau': 'Otel Elemanı',
  'Kellner/-in': 'Garson',
  'Koch/Köchin': 'Aşçı',
  'Küchenhilfe': 'Mutfak Yardımcısı',
  'Servicekraft': 'Servis Elemanı',
  'Housekeeping': 'Kat Hizmetleri',
  'Weitere Berufe': 'Diğer Meslekler'
};

const jobMap = (val) => {
  if (!val) return val;
  return (t.jobMappings && t.jobMappings[val]) || localJobMappings[val] || val;
};

export const mockListings2 = [
  {
    id: 7,
    sellerId: 1,
    title: 'Belini Unterschrank Küche 60 cm Breite. SDSZ...',
    price: '219,90 ₺',
    shipping: '+ 49,00 ₺ Kargo',
    location: 'www.idealo.de',
    postalCode: '10115',
    city: 'Berlin',
    viewCount: 2103,
    image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzl8MHwxfHNlYXJjaHwyfHxjYXJ8ZW58MHx8fHwxNzUzMzc3NTI4fDA&ixlib=rb-4.1.0&q=85',
    isTop: true,
    date: '14.11.2025',
    category: 'Auto, Rad & Boot'
  },

  {
    id: 8,
    sellerId: 2,
    title: 'Belini Hängeschrank Küche SG. Breite 30 cm...',
    price: '99,90 ₺',
    shipping: '+ 29,00 ₺ Kargo',
    location: 'www.idealo.de',
    postalCode: '80331',
    city: 'München',
    viewCount: 567,
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzl8MHwxfHNlYXJjaHwzfHxjYXJ8ZW58MHx8fHwxNzUzMzc3NTI4fDA&ixlib=rb-4.1.0&q=85',
    isTop: true,
    date: '13.11.2025',
    category: 'Otomobil, Bisiklet & Tekne'
  },
  {
    id: 9,
    sellerId: 3,
    listingNumber: 'KA-56789012',
    title: 'ETT EASY LINK Ventil 1 Grobgewinde (MT, MT C)',
    price: '24,99 ₺',
    shipping: '+ 4,90 ₺ Kargo',
    location: 'Berlin',
    postalCode: '10115',
    city: 'Berlin',
    viewCount: 156,
    image: '/product_dark_background.png',
    isTop: true,
    date: '30.11.2025',
    stock: 12,
    category: 'Oto Parça & Lastik',
    subCategory: 'Diğer Otomobil, Bisiklet & Tekne',
    condition: 'Yeni',
    description: `🔧 Hochwertiges ETT EASY LINK Ventil mit Grobgewinde (MT, MT C)

Präzisionsgefertigtes Metallventil mit Federmechanismus für zuverlässige hydraulische und pneumatische Verbindungen. Ideal für professionelle Anwendungen und anspruchsvolle Projekte.

✅ HIGHLIGHTS:
• Material: Hochwertigeredelstahl - korrosionsbeständig und langlebig
• Gewinde: MT / MT C (Grobgewinde) für universelle Kompatibilität
• Integrierter Federmechanismus für sichere Verbindungen
• Schraublösung - kein Spezialwerkzeug erforderlich
• Einfache Montage einer EASY LINK Leitung an MT oder MT C Geber

📦 LIEFERUMFANG:
• 1x ETT EASY LINK Ventil 1 Grobgewinde
• Originalverpackt

📊 TECHNISCHE DATEN:
• Gewicht (netto): 0.011 kg
• Gewicht (brutto): 0.011 kg
• Artikelnummer: 2702777
• EAN: 4055184039625

💎 ZUSTAND: Neuwertig, unbenutzt
🚚 VERSAND: Schneller und sicherer Versand möglich

Perfekt für Werkstätten, Hobbybastler und professionelle Anwendungen!`
  },
  {
    id: 10,
    sellerId: 1,
    listingNumber: 'KA-67890123',
    title: 'Gazelle Arroyo C7 E-Bike Damen 57cm 7gang Hollandrad',
    price: '1.250,00 ₺',
    shipping: 'Gel Al',
    location: 'Coesfeld / Lette',
    postalCode: '48653',
    city: 'Coesfeld',
    address: 'Alter Kirchplatz 5',
    showFullAddress: true,
    viewCount: 45,
    image: '/bike-vitrin.jpg',
    images: [
      '/bike-vitrin.jpg',
      'https://images.unsplash.com/photo-1571068316344-75bc76f77890?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzZ8MHwxfHNlYXJjaHwxfHxlJTIwYmlrZXxlbnwwfHx8fDE3NTMzNzc1NDB8MA&ixlib=rb-4.1.0&q=85'
    ],
    isTop: true,
    date: '25.11.2025',
    category: 'Otomobil, Bisiklet & Tekne',
    subCategory: 'Bisiklet & Aksesuarlar',
    condition: 'İyi',
    contactName: 'Max Mustermann',
    phoneNumber: '0176 202 78 374',
    showPhoneNumber: true,
    description: 'Gut erhaltenes Gazelle Arroyo C7 E-Bike für Damen, Rahmengröße 57cm, 7 Gänge. Ideal für die Stadt und Touren. Das Fahrrad ist in gutem Zustand und wurde regelmäßig gewartet. Der Akku hält noch sehr gut und ermöglicht Fahrten bis zu 60 km. Perfekt für den täglichen Gebrauch oder längere Ausflüge. Nur Abholung möglich.'
  },
  {
    id: 11,
    sellerId: 2,
    listingNumber: 'KA-HG-001',
    title: 'Moderner Badezimmerschrank mit Spiegel - Weiß Hochglanz',
    price: '89,00 ₺',
    shipping: 'Gel Al',
    location: 'Berlin',
    postalCode: '10115',
    city: 'Berlin',
    viewCount: 234,
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80',
    isTop: true,
    date: '26.11.2025',
    category: 'Haus & Garten',
    subCategory: 'Banyo',
    condition: 'İkinci El',
    description: 'Verkaufe einen hochwertigen Badezimmerschrank in Weiß Hochglanz. Der Schrank verfügt über einen integrierten Spiegel und bietet viel Stauraum. Maße: 80cm x 60cm x 15cm. Sehr guter Zustand, nur minimale Gebrauchsspuren. Ideal für moderne Badezimmer. Selbstabholung bevorzugt.'
  },
  {
    id: 12,
    sellerId: 1,
    listingNumber: 'KA-HG-002',
    title: 'Schreibtisch Büro - Eiche massiv 140x70cm',
    price: '245,00 ₺',
    shipping: 'Gel Al',
    location: 'München',
    postalCode: '80331',
    city: 'München',
    viewCount: 456,
    image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800&q=80',
    isTop: true,
    date: '26.11.2025',
    category: 'Haus & Garten',
    subCategory: 'Ofis',
    condition: 'İkinci El',
    description: 'Hochwertiger Schreibtisch aus massiver Eiche für Ihr Homeoffice oder Büro. Maße: 140cm x 70cm x 75cm. Der Tisch ist sehr stabil und bietet eine große Arbeitsfläche. Perfekt für produktives Arbeiten. Nur leichte Gebrauchsspuren, ansonsten in sehr gutem Zustand. Kann zerlegt werden für einfachen Transport.'
  },
  {
    id: 13,
    sellerId: 3,
    listingNumber: 'KA-HG-003',
    title: 'Wanddeko Set - 3 moderne Bilder mit Rahmen',
    price: '45,00 ₺',
    shipping: '+ 9,00 ₺ Kargo',
    location: 'Hamburg',
    postalCode: '20095',
    city: 'Hamburg',
    viewCount: 189,
    image: 'https://images.unsplash.com/photo-1582037928769-181f2644ecb7?w=800&q=80',
    isTop: true,
    date: '26.11.2025',
    category: 'Haus & Garten',
    subCategory: 'Dekorasyon',
    condition: 'Yeni Gibi',
    description: 'Schönes Wanddeko-Set bestehend aus 3 modernen Bildern mit hochwertigen Rahmen. Perfekt für Wohnzimmer oder Schlafzimmer. Die Bilder zeigen abstrakte Motive in Grau- und Goldtönen. Rahmengröße jeweils: 40cm x 60cm. Neuwertig, da nur kurz aufgehängt. Verleihen Sie Ihrem Zuhause einen eleganten Touch!'
  },
  {
    id: 14,
    sellerId: 2,
    listingNumber: 'KA-HG-004',
    title: 'Gartenpflege & Rasenmähen - Professioneller Service',
    price: '35,00 ₺',
    shipping: 'Yerinde Servis',
    location: 'Köln',
    postalCode: '50667',
    city: 'Köln',
    viewCount: 567,
    image: 'https://images.unsplash.com/photo-1558904541-efa843a96f01?w=800&q=80',
    isTop: true,
    date: '26.11.2025',
    category: 'Haus & Garten',
    subCategory: 'Ev Hizmetleri',
    condition: 'Yeni',
    description: 'Biete professionelle Gartenpflege und Rasenmähen an. Über 10 Jahre Erfahrung in der Gartenpflege. Leistungen umfassen: Rasenmähen, Heckenschneiden, Unkrautentfernung, Beetpflege und mehr. Zuverlässig, pünktlich und faire Preise. Regelmäßige Termine oder Einzeleinsätze möglich. Kostenlose Erstberatung! Kontaktieren Sie mich für ein unverbindliches Angebot.'
  },
  {
    id: 15,
    sellerId: 1,
    listingNumber: 'KA-HG-005',
    title: 'Gartenschlauch Set 30m mit Sprühpistole & Halterung',
    price: '32,00 ₺',
    shipping: '+ 6,90 ₺ Kargo',
    location: 'Frankfurt',
    postalCode: '60311',
    city: 'Frankfurt',
    viewCount: 298,
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80',
    isTop: true,
    date: '26.11.2025',
    category: 'Haus & Garten',
    subCategory: 'Bahçe Malzemeleri & Bitkiler',
    condition: 'Yeni Gibi',
    description: 'Komplettes Gartenschlauch-Set mit 30 Meter langem Schlauch, Sprühpistole mit 7 Funktionen und Wandhalterung. Der Schlauch ist flexibel, knickfest und UV-beständig. Perfekt für die Gartenbewässerung. Die Sprühpistole bietet verschiedene Strahlarten von Nebel bis Vollstrahl. Neuwertig, nur einmal benutzt. Ideal für die kommende Gartensaison!'
  },
  {
    id: 16,
    sellerId: 3,
    listingNumber: 'KA-HG-006',
    title: 'Vorhänge Blickdicht 2er Set - Grau 140x245cm',
    price: '38,00 ₺',
    shipping: '+ 5,90 ₺ Kargo',
    location: 'Stuttgart',
    postalCode: '70173',
    city: 'Stuttgart',
    viewCount: 412,
    image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80',
    isTop: true,
    date: '26.11.2025',
    category: 'Haus & Garten',
    subCategory: 'Ev Tekstili',
    condition: 'Yeni Gibi',
    description: 'Elegante blickdichte Vorhänge im 2er Set in der Farbe Grau. Maße pro Vorhang: 140cm x 245cm. Die Vorhänge sind aus hochwertigem Stoff gefertigt und verdunkeln den Raum sehr gut. Perfekt für Schlafzimmer oder Wohnzimmer. Mit Ösen für einfache Montage. Nur einmal gewaschen, wie neu. Schaffen Sie eine gemütliche Atmosphäre in Ihrem Zuhause!'
  },
  {
    id: 17,
    sellerId: 2,
    listingNumber: 'KA-HG-007',
    title: 'Bosch Akkuschrauber PSR 18V mit 2 Akkus & Koffer',
    price: '125,00 ₺',
    shipping: '+ 9,90 ₺ Kargo',
    location: 'Düsseldorf',
    postalCode: '40210',
    city: 'Düsseldorf',
    viewCount: 678,
    image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800&q=80',
    isTop: true,
    date: '26.11.2025',
    category: 'Haus & Garten',
    subCategory: 'Ev Tadilatı',
    condition: 'İkinci El',
    description: 'Verkaufe meinen Bosch Akkuschrauber PSR 18V inkl. 2 Akkus, Ladegerät und praktischem Transportkoffer. Der Schrauber ist sehr leistungsstark und eignet sich perfekt für Heimwerker-Projekte. LED-Licht für bessere Sicht beim Arbeiten. Alle Teile funktionieren einwandfrei. Gebraucht aber in sehr gutem Zustand. Ideal für Renovierungen und Möbelmontage!'
  },
  {
    id: 18,
    sellerId: 1,
    listingNumber: 'KA-HG-008',
    title: 'Esstisch ausziehbar Eiche 160-200cm mit 6 Stühlen',
    price: '450,00 ₺',
    shipping: 'Gel Al',
    location: 'Leipzig',
    postalCode: '04109',
    city: 'Leipzig',
    viewCount: 823,
    image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800&q=80',
    isTop: true,
    date: '26.11.2025',
    category: 'Ev & Bahçe',
    subCategory: 'Mutfak & Yemek Odası',
    condition: 'İkinci El',
    description: 'Wunderschöner ausziehbarer Esstisch aus Eiche mit 6 passenden Stühlen. Tischmaße: 160cm ausziehbar auf 200cm, Breite 90cm. Die Stühle sind gepolstert und sehr bequem. Perfekt für Familien oder wenn Sie gerne Gäste empfangen. Der Tisch ist sehr stabil und hochwertig verarbeitet. Leichte Gebrauchsspuren, ansonsten top Zustand. Ein echter Hingucker für Ihre Küche oder Esszimmer!'
  },
  {
    id: 19,
    sellerId: 3,
    listingNumber: 'KA-HG-009',
    title: 'Designer Stehlampe Modern - Schwarz/Gold 165cm',
    price: '78,00 ₺',
    shipping: '+ 12,90 ₺ Kargo',
    location: 'Dortmund',
    postalCode: '44135',
    city: 'Dortmund',
    viewCount: 345,
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80',
    isTop: true,
    date: '26.11.2025',
    category: 'Haus & Garten',
    subCategory: 'Lamba & Aydınlatma',
    condition: 'Yeni Gibi',
    description: 'Moderne Designer-Stehlampe in Schwarz mit goldenen Akzenten. Höhe: 165cm. Die Lampe verfügt über einen Fußschalter und ist mit E27 Leuchtmitteln kompatibel. Perfekt für Wohnzimmer oder Leseecke. Sehr stilvolles Design, das jedem Raum das gewisse Etwas verleiht. Neuwertig, nur 3 Monate alt. Originalverpackung vorhanden. Ein absolutes Highlight für Ihr Zuhause!'
  },
  {
    id: 20,
    sellerId: 2,
    listingNumber: 'KA-HG-010',
    title: 'Boxspringbett 180x200cm Grau mit Matratze & Topper',
    price: '650,00 ₺',
    shipping: 'Gel Al',
    location: 'Essen',
    postalCode: '45127',
    city: 'Essen',
    viewCount: 912,
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&q=80',
    isTop: true,
    date: '26.11.2025',
    category: 'Haus & Garten',
    subCategory: 'Yatak Odası',
    condition: 'İkinci El',
    description: 'Hochwertiges Boxspringbett in Grau, Größe 180x200cm. Inkl. Matratze und Topper für maximalen Schlafkomfort. Das Bett ist sehr bequem und bietet optimale Unterstützung. Bezug ist abnehmbar und waschbar. Nur 1 Jahr alt, daher noch in sehr gutem Zustand. Perfekt für erholsame Nächte. Muss zerlegt abgeholt werden. Ein Traum für Ihr Schlafzimmer!'
  },
  {
    id: 21,
    sellerId: 1,
    listingNumber: 'KA-HG-011',
    title: 'Sofa 3-Sitzer Samt Blau mit Kissen - Skandinavisch',
    price: '520,00 ₺',
    shipping: 'Gel Al',
    location: 'Bremen',
    postalCode: '28195',
    city: 'Bremen',
    viewCount: 1045,
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80',
    isTop: true,
    date: '26.11.2025',
    category: 'Haus & Garten',
    subCategory: 'Oturma Odası',
    condition: 'Yeni Gibi',
    description: 'Wunderschönes 3-Sitzer Sofa im skandinavischen Stil mit blauem Samtbezug. Maße: 210cm x 85cm x 80cm. Das Sofa ist sehr bequem und ein echter Hingucker. Inkl. 3 passenden Dekokissen. Die Füße sind aus hellem Holz. Perfekt für moderne Wohnzimmer. Nur 6 Monate alt, daher wie neu. Keine Flecken oder Beschädigungen. Verleihen Sie Ihrem Wohnzimmer einen stilvollen Look!'
  },
  {
    id: 22,
    sellerId: 3,
    listingNumber: 'KA-HG-012',
    title: 'Gartenbank Holz 150cm mit Auflagenbox - Akazie',
    price: '95,00 ₺',
    shipping: 'Gel Al',
    location: 'Dresden',
    postalCode: '01067',
    city: 'Dresden',
    viewCount: 267,
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb6?w=800&q=80',
    isTop: true,
    date: '26.11.2025',
    category: 'Haus & Garten',
    subCategory: 'Diğer Ev & Bahçe',
    condition: 'İkinci El',
    description: 'Schöne Gartenbank aus Akazienholz mit integrierter Auflagenbox. Länge: 150cm. Die Bank bietet bequeme Sitzgelegenheit für 2-3 Personen und praktischen Stauraum unter der Sitzfläche. Wetterfest behandelt und sehr stabil. Perfekt für Garten, Terrasse oder Balkon. Leichte Gebrauchsspuren durch Witterung, aber noch in gutem Zustand. Genießen Sie entspannte Stunden im Freien!'
  },
  {
    id: 23,
    sellerId: 1,
    listingNumber: 'KA-MB-001',
    title: 'Gesichtspflege Set - Naturkosmetik Bio Qualität',
    price: '35,00 ₺',
    shipping: '+ 4,90 ₺ Kargo',
    location: 'Hamburg',
    postalCode: '20095',
    city: 'Hamburg',
    viewCount: 156,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80',
    isTop: false,
    date: '27.11.2025',
    category: 'Moda & Güzellik',
    subCategory: 'Güzellik & Sağlık',
    condition: 'Yeni',
    description: 'Hochwertiges Gesichtspflege-Set aus Bio-Naturkosmetik. Enthält Tagescreme, Nachtcreme und Serum. Alle Produkte sind vegan und tierversuchsfrei. Perfekt für empfindliche Haut. Originalverpackt und ungeöffnet. Ideal als Geschenk oder zum Ausprobieren natürlicher Hautpflege.'
  },
  {
    id: 24,
    sellerId: 2,
    listingNumber: 'KA-MB-002',
    title: 'Sommerkleid Blumenmuster Größe M - Neu mit Etikett',
    price: '28,00 ₺',
    shipping: '+ 4,90 ₺ Kargo',
    location: 'Berlin',
    postalCode: '10115',
    city: 'Berlin',
    viewCount: 289,
    image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&q=80',
    isTop: true,
    date: '27.11.2025',
    category: 'Moda & Güzellik',
    subCategory: 'Kadın Giyimi',
    condition: 'Yeni',
    description: 'Wunderschönes Sommerkleid mit Blumenmuster in Größe M. Noch nie getragen, mit Originaletiketten. Leichter, luftiger Stoff perfekt für warme Tage. Knielang mit elegantem Schnitt. Farben: Blau, Weiß, Rosa. Material: 100% Baumwolle. Ein echter Hingucker für den Sommer!'
  },
  {
    id: 25,
    sellerId: 3,
    listingNumber: 'KA-MB-003',
    title: 'Sneaker Damen Weiß Größe 39 - Wie Neu',
    price: '45,00 ₺',
    shipping: '+ 5,90 ₺ Kargo',
    location: 'München',
    postalCode: '80331',
    city: 'München',
    viewCount: 412,
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80',
    isTop: true,
    date: '27.11.2025',
    category: 'Moda & Güzellik',
    subCategory: 'Kadın Ayakkabıları',
    condition: 'Yeni Gibi',
    description: 'Stylische weiße Damen-Sneaker in Größe 39. Nur 2x getragen, daher wie neu. Sehr bequem und vielseitig kombinierbar. Perfekt für Alltag und Freizeit. Keine Gebrauchsspuren, sauberer Zustand. Markenqualität zu fairem Preis. Ideal für den Frühling und Sommer!'
  },
  {
    id: 26,
    sellerId: 1,
    listingNumber: 'KA-MB-004',
    title: 'Herren Hemd Slim Fit Blau Größe L - Business',
    price: '22,00 ₺',
    shipping: '+ 4,90 ₺ Kargo',
    location: 'Frankfurt',
    postalCode: '60311',
    city: 'Frankfurt',
    viewCount: 198,
    image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&q=80',
    isTop: true,
    date: '27.11.2025',
    category: 'Moda & Güzellik',
    subCategory: 'Erkek Giyimi',
    condition: 'İkinci El',
    description: 'Elegantes Business-Hemd für Herren in Slim Fit, Größe L. Farbe: Hellblau. Material: Baumwoll-Mischgewebe, bügelleicht. Perfekt für Büro und formelle Anlässe. Sehr guter Zustand, nur wenige Male getragen. Professionelles Erscheinungsbild garantiert. Ein Must-have für jede Garderobe!'
  },
  {
    id: 27,
    sellerId: 2,
    listingNumber: 'KA-MB-005',
    title: 'Business Schuhe Herren Schwarz Größe 43 - Leder',
    price: '65,00 ₺',
    shipping: '+ 5,90 ₺ Kargo',
    location: 'Köln',
    postalCode: '50667',
    city: 'Köln',
    viewCount: 334,
    image: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=800&q=80',
    isTop: true,
    date: '27.11.2025',
    category: 'Moda & Güzellik',
    subCategory: 'Erkek Ayakkabıları',
    condition: 'İkinci El',
    description: 'Hochwertige Business-Schuhe aus echtem Leder in Größe 43. Klassisches Design in Schwarz. Sehr bequem und langlebig. Ideal für Büro, Meetings und formelle Events. Leichte Gebrauchsspuren, aber noch in sehr gutem Zustand. Professioneller Look zu fairem Preis. Zeitloser Klassiker!'
  },
  {
    id: 28,
    sellerId: 3,
    listingNumber: 'KA-MB-006',
    title: 'Handtasche Leder Braun - Vintage Style',
    price: '48,00 ₺',
    shipping: '+ 5,90 ₺ Kargo',
    location: 'Stuttgart',
    postalCode: '70173',
    city: 'Stuttgart',
    viewCount: 267,
    image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&q=80',
    isTop: true,
    date: '27.11.2025',
    category: 'Moda & Güzellik',
    subCategory: 'Çanta & Aksesuarlar',
    condition: 'İkinci El',
    description: 'Stilvolle Leder-Handtasche in Braun mit Vintage-Look. Geräumiges Hauptfach und mehrere Innentaschen. Perfekt für Alltag und Ausflüge. Echtes Leder, hochwertige Verarbeitung. Leichte Gebrauchsspuren verleihen authentischen Vintage-Charakter. Zeitloses Design, das nie aus der Mode kommt!'
  },
  {
    id: 29,
    sellerId: 1,
    listingNumber: 'KA-MB-007',
    title: 'Armbanduhr Herren Silber - Klassisches Design',
    price: '85,00 ₺',
    shipping: '+ 4,90 ₺ Kargo',
    location: 'Düsseldorf',
    postalCode: '40210',
    city: 'Düsseldorf',
    viewCount: 445,
    image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&q=80',
    isTop: true,
    date: '27.11.2025',
    category: 'Moda & Güzellik',
    subCategory: 'Saat & Takı',
    condition: 'Yeni Gibi',
    description: 'Elegante Herren-Armbanduhr in Silber mit klassischem Design. Quarzwerk, wasserdicht bis 50m. Edelstahlgehäuse und Lederarmband. Perfekt für Business und Freizeit. Nur 3 Monate alt, wie neu. Inkl. Originalverpackung und Garantiekarte. Zeitlose Eleganz am Handgelenk!'
  },
  {
    id: 30,
    sellerId: 2,
    listingNumber: 'KA-MB-008',
    title: 'Sonnenbrille Damen Schwarz - Designer Style',
    price: '32,00 ₺',
    shipping: '+ 3,90 ₺ Kargo',
    location: 'Leipzig',
    postalCode: '04109',
    city: 'Leipzig',
    viewCount: 178,
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=80',
    isTop: true,
    date: '27.11.2025',
    category: 'Moda & Güzellik',
    subCategory: 'Diğer Moda & Güzellik',
    condition: 'Yeni Gibi',
    description: 'Stylische Damen-Sonnenbrille in Schwarz mit Designer-Look. UV400 Schutz für optimalen Sonnenschutz. Leichter Rahmen, sehr bequem zu tragen. Perfekt für Sommer und Urlaub. Nur einmal getragen, daher wie neu. Inkl. Etui. Modisches Accessoire für jeden Anlass!'
  },
  {
    id: 31,
    sellerId: 1,
    listingNumber: 'KA-EL-003',
    title: 'Bose SoundLink Revolve+ Bluetooth Lautsprecher',
    price: '189,00 ₺',
    shipping: '+ 5,90 ₺ Kargo',
    location: 'Berlin',
    postalCode: '10115',
    city: 'Berlin',
    viewCount: 234,
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&q=80',
    isTop: true,
    date: '27.11.2025',
    category: 'Elektronik',
    subCategory: 'Ses & Hifi',
    condition: 'Yeni Gibi',
    description: 'Bose SoundLink Revolve+ Bluetooth Lautsprecher in perfektem Zustand. 360° Sound, wasserdicht (IPX4), bis zu 16 Stunden Akkulaufzeit. Nur 3 Monate alt, kaum benutzt. Inkl. Ladekabel und Originalverpackung. Hervorragender Klang für unterwegs!'
  },
  {
    id: 32,
    sellerId: 2,
    listingNumber: 'KA-EL-004',
    title: 'Reparatur Service für Smartphones & Tablets',
    price: '39,00 ₺',
    shipping: 'Yerinde Servis',
    location: 'München',
    postalCode: '80331',
    city: 'München',
    viewCount: 156,
    image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&q=80',
    isTop: true,
    date: '27.11.2025',
    category: 'Elektronik',
    subCategory: 'Elektronik Hizmetler',
    condition: 'Yeni',
    description: 'Professioneller Reparatur-Service für Smartphones, Tablets und Laptops. Display-Tausch, Akku-Wechsel, Wasserschaden-Reparatur. Schnelle Bearbeitung, faire Preise. Über 5 Jahre Erfahrung. Kostenlose Diagnose! Kontaktieren Sie uns für ein Angebot.'
  },
  {
    id: 33,
    sellerId: 3,
    listingNumber: 'KA-EL-005',
    title: 'Canon EOS 2000D Spiegelreflexkamera mit Objektiv',
    price: '349,00 ₺',
    shipping: '+ 6,90 ₺ Kargo',
    location: 'Hamburg',
    postalCode: '20095',
    city: 'Hamburg',
    viewCount: 445,
    image: 'https://images.unsplash.com/photo-1606980707986-683d8dc0ece6?w=800&q=80',
    isTop: true,
    date: '27.11.2025',
    category: 'Elektronik',
    subCategory: 'Fotoğraf & Kamera',
    condition: 'İkinci El',
    description: 'Canon EOS 2000D DSLR Kamera mit 18-55mm Objektiv. 24,1 Megapixel, Full HD Video, WiFi. Perfekt für Einsteiger. Sehr guter Zustand, nur wenig genutzt. Inkl. Akku, Ladegerät, Tragegurt und Tasche. Ideal für Fotografie-Enthusiasten!'
  },
  {
    id: 34,
    sellerId: 1,
    listingNumber: 'KA-EL-006',
    title: 'Bosch Serie 6 Waschmaschine 8kg A+++',
    price: '389,00 ₺',
    shipping: 'Gel Al',
    location: 'Köln',
    postalCode: '50667',
    city: 'Köln',
    viewCount: 567,
    image: 'https://images.unsplash.com/photo-1626806819282-2c1dc01a5e0c?w=800&q=80',
    isTop: true,
    date: '27.11.2025',
    category: 'Elektronik',
    subCategory: 'Ev Aletleri',
    condition: 'İkinci El',
    description: 'Bosch Waschmaschine Serie 6, 8kg Fassungsvermögen, Energieklasse A+++. Sehr leise, viele Programme. 2 Jahre alt, funktioniert einwandfrei. Nur Abholung möglich. Ideal für Familien. Zuverlässig und energieeffizient!'
  },
  {
    id: 35,
    sellerId: 2,
    listingNumber: 'KA-EL-007',
    title: 'PlayStation 5 Digital Edition + 2 Controller',
    price: '449,00 ₺',
    shipping: '+ 8,90 ₺ Kargo',
    location: 'Frankfurt',
    postalCode: '60311',
    city: 'Frankfurt',
    viewCount: 892,
    image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800&q=80',
    isTop: true,
    date: '27.11.2025',
    category: 'Elektronik',
    subCategory: 'Konsollar',
    condition: 'Yeni Gibi',
    description: 'PlayStation 5 Digital Edition mit 2 DualSense Controllern. Nur 4 Monate alt, wie neu. Inkl. allen Kabeln und Originalverpackung. Keine Kratzer oder Gebrauchsspuren. Perfekt für Gaming-Fans. Ein absolutes Must-have!'
  },
  {
    id: 36,
    sellerId: 3,
    listingNumber: 'KA-EL-008',
    title: 'Dell XPS 15 Laptop i7 16GB RAM 512GB SSD',
    price: '1.099,00 ₺',
    shipping: '+ 7,90 ₺ Kargo',
    location: 'Stuttgart',
    postalCode: '70173',
    city: 'Stuttgart',
    viewCount: 678,
    image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&q=80',
    isTop: true,
    date: '27.11.2025',
    category: 'Elektronik',
    subCategory: 'Dizüstü Bilgisayarlar',
    condition: 'İkinci El',
    description: 'Dell XPS 15 Premium Notebook. Intel Core i7, 16GB RAM, 512GB SSD, 15,6" Full HD Display. Perfekt für Arbeit und Multimedia. 1 Jahr alt, sehr guter Zustand. Inkl. Ladegerät und Tasche. Leistungsstarker Begleiter für unterwegs!'
  },
  {
    id: 37,
    sellerId: 1,
    listingNumber: 'KA-EL-009',
    title: 'Gaming PC i5-12400F RTX 3060 16GB RAM',
    price: '899,00 ₺',
    shipping: 'Gel Al',
    location: 'Düsseldorf',
    postalCode: '40210',
    city: 'Düsseldorf',
    viewCount: 1234,
    image: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=800&q=80',
    isTop: true,
    date: '27.11.2025',
    category: 'Elektronik',
    subCategory: 'Bilgisayarlar',
    condition: 'İkinci El',
    description: 'Custom Gaming PC: Intel i5-12400F, NVIDIA RTX 3060 12GB, 16GB DDR4 RAM, 500GB NVMe SSD. RGB Beleuchtung, leise Kühlung. Perfekt für aktuelle Games in hohen Einstellungen. 6 Monate alt, top Zustand. Nur Abholung. Bereit zum Zocken!'
  },
  {
    id: 38,
    sellerId: 2,
    listingNumber: 'KA-EL-010',
    title: 'Logitech MX Master 3 Maus + MX Keys Tastatur',
    price: '149,00 ₺',
    shipping: '+ 5,90 ₺ Kargo',
    location: 'Leipzig',
    postalCode: '04109',
    city: 'Leipzig',
    viewCount: 345,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80',
    isTop: true,
    date: '27.11.2025',
    category: 'Elektronik',
    subCategory: 'Bilgisayar Aksesuarları & Yazılım',
    condition: 'Yeni Gibi',
    description: 'Logitech MX Master 3 Maus und MX Keys Tastatur Set. Perfekt für Produktivität. Bluetooth und USB-Empfänger. Nur 2 Monate alt, wie neu. Ergonomisches Design, präzise Steuerung. Ideal für Büro und Home Office. Premium Qualität!'
  },
  {
    id: 39,
    sellerId: 3,
    listingNumber: 'KA-EL-011',
    title: 'Apple iPad Air 5. Gen 64GB WiFi - Blau',
    price: '499,00 ₺',
    shipping: '+ 5,90 ₺ Kargo',
    location: 'Dortmund',
    postalCode: '44135',
    city: 'Dortmund',
    viewCount: 567,
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80',
    isTop: true,
    date: '27.11.2025',
    category: 'Elektronik',
    subCategory: 'Tabletler & E-Okuyucular',
    condition: 'Yeni Gibi',
    description: 'Apple iPad Air 5. Generation in Blau, 64GB WiFi. M1 Chip, 10,9" Liquid Retina Display. Nur 3 Monate alt, neuwertig. Inkl. Originalverpackung und Ladekabel. Perfekt für Arbeit, Studium und Entertainment. Leistungsstark und elegant!'
  },
  {
    id: 40,
    sellerId: 1,
    listingNumber: 'KA-EL-012',
    title: 'Samsung 55" QLED 4K Smart TV Q60B',
    price: '649,00 ₺',
    shipping: 'Gel Al',
    location: 'Essen',
    postalCode: '45127',
    city: 'Essen',
    viewCount: 789,
    image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&q=80',
    isTop: true,
    date: '27.11.2025',
    category: 'Elektronik',
    subCategory: 'TV & Video',
    condition: 'Yeni Gibi',
    description: 'Samsung 55 Zoll QLED 4K Smart TV Q60B. Quantum HDR, 100% Farbvolumen, Tizen OS. 6 Monate alt, wie neu. Brillante Bildqualität, Smart Features. Inkl. Fernbedienung und Standfuß. Nur Abholung. Perfekt für Heimkino-Erlebnis!'
  },
  {
    id: 41,
    sellerId: 2,
    listingNumber: 'KA-EL-013',
    title: 'The Legend of Zelda: Tears of the Kingdom - Switch',
    price: '45,00 ₺',
    shipping: '+ 3,90 ₺ Kargo',
    location: 'Bremen',
    postalCode: '28195',
    city: 'Bremen',
    viewCount: 456,
    image: 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=800&q=80',
    isTop: true,
    date: '27.11.2025',
    category: 'Elektronik',
    subCategory: 'Video Oyunları',
    condition: 'Yeni Gibi',
    description: 'The Legend of Zelda: Tears of the Kingdom für Nintendo Switch. Nur einmal durchgespielt, wie neu. Inkl. Originalverpackung. Eines der besten Switch-Spiele! Episches Abenteuer mit atemberaubender Grafik. Ein Muss für Zelda-Fans!'
  },
  {
    id: 42,
    sellerId: 3,
    listingNumber: 'KA-EL-014',
    title: 'Philips Hue White & Color Starter Set E27',
    price: '129,00 ₺',
    shipping: '+ 5,90 ₺ Kargo',
    location: 'Dresden',
    postalCode: '01067',
    city: 'Dresden',
    viewCount: 234,
    image: 'https://images.unsplash.com/photo-1558089687-e460d2d7f0e2?w=800&q=80',
    isTop: true,
    date: '27.11.2025',
    category: 'Elektronik',
    subCategory: 'Diğer Elektronik',
    condition: 'Yeni',
    description: 'Philips Hue Starter Set mit 3 E27 Lampen und Bridge. 16 Millionen Farben, App-Steuerung, kompatibel mit Alexa und Google Home. Originalverpackt, ungeöffnet. Schaffen Sie die perfekte Atmosphäre in jedem Raum. Smart Home leicht gemacht!'
  },
  {
    id: 43,
    sellerId: 1,
    listingNumber: 'KA-HS-001',
    title: 'Aquarium 200L komplett mit Zubehör & Fischen',
    price: '299,00 ₺',
    shipping: 'Gel Al',
    location: 'Hamburg',
    postalCode: '20095',
    city: 'Hamburg',
    viewCount: 345,
    image: 'https://images.unsplash.com/photo-1520990269523-c5aed1f9a2d4?w=800&q=80',
    isTop: true,
    date: '27.11.2025',
    category: 'Evcil Hayvanlar',
    subCategory: 'Balıklar',
    condition: 'İkinci El',
    description: 'Komplettes Aquarium-Set 200L mit Unterschrank, Filter, Heizung, Beleuchtung und Dekoration. Inkl. verschiedene Zierfische. Sehr guter Zustand, läuft seit 2 Jahren problemlos. Nur Abholung. Perfekt für Aquaristik-Einsteiger oder Erweiterung!'
  },
  {
    id: 44,
    sellerId: 2,
    listingNumber: 'KA-HS-002',
    title: 'Golden Retriever Welpen - Reinrassig mit Papieren',
    price: '1.200,00 ₺',
    shipping: 'Gel Al',
    location: 'München',
    postalCode: '80331',
    city: 'München',
    viewCount: 1234,
    image: 'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=800&q=80',
    isTop: true,
    date: '27.11.2025',
    category: 'Evcil Hayvanlar',
    subCategory: 'Köpekler',
    condition: 'Yeni',
    description: 'Wunderschöne Golden Retriever Welpen aus liebevoller Hobbyzucht. 8 Wochen alt, geimpft, entwurmt, mit EU-Heimtierausweis und Stammbaum. Elterntiere vor Ort. Sehr sozial und verspielt. Perfekte Familienhunde. Besichtigung jederzeit möglich!'
  },
  {
    id: 45,
    sellerId: 3,
    listingNumber: 'KA-HS-003',
    title: 'Maine Coon Katzenbabys - Verschmust & Verspielt',
    price: '800,00 ₺',
    shipping: 'Gel Al',
    location: 'Berlin',
    postalCode: '10115',
    city: 'Berlin',
    viewCount: 892,
    image: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=800&q=80',
    isTop: true,
    date: '27.11.2025',
    category: 'Evcil Hayvanlar',
    subCategory: 'Kediler',
    condition: 'Yeni',
    description: 'Reinrassige Maine Coon Kitten, 12 Wochen alt. Geimpft, entwurmt, mit Stammbaum. Sehr verschmust und verspielt. An Kinder gewöhnt. Elterntiere können besichtigt werden. Perfekte Familienkatzen mit sanftem Wesen. Abgabe nur in liebevolle Hände!'
  },
  {
    id: 46,
    sellerId: 1,
    listingNumber: 'KA-HS-004',
    title: 'Zwergkaninchen Pärchen mit großem Gehege',
    price: '120,00 ₺',
    shipping: 'Gel Al',
    location: 'Köln',
    postalCode: '50667',
    city: 'Köln',
    viewCount: 234,
    image: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=800&q=80',
    isTop: true,
    date: '27.11.2025',
    category: 'Evcil Hayvanlar',
    subCategory: 'Küçük Hayvanlar',
    condition: 'İkinci El',
    description: 'Süßes Zwergkaninchen-Pärchen (1 Jahr alt) mit großem Gehege (150x80cm), Häuschen, Futternäpfen und Zubehör. Sehr zutraulich und handzahm. Perfekt für Kinder. Nur zusammen abzugeben. Aus zeitlichen Gründen schweren Herzens abzugeben.'
  },
  {
    id: 47,
    sellerId: 2,
    listingNumber: 'KA-HS-005',
    title: 'Hühner Legehennen - Verschiedene Rassen',
    price: '15,00 ₺',
    shipping: 'Gel Al',
    location: 'Stuttgart',
    postalCode: '70173',
    city: 'Stuttgart',
    viewCount: 456,
    image: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=800&q=80',
    isTop: true,
    date: '27.11.2025',
    category: 'Evcil Hayvanlar',
    subCategory: 'Çiftlik Hayvanları',
    condition: 'İkinci El',
    description: 'Gesunde Legehennen verschiedener Rassen (Braun, Weiß, Grünleger). 1-2 Jahre alt, legen regelmäßig. Preis pro Huhn. Mindestabnahme 3 Stück. Aus Freilandhaltung. Ideal für Selbstversorger oder Hobbyhalter. Sehr robust und pflegeleicht!'
  },
  {
    id: 48,
    sellerId: 3,
    listingNumber: 'KA-HS-006',
    title: 'Reitbeteiligung für Freizeitpferd gesucht',
    price: '150,00 ₺',
    shipping: 'Yerinde',
    location: 'Frankfurt',
    postalCode: '60311',
    city: 'Frankfurt',
    viewCount: 567,
    image: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=800&q=80',
    isTop: true,
    date: '27.11.2025',
    category: 'Evcil Hayvanlar',
    subCategory: 'Atlar',
    condition: 'Yeni',
    description: 'Suche zuverlässige Reitbeteiligung für meinen 8-jährigen Wallach (Warmblut, 165cm). Freizeitpferd, geländesicher, für Anfänger geeignet. 2-3x pro Woche. Monatliche Beteiligung 150₺. Schöner Stall mit Halle und Außenplatz. Erfahrung mit Pferden erwünscht!'
  },
  {
    id: 49,
    sellerId: 1,
    listingNumber: 'KA-HS-007',
    title: 'Hundesitting & Gassi-Service - Erfahren & Zuverlässig',
    price: '25,00 ₺',
    shipping: 'Yerinde Servis',
    location: 'Düsseldorf',
    postalCode: '40210',
    city: 'Düsseldorf',
    viewCount: 678,
    image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&q=80',
    isTop: true,
    date: '27.11.2025',
    category: 'Evcil Hayvanlar',
    subCategory: 'Hayvan Bakımı & Eğitimi',
    condition: 'Yeni',
    description: 'Biete professionelle Hundebetreuung und Gassi-Service. Über 5 Jahre Erfahrung mit allen Rassen. Flexible Zeiten, auch am Wochenende. Einzelbetreuung oder Gruppenausflüge möglich. Versichert und zuverlässig. Ihr Hund ist bei mir in besten Händen!'
  },
  {
    id: 50,
    sellerId: 2,
    listingNumber: 'KA-HS-008',
    title: 'VERMISST: Graue Hauskatze "Luna" - Belohnung!',
    price: '0,00 ₺',
    shipping: 'Yerinde',
    location: 'Leipzig',
    postalCode: '04109',
    city: 'Leipzig',
    viewCount: 234,
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&q=80',
    isTop: true,
    date: '27.11.2025',
    category: 'Evcil Hayvanlar',
    subCategory: 'Kayıp Hayvanlar',
    condition: 'Yeni',
    description: 'VERMISST seit 25.11.2025: Graue Hauskatze "Luna", weiblich, 3 Jahre alt, grüne Augen, weißer Fleck auf der Brust. Sehr scheu. Zuletzt gesehen in Leipzig-Zentrum. Bitte melden bei Hinweisen! Belohnung! Sie fehlt uns sehr!'
  },
  {
    id: 51,
    sellerId: 3,
    listingNumber: 'KA-HS-009',
    title: 'Wellensittiche Pärchen - Handzahm & Zahm',
    price: '45,00 ₺',
    shipping: '+ 15,00 ₺ Kargo',
    location: 'Dortmund',
    postalCode: '44135',
    city: 'Dortmund',
    viewCount: 345,
    image: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=800&q=80',
    isTop: true,
    date: '27.11.2025',
    category: 'Evcil Hayvanlar',
    subCategory: 'Kuşlar',
    condition: 'İkinci El',
    description: 'Handzahmes Wellensittich-Pärchen, blau und grün, 1 Jahr alt. Sehr zutraulich, kommen auf die Hand. Gesund und munter. Inkl. Käfig (60x40cm) und Zubehör gegen Aufpreis. Perfekt für Anfänger. Nur zusammen abzugeben!'
  },
  {
    id: 52,
    sellerId: 1,
    listingNumber: 'KA-HS-010',
    title: 'Kratzbaum XXL 180cm - Wie Neu',
    price: '89,00 ₺',
    shipping: 'Gel Al',
    location: 'Bremen',
    postalCode: '28195',
    city: 'Bremen',
    viewCount: 456,
    image: 'https://images.unsplash.com/photo-1545249390-6bdfa286032f?w=800&q=80',
    isTop: true,
    date: '27.11.2025',
    category: 'Evcil Hayvanlar',
    subCategory: 'Aksesuarlar',
    condition: 'Yeni Gibi',
    description: 'XXL Kratzbaum 180cm hoch mit mehreren Ebenen, Höhlen und Liegeflächen. Beige/Braun, sehr stabil. Nur 3 Monate alt, wie neu. Perfekt für große Katzen oder Mehrkatzenhaushalt. Selbstabholung bevorzugt. Katzen lieben ihn!'
  },
  {
    id: 53,
    sellerId: 2,
    listingNumber: 'KA-FK-001',
    title: 'Altenpflege 24h Betreuung - Erfahren & Liebevoll',
    price: '2.500,00 ₺',
    shipping: 'Yerinde Servis',
    location: 'Hamburg',
    postalCode: '20095',
    city: 'Hamburg',
    viewCount: 234,
    image: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=800&q=80',
    isTop: true,
    date: '27.11.2025',
    category: 'Aile, Çocuk & Bebek',
    subCategory: 'Altenpflege',
    condition: 'Yeni',
    description: 'Professionelle 24h Altenpflege und Betreuung. Erfahrene Pflegekräfte mit Herz. Individuelle Betreuung, Medikamentengabe, Hauswirtschaft. Auch stundenweise möglich. Kostenlose Erstberatung. Ihre Liebsten sind bei uns in besten Händen!'
  },
  {
    id: 54,
    sellerId: 3,
    listingNumber: 'KA-FK-002',
    title: 'Baby Kleidungspaket Größe 62-68 - 20 Teile',
    price: '45,00 ₺',
    shipping: '+ 5,90 ₺ Kargo',
    location: 'Berlin',
    postalCode: '10115',
    city: 'Berlin',
    viewCount: 567,
    image: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800&q=80',
    isTop: true,
    date: '27.11.2025',
    category: 'Aile, Çocuk & Bebek',
    subCategory: 'Baby- & Kinderkleidung',
    condition: 'İkinci El',
    description: 'Süßes Babykleidungs-Paket in Größe 62-68. 20 Teile: Bodies, Strampler, Hosen, Oberteile. Verschiedene Marken (H&M, C&A, etc.). Sehr guter Zustand, gewaschen und gebügelt. Perfekt für die ersten Monate. Junge/Mädchen gemischt. Tolle Erstausstattung!'
  },
  {
    id: 55,
    sellerId: 1,
    listingNumber: 'KA-FK-003',
    title: 'Kinder Sneaker Nike Größe 28 - Wie Neu',
    price: '28,00 ₺',
    shipping: '+ 4,90 ₺ Kargo',
    location: 'München',
    postalCode: '80331',
    city: 'München',
    viewCount: 345,
    image: 'https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=800&q=80',
    isTop: true,
    date: '27.11.2025',
    category: 'Aile, Çocuk & Bebek',
    subCategory: 'Baby- & Kinderschuhe',
    condition: 'Yeni Gibi',
    description: 'Nike Kinder Sneaker in Größe 28, wie neu. Nur 2x getragen, da zu klein gekauft. Bequem und robust. Perfekt für aktive Kids. Keine Gebrauchsspuren. Originalkarton vorhanden. Tolle Qualität zum fairen Preis!'
  },
  {
    id: 56,
    sellerId: 2,
    listingNumber: 'KA-FK-004',
    title: 'Babybett 70x140cm mit Matratze - Weiß',
    price: '120,00 ₺',
    shipping: 'Gel Al',
    location: 'Köln',
    postalCode: '50667',
    city: 'Köln',
    viewCount: 678,
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&q=80',
    isTop: true,
    date: '27.11.2025',
    category: 'Aile, Çocuk & Bebek',
    subCategory: 'Baby-Ausstattung',
    condition: 'İkinci El',
    description: 'Hochwertiges Babybett 70x140cm in Weiß mit höhenverstellbarem Lattenrost. Inkl. Matratze. 3 Schlupfsprossen. Umbaubar zum Juniorbett. Sehr guter Zustand, keine Beschädigungen. Nur Abholung. Perfekt für die ersten Jahre!'
  },
  {
    id: 57,
    sellerId: 3,
    listingNumber: 'KA-FK-005',
    title: 'Maxi-Cosi Babyschale mit Isofix Base',
    price: '89,00 ₺',
    shipping: '+ 8,90 ₺ Kargo',
    location: 'Frankfurt',
    postalCode: '60311',
    city: 'Frankfurt',
    viewCount: 892,
    image: 'https://images.unsplash.com/photo-1617854818583-09e7f077a156?w=800&q=80',
    isTop: true,
    date: '27.11.2025',
    category: 'Aile, Çocuk & Bebek',
    subCategory: 'Babyschalen & Kindersitze',
    condition: 'İkinci El',
    description: 'Maxi-Cosi Babyschale Gruppe 0+ mit Isofix Base. Für Neugeborene bis 13kg. Sehr sicher und komfortabel. 2 Jahre alt, unfallfrei. Inkl. Sonnenverdeck und Regenschutz. Bezug waschbar. Perfekt für sichere Autofahrten mit Baby!'
  },
  {
    id: 58,
    sellerId: 1,
    listingNumber: 'KA-FK-006',
    title: 'Kinderbetreuung Tagesmutter - Liebevoll & Flexibel',
    price: '5,00 ₺',
    shipping: 'Yerinde Servis',
    location: 'Stuttgart',
    postalCode: '70173',
    city: 'Stuttgart',
    viewCount: 456,
    image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&q=80',
    isTop: true,
    date: '27.11.2025',
    category: 'Aile, Çocuk & Bebek',
    subCategory: 'Babysitter/-in & Kinderbetreuung',
    condition: 'Yeni',
    description: 'Erfahrene Tagesmutter bietet liebevolle Kinderbetreuung. Flexible Zeiten, auch spontan möglich. Großer Garten, viele Spielsachen. Gesunde Mahlzeiten inklusive. Referenzen vorhanden. 5₺/Stunde. Noch 2 Plätze frei. Ihr Kind ist bei mir bestens aufgehoben!'
  },
  {
    id: 59,
    sellerId: 2,
    listingNumber: 'KA-FK-007',
    title: 'Bugaboo Kinderwagen Cameleon 3 - Komplett-Set',
    price: '450,00 ₺',
    shipping: 'Gel Al',
    location: 'Düsseldorf',
    postalCode: '40210',
    city: 'Düsseldorf',
    viewCount: 1123,
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80',
    isTop: true,
    date: '27.11.2025',
    category: 'Aile, Çocuk & Bebek',
    subCategory: 'Kinderwagen & Buggys',
    condition: 'İkinci El',
    description: 'Bugaboo Cameleon 3 Kinderwagen Komplett-Set. Inkl. Babywanne, Sportsitz, Regenschutz, Sonnenschirm, Adapter. Grau/Schwarz. Sehr guter Zustand, gepflegt. Wendig und komfortabel. Perfekt für Stadt und Land. Ein Premium-Kinderwagen!'
  },
  {
    id: 60,
    sellerId: 3,
    listingNumber: 'KA-FK-008',
    title: 'Kinderzimmer Komplett-Set Weiß/Rosa - 3-teilig',
    price: '399,00 ₺',
    shipping: 'Gel Al',
    location: 'Leipzig',
    postalCode: '04109',
    city: 'Leipzig',
    viewCount: 789,
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80',
    isTop: true,
    date: '27.11.2025',
    category: 'Aile, Çocuk & Bebek',
    subCategory: 'Kinderzimmermöbel',
    condition: 'İkinci El',
    description: 'Komplettes Kinderzimmer-Set in Weiß/Rosa. 3-teilig: Kleiderschrank (120cm), Bett (90x200cm), Schreibtisch. Sehr guter Zustand, stabil und hochwertig. Perfekt für Mädchenzimmer. Nur Abholung, kann zerlegt werden. Schaffen Sie ein Traumzimmer!'
  },
  {
    id: 61,
    sellerId: 1,
    listingNumber: 'KA-FK-009',
    title: 'LEGO Duplo Großes Konvolut - Über 200 Teile',
    price: '65,00 ₺',
    shipping: '+ 7,90 ₺ Kargo',
    location: 'Dortmund',
    postalCode: '44135',
    city: 'Dortmund',
    viewCount: 1234,
    image: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=800&q=80',
    isTop: true,
    date: '27.11.2025',
    category: 'Aile, Çocuk & Bebek',
    subCategory: 'Spielzeug',
    condition: 'İkinci El',
    description: 'Großes LEGO Duplo Konvolut mit über 200 Teilen. Verschiedene Sets: Bauernhof, Eisenbahn, Bausteine, Figuren, Tiere. Vollständig und sauber. Perfekt für Kinder ab 2 Jahren. Fördert Kreativität und Motorik. Stundenlanger Spielspaß garantiert!'
  },
  {
    id: 62,
    sellerId: 2,
    listingNumber: 'KA-FK-010',
    title: 'Stillkissen XXL Theraline - Grau',
    price: '35,00 ₺',
    shipping: '+ 5,90 ₺ Kargo',
    location: 'Bremen',
    postalCode: '28195',
    city: 'Bremen',
    viewCount: 345,
    image: 'https://images.unsplash.com/photo-1586339277861-b0b895343ba5?w=800&q=80',
    isTop: true,
    date: '27.11.2025',
    category: 'Aile, Çocuk & Bebek',
    subCategory: 'Weiteres Familie, Kind & Baby',
    condition: 'İkinci El',
    description: 'Theraline Stillkissen XXL in Grau. 190cm lang, mit Mikroperlenfüllung. Sehr bequem und vielseitig einsetzbar. Bezug waschbar bei 60°C. Guter Zustand, hygienisch gereinigt. Perfekt für Schwangerschaft, Stillen und als Lagerungskissen. Unverzichtbar für Mamas!'
  },
  {
    id: 63,
    sellerId: 1,
    listingNumber: 'KA-JOB-001',
    title: 'Ausbildung zum Fachinformatiker (m/w/d) 2026',
    price: '1.100,00 ₺',
    shipping: 'Yerinde',
    location: 'Hamburg',
    postalCode: '20095',
    city: 'Hamburg',
    viewCount: 567,
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80',
    isTop: true,
    date: '27.11.2025',
    category: 'İş İlanları',
    subCategory: 'Ausbildung',
    condition: 'Yeni',
    description: 'Starte deine Karriere! Ausbildung zum Fachinformatiker für Anwendungsentwicklung ab August 2026. Vergütung 1. Jahr: 1.100₺. Moderne Technik, erfahrene Ausbilder, Übernahmegarantie. Bewirb dich jetzt mit Lebenslauf und Zeugnissen!'
  },
  {
    id: 64,
    sellerId: 2,
    listingNumber: 'KA-JOB-002',
    title: 'Maurer/Bauhelfer (m/w/d) - Sofort gesucht!',
    price: '3.200,00 ₺',
    shipping: 'Yerinde',
    location: 'Berlin',
    postalCode: '10115',
    city: 'Berlin',
    viewCount: 892,
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80',
    isTop: true,
    date: '27.11.2025',
    category: 'İş İlanları',
    subCategory: 'İnşaat, Zanaat & Üretim',
    condition: 'Yeni',
    description: 'Wir suchen Maurer und Bauhelfer in Vollzeit. Gehalt ab 3.200₺/Monat. Erfahrung erwünscht, aber auch Quereinsteiger willkommen. Firmenwagen, Werkzeug gestellt. Unbefristeter Vertrag. Sofortiger Einstieg möglich. Bewirb dich jetzt!'
  },
  {
    id: 65,
    sellerId: 3,
    listingNumber: 'KA-JOB-003',
    title: 'Bürokauffrau/-mann (m/w/d) Teilzeit 20h',
    price: '1.800,00 ₺',
    shipping: 'Yerinde',
    location: 'München',
    postalCode: '80331',
    city: 'München',
    viewCount: 456,
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
    isTop: true,
    date: '27.11.2025',
    category: 'İş İlanları',
    subCategory: 'Büroarbeit & Verwaltung',
    condition: 'Yeni',
    description: 'Bürokauffrau/-mann für allgemeine Verwaltungsaufgaben gesucht. Teilzeit 20h/Woche, flexible Arbeitszeiten. 1.800₺/Monat. MS Office Kenntnisse erforderlich. Nettes Team, moderne Büros. Homeoffice teilweise möglich. Bewerbung per E-Mail!'
  },
  {
    id: 66,
    sellerId: 1,
    listingNumber: 'KA-JOB-004',
    title: 'Kellner/in für Restaurant - Vollzeit',
    price: '2.400,00 ₺',
    shipping: 'Yerinde',
    location: 'Köln',
    postalCode: '50667',
    city: 'Köln',
    viewCount: 678,
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80',
    isTop: true,
    date: '27.11.2025',
    category: 'İş İlanları',
    subCategory: 'Gastronomie & Tourismus',
    condition: 'Yeni',
    description: 'Erfahrene/r Kellner/in für gehobenes Restaurant gesucht. Vollzeit, 2.400₺ + Trinkgeld. Schichtdienst, 2 Tage frei/Woche. Freundliches Team, gute Arbeitsatmosphäre. Erfahrung in der Gastronomie erforderlich. Sofortiger Einstieg möglich!'
  },
  {
    id: 67,
    sellerId: 2,
    listingNumber: 'KA-JOB-005',
    title: 'Kundenberater Call Center (m/w/d) - Homeoffice',
    price: '2.200,00 ₺',
    shipping: 'Homeoffice',
    location: 'Frankfurt',
    postalCode: '60311',
    city: 'Frankfurt',
    viewCount: 1234,
    image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&q=80',
    isTop: true,
    date: '27.11.2025',
    category: 'İş İlanları',
    subCategory: 'Kundenservice & Call Center',
    condition: 'Yeni',
    description: 'Kundenberater für Inbound-Telefonie gesucht. 100% Homeoffice möglich! 2.200₺/Monat, Vollzeit. Flexible Schichten, auch Quereinsteiger willkommen. Einarbeitung bezahlt. Gute Deutschkenntnisse erforderlich. Starte deine Karriere von zu Hause!'
  },
  {
    id: 68,
    sellerId: 3,
    listingNumber: 'KA-JOB-006',
    title: 'Minijob Prospektverteiler (m/w/d) 520₺',
    price: '520,00 ₺',
    shipping: 'Yerinde',
    location: 'Stuttgart',
    postalCode: '70173',
    city: 'Stuttgart',
    viewCount: 789,
    image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&q=80',
    isTop: true,
    date: '27.11.2025',
    category: 'İş İlanları',
    subCategory: 'Mini- & Nebenjobs',
    condition: 'Yeni',
    description: 'Minijob als Prospektverteiler auf 520₺-Basis. Flexible Zeiten, ca. 10h/Woche. Perfekt als Nebenjob oder für Studenten. Eigenes Auto von Vorteil. Einfache Tätigkeit, zuverlässige Bezahlung. Sofort starten möglich. Bewirb dich jetzt!'
  },
  {
    id: 69,
    sellerId: 1,
    listingNumber: 'KA-JOB-007',
    title: 'Praktikum Marketing & Social Media 6 Monate',
    price: '800,00 ₺',
    shipping: 'Yerinde',
    location: 'Düsseldorf',
    postalCode: '40210',
    city: 'Düsseldorf',
    viewCount: 456,
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
    isTop: true,
    date: '27.11.2025',
    category: 'İş İlanları',
    subCategory: 'Praktika',
    condition: 'Yeni',
    description: 'Praktikum im Marketing & Social Media ab sofort für 6 Monate. 800₺/Monat Vergütung. Lerne Content Creation, Instagram, TikTok Management. Kreatives Team, moderne Büros. Ideal für Studenten. Übernahme nach Praktikum möglich. Bewirb dich mit Portfolio!'
  },
  {
    id: 70,
    sellerId: 2,
    listingNumber: 'KA-JOB-008',
    title: 'Pflegefachkraft (m/w/d) - Attraktive Bezahlung',
    price: '3.800,00 ₺',
    shipping: 'Yerinde',
    location: 'Leipzig',
    postalCode: '04109',
    city: 'Leipzig',
    viewCount: 1123,
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80',
    isTop: true,
    date: '27.11.2025',
    category: 'İş İlanları',
    subCategory: 'Sozialer Sektor & Pflege',
    condition: 'Yeni',
    description: 'Pflegefachkraft für Seniorenheim gesucht. Gehalt ab 3.800₺ + Zulagen. Vollzeit/Teilzeit möglich. Modernes Arbeitsumfeld, kleine Teams, faire Dienstpläne. Unbefristeter Vertrag, betriebliche Altersvorsorge. Wir schätzen deine Arbeit! Jetzt bewerben!'
  },
  {
    id: 71,
    sellerId: 3,
    listingNumber: 'KA-JOB-009',
    title: 'LKW Fahrer CE (m/w/d) - Fernverkehr',
    price: '3.500,00 ₺',
    shipping: 'Deutschlandweit',
    location: 'Dortmund',
    postalCode: '44135',
    city: 'Dortmund',
    viewCount: 892,
    image: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800&q=80',
    isTop: true,
    date: '27.11.2025',
    category: 'İş İlanları',
    subCategory: 'Transport, Logistik & Verkehr',
    condition: 'Yeni',
    description: 'LKW Fahrer mit Führerschein CE für Fernverkehr gesucht. 3.500₺/Monat + Spesen. Moderne Fahrzeuge, regelmäßige Heimfahrten. Unbefristeter Vertrag, Weihnachts-/Urlaubsgeld. Berufserfahrung erforderlich. Starte deine Tour mit uns! Jetzt bewerben!'
  },
  {
    id: 72,
    sellerId: 1,
    listingNumber: 'KA-JOB-010',
    title: 'Verkäufer/in Einzelhandel (m/w/d) Vollzeit',
    price: '2.600,00 ₺',
    shipping: 'Yerinde',
    location: 'Bremen',
    postalCode: '28195',
    city: 'Bremen',
    viewCount: 567,
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80',
    isTop: true,
    date: '27.11.2025',
    category: 'İş İlanları',
    subCategory: 'Vertrieb, Einkauf & Verkauf',
    condition: 'Yeni',
    description: 'Verkäufer/in für Modegeschäft gesucht. Vollzeit, 2.600₺/Monat. Freundliches Auftreten, Verkaufstalent. Mitarbeiterrabatt, flexible Arbeitszeiten. Erfahrung im Einzelhandel von Vorteil. Nettes Team, zentrale Lage. Bewirb dich mit Lebenslauf!'
  },
  {
    id: 73,
    sellerId: 2,
    listingNumber: 'KA-JOB-011',
    title: 'IT Support Mitarbeiter (m/w/d) - Quereinsteiger OK',
    price: '2.800,00 ₺',
    shipping: 'Yerinde',
    location: 'Dresden',
    postalCode: '01067',
    city: 'Dresden',
    viewCount: 678,
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&q=80',
    isTop: true,
    date: '27.11.2025',
    category: 'İş İlanları',
    subCategory: 'Weitere Jobs',
    condition: 'Yeni',
    description: 'IT Support Mitarbeiter für First Level Support gesucht. 2.800₺/Monat, Vollzeit. Auch Quereinsteiger mit IT-Affinität willkommen! Einarbeitung garantiert. Homeoffice teilweise möglich. Modernes Büro, junges Team. Starte deine IT-Karriere! Jetzt bewerben!'
  },
  {
    id: 74,
    sellerId: 3,
    listingNumber: 'KA-FHN-001',
    title: 'Tarot Kartenlesung - Spirituelle Beratung',
    price: '45,00 ₺',
    shipping: 'Online/Yerinde',
    location: 'Hamburg',
    postalCode: '20095',
    city: 'Hamburg',
    viewCount: 234,
    image: 'https://images.unsplash.com/photo-1551269901-5c5e14c25df7?w=800&q=80',
    isTop: true,
    date: '27.11.2025',
    category: 'Eğlence, Hobi & Mahalle',
    subCategory: 'Ezoterizm & Spiritüalizm',
    condition: 'Yeni',
    description: 'Professionelle Tarot Kartenlesung und spirituelle Lebensberatung. Über 10 Jahre Erfahrung. Online oder persönlich. Finde Antworten auf deine Fragen zu Liebe, Karriere, Zukunft. Einfühlsam und diskret. Termine nach Vereinbarung. Erste Sitzung 45₺.'
  },
  {
    id: 75,
    sellerId: 1,
    listingNumber: 'KA-FHN-002',
    title: 'Italienischer Rotwein Barolo DOCG 2018',
    price: '35,00 ₺',
    shipping: '+ 6,90 ₺ Kargo',
    location: 'München',
    postalCode: '80331',
    city: 'München',
    viewCount: 456,
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&q=80',
    isTop: true,
    date: '27.11.2025',
    category: 'Eğlence, Hobi & Mahalle',
    subCategory: 'Yiyecek & İçecek',
    condition: 'Yeni',
    description: 'Edler italienischer Barolo DOCG Rotwein Jahrgang 2018. Ungeöffnet, perfekt gelagert. Vollmundiger Geschmack, ideal zu Fleischgerichten. Perfekt als Geschenk oder für besondere Anlässe. Versand möglich. Ein Genuss für Weinkenner!'
  },
  {
    id: 76,
    sellerId: 2,
    listingNumber: 'KA-FHN-003',
    title: 'Yoga Kurs für Anfänger - 10er Karte',
    price: '120,00 ₺',
    shipping: 'Yerinde',
    location: 'Berlin',
    postalCode: '10115',
    city: 'Berlin',
    viewCount: 678,
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80',
    isTop: true,
    date: '27.11.2025',
    category: 'Eğlence, Hobi & Mahalle',
    subCategory: 'Boş Zaman Aktiviteleri',
    condition: 'Yeni',
    description: 'Yoga Anfängerkurs - 10er Karte für 120₺. Entspannung, Flexibilität, innere Ruhe. Kleine Gruppen, erfahrene Lehrerin. Montags und Mittwochs 18:00 Uhr. Matten vorhanden. Perfekt zum Stressabbau. Schnupperstunde kostenlos! Jetzt anmelden!'
  },
  {
    id: 77,
    sellerId: 3,
    listingNumber: 'KA-FHN-004',
    title: 'Strickset Anfänger - Wolle, Nadeln & Anleitung',
    price: '28,00 ₺',
    shipping: '+ 4,90 ₺ Kargo',
    location: 'Köln',
    postalCode: '50667',
    city: 'Köln',
    viewCount: 345,
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80',
    isTop: true,
    date: '27.11.2025',
    category: 'Eğlence, Hobi & Mahalle',
    subCategory: 'El Sanatları & Hobi',
    condition: 'Yeni',
    description: 'Komplettes Strickset für Anfänger. Hochwertige Wolle in verschiedenen Farben, Stricknadeln Größe 5, ausführliche Anleitung für Schal. Perfekt zum Einstieg ins Stricken. Entspannendes Hobby. Ideal als Geschenk. Neu und originalverpackt!'
  },
  {
    id: 78,
    sellerId: 1,
    listingNumber: 'KA-FHN-005',
    title: 'Antikes Ölgemälde Landschaft - Signiert',
    price: '450,00 ₺',
    shipping: 'Gel Al',
    location: 'Frankfurt',
    postalCode: '60311',
    city: 'Frankfurt',
    viewCount: 892,
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&q=80',
    isTop: true,
    date: '27.11.2025',
    category: 'Eğlence, Hobi & Mahalle',
    subCategory: 'Sanat & Antikalar',
    condition: 'İkinci El',
    description: 'Wunderschönes antikes Ölgemälde mit Landschaftsmotiv. Signiert, ca. 1920er Jahre. 60x80cm, originaler Rahmen. Sehr guter Erhaltungszustand. Echtes Kunstwerk mit Geschichte. Nur Abholung. Perfekt für Sammler und Kunstliebhaber. Ein Unikat!'
  },
  {
    id: 79,
    sellerId: 2,
    listingNumber: 'KA-FHN-006',
    title: 'Live Musik für Events - Akustik Duo',
    price: '400,00 ₺',
    shipping: 'Yerinde',
    location: 'Stuttgart',
    postalCode: '70173',
    city: 'Stuttgart',
    viewCount: 567,
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&q=80',
    isTop: false,
    date: '27.11.2025',
    category: 'Eğlence, Hobi & Mahalle',
    subCategory: 'Sanatçılar & Müzisyenler',
    condition: 'Yeni',
    description: 'Professionelles Akustik Duo für Hochzeiten, Geburtstage, Firmenevents. Gitarre & Gesang, vielseitiges Repertoire von Pop bis Jazz. Über 5 Jahre Bühnenerfahrung. Preis ab 400₺ (3 Stunden). Referenzen vorhanden. Unvergessliche musikalische Untermalung!'
  },
  {
    id: 80,
    sellerId: 3,
    listingNumber: 'KA-FHN-007',
    title: 'Märklin H0 Eisenbahn Set - Komplett',
    price: '280,00 ₺',
    shipping: 'Gel Al',
    location: 'Düsseldorf',
    postalCode: '40210',
    city: 'Düsseldorf',
    viewCount: 1123,
    image: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=800&q=80',
    isTop: true,
    date: '27.11.2025',
    category: 'Eğlence, Hobi & Mahalle',
    subCategory: 'Model Yapımı',
    condition: 'İkinci El',
    description: 'Märklin H0 Modelleisenbahn Komplett-Set. Lok, 8 Waggons, Gleise (Oval + Erweiterungen), Trafo, Zubehör. Sehr guter Zustand, voll funktionsfähig. Perfekt für Einsteiger oder Sammler. Nur Abholung. Stundenlanger Spielspaß garantiert!'
  },
  {
    id: 81,
    sellerId: 1,
    listingNumber: 'KA-FHN-008',
    title: 'Hochzeitsplanung & Eventservice - Professionell',
    price: '1.500,00 ₺',
    shipping: 'Yerinde Servis',
    location: 'Leipzig',
    postalCode: '04109',
    city: 'Leipzig',
    viewCount: 789,
    image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80',
    isTop: true,
    date: '27.11.2025',
    category: 'Eğlence, Hobi & Mahalle',
    subCategory: 'Seyahat & Etkinlik Hizmetleri',
    condition: 'Yeni',
    description: 'Professionelle Hochzeitsplanung von A-Z. Location-Suche, Dekoration, Catering, Musik, Fotograf. Über 50 erfolgreiche Events. Individuelle Beratung, stressfreie Planung. Paket ab 1.500₺. Kostenlose Erstberatung. Euer Traumtag in besten Händen!'
  },
  {
    id: 82,
    sellerId: 2,
    listingNumber: 'KA-FHN-009',
    title: 'Briefmarkensammlung Deutschland 1950-2000',
    price: '350,00 ₺',
    shipping: '+ 8,90 ₺ Kargo',
    location: 'Dortmund',
    postalCode: '44135',
    city: 'Dortmund',
    viewCount: 1234,
    image: 'https://images.unsplash.com/photo-1509043759401-136742328bb3?w=800&q=80',
    isTop: true,
    date: '27.11.2025',
    category: 'Eğlence, Hobi & Mahalle',
    subCategory: 'Koleksiyon',
    condition: 'İkinci El',
    description: 'Umfangreiche Briefmarkensammlung Deutschland 1950-2000. Über 500 Marken, viele Sondermarken, komplett in Alben. Sehr guter Zustand, katalogisiert. Perfekt für Sammler oder als Wertanlage. Versand versichert möglich. Ein Schatz für Philatelisten!'
  },
  {
    id: 83,
    sellerId: 3,
    listingNumber: 'KA-FHN-010',
    title: 'Camping Zelt 4 Personen + Zubehör',
    price: '120,00 ₺',
    shipping: 'Gel Al',
    location: 'Bremen',
    postalCode: '28195',
    city: 'Bremen',
    viewCount: 678,
    image: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800&q=80',
    isTop: true,
    date: '27.11.2025',
    category: 'Eğlence, Hobi & Mahalle',
    subCategory: 'Spor & Kamp',
    condition: 'İkinci El',
    description: '4-Personen Camping Zelt mit Vorzelt. Wasserdicht, schneller Aufbau. Inkl. Heringe, Abspannseile, Tragetasche. 3x benutzt, sehr guter Zustand. Perfekt für Festivals und Campingurlaub. Nur Abholung. Bereit für dein nächstes Abenteuer!'
  },
  {
    id: 84,
    sellerId: 1,
    listingNumber: 'KA-FHN-011',
    title: 'Flohmarkt Haushaltsauflösung - Diverses',
    price: '5,00 ₺',
    shipping: 'Gel Al',
    location: 'Dresden',
    postalCode: '01067',
    city: 'Dresden',
    viewCount: 456,
    image: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=800&q=80',
    isTop: true,
    date: '27.11.2025',
    category: 'Eğlence, Hobi & Mahalle',
    subCategory: 'Bit Pazarı',
    condition: 'İkinci El',
    description: 'Haushaltsauflösung - Diverses zu verkaufen! Geschirr, Deko, Bücher, Kleinkram. Preise ab 5₺. Samstag 10-16 Uhr Besichtigung möglich. Nur Abholung, Barzahlung. Stöbern lohnt sich! Schnäppchen garantiert. Kommt vorbei und findet eure Schätze!'
  },
  {
    id: 85,
    sellerId: 2,
    listingNumber: 'KA-FHN-012',
    title: 'GEFUNDEN: Schwarzer Rucksack am Hauptbahnhof',
    price: '0,00 ₺',
    shipping: 'Gel Al',
    location: 'Hamburg',
    postalCode: '20095',
    city: 'Hamburg',
    viewCount: 234,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',
    isTop: true,
    date: '27.11.2025',
    category: 'Eğlence, Hobi & Mahalle',
    subCategory: 'Kayıp & Buluntu',
    condition: 'İkinci El',
    description: 'GEFUNDEN am 25.11.2025 am Hamburger Hauptbahnhof: Schwarzer Rucksack mit Laptop und Unterlagen. Bitte melden mit genauer Beschreibung des Inhalts. Ehrlicher Finder möchte zurückgeben. Kontakt per E-Mail oder Telefon. Hoffe, der Besitzer meldet sich!'
  },
  {
    id: 86,
    sellerId: 3,
    listingNumber: 'KA-FHN-013',
    title: 'Nachbarschaftshilfe - Garten, Einkauf, Haushalt',
    price: '15,00 ₺',
    shipping: 'Yerinde',
    location: 'Berlin',
    postalCode: '10115',
    city: 'Berlin',
    viewCount: 345,
    image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&q=80',
    isTop: true,
    date: '27.11.2025',
    category: 'Eğlence, Hobi & Mahalle',
    subCategory: 'Diğer Eğlence, Hobi & Mahalle',
    condition: 'Yeni',
    description: 'Biete Nachbarschaftshilfe in Berlin-Mitte. Gartenarbeit, Einkäufe, Haushaltshilfe, Botengänge. 15₺/Stunde. Zuverlässig, freundlich, flexibel. Ideal für Senioren oder Berufstätige. Auch kurzfristig verfügbar. Referenzen vorhanden. Helfe gerne in der Nachbarschaft!'
  },
  {
    id: 87,
    sellerId: 1,
    listingNumber: 'KA-MFB-001',
    title: 'Harry Potter Komplett-Set - Alle 7 Bände',
    price: '35,00 ₺',
    shipping: '+ 5,90 ₺ Kargo',
    location: 'Hamburg',
    postalCode: '20095',
    city: 'Hamburg',
    viewCount: 678,
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80',
    isTop: true,
    date: '27.11.2025',
    category: 'Müzik, Film & Kitap',
    subCategory: 'Kitap & Dergi',
    condition: 'İkinci El',
    description: 'Harry Potter Komplett-Set mit allen 7 Bänden. Deutsche Ausgabe, Taschenbuch. Sehr guter Zustand, nur leichte Gebrauchsspuren. Perfekt für Fans oder als Geschenk. Versand möglich. Tauche ein in die magische Welt von Hogwarts!'
  },
  {
    id: 88,
    sellerId: 2,
    listingNumber: 'KA-MFB-002',
    title: 'Schreibtisch-Organizer Set - 5-teilig',
    price: '18,00 ₺',
    shipping: '+ 4,90 ₺ Kargo',
    location: 'München',
    postalCode: '80331',
    city: 'München',
    viewCount: 234,
    image: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=800&q=80',
    isTop: true,
    date: '27.11.2025',
    category: 'Müzik, Film & Kitap',
    subCategory: 'Kırtasiye',
    condition: 'Yeni',
    description: '5-teiliges Schreibtisch-Organizer Set aus Bambus. Stifthalter, Ablagefächer, Notizzettelhalter. Nachhaltig und stylisch. Perfekt für Homeoffice oder Büro. Neu und originalverpackt. Ordnung auf dem Schreibtisch leicht gemacht!'
  },
  {
    id: 89,
    sellerId: 3,
    listingNumber: 'KA-MFB-003',
    title: 'Marvel Comics Sammlung - 25 Hefte',
    price: '85,00 ₺',
    shipping: '+ 6,90 ₺ Kargo',
    location: 'Berlin',
    postalCode: '10115',
    city: 'Berlin',
    viewCount: 892,
    image: 'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=800&q=80',
    isTop: true,
    date: '27.11.2025',
    category: 'Müzik, Film & Kitap',
    subCategory: 'Çizgi Romanlar',
    condition: 'İkinci El',
    description: 'Marvel Comics Sammlung mit 25 Heften. Spider-Man, Avengers, X-Men. Verschiedene Ausgaben aus den 90ern und 2000ern. Guter Zustand, komplett. Perfekt für Sammler. Versand versichert möglich. Ein Schatz für Marvel-Fans!'
  },
  {
    id: 90,
    sellerId: 1,
    listingNumber: 'KA-MFB-004',
    title: 'Medizin Lehrbuch - Anatomie & Physiologie',
    price: '45,00 ₺',
    shipping: '+ 5,90 ₺ Kargo',
    location: 'Köln',
    postalCode: '50667',
    city: 'Köln',
    viewCount: 456,
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80',
    isTop: true,
    date: '27.11.2025',
    category: 'Müzik, Film & Kitap',
    subCategory: 'Ders Kitapları, Okul & Eğitim',
    condition: 'İkinci El',
    description: 'Anatomie & Physiologie Lehrbuch für Medizinstudium. Aktuelle Auflage, sehr guter Zustand. Mit Markierungen und Notizen. Perfekt für Studenten. Versand möglich. Spare Geld beim Studium! Unverzichtbar fürs Medizinstudium!'
  },
  {
    id: 91,
    sellerId: 2,
    listingNumber: 'KA-MFB-005',
    title: 'Lord of the Rings Trilogy - Extended Edition Blu-ray',
    price: '28,00 ₺',
    shipping: '+ 4,90 ₺ Kargo',
    location: 'Frankfurt',
    postalCode: '60311',
    city: 'Frankfurt',
    viewCount: 1123,
    image: 'https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=800&q=80',
    isTop: true,
    date: '27.11.2025',
    category: 'Müzik, Film & Kitap',
    subCategory: 'Film & DVD',
    condition: 'Yeni Gibi',
    description: 'Herr der Ringe Trilogie - Extended Edition auf Blu-ray. Alle 3 Filme in Langfassung. Wie neu, nur 1x geschaut. Inkl. Bonusmaterial. Perfekt für Mittelerde-Fans. Versand möglich. Episches Kino-Erlebnis für zu Hause!'
  },
  {
    id: 92,
    sellerId: 3,
    listingNumber: 'KA-MFB-006',
    title: 'The Beatles - Abbey Road Vinyl LP',
    price: '32,00 ₺',
    shipping: '+ 5,90 ₺ Kargo',
    location: 'Stuttgart',
    postalCode: '70173',
    city: 'Stuttgart',
    viewCount: 789,
    image: 'https://images.unsplash.com/photo-1619983081563-430f63602796?w=800&q=80',
    isTop: true,
    date: '27.11.2025',
    category: 'Müzik, Film & Kitap',
    subCategory: 'Müzik & CD\'ler',
    condition: 'İkinci El',
    description: 'The Beatles - Abbey Road Original Vinyl LP. Guter Zustand, spielt einwandfrei. Klassiker der Musikgeschichte. Perfekt für Vinyl-Sammler. Versand versichert möglich. Zeitlose Musik auf zeitlosem Medium. Ein Must-have!'
  },
  {
    id: 93,
    sellerId: 1,
    listingNumber: 'KA-MFB-007',
    title: 'Yamaha Akustik Gitarre - Anfängermodell',
    price: '120,00 ₺',
    shipping: 'Gel Al',
    location: 'Düsseldorf',
    postalCode: '40210',
    city: 'Düsseldorf',
    viewCount: 567,
    image: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=800&q=80',
    isTop: true,
    date: '27.11.2025',
    category: 'Müzik, Film & Kitap',
    subCategory: 'Müzik Enstrümanları',
    condition: 'İkinci El',
    description: 'Yamaha Akustik Gitarre, perfekt für Anfänger. Guter Zustand, spielt sich leicht. Inkl. Tasche und Stimmgerät. 2 Jahre alt, wenig benutzt. Nur Abholung. Starte deine musikalische Reise! Ideal zum Lernen!'
  },
  {
    id: 94,
    sellerId: 2,
    listingNumber: 'KA-MFB-008',
    title: 'Hörbuch-Sammlung - 15 CDs Krimi & Thriller',
    price: '25,00 ₺',
    shipping: '+ 5,90 ₺ Kargo',
    location: 'Leipzig',
    postalCode: '04109',
    city: 'Leipzig',
    viewCount: 345,
    image: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=800&q=80',
    isTop: true,
    date: '27.11.2025',
    category: 'Müzik, Film & Kitap',
    subCategory: 'Diğer Müzik, Film & Kitap',
    condition: 'İkinci El',
    description: 'Hörbuch-Sammlung mit 15 CDs. Verschiedene Krimis und Thriller. Guter Zustand, alle komplett. Perfekt für lange Autofahrten oder zum Entspannen. Versand möglich. Spannende Unterhaltung für unterwegs! Top Autoren!'
  },
  {
    id: 95,
    sellerId: 3,
    listingNumber: 'KA-ET-001',
    title: 'DB Bahn Ticket Hamburg-München - Flexpreis',
    price: '89,00 ₺',
    shipping: 'Dijital',
    location: 'Hamburg',
    postalCode: '20095',
    city: 'Hamburg',
    viewCount: 123,
    image: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=800&q=80',
    isTop: true,
    date: '27.11.2025',
    category: 'Biletler',
    subCategory: 'Tren & Toplu Taşıma',
    condition: 'Yeni',
    description: 'DB Flexpreis Ticket Hamburg-München für 1 Person. Gültig 30.11.2025. Kann nicht mehr genutzt werden, daher günstiger Verkauf. Übertragbar. Digitales Ticket per E-Mail. Schnäppchen für Kurzentschlossene!'
  },
  {
    id: 96,
    sellerId: 1,
    listingNumber: 'KA-ET-002',
    title: 'Comedy Show - Mario Barth Live in Berlin',
    price: '45,00 ₺',
    shipping: 'Gel Al/Posta',
    location: 'Berlin',
    postalCode: '10115',
    city: 'Berlin',
    viewCount: 456,
    image: 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=800&q=80',
    isTop: true,
    date: '27.11.2025',
    category: 'Biletler',
    subCategory: 'Komedi & Kabare',
    condition: 'Yeni',
    description: 'Mario Barth Live Show am 15.12.2025 in Berlin, Mercedes-Benz Arena. 2 Tickets verfügbar, Kategorie 2. Leider verhindert. VK 45₺/Stück (Original 55₺). Abholung oder Versand möglich. Lachen garantiert!'
  },
  {
    id: 97,
    sellerId: 2,
    listingNumber: 'KA-ET-003',
    title: 'Amazon Gutschein 50₺ - Unbenutzt',
    price: '45,00 ₺',
    shipping: 'Dijital',
    location: 'München',
    postalCode: '80331',
    city: 'München',
    viewCount: 789,
    image: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=800&q=80',
    isTop: true,
    date: '27.11.2025',
    category: 'Biletler',
    subCategory: 'Hediye Çekleri',
    condition: 'Yeni',
    description: 'Amazon Gutschein im Wert von 50₺, unbenutzt. Code wird digital per E-Mail versendet. Verkaufe für 45₺. Sofort einsetzbar. Perfekt als Geschenk oder für eigene Einkäufe. Sicher und schnell!'
  },
  {
    id: 98,
    sellerId: 3,
    listingNumber: 'KA-ET-004',
    title: 'Playmobil FunPark Tickets - Familie 2+2',
    price: '65,00 ₺',
    shipping: 'Posta',
    location: 'Nürnberg',
    postalCode: '90402',
    city: 'Nürnberg',
    viewCount: 234,
    image: 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=800&q=80',
    isTop: true,
    date: '27.11.2025',
    category: 'Biletler',
    subCategory: 'Çocuk',
    condition: 'Yeni',
    description: 'Playmobil FunPark Familientickets für 2 Erwachsene + 2 Kinder. Gültig bis 31.12.2025. Leider können wir nicht, daher Verkauf. VK 65₺ (Original 80₺). Versand per Post. Riesenspaß für die ganze Familie!'
  },
  {
    id: 99,
    sellerId: 1,
    listingNumber: 'KA-ET-005',
    title: 'Coldplay Konzert München - 2 Tickets Stehplatz',
    price: '180,00 ₺',
    shipping: 'Gel Al/Posta',
    location: 'München',
    postalCode: '80331',
    city: 'München',
    viewCount: 1234,
    image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80',
    isTop: true,
    date: '27.11.2025',
    category: 'Biletler',
    subCategory: 'Konserler',
    condition: 'Yeni',
    description: 'Coldplay Live Konzert am 20.01.2026 in München, Olympiastadion. 2 Stehplatz-Tickets. Leider verhindert. VK 90₺/Stück (Original 95₺). Abholung in München oder Versand. Unvergessliches Konzerterlebnis!'
  },
  {
    id: 100,
    sellerId: 2,
    listingNumber: 'KA-ET-006',
    title: 'FC Bayern vs Dortmund - 2 Tickets Südkurve',
    price: '220,00 ₺',
    shipping: 'Gel Al',
    location: 'München',
    postalCode: '80331',
    city: 'München',
    viewCount: 1567,
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80',
    isTop: true,
    date: '27.11.2025',
    category: 'Biletler',
    subCategory: 'Spor',
    condition: 'Yeni',
    description: 'FC Bayern München vs Borussia Dortmund am 10.12.2025, Allianz Arena. 2 Tickets Südkurve, Stehplätze. Der Klassiker! Leider verhindert. VK 110₺/Stück. Nur Abholung in München. Echte Stadionatmosphäre!'
  },
  {
    id: 101,
    sellerId: 3,
    listingNumber: 'KA-ET-007',
    title: 'König der Löwen Musical Hamburg - 2 Tickets',
    price: '150,00 ₺',
    shipping: 'Posta',
    location: 'Hamburg',
    postalCode: '20095',
    city: 'Hamburg',
    viewCount: 892,
    image: 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=800&q=80',
    isTop: true,
    date: '27.11.2025',
    category: 'Biletler',
    subCategory: 'Tiyatro & Müzikal',
    condition: 'Yeni',
    description: 'König der Löwen Musical in Hamburg am 05.01.2026. 2 Tickets Kategorie 2, gute Sicht. Leider verhindert. VK 75₺/Stück (Original 89₺). Versand möglich. Magisches Musical-Erlebnis für die ganze Familie!'
  },
  {
    id: 102,
    sellerId: 1,
    listingNumber: 'KA-ET-008',
    title: 'Therme Erding Tageskarte - 2 Personen',
    price: '55,00 ₺',
    shipping: 'Dijital',
    location: 'München',
    postalCode: '80331',
    city: 'München',
    viewCount: 345,
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=80',
    isTop: true,
    date: '27.11.2025',
    category: 'Biletler',
    subCategory: 'Diğer Biletler',
    condition: 'Yeni',
    description: 'Therme Erding Tageskarten für 2 Personen. Gültig bis 31.03.2026. Leider keine Zeit. VK 55₺ für beide (Original 70₺). Digitale Tickets per E-Mail. Entspannung pur in Europas größter Therme!'
  },
  {
    id: 103,
    sellerId: 2,
    listingNumber: 'KA-DL-001',
    title: 'Altenpflege & Betreuung - Erfahren & Zuverlässig',
    price: '25,00 ₺',
    shipping: 'Yerinde',
    location: 'Hamburg',
    postalCode: '20095',
    city: 'Hamburg',
    viewCount: 345,
    image: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=800&q=80',
    isTop: false,
    date: '27.11.2025',
    category: 'Hizmetler',
    subCategory: 'Yaşlı Bakımı',
    condition: 'Yeni',
    description: 'Professionelle Altenpflege und Betreuung. Erfahrene Pflegekraft mit Herz. Hauswirtschaft, Medikamentengabe, Begleitung zu Ärzten. Stundenweise oder 24h. 25₺/Stunde. Referenzen vorhanden. Ihre Liebsten sind bei mir in besten Händen!'
  },
  {
    id: 104,
    sellerId: 3,
    listingNumber: 'KA-DL-002',
    title: 'KFZ Reparatur & Wartung - Meisterbetrieb',
    price: '80,00 ₺',
    shipping: 'Yerinde',
    location: 'München',
    postalCode: '80331',
    city: 'München',
    viewCount: 678,
    image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800&q=80',
    isTop: true,
    date: '27.11.2025',
    category: 'Hizmetler',
    subCategory: 'Otomobil, Bisiklet & Tekne',
    condition: 'Yeni',
    description: 'KFZ Meisterbetrieb bietet Reparatur und Wartung aller Marken. Ölwechsel, Inspektion, TÜV-Vorbereitung, Bremsen, Reifen. Faire Preise, schnelle Termine. Stundensatz 80₺. Kostenloser Kostenvoranschlag. Ihr Auto ist bei uns in guten Händen!'
  },
  {
    id: 105,
    sellerId: 1,
    listingNumber: 'KA-DL-003',
    title: 'Kinderbetreuung Tagesmutter - Liebevoll',
    price: '6,00 ₺',
    shipping: 'Yerinde',
    location: 'Berlin',
    postalCode: '10115',
    city: 'Berlin',
    viewCount: 456,
    image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&q=80',
    isTop: false,
    date: '27.11.2025',
    category: 'Hizmetler',
    subCategory: 'Babysitter & Çocuk Bakımı',
    condition: 'Yeni',
    description: 'Erfahrene Tagesmutter bietet liebevolle Kinderbetreuung. Flexible Zeiten, großer Garten, viele Spielsachen. Gesunde Mahlzeiten inklusive. 6₺/Stunde. Noch 2 Plätze frei ab Januar. Referenzen vorhanden. Ihr Kind ist bei mir bestens aufgehoben!'
  },
  {
    id: 106,
    sellerId: 2,
    listingNumber: 'KA-DL-004',
    title: 'Handy & Laptop Reparatur - Schnell & Günstig',
    price: '49,00 ₺',
    shipping: 'Yerinde',
    location: 'Köln',
    postalCode: '50667',
    city: 'Köln',
    viewCount: 892,
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80',
    isTop: true,
    date: '27.11.2025',
    category: 'Hizmetler',
    subCategory: 'Elektronik',
    condition: 'Yeni',
    description: 'Professionelle Handy & Laptop Reparatur. Display-Tausch, Akku-Wechsel, Wasserschaden, Software-Probleme. Alle Marken. Express-Service möglich. Ab 49₺. Kostenlose Diagnose. 6 Monate Garantie. Schnell, günstig, zuverlässig!'
  },
  {
    id: 107,
    sellerId: 3,
    listingNumber: 'KA-DL-005',
    title: 'Gartenpflege & Rasenmähen - Professionell',
    price: '35,00 ₺',
    shipping: 'Yerinde',
    location: 'Frankfurt',
    postalCode: '60311',
    city: 'Frankfurt',
    viewCount: 234,
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80',
    isTop: true,
    date: '27.11.2025',
    category: 'Hizmetler',
    subCategory: 'Ev & Bahçe',
    condition: 'Yeni',
    description: 'Professionelle Gartenpflege - Rasenmähen, Heckenschneiden, Unkraut jäten, Laub entfernen. Regelmäßig oder einmalig. 35₺/Stunde. Eigene Geräte. Zuverlässig und pünktlich. Kostenlose Besichtigung. Ihr Garten in besten Händen!'
  },
  {
    id: 108,
    sellerId: 1,
    listingNumber: 'KA-DL-006',
    title: 'Live Musik Hochzeit - Gitarre & Gesang',
    price: '500,00 ₺',
    shipping: 'Yerinde',
    location: 'Stuttgart',
    postalCode: '70173',
    city: 'Stuttgart',
    viewCount: 567,
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&q=80',
    isTop: true,
    date: '27.11.2025',
    category: 'Hizmetler',
    subCategory: 'Sanatçılar & Müzisyenler',
    condition: 'Yeni',
    description: 'Professioneller Musiker für Hochzeiten & Events. Gitarre & Gesang, vielseitiges Repertoire. Pop, Rock, Jazz, Klassik. 500₺ für 4 Stunden. Über 10 Jahre Erfahrung. Referenzen vorhanden. Unvergessliche musikalische Untermalung!'
  },
  {
    id: 109,
    sellerId: 2,
    listingNumber: 'KA-DL-007',
    title: 'Hochzeitsplanung Komplett - Traumhochzeit',
    price: '2.500,00 ₺',
    shipping: 'Service',
    location: 'Düsseldorf',
    postalCode: '40210',
    city: 'Düsseldorf',
    viewCount: 1123,
    image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80',
    isTop: true,
    date: '27.11.2025',
    category: 'Hizmetler',
    subCategory: 'Seyahat & Etkinlik',
    condition: 'Yeni',
    description: 'Professionelle Hochzeitsplanung von A-Z. Location, Catering, Dekoration, Fotograf, Musik. Über 100 erfolgreiche Hochzeiten. Individuelle Beratung, stressfreie Planung. Paket ab 2.500₺. Kostenlose Erstberatung. Euer Traumtag wird wahr!'
  },
  {
    id: 110,
    sellerId: 3,
    listingNumber: 'KA-DL-008',
    title: 'Hundesitting & Gassi-Service - Täglich',
    price: '20,00 ₺',
    shipping: 'Yerinde',
    location: 'Leipzig',
    postalCode: '04109',
    city: 'Leipzig',
    viewCount: 345,
    image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&q=80',
    isTop: false,
    date: '27.11.2025',
    category: 'Hizmetler',
    subCategory: 'Hayvan Bakımı & Eğitimi',
    condition: 'Yeni',
    description: 'Hundesitting & Gassi-Service. Täglich verfügbar, auch spontan. Große Erfahrung mit allen Rassen. 20₺/Stunde. Auch Urlaubsbetreuung möglich. Referenzen vorhanden. Ihr Hund ist bei mir in liebevollen Händen. Jetzt anfragen!'
  },
  {
    id: 111,
    sellerId: 1,
    listingNumber: 'KA-DL-009',
    title: 'Umzugsservice mit LKW - Komplett-Service',
    price: '450,00 ₺',
    shipping: 'Yerinde',
    location: 'Dortmund',
    postalCode: '44135',
    city: 'Dortmund',
    viewCount: 789,
    image: 'https://images.unsplash.com/photo-1600518464441-9154a4dea21b?w=800&q=80',
    isTop: true,
    date: '27.11.2025',
    category: 'Hizmetler',
    subCategory: 'Taşımacılık & Nakliye',
    condition: 'Yeni',
    description: 'Professioneller Umzugsservice mit 7,5t LKW. Komplettservice: Packen, Transport, Aufbau. Erfahrenes Team, faire Preise. Ab 450₺ (lokaler Umzug). Auch Möbeltransport einzeln. Kostenloser Kostenvoranschlag. Stressfrei umziehen!'
  },
  {
    id: 112,
    sellerId: 2,
    listingNumber: 'KA-DL-010',
    title: 'Fensterreinigung & Gebäudereinigung',
    price: '3,50 ₺',
    shipping: 'Yerinde',
    location: 'Bremen',
    postalCode: '28195',
    city: 'Bremen',
    viewCount: 234,
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80',
    isTop: true,
    date: '27.11.2025',
    category: 'Hizmetler',
    subCategory: 'Diğer Hizmetler',
    condition: 'Yeni',
    description: 'Professionelle Fensterreinigung für Privat & Gewerbe. Auch Rahmen & Fensterbänke. 3,50₺/m². Regelmäßig oder einmalig. Streifenfreies Ergebnis garantiert. Eigene Ausrüstung. Kostenlose Besichtigung. Saubere Fenster, klare Sicht!'
  },
  {
    id: 113,
    sellerId: 3,
    listingNumber: 'KA-VT-001',
    title: 'Tausche Nintendo Switch gegen PS5 Spiele',
    price: 'Tausch',
    shipping: 'Gel Al',
    location: 'Hamburg',
    postalCode: '20095',
    city: 'Hamburg',
    viewCount: 234,
    image: 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=800&q=80',
    isTop: true,
    date: '27.11.2025',
    category: 'Ücretsiz & Takas',
    subCategory: 'Takas',
    condition: 'İkinci El',
    description: 'Tausche meine Nintendo Switch (V2) gegen PS5 Spiele. Konsole in sehr gutem Zustand, mit 2 Controllern und Tasche. Suche aktuelle PS5 Spiele (FIFA, Call of Duty, etc.). Nur Tausch, kein Verkauf. Abholung in Hamburg.'
  },
  {
    id: 114,
    sellerId: 1,
    listingNumber: 'KA-VT-002',
    title: 'Verleihe Hochdruckreiniger Kärcher K5',
    price: '15,00 ₺',
    shipping: 'Gel Al',
    location: 'München',
    postalCode: '80331',
    city: 'München',
    viewCount: 456,
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80',
    isTop: true,
    date: '27.11.2025',
    category: 'Ücretsiz & Takas',
    subCategory: 'Kiralama',
    condition: 'İkinci El',
    description: 'Verleihe Kärcher K5 Hochdruckreiniger für 15₺/Tag. Perfekt für Terrasse, Auto, Fassade. Inkl. Zubehör. Kaution 50₺. Nur Abholung in München. Gerät ist top gepflegt und voll funktionsfähig. Ideal für gelegentliche Nutzung!'
  },
  {
    id: 115,
    sellerId: 2,
    listingNumber: 'KA-VT-003',
    title: 'Verschenke Ikea Regal Billy - Weiß',
    price: 'Zu verschenken',
    shipping: 'Gel Al',
    location: 'Berlin',
    postalCode: '10115',
    city: 'Berlin',
    viewCount: 789,
    image: 'https://images.unsplash.com/photo-1594620302200-9a762244a156?w=800&q=80',
    isTop: true,
    date: '27.11.2025',
    category: 'Ücretsiz & Takas',
    subCategory: 'Ücretsiz',
    condition: 'İkinci El',
    description: 'Verschenke Ikea Billy Regal in Weiß, 80x202cm. Guter Zustand, nur leichte Gebrauchsspuren. Muss bis Ende der Woche weg wegen Umzug. Nur Abholung, selbst abbauen. Wer zuerst kommt, mahlt zuerst. Kostenlos!'
  },
  {
    id: 116,
    sellerId: 3,
    listingNumber: 'KA-UK-001',
    title: 'Yoga & Meditation Kurs - Anfänger',
    price: '80,00 ₺',
    shipping: 'Yerinde',
    location: 'Hamburg',
    postalCode: '20095',
    city: 'Hamburg',
    viewCount: 456,
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80',
    isTop: true,
    date: '27.11.2025',
    category: 'Eğitim & Kurslar',
    subCategory: 'Güzellik & Sağlık',
    condition: 'Yeni',
    description: 'Yoga & Meditation für Anfänger. 8 Wochen Kurs, 1x wöchentlich 90 Min. Entspannung, Flexibilität, innere Ruhe. Kleine Gruppen max. 10 Personen. 80₺ Gesamtpreis. Matten vorhanden. Start: 05.01.2026. Jetzt anmelden!'
  },
  {
    id: 117,
    sellerId: 1,
    listingNumber: 'KA-UK-002',
    title: 'Excel & Word Kurs für Senioren',
    price: '120,00 ₺',
    shipping: 'Yerinde',
    location: 'München',
    postalCode: '80331',
    city: 'München',
    viewCount: 234,
    image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&q=80',
    isTop: true,
    date: '27.11.2025',
    category: 'Eğitim & Kurslar',
    subCategory: 'Bilgisayar Kursları',
    condition: 'Yeni',
    description: 'Computerkurs speziell für Senioren. Excel & Word Grundlagen. 6 Termine à 2 Stunden. Geduldig erklärt, viele Übungen. 120₺ inkl. Unterlagen. Kleine Gruppen. Eigener Laptop mitbringen. Start: 08.01.2026. Anmeldung jetzt!'
  },
  {
    id: 118,
    sellerId: 2,
    listingNumber: 'KA-UK-003',
    title: 'Tarot Karten Legen lernen - Workshop',
    price: '65,00 ₺',
    shipping: 'Yerinde',
    location: 'Berlin',
    postalCode: '10115',
    city: 'Berlin',
    viewCount: 345,
    image: 'https://images.unsplash.com/photo-1551269901-5c5e14c25df7?w=800&q=80',
    isTop: false,
    date: '27.11.2025',
    category: 'Eğitim & Kurslar',
    subCategory: 'Ezoterizm & Spiritüalizm',
    condition: 'Yeni',
    description: 'Tarot Karten legen lernen - Tages-Workshop. Bedeutung der Karten, Legesysteme, Intuition entwickeln. Für Anfänger geeignet. 65₺ inkl. Tarot-Deck. Samstag 10-17 Uhr. Max. 8 Teilnehmer. Vorkenntnisse nicht nötig. Jetzt buchen!'
  },
  {
    id: 119,
    sellerId: 3,
    listingNumber: 'KA-UK-004',
    title: 'Italienische Küche - Kochkurs',
    price: '89,00 ₺',
    shipping: 'Yerinde',
    location: 'Köln',
    postalCode: '50667',
    city: 'Köln',
    viewCount: 678,
    image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&q=80',
    isTop: true,
    date: '27.11.2025',
    category: 'Eğitim & Kurslar',
    subCategory: 'Yemek & Pastacılık',
    condition: 'Yeni',
    description: 'Italienischer Kochkurs - Pasta selbst machen! 4-Gänge Menü kochen & genießen. Alle Zutaten inklusive. 89₺ pro Person. Freitag 18-22 Uhr. Max. 12 Teilnehmer. Getränke inklusive. Rezepte zum Mitnehmen. Buon appetito!'
  },
  {
    id: 120,
    sellerId: 1,
    listingNumber: 'KA-UK-005',
    title: 'Aquarell Malen für Anfänger',
    price: '95,00 ₺',
    shipping: 'Yerinde',
    location: 'Frankfurt',
    postalCode: '60311',
    city: 'Frankfurt',
    viewCount: 456,
    image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&q=80',
    isTop: true,
    date: '27.11.2025',
    category: 'Eğitim & Kurslar',
    subCategory: 'Sanat & Tasarım',
    condition: 'Yeni',
    description: 'Aquarell Malkurs für Anfänger. 5 Termine à 3 Stunden. Grundtechniken, Farbenlehre, eigene Bilder malen. 95₺ inkl. Material. Kleine Gruppen max. 8 Personen. Sonntags 14-17 Uhr. Start: 12.01.2026. Kreativität entdecken!'
  },
  {
    id: 121,
    sellerId: 2,
    listingNumber: 'KA-UK-006',
    title: 'Gitarrenunterricht - Einzelstunden',
    price: '35,00 ₺',
    shipping: 'Yerinde',
    location: 'Stuttgart',
    postalCode: '70173',
    city: 'Stuttgart',
    viewCount: 567,
    image: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=800&q=80',
    isTop: true,
    date: '27.11.2025',
    category: 'Eğitim & Kurslar',
    subCategory: 'Müzik & Şan',
    condition: 'Yeni',
    description: 'Professioneller Gitarrenunterricht - Einzelstunden 45 Min. Für Anfänger & Fortgeschrittene. Alle Stilrichtungen. 35₺/Stunde. Flexible Terminvereinbarung. Über 10 Jahre Erfahrung. Eigene Gitarre mitbringen. Probestunde möglich!'
  },
  {
    id: 122,
    sellerId: 3,
    listingNumber: 'KA-UK-007',
    title: 'Mathe Nachhilfe Klasse 5-10',
    price: '25,00 ₺',
    shipping: 'Vor Ort/Online',
    location: 'Düsseldorf',
    postalCode: '40210',
    city: 'Düsseldorf',
    viewCount: 789,
    image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&q=80',
    isTop: true,
    date: '27.11.2025',
    category: 'Eğitim & Kurslar',
    subCategory: 'Özel Ders',
    condition: 'Yeni',
    description: 'Mathe Nachhilfe für Klasse 5-10. Einzelunterricht 60 Min. Erfahrener Lehrer, verständlich erklärt. 25₺/Stunde. Vor Ort oder Online. Flexible Zeiten auch abends. Notenverbesserung garantiert! Probestunde kostenlos!'
  },
  {
    id: 123,
    sellerId: 1,
    listingNumber: 'KA-UK-008',
    title: 'Pilates Kurs - 10er Karte',
    price: '110,00 ₺',
    shipping: 'Yerinde',
    location: 'Leipzig',
    postalCode: '04109',
    city: 'Leipzig',
    viewCount: 345,
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80',
    isTop: true,
    date: '27.11.2025',
    category: 'Eğitim & Kurslar',
    subCategory: 'Spor Kursları',
    condition: 'Yeni',
    description: 'Pilates Kurs - 10er Karte für 110₺. Kräftigung, Beweglichkeit, Körperhaltung verbessern. Dienstags & Donnerstags 19:00 Uhr. Kleine Gruppen. Matten vorhanden. Für alle Level geeignet. Schnupperstunde 10₺. Jetzt starten!'
  },
  {
    id: 124,
    sellerId: 2,
    listingNumber: 'KA-UK-009',
    title: 'Englisch Konversationskurs B1/B2',
    price: '140,00 ₺',
    shipping: 'Yerinde',
    location: 'Dortmund',
    postalCode: '44135',
    city: 'Dortmund',
    viewCount: 456,
    image: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800&q=80',
    isTop: true,
    date: '27.11.2025',
    category: 'Eğitim & Kurslar',
    subCategory: 'Dil Kursları',
    condition: 'Yeni',
    description: 'Englisch Konversationskurs Level B1/B2. 8 Wochen, 1x wöchentlich 90 Min. Sprechen üben, Vokabular erweitern. Native Speaker. 140₺. Kleine Gruppen max. 8 Personen. Mittwochs 18:30 Uhr. Start: 15.01.2026. Improve your English!'
  },
  {
    id: 125,
    sellerId: 3,
    listingNumber: 'KA-UK-010',
    title: 'Salsa Tanzkurs für Paare - Anfänger',
    price: '120,00 ₺',
    shipping: 'Yerinde',
    location: 'Bremen',
    postalCode: '28195',
    city: 'Bremen',
    viewCount: 567,
    image: 'https://images.unsplash.com/photo-1504609813442-a8924e83f76e?w=800&q=80',
    isTop: true,
    date: '27.11.2025',
    category: 'Eğitim & Kurslar',
    subCategory: 'Dans Kursları',
    condition: 'Yeni',
    description: 'Salsa Tanzkurs für Paare - Anfänger. 6 Termine à 90 Min. Grundschritte, Drehungen, Rhythmusgefühl. 120₺ pro Paar. Freitags 20:00 Uhr. Lockere Atmosphäre. Keine Vorkenntnisse nötig. Start: 10.01.2026. ¡Vamos a bailar!'
  },
  {
    id: 126,
    sellerId: 1,
    listingNumber: 'KA-UK-011',
    title: 'Excel Fortgeschrittene - Online Kurs',
    price: '199,00 ₺',
    shipping: 'Online',
    location: 'Dresden',
    postalCode: '01067',
    city: 'Dresden',
    viewCount: 678,
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
    isTop: true,
    date: '27.11.2025',
    category: 'Eğitim & Kurslar',
    subCategory: 'Sürekli Eğitim',
    condition: 'Yeni',
    description: 'Excel Fortgeschrittene - Online Live-Kurs. Pivot-Tabellen, Makros, Formeln. 4 Wochen, 2x wöchentlich 2 Std. 199₺ inkl. Zertifikat. Aufzeichnungen verfügbar. Interaktiv mit Übungen. Abends 18-20 Uhr. Karriere-Boost garantiert!'
  },
  {
    id: 127,
    sellerId: 2,
    listingNumber: 'KA-UK-012',
    title: 'Fotografie Grundkurs - Spiegelreflex',
    price: '149,00 ₺',
    shipping: 'Yerinde',
    location: 'Hannover',
    postalCode: '30159',
    city: 'Hannover',
    viewCount: 345,
    image: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800&q=80',
    isTop: true,
    date: '27.11.2025',
    category: 'Eğitim & Kurslar',
    subCategory: 'Diğer Eğitim & Kurslar',
    condition: 'Yeni',
    description: 'Fotografie Grundkurs für Spiegelreflex-Kameras. 3 Termine: Theorie + 2 Praxis-Shootings. Blende, ISO, Belichtung verstehen. 149₺. Eigene Kamera mitbringen. Samstags 10-16 Uhr. Max. 10 Teilnehmer. Bessere Fotos garantiert!'
  },
  {
    id: 128,
    sellerId: 3,
    listingNumber: 'KA-NH-001',
    title: 'Nachbarschaftshilfe - Einkauf, Garten, Haushalt',
    price: '18,00 ₺',
    shipping: 'Yerinde',
    location: 'Hamburg',
    postalCode: '20095',
    city: 'Hamburg',
    viewCount: 234,
    image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&q=80',
    isTop: true,
    date: '27.11.2025',
    category: 'Komşu Yardımı',
    subCategory: 'Komşu Yardımı',
    condition: 'Yeni',
    description: 'Biete zuverlässige Nachbarschaftshilfe in Hamburg. Einkäufe erledigen, Gartenarbeit, Haushaltshilfe, Botengänge, Begleitung zu Ärzten. 18₺/Stunde. Flexibel, freundlich, vertrauenswürdig. Ideal für Senioren oder Berufstätige. Auch kurzfristig verfügbar. Referenzen vorhanden!'
  }
];

// Mock data for gallery items
const galleryItems = [
  {
    id: 1,
    title: 'ÖLSBERG Kaminöfen für Wohnzimmer',
    price: '2.999 ₺',
    location: 'Delmenhorst',
    image: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzV8MHwxfHNlYXJjaHwxfHxsZWdvfGVufDB8fHx8MTc1MzM3NzUzNHww&ixlib=rb-4.1.0&q=85',
    isTop: true
  },
  {
    id: 2,
    title: 'Hya ES1 Wasseraufbereitung',
    price: '800 ₺',
    location: 'Besigheim',
    image: 'https://images.unsplash.com/photo-1633469924738-52101af51d87?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzV8MHwxfHNlYXJjaHwzfHxsZWdvfGVufDB8fHx8MTc1MzM3NzUzNHww&ixlib=rb-4.1.0&q=85',
    isTop: true
  },
  {
    id: 3,
    title: 'XXL Lego Star Wars Set',
    price: '2.400 ₺',
    location: 'Augsburg',
    image: 'https://images.unsplash.com/photo-1626806819282-2c1dc01a5e0c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzZ8MHwxfHxob3VzZWhvbGR8ZW58MHx8fHwxNzUzMzc3NTQxfDA&ixlib=rb-4.1.0&q=85',
    isTop: true
  },
  {
    id: 4,
    title: 'Boxen frei, Pferde, Pony...',
    price: '610 ₺',
    location: 'Schwaan',
    image: 'https://images.unsplash.com/photo-1654064756668-16a32248d391?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzZ8MHwxfHxob3VzZWhvbGR8ZW58MHx8fHwxNzUzMzc3NTQxfDA&ixlib=rb-4.1.0&q=85',
    isTop: true
  }
];

// Mock data for sellers
const mockSellers = {
  1: {
    name: 'Ali Yılmaz',
    phone: '+49 176 12345678',
    email: 'ali@gmail.com',
    address: 'Musterstraße 12, 10115 Berlin',
    website: 'www.ali-handel.de',
    memberSince: '2020-03-15',
    rating: 4.8,
    totalRatings: 127,
    responseRate: '98%',
    responseTime: '1 Std.',
    profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    sellerType: 'Ticari Kullanıcı',
    businessType: 'Bisiklet Ticareti',
    totalListings: 45,
    followers: 156,
    following: 12
  },
  2: {
    name: 'Ayşe Demir',
    phone: '+49 152 98765432',
    email: 'ayse@hotmail.com',
    address: 'Hauptstraße 45, 80331 München',
    website: 'www.ayse-design.com',
    memberSince: '2021-06-22',
    rating: 4.9,
    totalRatings: 84,
    responseRate: '100%',
    responseTime: '30 Min.',
    profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    sellerType: 'Bireysel Kullanıcı',
    totalListings: 12,
    followers: 42,
    following: 8
  },
  3: {
    name: 'Fatma Kaya',
    phone: '+49 160 55555555',
    email: 'fatma@web.de',
    address: 'Hafenstraße 8, 20095 Hamburg',
    website: null,
    memberSince: '2019-11-05',
    rating: 4.5,
    totalRatings: 215,
    responseRate: '92%',
    responseTime: '2 Std.',
    profileImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    sellerType: 'Ticari Kullanıcı',
    businessType: 'Mobilya & Dekorasyon',
    totalListings: 89,
    followers: 312,
    following: 45
  },
  4: {
    name: 'Mehmet Öz',
    phone: '555-444-5555',
    email: 'mehmet@gmail.com',
    memberSince: '2018-11-05',
    rating: 4.6,
    totalRatings: 203,
    totalListings: 42,
    sellerType: 'Ticari Kullanıcı',
    businessType: 'Elektronik & Teknoloji',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  5: {
    name: 'Can Erdem',
    phone: '555-555-6666',
    email: 'can@gmail.com',
    memberSince: '2022-05-18',
    rating: 4.9,
    totalRatings: 34,
    totalListings: 5,
    sellerType: 'Bireysel Kullanıcı',
    profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  6: {
    name: 'Zeynep Tunç',
    phone: '555-666-7788',
    email: 'zeynep@gmail.com',
    memberSince: '2020-09-12',
    rating: 4.8,
    totalRatings: 156,
    totalListings: 31,
    sellerType: 'Ticari Kullanıcı',
    businessType: 'Moda & Aksesuar',
    profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  7: {
    name: 'Burak Gün',
    phone: '555-777-8899',
    email: 'burak@gmail.com',
    memberSince: '2019-12-20',
    rating: 4.5,
    totalRatings: 78,
    totalListings: 19,
    sellerType: 'Bireysel Kullanıcı',
    profileImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  8: {
    name: 'Merve Sol',
    phone: '555-888-9900',
    email: 'merve@gmail.com',
    memberSince: '2021-08-30',
    rating: 4.7,
    totalRatings: 92,
    totalListings: 12,
    sellerType: 'Privatnutzer',
    profileImage: 'https://i.pravatar.cc/150?img=30'
  },
  9: {
    name: 'Elif Rad',
    businessType: 'Fahrrad Handel',
    phone: '+49 2541 123456',
    email: 'info@elifrad.de',
    address: 'Alter Kirchplatz 5, 48653 Coesfeld',
    website: 'www.elifrad.de',
    memberSince: '2018-03-15',
    rating: 4.9,
    totalRatings: 245,
    responseRate: '99%',
    responseTime: '30 Min.',
    profileImage: 'https://www.elifrad.de/images/IMG_2158.JPG',
    sellerType: 'Ticari Kullanıcı',
    totalListings: 87,
    followers: 423,
    following: 15
  },
};

// Header Component
export const Header = ({ followedSellers = [], setSelectedCategory }) => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = React.useState(false);
  const [unreadCount, setUnreadCount] = React.useState(0);
  const [userProfile, setUserProfile] = React.useState(null);

  // Fetch user profile for display name
  React.useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        try {
          const { fetchUserProfile } = await import('./api/profile');
          const profile = await fetchUserProfile(user.id);
          setUserProfile(profile);
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      }
    };

    fetchProfile();
  }, [user]);

  // Fetch unread message count
  React.useEffect(() => {
    const fetchUnreadCount = async () => {
      if (user) {
        try {
          const { getUnreadCount } = await import('./api/messages');
          const count = await getUnreadCount();
          setUnreadCount(count);
        } catch (error) {
          console.error('Error fetching unread count:', error);
        }
      }
    };

    if (user) {
      fetchUnreadCount();
      // Refresh every 30 seconds
      const interval = setInterval(fetchUnreadCount, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className="glass sticky top-0 z-50 border-b border-neutral-200/50 shadow-lg overflow-visible">
      <div className="max-w-[1400px] mx-auto px-4 h-16 sm:h-20 flex items-center justify-between gap-2 sm:gap-4 overflow-visible">
        {/* Mobile Menu Button - Hidden on mobile if bottom nav is present */}
        {!isMobile && (
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"
            aria-label="Menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        )}

        {/* Logo */}
        <div
          onClick={() => {
            if (setSelectedCategory) setSelectedCategory(t.categories.all);
            navigate('/');
            setMobileMenuOpen(false);
          }}
          className="cursor-pointer flex-shrink-0 px-2 sm:px-4 py-2 rounded-xl"
        >
          <img
            src="/logo_v5.jpg"
            alt="Kleinbazaar Logo"
            className="h-8 sm:h-12 w-auto object-contain"
          />
        </div>

        {/* Desktop Auth Buttons */}
        <div className="hidden lg:flex items-center gap-3">
          {user ? (
            <>
              {/* Subscription Packages Button */}
              <button
                onClick={() => navigate('/packages')}
                className="p-3 text-neutral-600 hover:text-yellow-600 hover:bg-yellow-50 rounded-xl transition-all duration-300 relative focus:outline-none group"
                title="Abonelik Paketleri"
              >
                <svg className="w-6 h-6 transform group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </button>

              {/* Admin Panel Button - Only for User 1001 */}
              {userProfile?.user_number === 1001 && (
                <button
                  onClick={() => navigate('/admin')}
                  className="p-3 text-neutral-600 hover:text-pink-600 hover:bg-gradient-to-r hover:from-pink-50 hover:to-red-50 rounded-xl transition-all duration-300 relative focus:outline-none group"
                  title="Admin Panel"
                >
                  <svg className="w-6 h-6 transform group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </button>
              )}
              <span className="text-neutral-700 font-semibold hidden sm:inline-block">
                <span className="text-neutral-500">{t.common.hello},</span>{' '}
                <span className="gradient-text">{userProfile?.full_name || user.email?.split('@')[0]}</span>
              </span>

              <button
                onClick={handleLogout}
                className="px-5 py-2.5 bg-white border-2 border-neutral-300 rounded-full text-neutral-700 hover:border-primary-500 hover:text-primary-600 transition-all duration-300 font-semibold shadow-sm hover:shadow-premium transform hover:-translate-y-0.5 focus:outline-none"
              >
                {t.nav.logout}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate('/register')}
                className="px-5 py-2.5 bg-white border-2 border-neutral-300 rounded-full text-neutral-700 hover:border-primary-500 hover:text-primary-600 transition-all duration-300 font-semibold shadow-sm hover:shadow-premium transform hover:-translate-y-0.5 focus:outline-none hidden sm:inline-block"
              >
                {t.nav.register}
              </button>
              <span className="text-neutral-400 hidden sm:inline-block">{t.common.or}</span>
              <button
                onClick={() => navigate('/login')}
                className="px-6 py-2.5 bg-gradient-premium text-white rounded-full shadow-premium hover:shadow-premium-lg transform hover:-translate-y-0.5 transition-all duration-300 font-bold focus:outline-none relative overflow-hidden group"
              >
                <span className="relative z-10">{t.nav.login}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary-700 to-primary-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </>
          )}

          {/* Notifications Icon - Visible only on Desktop to keep mobile header clean */}
          {!isMobile && (
            <button className="p-3 text-neutral-600 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all duration-300 relative focus:outline-none group">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-gradient-accent rounded-full animate-pulse shadow-glow"></span>
            </button>
          )}
        </div>

        {/* Mobile Icons */}
        <div className="flex lg:hidden items-center gap-2">
          <button
            onClick={() => window.location.href = '/messages'}
            className="p-2 text-neutral-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all relative"
            title={t.nav.messages}
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          ></div>

          {/* Drawer */}
          <div className="fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl z-50 lg:hidden overflow-y-auto">
            <div className="p-6">
              {/* Close Button */}
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="absolute top-4 right-4 p-2 text-neutral-600 hover:bg-neutral-100 rounded-lg"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* User Info */}
              {currentUser ? (
                <div className="mb-6 pb-6 border-b border-neutral-200">
                  <p className="text-sm text-neutral-500 mb-1">{t.common.hello},</p>
                  <p className="text-lg font-bold gradient-text">{currentUser.name}</p>
                </div>
              ) : (
                <div className="mb-6 pb-6 border-b border-neutral-200 space-y-3">
                  <button
                    onClick={() => {
                      navigate('/login');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full px-6 py-3 bg-gradient-premium text-white rounded-full shadow-premium font-bold"
                  >
                    {t.nav.login}
                  </button>
                  <button
                    onClick={() => {
                      navigate('/register');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full px-6 py-3 bg-white border-2 border-neutral-300 rounded-full text-neutral-700 font-semibold"
                  >
                    {t.nav.register}
                  </button>
                </div>
              )}

              {/* Menu Items */}
              <nav className="space-y-2">
                <button
                  onClick={() => {
                    navigate('/');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 text-neutral-700 hover:bg-neutral-100 rounded-lg font-medium flex items-center gap-3"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  {t.nav.home}
                </button>

                <button
                  onClick={() => {
                    navigate('/Alle-Kategorien');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 text-neutral-700 hover:bg-neutral-100 rounded-lg font-medium flex items-center gap-3"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                  {t.categories.all}
                </button>

                <button
                  onClick={() => {
                    navigate('/packages');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 text-neutral-700 hover:bg-neutral-100 rounded-lg font-medium flex items-center gap-3"
                >
                  <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                  Abonelik Paketleri
                </button>

                <button
                  onClick={() => {
                    navigate('/messages');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 text-neutral-700 hover:bg-neutral-100 rounded-lg font-medium flex items-center gap-3"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  {t.nav.messages}
                </button>

                <button
                  onClick={() => {
                    navigate('/favorites');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 text-neutral-700 hover:bg-neutral-100 rounded-lg font-medium flex items-center gap-3"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  {t.nav.favorites}
                </button>

                {currentUser && (
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg font-medium flex items-center gap-3 mt-4"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    {t.nav.logout}
                  </button>
                )}
              </nav>
            </div>
          </div>
        </>
      )}
    </header>
  );
};

// Checkout Component
export const Checkout = ({ cartItems, setCartItems }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    zip: '',
    email: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('paypal');

  const total = cartItems.reduce((sum, item) => {
    if (!item.price) return sum;
    const priceStr = String(item.price);
    // Almanca format: 1.800,50 ₺ → 1800.50
    // Önce ₺ ve boşlukları temizle, sonra binlik ayırıcı noktaları kaldır, virgülü noktaya çevir
    const cleanPrice = priceStr.replace('₺', '').replace(/\s/g, '').trim();
    const price = parseFloat(cleanPrice.replace(/\./g, '').replace(',', '.')) || 0;
    return sum + (price * (item.quantity || 1));
  }, 0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Miktar güncelleme fonksiyonu
  const updateQuantity = (index, newQuantity) => {
    if (newQuantity < 1) return;
    const updatedCart = [...cartItems];
    updatedCart[index] = { ...updatedCart[index], quantity: newQuantity };
    setCartItems(updatedCart);
  };

  // Ürün silme fonksiyonu
  const removeItem = (index) => {
    const updatedCart = cartItems.filter((_, i) => i !== index);
    setCartItems(updatedCart);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Email bildirimi gönder
    const orderData = {
      orderId: `ORD-${Date.now()}`,
      email: formData.email,
      items: cartItems,
      total: `${total.toFixed(2).replace('.', ',')} ₺`,
      customerName: `${formData.firstName} ${formData.lastName}`,
      address: `${formData.address}, ${formData.zip} ${formData.city}`
    };

    // Email bildirimini simüle et
    console.log('📧 Sending order confirmation email...');
    console.log('Order Data:', orderData);

    // LocalStorage'dan email ayarlarını kontrol et
    const emailSettings = JSON.parse(localStorage.getItem('emailSettings') || '{"orderConfirmation":true}');
    if (emailSettings.orderConfirmation) {
      console.log('✅ Order confirmation email sent to:', orderData.email);
      console.log('📦 Order ID:', orderData.orderId);
      console.log('💰 Total:', orderData.total);
    }

    alert(`Vielen Dank für Ihre Bestellung!\n\nBestellnummer: ${orderData.orderId}\n\nEine Bestätigungs-E-Mail wurde an ${formData.email} gesendet.`);
    setCartItems([]);
    navigate('/');
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Ihr Warenkorb ist leer</h2>
        <p className="text-gray-600 mb-8">Fügen Sie Artikel hinzu, um zur Kasse zu gehen.</p>
        <button
          onClick={() => navigate('/')}
          className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-3 px-8 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
        >
          Weiter einkaufen
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">{t.checkout.title}</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column - Forms */}
        <div className="lg:col-span-2 space-y-8">
          {/* Shipping Address */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">{t.checkout.deliveryAddress}</h2>
            <form id="checkout-form" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t.addListing.firstName}</label>
                <input
                  type="text"
                  name="firstName"
                  required
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-400 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t.addListing.lastName}</label>
                <input
                  type="text"
                  name="lastName"
                  required
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-400 focus:border-transparent"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">{t.addListing.streetHouse}</label>
                <input
                  type="text"
                  name="address"
                  required
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-400 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t.checkout.postalCode}</label>
                <input
                  type="text"
                  name="zip"
                  required
                  value={formData.zip}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-400 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t.addListing.city}</label>
                <input
                  type="text"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-400 focus:border-transparent"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">{t.addListing.emailAddress}</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-400 focus:border-transparent"
                />
              </div>
            </form>
          </div>

          {/* Payment Method */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">{t.checkout.paymentMethod}</h2>
            <div className="space-y-3">
              <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="payment"
                  value="paypal"
                  checked={paymentMethod === 'paypal'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-4 h-4 text-red-500 focus:ring-red-400"
                />
                <span className="ml-3 font-medium">PayPal</span>
              </label>
              <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="payment"
                  value="credit_card"
                  checked={paymentMethod === 'credit_card'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-4 h-4 text-red-500 focus:ring-red-400"
                />
                <span className="ml-3 font-medium">Kreditkarte</span>
              </label>
              <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="payment"
                  value="invoice"
                  checked={paymentMethod === 'invoice'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-4 h-4 text-red-500 focus:ring-red-400"
                />
                <span className="ml-3 font-medium">Rechnung</span>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column - Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 sticky top-4">
            <h2 className="text-xl font-semibold mb-4">Bestellübersicht</h2>
            <div className="space-y-6 mb-6">
              {(() => {
                // Ürünleri satıcıya göre grupla
                const groupedBySeller = cartItems.reduce((acc, item) => {
                  const sellerId = item.sellerId || 'unknown';
                  if (!acc[sellerId]) {
                    acc[sellerId] = [];
                  }
                  acc[sellerId].push(item);
                  return acc;
                }, {});

                return Object.entries(groupedBySeller).map(([sellerId, items]) => {
                  const seller = mockSellers[sellerId] || {
                    name: 'Unbekannter Verkäufer',
                    initials: '?',
                    level: 'Privat',
                    rating: 'Neu',
                    profileImage: 'https://i.pravatar.cc/150'
                  };

                  return (
                    <div key={sellerId} className="border border-gray-200 rounded-lg p-4 hover:border-red-300 transition-colors">
                      {/* Satıcı Profili - Üstte ve Tıklanabilir */}
                      <div
                        onClick={() => navigate(`/seller/${seller?.user_number || sellerId}`)}
                        className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-3 mb-3 cursor-pointer hover:from-red-50 hover:to-orange-50 transition-all duration-200 group"
                      >
                        <div className="flex items-center gap-3">
                          {/* Satıcı Profil Resmi */}
                          <div className="relative flex-shrink-0">
                            {seller.profileImage ? (
                              <img
                                src={seller.profileImage}
                                alt={seller.name}
                                className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md group-hover:border-red-300 transition-colors"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white font-bold border-2 border-white shadow-md">
                                {seller.initials}
                              </div>
                            )}
                            {/* Online Status Badge */}
                            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
                          </div>

                          {/* Satıcı Detayları */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-bold text-gray-900 truncate group-hover:text-red-600 transition-colors">{seller.name}</p>
                              {seller.level === 'Gewerblich' && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                  <svg className="w-3 h-3 mr-0.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                  </svg>
                                  Pro
                                </span>
                              )}
                            </div>

                            {/* Bewertung */}
                            <div className="flex items-center gap-2 mb-1">
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <svg
                                    key={i}
                                    className={`w-3.5 h-3.5 ${i < (seller.rating === 'Sehr gut' ? 5 : seller.rating === 'Gut' ? 4 : 3) ? 'text-yellow-400' : 'text-gray-300'}`}
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                ))}
                              </div>
                              <span className="text-xs text-gray-600">({seller.totalRatings || 0})</span>
                            </div>

                            {/* Antwortzeit */}
                            <div className="flex items-center gap-1">
                              <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span className="text-xs text-gray-600">Antwortet in {seller.responseTime || 'wenigen Stunden'}</span>
                            </div>
                          </div>

                          {/* Profil anzeigen Icon */}
                          <div className="flex-shrink-0">
                            <svg className="w-5 h-5 text-gray-400 group-hover:text-red-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                      </div>

                      {/* Satıcının Ürünleri */}
                      <div className="space-y-3">
                        {items.map((item, itemIndex) => {
                          // Orijinal cart index'ini bul
                          const cartIndex = cartItems.findIndex(cartItem =>
                            cartItem.id === item.id && cartItem.sellerId === item.sellerId
                          );

                          return (
                            <div key={itemIndex} className="flex gap-3 text-sm bg-white rounded-lg p-3 border border-gray-100 hover:border-gray-200 transition-colors">
                              <img src={item.image} alt={item.title} className="w-16 h-16 object-cover rounded-lg flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="font-medium line-clamp-2 text-sm mb-2">{item.title}</p>

                                {/* Miktar Kontrolü */}
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-gray-500">Menge:</span>
                                  <div className="flex items-center border border-gray-300 rounded-full bg-white overflow-hidden">
                                    <button
                                      onClick={() => updateQuantity(cartIndex, (item.quantity || 1) - 1)}
                                      className="px-2 py-1 hover:bg-gray-50 text-gray-600 transition-colors"
                                      type="button"
                                    >
                                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                      </svg>
                                    </button>
                                    <div className="w-10 text-center font-medium text-gray-900 text-xs border-x border-gray-300 py-1">
                                      {item.quantity || 1}
                                    </div>
                                    <button
                                      onClick={() => updateQuantity(cartIndex, (item.quantity || 1) + 1)}
                                      className="px-2 py-1 hover:bg-gray-50 text-gray-600 transition-colors"
                                      type="button"
                                    >
                                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                      </svg>
                                    </button>
                                  </div>

                                  {/* Silme Butonu */}
                                  <button
                                    onClick={() => removeItem(cartIndex)}
                                    className="ml-auto p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-lg transition-colors"
                                    title="Entfernen"
                                    type="button"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                              <div className="font-semibold text-red-600 text-sm whitespace-nowrap flex-shrink-0">
                                {(() => {
                                  const priceStr = String(item.price);
                                  const cleanPrice = priceStr.replace('₺', '').replace(/\s/g, '').trim();
                                  const unitPrice = parseFloat(cleanPrice.replace(/\./g, '').replace(',', '.')) || 0;
                                  const totalPrice = unitPrice * (item.quantity || 1);
                                  return totalPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' ₺';
                                })()}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Satıcı Toplam */}
                      <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          Zwischensumme ({items.reduce((total, item) => total + (item.quantity || 1), 0)} Artikel)
                        </span>
                        <span className="font-semibold text-gray-900">
                          {items.reduce((sum, item) => {
                            const priceStr = String(item.price);
                            // Almanca format: 1.800,50 ₺ → 1800.50
                            const cleanPrice = priceStr.replace('₺', '').replace(/\s/g, '').trim();
                            const price = parseFloat(cleanPrice.replace(/\./g, '').replace(',', '.')) || 0;
                            return sum + (price * (item.quantity || 1));
                          }, 0).toFixed(2).replace('.', ',')} ₺
                        </span>
                      </div>
                    </div>
                  );
                });
              })()}
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Zwischensumme</span>
                <span>{total.toFixed(2).replace('.', ',')} ₺</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Versand</span>
                <span>Kostenlos</span>
              </div>
              <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t">
                <span>Gesamtsumme</span>
                <span>{total.toFixed(2).replace('.', ',')} ₺</span>
              </div>
            </div>

            <button
              type="submit"
              form="checkout-form"
              className="w-full mt-6 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-3 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
            >
              Jetzt kaufen
            </button>

            <p className="text-xs text-gray-500 mt-4 text-center">
              Mit Ihrer Bestellung erklären Sie sich mit unseren AGB und Datenschutzbestimmungen einverstanden.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
// Placeholder Components for Meins Dropdown
export const Messages = () => (
  <div className="max-w-[1400px] mx-auto px-4 py-12 text-center">
    <h2 className="text-2xl font-bold text-gray-900 mb-4">Meine Nachrichten</h2>
    <p className="text-gray-600">Hier finden Sie bald Ihre Nachrichten.</p>
  </div>
);

export const MyListings = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = React.useState(null);
  const [listings, setListings] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [favoriteCounts, setFavoriteCounts] = React.useState({});
  const [selectedListing, setSelectedListing] = React.useState(null);
  const [isPromotionModalOpen, setIsPromotionModalOpen] = React.useState(false);

  // Check authentication and load user
  React.useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      // Redirect to login if not authenticated
      navigate('/login');
      return;
    }

    try {
      const user = JSON.parse(storedUser);
      setCurrentUser(user);

      // Fetch user's listings
      fetchUserListings(user.id);
    } catch (e) {
      localStorage.removeItem('user');
      navigate('/login');
    }
  }, [navigate]);

  const fetchUserListings = async (userId) => {
    try {
      // Use Supabase API
      const { fetchUserListings: fetchFromSupabase } = await import('./api/listings');
      const data = await fetchFromSupabase(userId);
      setListings(data);

      // Fetch favorite counts for each listing
      await fetchFavoriteCounts(data);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching user listings:', error);
      setLoading(false);
    }
  };

  const fetchFavoriteCounts = async (listingsData) => {
    try {
      const { favoritesApi } = await import('./api/favorites');
      const counts = {};
      await Promise.all(
        listingsData.map(async (listing) => {
          const listingId = listing._id || listing.id;
          const count = await favoritesApi.getFavoriteCount(listingId);
          counts[listingId] = count;
        })
      );
      setFavoriteCounts(counts);
    } catch (error) {
      console.error('Error fetching favorite counts:', error);
    }
  };

  const handlePromote = (listing) => {
    setSelectedListing(listing);
    setIsPromotionModalOpen(true);
  };

  const handlePromotionConfirm = async (packageId) => {
    try {
      const { purchasePromotion } = await import('./api/promotions');
      const packageDetails = {
        gallery: { id: 'gallery', price: 59.90, duration: 30 },
        top: { id: 'top', price: 39.90, duration: 15 },
        highlight: { id: 'highlight', price: 19.90, duration: 30 }
      }[packageId];

      await purchasePromotion(selectedListing.id, packageDetails, currentUser.id);

      // Refresh listings to show updated promotion status
      if (currentUser) {
        fetchUserListings(currentUser.id);
      }
    } catch (error) {
      console.error('Promotion failed:', error);
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 py-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
        <p className="text-gray-600 mt-4">Lade Ihre Anzeigen...</p>
      </div>
    );
  }

  if (listings.length === 0) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Meine Anzeigen</h2>
        <p className="text-gray-600 mb-8">Sie haben noch keine Anzeigen erstellt.</p>
        <button
          onClick={() => navigate('/add-listing')}
          className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-3 px-8 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
        >
          Erste Anzeige erstellen
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Meine Anzeigen</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {listings.map((listing) => (
          <div key={listing._id || listing.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            {listing.image && (
              <img
                src={listing.image}
                alt={listing.title}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-3">
              <h3 className="font-medium text-sm text-gray-900 line-clamp-2 mb-2 min-h-[40px]">
                {listing.title}
              </h3>
              <span className="text-base font-bold text-gray-900">
                {listing.price_type === 'giveaway' || listing.price === 0
                  ? 'Zu verschenken'
                  : typeof listing.price === 'number'
                    ? `${listing.price.toLocaleString('tr-TR')} ₺`
                    : listing.price?.toString().includes('₺')
                      ? listing.price
                      : `${listing.price} ₺`}
              </span>
              <p className="text-gray-500 text-sm mb-2">{listing.city || listing.location}</p>

              {/* Favorite Count */}
              <div className="flex items-center gap-1 text-sm text-gray-600 mb-3">
                <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">{favoriteCounts[listing._id || listing.id] || 0}</span>
                <span>Favoriler</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => navigate(`/product/${listing._id || listing.id}`)}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-2 rounded-lg transition-colors text-xs"
                >
                  {t.productDetail.details || 'Detaylar'}
                </button>
                <button
                  onClick={() => handlePromote(listing)}
                  className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium py-2 px-2 rounded-lg transition-colors text-xs shadow-sm"
                >
                  {t.promotions.title}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <PromotionModal
        isOpen={isPromotionModalOpen}
        onClose={() => setIsPromotionModalOpen(false)}
        listingTitle={selectedListing?.title}
        onConfirm={handlePromotionConfirm}
      />
    </div>
  );
};

export const Settings = () => {
  const [newsletter, setNewsletter] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [currentEmail, setCurrentEmail] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newEmailConfirm, setNewEmailConfirm] = useState('');
  const [password, setPassword] = useState('');
  const [isCommercial, setIsCommercial] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('+49********414');
  const [hasLucidId, setHasLucidId] = useState(null);
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [newPhoneNumber, setNewPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
  const [showBillingModal, setShowBillingModal] = useState(false);
  const [billingData, setBillingData] = useState({
    firstName: '',
    lastName: '',
    street: '',
    houseNumber: '',
    zip: '',
    city: '',
    country: 'Deutschland'
  });

  // Store Management States
  const [storeName, setStoreName] = useState('');
  const [storeDescription, setStoreDescription] = useState('');
  const [storeLogo, setStoreLogo] = useState('');
  const [storeBanner, setStoreBanner] = useState('');
  const [isPro, setIsPro] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      const storedUserString = localStorage.getItem('user');
      if (!storedUserString) return;

      try {
        const storedUser = JSON.parse(storedUserString);
        const { supabase: supabaseClient } = await import('./lib/supabase');

        // Fetch latest profile data to ensure is_pro is accurate
        const { data: profile, error } = await supabaseClient
          .from('profiles')
          .select('*')
          .eq('id', storedUser.id)
          .single();

        if (error) throw error;

        if (profile) {
          setStoreName(profile.store_name || '');
          setStoreDescription(profile.store_description || '');
          setStoreLogo(profile.store_logo || '');
          setStoreBanner(profile.store_banner || '');
          setIsPro(profile.is_pro || false);
          setIsCommercial(profile.is_pro || profile.is_commercial || false);

          // Update localStorage to stay in sync
          const updatedUser = { ...storedUser, ...profile };
          localStorage.setItem('user', JSON.stringify(updatedUser));
          if (typeof setCurrentUser === 'function') setCurrentUser(updatedUser);
        }
      } catch (e) {
        console.error('Error fetching profile data:', e);
      }
    };

    fetchProfileData();
  }, [currentUser?.id]);

  const handleStoreUpdate = async (e) => {
    e.preventDefault();
    try {
      const { supabase: supabaseClient } = await import('./lib/supabase');
      const storedUser = JSON.parse(localStorage.getItem('user'));

      const { error } = await supabaseClient
        .from('profiles')
        .update({
          store_name: storeName,
          store_description: storeDescription,
          store_logo: storeLogo,
          store_banner: storeBanner
        })
        .eq('id', storedUser.id);

      if (error) throw error;
      alert(t.addListing.updateSuccess);

      // Update local storage user
      const updatedUser = { ...storedUser, store_name: storeName, store_description: storeDescription, store_logo: storeLogo, store_banner: storeBanner };
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Store update failed:', error);
      alert(t.addListing.error);
    }
  };

  const handleEmailChange = (e) => {
    e.preventDefault();
    if (newEmail !== newEmailConfirm) {
      alert('Die E-Mail-Adressen stimmen nicht überein.');
      return;
    }
    alert('Bestätigungs-E-Mails wurden an beide Adressen gesendet.');
    setCurrentEmail('');
    setNewEmail('');
    setNewEmailConfirm('');
    setPassword('');
  };

  const handlePhoneChange = (e) => {
    e.preventDefault();
    if (!newPhoneNumber || !verificationCode) {
      alert('Bitte füllen Sie alle Felder aus.');
      return;
    }
    alert('Telefonnummer erfolgreich geändert!');
    setPhoneNumber(newPhoneNumber);
    setShowPhoneModal(false);
    setNewPhoneNumber('');
    setVerificationCode('');
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (newPassword !== newPasswordConfirm) {
      alert('Die Passwörter stimmen nicht überein.');
      return;
    }
    if (newPassword.length < 8) {
      alert('Das Passwort muss mindestens 8 Zeichen lang sein.');
      return;
    }
    alert('Passwort erfolgreich geändert!');
    setShowPasswordModal(false);
    setCurrentPassword('');
    setNewPassword('');
    setNewPasswordConfirm('');
  };

  const handleBillingChange = (e) => {
    e.preventDefault();
    alert('Rechnungsadresse erfolgreich aktualisiert!');
    setShowBillingModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Einstellungen</h1>

        <div className="space-y-6">
          {/* Newsletter Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Newsletter</h2>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={newsletter}
                onChange={(e) => setNewsletter(e.target.checked)}
                className="mt-1 w-4 h-4 text-red-500 focus:ring-red-400 rounded"
              />
              <span className="text-sm text-gray-700">
                Ja, zu regelmäßigen Mails von uns mit Produktinfos, Tipps, Aktionen und spannenden Geschichten über uns und verbundene Unternehmen - du kannst dich jederzeit abmelden.
              </span>
            </label>
          </div>

          {/* Email Change Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">E-Mail-Adresse ändern</h2>
            <div className="mb-4 text-sm text-gray-600 space-y-2">
              <p>Um deine E-Mail-Adresse zu ändern, erhältst du zwei E-Mails von uns.</p>
              <p>Zu deiner Sicherheit verschicken wir eine E-Mail an deine bisherige E-Mail-Adresse. Diese dient zu deiner Information.</p>
              <p>Du erhältst außerdem eine E-Mail an deine neue E-Mail-Adresse. Bitte bestätige durch Auswahl des Links in der E-Mail, dass du im Besitz dieses E-Mail-Kontos bist.</p>
              <p className="text-red-600">Weitere Informationen findest du im Hilfebereich.</p>
            </div>

            <form onSubmit={handleEmailChange} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Registrierte E-Mail-Adresse
                </label>
                <input
                  type="email"
                  value={currentEmail}
                  onChange={(e) => setCurrentEmail(e.target.value)}
                  placeholder="aktuelle@email.de"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-400 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Neue E-Mail-Adresse
                </label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="neue@email.de"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-400 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Neue E-Mail-Adresse wiederholen
                </label>
                <input
                  type="email"
                  value={newEmailConfirm}
                  onChange={(e) => setNewEmailConfirm(e.target.value)}
                  placeholder="neue@email.de"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-400 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Passwort eingeben
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-400 focus:border-transparent"
                />
              </div>

              <button
                type="submit"
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium py-2 px-6 rounded-lg shadow-md hover:shadow-lg transition-all"
              >
                Neue E-Mail-Adresse speichern
              </button>
            </form>
          </div>

          {/* Email Notifications Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Benachrichtigungen per E-Mail</h2>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={emailNotifications}
                onChange={(e) => setEmailNotifications(e.target.checked)}
                className="mt-1 w-4 h-4 text-red-500 focus:ring-red-400 rounded"
              />
              <span className="text-sm text-gray-700">
                Du erhältst eine E-Mail, sobald du eine Nachricht von einem anderen Nutzer erhältst.
              </span>
            </label>
          </div>

          {/* Password Change Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Passwort ändern</h2>
            <p className="text-sm text-gray-600 mb-4">
              Ändere dein Passwort von Zeit zu Zeit, um Betrug zu vermeiden.
            </p>
            <button
              onClick={() => setShowPasswordModal(true)}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium py-2 px-6 rounded-lg shadow-md hover:shadow-lg transition-all"
            >
              Passwort ändern
            </button>
          </div>

          {/* Billing Data Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Rechnungsdaten</h2>
            <label className="flex items-center gap-3 cursor-pointer mb-4">
              <input
                type="checkbox"
                checked={isCommercial}
                onChange={(e) => setIsCommercial(e.target.checked)}
                className="w-4 h-4 text-red-500 focus:ring-red-400 rounded"
              />
              <span className="text-sm font-medium text-gray-700">Gewerblich</span>
            </label>
            <button
              onClick={() => setShowBillingModal(true)}
              className="text-red-600 hover:text-red-700 font-medium text-sm"
            >
              Rechnungsadresse ändern
            </button>
          </div>

          {/* Mağaza Ayarları Section (Only for PRO users) */}
          {(isPro || isCommercial) && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">{t.store.title}</h2>
                <button
                  onClick={() => navigate(`/store/${currentUser.id}`)}
                  className="text-red-600 hover:text-red-700 font-medium text-sm flex items-center gap-1"
                >
                  {t.store.preview}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleStoreUpdate} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t.store.name}</label>
                    <input
                      type="text"
                      value={storeName}
                      onChange={(e) => setStoreName(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t.store.logo} (URL)</label>
                    <input
                      type="text"
                      value={storeLogo}
                      onChange={(e) => setStoreLogo(e.target.value)}
                      placeholder="https://..."
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t.store.banner} (URL)</label>
                  <input
                    type="text"
                    value={storeBanner}
                    onChange={(e) => setStoreBanner(e.target.value)}
                    placeholder="https://..."
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t.store.description}</label>
                  <textarea
                    value={storeDescription}
                    onChange={(e) => setStoreDescription(e.target.value)}
                    rows={4}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-400"
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-3 px-8 rounded-lg shadow-md hover:shadow-lg transition-all"
                  >
                    {t.store.save}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Account Activity Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Übersicht deiner Aktivität</h2>
            <h3 className="font-semibold text-gray-900 mb-3">Mein Konto</h3>
            <div className="space-y-2 text-sm text-gray-700">
              <p>Du hast aktuell <span className="font-semibold">1 Anzeige</span> online.</p>
              <p>Du hast in den letzten 30 Tagen <span className="font-semibold">1 Anzeige</span> aufgegeben.</p>
            </div>
          </div>

          {/* Phone Number Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Telefonnummer ändern</h2>
            <h1 className="text-xl font-bold text-gray-900 mb-2">{seller.full_name || 'Unbekannter Verkäufer'}</h1>
            <p className="text-sm text-gray-500 mb-1">
              Aktiv seit {seller.created_at
                ? new Date(seller.created_at).toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })
                : 'Unbekannt'}
            </p>
            <p className="text-sm text-gray-500">
              {sellerListings.length} {sellerListings.length === 1 ? 'Anzeige' : 'Anzeigen'}
            </p>
            <p className="text-sm text-gray-700 mb-4">
              Verifizierte Telefonnummer: <span className="font-semibold">{phoneNumber}</span>
            </p>
            <button
              onClick={() => setShowPhoneModal(true)}
              className="text-red-600 hover:text-red-700 font-medium text-sm"
            >
              Telefonnummer ändern
            </button>
          </div>

          {/* LUCID ID Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Verpackungsregister LUCID-Identifikationsnummer</h2>

            {hasLucidId === null ? (
              <div>
                <p className="text-sm text-gray-700 mb-4">
                  Sie haben noch keine LUCID-ID eingetragen.
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  Falls Sie Verpackungen verwenden, können Sie hier Ihre persönliche LUCID-Identifikationsnummer eingeben.
                  Sollten Sie nicht registrierungspflichtig sein, teilen Sie und das bitte im nächsten Schritt mit.
                </p>
                <a
                  href="#"
                  className="text-sm text-red-600 hover:text-red-700 font-medium mb-4 inline-block"
                >
                  Weitere Informationen zum Verpackungsgesetz (VerpackG)
                </a>
                <div className="mt-4">
                  <button
                    onClick={() => setHasLucidId(true)}
                    className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium py-2 px-6 rounded-lg shadow-md hover:shadow-lg transition-all"
                  >
                    Auswahl treffen
                  </button>
                </div>
              </div>
            ) : hasLucidId ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  LUCID-Identifikationsnummer
                </label>
                <input
                  type="text"
                  placeholder="DE12345678901234"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-400 focus:border-transparent mb-4"
                />
                <button className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium py-2 px-6 rounded-lg shadow-md hover:shadow-lg transition-all">
                  Speichern
                </button>
              </div>
            ) : (
              <p className="text-sm text-gray-700">
                Sie haben angegeben, dass Sie nicht registrierungspflichtig sind.
              </p>
            )}
          </div>
        </div>

        {/* Phone Change Modal */}
        {showPhoneModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">Telefonnummer ändern</h3>
                <button
                  onClick={() => setShowPhoneModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handlePhoneChange} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Neue Telefonnummer
                  </label>
                  <input
                    type="tel"
                    value={newPhoneNumber}
                    onChange={(e) => setNewPhoneNumber(e.target.value)}
                    placeholder="+49 123 456789"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-400 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bestätigungscode
                  </label>
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder="6-stelliger Code"
                    maxLength={6}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-400 focus:border-transparent"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Wir senden Ihnen einen Bestätigungscode per SMS.
                  </p>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowPhoneModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                  >
                    Abbrechen
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all"
                  >
                    Speichern
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Password Change Modal */}
        {showPasswordModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">Passwort ändern</h3>
                <button
                  onClick={() => setShowPasswordModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Aktuelles Passwort
                  </label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-400 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Neues Passwort
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-400 focus:border-transparent"
                    required
                    minLength={8}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Mindestens 8 Zeichen
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Neues Passwort wiederholen
                  </label>
                  <input
                    type="password"
                    value={newPasswordConfirm}
                    onChange={(e) => setNewPasswordConfirm(e.target.value)}
                    placeholder="••••••••"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-400 focus:border-transparent"
                    required
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowPasswordModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                  >
                    Abbrechen
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all"
                  >
                    Speichern
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Billing Address Modal */}
        {showBillingModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">Rechnungsadresse ändern</h3>
                <button
                  onClick={() => setShowBillingModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleBillingChange} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Vorname
                    </label>
                    <input
                      type="text"
                      value={billingData.firstName}
                      onChange={(e) => setBillingData({ ...billingData, firstName: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-400 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nachname
                    </label>
                    <input
                      type="text"
                      value={billingData.lastName}
                      onChange={(e) => setBillingData({ ...billingData, lastName: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-400 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Straße
                    </label>
                    <input
                      type="text"
                      value={billingData.street}
                      onChange={(e) => setBillingData({ ...billingData, street: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-400 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nr.
                    </label>
                    <input
                      type="text"
                      value={billingData.houseNumber}
                      onChange={(e) => setBillingData({ ...billingData, houseNumber: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-400 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      PLZ
                    </label>
                    <input
                      type="text"
                      value={billingData.zip}
                      onChange={(e) => setBillingData({ ...billingData, zip: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-400 focus:border-transparent"
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Stadt
                    </label>
                    <input
                      type="text"
                      value={billingData.city}
                      onChange={(e) => setBillingData({ ...billingData, city: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-400 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Land
                  </label>
                  <select
                    value={billingData.country}
                    onChange={(e) => setBillingData({ ...billingData, country: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-400 focus:border-transparent"
                  >
                    <option value="Deutschland">Deutschland</option>
                    <option value="Österreich">Österreich</option>
                    <option value="Schweiz">Schweiz</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowBillingModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                  >
                    Abbrechen
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all"
                  >
                    Speichern
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const Favorites = ({ favorites, toggleFavorite, isFavorite, followedSellers = [] }) => {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'listings');
  const [favoriteListings, setFavoriteListings] = useState([]);
  const [loadingFavorites, setLoadingFavorites] = useState(true);
  const [followedSellerList, setFollowedSellerList] = useState([]);
  const [loadingFollowed, setLoadingFollowed] = useState(false);

  // Load favorite listings from Supabase
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        setLoadingFavorites(true);
        // Fetch all listings from Supabase
        const { fetchListings } = await import('./api/listings');
        const allListings = await fetchListings({});
        // Filter to only favorites
        const favListings = allListings.filter(listing => favorites.includes(listing.id));
        setFavoriteListings(favListings);
      } catch (error) {
        console.error('Error loading favorites:', error);
        setFavoriteListings([]);
      } finally {
        setLoadingFavorites(false);
      }
    };
    if (favorites.length > 0) {
      loadFavorites();
    } else {
      setFavoriteListings([]);
      setLoadingFavorites(false);
    }
  }, [favorites]);

  // Load followed sellers from Supabase
  useEffect(() => {
    const loadFollowedSellers = async () => {
      try {
        setLoadingFollowed(true);
        const { getFollowing } = await import('./api/follows');
        const following = await getFollowing();
        setFollowedSellerList(following);
      } catch (error) {
        console.error('Error loading followed sellers:', error);
        setFollowedSellerList([]);
      } finally {
        setLoadingFollowed(false);
      }
    };

    if (activeTab === 'users') {
      loadFollowedSellers();
    }
  }, [activeTab]);

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Favoriten</h1>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab('listings')}
            className={`pb-4 px-4 font-medium text-sm transition-colors relative ${activeTab === 'listings'
              ? 'text-red-600 border-b-2 border-red-600'
              : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            Anzeigen ({favoriteListings.length})
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`pb-4 px-4 font-medium text-sm transition-colors relative ${activeTab === 'users'
              ? 'text-red-600 border-b-2 border-red-600'
              : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            Nutzer ({followedSellerList.length})
          </button>
        </div>

        {activeTab === 'listings' ? (
          favoriteListings.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {favoriteListings.map(listing => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  toggleFavorite={toggleFavorite}
                  isFavorite={isFavorite}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Keine Favoriten</h3>
              <p className="text-gray-500">Du hast noch keine Anzeigen zu deinen Favoriten hinzugefügt.</p>
            </div>
          )
        ) : (
          /* Users Tab Content */
          loadingFollowed ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mb-4"></div>
              <p className="text-gray-600">Lade gefolgte Nutzer...</p>
            </div>
          ) : followedSellerList.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {followedSellerList.map(seller => (
                <div key={seller.id} className="bg-white rounded-lg shadow-sm p-6 flex items-center gap-4">
                  <Link to={`/seller/${seller.user_number}`} className="flex-shrink-0">
                    <img
                      src={seller.store_logo || seller.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(seller.full_name || 'User')}&background=ef4444&color=fff&size=200`}
                      alt={seller.full_name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-gray-100 hover:border-blue-500 transition-colors cursor-pointer"
                    />
                  </Link>
                  <div className="flex-1">
                    <Link to={`/seller/${seller.user_number}`} className="hover:text-blue-600 transition-colors">
                      <h3 className="font-semibold text-gray-900">{seller.full_name || 'Unbekannter Nutzer'}</h3>
                    </Link>
                    <div className="text-xs text-gray-400 mt-1">@{seller.user_number}</div>
                  </div>
                  <Link
                    to={`/seller/${seller.user_number}`}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium transition-colors"
                  >
                    Profil
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Keine gefolgten Nutzer</h3>
              <p className="text-gray-500">Du folgst noch keinen Nutzern.</p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export const SearchSection = ({ searchTerm, setSearchTerm, selectedCategory, setSelectedCategory, location, setLocation, cartItems = [], cartCount = 0, showCart, setShowCart, removeFromCart, updateCartQuantity, followedSellers = [], favorites = [] }) => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [showDistanceDropdown, setShowDistanceDropdown] = useState(false);
  const [selectedDistance, setSelectedDistance] = useState('50 km');
  const [showMeinsDropdown, setShowMeinsDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [userProfile, setUserProfile] = useState(null);
  const isMobile = useIsMobile();
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [recentSearches, setRecentSearches] = useState([]);
  const [showRecentSearches, setShowRecentSearches] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const searchInputRef = React.useRef(null);
  const recentSearchesDropdownRef = React.useRef(null);

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert('Tarayıcınız konum özelliğini desteklemiyor.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`,
            {
              headers: {
                'User-Agent': 'Kleinbazaar/1.0'
              }
            }
          );
          const data = await response.json();
          // Try to get city, town, or village
          const city = data.address.city || data.address.town || data.address.village || data.address.province || data.address.state || 'Bilinmeyen Konum';
          setLocation(city);
          setShowLocationDropdown(false);
        } catch (error) {
          console.error('Error reverse geocoding:', error);
          alert('Konumunuz belirlenirken bir hata oluştu.');
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        alert('Konum izni verilmedi veya erişilemedi.');
        setIsLocating(false);
      },
      { timeout: 10000 }
    );
  };

  // Load recent searches from localStorage
  useEffect(() => {
    const savedSearches = localStorage.getItem('recentSearches');
    console.log('Loading recent searches:', savedSearches);
    if (savedSearches) {
      try {
        setRecentSearches(JSON.parse(savedSearches));
      } catch (e) {
        console.error('Error parsing recent searches:', e);
      }
    }
  }, []);

  const saveRecentSearch = (term) => {
    console.log('Saving recent search:', term);
    if (!term || !term.trim()) return;

    const newTerm = term.trim();

    // Read current from local storage to ensure we have latest
    let currentList = [];
    const currentSaved = localStorage.getItem('recentSearches');
    if (currentSaved) {
      try {
        currentList = JSON.parse(currentSaved);
      } catch (e) { }
    }

    const updatedSearches = [newTerm, ...currentList.filter(s => s !== newTerm)].slice(0, 3);

    console.log('Updated searches:', updatedSearches);
    setRecentSearches(updatedSearches);
    localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
  };

  // Fetch user profile for display name
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user) {
        try {
          const { fetchUserProfile: getProfile } = await import('./api/profile');
          const profile = await getProfile(user.id);
          setUserProfile(profile);
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      }
    };

    fetchUserProfile();
  }, [user]);

  // Fetch unread message count
  React.useEffect(() => {
    const fetchUnreadCount = async () => {
      if (user) {
        try {
          const { getUnreadCount } = await import('./api/messages');
          const count = await getUnreadCount();
          setUnreadCount(count);
        } catch (error) {
          console.error('Error fetching unread count:', error);
        }
      }
    };

    if (user) {
      fetchUnreadCount();
      // Refresh every 30 seconds
      const interval = setInterval(fetchUnreadCount, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const categoryDropdownRef = React.useRef(null);
  const locationDropdownRef = React.useRef(null);
  const distanceDropdownRef = React.useRef(null);
  const meinsDropdownRef = React.useRef(null);
  const cartDropdownRef = React.useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target)) {
        setShowCategoryDropdown(false);
      }
      if (locationDropdownRef.current && !locationDropdownRef.current.contains(event.target)) {
        setShowLocationDropdown(false);
      }
      if (distanceDropdownRef.current && !distanceDropdownRef.current.contains(event.target)) {
        setShowDistanceDropdown(false);
      }
      if (meinsDropdownRef.current && !meinsDropdownRef.current.contains(event.target)) {
        setShowMeinsDropdown(false);
      }
      if (cartDropdownRef.current && !cartDropdownRef.current.contains(event.target)) {
        setShowCart(false);
      }
      if (recentSearchesDropdownRef.current && !recentSearchesDropdownRef.current.contains(event.target) && !searchInputRef.current.contains(event.target)) {
        // console.log('Click outside recent searches');
        setShowRecentSearches(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [categoryDropdownRef, locationDropdownRef, distanceDropdownRef, meinsDropdownRef, cartDropdownRef, recentSearchesDropdownRef, setShowCart]);

  // Get user's location on component mount
  useEffect(() => {
    if (navigator.geolocation && location === 'Türkiye') {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          // Use Nominatim (OpenStreetMap) reverse geocoding to get postal code
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
              {
                headers: {
                  'User-Agent': 'Kleinbazaar'
                }
              }
            );
            const data = await response.json();

            if (data.address) {
              const city = data.address.city || data.address.town || data.address.village || data.address.province || data.address.state;
              if (city) {
                setLocation(city);
              } else {
                setLocation(t.nav.myLocation);
              }
            } else {
              setLocation(t.nav.myLocation);
            }
          } catch (error) {
            console.log('Error fetching city name:', error);
            setLocation(t.nav.myLocation);
          }
        },
        (error) => {
          console.log('Location access denied or unavailable');
        }
      );
    }
  }, []);

  const locationObj = useLocation();
  const isFavoritesListingsActive = locationObj.pathname === '/favorites' && (locationObj.search.includes('tab=listings') || !locationObj.search.includes('tab='));
  const isFavoritesUsersActive = locationObj.pathname === '/favorites' && locationObj.search.includes('tab=users');

  // Clear search term, category and reset distance when navigating to home page
  // Clear search term, category and reset distance when navigating to home page
  // Also sync search term from URL when on search page
  useEffect(() => {
    if (locationObj.pathname === '/') {
      setSearchTerm('');
      setSelectedCategory('Tüm Kategoriler');
      setSelectedDistance('50 km');
    } else if (locationObj.pathname === '/search') {
      const params = new URLSearchParams(locationObj.search);
      const q = params.get('q');
      if (q) setSearchTerm(q);

      const cat = params.get('category');
      if (cat) setSelectedCategory(cat);

      const loc = params.get('location');
      if (loc) setLocation(loc);
    }
  }, [locationObj.pathname, locationObj.search, setSearchTerm, setSelectedCategory, setSelectedDistance, setLocation]);

  return (
    <section className="bg-gradient-to-r from-red-500 to-rose-600 py-4 sm:py-8 relative overflow-visible z-40">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-30"></div>
      <div className="max-w-[1400px] mx-auto px-4 relative z-20">
        <div className="flex flex-col gap-2 sm:gap-3 lg:flex-row lg:items-stretch">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (searchTerm.trim()) {
                saveRecentSearch(searchTerm);
                setShowRecentSearches(false);
                navigate(`/search?q=${encodeURIComponent(searchTerm)}&category=${encodeURIComponent(selectedCategory)}&location=${encodeURIComponent(location)}`);
              }
            }}
            className="flex-1 flex items-center gap-1 sm:gap-2 bg-white rounded-xl sm:rounded-2xl p-2 sm:p-3 shadow-xl hover:shadow-2xl transition-shadow duration-300"
          >
            {/* Search Icon - Submit Button */}
            {!isMobile && (
              <button
                type="submit"
                className="p-1 sm:p-2 cursor-pointer hover:bg-gray-50 rounded-full transition-colors focus:outline-none"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            )}

            {/* Search Input Container */}
            <div className="flex-1 relative">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Ne arıyorsunuz?"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  if (!showRecentSearches) setShowRecentSearches(true);
                }}
                onFocus={() => {
                  console.log('Input focused, showing recent searches');
                  setShowRecentSearches(true);
                }}
                onClick={() => {
                  console.log('Input clicked, showing recent searches');
                  setShowRecentSearches(true);
                }}
                onKeyPress={(e) => {
                  // Enter is handled by form submit
                }}
                className="w-full px-1 sm:px-2 py-2 border-none outline-none text-gray-700 placeholder-gray-400 text-sm sm:text-base"
              />

              {/* Recent Searches Dropdown */}
              {showRecentSearches && recentSearches.length > 0 && (
                <div
                  ref={recentSearchesDropdownRef}
                  className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-[100] overflow-hidden"
                >
                  <div className="px-3 py-2 text-xs font-semibold text-gray-500 bg-gray-50 border-b border-gray-100">
                    Son aramalar
                  </div>
                  {recentSearches.map((term, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSearchTerm(term);
                        setShowRecentSearches(false);
                      }}
                      className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                    >
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {term}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Category Dropdown - Hidden on mobile, shown on tablet+ */}
            <div className="relative hidden md:block" ref={categoryDropdownRef}>
              <button
                type="button"
                onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                className="px-2 sm:px-3 py-2 border-l border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-1 focus:outline-none text-sm"
              >
                <span className="hidden lg:inline">{selectedCategory}</span>
                <span className="lg:hidden">Kategori</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {showCategoryDropdown && (
                <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 flex min-w-[600px] max-h-[500px] overflow-hidden">
                  {/* Main Categories */}
                  <div className="w-1/2 py-2 border-r border-gray-100 overflow-y-auto">
                    {categories.map((category) => (
                      <div
                        key={category.name}
                        onMouseEnter={() => setHoveredCategory(category)}
                        onClick={() => {
                          setSelectedCategory(category.name);
                          setShowCategoryDropdown(false);
                        }}
                        className={`w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors text-gray-700 cursor-pointer flex justify-between items-center ${hoveredCategory?.name === category.name ? 'bg-gray-50 text-red-500' : ''}`}
                      >
                        <span>{category.name}</span>
                        {category.subcategories && (
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Subcategories */}
                  {hoveredCategory && hoveredCategory.subcategories && (
                    <div className="w-1/2 py-2 bg-gray-50 rounded-r-lg overflow-y-auto">
                      <div className="px-4 py-2 font-semibold text-gray-900 border-b border-gray-200 mb-1">
                        {hoveredCategory.name}
                      </div>
                      {hoveredCategory.subcategories.map((sub) => (
                        <button
                          key={sub.name}
                          onClick={() => {
                            setSelectedCategory(sub.name);
                            setShowCategoryDropdown(false);
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-md focus:outline-none"
                        >
                          {sub.name}
                          {sub.count > 0 && <span className="text-xs text-gray-400 ml-1">({sub.count})</span>}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Location Input */}
            <div className="relative hidden sm:flex items-center border-l border-gray-200 group" ref={locationDropdownRef}>
              <div className="pl-3 text-gray-400 group-focus-within:text-red-500 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Şehir veya konum"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onFocus={() => setShowLocationDropdown(true)}
                className="w-32 md:w-40 px-2 py-2 text-sm text-gray-700 focus:outline-none placeholder-gray-400 bg-transparent"
              />
              <button
                type="button"
                onClick={handleDetectLocation}
                disabled={isLocating}
                className={`p-1 mr-1 rounded-md transition-all ${isLocating ? 'animate-pulse text-red-500' : 'text-gray-400 hover:text-red-500 hover:bg-gray-100'}`}
                title="Konumumu Bul"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="8" />
                  <circle cx="12" cy="12" r="2.5" fill="currentColor" stroke="none" />
                  <line x1="12" y1="2" x2="12" y2="5" />
                  <line x1="12" y1="19" x2="12" y2="22" />
                  <line x1="2" y1="12" x2="5" y2="12" />
                  <line x1="19" y1="12" x2="22" y2="12" />
                </svg>
              </button>

              {showLocationDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[180px]">
                  <div className="px-3 py-2 text-[10px] font-bold text-gray-400 border-b border-gray-50 uppercase tracking-wider">
                    Popüler Şehirler
                  </div>
                  {['Türkiye', 'İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya'].map((loc) => (
                    <button
                      key={loc}
                      onClick={() => {
                        setLocation(loc);
                        setShowLocationDropdown(false);
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-red-50 hover:text-red-700 transition-colors text-gray-700 focus:outline-none text-sm"
                    >
                      {loc}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Distance Filter */}
            <div className="relative" ref={distanceDropdownRef}>
              <button
                type="button"
                onClick={() => setShowDistanceDropdown(!showDistanceDropdown)}
                className="px-3 py-2 border-l border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-1 focus:outline-none"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                {selectedDistance}
              </button>
              {showDistanceDropdown && (
                <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[180px]">
                  {['20 km', '50 km', '100 km', '200 km', '500 km', 'Tüm Türkiye'].map((distance) => (
                    <button
                      key={distance}
                      onClick={() => {
                        setSelectedDistance(distance);
                        setShowDistanceDropdown(false);
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors text-gray-700 focus:outline-none"
                    >
                      {distance}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Search Button */}
            <button
              onClick={() => {
                const params = new URLSearchParams();
                if (searchTerm) params.append('search', searchTerm);
                if (selectedCategory && selectedCategory !== 'Tüm Kategoriler') params.append('category', selectedCategory);
                if (location && location !== 'Türkiye') params.append('location', location);
                if (selectedDistance) params.append('distance', selectedDistance);
                if (selectedDistance) params.append('distance', selectedDistance);

                console.log('Submitting form with data:', Object.fromEntries(params));
                // Navigate to search results
                navigate(`/Alle-Kategorien?${params.toString()}`);
              }}
              className="px-6 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 font-medium focus:outline-none"
            >
              Ara
            </button>
          </form>

          {/* Anzeige aufgeben Button */}
          <button
            onClick={() => navigate('/add-listing')}
            className="flex flex-col items-center justify-center text-white transition-all duration-300 font-semibold px-4 py-2 rounded-xl hover:bg-white/10 transform hover:-translate-y-0.5 group"
          >
            <svg className="w-8 h-8 mb-0.5 transform group-hover:scale-110 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <circle cx="12" cy="12" r="10" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v8m-4-4h8" />
            </svg>
            <span className="text-sm">İlan Ver</span>
          </button>

          {/* Meins Dropdown */}
          <div className="relative z-[10000]" ref={meinsDropdownRef}>
            <button
              onClick={() => setShowMeinsDropdown(!showMeinsDropdown)}
              className="flex flex-col items-center justify-center text-white hover:text-red-50 transition-all duration-300 font-medium px-3 py-2 relative rounded-xl hover:bg-white/10 transform hover:-translate-y-0.5 group"
            >
              <svg className="w-8 h-8 mb-0.5 transform group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="9" r="3" />
                <path d="M6.168 18.849A4 4 0 0 1 10 16h4a4 4 0 0 1 3.834 2.855" strokeLinecap="round" />
              </svg>
              <span className="text-sm">Hesabım</span>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {showMeinsDropdown && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2">
                <div className="border-b border-gray-100 pb-2">
                  <div className="px-4 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">HESABIM</div>

                  <button onClick={() => { navigate('/profile'); setShowMeinsDropdown(false); }} className="block w-full text-left px-4 py-2.5 text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors flex items-center gap-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    {t.nav.myProfile}
                  </button>
                  <button onClick={() => { navigate('/messages'); setShowMeinsDropdown(false); }} className="block w-full text-left px-4 py-2.5 text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors flex items-center gap-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span className="flex-1">{t.nav.messages}</span>
                    {unreadCount > 0 && (
                      <span className="bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                  <button onClick={() => { navigate('/my-listings'); setShowMeinsDropdown(false); }} className="block w-full text-left px-4 py-2.5 text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors flex items-center gap-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    {t.nav.myListings}
                  </button>
                  <button onClick={() => { navigate('/settings'); setShowMeinsDropdown(false); }} className="block w-full text-left px-4 py-2.5 text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors flex items-center gap-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {t.nav.settings}
                  </button>

                  {/* Unternehmensseite PRO */}
                  <button
                    onClick={() => { navigate('/packages'); setShowMeinsDropdown(false); }}
                    className="block w-full text-left px-3 py-2.5 mx-2 my-2 rounded-lg bg-gradient-premium text-white font-semibold transition-all hover:shadow-premium-lg transform hover:-translate-y-0.5 flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    {t.nav.proPage}
                  </button>
                </div>
                <div className="border-t border-gray-100 py-2">
                  <div className="px-4 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">{t.nav.favorites.toUpperCase()}</div>

                  <button
                    onClick={() => { navigate('/favorites'); setShowMeinsDropdown(false); }}
                    className={`block w-full text-left px-4 py-2.5 flex justify-between items-center transition-colors ${isFavoritesListingsActive
                      ? 'bg-primary-50 text-primary-600 font-medium'
                      : 'text-gray-700 hover:bg-primary-50 hover:text-primary-600'
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      {t.nav.favorites}
                    </div>
                    {favorites.length > 0 && (
                      <span className="badge-premium">
                        {favorites.length}
                      </span>
                    )}
                  </button>

                  <button
                    onClick={() => { navigate('/following'); setShowMeinsDropdown(false); }}
                    className={`block w-full text-left px-4 py-2.5 flex justify-between items-center transition-colors ${isFavoritesUsersActive
                      ? 'bg-primary-50 text-primary-600 font-medium'
                      : 'text-gray-700 hover:bg-primary-50 hover:text-primary-600'
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                      {t.nav.following}
                    </div>
                    {followedSellers.length > 0 && (
                      <span className="badge-premium">
                        {followedSellers.length}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </section >
  );
};

// Normalize subcategory names from database to display names
export const normalizeSubcategoryName = (subcategoryName) => {
  const normalizationMap = {
    'Spor Etkinlikleri': 'Spor',
    'Çocuk Etkinlikleri': 'Çocuk',
    // Add more mappings as needed
  };

  return normalizationMap[subcategoryName] || subcategoryName;
};

// Category Sidebar Component
export const getCategoryPath = (categoryName, subcategoryName = null) => {
  const mainMappings = {
    'Tüm Kategoriler': 'Alle-Kategorien',
    'Otomobil, Bisiklet & Tekne': 'Otomobil-Bisiklet-Tekne',
    'Otomobil, Bisiklet & Tekne Servisi': 'Otomobil-Bisiklet-Tekne',
    'Emlak': 'Emlak',
    'Ev & Bahçe': 'Ev-Bahce',
    'Moda & Güzellik': 'Moda-Guzellik',
    'Elektronik': 'Elektronik',
    'Evcil Hayvanlar': 'Evcil-Hayvanlar',
    'Aile, Çocuk & Bebek': 'Aile-Cocuk-Bebek',
    'İş İlanları': 'Is-Ilanlari',
    'Eğlence, Hobi & Mahalle': 'Eglence-Hobi-Mahalle',
    'Müzik, Film & Kitap': 'Muzik-Film-Kitap',
    'Biletler': 'Biletler',
    'Hizmetler': 'Hizmetler',
    'Ücretsiz & Takas': 'Ucretsiz-Takas',
    'Eğitim & Kurslar': 'Egitim-Kurslar',
    'Dersler & Kurslar': 'Egitim-Kurslar',
    'Komşu Yardımı': 'Komsu-Yardimi'
  };

  const subMappings = {
    // Auto, Rad & Boot
    'Otomobiller': 'Otomobiller',
    'Bisiklet & Aksesuarlar': 'Bisiklet-Aksesuarlar',
    'Bisiklet & Aksesuarları': 'Bisiklet-Aksesuarlar',
    'Oto Parça & Lastik': 'Oto-Parca-Lastik',
    'Tekne & Tekne Malzemeleri': 'Tekne-Tekne-Malzemeleri',
    'Motosiklet & Scooter': 'Motosiklet-Scooter',
    'Motosiklet Parça & Aksesuarlar': 'Motosiklet-Parca-Aksesuarlar',
    'Ticari Araçlar & Römorklar': 'Ticari-Araclar-Romorklar',
    'Tamir & Servis': 'Tamir-Servis',
    'Karavan & Motokaravan': 'Karavan-Motokaravan',
    'Diğer Otomobil, Bisiklet & Tekne': 'Diger-Otomobil-Bisiklet-Tekne',

    // Immobilien
    'Geçici Konaklama & Paylaşımlı Ev': 'Gecici-Konaklama-Paylasimli-Ev',
    'Geçici Konaklama & Paylaşımlı Oda': 'Gecici-Konaklama-Paylasimli-Ev',
    'Konteyner': 'Konteyner',
    'Satılık Daireler': 'Satilik-Daireler',
    'Satılık Daire': 'Satilik-Daireler',
    'Tatil Evi & Yurt Dışı Emlak': 'Tatil-Evi-Yurt-Disi-Emlak',
    'Tatil ve Yurt Dışı Emlak': 'Tatil-Evi-Yurt-Disi-Emlak',
    'Garaj & Otopark': 'Garaj-Otopark',
    'Garaj & Park Yeri': 'Garaj-Otopark',
    'Ticari Emlak': 'Ticari-Emlak',
    'Arsa & Bahçe': 'Arsa-Bahce',
    'Satılık Evler': 'Satilik-Evler',
    'Satılık Müstakil Ev': 'Satilik-Evler',
    'Kiralık Evler': 'Kiralik-Evler',
    'Kiralık Müstakil Ev': 'Kiralik-Evler',
    'Kiralık Daireler': 'Kiralik-Daireler',
    'Kiralık Daire': 'Kiralik-Daireler',
    'Yeni Projeler': 'Yeni-Projeler',
    'Taşımacılık & Nakliye': 'Tasimacilik-Nakliye',
    'Diğer Emlak': 'Diger-Emlak',

    // Haus & Garten
    'Banyo': 'Banyo',
    'Ofis': 'Ofis',
    'Dekorasyon': 'Dekorasyon',
    'Ev Hizmetleri': 'Ev-Hizmetleri',
    'Bahçe Malzemeleri & Bitkiler': 'Bahce-Malzemeleri-Bitkiler',
    'Ev Tekstili': 'Ev-Tekstili',
    'Ev Tadilatı': 'Ev-Tadilati',
    'Yapı Market & Tadilat': 'Ev-Tadilati',
    'Mutfak & Yemek Odası': 'Mutfak-Yemek-Odasi',
    'Lamba & Aydınlatma': 'Lamba-Aydinlatma',
    'Aydınlatma': 'Lamba-Aydinlatma', // Alias for breadcrumb fix
    'Yatak Odası': 'Yatak-Odasi',
    'Oturma Odası': 'Oturma-Odasi',
    'Diğer Ev & Bahçe': 'Diger-Ev-Bahce',

    // Moda & Güzellik
    'Güzellik & Sağlık': 'Guzellik-Saglik',
    'Kadın Giyimi': 'Kadin-Giyimi',
    'Kadın Ayakkabıları': 'Kadin-Ayakkabilari',
    'Erkek Giyimi': 'Erkek-Giyimi',
    'Erkek Ayakkabıları': 'Erkek-Ayakkabilari',
    'Çanta & Aksesuarlar': 'Canta-Aksesuarlar',
    'Saat & Takı': 'Saat-Taki',
    'Diğer Moda & Güzellik': 'Diger-Moda-Guzellik',

    // Elektronik
    'Ses & Hifi': 'Ses-Hifi',
    'Elektronik Servisler': 'Elektronik-Hizmetler',
    'Elektronik Hizmetler': 'Elektronik-Hizmetler',
    'Fotoğraf & Kamera': 'Fotograf-Kamera',
    'Cep Telefonu & Aksesuar': 'Cep-Telefonu-Telefon',
    'Cep Telefonu & Telefon': 'Cep-Telefonu-Telefon',
    'Beyaz Eşya & Ev Aletleri': 'Ev-Aletleri',
    'Ev Aletleri': 'Ev-Aletleri',
    'Oyun Konsolları': 'Konsollar',
    'Konsollar': 'Konsollar',
    'Dizüstü Bilgisayar': 'Dizustu-Bilgisayarlar',
    'Dizüstü Bilgisayarlar': 'Dizustu-Bilgisayarlar',
    'Masaüstü Bilgisayar': 'Bilgisayarlar',
    'Bilgisayarlar': 'Bilgisayarlar',
    'Bilgisayar Aksesuar & Yazılım': 'Bilgisayar-Aksesuarlari-Yazilim',
    'Bilgisayar Aksesuarları & Yazılım': 'Bilgisayar-Aksesuarlari-Yazilim',
    'Tablet & E-Okuyucu': 'Tabletler-E-Okuyucular',
    'Tabletler & E-Okuyucular': 'Tabletler-E-Okuyucular',
    'TV & Video': 'TV-Video',
    'Video Oyunları': 'Video-Oyunlari',
    'Diğer Elektronik': 'Diger-Elektronik',

    // Evcil Hayvanlar
    'Balıklar': 'Baliklar',
    'Köpekler': 'Kopekler',
    'Kediler': 'Kedi',
    'Küçük Hayvanlar': 'Kucuk-Hayvanlar',
    'Çiftlik Hayvanları': 'Ciftlik-Hayvanlari',
    'Atlar': 'Atlar',
    'Hayvan Bakımı & Eğitimi': 'Hayvan-Bakimi-Egitimi',
    'Hayvan Bakımı & Eğitim': 'Hayvan-Bakimi-Egitimi',
    'Kayıp Hayvanlar': 'Kayip-Hayvanlar',
    'Kuşlar': 'Kuslar',
    'Aksesuarlar': 'Aksesuarlar',

    // Aile, Çocuk & Bebek
    'Yaşlı Bakımı': 'Yasli-Bakimi',
    'Bebek & Çocuk Giyimi': 'Bebek-Cocuk-Giyimi',
    'Bebek & Çocuk Ayakkabıları': 'Bebek-Cocuk-Ayakkabilari',
    'Bebek Ekipmanları': 'Bebek-Ekipmanlari',
    'Oto Koltukları': 'Oto-Koltuklari',
    'Bebek Koltuğu & Oto Koltukları': 'Oto-Koltuklari',
    'Babysitter & Çocuk Bakımı': 'Babysitter-Cocuk-Bakimi',
    'Bebek Arabaları & Pusetler': 'Bebek-Arabalari-Pusetler',
    'Çocuk Odası Mobilyaları': 'Cocuk-Odasi-Mobilyalari',
    'Bebek Odası Mobilyaları': 'Cocuk-Odasi-Mobilyalari',
    'Oyuncaklar': 'Oyuncaklar',
    'Oyuncak': 'Oyuncaklar',
    'Diğer Aile, Çocuk & Bebek': 'Diger-Aile-Cocuk-Bebek',

    // İş İlanları
    'Mesleki Eğitim': 'Mesleki-Egitim',
    'Eğitim / Meslek Eğitimi': 'Mesleki-Egitim',  // Variant name
    'İnşaat, Zanaat & Üretim': 'Insaat-Sanat-Uretim',
    'İnşaat, El Sanatları & Üretim': 'Insaat-Sanat-Uretim', // Fix for broken link
    'Büro İşleri & Yönetim': 'Buroarbeit-Yonetim',
    'Büroarbeit & Yönetim': 'Buroarbeit-Yonetim',
    'Ofis İşleri & Yönetim': 'Buroarbeit-Yonetim',
    'Gastronomi & Turizm': 'Gastronomi-Turizm',
    'Müşteri Hizmetleri & Çağrı Merkezi': 'Musteri-Hizmetleri-Cagri-Merkezi',
    'Yarı Zamanlı & Ek İşler': 'Ek-Isler',
    'Mini & Ek İşler': 'Ek-Isler',
    'Ek İşler': 'Ek-Isler',
    'Staj': 'Staj',
    'Sosyal Sektör & Bakım': 'Sosyal-Sektor-Bakim',
    'Nakliye, Lojistik & Trafik': 'Tasimacilik-Lojistik',
    'Taşımacılık & Lojistik': 'Tasimacilik-Lojistik',
    'Satış, Satın Alma & Pazarlama': 'Satis-Pazarlama',
    'Satış & Pazarlama': 'Satis-Pazarlama',
    'Diğer İş İlanları': 'Diger-Is-Ilanlari',

    // Eğlence, Hobi & Mahalle
    'Ezoterizm & Spiritüalizm': 'Ezoterizm-Spiritualizm',
    'Yiyecek & İçecek': 'Yiyecek-Icecek',
    'Boş Zaman Aktiviteleri': 'Bos-Zaman-Aktiviteleri',
    'El Sanatları & Hobi': 'El-Sanatlari-Hobi',
    'Sanat & Antikalar': 'Sanat-Antikalar',
    'Sanatçılar & Müzisyenler': 'Sanatcilar-Muzisyenler',
    'Model Yapımı': 'Model-Yapimi',
    'Seyahat & Etkinlik Hizmetleri': 'Seyahat-Etkinlik-Hizmetleri',
    'Koleksiyon': 'Koleksiyon',
    'Spor & Kamp': 'Spor-Kamp',
    'Bit Pazarı': 'Bit-Pazari',
    'Kayıp & Buluntu': 'Kayip-Buluntu',
    'Diğer Eğlence, Hobi & Mahalle': 'Diger-Eglence-Hobi-Mahalle',

    // Müzik, Film & Kitap
    'Kitap & Dergi': 'Kitap-Dergi',
    'Kırtasiye': 'Kirtasiye',
    'Çizgi Romanlar': 'Cizgi-Romanlar',
    'Ders Kitapları, Okul & Eğitim': 'Ders-Kitaplari-Okul-Egitim',
    'Film & DVD': 'Film-DVD',
    'Müzik & CD\'ler': 'Muzik-CDler',
    'Müzik Enstrümanları': 'Muzik-Enstrumanlari',
    'Diğer Müzik, Film & Kitap': 'Diger-Muzik-Film-Kitap',

    // Biletler
    'Tren & Toplu Taşıma': 'Tren-Toplu-Tasima',
    'Komedi & Kabare': 'Komedi-Kabare',
    'Hediye Kartları': 'Hediye-Kartlari',
    'Hediye Çekleri': 'Hediye-Kartlari',
    'Çocuk': 'Cocuk',
    'Çocuk Etkinlikleri': 'Cocuk',  // DB variant
    'Konserler': 'Konserler',
    'Spor': 'Spor',
    'Spor Etkinlikleri': 'Spor',  // DB variant
    'Tiyatro & Müzikal': 'Tiyatro-Muzikal',
    'Diğer Biletler': 'Diger-Biletler',

    // Hizmetler
    'Otomobil, Bisiklet & Tekne Servisi': 'Otomobil-Bisiklet-Tekne-Servisi',
    'Oto, Bisiklet & Tekne Servisi': 'Otomobil-Bisiklet-Tekne-Servisi',  // Legacy name
    'Otomobil, Bisiklet & Tekne': 'Otomobil-Bisiklet-Tekne-Servisi',  // Short form
    'Yaşlı Bakımı': 'Yasli-Bakimi',
    'Bebek Bakıcısı & Kreş': 'Babysitter-Cocuk-Bakimi',
    'Babysitter & Çocuk Bakımı': 'Babysitter-Cocuk-Bakimi',
    'Babysitter/-in & Kinderbetreuung': 'Babysitter-Cocuk-Bakimi',  // German
    'Elektronik': 'Elektronik',
    'Elektronik Servisler': 'Elektronik-Hizmetler',  // Legacy/variant name
    'Ev & Bahçe': 'Ev-Bahce',
    'Ev & Bahçe Hizmetleri': 'Ev-Hizmetleri',  // Services subcategory under Ev & Bahçe
    'Ev Hizmetleri': 'Ev-Hizmetleri',  // Another variant
    'Sanatçılar & Müzisyenler': 'Sanatcilar-Muzisyenler',
    'Sanatçı & Müzisyen': 'Sanatcilar-Muzisyenler',  // Singular form
    'Seyahat & Etkinlik': 'Seyahat-Etkinlik',
    'Hayvan Bakımı & Eğitimi': 'Hayvan-Bakimi-Egitimi',
    'Evcil Hayvan Bakımı & Eğitim': 'Hayvan-Bakimi-Egitimi',
    'Taşımacılık & Nakliye': 'Tasimacilik-Nakliye',
    'Nakliye & Taşıma': 'Tasimacilik-Nakliye',
    'Diğer Hizmetler': 'Diger-Hizmetler',

    // Ücretsiz & Takas
    'Takas': 'Takas',
    'Ödünç Verme': 'Kiralama',
    'Kiralama': 'Kiralama',
    'Ücretsiz': 'Ucretsiz',
    'Ücretsiz Verilecekler': 'Ucretsiz',  // Legacy name compatibility

    // Eğitim & Kurslar
    'Bilgisayar Kursları': 'Bilgisayar-Kurslari',
    'Ezoterizm & Spiritüalizm': 'Ezoterizm-Spiritualizm',
    'Yemek & Pastacılık': 'Yemek-Pastacilik-Kurslari',
    'Yemek & Pastacılık Kursları': 'Yemek-Pastacilik-Kurslari',
    'Sanat & Tasarım': 'Sanat-Tasarim-Kurslari',
    'Sanat & Tasarım Kursları': 'Sanat-Tasarim-Kurslari',
    'Müzik & Şan': 'Muzik-San-Dersleri',
    'Müzik & Şan Dersleri': 'Muzik-San-Dersleri',
    'Özel Ders': 'Ozel-Ders',
    'Spor Kursları': 'Spor-Kurslari',
    'Dil Kursları': 'Dil-Kurslari',
    'Dans Kursları': 'Dans-Kurslari',
    'Sürekli Eğitim': 'Surekli-Egitim',
    'Diğer Dersler & Kurslar': 'Diger-Dersler-Kurslar',
    'Diğer Eğitim & Kurslar': 'Diger-Dersler-Kurslar',

    // Komşu Yardımı
    'Komşu Yardımı': 'Komsu-Yardimi',
    'Komşu Yardımı': 'Komsu-Yardimi'
  };

  const catSlug = mainMappings[categoryName] || categoryName;
  if (!subcategoryName) return `/${catSlug}`;

  const subSlug = subMappings[subcategoryName] || subcategoryName.replace(/\s+/g, '-');
  return `/${catSlug}/${subSlug}`;
};

// CategorySidebar Component
export const CategorySidebar = ({ selectedCategory, setSelectedCategory }) => {
  const [expandedCategories, setExpandedCategories] = useState([]);
  const [categoriesWithCounts, setCategoriesWithCounts] = useState(categories);
  const navigate = useNavigate();

  // Fetch real category counts from Supabase
  useEffect(() => {
    const fetchCategoryCounts = async () => {
      try {
        const { fetchCategoryCounts: fetchCounts } = await import('./api/listings');
        const allListings = await fetchCounts();

        // Count listings by category and subcategory
        const counts = {};

        allListings.forEach(listing => {
          let cat = listing.category;
          const subCat = listing.sub_category;

          // Normalize category name
          if (cat === 'Musik, Film & Bücher' || cat === 'Musik, Filme & Bücher') {
            cat = 'Müzik, Film & Kitap';
          }
          if (cat === 'Immobilien') {
            cat = 'Emlak';
          }

          // Count main category
          counts[cat] = (counts[cat] || 0) + 1;

          // Count subcategory
          if (subCat) {
            const key = `${cat}:${subCat}`;
            counts[key] = (counts[key] || 0) + 1;
          }
        });

        // Update categories with real counts
        const updatedCategories = categories.map(category => {
          if (category.name === 'Tüm Kategoriler') {
            return { ...category, count: allListings.length };
          }

          const mainCount = counts[category.name] || 0;
          const updatedSubcategories = category.subcategories?.map(sub => ({
            ...sub,
            count: counts[`${category.name}:${sub.name}`] || 0
          }));

          return {
            ...category,
            count: mainCount,
            subcategories: updatedSubcategories || category.subcategories
          };
        });

        setCategoriesWithCounts(updatedCategories);
        console.log('Updated category counts from Supabase:', counts);

        // Debug: Show Aile, Çocuk & Bebek subcategory keys
        const familyKeys = Object.keys(counts).filter(k => k.startsWith('Aile, Çocuk & Bebek:'));
        console.log('Family subcategory keys:', familyKeys);
        console.log('Looking for: Aile, Çocuk & Bebek:Bebek Koltuğu & Oto Koltukları');
        console.log('Looking for: Aile, Çocuk & Bebek:Bebek Odası Mobilyaları');
      } catch (error) {
        console.error('Error fetching category counts:', error);
      }
    };

    fetchCategoryCounts();
  }, []);


  const toggleCategory = (categoryName) => {
    setExpandedCategories(prev =>
      prev.includes(categoryName)
        ? prev.filter(c => c !== categoryName)
        : [...prev, categoryName]
    );
  };

  return (
    <aside className="w-96 flex-shrink-0 bg-white rounded-2xl shadow-lg p-6 h-fit border border-gray-100">
      <h3 className="font-bold text-gray-900 mb-5 text-lg">Kategoriler</h3>

      <div className="space-y-1.5">
        {categoriesWithCounts.map((category) => (
          <div key={category.name}>
            <button
              onClick={() => {
                if (category.subcategories) {
                  toggleCategory(category.name);
                } else {
                  const url = getCategoryPath(category.name);
                  navigate(url);
                  setSelectedCategory(category.name);
                }
              }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 text-left ${selectedCategory === category.name
                ? 'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-md'
                : 'hover:bg-gray-50 text-gray-700 hover:shadow-sm'
                }`}
            >
              <span className="font-semibold text-sm flex-grow">{category.name}</span>
              <div className="flex items-center gap-2">
                {category.count > 0 && (
                  <span className={`text-xs px-2 py-0.5 rounded-full ${selectedCategory === category.name ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'}`}>
                    {category.count.toLocaleString('tr-TR')}
                  </span>
                )}
                {category.subcategories && (
                  <div className={`p-1 rounded-lg transition-colors ${selectedCategory === category.name ? 'hover:bg-white/10' : 'hover:bg-gray-200'}`}>
                    <svg
                      className={`w-4 h-4 transition-transform duration-200 ${expandedCategories.includes(category.name) ? 'rotate-180' : ''} ${selectedCategory === category.name ? 'text-white' : 'text-gray-400'}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                )}
              </div>
            </button>

            {/* Subcategories */}
            {category.subcategories && expandedCategories.includes(category.name) && (
              <div className="ml-4 mt-1 space-y-1 border-l-2 border-gray-100 pl-2">
                {/* Main Category Link inside subcategories */}
                <button
                  onClick={() => {
                    navigate(getCategoryPath(category.name));
                    setSelectedCategory(category.name);
                  }}
                  className="w-full flex items-center px-4 py-2 rounded-lg text-left text-xs font-black text-red-600 hover:bg-red-50 transition-all border border-transparent hover:border-red-100"
                >
                  <svg className="w-3.5 h-3.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                  Tüm {category.name}
                </button>
                {category.subcategories.map((sub) => (
                  <button
                    key={sub.name}
                    onClick={() => {
                      const path = getCategoryPath(category.name, sub.name);
                      if (path) {
                        navigate(path);
                        setSelectedCategory(sub.name);
                      } else {
                        setSelectedCategory(sub.name);
                      }
                    }}
                    className={`w-full flex items-center justify-between px-3 py-1.5 rounded-md transition-colors text-left text-sm ${selectedCategory === sub.name
                      ? 'bg-red-50 text-red-600 font-medium'
                      : 'text-gray-600 hover:bg-gray-50'
                      }`}
                  >
                    <span>{sub.name}</span>
                    <span className="text-xs text-gray-400">({(sub.count || 0).toLocaleString('tr-TR')})</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
};

// Listing Card Component
export const ListingCard = ({ listing, toggleFavorite, isFavorite, isOwnListing = false, hidePrice = false }) => {
  // Debug log for pricing
  if (listing.price_type === 'negotiable' || listing.title.includes('VB_TEST')) {
    console.log(`[ListingCard] ${listing.title}: Price=${listing.price} (${typeof listing.price}), Type=${listing.price_type}`);
  }

  // const { isReserved, isSold, isTop, isNew, isHighlight, isUrgenty } = getListingBadges(listing); // This line was not in the original snippet, but was in the instruction. I'll add it.
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = React.useState(false);
  const favorite = isFavorite ? isFavorite(listing.id) : false;

  // Get first image from images array, fallback to placeholder
  const rawImageUrl = listing.images && listing.images.length > 0
    ? listing.images[0]
    : listing.image || 'https://via.placeholder.com/300x128?text=No+Image';

  const imageUrl = getOptimizedImageUrl(rawImageUrl, 300, 200, 'cover');

  const isReserved = listing?.reserved_by;

  // Override image for Mini- & Nebenjobs and Praktika
  const isMiniJob = listing.sub_category === 'Yarı Zamanlı & Ek İşler' || listing.sub_category === 'Staj';
  const displayImage = isMiniJob ? '/favicon.png' : imageUrl;
  const imageClasses = isMiniJob
    ? "w-full h-32 object-contain p-4 group-hover:scale-105 transition-transform duration-500"
    : "w-full h-32 object-cover group-hover:scale-105 transition-transform duration-500";

  return (
    <div className={`listing-card rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer group relative hover:-translate-y-1 ${listing.is_gallery || listing.is_top ? 'bg-purple-50' : 'bg-white'} ${listing.is_highlighted ? 'border-2 border-yellow-400 ring-4 ring-yellow-100' : listing.is_top ? 'border border-purple-200' : ''}`} onClick={() => navigate(`/product/${listing.id}`)}>
      <div className="relative overflow-hidden rounded-t-xl bg-gray-100 h-32" style={{ isolation: 'isolate', transform: 'translateZ(0)' }}>
        {!imageLoaded && !isMiniJob && (
          <div className="absolute inset-0 animate-pulse bg-gray-200 flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h14a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        <img
          src={displayImage}
          alt={listing.title}
          width="300"
          height="200"
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          className={`${imageClasses} ${!isMiniJob ? (imageLoaded ? 'opacity-100' : 'opacity-0') : 'opacity-100'} transition-opacity duration-300`}
        />
        {/* RESERVIERT Badge - highest priority */}
        {isReserved && (
          <div className="absolute top-3 left-3 bg-yellow-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg flex items-center gap-1 z-20">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            REZERVE
          </div>
        )}
        {/* TOP Badge - positioned below RESERVIERT if it exists */}
        {listing.is_top && (
          <div className={`absolute ${isReserved ? 'top-14' : 'top-3'} left-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg z-10`}>
            ⭐ TOP
          </div>
        )}
        {/* Commercial/PRO Badge */}
        {(listing.is_commercial || listing.is_pro) && (
          <div className="absolute bottom-2 left-2 flex flex-col gap-1">
            {listing.is_pro && (
              <span className="bg-red-600 text-white px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-tighter shadow-sm border border-red-500">
                PRO
              </span>
            )}
            {listing.is_commercial && (
              <span className="bg-blue-600 text-white px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-tighter shadow-sm border border-blue-500">
                KURUMSAL
              </span>
            )}
          </div>
        )}
        {/* Favorite Button - Only show for other users' listings */}
        {!isOwnListing && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (toggleFavorite) toggleFavorite(listing.id);
            }}
            className="absolute top-2 right-2 w-7 h-7 bg-white/90 backdrop-blur-sm rounded-full shadow hover:bg-white hover:scale-110 transition-all duration-200 z-30 flex items-center justify-center"
            aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            {favorite ? (
              <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-gray-400 group-hover:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            )}
          </button>
        )}
      </div>

      <div className="p-2">
        <h3 className="text-xs font-semibold text-gray-800 mb-1.5 line-clamp-2 group-hover:text-red-600 transition-colors">
          {listing.title}
        </h3>

        <div className="mb-1.5">
          <span className="text-base font-bold text-gray-900">
            {!hidePrice && listing.sub_category !== 'Eğitim / Meslek Eğitimi' && listing.sub_category !== 'İnşaat, Zanaat & Üretim' && listing.category !== 'İş İlanları' && (
              listing.price_type === 'giveaway' || listing.price === 0
                ? 'Ücretsiz'
                : listing.price
                  ? `${listing.price.toLocaleString('tr-TR')} ₺${listing.price_type === 'negotiable' ? ' Pazarlıklı' : ''}`
                  : 'Pazarlıklı'
            )}
          </span>
          {listing.city && (
            <div className="text-xs text-gray-700 mt-1 flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {listing.city}
            </div>
          )}
          {listing.date && (
            <div className="text-xs text-gray-700 mt-1 text-right absolute bottom-2 right-2">
              {listing.date}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Listing Grid Component
export const ListingGrid = ({ isLatest = false, selectedCategory = 'Tüm Kategoriler', searchTerm = '', toggleFavorite, isFavorite }) => {
  const [apiListings, setApiListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Fetch latest listings from backend when isLatest is true
  useEffect(() => {
    if (isLatest) {
      const fetchLatestListings = async () => {
        try {
          setLoading(true);
          // Import fetchListings from api/listings
          const { fetchListings } = await import('./api/listings');
          // Fetch latest 30 listings sorted strictly by created_at desc (ignoring top priority for Son İlanlar)
          const data = await fetchListings({ sort_by_newest: true }, { count: false });

          // Take only first 30 listings (already sorted by created_at desc)
          const latestListings = data.slice(0, 30);

          console.log('Fetched latest listings from Supabase:', latestListings);
          setApiListings(latestListings);
        } catch (error) {
          console.error('Error fetching latest listings:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchLatestListings();
    }
  }, [isLatest]);

  // Use only API listings (no mock data)
  const allListings = isLatest && apiListings.length > 0
    ? apiListings.map(listing => ({
      ...listing,
      // Ensure image field is properly formatted
      image: Array.isArray(listing.images) && listing.images.length > 0
        ? listing.images[0]
        : listing.image || '/placeholder-image.jpg',
      // price handling will be done in ListingCard
      price: listing.price,
      price_type: listing.price_type
    }))
    : [];

  const filtered = allListings.filter(l => {
    const matchesCategory = selectedCategory === 'Tüm Kategoriler' || l.category === selectedCategory;
    const matchesSearch = !searchTerm ||
      (l.title && l.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (l.description && l.description.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Trust the API's sorting (Promotion priority + Created at)
  const displayListings = isLatest ? filtered.slice(0, 30) : filtered.slice(0, 5);

  if (loading && isLatest) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="animate-pulse bg-white rounded-xl shadow-md h-64 overflow-hidden border border-gray-100">
            <div className="bg-gray-200 h-32 w-full"></div>
            <div className="p-3 space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-6 bg-gray-200 rounded w-1/3"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (displayListings.length === 0) {
    if (selectedCategory !== 'Tüm Kategoriler' && !isLatest && filtered.length === 0) {
      return (
        <div className="text-center py-12 text-gray-500 bg-white rounded-lg border border-dashed border-gray-300">
          "{selectedCategory}" kategorisinde ilan bulunamadı.
        </div>
      );
    }
    return null;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-4">
      {displayListings.map((listing) => (
        <ListingCard
          key={listing.id}
          listing={listing}
          toggleFavorite={toggleFavorite}
          isFavorite={isFavorite}
          isOwnListing={user && listing.user_id === user.id}
        />
      ))}
    </div>
  );
};

// Gallery Component
export const Gallery = ({ toggleFavorite, isFavorite, priceRange = 'all', filterLocation = 'Alle Orte', sortBy = 'relevance' }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [galleryItems, setGalleryItems] = useState([]);
  const itemsPerView = 5;
  const [showInfoModal, setShowInfoModal] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchTopListings = async () => {
      try {
        const { fetchListings } = await import('./api/listings');
        const { clearCache } = await import('./utils/cache');

        // Force clear cache once to fix stale data issues
        clearCache();

        // Fetch top listings, skip count for speed
        const data = await fetchListings({}, { count: false });
        // Include both Gallery and Top listings in the showcase
        let topListings = data.filter(listing => listing.is_gallery === true || listing.is_top === true);

        // Fiyat filtresi
        if (priceRange !== 'all') {
          topListings = topListings.filter(listing => {
            const price = parseFloat(listing.price) || 0;

            switch (priceRange) {
              case 'free':
                return price === 0;
              case 'under50':
                return price < 50;
              case 'under100':
                return price < 100;
              case '100-500':
                return price >= 100 && price <= 500;
              case '500-1000':
                return price >= 500 && price <= 1000;
              case '1000-5000':
                return price >= 1000 && price <= 5000;
              case 'over5000':
                return price > 5000;
              default:
                return true;
            }
          });
        }

        // Konum filtresi
        if (filterLocation && filterLocation !== 'Tüm Şehirler' && filterLocation !== 'Alle Orte') {
          topListings = topListings.filter(listing =>
            listing.city && listing.city.includes(filterLocation)
          );
        }

        // Sıralama
        switch (sortBy) {
          case 'price-asc':
            topListings.sort((a, b) => {
              const priceA = parseFloat(a.price) || 0;
              const priceB = parseFloat(b.price) || 0;
              return priceA - priceB;
            });
            break;
          case 'price-desc':
            topListings.sort((a, b) => {
              const priceA = parseFloat(a.price) || 0;
              const priceB = parseFloat(b.price) || 0;
              return priceB - priceA;
            });
            break;
          case 'newest':
            topListings.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            break;
          case 'oldest':
            topListings.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
            break;
          case 'relevance':
          default:
            // Shuffle for relevance
            topListings = [...topListings].sort(() => 0.5 - Math.random());
            break;
        }

        // If no top listings found, show random listings instead
        // if (topListings.length === 0) {
        //   topListings = [...data].sort(() => 0.5 - Math.random());
        // }

        setGalleryItems(topListings.slice(0, 10));
      } catch (error) {
        console.error('Error fetching top listings:', error);
        setGalleryItems([]);
      }
    };
    fetchTopListings();
  }, [priceRange, filterLocation, sortBy]);

  const maxIndex = Math.max(0, galleryItems.length - itemsPerView);

  const nextSlide = () => {
    setCurrentIndex(prev => Math.min(prev + 1, maxIndex));
  };

  const prevSlide = () => {
    setCurrentIndex(prev => Math.max(prev - 1, 0));
  };

  // if (galleryItems.length === 0) return null;

  return (
    <section className="mt-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Galeri</h2>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowInfoModal(true)}
            className="text-sm text-red-600 hover:text-red-700 font-medium hover:underline transition-colors"
          >
            İlanınızı burada yayınlayın
          </button>
          <div className="flex gap-2">
            <button
              onClick={prevSlide}
              disabled={currentIndex === 0}
              className="p-2.5 rounded-full bg-white border-2 border-gray-200 hover:border-red-500 hover:bg-red-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none"
              aria-label="Previous items"
            >
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextSlide}
              disabled={currentIndex >= maxIndex}
              className="p-2.5 rounded-full bg-white border-2 border-gray-200 hover:border-red-500 hover:bg-red-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none"
              aria-label="Next items"
            >
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden">
        {galleryItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-200">
            <p className="text-gray-500 font-medium">Henüz vitrin ilanı bulunmamaktadır.</p>
            <p className="text-sm text-gray-400 mt-1">İlanınızı öne çıkarmak için "İlanınızı burada yayınlayın"a tıklayın.</p>
          </div>
        ) : (
          <div
            className="flex transition-transform duration-300 ease-in-out gap-3"
            style={{ transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` }}
          >
            {galleryItems.map((item) => (
              <div key={item.id} className="gallery-item w-[calc(20%-9.6px)] flex-shrink-0">
                <ListingCard
                  listing={item}
                  toggleFavorite={toggleFavorite}
                  isFavorite={isFavorite}
                  isOwnListing={user && item.user_id === user.id}
                />
              </div>
            ))}
          </div>
        )}
      </div>
      <GalleryInfoModal
        isOpen={showInfoModal}
        onClose={() => setShowInfoModal(false)}
      />
    </section>
  );
};

// Gallery Info Modal
const GalleryInfoModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={(e) => { e.stopPropagation(); onClose(); }}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="relative h-48 bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
          <div className="text-center text-white z-10 p-6">
            <h2 className="text-3xl font-bold mb-2">{t.topAds.modal.title}</h2>
            <p className="text-blue-100 text-lg">{t.topAds.modal.subtitle}</p>
          </div>
          <button onClick={onClose} className="absolute top-4 right-4 text-white/80 hover:text-white bg-black/20 hover:bg-black/40 rounded-full p-2 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">{t.topAds.modal.queriesTitle}</h3>
              <p className="text-gray-600">{t.topAds.modal.queriesDesc}</p>
            </div>
          </div>

          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">{t.topAds.modal.rotationTitle}</h3>
              <p className="text-gray-600">{t.topAds.modal.rotationDesc}</p>
            </div>
          </div>

          <div className="flex items-start gap-4 mb-8">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">{t.topAds.modal.premiumTitle}</h3>
              <p className="text-gray-600">{t.topAds.modal.premiumDesc}</p>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8 flex gap-3">
            <span className="text-2xl">💡</span>
            <p className="text-sm text-yellow-800">
              <span className="font-bold">{t.topAds.modal.tip}</span> {t.topAds.modal.tipDesc}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <a href="#" className="text-blue-600 hover:text-blue-800 font-medium text-sm hover:underline">
              {t.topAds.modal.moreInfo}
            </a>
            <button
              onClick={() => navigate('/profile?tab=listings')}
              className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-bold hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
            >
              {t.topAds.modal.selectListing}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Category-specific Gallery Component
export const CategoryGallery = ({ category, subCategory, listings, toggleFavorite = () => { }, isFavorite = () => false, hidePrice = false }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [galleryItems, setGalleryItems] = useState([]);
  const [itemsPerView, setItemsPerView] = useState(5);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const { user } = useAuth();

  // Update itemsPerView based on screen size
  useEffect(() => {
    const updateItemsPerView = () => {
      if (window.innerWidth < 640) {
        setItemsPerView(2); // Mobile: 2 columns
      } else if (window.innerWidth < 1024) {
        setItemsPerView(3); // Tablet: 3 columns
      } else {
        setItemsPerView(5); // Desktop: 5 columns
      }
    };

    updateItemsPerView();
    window.addEventListener('resize', updateItemsPerView);
    return () => window.removeEventListener('resize', updateItemsPerView);
  }, []);

  useEffect(() => {
    const fetchCategoryTopListings = async () => {
      try {
        // If listings prop is provided, use it directly
        if (listings) {
          const shuffled = [...listings].sort(() => 0.5 - Math.random());
          setGalleryItems(shuffled.slice(0, 10));
          return;
        }

        // Otherwise, fetch from Supabase
        const { fetchListings } = await import('./api/listings');
        let filters = { is_top: true };

        if (category) {
          filters.category = category;
        }

        if (subCategory) {
          filters.subCategory = subCategory;
        }

        const topListings = await fetchListings(filters);

        const shuffled = [...topListings].sort(() => 0.5 - Math.random());

        // If no top listings found, show random listings from category/subcategory
        if (shuffled.length === 0) {
          // Fetch all listings for fallback
          const allListings = await fetchListings(category || subCategory ? { category, subCategory } : {});
          const randomFallback = [...allListings].sort(() => 0.5 - Math.random());
          setGalleryItems(randomFallback.slice(0, 10));
        } else {
          setGalleryItems(shuffled.slice(0, 10));
        }
      } catch (error) {
        console.error('Error fetching category top listings:', error);
        setGalleryItems([]);
      }
    };
    fetchCategoryTopListings();
  }, [category, subCategory, listings]);

  const maxIndex = Math.max(0, galleryItems.length - itemsPerView);

  const nextSlide = () => {
    setCurrentIndex(prev => Math.min(prev + 1, maxIndex));
  };

  const prevSlide = () => {
    setCurrentIndex(prev => Math.max(prev - 1, 0));
  };

  return (
    <section className="mb-4 sm:mb-6 overflow-hidden">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900">{t.topAds.title}</h2>
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={() => setShowInfoModal(true)}
            className="text-xs sm:text-sm text-red-600 hover:text-red-700 font-medium hover:underline transition-colors"
          >
            {t.topAds.placeAd}
          </button>
          {galleryItems.length > 0 && (
            <div className="flex gap-1 sm:gap-2">
              <button
                onClick={prevSlide}
                disabled={currentIndex === 0}
                className="p-1.5 sm:p-2.5 rounded-full bg-white border-2 border-gray-200 hover:border-red-500 hover:bg-red-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none"
                aria-label="Previous items"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={nextSlide}
                disabled={currentIndex >= maxIndex}
                className="p-1.5 sm:p-2.5 rounded-full bg-white border-2 border-gray-200 hover:border-red-500 hover:bg-red-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none"
                aria-label="Next items"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="relative overflow-hidden">
        {galleryItems.length === 0 ? (
          <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg sm:rounded-xl p-8 sm:p-12 text-center">
            <svg className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-3 sm:mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p className="text-sm sm:text-base text-gray-500 font-medium">{t.topAds.noAds}</p>
            <p className="text-xs sm:text-sm text-gray-400 mt-1 sm:mt-2">{t.topAds.checkBackLater}</p>
          </div>
        ) : (
          <div
            className="flex transition-transform duration-300 ease-in-out gap-2 sm:gap-3"
            style={{ transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` }}
          >
            {galleryItems.map((item) => (
              <div
                key={item.id}
                className="gallery-item flex-shrink-0"
                style={{ width: `calc(${100 / itemsPerView}% - ${(itemsPerView - 1) * (itemsPerView === 2 ? 8 : 12) / itemsPerView}px)` }}
              >
                <ListingCard
                  listing={item}
                  toggleFavorite={toggleFavorite}
                  isFavorite={isFavorite}
                  isOwnListing={user && item.user_id === user.id}
                  hidePrice={hidePrice}
                />
              </div>
            ))}
          </div>
        )}
      </div>
      <GalleryInfoModal
        isOpen={showInfoModal}
        onClose={() => setShowInfoModal(false)}
      />
    </section>
  );
};

// Welcome Modal Component
export const WelcomeModal = ({ onClose }) => {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md mx-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-xl font-semibold mb-4">{t.welcome.title}</h2>
        <p className="text-gray-600 mb-4">
          {t.welcome.subtitle}
        </p>

        <ul className="space-y-2 mb-6">
          <li className="flex items-center gap-2 text-sm text-gray-700">
            <div className="w-5 h-5 bg-red-400 rounded-full flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
              </svg>
            </div>
            {t.welcome.feature3}
          </li>
          <li className="flex items-center gap-2 text-sm text-gray-700">
            <div className="w-5 h-5 bg-red-400 rounded-full flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
              </svg>
            </div>
            {t.welcome.feature1}
          </li>
          <li className="flex items-center gap-2 text-sm text-gray-700">
            <div className="w-5 h-5 bg-red-400 rounded-full flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
              </svg>
            </div>
            {t.welcome.feature2}
          </li>
        </ul>

        <div className="flex gap-3">
          <button
            onClick={() => { navigate('/register'); onClose(); }}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            {t.nav.register}
          </button>
          <button
            onClick={() => { navigate('/login'); onClose(); }}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 font-medium"
          >
            {t.nav.login}
          </button>
        </div>
      </div>
    </div>
  );
};

// Helper function to get German state from postal code
// Mesaj Gönderme Modalı
export const MessageModal = ({ isOpen, onClose, onSubmit, sellerName, listingTitle }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Auto-fill name and phone from user profile
  React.useEffect(() => {
    const loadUserProfile = async () => {
      if (user && isOpen) {
        try {
          const { fetchUserProfile } = await import('./api/profile');
          const profile = await fetchUserProfile(user.id);
          if (profile) {
            setName(profile.full_name || '');
            setPhone(profile.phone || '');
          }
        } catch (error) {
          console.error('Error loading user profile:', error);
        }
      }
    };

    loadUserProfile();
  }, [user, isOpen]);

  if (!isOpen) return null;


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert(t.sellerProfile.loginToMessage);
      return;
    }

    try {
      setLoading(true);
      const { sendMessage } = await import('./api/messages');
      // We need receiverId. Assuming onSubmit was handling it, but now we do it here.
      // Ideally MessageModal should receive receiverId prop.
      // For now, let's keep onSubmit for backward compatibility but enhance it or replace logic if possible.
      // Wait, the previous implementation just called onSubmit({ name, phone, message }).
      // The parent component (ProductDetail or SellerProfile) handles the actual sending logic?
      // Let's check where MessageModal is used.

      // Actually, looking at usages, MessageModal passes data to parent.
      // To make it "real", we should either:
      // 1. Update all parents to call API.
      // 2. Update MessageModal to take receiverId and listingId and call API directly.

      // Option 2 is better for encapsulation.
      // I need to update the component signature to accept receiverId and listingId.

      await onSubmit({ name, phone, message }); // Keep existing behavior for now to avoid breaking parents immediately

      setName('');
      setPhone('');
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      alert(t.sellerProfile.messageError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={onClose}></div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                  {t.sellerProfile.message} - {sellerName}
                </h3>
                {listingTitle && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Konu: {listingTitle}
                    </p>
                  </div>
                )}
                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                  <div>
                    <label htmlFor="modal-name" className="block text-sm font-medium text-gray-700">{t.addListing.name}</label>
                    <input
                      type="text"
                      id="modal-name"
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor="modal-phone" className="block text-sm font-medium text-gray-700">{t.addListing.phoneNumber}</label>
                    <input
                      type="tel"
                      id="modal-phone"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor="modal-message" className="block text-sm font-medium text-gray-700">{t.sellerProfile.message}</label>
                    <textarea
                      id="modal-message"
                      required
                      rows={4}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                  </div>
                  <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                    <button
                      type="submit"
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-base font-medium text-white hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      {t.productDetail.send}
                    </button>
                    <button
                      type="button"
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                      onClick={onClose}
                    >
                      {t.common.cancel}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const getStateFromZip = (zip) => {
  if (!zip || zip.length < 1) return '';
  const firstTwoDigits = parseInt(zip.substring(0, 2));

  if (isNaN(firstTwoDigits)) return '';

  // Turkish City Mapping (Plate numbers 01-81)
  // 5-digit postal codes usually start with the plate number in Turkey
  if (zip.length === 5 && firstTwoDigits >= 1 && firstTwoDigits <= 81) {
    const turkishCities = [
      'Adana', 'Adıyaman', 'Afyonkarahisar', 'Ağrı', 'Amasya', 'Ankara', 'Antalya', 'Artvin',
      'Aydın', 'Balıkesir', 'Bilecik', 'Bingöl', 'Bitlis', 'Bolu', 'Burdur', 'Bursa', 'Çanakkale',
      'Çankırı', 'Çorum', 'Denizli', 'Diyarbakır', 'Edirne', 'Elazığ', 'Erzincan', 'Erzurum',
      'Eskişehir', 'Gaziantep', 'Giresun', 'Gümüşhane', 'Hakkari', 'Hatay', 'Isparta', 'Mersin',
      'İstanbul', 'İzmir', 'Kars', 'Kastamonu', 'Kayseri', 'Kırklareli', 'Kırşehir', 'Kocaeli',
      'Konya', 'Kütahya', 'Malatya', 'Manisa', 'Kahramanmaraş', 'Mardin', 'Muğla', 'Muş',
      'Nevşehir', 'Niğde', 'Ordu', 'Rize', 'Sakarya', 'Samsun', 'Siirt', 'Sinop', 'Sivas',
      'Tekirdağ', 'Tokat', 'Trabzon', 'Tunceli', 'Şanlıurfa', 'Uşak', 'Van', 'Yozgat', 'Zonguldak',
      'Aksaray', 'Bayburt', 'Karaman', 'Kırıkkale', 'Batman', 'Şırnak', 'Bartın', 'Ardahan',
      'Iğdır', 'Yalova', 'Karabük', 'Kilis', 'Osmaniye', 'Düzce'
    ];
    return turkishCities[firstTwoDigits - 1] || '';
  }

  // Precise mapping based on German postal code ranges
  // Returns single Bundesland name matching our filter values
  if (firstTwoDigits >= 1 && firstTwoDigits <= 1) return 'Brandenburg';
  if (firstTwoDigits >= 2 && firstTwoDigits <= 3) return 'Sachsen';
  if (firstTwoDigits >= 4 && firstTwoDigits <= 9) return 'Sachsen-Anhalt';
  if (firstTwoDigits >= 10 && firstTwoDigits <= 14) return 'Berlin';
  if (firstTwoDigits >= 15 && firstTwoDigits <= 19) return 'Brandenburg';
  if (firstTwoDigits >= 20 && firstTwoDigits <= 21) return 'Hamburg';
  if (firstTwoDigits >= 22 && firstTwoDigits <= 25) return 'Schleswig-Holstein';
  if (firstTwoDigits >= 26 && firstTwoDigits <= 27) return 'Bremen';
  if (firstTwoDigits >= 28 && firstTwoDigits <= 29) return 'Niedersachsen';
  if (firstTwoDigits >= 30 && firstTwoDigits <= 34) return 'Niedersachsen';
  if (firstTwoDigits >= 35 && firstTwoDigits <= 36) return 'Hessen';
  if (firstTwoDigits === 37) return 'Niedersachsen';
  if (firstTwoDigits === 38) return 'Sachsen-Anhalt';
  if (firstTwoDigits === 39) return 'Sachsen-Anhalt';
  if (firstTwoDigits >= 40 && firstTwoDigits <= 48) return 'Nordrhein-Westfalen';
  if (firstTwoDigits === 49) return 'Niedersachsen';
  if (firstTwoDigits >= 50 && firstTwoDigits <= 53) return 'Nordrhein-Westfalen';
  if (firstTwoDigits >= 54 && firstTwoDigits <= 56) return 'Rheinland-Pfalz';
  if (firstTwoDigits >= 57 && firstTwoDigits <= 59) return 'Nordrhein-Westfalen';
  if (firstTwoDigits >= 60 && firstTwoDigits <= 65) return 'Hessen';
  if (firstTwoDigits === 66) return 'Saarland';
  if (firstTwoDigits === 67) return 'Rheinland-Pfalz';
  if (firstTwoDigits >= 68 && firstTwoDigits <= 69) return 'Baden-Württemberg';
  if (firstTwoDigits >= 70 && firstTwoDigits <= 79) return 'Baden-Württemberg';
  if (firstTwoDigits >= 80 && firstTwoDigits <= 89) return 'Bayern';
  if (firstTwoDigits >= 90 && firstTwoDigits <= 96) return 'Bayern';
  if (firstTwoDigits === 97) return 'Thüringen';
  if (firstTwoDigits >= 98 && firstTwoDigits <= 99) return 'Thüringen';

  return '';
};

// Special Sellers Component - Unternehmensseiten
export const SpecialSellers = ({ toggleFollowSeller, isSellerFollowed }) => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(5);

  // Filter only commercial sellers (Gewerblicher Nutzer)
  const companies = Object.entries(mockSellers)
    .map(([id, seller]) => ({ ...seller, id }))
    .filter(seller => seller.sellerType === 'Gewerblicher Nutzer');

  // Update itemsPerView based on screen size
  useEffect(() => {
    const updateItemsPerView = () => {
      if (window.innerWidth < 640) {
        setItemsPerView(2); // Mobile: 2 columns
      } else if (window.innerWidth < 1024) {
        setItemsPerView(3); // Tablet: 3 columns
      } else {
        setItemsPerView(5); // Desktop: 5 columns
      }
    };

    updateItemsPerView();
    window.addEventListener('resize', updateItemsPerView);
    return () => window.removeEventListener('resize', updateItemsPerView);
  }, []);

  const maxIndex = Math.max(0, companies.length - itemsPerView);

  const nextSlide = () => {
    setCurrentIndex(prev => Math.min(prev + 1, maxIndex));
  };

  const prevSlide = () => {
    setCurrentIndex(prev => Math.max(prev - 1, 0));
  };

  if (companies.length === 0) return null;

  return (
    <section className="mt-8 sm:mt-12 mb-8 sm:mb-12">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Unternehmensseiten in Deutschland</h2>
        <div className="flex items-center gap-2 sm:gap-4">
          <a
            href="/Unternehmensseiten"
            className="text-xs sm:text-sm text-red-600 hover:text-red-700 font-medium hover:underline transition-colors"
          >
            Alle anzeigen
          </a>
          <div className="flex gap-1 sm:gap-2">
            <button
              onClick={prevSlide}
              disabled={currentIndex === 0}
              className="p-1.5 sm:p-2 rounded-full border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Previous companies"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextSlide}
              disabled={currentIndex >= maxIndex}
              className="p-1.5 sm:p-2 rounded-full border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Next companies"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden">
        <div
          className="flex transition-transform duration-300 ease-in-out gap-2 sm:gap-4"
          style={{ transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` }}
        >
          {companies.map((company) => (
            <div
              key={company.id}
              className="w-[calc(20%-16px)] flex-shrink-0 bg-white rounded-xl shadow-sm hover:shadow-lg transition-all cursor-pointer group border border-gray-100 overflow-hidden"
              onClick={() => navigate(`/seller/${company.user_number}`)}
            >
              {/* Company Image - Same as listing card */}
              <div className="relative w-full h-40 bg-gray-100">
                <img
                  src={company.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(company.name)}&background=0D8ABC&color=fff&size=400`}
                  alt={company.name}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Company Info - Same padding as listing card */}
              <div className="p-3">
                {/* Company Name */}
                <h3 className="font-semibold text-sm text-gray-900 mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {company.name}
                </h3>

                {/* Business Type/Category */}
                {company.businessType && (
                  <p className="text-xs text-gray-500 mb-2 font-medium">
                    {company.businessType}
                  </p>
                )}

                {/* Location */}
                <div className="flex items-center gap-1 text-gray-500 text-xs mb-2">
                  <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="8" />
                    <circle cx="12" cy="12" r="2.5" fill="currentColor" stroke="none" />
                    <line x1="12" y1="2" x2="12" y2="4" />
                    <line x1="12" y1="20" x2="12" y2="22" />
                    <line x1="2" y1="12" x2="4" y2="12" />
                    <line x1="20" y1="12" x2="22" y2="12" />
                  </svg>
                  <span className="line-clamp-1">
                    {company.address
                      ? (() => {
                        const parts = company.address.split(',');
                        const lastPart = parts[parts.length - 1].trim();
                        const match = lastPart.match(/(\d{5})\s+(.+)/);
                        return match ? `${match[1]} ${match[2]}` : lastPart;
                      })()
                      : 'Deutschland'}
                  </span>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                  <div className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>{company.totalListings || 0} Anzeigen</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-500">★</span>
                    <span className="font-medium text-gray-700">{company.rating}</span>
                  </div>
                </div>

                {/* Action Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/seller/${company.user_number}`);
                  }}
                  className="w-full py-2 px-3 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors text-xs"
                >
                  Zur Unternehmensseite
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Add Listing Page Component
export const AddListing = () => {
  // Debug logging
  const [debugLog, setDebugLog] = React.useState(null);
  const logDebug = (msg, val) => console.log(msg, val);
  const { user } = useAuth(); // Get current user
  const navigate = useNavigate(); // Get navigate function
  const [searchParams] = useSearchParams(); // Get URL parameters
  const editId = searchParams.get('edit'); // Get edit ID from URL
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [limitState, setLimitState] = useState({ canAdd: true, limit: 20, currentCount: 0, remaining: 20 });
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [payingExtra, setPayingExtra] = useState(false);

  // Check listing limit on mount
  useEffect(() => {
    const checkLimit = async () => {
      if (!user || editId) return; // Don't check limit if user not logged in or editing

      try {
        const { checkUserListingLimit } = await import('./api/listings');
        const status = await checkUserListingLimit(user.id);
        setLimitState(status);
        if (!status.canAdd) {
          // setShowLimitModal(true); // Defer to handleSubmit as per user request
        }
      } catch (error) {
        console.error('Error in limit check:', error);
      }
    };
    checkLimit();
  }, [user, editId]);

  const handlePayExtra = async () => {
    setPayingExtra(true);
    try {
      // Mock payment delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      const { fetchUserProfile, updateUserProfile } = await import('./api/profile');
      const profile = await fetchUserProfile(user.id);

      await updateUserProfile(user.id, {
        extra_paid_listings: (profile.extra_paid_listings || 0) + 1
      });

      setLimitState(prev => ({
        ...prev,
        canAdd: true,
        limit: prev.limit + 1,
        remaining: 1
      }));
      setShowLimitModal(false);
    } catch (error) {
      console.error('Error paying for extra listing:', error);
      alert('Ödeme işlemi sırasında bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setPayingExtra(false);
    }
  };

  // Categories from Supabase
  const [categories, setCategories] = useState([]);
  const [availableSubcategories, setAvailableSubcategories] = useState([]);


  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const isJobCategory = category === 'İş İlanları' || subCategory === 'Eğitim / Meslek Eğitimi';
  const hideConditionAndShipping = category === 'Emlak' || category === 'Eğitim & Kurslar' || isJobCategory || subCategory === 'Bebek Bakıcısı & Kreş' || subCategory === 'Balıklar' || subCategory === 'Köpekler' || subCategory === 'Kediler' || subCategory === 'Küçük Hayvanlar' || subCategory === 'Çiftlik Hayvanları' || subCategory === 'Atlar' || subCategory === 'Hayvan Bakımı & Eğitim' || subCategory === 'Kayıp Hayvanlar' || subCategory === 'Kuşlar' || subCategory === 'Konteyner' || subCategory === 'Tamir & Servis' || subCategory === 'Ticari Araçlar & Römorklar' || subCategory === 'Tekne & Tekne Malzemeleri';
  const [condition, setCondition] = useState(''); // Default to empty string for granular selection
  const [price, setPrice] = useState('');
  const [priceType, setPriceType] = useState('fixed');
  const [description, setDescription] = useState('');
  const [imageFiles, setImageFiles] = useState([]);

  const [city, setCity] = useState(localStorage.getItem('savedCity') || '');
  const [district, setDistrict] = useState(localStorage.getItem('savedDistrict') || '');
  const [region, setRegion] = useState(localStorage.getItem('savedRegion') || '');
  const [address, setAddress] = useState(localStorage.getItem('savedAddress') || '');
  const [offerType, setOfferType] = useState('Angebote'); // 'Angebote' or 'Gesuche'
  const [contactName, setContactName] = useState(''); // Will be auto-filled from profile
  const [phoneNumber, setPhoneNumber] = useState(''); // Will be auto-filled from profile
  const [showPhoneNumber, setShowPhoneNumber] = useState(false);
  const [showLocation, setShowLocation] = useState(
    localStorage.getItem('savedShowLocation') !== null
      ? localStorage.getItem('savedShowLocation') === 'true'
      : false
  );

  // Debug logging hook
  useEffect(() => {
    console.log('[DEBUG] AddListing State:', { category, subCategory });
  }, [category, subCategory]);
  // Don't show location by default, seller must choose
  const [legalInfo, setLegalInfo] = useState(''); // Will be auto-filled for commercial sellers
  // const [federalState, setFederalState] = useState(''); // Removed dependency on postal code

  const [sellerType, setSellerType] = useState(''); // Store seller type from profile

  // Auto-specific states
  const [selectedCarBrand, setSelectedCarBrand] = useState('');
  const [selectedCarModel, setSelectedCarModel] = useState('');
  const [selectedFahrzeugtyp, setSelectedFahrzeugtyp] = useState('');
  const [selectedDoorCount, setSelectedDoorCount] = useState('');
  const [selectedExteriorColor, setSelectedExteriorColor] = useState('');
  const [selectedInteriorMaterial, setSelectedInteriorMaterial] = useState('');
  const [selectedEmissionBadge, setSelectedEmissionBadge] = useState('');
  const [selectedSchadstoffklasse, setSelectedSchadstoffklasse] = useState('');
  const [selectedHU, setSelectedHU] = useState('');
  const [isUnfallfrei, setIsUnfallfrei] = useState(false);
  const [isScheckheftgepflegt, setIsScheckheftgepflegt] = useState(false);
  const [isNichtraucher, setIsNichtraucher] = useState(false);
  const [selectedCarAmenities, setSelectedCarAmenities] = useState([]);
  const [erstzulassungMonat, setErstzulassungMonat] = useState('');

  // Bike-specific states
  const [selectedBikeType, setSelectedBikeType] = useState('');
  const [selectedBikeArt, setSelectedBikeArt] = useState('');

  // Autoteile-specific state
  const [selectedAutoteileArt, setSelectedAutoteileArt] = useState('');
  const [selectedAutoteileAngebotstyp, setSelectedAutoteileAngebotstyp] = useState('');
  const [selectedVersand, setSelectedVersand] = useState('');

  // Boote-specific state
  const [selectedBooteArt, setSelectedBooteArt] = useState('');

  // Dekoration-specific state
  const [selectedDekorationArt, setSelectedDekorationArt] = useState('');

  // Motorrad-specific state
  const [selectedMotorradArt, setSelectedMotorradArt] = useState('');

  // Motorradteile-specific state
  const [selectedMotorradteileArt, setSelectedMotorradteileArt] = useState('');

  // Nutzfahrzeuge-specific state
  const [selectedNutzfahrzeugeArt, setSelectedNutzfahrzeugeArt] = useState('');

  // Wohnwagen-specific state
  const [selectedWohnwagenArt, setSelectedWohnwagenArt] = useState('');

  // Wohnzimmer-specific state
  const [selectedWohnzimmerArt, setSelectedWohnzimmerArt] = useState('');

  // Schlafzimmer-specific state
  const [selectedSchlafzimmerArt, setSelectedSchlafzimmerArt] = useState('');

  // Küche & Esszimmer-specific state
  const [selectedKuecheEsszimmerArt, setSelectedKuecheEsszimmerArt] = useState('');

  // Kadın Giyimi (Damenbekleidung) specific states
  const [selectedDamenbekleidungArt, setSelectedDamenbekleidungArt] = useState('');
  const [selectedDamenbekleidungMarke, setSelectedDamenbekleidungMarke] = useState('');
  const [selectedDamenbekleidungSize, setSelectedDamenbekleidungSize] = useState('');
  const [selectedDamenbekleidungColor, setSelectedDamenbekleidungColor] = useState('');

  // Gartenzubehör & Pflanzen-specific state
  const [selectedGartenzubehoerArt, setSelectedGartenzubehoerArt] = useState('');

  // Lamba & Aydınlatma-specific state
  const [selectedLambaAydinlatmaArt, setSelectedLambaAydinlatmaArt] = useState('');

  // Dienstleistungen > Haus & Garten-specific state
  const [selectedDienstleistungenHausGartenArt, setSelectedDienstleistungenHausGartenArt] = useState('');

  // Bücher & Zeitschriften-specific state
  const [selectedBuecherZeitschriftenArt, setSelectedBuecherZeitschriftenArt] = useState('');

  // Sammeln-specific state
  const [selectedSammelnArt, setSelectedSammelnArt] = useState('');

  // Elektronik > Audio & Hifi-specific state
  const [selectedElektronikAudioHifiArt, setSelectedElektronikAudioHifiArt] = useState('');

  // Modellbau-specific state
  const [selectedModellbauArt, setSelectedModellbauArt] = useState('');

  // Jobs-specific state
  const [workingTime, setWorkingTime] = useState('');
  const [hourlyWage, setHourlyWage] = useState('');
  const [jobType, setJobType] = useState('');

  // Handarbeit, Basteln & Kunsthandwerk-specific state
  const [selectedHandarbeitArt, setSelectedHandarbeitArt] = useState('');

  // Künstler/-in & Musiker/-in-specific state
  const [selectedKuenstlerMusikerArt, setSelectedKuenstlerMusikerArt] = useState('');

  // Reise & Eventservices-specific state
  const [selectedReiseEventservicesArt, setSelectedReiseEventservicesArt] = useState('');

  // Tierbetreuung & Training-specific state
  const [selectedTierbetreuungTrainingArt, setSelectedTierbetreuungTrainingArt] = useState('');

  // Baby & Kinderkleidung-specific state
  const [babyKinderkleidungArt, setBabyKinderkleidungArt] = useState('');
  const [babyKinderkleidungSize, setBabyKinderkleidungSize] = useState('');
  const [babyKinderkleidungGender, setBabyKinderkleidungGender] = useState('');
  const [babyKinderkleidungColor, setBabyKinderkleidungColor] = useState('');
  const [babyKinderschuheArt, setBabyKinderschuheArt] = useState('');
  const [babyKinderschuheSize, setBabyKinderschuheSize] = useState('');
  const [babyKinderschuheColor, setBabyKinderschuheColor] = useState('');
  const [babyschalenKindersitzeColor, setBabyschalenKindersitzeColor] = useState(''); // Bebek Arabaları
  const [kinderwagenBuggysArt, setKinderwagenBuggysArt] = useState('');
  const [kinderwagenBuggysColor, setKinderwagenBuggysColor] = useState('');

  // Herrenschuhe
  const [selectedHerrenschuheArt, setSelectedHerrenschuheArt] = useState('');
  const [selectedHerrenschuheMarke, setSelectedHerrenschuheMarke] = useState('');
  const [selectedHerrenschuheSize, setSelectedHerrenschuheSize] = useState('');
  const [selectedHerrenschuheColor, setSelectedHerrenschuheColor] = useState('');

  // Babyschalen & Kindersitze
  const [damenbekleidungColor, setDamenbekleidungColor] = useState('');
  const [damenbekleidungMarke, setDamenbekleidungMarke] = useState('');
  const [damenbekleidungSize, setDamenbekleidungSize] = useState('');
  const [damenbekleidungArt, setDamenbekleidungArt] = useState('');
  const [damenschuheColor, setDamenschuheColor] = useState('');
  const [damenschuheMarke, setDamenschuheMarke] = useState('');
  const [damenschuheSize, setDamenschuheSize] = useState('');
  const [damenschuheArt, setDamenschuheArt] = useState('');
  const [herrenbekleidungColor, setHerrenbekleidungColor] = useState('');
  const [herrenbekleidungMarke, setHerrenbekleidungMarke] = useState('');
  const [herrenbekleidungSize, setHerrenbekleidungSize] = useState('');
  const [herrenbekleidungArt, setHerrenbekleidungArt] = useState('');

  const [selectedKinderzimmermobelArt, setSelectedKinderzimmermobelArt] = useState('');
  const [selectedSpielzeugArt, setSelectedSpielzeugArt] = useState('');
  const [selectedFischeArt, setSelectedFischeArt] = useState('');
  const [selectedHundeArt, setSelectedHundeArt] = useState('');
  const [selectedHundeAlter, setSelectedHundeAlter] = useState('');
  const [selectedHundeGeimpft, setSelectedHundeGeimpft] = useState('');
  const [selectedHundeErlaubnis, setSelectedHundeErlaubnis] = useState('');
  const [selectedKatzenArt, setSelectedKatzenArt] = useState('');
  const [selectedKatzenAlter, setSelectedKatzenAlter] = useState('');
  const [selectedKatzenGeimpft, setSelectedKatzenGeimpft] = useState('');
  const [selectedKatzenErlaubnis, setSelectedKatzenErlaubnis] = useState('');
  const [selectedKleintiereArt, setSelectedKleintiereArt] = useState('');
  const [selectedNutztiereArt, setSelectedNutztiereArt] = useState('');
  const [selectedPferdeArt, setSelectedPferdeArt] = useState('');
  const [selectedVermisstetiereStatus, setSelectedVermisstetiereStatus] = useState('');
  const [selectedHaustierZubehoerArt, setSelectedHaustierZubehoerArt] = useState('');
  const [selectedVoegelArt, setSelectedVoegelArt] = useState('');
  const [selectedBeautyGesundheitArt, setSelectedBeautyGesundheitArt] = useState('');

  // Bau, Handwerk & Produktion-specific state
  const [selectedBauHandwerkProduktionArt, setSelectedBauHandwerkProduktionArt] = useState('');

  const [selectedBueroArbeitVerwaltungArt, setSelectedBueroArbeitVerwaltungArt] = useState('');


  const [selectedGastronomieTourismusArt, setSelectedGastronomieTourismusArt] = useState('');
  const [selectedSozialerSektorPflegeArt, setSelectedSozialerSektorPflegeArt] = useState('');
  const [selectedTransportLogistikVerkehrArt, setSelectedTransportLogistikVerkehrArt] = useState('');
  const [selectedVertriebEinkaufVerkaufArt, setSelectedVertriebEinkaufVerkaufArt] = useState('');
  const [selectedWeitereJobsArt, setSelectedWeitereJobsArt] = useState('');
  const [selectedAudioHifiArt, setSelectedAudioHifiArt] = useState('');
  const [selectedHandyTelefonArt, setSelectedHandyTelefonArt] = useState('');
  const [selectedFotoArt, setSelectedFotoArt] = useState('');
  const [selectedHaushaltsgeraeteArt, setSelectedHaushaltsgeraeteArt] = useState('');
  const [selectedKonsolenArt, setSelectedKonsolenArt] = useState('');
  const [selectedPCZubehoerSoftwareArt, setSelectedPCZubehoerSoftwareArt] = useState('');
  const [selectedTabletsReaderArt, setSelectedTabletsReaderArt] = useState('');
  const [selectedTVVideoArt, setSelectedTVVideoArt] = useState('');
  const [selectedNotebooksArt, setSelectedNotebooksArt] = useState('');
  const [selectedPCsArt, setSelectedPCsArt] = useState('');
  const [selectedVideospieleArt, setSelectedVideospieleArt] = useState('');
  const [selectedWeitereElektronikArt, setSelectedWeitereElektronikArt] = useState('');
  const [selectedDienstleistungenElektronikArt, setSelectedDienstleistungenElektronikArt] = useState('');

  const [selectedTaschenAccessoiresArt, setSelectedTaschenAccessoiresArt] = useState('');
  const [selectedUhrenSchmuckArt, setSelectedUhrenSchmuckArt] = useState('');
  const [selectedAltenpflegeArt, setSelectedAltenpflegeArt] = useState('');
  const [selectedSprachkurseArt, setSelectedSprachkurseArt] = useState('');
  const [selectedKunstGestaltungArt, setSelectedKunstGestaltungArt] = useState('');
  const [selectedWeiteresHausGartenArt, setSelectedWeiteresHausGartenArt] = useState('');

  // Auf Zeit & WG states
  const [selectedAufZeitWGArt, setSelectedAufZeitWGArt] = useState('');
  const [selectedRentalType, setSelectedRentalType] = useState('');
  const [selectedOnlineViewing, setSelectedOnlineViewing] = useState('');
  const [livingSpace, setLivingSpace] = useState('');
  const [rooms, setRooms] = useState('');
  const [roommates, setRoommates] = useState('');
  const [availableFrom, setAvailableFrom] = useState('');
  const [warmRent, setWarmRent] = useState('');
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [selectedGeneralFeatures, setSelectedGeneralFeatures] = useState([]);

  // New Immobilien States
  const [selectedWohnungstyp, setSelectedWohnungstyp] = useState('');
  const [selectedHaustyp, setSelectedHaustyp] = useState('');
  const [selectedGrundstuecksart, setSelectedGrundstuecksart] = useState('');
  const [selectedObjektart, setSelectedObjektart] = useState('');
  const [selectedGarageType, setSelectedGarageType] = useState('');
  const [floor, setFloor] = useState('');
  const [constructionYear, setConstructionYear] = useState('');
  const [plotArea, setPlotArea] = useState('');
  const [selectedCommission, setSelectedCommission] = useState('');
  const [selectedLage, setSelectedLage] = useState('');
  const [pricePerSqm, setPricePerSqm] = useState('');
  const [selectedApartmentFeatures, setSelectedApartmentFeatures] = useState([]);
  const [selectedHouseFeatures, setSelectedHouseFeatures] = useState([]);
  const [selectedAngebotsart, setSelectedAngebotsart] = useState('');
  const [selectedTauschangebot, setSelectedTauschangebot] = useState('');

  // Common Vehicle States (Motorrad, Auto, etc.)
  const [marke, setMarke] = useState('');
  const [selectedSportCampingArt, setSelectedSportCampingArt] = useState('');
  const [kilometerstand, setKilometerstand] = useState('');
  const [erstzulassung, setErstzulassung] = useState('');
  const [hubraum, setHubraum] = useState('');
  const [getriebe, setGetriebe] = useState('');
  const [leistung, setLeistung] = useState('');
  const [kraftstoff, setKraftstoff] = useState('');

  // Load categories from Supabase
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const { fetchCategories } = await import('./api/categories');
        const data = await fetchCategories();
        console.log('Categories loaded for AddListing:', data);

        // Patch Haus & Garten subcategories if missing
        const hausGartenSubcategories = [
          { name: 'Badezimmer' },
          { name: 'Büro' },
          { name: 'Dekoration' },
          { name: 'Dienstleistungen Haus & Garten' },
          { name: 'Gartenzubehör & Pflanzen' },
          { name: 'Heimtextilien' },
          { name: 'Heimwerken' },
          { name: 'Küche & Esszimmer' },
          { name: 'Lampen & Licht' },
          { name: 'Schlafzimmer' },
          { name: 'Wohnzimmer' },
          { name: 'Weiteres Haus & Garten' },
        ];

        const updatedData = data ? data.map(cat => {
          if (cat.name === 'Ev & Bahçe' || cat.name === 'Haus & Garten') {
            const subs = [
              'Badezimmer', 'Büro', 'Dekoration', 'Dienstleistungen Haus & Garten',
              'Gartenzubehör & Pflanzen', 'Heimtextilien', 'Heimwerken', 'Küche & Esszimmer',
              'Lampen & Licht', 'Schlafzimmer', 'Wohnzimmer', 'Weiteres Haus & Garten'
            ];
            return {
              ...cat,
              name: getCategoryTranslation('Haus & Garten'),
              subcategories: subs.map(s => ({ name: getCategoryTranslation(s) })).sort((a, b) => a.name.localeCompare(b.name))
            };
          }

          if (cat.name === 'Ücretsiz & Takas' || cat.name === 'Zu verschenken & Tauschen') {
            const subs = ['Tauschen', 'Verleihen', 'Verschenken'];
            return {
              ...cat,
              name: getCategoryTranslation('Zu verschenken & Tauschen'),
              subcategories: subs.map(s => ({ name: getCategoryTranslation(s) })).sort((a, b) => a.name.localeCompare(b.name))
            };
          }

          if (cat.name === 'Hizmetler' || cat.name === 'Dienstleistungen') {
            const subs = [
              'Altenpflege', 'Auto, Rad & Boot', 'Babysitter/-in & Kinderbetreuung',
              'Dienstleistungen Elektronik', 'Dienstleistungen Haus & Garten',
              'Künstler/-in & Musiker/-in', 'Reise & Eventservices',
              'Tierbetreuung & Training', 'Umzug & Transport', 'Weitere Dienstleistungen'
            ];
            return {
              ...cat,
              name: getCategoryTranslation('Dienstleistungen'),
              subcategories: subs.map(s => ({ name: getCategoryTranslation(s) })).sort((a, b) => a.name.localeCompare(b.name))
            };
          }

          if (cat.name === 'Elektronik') {
            const subs = [
              'Audio & Hifi', 'Dienstleistungen Elektronik', 'Foto', 'Handy & Telefon',
              'Haushaltsgeräte', 'Konsolen', 'Notebooks', 'PCs', 'PC-Zubehör & Software',
              'Tablets & Reader', 'TV & Video', 'Videospiele', 'Weitere Elektronik'
            ];
            return {
              ...cat,
              name: getCategoryTranslation('Elektronik'),
              subcategories: subs.map(s => ({ name: getCategoryTranslation(s) })).sort((a, b) => a.name.localeCompare(b.name))
            };
          }

          if (cat.name === 'Müzik, Film & Kitap' || cat.name === 'Musik, Filme & Bücher') {
            const subs = [
              'Bücher & Zeitschriften', 'Büro & Schreibwaren', 'Comics',
              'Fachbücher, Schule & Studium', 'Film & DVD', 'Musik & CDs',
              'Musikinstrumente', 'Weitere Musik, Filme & Bücher'
            ];
            return {
              ...cat,
              name: getCategoryTranslation('Musik, Filme & Bücher'),
              subcategories: subs.map(s => ({ name: getCategoryTranslation(s) })).sort((a, b) => a.name.localeCompare(b.name))
            };
          }

          if (cat.name === 'İş İlanları' || cat.name === 'Jobs') {
            const subs = [
              'Ausbildung', 'Bau, Handwerk & Produktion', 'Büroarbeit & Verwaltung',
              'Gastronomie & Tourismus', 'Kundenservice & Call Center',
              'Mini- & Nebenjobs', 'Praktika', 'Sozialer Sektor & Pflege',
              'Transport, Lojistik & Verkehr', 'Vertrieb, Einkauf & Verkauf', 'Weitere Jobs'
            ];
            return {
              ...cat,
              name: getCategoryTranslation('Jobs'),
              subcategories: subs.map(s => ({ name: getCategoryTranslation(s) })).sort((a, b) => a.name.localeCompare(b.name))
            };
          }

          if (cat.name === 'Eğlence, Hobi & Mahalle' || cat.name === 'Freizeit, Hobby & Nachbarschaft') {
            const subs = [
              'Esoterik & Spirituelles', 'Essen & Trinken', 'Freizeitaktivitäten',
              'Handarbeit, Basteln & Kunsthandwerk', 'Kunst & Antiquitäten',
              'Künstler/-in & Musiker/-in', 'Modellbau', 'Reise & Eventservices',
              'Sammeln', 'Sport & Camping', 'Trödel', 'Verloren & Gefunden',
              'Weiteres Freizeit, Hobby & Nachbarschaft'
            ];
            return {
              ...cat,
              name: getCategoryTranslation('Freizeit, Hobby & Nachbarschaft'),
              subcategories: subs.map(s => ({ name: getCategoryTranslation(s) })).sort((a, b) => a.name.localeCompare(b.name))
            };
          }

          if (cat.name === 'Emlak' || cat.name === 'Immobilien') {
            const subs = [
              'Auf Zeit & WG', 'Container', 'Eigentumswohnungen', 'Ferien- & Auslandsimmobilien',
              'Garagen & Stellplätze', 'Gewerbeimmobilien', 'Grundstücke & Gärten',
              'Häuser zum Kauf', 'Häuser zur Miete', 'Mietwohnungen', 'Neubauprojekte',
              'Umzug & Transport', 'Weitere Immobilien'
            ];
            return {
              ...cat,
              name: getCategoryTranslation('Immobilien'),
              subcategories: subs.map(s => ({ name: getCategoryTranslation(s) })).sort((a, b) => a.name.localeCompare(b.name))
            };
          }

          if (cat.name === 'Aile, Çocuk & Bebek' || cat.name === 'Familie, Kind & Baby') {
            const subs = [
              'Altenpflege', 'Baby- & Kinderkleidung', 'Baby- & Kinderschuhe',
              'Baby-Ausstattung', 'Babyschalen & Kindersitze', 'Babysitter/-in & Kinderbetreuung',
              'Kinderwagen & Buggys', 'Kinderzimmermöbel', 'Spielzeug',
              'Weiteres Familie, Kind & Baby'
            ];
            return {
              ...cat,
              name: getCategoryTranslation('Familie, Kind & Baby'),
              subcategories: subs.map(s => ({ name: getCategoryTranslation(s) })).sort((a, b) => a.name.localeCompare(b.name))
            };
          }

          if (cat.name === 'Evcil Hayvanlar' || cat.name === 'Haustiere') {
            const subs = [
              'Fische', 'Hunde', 'Katzen', 'Kleintiere', 'Nutztiere', 'Pferde',
              'Tierbetreuung & Training', 'Vermisste Tiere', 'Vögel', 'Zubehör'
            ];
            return {
              ...cat,
              name: getCategoryTranslation('Haustiere'),
              subcategories: subs.map(s => ({ name: getCategoryTranslation(s) })).sort((a, b) => a.name.localeCompare(b.name))
            };
          }

          if (cat.name === 'Moda & Güzellik' || cat.name === 'Mode & Beauty') {
            const subs = [
              'Beauty & Gesundheit', 'Damenbekleidung', 'Damenschuhe', 'Herrenbekleidung',
              'Herrenschuhe', 'Taschen & Accessoires', 'Uhren & Schmuck', 'Weiteres Mode & Beauty'
            ];
            return {
              ...cat,
              name: getCategoryTranslation('Mode & Beauty'),
              subcategories: subs.map(s => ({ name: getCategoryTranslation(s) })).sort((a, b) => a.name.localeCompare(b.name))
            };
          }

          if (cat.name === 'Otomobil, Bisiklet & Tekne' || cat.name === 'Auto, Rad & Boot') {
            const subs = [
              'Autos', 'Autoteile & Reifen', 'Boote & Bootszubehör', 'Fahrräder & Zubehör',
              'Motorräder & Motorroller', 'Motorradteile & Zubehör', 'Nutzfahrzeuge & Anhänger',
              'Reparaturen & Dienstleistungen', 'Wohnwagen & Wohnmobile', 'Weiteres Auto, Rad & Boot'
            ];
            return {
              ...cat,
              name: getCategoryTranslation('Auto, Rad & Boot'),
              subcategories: subs.map(s => ({ name: getCategoryTranslation(s) })).sort((a, b) => a.name.localeCompare(b.name))
            };
          }

          return cat;
        }) : [];

        // Ensure manual categories exist in the list
        if (!updatedData.find(cat => cat.name === getCategoryTranslation('Nachbarschaftshilfe'))) {
          updatedData.push({
            id: 'nh-manual',
            name: getCategoryTranslation('Nachbarschaftshilfe'),
            subcategories: [{ name: getCategoryTranslation('Nachbarschaftshilfe') }]
          });
        }

        if (!updatedData.find(cat => cat.name === getCategoryTranslation('Unterricht & Kurse'))) {
          const subs = [
            'Computerkurse', 'Kochen & Backen', 'Kunst & Gestaltung', 'Musik & Gesang',
            'Nachhilfe', 'Sportkurse', 'Sprachkurse', 'Tanzkurse', 'Weiterbildung', 'Weitere Unterricht & Kurse'
          ];
          updatedData.push({
            id: 'uk-manual',
            name: getCategoryTranslation('Unterricht & Kurse'),
            subcategories: subs.map(s => ({ name: getCategoryTranslation(s) })).sort((a, b) => a.name.localeCompare(b.name))
          });
        }

        if (!updatedData.find(cat => cat.name === getCategoryTranslation('Eintrittskarten & Tickets'))) {
          const subs = [
            'Bahn & ÖPNV', 'Comedy & Kabarett', 'Gutscheine', 'Kinder', 'Konzerte',
            'Sport', 'Theater & Musical', 'Weitere Eintrittskarten & Tickets'
          ];
          updatedData.push({
            id: 'et-manual',
            name: getCategoryTranslation('Eintrittskarten & Tickets'),
            subcategories: subs.map(s => ({ name: getCategoryTranslation(s) })).sort((a, b) => a.name.localeCompare(b.name))
          });
        }

        setCategories(updatedData);
      } catch (error) {
        console.error('Error loading categories:', error);
      }
    };

    loadCategories();
  }, []);

  // Check for account type and load profile data - Mandatory before listing
  useEffect(() => {
    const checkAccountType = async () => {
      if (!user) return;
      try {
        const { fetchUserProfile } = await import('./api/profile');
        const profile = await fetchUserProfile(user.id);

        // If seller_type is missing, redirect to settings
        if (!profile?.seller_type) {
          alert(t.addListing.selectAccountType);
          navigate('/settings');
          return;
        }

        // Auto-fill form fields with user's profile data
        if (profile.full_name) {
          setContactName(profile.full_name);
        }
        if (profile.phone) {
          setPhoneNumber(profile.phone);
        }
        if (profile.city && !city) {
          setCity(profile.city);
        }
        // Postal code removed from UI requirements
        /* if (profile.postal_code && !postalCode) {
          setPostalCode(profile.postal_code);
        } */
        if (profile.street && !address) {
          setAddress(profile.street);
        }

        // Auto-fill legal info from profile if available
        if (profile.legal_info) {
          setLegalInfo(profile.legal_info);
        }

        // Set seller type
        if (profile.seller_type) {
          setSellerType(profile.seller_type);
        }
      } catch (error) {
        console.error('Error checking account type:', error);
      }
    };

    checkAccountType();
  }, [user, navigate]);

  // Update subcategories when category changes
  useEffect(() => {
    if (category && categories.length > 0) {
      const selectedCat = categories.find(cat => cat.name === category);
      if (selectedCat) {
        setAvailableSubcategories(selectedCat.subcategories || []);
      } else {
        setAvailableSubcategories([]);
      }
    } else {
      setAvailableSubcategories([]);
    }
  }, [category, categories]);

  // Load listing data if in edit mode
  useEffect(() => {
    const loadListingForEdit = async () => {
      if (!editId) return;

      setLoading(true);
      setIsEditMode(true);

      try {
        const { supabase } = await import('./lib/supabase');
        const { data, error } = await supabase
          .from('listings')
          .select('*')
          .eq('id', editId)
          .single();

        if (error) throw error;

        if (data) {
          console.log('📝 Loaded listing data for edit:', data);
          console.log('Versand field:', data.versand_art, data.versand, data.shipping);

          // Populate form fields with existing data
          setTitle(data.title || '');
          setCategory(data.category || '');
          setSubCategory(data.sub_category || '');
          setCondition(data.condition || 'used');
          setPrice(data.price_type === 'giveaway' ? t.addListing.options.givingAway : (data.price?.toString() || ''));
          setPriceType(data.price_type || 'fixed');
          setDescription(data.description || '');
          // Postal code fallback or ignore
          setCity(data.city || '');
          setDistrict(data.district || '');
          setRegion(data.region || '');
          setAddress(data.address || '');

          // Use specific contact fields if they exist in the listing
          if (data.contact_name) setContactName(data.contact_name);
          if (data.contact_phone) setPhoneNumber(data.contact_phone);

          // Default visibility to true for legacy listings (where they are null)
          setShowPhoneNumber(data.show_phone_number !== false);
          setShowLocation(data.show_location !== false);

          // Load category-specific fields
          if (data.car_brand) setSelectedCarBrand(data.car_brand);
          if (data.car_model) setSelectedCarModel(data.car_model);
          if (data.bike_type) setSelectedBikeType(data.bike_type);
          if (data.bike_art) setSelectedBikeArt(data.bike_art);
          if (data.autoteile_art) setSelectedAutoteileArt(data.autoteile_art);
          if (data.autoteile_angebotstyp) setSelectedAutoteileAngebotstyp(data.autoteile_angebotstyp);
          // Load versand_art only if it exists (no default value to prevent accidental overwrites)
          if (data.versand_art) setSelectedVersand(data.versand_art);
          if (data.boote_art) setSelectedBooteArt(data.boote_art);
          if (data.motorrad_art) setSelectedMotorradArt(data.motorrad_art);
          if (data.motorradteile_art) setSelectedMotorradteileArt(data.motorradteile_art);
          if (data.nutzfahrzeuge_art) setSelectedNutzfahrzeugeArt(data.nutzfahrzeuge_art);
          if (data.wohnwagen_art) setSelectedWohnwagenArt(data.wohnwagen_art);
          if (data.gartenzubehoer_art) setSelectedGartenzubehoerArt(data.gartenzubehoer_art);
          if (data.gartenzubehoer_art) setSelectedGartenzubehoerArt(data.gartenzubehoer_art);
          if (data.dienstleistungen_haus_garten_art) setSelectedDienstleistungenHausGartenArt(data.dienstleistungen_haus_garten_art);
          if (data.dekoration_art) setSelectedDekorationArt(data.dekoration_art);
          if (data.buecher_zeitschriften_art) setSelectedBuecherZeitschriftenArt(data.buecher_zeitschriften_art);
          if (data.sammeln_art) setSelectedSammelnArt(data.sammeln_art);
          if (data.sport_camping_art) setSelectedSportCampingArt(data.sport_camping_art);
          if (data.modellbau_art) setSelectedModellbauArt(data.modellbau_art);
          if (data.handarbeit_art) setSelectedHandarbeitArt(data.handarbeit_art);
          if (data.kuenstler_musiker_art) setSelectedKuenstlerMusikerArt(data.kuenstler_musiker_art);
          if (data.reise_eventservices_art) setSelectedReiseEventservicesArt(data.reise_eventservices_art);
          if (data.tierbetreuung_training_art) setSelectedTierbetreuungTrainingArt(data.tierbetreuung_training_art);
          if (data.bau_handwerk_produktion_art) setSelectedBauHandwerkProduktionArt(data.bau_handwerk_produktion_art);
          if (data.buero_arbeit_verwaltung_art) setSelectedBueroArbeitVerwaltungArt(data.buero_arbeit_verwaltung_art);
          if (data.gastronomie_tourismus_art) setSelectedGastronomieTourismusArt(data.gastronomie_tourismus_art);
          if (data.sozialer_sektor_pflege_art) setSelectedSozialerSektorPflegeArt(data.sozialer_sektor_pflege_art);
          if (data.transport_logistik_verkehr_art) setSelectedTransportLogistikVerkehrArt(data.transport_logistik_verkehr_art);
          if (data.vertrieb_einkauf_verkauf_art) setSelectedVertriebEinkaufVerkaufArt(data.vertrieb_einkauf_verkauf_art);
          if (data.weitere_jobs_art) setSelectedWeitereJobsArt(data.weitere_jobs_art);
          if (data.taschen_accessoires_art) setSelectedTaschenAccessoiresArt(data.taschen_accessoires_art);
          if (data.uhren_schmuck_art) setSelectedUhrenSchmuckArt(data.uhren_schmuck_art);
          if (data.altenpflege_art) setSelectedAltenpflegeArt(data.altenpflege_art);
          if (data.sprachkurse_art) setSelectedSprachkurseArt(data.sprachkurse_art);
          if (data.kunst_gestaltung_art) setSelectedKunstGestaltungArt(data.kunst_gestaltung_art);
          if (data.weiteres_haus_garten_art) setSelectedWeiteresHausGartenArt(data.weiteres_haus_garten_art);
          if (data.beauty_gesundheit_art) setSelectedBeautyGesundheitArt(data.beauty_gesundheit_art);
          if (data.audio_hifi_art) setSelectedAudioHifiArt(data.audio_hifi_art);
          if (data.handy_telefon_art) setSelectedHandyTelefonArt(data.handy_telefon_art);
          if (data.foto_art) setSelectedFotoArt(data.foto_art);
          if (data.haushaltsgeraete_art) setSelectedHaushaltsgeraeteArt(data.haushaltsgeraete_art);
          if (data.konsolen_art) setSelectedKonsolenArt(data.konsolen_art);
          if (data.pc_zubehoer_software_art) setSelectedPCZubehoerSoftwareArt(data.pc_zubehoer_software_art);
          if (data.tablets_reader_art) setSelectedTabletsReaderArt(data.tablets_reader_art);
          if (data.tv_video_art) setSelectedTVVideoArt(data.tv_video_art);
          if (data.notebooks_art) setSelectedNotebooksArt(data.notebooks_art);
          if (data.pcs_art) setSelectedPCsArt(data.pcs_art);
          if (data.videospiele_art) setSelectedVideospieleArt(data.videospiele_art);
          if (data.weitere_elektronik_art) setSelectedWeitereElektronikArt(data.weitere_elektronik_art);
          if (data.dienstleistungen_elektronik_art) setSelectedDienstleistungenElektronikArt(data.dienstleistungen_elektronik_art);


          // Load Baby & Kinderkleidung fields
          if (data.baby_kinderkleidung_art) setBabyKinderkleidungArt(data.baby_kinderkleidung_art);
          if (data.baby_kinderkleidung_size) setBabyKinderkleidungSize(data.baby_kinderkleidung_size);
          if (data.baby_kinderkleidung_gender) setBabyKinderkleidungGender(data.baby_kinderkleidung_gender);
          if (data.baby_kinderkleidung_color) setBabyKinderkleidungColor(data.baby_kinderkleidung_color);
          if (data.baby_kinderschuhe_art) setBabyKinderschuheArt(data.baby_kinderschuhe_art);
          if (data.baby_kinderschuhe_size) setBabyKinderschuheSize(data.baby_kinderschuhe_size);

          // Load Damenbekleidung fields
          if (data.damenbekleidung_art) setDamenbekleidungArt(data.damenbekleidung_art);
          if (data.damenbekleidung_size) setDamenbekleidungSize(data.damenbekleidung_size);
          if (data.damenbekleidung_color) setDamenbekleidungColor(data.damenbekleidung_color);
          if (data.damenbekleidung_marke) setDamenbekleidungMarke(data.damenbekleidung_marke);

          // Load Damenschuhe fields
          if (data.damenschuhe_art) setDamenschuheArt(data.damenschuhe_art);
          if (data.damenschuhe_size) setDamenschuheSize(data.damenschuhe_size);
          if (data.damenschuhe_color) setDamenschuheColor(data.damenschuhe_color);
          if (data.damenschuhe_marke) setDamenschuheMarke(data.damenschuhe_marke);

          // Load Herrenbekleidung fields
          if (data.herrenbekleidung_art) setHerrenbekleidungArt(data.herrenbekleidung_art);
          if (data.herrenbekleidung_size) setHerrenbekleidungSize(data.herrenbekleidung_size);
          if (data.herrenbekleidung_color) setHerrenbekleidungColor(data.herrenbekleidung_color);
          if (data.herrenbekleidung_marke) setHerrenbekleidungMarke(data.herrenbekleidung_marke);

          // Load Herrenschuhe fields
          // Load Herrenschuhe fields
          if (data.herrenschuhe_art) setSelectedHerrenschuheArt(data.herrenschuhe_art);
          if (data.herrenschuhe_size) setSelectedHerrenschuheSize(data.herrenschuhe_size);
          if (data.herrenschuhe_color) setSelectedHerrenschuheColor(data.herrenschuhe_color);
          if (data.herrenschuhe_marke) setSelectedHerrenschuheMarke(data.herrenschuhe_marke);

          // Load Jobs fields
          if (data.working_time) setWorkingTime(data.working_time);
          if (data.hourly_wage) setHourlyWage(data.hourly_wage);
          if (data.job_type) setJobType(data.job_type);

          // Load common vehicle fields
          if (data.marke) setMarke(data.marke);
          if (data.kilometerstand) setKilometerstand(data.kilometerstand);
          if (data.erstzulassung) setErstzulassung(data.erstzulassung);
          if (data.hubraum) setHubraum(data.hubraum);
          if (data.getriebe) setGetriebe(data.getriebe);
          if (data.leistung) setLeistung(data.leistung);
          if (data.kraftstoff) setKraftstoff(data.kraftstoff);

          // Load Immobilien & Auf Zeit & WG fields
          if (data.auf_zeit_wg_art) setSelectedAufZeitWGArt(data.auf_zeit_wg_art);
          if (data.rental_type) setSelectedRentalType(data.rental_type);
          if (data.living_space) setLivingSpace(data.living_space.toString());
          if (data.rooms) setRooms(data.rooms.toString());
          if (data.roommates) setRoommates(data.roommates.toString());
          if (data.available_from) setAvailableFrom(data.available_from);
          if (data.online_viewing) setSelectedOnlineViewing(data.online_viewing);
          if (data.warm_rent) setWarmRent(data.warm_rent.toString());
          if (data.amenities) setSelectedAmenities(Array.isArray(data.amenities) ? data.amenities : []);
          if (data.general_features) setSelectedGeneralFeatures(Array.isArray(data.general_features) ? data.general_features : []);
          if (data.wohnungstyp) setSelectedWohnungstyp(data.wohnungstyp);
          if (data.haustyp) setSelectedHaustyp(data.haustyp);
          if (data.grundstuecksart) setSelectedGrundstuecksart(data.grundstuecksart);
          if (data.objektart) setSelectedObjektart(data.objektart);
          if (data.garage_type) setSelectedGarageType(data.garage_type);
          if (data.floor) setFloor(data.floor.toString());
          if (data.construction_year) setConstructionYear(data.construction_year.toString());
          if (data.plot_area) setPlotArea(data.plot_area.toString());
          if (data.commission) setSelectedCommission(data.commission);
          if (data.lage) setSelectedLage(data.lage);
          if (data.price_per_sqm) setPricePerSqm(data.price_per_sqm.toString());
          if (data.apartment_features) setSelectedApartmentFeatures(Array.isArray(data.apartment_features) ? data.apartment_features : []);
          if (data.house_features) setSelectedHouseFeatures(Array.isArray(data.house_features) ? data.house_features : []);
          if (data.angebotsart) setSelectedAngebotsart(data.angebotsart);
          if (data.tauschangebot) setSelectedTauschangebot(data.tauschangebot);

          // Load images if available
          if (data.images && data.images.length > 0) {
            setImageFiles(data.images);
          }
        }
      } catch (error) {
        console.error('Error loading listing:', error);
        alert(t.addListing.errorLoading);
      } finally {
        setLoading(false);
      }
    };

    loadListingForEdit();
  }, [editId]);

  // Removed postal code change handler and federalState logic since postalCode is removed


  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if user is logged in
    if (!user) {
      alert(t.addListing.pleaseLogin);
      navigate('/login');
      return;
    }

    // Check listing limits before proceeding
    if (!limitState.canAdd && !isEditMode) {
      setShowLimitModal(true);
      return;
    }

    console.log('=== FORM SUBMITTED ===');
    console.log('User ID:', user.id);
    console.log('Title:', title);
    console.log('Category:', category);
    console.log('SubCategory:', subCategory);
    console.log('Price:', price);
    console.log('City:', city);
    console.log('District:', district);
    console.log('Region:', region);
    console.log('Image Files:', imageFiles.length);

    // Save location data to localStorage
    // localStorage.setItem('savedPostalCode', postalCode); // Removed
    localStorage.setItem('savedCity', city);
    localStorage.setItem('savedDistrict', district);
    localStorage.setItem('savedRegion', region);
    localStorage.setItem('savedAddress', address);
    localStorage.setItem('savedShowLocation', showLocation.toString());

    try {
      // Upload images first if any
      let imageUrls = [];

      if (imageFiles && imageFiles.length > 0) {
        // Separate existing URLs from new files
        const existingUrls = imageFiles.filter(img => typeof img === 'string');
        const newFiles = imageFiles.filter(img => typeof img !== 'string');

        console.log(`Existing images: ${existingUrls.length}, New files: ${newFiles.length}`);

        // Keep existing URLs
        imageUrls = [...existingUrls];

        // Put NEW images FIRST, then existing images
        if (newFiles.length > 0) {
          console.log(`Uploading ${newFiles.length} new images...`);
          const { uploadListingImages } = await import('./api/storage');
          const newUrls = await uploadListingImages(newFiles, user.id);
          console.log('New images uploaded successfully:', newUrls);
          imageUrls = [...newUrls, ...imageUrls]; // New images FIRST
        }

        if (imageUrls.length === 0) {
          alert(t.addListing.imageUploadWarning);
        }
      }

      // Prepare listing data for Supabase
      const listingData = {
        user_id: user.id,
        title: title.trim(),
        description: description.trim(),
        price: priceType === 'giveaway' ? 0 : (priceType === 'negotiable' && !price ? null : (parseFloat(price.toString().replace(',', '.')) || 0)),
        price_type: priceType,
        category: category.trim(),
        sub_category: subCategory ? subCategory.trim() : null,
        condition: hideConditionAndShipping ? null : condition,
        city: city.trim(),
        district: district ? district.trim() : null,
        address: address ? address.trim() : null,
        region: region ? region.trim() : null,
        federal_state: city.trim(), // Auto-set to city value for filter compatibility
        show_location: showLocation,
        show_phone_number: showPhoneNumber,
        contact_name: contactName ? contactName.trim() : null,
        contact_phone: phoneNumber ? phoneNumber.trim() : null,
        images: imageUrls, // Add uploaded image URLs
        status: 'active',
        // Add category-specific fields
        versand_art: hideConditionAndShipping ? null : (selectedVersand || null),
        car_brand: selectedCarBrand || null,
        car_model: selectedCarModel || null,
        bike_type: selectedBikeType || null,
        bike_art: selectedBikeArt || null,
        autoteile_art: selectedAutoteileArt || null,
        autoteile_angebotstyp: selectedAutoteileAngebotstyp || null,
        // Common offer_type field
        offer_type: offerType || null,
        boote_art: selectedBooteArt || null,
        motorrad_art: selectedMotorradArt || null,
        motorradteile_art: selectedMotorradteileArt || null,
        nutzfahrzeuge_art: selectedNutzfahrzeugeArt || null,
        wohnwagen_art: selectedWohnwagenArt || null,
        wohnzimmer_art: selectedWohnzimmerArt || null,
        schlafzimmer_art: selectedSchlafzimmerArt || null,
        kueche_esszimmer_art: selectedKuecheEsszimmerArt || null,
        gartenzubehoer_art: selectedGartenzubehoerArt || null,
        lamba_aydinlatma_art: selectedLambaAydinlatmaArt || null,
        dekoration_art: selectedDekorationArt || null,
        dienstleistungen_haus_garten_art: selectedDienstleistungenHausGartenArt || null,
        buecher_zeitschriften_art: selectedBuecherZeitschriftenArt || null,
        sammeln_art: selectedSammelnArt || null,
        audio_hifi_art: selectedElektronikAudioHifiArt || null,
        sport_camping_art: selectedSportCampingArt || null,
        modellbau_art: selectedModellbauArt || null,
        handarbeit_art: selectedHandarbeitArt || null,
        kuenstler_musiker_art: selectedKuenstlerMusikerArt || null,
        reise_eventservices_art: selectedReiseEventservicesArt || null,
        tierbetreuung_training_art: selectedTierbetreuungTrainingArt || null,
        bau_handwerk_produktion_art: selectedBauHandwerkProduktionArt || null,
        buero_arbeit_verwaltung_art: selectedBueroArbeitVerwaltungArt || null,
        gastronomie_tourismus_art: selectedGastronomieTourismusArt || null,
        sozialer_sektor_pflege_art: selectedSozialerSektorPflegeArt || null,
        transport_logistik_verkehr_art: selectedTransportLogistikVerkehrArt || null,
        vertrieb_einkauf_verkauf_art: selectedVertriebEinkaufVerkaufArt || null,
        weitere_jobs_art: selectedWeitereJobsArt || null,
        altenpflege_art: selectedAltenpflegeArt || null,
        sprachkurse_art: selectedSprachkurseArt || null,
        kunst_gestaltung_art: selectedKunstGestaltungArt || null,
        weiteres_haus_garten_art: selectedWeiteresHausGartenArt || null,
        baby_kinderkleidung_art: babyKinderkleidungArt || null,
        baby_kinderkleidung_size: babyKinderkleidungSize || null,
        baby_kinderkleidung_gender: babyKinderkleidungGender || null,
        baby_kinderkleidung_color: babyKinderkleidungColor || null,
        baby_kinderschuhe_art: babyKinderschuheArt || null,
        baby_kinderschuhe_size: babyKinderschuheSize || null,
        baby_kinderschuhe_color: babyKinderschuheColor || null,
        babyschalen_kindersitze_color: babyschalenKindersitzeColor || null,
        kinderwagen_buggys_color: kinderwagenBuggysColor || null,
        kinderwagen_buggys_art: kinderwagenBuggysArt || null,
        damenbekleidung_art: selectedDamenbekleidungArt || null,
        damenbekleidung_size: selectedDamenbekleidungSize || null,
        damenbekleidung_color: selectedDamenbekleidungColor || null,
        damenbekleidung_marke: selectedDamenbekleidungMarke || null,
        damenschuhe_art: damenschuheArt || null,
        damenschuhe_size: damenschuheSize || null,
        damenschuhe_color: damenschuheColor || null,
        damenschuhe_marke: damenschuheMarke || null,
        herrenbekleidung_art: herrenbekleidungArt || null,
        herrenbekleidung_size: herrenbekleidungSize || null,
        herrenbekleidung_color: herrenbekleidungColor || null,
        herrenbekleidung_marke: herrenbekleidungMarke || null,
        herrenschuhe_art: selectedHerrenschuheArt || null,
        herrenschuhe_size: selectedHerrenschuheSize || null,
        herrenschuhe_color: selectedHerrenschuheColor || null,
        herrenschuhe_marke: selectedHerrenschuheMarke || null,
        kinderzimmermobel_art: selectedKinderzimmermobelArt || null,
        spielzeug_art: selectedSpielzeugArt || null,
        fische_art: selectedFischeArt || null,
        hunde_art: selectedHundeArt || null,
        hunde_alter: selectedHundeAlter || null,
        hunde_geimpft: selectedHundeGeimpft || null,
        hunde_erlaubnis: selectedHundeErlaubnis || null,
        katzen_art: selectedKatzenArt || null,
        katzen_alter: selectedKatzenAlter || null,
        katzen_geimpft: selectedKatzenGeimpft || null,
        katzen_erlaubnis: selectedKatzenErlaubnis || null,
        kleintiere_art: selectedKleintiereArt || null,
        nutztiere_art: selectedNutztiereArt || null,
        pferde_art: selectedPferdeArt || null,
        haustier_zubehoer_art: selectedHaustierZubehoerArt || null,
        voegel_art: selectedVoegelArt || null,
        taschen_accessoires_art: selectedTaschenAccessoiresArt || null,
        uhren_schmuck_art: selectedUhrenSchmuckArt || null,
        beauty_gesundheit_art: selectedBeautyGesundheitArt || null,
        audio_hifi_art: selectedAudioHifiArt || selectedElektronikAudioHifiArt || null,
        handy_telefon_art: selectedHandyTelefonArt || null,
        foto_art: selectedFotoArt || null,
        haushaltsgeraete_art: selectedHaushaltsgeraeteArt || null,
        konsolen_art: selectedKonsolenArt || null,
        pc_zubehoer_software_art: selectedPCZubehoerSoftwareArt || null,
        tablets_reader_art: selectedTabletsReaderArt || null,
        tv_video_art: selectedTVVideoArt || null,
        notebooks_art: selectedNotebooksArt || null,
        pcs_art: selectedPCsArt || null,
        videospiele_art: selectedVideospieleArt || null,
        weitere_elektronik_art: selectedWeitereElektronikArt || null,
        dienstleistungen_elektronik_art: selectedDienstleistungenElektronikArt || null,
        // Auf Zeit & WG and general Immobilien fields
        auf_zeit_wg_art: selectedAufZeitWGArt || null,
        rental_type: selectedRentalType || null,
        living_space: livingSpace ? parseFloat(livingSpace) : null,
        rooms: rooms ? parseFloat(rooms) : null,
        roommates: roommates ? parseInt(roommates) : null,
        available_from: availableFrom || null,
        online_viewing: selectedOnlineViewing || null,
        warm_rent: warmRent ? parseFloat(warmRent) : null,
        amenities: selectedAmenities.length > 0 ? selectedAmenities : null,
        general_features: selectedGeneralFeatures.length > 0 ? selectedGeneralFeatures : null,
        // Extended Immobilien fields
        wohnungstyp: selectedWohnungstyp || null,
        haustyp: selectedHaustyp || null,
        grundstuecksart: selectedGrundstuecksart || null,
        objektart: selectedObjektart || null,
        garage_type: selectedGarageType || null,
        floor: floor ? parseInt(floor) : null,
        construction_year: constructionYear ? parseInt(constructionYear) : null,
        plot_area: plotArea ? parseFloat(plotArea) : null,
        commission: selectedCommission || null,
        lage: selectedLage || null,
        price_per_sqm: pricePerSqm ? parseFloat(pricePerSqm) : null,
        apartment_features: selectedApartmentFeatures.length > 0 ? selectedApartmentFeatures : null,
        house_features: selectedHouseFeatures.length > 0 ? selectedHouseFeatures : null,
        angebotsart: selectedAngebotsart || null,
        tauschangebot: selectedTauschangebot || null,
        // Jobs fields
        working_time: workingTime || null,
        hourly_wage: hourlyWage ? parseFloat(hourlyWage) : null,
        job_type: jobType || null,
        // Common vehicle fields
        marke: selectedCarBrand || marke || null,
        modell: selectedCarModel || null,
        kilometerstand: kilometerstand ? parseInt(kilometerstand.toString().replace(/\D/g, '')) : null,
        erstzulassung: erstzulassung ? parseInt(erstzulassung) : null,
        hubraum: hubraum ? parseInt(hubraum.toString().replace(/\D/g, '')) : null,
        getriebe: getriebe || null,
        // Standardized names with fallbacks
        leistung: leistung ? parseInt(leistung.toString().replace(/\D/g, '')) : null,
        power: leistung ? parseInt(leistung.toString().replace(/\D/g, '')) : null,
        kraftstoff: kraftstoff || null,
        fuel_type: kraftstoff || null,
        fahrzeugtyp: selectedFahrzeugtyp || null,
        vehicle_type: selectedFahrzeugtyp || null,
        door_count: selectedDoorCount || null,
        exterior_color: selectedExteriorColor || null,
        interior_material: selectedInteriorMaterial || null,
        emission_badge: selectedEmissionBadge || null,
        emission_sticker: selectedEmissionBadge || null,
        schadstoffklasse: selectedSchadstoffklasse || null,
        emission_class: selectedSchadstoffklasse || null,
        hu: selectedHU || null,
        unfallfrei: isUnfallfrei,
        scheckheftgepflegt: isScheckheftgepflegt,
        nichtraucher_fahrzeug: isNichtraucher,
        car_amenities: selectedCarAmenities.length > 0 ? selectedCarAmenities : null,
        // Seller info
        seller_type: sellerType || null
      };

      console.log('Creating listing in Supabase:', listingData);
      console.log('📦 Versand value being saved:', selectedVersand);
      console.log('📦 versand_art in listingData:', listingData.versand_art);

      if (isEditMode && editId) {
        // UPDATE existing listing
        console.log('Updating listing with ID:', editId);
        const { supabase } = await import('./lib/supabase');
        const { data, error } = await supabase
          .from('listings')
          .update(listingData)
          .eq('id', editId)
          .select()
          .single();

        if (error) throw error;

        console.log('Listing updated successfully:', data);
        alert(`${t.addListing.updateSuccess}${imageUrls.length > 0 ? ` ${t.addListing.imagesUploaded.replace('{count}', imageUrls.length.toString())}` : ''}`);
      } else {
        // CREATE new listing
        const { createListing } = await import('./api/listings');
        const result = await createListing(listingData);
        console.log('Listing created successfully:', result);
        alert(`${t.addListing.success}${imageUrls.length > 0 ? ` ${t.addListing.imagesUploaded.replace('{count}', imageUrls.length.toString())}` : ''}`);
      }

      // Reset form

      setTitle('');
      setCategory('');
      setSubCategory('');

      // Reset Immobilien fields
      setSelectedAufZeitWGArt('');
      setSelectedRentalType('');
      setLivingSpace('');
      setRooms('');
      setRoommates('');
      setAvailableFrom('');
      setSelectedOnlineViewing('');
      setWarmRent('');
      setSelectedAmenities([]);
      setSelectedGeneralFeatures([]);
      setSelectedWohnungstyp('');
      setSelectedHaustyp('');
      setSelectedGrundstuecksart('');
      setSelectedObjektart('');
      setSelectedGarageType('');
      setFloor('');
      setConstructionYear('');
      setPlotArea('');
      setSelectedCommission('');
      setSelectedLage('');
      setPricePerSqm('');
      setSelectedApartmentFeatures([]);
      setSelectedHouseFeatures([]);
      setSelectedAngebotsart('');
      setSelectedTauschangebot('');
      setCondition('used');
      setPrice('');
      setPriceType('fixed');
      setDescription('');
      setImageFiles([]);
      setSelectedCarBrand('');
      setSelectedCarModel('');
      setSelectedAutoteileArt('');
      setSelectedAutoteileAngebotstyp('');
      setSelectedBikeArt('');
      setSelectedBikeArt('');
      setSelectedBikeType('');
      setSelectedWohnzimmerArt('');
      setSelectedGartenzubehoerArt('');
      setSelectedWohnzimmerArt('');
      setSelectedGartenzubehoerArt('');
      setSelectedDekorationArt('');
      setSelectedDienstleistungenHausGartenArt('');
      setSelectedBuecherZeitschriftenArt('');
      setSelectedSammelnArt('');
      setSelectedModellbauArt('');
      setSelectedHandarbeitArt('');
      setSelectedKuenstlerMusikerArt('');
      setSelectedReiseEventservicesArt('');
      setSelectedTierbetreuungTrainingArt('');
      setSelectedBauHandwerkProduktionArt('');
      setSelectedBueroArbeitVerwaltungArt('');
      setSelectedBueroArbeitVerwaltungArt('');
      setSelectedGastronomieTourismusArt('');
      setSelectedSozialerSektorPflegeArt('');
      setSelectedTransportLogistikVerkehrArt('');
      setSelectedVertriebEinkaufVerkaufArt('');
      setSelectedWeitereJobsArt('');
      setSelectedTaschenAccessoiresArt('');
      setSelectedUhrenSchmuckArt('');
      setSelectedAudioHifiArt('');
      setSelectedHandyTelefonArt('');
      setSelectedFotoArt('');
      setSelectedHaushaltsgeraeteArt('');
      setSelectedKonsolenArt('');
      setSelectedPCZubehoerSoftwareArt('');
      setSelectedTabletsReaderArt('');
      setSelectedTVVideoArt('');
      setSelectedNotebooksArt('');
      setSelectedPCsArt('');
      setSelectedVideospieleArt('');
      setSelectedWeitereElektronikArt('');
      setSelectedDienstleistungenElektronikArt('');
      setSelectedAltenpflegeArt('');
      setSelectedSprachkurseArt('');
      setSelectedKunstGestaltungArt('');
      setSelectedWeiteresHausGartenArt('');
      setBabyKinderkleidungArt('');
      setBabyKinderkleidungSize('');
      setBabyKinderkleidungGender('');
      setBabyKinderkleidungColor('');
      setBabyKinderschuheArt('');
      setBabyKinderschuheSize('');
      setBabyKinderschuheColor('');
      setBabyschalenKindersitzeColor('');
      setKinderwagenBuggysColor('');
      setKinderwagenBuggysArt('');
      setDamenbekleidungColor('');
      setDamenschuheColor('');
      setHerrenbekleidungColor('');
      setSelectedHerrenschuheColor('');
      setSelectedKinderzimmermobelArt('');
      setSelectedSpielzeugArt('');
      setSelectedFischeArt('');
      setSelectedHundeArt('');
      setSelectedHundeAlter('');
      setSelectedHundeGeimpft('');
      setSelectedHundeErlaubnis('');
      setSelectedKatzenArt('');
      setSelectedKatzenAlter('');
      setSelectedKatzenGeimpft('');
      setSelectedKatzenErlaubnis('');
      setSelectedKleintiereArt('');
      setSelectedNutztiereArt('');
      setSelectedPferdeArt('');
      setSelectedVermisstetiereStatus('');
      setSelectedHaustierZubehoerArt('');
      setSelectedBeautyGesundheitArt('');
      setSelectedAudioHifiArt('');
      setSelectedHandyTelefonArt('');
      setSelectedFotoArt('');
      setSelectedHaushaltsgeraeteArt('');
      setSelectedKonsolenArt('');
      setSelectedPCZubehoerSoftwareArt('');
      setSelectedTabletsReaderArt('');
      setSelectedTVVideoArt('');

      setWorkingTime('');
      setHourlyWage('');
      setJobType('');

      // Reset common vehicle fields
      setMarke('');
      setKilometerstand('');
      setErstzulassung('');
      setErstzulassungMonat('');
      setHubraum('');
      setGetriebe('');
      setLeistung('');
      setKraftstoff('');
      setSelectedFahrzeugtyp('');
      setSelectedDoorCount('');
      setSelectedExteriorColor('');
      setSelectedInteriorMaterial('');
      setSelectedEmissionBadge('');
      setSelectedSchadstoffklasse('');
      setSelectedHU('');
      setIsUnfallfrei(false);
      setIsScheckheftgepflegt(false);
      setIsNichtraucher(false);
      setSelectedCarAmenities([]);

      // Redirect to profile page to see the listing
      navigate('/profile?tab=listings');
    } catch (error) {
      console.error('Error submitting listing:', error);
      alert(t.addListing.errorSaving + (error.message ? ': ' + error.message : ''));
    }
  };

  const handleImageSelect = (event) => {
    const newFiles = Array.from(event.target.files || []);
    const currentTotal = imageFiles.length;
    const availableSlots = 20 - currentTotal;

    if (newFiles.length > availableSlots) {
      alert(t.addListing.imageLimitAlert.replace('{available}', availableSlots.toString()));
    }

    // Add new files at the END (keep first image first)
    const filesToAdd = newFiles.slice(0, availableSlots);
    setImageFiles([...imageFiles, ...filesToAdd]);

    // Reset input so same file can be selected again if needed
    event.target.value = '';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-semibold mb-6">{isEditMode ? t.addListing.editTitle : t.addListing.title}</h1>
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm text-gray-600 mb-1">{t.addListing.offerType}</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-gray-700 cursor-pointer">
                  <input
                    type="radio"
                    name="offerType"
                    value="Angebote"
                    checked={offerType === 'Angebote'}
                    onChange={() => setOfferType('Angebote')}
                    className="text-red-600 focus:ring-red-500"
                  />
                  {t.addListing.offering}
                </label>
                <label className="flex items-center gap-2 text-gray-700 cursor-pointer">
                  <input
                    type="radio"
                    name="offerType"
                    value="Gesuche"
                    checked={offerType === 'Gesuche'}
                    onChange={() => setOfferType('Gesuche')}
                    className="text-red-600 focus:ring-red-500"
                  />
                  {t.addListing.searching}
                </label>
              </div>
            </div>


            <div>
              <label className="block text-sm text-gray-600 mb-1">{t.addListing.listingTitle}</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300"
                placeholder={t.addListing.listingTitlePlaceholder}
              />
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              <div>
                <label className="block text-sm text-gray-600 mb-1">{t.addListing.category}</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white text-gray-700"
                >
                  <option value="">{t.addListing.selectCategory}</option>
                  {categories.map((cat) => (
                    <option key={cat.name} value={cat.name}>{getCategoryTranslation(cat.name)}</option>
                  ))}
                </select>
              </div>

              {/* Sub-Category Selection */}
              {category && categories.find(c => c.name === category)?.subcategories && (
                <div>
                  <label className="block text-sm text-gray-600 mb-1">{t.addListing.subcategory}</label>
                  <select
                    value={subCategory}
                    onChange={(e) => {
                      const newSubCategory = e.target.value;
                      setSubCategory(newSubCategory);

                      // Auto-set Art for specific house subcategories
                      if (newSubCategory === 'Satılık Evler') {
                        setSelectedAngebotsart('Kaufen');
                      } else if (newSubCategory === 'Kiralık Evler') {
                        setSelectedAngebotsart('Mieten');
                      } else if (newSubCategory === 'Kiralık Daireler') {
                        setSelectedAngebotsart('Mieten');
                      } else if (newSubCategory === 'Satılık Daireler') {
                        setSelectedAngebotsart('Kaufen');
                      }

                      setSelectedAutoteileArt(''); // Reset Art when subcategory changes
                      setSelectedKuecheEsszimmerArt('');
                      setSelectedGartenzubehoerArt('');
                      setSelectedKuecheEsszimmerArt('');
                      setSelectedKuecheEsszimmerArt('');
                      setSelectedGartenzubehoerArt('');
                      setSelectedGartenzubehoerArt('');
                      setSelectedSammelnArt('');
                      setSelectedModellbauArt('');
                      setSelectedHandarbeitArt('');
                      setSelectedKuenstlerMusikerArt('');
                      setSelectedReiseEventservicesArt('');
                      setSelectedReiseEventservicesArt('');
                      setSelectedTierbetreuungTrainingArt('');
                      setSelectedBauHandwerkProduktionArt('');
                      setSelectedSportCampingArt('');
                      setSelectedDekorationArt('');
                      setSelectedDienstleistungenHausGartenArt('');
                      setSelectedBuecherZeitschriftenArt('');
                      setDamenbekleidungArt('');
                      setDamenbekleidungSize('');
                      setDamenbekleidungColor('');
                      setDamenbekleidungMarke('');
                      setDamenschuheArt('');
                      setDamenschuheSize('');
                      setDamenschuheColor('');
                      setDamenschuheMarke('');
                      setHerrenbekleidungArt('');
                      setHerrenbekleidungSize('');
                      setHerrenbekleidungColor('');
                      setHerrenbekleidungMarke('');
                      setSelectedHerrenschuheArt('');
                      setSelectedHerrenschuheSize('');
                      setSelectedHerrenschuheColor('');
                      setSelectedHerrenschuheMarke('');
                      setSelectedBueroArbeitVerwaltungArt('');
                      setSelectedGastronomieTourismusArt('');
                      setSelectedTransportLogistikVerkehrArt('');
                      setSelectedVertriebEinkaufVerkaufArt('');
                      setSelectedTransportLogistikVerkehrArt('');
                      setSelectedVertriebEinkaufVerkaufArt('');
                      setSelectedWeitereJobsArt('');
                      setSelectedTaschenAccessoiresArt('');
                      setSelectedUhrenSchmuckArt('');
                      setSelectedAltenpflegeArt('');
                      setSelectedSprachkurseArt('');
                      setSelectedKunstGestaltungArt('');
                      setSelectedWeiteresHausGartenArt('');
                      setSelectedBeautyGesundheitArt('');
                      setSelectedAudioHifiArt('');
                      setSelectedHandyTelefonArt('');
                      setSelectedFotoArt('');
                      setSelectedHaushaltsgeraeteArt('');
                      setSelectedKonsolenArt('');
                      setSelectedPCZubehoerSoftwareArt('');
                      setSelectedTabletsReaderArt('');
                      setSelectedTVVideoArt('');

                      setBabyKinderkleidungArt('');
                      setBabyKinderkleidungSize('');
                      setBabyKinderkleidungGender('');
                      setBabyKinderkleidungColor('');
                      setBabyKinderschuheArt('');
                      setBabyKinderschuheSize('');
                      setSelectedAngebotsart('');
                    }}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white text-gray-700"
                  >
                    <option value="">{t.addListing.selectSubcategory}</option>
                    {categories.find(c => c.name === category).subcategories.map((sub) => (
                      <option key={sub.name} value={sub.name}>{getCategoryTranslation(sub.name)}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Bike fields removed - moved to VehicleFields */}




            {/* Family, Child & Baby Specific Fields */}
            {category === 'Aile, Çocuk & Bebek' && (
              <FamilyFields
                subCategory={subCategory}
                t={t}
                babyKinderkleidungArt={babyKinderkleidungArt}
                setBabyKinderkleidungArt={setBabyKinderkleidungArt}
                babyKinderkleidungSize={babyKinderkleidungSize}
                setBabyKinderkleidungSize={setBabyKinderkleidungSize}
                babyKinderkleidungGender={babyKinderkleidungGender}
                setBabyKinderkleidungGender={setBabyKinderkleidungGender}
                babyKinderkleidungColor={babyKinderkleidungColor}
                setBabyKinderkleidungColor={setBabyKinderkleidungColor}
                babyKinderschuheArt={babyKinderschuheArt}
                setBabyKinderschuheArt={setBabyKinderschuheArt}
                babyKinderschuheSize={babyKinderschuheSize}
                setBabyKinderschuheSize={setBabyKinderschuheSize}
                babyKinderschuheColor={babyKinderschuheColor}
                setBabyKinderschuheColor={setBabyKinderschuheColor}
                kinderwagenBuggysArt={kinderwagenBuggysArt}
                setKinderwagenBuggysArt={setKinderwagenBuggysArt}
                kinderwagenBuggysColor={kinderwagenBuggysColor}
                setKinderwagenBuggysColor={setKinderwagenBuggysColor}
                babyschalenKindersitzeColor={babyschalenKindersitzeColor}
                setBabyschalenKindersitzeColor={setBabyschalenKindersitzeColor}
                selectedKinderzimmermobelArt={selectedKinderzimmermobelArt}
                setSelectedKinderzimmermobelArt={setSelectedKinderzimmermobelArt}
                selectedSpielzeugArt={selectedSpielzeugArt}
                setSelectedSpielzeugArt={setSelectedSpielzeugArt}
              />
            )}

            {/* Pet Specific Fields */}
            {category === 'Evcil Hayvanlar' && (
              <PetFields
                subCategory={subCategory}
                t={t}
                selectedFischeArt={selectedFischeArt}
                setSelectedFischeArt={setSelectedFischeArt}
                selectedHundeArt={selectedHundeArt}
                setSelectedHundeArt={setSelectedHundeArt}
                selectedHundeAlter={selectedHundeAlter}
                setSelectedHundeAlter={setSelectedHundeAlter}
                selectedHundeGeimpft={selectedHundeGeimpft}
                setSelectedHundeGeimpft={setSelectedHundeGeimpft}
                selectedHundeErlaubnis={selectedHundeErlaubnis}
                setSelectedHundeErlaubnis={setSelectedHundeErlaubnis}
                selectedKatzenArt={selectedKatzenArt}
                setSelectedKatzenArt={setSelectedKatzenArt}
                selectedKatzenAlter={selectedKatzenAlter}
                setSelectedKatzenAlter={setSelectedKatzenAlter}
                selectedKatzenGeimpft={selectedKatzenGeimpft}
                setSelectedKatzenGeimpft={setSelectedKatzenGeimpft}
                selectedKatzenErlaubnis={selectedKatzenErlaubnis}
                setSelectedKatzenErlaubnis={setSelectedKatzenErlaubnis}
                selectedKleintiereArt={selectedKleintiereArt}
                setSelectedKleintiereArt={setSelectedKleintiereArt}
                selectedNutztiereArt={selectedNutztiereArt}
                setSelectedNutztiereArt={setSelectedNutztiereArt}
                selectedPferdeArt={selectedPferdeArt}
                setSelectedPferdeArt={setSelectedPferdeArt}
                selectedVermisstetiereStatus={selectedVermisstetiereStatus}
                setSelectedVermisstetiereStatus={setSelectedVermisstetiereStatus}
                selectedVoegelArt={selectedVoegelArt}
                setSelectedVoegelArt={setSelectedVoegelArt}
                selectedHaustierZubehoerArt={selectedHaustierZubehoerArt}
                setSelectedHaustierZubehoerArt={setSelectedHaustierZubehoerArt}
              />
            )}

            <FashionFields
              category={category}
              subCategory={subCategory}
              t={t}
              selectedBeautyGesundheitArt={selectedBeautyGesundheitArt}
              setSelectedBeautyGesundheitArt={setSelectedBeautyGesundheitArt}
              selectedDamenbekleidungArt={selectedDamenbekleidungArt}
              setSelectedDamenbekleidungArt={setSelectedDamenbekleidungArt}
              selectedDamenbekleidungMarke={selectedDamenbekleidungMarke}
              setSelectedDamenbekleidungMarke={setSelectedDamenbekleidungMarke}
              selectedDamenbekleidungSize={selectedDamenbekleidungSize}
              setSelectedDamenbekleidungSize={setSelectedDamenbekleidungSize}
              selectedDamenbekleidungColor={selectedDamenbekleidungColor}
              setSelectedDamenbekleidungColor={setSelectedDamenbekleidungColor}
              damenschuheArt={damenschuheArt}
              setDamenschuheArt={setDamenschuheArt}
              damenschuheMarke={damenschuheMarke}
              setDamenschuheMarke={setDamenschuheMarke}
              damenschuheSize={damenschuheSize}
              setDamenschuheSize={setDamenschuheSize}
              damenschuheColor={damenschuheColor}
              setDamenschuheColor={setDamenschuheColor}
              herrenbekleidungArt={herrenbekleidungArt}
              setHerrenbekleidungArt={setHerrenbekleidungArt}
              herrenbekleidungMarke={herrenbekleidungMarke}
              setHerrenbekleidungMarke={setHerrenbekleidungMarke}
              herrenbekleidungSize={herrenbekleidungSize}
              setHerrenbekleidungSize={setHerrenbekleidungSize}
              herrenbekleidungColor={herrenbekleidungColor}
              setHerrenbekleidungColor={setHerrenbekleidungColor}
              damenbekleidungArt={damenbekleidungArt}
              setDamenbekleidungArt={setDamenbekleidungArt}
              damenbekleidungMarke={damenbekleidungMarke}
              setDamenbekleidungMarke={setDamenbekleidungMarke}
              damenbekleidungSize={damenbekleidungSize}
              setDamenbekleidungSize={setDamenbekleidungSize}
              damenbekleidungColor={damenbekleidungColor}
              setDamenbekleidungColor={setDamenbekleidungColor}
              selectedHerrenschuheArt={selectedHerrenschuheArt}
              setSelectedHerrenschuheArt={setSelectedHerrenschuheArt}
              selectedHerrenschuheMarke={selectedHerrenschuheMarke}
              setSelectedHerrenschuheMarke={setSelectedHerrenschuheMarke}
              selectedHerrenschuheSize={selectedHerrenschuheSize}
              setSelectedHerrenschuheSize={setSelectedHerrenschuheSize}
              selectedHerrenschuheColor={selectedHerrenschuheColor}
              setSelectedHerrenschuheColor={setSelectedHerrenschuheColor}
              selectedTaschenAccessoiresArt={selectedTaschenAccessoiresArt}
              setSelectedTaschenAccessoiresArt={setSelectedTaschenAccessoiresArt}
              selectedUhrenSchmuckArt={selectedUhrenSchmuckArt}
              setSelectedUhrenSchmuckArt={setSelectedUhrenSchmuckArt}
            />






            {/* Elektronik Specific Fields */}
            {category === 'Elektronik' && (
              <ElectronicFields
                subCategory={subCategory}
                t={t}
                selectedElektronikAudioHifiArt={selectedElektronikAudioHifiArt}
                setSelectedElektronikAudioHifiArt={setSelectedElektronikAudioHifiArt}
                selectedHandyTelefonArt={selectedHandyTelefonArt}
                setSelectedHandyTelefonArt={setSelectedHandyTelefonArt}
                selectedFotoArt={selectedFotoArt}
                setSelectedFotoArt={setSelectedFotoArt}
                selectedHaushaltsgeraeteArt={selectedHaushaltsgeraeteArt}
                setSelectedHaushaltsgeraeteArt={setSelectedHaushaltsgeraeteArt}
                selectedKonsolenArt={selectedKonsolenArt}
                setSelectedKonsolenArt={setSelectedKonsolenArt}
                selectedPCZubehoerSoftwareArt={selectedPCZubehoerSoftwareArt}
                setSelectedPCZubehoerSoftwareArt={setSelectedPCZubehoerSoftwareArt}
                selectedTabletsReaderArt={selectedTabletsReaderArt}
                setSelectedTabletsReaderArt={setSelectedTabletsReaderArt}
                selectedTVVideoArt={selectedTVVideoArt}
                setSelectedTVVideoArt={setSelectedTVVideoArt}
                selectedNotebooksArt={selectedNotebooksArt}
                setSelectedNotebooksArt={setSelectedNotebooksArt}
                selectedPCsArt={selectedPCsArt}
                setSelectedPCsArt={setSelectedPCsArt}
                selectedVideospieleArt={selectedVideospieleArt}
                setSelectedVideospieleArt={setSelectedVideospieleArt}
                selectedDienstleistungenElektronikArt={selectedDienstleistungenElektronikArt}
                setSelectedDienstleistungenElektronikArt={setSelectedDienstleistungenElektronikArt}
              />
            )}

            {category === 'Emlak' && (
              <RealEstateFields
                subCategory={subCategory}
                t={t}
                selectedObjektart={selectedObjektart}
                setSelectedObjektart={setSelectedObjektart}
                selectedGrundstuecksart={selectedGrundstuecksart}
                setSelectedGrundstuecksart={setSelectedGrundstuecksart}
                selectedWohnungstyp={selectedWohnungstyp}
                setSelectedWohnungstyp={setSelectedWohnungstyp}
                selectedHaustyp={selectedHaustyp}
                setSelectedHaustyp={setSelectedHaustyp}
                selectedAngebotsart={selectedAngebotsart}
                setSelectedAngebotsart={setSelectedAngebotsart}
                livingSpace={livingSpace}
                setLivingSpace={setLivingSpace}
                rooms={rooms}
                setRooms={setRooms}
                floor={floor}
                setFloor={setFloor}
                availableFrom={availableFrom}
                setAvailableFrom={setAvailableFrom}
                selectedOnlineViewing={selectedOnlineViewing}
                setSelectedOnlineViewing={setSelectedOnlineViewing}
                plotArea={plotArea}
                setPlotArea={setPlotArea}
                pricePerSqm={pricePerSqm}
                setPricePerSqm={setPricePerSqm}
                warmRent={warmRent}
                setWarmRent={setWarmRent}
                roommates={roommates}
                setRoommates={setRoommates}
                constructionYear={constructionYear}
                setConstructionYear={setConstructionYear}
                selectedTauschangebot={selectedTauschangebot}
                setSelectedTauschangebot={setSelectedTauschangebot}
                selectedCommission={selectedCommission}
                setSelectedCommission={setSelectedCommission}
                selectedGarageType={selectedGarageType}
                setSelectedGarageType={setSelectedGarageType}
                selectedAufZeitWGArt={selectedAufZeitWGArt}
                setSelectedAufZeitWGArt={setSelectedAufZeitWGArt}
                selectedRentalType={selectedRentalType}
                setSelectedRentalType={setSelectedRentalType}
                selectedLage={selectedLage}
                setSelectedLage={setSelectedLage}
                selectedAmenities={selectedAmenities}
                setSelectedAmenities={setSelectedAmenities}
                selectedGeneralFeatures={selectedGeneralFeatures}
                setSelectedGeneralFeatures={setSelectedGeneralFeatures}
              />
            )}









            {/* Job Specific Fields */}
            {isJobCategory && (
              <JobFields
                category={category}
                subCategory={subCategory}
                t={t}
                jobType={jobType}
                setJobType={setJobType}
                workingTime={workingTime}
                setWorkingTime={setWorkingTime}
                hourlyWage={hourlyWage}
                setHourlyWage={setHourlyWage}
                selectedSozialerSektorPflegeArt={selectedSozialerSektorPflegeArt}
                setSelectedSozialerSektorPflegeArt={setSelectedSozialerSektorPflegeArt}
                selectedBauHandwerkProduktionArt={selectedBauHandwerkProduktionArt}
                setSelectedBauHandwerkProduktionArt={setSelectedBauHandwerkProduktionArt}
                selectedBueroArbeitVerwaltungArt={selectedBueroArbeitVerwaltungArt}
                setSelectedBueroArbeitVerwaltungArt={setSelectedBueroArbeitVerwaltungArt}
                selectedGastronomieTourismusArt={selectedGastronomieTourismusArt}
                setSelectedGastronomieTourismusArt={setSelectedGastronomieTourismusArt}
                selectedTransportLogistikVerkehrArt={selectedTransportLogistikVerkehrArt}
                setSelectedTransportLogistikVerkehrArt={setSelectedTransportLogistikVerkehrArt}
                selectedVertriebEinkaufVerkaufArt={selectedVertriebEinkaufVerkaufArt}
                setSelectedVertriebEinkaufVerkaufArt={setSelectedVertriebEinkaufVerkaufArt}
                selectedWeitereJobsArt={selectedWeitereJobsArt}
                setSelectedWeitereJobsArt={setSelectedWeitereJobsArt}
              />
            )}



            {/* Art Selection for Ev & Bahçe */}
            {(category === 'Ev & Bahçe' || category === 'Hizmetler') && (
              <HomeGardenFields
                subCategory={subCategory}
                category={category}
                t={t}
                selectedSchlafzimmerArt={selectedSchlafzimmerArt}
                setSelectedSchlafzimmerArt={setSelectedSchlafzimmerArt}
                selectedKuecheEsszimmerArt={selectedKuecheEsszimmerArt}
                setSelectedKuecheEsszimmerArt={setSelectedKuecheEsszimmerArt}
                selectedGartenzubehoerArt={selectedGartenzubehoerArt}
                setSelectedGartenzubehoerArt={setSelectedGartenzubehoerArt}
                selectedLambaAydinlatmaArt={selectedLambaAydinlatmaArt}
                setSelectedLambaAydinlatmaArt={setSelectedLambaAydinlatmaArt}
                selectedDekorationArt={selectedDekorationArt}
                setSelectedDekorationArt={setSelectedDekorationArt}
                selectedWohnzimmerArt={selectedWohnzimmerArt}
                setSelectedWohnzimmerArt={setSelectedWohnzimmerArt}
                selectedDienstleistungenHausGartenArt={selectedDienstleistungenHausGartenArt}
                setSelectedDienstleistungenHausGartenArt={setSelectedDienstleistungenHausGartenArt}
              />
            )}

            {/* Hobby & Entertainment Specific Fields */}
            {(category === 'Eğlence, Hobi & Mahalle' || (category && category.includes('Müzik, Film & Kitap'))) && (
              <HobbyFields
                subCategory={subCategory}
                category={category}
                t={t}
                selectedSammelnArt={selectedSammelnArt}
                setSelectedSammelnArt={setSelectedSammelnArt}
                selectedSportCampingArt={selectedSportCampingArt}
                setSelectedSportCampingArt={setSelectedSportCampingArt}
                selectedModellbauArt={selectedModellbauArt}
                setSelectedModellbauArt={setSelectedModellbauArt}
                selectedHandarbeitArt={selectedHandarbeitArt}
                setSelectedHandarbeitArt={setSelectedHandarbeitArt}
                selectedKuenstlerMusikerArt={selectedKuenstlerMusikerArt}
                setSelectedKuenstlerMusikerArt={setSelectedKuenstlerMusikerArt}
                selectedReiseEventservicesArt={selectedReiseEventservicesArt}
                setSelectedReiseEventservicesArt={setSelectedReiseEventservicesArt}
                selectedBuecherZeitschriftenArt={selectedBuecherZeitschriftenArt}
                setSelectedBuecherZeitschriftenArt={setSelectedBuecherZeitschriftenArt}
              />
            )}

            {/* Service & Pet Specific Fields */}
            {(category === 'Hizmetler' || category === 'Evcil Hayvan' || subCategory === 'Yaşlı Bakımı') && (
              <ServiceFields
                subCategory={subCategory}
                category={category}
                t={t}
                selectedTierbetreuungTrainingArt={selectedTierbetreuungTrainingArt}
                setSelectedTierbetreuungTrainingArt={setSelectedTierbetreuungTrainingArt}
                selectedAltenpflegeArt={selectedAltenpflegeArt}
                setSelectedAltenpflegeArt={setSelectedAltenpflegeArt}
              />
            )}

            {/* Added extra newline for safety during removal of previous code */}

            {/* Education & Lessons Specific Fields */}
            {category === 'Ders Verenler' && (
              <EducationFields
                subCategory={subCategory}
                t={t}
                selectedSprachkurseArt={selectedSprachkurseArt}
                setSelectedSprachkurseArt={setSelectedSprachkurseArt}
                selectedKunstGestaltungArt={selectedKunstGestaltungArt}
                setSelectedKunstGestaltungArt={setSelectedKunstGestaltungArt}
              />
            )}


            {/* Art Selection for Weiteres Haus & Garten */}



            {/* Vehicle-specific fields */}
            {(category === 'Otomobil, Bisiklet & Tekne' || subCategory.startsWith('Bisiklet')) && (
              <VehicleFields
                category={category}
                subCategory={subCategory}
                t={t}
                // Bike
                selectedBikeArt={selectedBikeArt}
                setSelectedBikeArt={setSelectedBikeArt}
                selectedBikeType={selectedBikeType}
                setSelectedBikeType={setSelectedBikeType}
                // Auto/Moto/Van Shared
                marke={marke}
                setMarke={setMarke}
                getriebe={getriebe}
                setGetriebe={setGetriebe}
                kilometerstand={kilometerstand}
                setKilometerstand={setKilometerstand}
                erstzulassung={erstzulassung}
                setErstzulassung={setErstzulassung}
                leistung={leistung}
                setLeistung={setLeistung}
                // Auto Specific
                selectedCarBrand={selectedCarBrand}
                setSelectedCarBrand={setSelectedCarBrand}
                selectedCarModel={selectedCarModel}
                setSelectedCarModel={setSelectedCarModel}
                erstzulassungMonat={erstzulassungMonat}
                setErstzulassungMonat={setErstzulassungMonat}
                kraftstoff={kraftstoff}
                setKraftstoff={setKraftstoff}
                selectedFahrzeugtyp={selectedFahrzeugtyp}
                setSelectedFahrzeugtyp={setSelectedFahrzeugtyp}
                selectedDoorCount={selectedDoorCount}
                setSelectedDoorCount={setSelectedDoorCount}
                selectedExteriorColor={selectedExteriorColor}
                setSelectedExteriorColor={setSelectedExteriorColor}
                selectedInteriorMaterial={selectedInteriorMaterial}
                setSelectedInteriorMaterial={setSelectedInteriorMaterial}
                selectedEmissionBadge={selectedEmissionBadge}
                setSelectedEmissionBadge={setSelectedEmissionBadge}
                selectedSchadstoffklasse={selectedSchadstoffklasse}
                setSelectedSchadstoffklasse={setSelectedSchadstoffklasse}
                selectedHU={selectedHU}
                setSelectedHU={setSelectedHU}
                isUnfallfrei={isUnfallfrei}
                setIsUnfallfrei={setIsUnfallfrei}
                isScheckheftgepflegt={isScheckheftgepflegt}
                setIsScheckheftgepflegt={setIsScheckheftgepflegt}
                isNichtraucher={isNichtraucher}
                setIsNichtraucher={setIsNichtraucher}
                selectedCarAmenities={selectedCarAmenities}
                setSelectedCarAmenities={setSelectedCarAmenities}
                // Moto specific
                selectedMotorradArt={selectedMotorradArt}
                setSelectedMotorradArt={setSelectedMotorradArt}
                hubraum={hubraum}
                setHubraum={setHubraum}
                // Boat specific
                selectedBooteArt={selectedBooteArt}
                setSelectedBooteArt={setSelectedBooteArt}
                // Parts specific
                selectedAutoteileArt={selectedAutoteileArt}
                setSelectedAutoteileArt={setSelectedAutoteileArt}
                selectedMotorradteileArt={selectedMotorradteileArt}
                setSelectedMotorradteileArt={setSelectedMotorradteileArt}
                // Commercial specific
                selectedNutzfahrzeugeArt={selectedNutzfahrzeugeArt}
                setSelectedNutzfahrzeugeArt={setSelectedNutzfahrzeugeArt}
                // Caravan specific
                selectedWohnwagenArt={selectedWohnwagenArt}
                setSelectedWohnwagenArt={setSelectedWohnwagenArt}
              />
            )}

            {/* Condition and Shipping Selection */}
            {!hideConditionAndShipping && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">{t.addListing.condition}</label>
                  <select
                    value={condition}
                    onChange={(e) => setCondition(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white text-gray-700"
                  >
                    <option value="">{t.productDetail.pleaseChoose}</option>
                    <option value="defekt">{t.addListing.options.defective}</option>
                    <option value="in_ordnung">{t.addListing.options.okay}</option>
                    <option value="gut">{t.addListing.options.good}</option>
                    <option value="sehr_gut">{t.addListing.options.veryGood}</option>
                    <option value="neu">{t.addListing.options.new}</option>
                    <option value="neu_mit_etikett">{t.addListing.options.newWithTags}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">{t.addListing.shipping}</label>
                  <select
                    value={selectedVersand}
                    onChange={(e) => setSelectedVersand(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white text-gray-700"
                  >
                    <option value="">{t.productDetail.pleaseChoose}</option>
                    <option value="Versand möglich">{t.addListing.options.shipping}</option>
                    <option value="Nur Abholung">{t.addListing.options.noShipping}</option>
                  </select>
                </div>
              </div>
            )}
            {(category !== 'İş İlanları' && subCategory !== 'Eğitim / Meslek Eğitimi') && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    {category === 'Emlak' && ['Kiralık Daire', 'Kiralık Müstakil Ev', 'Ticari Emlak'].includes(subCategory) ? t.addListing.rentFee :
                      category === 'Emlak' && subCategory === 'Geçici Konaklama & Paylaşımlı Oda' ? t.addListing.rent :
                        t.addListing.price}
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      required={priceType !== 'giveaway' && priceType !== 'negotiable'}
                      disabled={priceType === 'giveaway'}
                      className={`flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300 ${priceType === 'giveaway' ? 'bg-gray-100 text-gray-400' : ''}`}
                      placeholder={priceType === 'giveaway' ? '' : (priceType === 'negotiable' ? t.addListing.optionalPricePlaceholder : t.addListing.pricePlaceholder)}
                    />
                    <span className="text-gray-600 font-medium">₺</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">{t.addListing.priceType}</label>
                  <select
                    value={priceType}
                    onChange={(e) => {
                      const newType = e.target.value;
                      setPriceType(newType);
                      if (newType === 'giveaway') {
                        setPrice(t.addListing.options.givingAway);
                      } else if (price === t.addListing.options.givingAway) {
                        setPrice('');
                      }
                    }}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white text-gray-700"
                  >
                    <option value="fixed">{t.addListing.options.fixedPrice}</option>
                    <option value="negotiable">{t.addListing.options.negotiable}</option>
                    <option value="giveaway">{t.addListing.options.givingAway}</option>
                  </select>
                </div>
              </div>
            )}
            <div>
              <label className="block text-sm text-gray-600 mb-1">{t.productDetail.description}</label>
              <textarea
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300"
                placeholder={t.addListing.descriptionPlaceholder}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-2">{t.addListing.images} (max. 20)</label>
              <div className="relative">
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageSelect}
                  className="hidden"
                />
                <label
                  htmlFor="image-upload"
                  className="w-full border-2 border-dashed border-gray-300 rounded-2xl px-6 py-10 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-red-400 hover:bg-red-50/30 transition-all duration-200 group"
                >
                  <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                    <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="text-center">
                    <span className="text-lg font-bold text-gray-900 block">{t.addListing.selectImages}</span>
                    <span className="text-sm text-gray-500">{t.addListing.dragAndDrop}</span>
                  </div>
                  <span className="text-xs text-gray-400">{t.addListing.maxImages}</span>
                </label>
              </div>
              {imageFiles.length > 0 && (
                <div className="mt-3 space-y-2">
                  <p className="text-xs text-gray-500">🖱️ {t.addListing.imageDragDropHint}</p>
                  <ul className="space-y-2">
                    {imageFiles.map((file, index) => {
                      // Create preview URL for the image
                      const previewUrl = typeof file === 'string'
                        ? file // Already a URL
                        : URL.createObjectURL(file); // Create temporary URL for File object

                      return (
                        <li
                          key={index}
                          draggable
                          onDragStart={(e) => {
                            e.dataTransfer.effectAllowed = 'move';
                            e.dataTransfer.setData('text/plain', index.toString());
                            e.currentTarget.style.opacity = '0.5';
                          }}
                          onDragEnd={(e) => {
                            e.currentTarget.style.opacity = '1';
                          }}
                          onDragOver={(e) => {
                            e.preventDefault();
                            e.dataTransfer.dropEffect = 'move';
                            e.currentTarget.style.borderColor = '#ef4444';
                            e.currentTarget.style.backgroundColor = '#fef2f2';
                          }}
                          onDragLeave={(e) => {
                            e.currentTarget.style.borderColor = '';
                            e.currentTarget.style.backgroundColor = '';
                          }}
                          onDrop={(e) => {
                            e.preventDefault();
                            e.currentTarget.style.borderColor = '';
                            e.currentTarget.style.backgroundColor = '';

                            const draggedIndex = parseInt(e.dataTransfer.getData('text/plain'));
                            const targetIndex = index;

                            if (draggedIndex !== targetIndex) {
                              const newFiles = [...imageFiles];
                              const [draggedItem] = newFiles.splice(draggedIndex, 1);
                              newFiles.splice(targetIndex, 0, draggedItem);
                              setImageFiles(newFiles);
                            }
                          }}
                          className="flex items-center gap-3 bg-gray-50 px-3 py-2 rounded border border-gray-200 hover:border-gray-300 transition-all cursor-move"
                        >
                          {/* Drag handle icon */}
                          <div className="text-gray-400 cursor-grab active:cursor-grabbing">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z"></path>
                            </svg>
                          </div>

                          {/* Thumbnail preview */}
                          <img
                            src={previewUrl}
                            alt={t.addListing.imageAlt.replace('{index}', (index + 1).toString())}
                            className="w-16 h-16 object-cover rounded border border-gray-300 pointer-events-none"
                          />

                          {/* Reorder buttons */}
                          <div className="flex flex-col gap-0.5">
                            <button
                              type="button"
                              onClick={() => {
                                if (index === 0) return;
                                const newFiles = [...imageFiles];
                                [newFiles[index - 1], newFiles[index]] = [newFiles[index], newFiles[index - 1]];
                                setImageFiles(newFiles);
                              }}
                              disabled={index === 0}
                              className={`p-1 rounded ${index === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:text-red-500 hover:bg-gray-200'}`}
                              title={t.addListing.moveUp}
                            >
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                              </svg>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (index === imageFiles.length - 1) return;
                                const newFiles = [...imageFiles];
                                [newFiles[index], newFiles[index + 1]] = [newFiles[index + 1], newFiles[index]];
                                setImageFiles(newFiles);
                              }}
                              disabled={index === imageFiles.length - 1}
                              className={`p-1 rounded ${index === imageFiles.length - 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:text-red-500 hover:bg-gray-200'}`}
                              title={t.addListing.moveDown}
                            >
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            </button>
                          </div>

                          {/* Image info */}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {typeof file === 'string'
                                ? `${t.addListing.imageLabel} ${index + 1}`
                                : file.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {index === 0 ? `⭐ ${t.addListing.mainImage}` : t.addListing.position.replace('{pos}', (index + 1).toString())}
                            </p>
                          </div>

                          {/* Remove button */}
                          <button
                            type="button"
                            onClick={() => {
                              const updated = imageFiles.filter((_, i) => i !== index);
                              setImageFiles(updated);
                            }}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded transition-colors"
                            title={t.addListing.remove}
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>

            <hr className="my-6" />

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">{t.addListing.locationTitle}</h2>
              <div className="space-y-4">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2 p-2 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                  <input
                    type="checkbox"
                    checked={showLocation}
                    onChange={(e) => setShowLocation(e.target.checked)}
                    className="text-red-400 focus:ring-red-300 rounded w-4 h-4"
                  />
                  {t.addListing.showLocation}
                </label>

                <div className="animate-in fade-in duration-300 space-y-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">{t.addListing.address}</label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300"
                      placeholder={t.addListing.addressPlaceholder}
                    />
                  </div>
                </div>

                <div className="grid gap-4 grid-cols-2">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">{t.addListing.district}</label>
                    <input
                      type="text"
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      required
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300"
                      placeholder={t.addListing.districtPlaceholder}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">{t.addListing.city}</label>
                    <select
                      value={city}
                      onChange={(e) => {
                        const selectedCity = e.target.value;
                        setCity(selectedCity);
                        // Auto-set region based on selected city
                        const cityData = turkeyCities.find(c => c.city === selectedCity);
                        if (cityData) {
                          setRegion(cityData.region);
                        }
                      }}
                      required
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white"
                    >
                      <option value="">{t.addListing.select}</option>
                      {turkeyCities.map((c) => (
                        <option key={c.city} value={c.city}>{c.city}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="animate-in fade-in duration-300">
                  <label className="block text-sm text-gray-600 mb-1">{t.addListing.region}</label>
                  <input
                    type="text"
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white"
                    placeholder={t.addListing.autoFill}
                  />
                </div>
              </div>

            </div>

            {/* Deine Angaben Section */}
            <div className="pt-6 border-t border-gray-200">
              <h2 className="text-xl font-semibold mb-4">{t.addListing.yourInfo}</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">{t.addListing.name}</label>
                  <input
                    type="text"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">{t.addListing.phoneNumber}</label>
                  <div className="flex flex-col gap-2">
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white"
                    />
                    <label className="flex items-center gap-2 text-sm text-gray-700">
                      <input
                        type="checkbox"
                        checked={showPhoneNumber}
                        onChange={(e) => setShowPhoneNumber(e.target.checked)}
                        className="text-red-400 focus:ring-red-300 rounded"
                      />
                      {t.addListing.showPhoneNumber}
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">{t.addListing.legalInfo}</label>
                  <textarea
                    value={legalInfo}
                    onChange={(e) => setLegalInfo(e.target.value)}
                    rows={4}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300 bg-gray-50"
                    placeholder={t.addListing.legalInfoPlaceholder}
                  />
                </div>
              </div>
            </div>


            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setListingType('buying');
                  setTitle('');
                  setCategory('');
                  setPrice('');
                  setPriceType('fixed');
                  setDescription('');
                  setImageFiles([]);
                  setCity('');
                  setDistrict('');
                  setRegion('');
                  setAddress('');
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                {t.addListing.reset}
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 font-semibold"
              >
                {t.addListing.saveListing}
              </button>
            </div>
          </form>
        </div>
      </div >
      {showLimitModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="relative p-8 text-center">
              <button
                onClick={() => navigate('/')}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-2"
              >
                ✕
              </button>
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl text-red-600">🚀</span>
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-2">{t.addListing.limitReached.title}</h3>
              <p className="text-gray-500 font-medium mb-8 px-4">
                {t.addListing.limitReached.description.replace('{limit}', limitState.limit)}
              </p>

              <div className="space-y-3">
                <button
                  onClick={() => navigate('/packages')}
                  className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black hover:bg-black transition-all shadow-lg"
                >
                  {t.addListing.limitReached.viewPackages}
                </button>
                <button
                  onClick={handlePayExtra}
                  disabled={payingExtra}
                  className="w-full py-4 border-2 border-red-600 text-red-600 rounded-2xl font-black hover:bg-red-50 transition-all flex items-center justify-center gap-2"
                >
                  {payingExtra ? (
                    <div className="w-5 h-5 border-2 border-red-600/30 border-t-red-600 rounded-full animate-spin"></div>
                  ) : (
                    <span>{t.addListing.limitReached.paySingle}</span>
                  )}
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="w-full py-4 text-gray-400 font-bold hover:text-gray-600 transition-colors"
                >
                  {t.addListing.limitReached.cancel}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div >
  );
};

// Image Lightbox Component
const ImageLightbox = ({ isOpen, onClose, imageSrc, altText, images, currentIndex, onNavigate }) => {
  if (!isOpen) return null;

  const hasMultipleImages = images && images.length > 1;
  const currentImageIndex = currentIndex !== undefined ? currentIndex : 0;
  const currentImage = images && images[currentImageIndex] ? images[currentImageIndex] : imageSrc;

  const handlePrevious = (e) => {
    e.stopPropagation();
    if (onNavigate && hasMultipleImages) {
      const newIndex = currentImageIndex > 0 ? currentImageIndex - 1 : images.length - 1;
      onNavigate(newIndex);
    }
  };

  const handleNext = (e) => {
    e.stopPropagation();
    if (onNavigate && hasMultipleImages) {
      const newIndex = currentImageIndex < images.length - 1 ? currentImageIndex + 1 : 0;
      onNavigate(newIndex);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black bg-opacity-95 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-gray-300 focus:outline-none z-10 bg-black/50 rounded-full p-2 hover:bg-black/70 transition-all"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Previous Button */}
      {hasMultipleImages && (
        <button
          onClick={handlePrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 focus:outline-none z-10 bg-black/50 rounded-full p-3 hover:bg-black/70 transition-all hover:scale-110"
        >
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {/* Image */}
      <div className="relative max-w-7xl max-h-screen flex flex-col items-center">
        <img
          src={currentImage}
          alt={altText}
          className="max-w-full max-h-[85vh] object-contain cursor-default"
          onClick={(e) => e.stopPropagation()}
        />

        {/* Image Counter */}
        {hasMultipleImages && (
          <div className="mt-4 text-white text-sm bg-black/50 px-4 py-2 rounded-full">
            {currentImageIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Next Button */}
      {hasMultipleImages && (
        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 focus:outline-none z-10 bg-black/50 rounded-full p-3 hover:bg-black/70 transition-all hover:scale-110"
        >
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}
    </div>
  );
};

// Visibility Packages Modal
const VisibilityPackagesModal = ({ isOpen, onClose, listing }) => {
  const [selectedPromotions, setSelectedPromotions] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const promotionPackages = [
    { id: 'bump', name: 'Yukarı Çıkar', price: '4,99', duration: 1, effect: 'Yeni dikkat çekin! İlanınız yeni bir ilan gibi görünecek.' },
    { id: 'highlight', name: 'Öne Çıkar', price: '9,99', duration: 7, effect: '2 kata kadar daha fazla görünürlük! İlanınız renkli olarak vurgulanacak.' },
    { id: 'multi-bump', name: 'Tekrarlı Yukarı Çıkarma', price: '16,99', duration: 7, effect: '5 kata kadar daha fazla görünürlük! Bir hafta boyunca ilanınız her gün yukarı çıkarılacak.' },
    { id: 'top', name: 'En Üst İlan', price: '19,99', duration: 7, effect: '10 kata kadar daha fazla görünürlük! İlanınız listenin en başında yer alacak!' },
    { id: 'galerie', name: 'Galeri', price: '59,99', duration: 10, effect: '15 kata kadar daha fazla görünürlük! İlanınız ana sayfada da görünecek!' },
  ];

  const togglePromotionSelection = (pkgId) => {
    setSelectedPromotions(prev =>
      prev.includes(pkgId) ? [] : [pkgId]
    );
  };

  const calculateTotal = () => {
    return selectedPromotions.reduce((acc, id) => {
      const pkg = promotionPackages.find(p => p.id === id);
      return acc + (pkg ? parseFloat(pkg.price.replace(',', '.')) : 0);
    }, 0).toFixed(2).replace('.', ',');
  };

  const handlePromotionPurchase = async () => {
    const packagesToPurchase = selectedPromotions.map(id => promotionPackages.find(p => p.id === id));

    if (packagesToPurchase.length === 0) return;

    const totalStr = calculateTotal();
    const names = packagesToPurchase.map(p => p.name).join(', ');

    if (window.confirm(`${names} toplam ${totalStr}₺ karşılığında satın alınsın mı?\n\nÜcret hesabınızdan düşülecektir.`)) {
      try {
        const { purchasePromotion } = await import('./api/promotions');

        // Process each promotion
        for (const p of packagesToPurchase) {
          await purchasePromotion(listing.id, {
            id: p.id,
            price: parseFloat(p.price.replace(',', '.')),
            duration: p.duration
          }, user.id);
        }

        alert(`Teşekkürler! Seçilen paketler aktif edildi.`);
        setSelectedPromotions([]);
        onClose();
        window.location.reload();
      } catch (error) {
        console.error('Error purchasing promotions:', error);
        alert('Promosyon satın alınırken hata oluştu');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md" onClick={onClose}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl overflow-hidden max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6 text-white flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black flex items-center gap-2">
              <span className="bg-red-500 text-white p-1.5 rounded-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </span>
              Görünürlüğü Maksimuma Çıkar
            </h2>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">Görünürlüğü artırılan ilan: <span className="text-white">{listing.title}</span></p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="bg-white rounded-2xl border-2 border-gray-100 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b-2 border-gray-100">
                  <tr className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                    <th className="px-6 py-4 w-16">Seç</th>
                    <th className="px-6 py-4">İlanı Öne Çıkar</th>
                    <th className="px-6 py-4">Etki</th>
                    <th className="px-6 py-4">Süre</th>
                    <th className="px-6 py-4 text-right w-32">Fiyat</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {promotionPackages.map((pkg, idx) => (
                    <tr
                      key={pkg.id}
                      onClick={() => togglePromotionSelection(pkg.id)}
                      className={`hover:bg-red-50/40 transition-all cursor-pointer group ${idx % 2 !== 0 ? 'bg-gray-50/30' : ''} ${selectedPromotions.includes(pkg.id) ? 'bg-red-50' : ''}`}
                    >
                      <td className="px-6 py-5">
                        <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-300 ${selectedPromotions.includes(pkg.id) ? 'bg-red-500 border-red-500 scale-110 shadow-lg shadow-red-200' : 'border-gray-200 bg-white group-hover:border-red-300'}`}>
                          {selectedPromotions.includes(pkg.id) && (
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3.5} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="font-black text-gray-900 group-hover:text-red-600 transition-colors uppercase tracking-tight">{pkg.name}</div>
                      </td>
                      <td className="px-6 py-5">
                        <p className="text-gray-500 font-medium leading-relaxed">{pkg.effect}</p>
                      </td>
                      <td className="px-6 py-5">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-600">
                          {pkg.duration === 1 ? 'bir kez' : `${pkg.duration} Gün`}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right font-black text-red-600 text-lg tabular-nums">
                        {pkg.price} ₺
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer / Cart Summary */}
        <div className={`p-6 bg-white border-t-2 border-gray-100 transition-all duration-500 ${selectedPromotions.length > 0 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-70 grayscale pointer-events-none'}`}>
          <div className="bg-gray-900 rounded-2xl p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
            <div className="flex items-center gap-6">
              <div className={`bg-red-500 text-white p-3 rounded-xl ${selectedPromotions.length > 0 ? 'animate-bounce shadow-lg shadow-red-500/50' : ''}`}>
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="text-center sm:text-left">
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500 mb-1">Seçiminiz: {selectedPromotions.length} Paket</div>
                <div className="text-3xl font-black tracking-tight tabular-nums">Toplam: {calculateTotal()} ₺</div>
              </div>
            </div>
            <button
              onClick={handlePromotionPurchase}
              disabled={selectedPromotions.length === 0}
              className="w-full sm:w-auto px-12 py-5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-black text-xl shadow-xl shadow-red-500/30 hover:shadow-red-500/50 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 group"
            >
              Şimdi Satın Al
              <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
          <div className="mt-4 text-center">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center justify-center gap-2">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              Güvenli Ödeme • Fiyatlara KDV dahildir
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Horizontal Listing Card Component
export const HorizontalListingCard = ({ listing, toggleFavorite, isFavorite, isOwnListing = false, compact = false, hidePrice = false, renderCustomFields = null }) => {
  const navigate = useNavigate();
  const [showVisibilityModal, setShowVisibilityModal] = useState(false);
  const { user } = useAuth();

  if (!listing) return null;

  const favorite = isFavorite ? isFavorite(listing.id) : false;

  const handleEdit = (e) => {
    e.stopPropagation();
    // Navigate to edit page with listing ID
    navigate(`/add-listing?edit=${listing.id}`);
  };

  const handleReserve = async (e) => {
    e.stopPropagation();

    // Check if already reserved (only check reserved_by since we don't use expiry)
    const isReservedInternal = listing.reserved_by;

    if (isReservedInternal) {
      // Cancel reservation - seller can cancel anytime
      if (window.confirm(`${t.productDetail.ownerDashboard.unreserveConfirm}\n\n${listing.title}`)) {
        try {
          // Use existing Supabase client
          const { supabase } = await import('./lib/supabase');

          const { data, error } = await supabase
            .from('listings')
            .update({
              reserved_by: null,
              reserved_until: null
            })
            .eq('id', listing.id)
            .select();

          if (error) {
            console.error('Supabase error:', error);
            alert('Hata: ' + error.message);
          } else {
            alert(t.productDetail.ownerDashboard.unreserveSuccess);
            window.location.reload();
          }
        } catch (error) {
          console.error('Error canceling reservation:', error);
          alert('Rezervasyonu kaldırırken hata oluştu');
        }
      }
    } else {
      // Create reservation
      if (window.confirm(`${t.productDetail.ownerDashboard.reserveConfirm}\n\n${listing.title}`)) {
        try {
          // Use existing Supabase client
          const { supabase } = await import('./lib/supabase');

          const { data, error } = await supabase
            .from('listings')
            .update({
              reserved_by: listing.user_id,
              reserved_until: new Date().toISOString()
            })
            .eq('id', listing.id)
            .select();

          console.log('Supabase update result:', { data, error });

          if (error) {
            console.error('Supabase error:', error);
            alert('Hata: ' + error.message);
          } else if (data && data.length > 0) {
            alert(t.productDetail.ownerDashboard.reserveSuccess);
            window.location.reload();
          } else {
            alert('Hata: İlan bulunamadı');
          }
        } catch (error) {
          console.error('Error creating reservation:', error);
          alert('Rezervasyon yapılırken hata oluştu');
        }
      }
    }
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (window.confirm(`${t.productDetail.ownerDashboard.deleteConfirm}\n\n${listing.title}`)) {
      try {
        // Use existing Supabase client
        const { supabase } = await import('./lib/supabase');

        const { error } = await supabase
          .from('listings')
          .delete()
          .eq('id', listing.id);

        if (error) {
          console.error('Supabase error:', error);
          alert('Silme sırasında hata oluştu: ' + error.message);
        } else {
          alert(t.productDetail.ownerDashboard.deleteSuccess);
          // Redirect to profile page
          window.location.href = '/profile?tab=listings';
        }
      } catch (error) {
        console.error('Error deleting listing:', error);
      }
    }
  };

  const handleExtend = async (e) => {
    e.stopPropagation();
    if (window.confirm(t.productDetail.ownerDashboard.extendConfirm.replace('{price}', '3,49₺'))) {
      try {
        const { purchasePromotion } = await import('./api/promotions');

        // New Logic: Update expiry_date directly by 90 days
        // If currently expired, set to now + 90 days
        // If active, add 90 days to current expiry_date
        const now = new Date();
        const currentExpiry = listing.expiry_date ? new Date(listing.expiry_date) : new Date(new Date(listing.created_at).getTime() + 90 * 24 * 60 * 60 * 1000);

        let newExpiryDate;

        if (currentExpiry < now) {
          // Already expired, start fresh 90 days from now
          newExpiryDate = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);
        } else {
          // Still active, extend current expiry by 90 days
          newExpiryDate = new Date(currentExpiry.getTime() + 90 * 24 * 60 * 60 * 1000);
        }

        // Use purchasePromotion to record the transaction and update the listing
        await purchasePromotion(listing.id, {
          id: 'verlängerung',
          price: 3.49,
          duration: 90
        }, user.id, {
          expiry_date: newExpiryDate.toISOString(),
          status: 'active'
        });

        alert(t.productDetail.ownerDashboard.extendSuccess);
        window.location.reload();
      } catch (error) {
        console.error('Error extending listing:', error);
        alert(t.addListing.error);
      }
    }
  };

  const handleBump = (e) => {
    e.stopPropagation();
    setShowVisibilityModal(true);
  };

  const isReserved = listing?.reserved_by;

  return (
    <>
      <div
        className={`${listing.is_gallery || listing.is_top ? 'bg-purple-50' : 'bg-white'} border ${listing.is_top ? 'border-purple-200' : 'border-gray-200'} rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer`}
        onClick={() => navigate(`/product/${listing.id}`)}
      >
        <div className="flex flex-col md:flex-row">
          {/* Image Section */}
          <div className="md:w-64 h-44 md:h-48 relative group flex-shrink-0 bg-gray-100">
            <img
              src={Array.isArray(listing?.images) && listing.images.length > 0
                ? listing.images[0]
                : listing?.image || 'https://via.placeholder.com/300x200?text=No+Image'}
              alt={listing?.title}
              className="w-full h-full object-cover transition-transform duration-300"
              loading="lazy"
            />
            {/* RESERVIERT Badge - always on top */}
            {isReserved && (
              <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded text-[10px] font-bold shadow flex items-center gap-1 z-20">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                REZERVE EDİLDİ
              </div>
            )}
            {/* TOP Badge - positioned below RESERVIERT if it exists */}
            {listing?.is_top && (
              <div className={`absolute ${isReserved ? 'top-10' : 'top-2'} left-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white px-2 py-1 rounded text-[10px] font-bold shadow z-10`}>
                ⭐ TOP
              </div>
            )}
            {/* ABGELAUFEN Badge - for owner only */}
            {isOwnListing && listing?.created_at && (new Date() > new Date(new Date(listing.created_at).getTime() + 30 * 24 * 60 * 60 * 1000)) && (
              <div className="absolute top-2 right-12 bg-red-600 text-white px-2 py-1 rounded text-[10px] font-bold shadow z-20 animate-pulse">
                ⏰ SÜRESİ DOLDU
              </div>
            )}
            {/* Favorite Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (toggleFavorite) toggleFavorite(listing.id);
              }}
              className="absolute top-2 right-2 w-7 h-7 bg-white/90 backdrop-blur-sm rounded-full shadow hover:bg-white hover:scale-110 transition-all duration-200 z-30 flex items-center justify-center"
              aria-label={favorite ? 'Favorilerden çıkar' : 'Favorilere ekle'}
            >
              {favorite ? (
                <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-gray-400 group-hover:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              )}
            </button>
          </div>

          <div className="flex-1 p-3 flex flex-col justify-between h-44 md:h-48">
            <div>
              <h4 className="text-base font-bold text-gray-900 mb-0.5 line-clamp-1 group-hover:text-red-600 transition-colors">
                {listing?.title}
              </h4>
              <p className="text-sm text-gray-600 mb-1 line-clamp-1">
                {listing?.description || 'Açıklama mevcut değil'}
              </p>
            </div>

            <div>
              {/* Dynamic Features Box */}
              {renderCustomFields ? renderCustomFields(listing) : (() => {
                const attrs = [];
                // Technical Attributes
                if (listing.rooms) attrs.push(`${listing.rooms} Zi.`);
                if (listing.living_space) attrs.push(`${listing.living_space} m²`);
                if (listing.erstzulassung) attrs.push(listing.erstzulassung);
                if (listing.kilometerstand) attrs.push(`${listing.kilometerstand.toLocaleString('tr-TR')} km`);

                // Fallback Attributes for common categories
                if (listing.zustand && listing.zustand !== 'all') attrs.push(listing.zustand);
                if (listing.brand) attrs.push(listing.brand);
                if (listing.size) attrs.push(listing.size);

                // Damenbekleidung specific attributes
                if (listing.damenbekleidung_marke && !attrs.includes(listing.damenbekleidung_marke)) attrs.push(listing.damenbekleidung_marke);
                if (listing.damenbekleidung_size && !attrs.includes(listing.damenbekleidung_size)) attrs.push(listing.damenbekleidung_size);
                if (listing.damenbekleidung_color) attrs.push(listing.damenbekleidung_color);

                // Bike specific attributes
                if (listing.bike_type) attrs.push(listing.bike_type);

                const artField = listing.audio_hifi_art || listing.dienstleistungen_elektronik_art || listing.foto_art || listing.handy_telefon_art || listing.haushaltsgeraete_art || listing.konsolen_art || listing.notebooks_art || listing.pc_zubehoer_software_art || listing.pcs_art || listing.tablets_reader_art || listing.tv_video_art || listing.videospiele_art || listing.art_type || listing.autoteile_art || listing.boote_art || listing.motorrad_art || listing.wohnwagen_art || listing.beauty_gesundheit_art || listing.damenbekleidung_art || listing.gartenzubehoer_art || listing.kueche_esszimmer_art || listing.heimwerken_art || listing.schlafzimmer_art || listing.bike_art;
                if (artField && !attrs.includes(artField)) attrs.push(artField);

                // Only show sub_category as fallback if no art field exists and it's not a service subcategory
                const serviceSubcategories = ['Ses & Hifi', 'Elektronik Hizmetler', 'Elektronik Servisler', 'Dienstleistungen Elektronik', 'Fotoğraf & Kamera', 'Cep Telefonu & Telefon', 'Cep Telefonu & Aksesuar', 'Ev Aletleri', 'Beyaz Eşya & Ev Aletleri', 'Oyun Konsolları', 'Konsollar', 'Dizüstü Bilgisayar', 'Dizüstü Bilgisayarlar', 'Bilgisayar Aksesuar & Yazılım', 'Bilgisayar Aksesuarları & Yazılım', 'Bilgisayarlar', 'Masaüstü Bilgisayar', 'Tablet & E-Okuyucu', 'Tabletler & E-Okuyucular', 'TV & Video', 'Video Oyunları', 'Güzellik & Sağlık', 'Kişisel Bakım & Sağlık', 'Kadın Giyimi', 'Kadın Giyim'];
                if (attrs.length === 0 && listing.sub_category && !serviceSubcategories.includes(listing.sub_category)) attrs.push(listing.sub_category);



                if (attrs.length === 0) return null;

                return (
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {attrs.slice(0, 4).map((attr, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-gray-100 text-gray-500 text-[10px] font-bold rounded-md border border-gray-200 uppercase tracking-tighter">
                        {attr}
                      </span>
                    ))}
                  </div>
                );
              })()}
            </div>

            <div className="text-base font-bold text-gray-900 mb-1">
              {!hidePrice && listing?.category !== 'Jobs' && listing?.category !== 'İş İlanları' && (
                listing?.price_type === 'giveaway' || listing?.price === 0
                  ? 'Ücretsiz'
                  : listing?.price
                    ? `${listing.price.toLocaleString('tr-TR')} ₺${listing.price_type === 'negotiable' ? ' Pazarlıklı' : ''}`
                    : 'Pazarlıklı'
              )}
            </div>

            <div className="flex items-center text-sm text-gray-700 gap-3 pt-1.5 border-t border-gray-200 mt-1">
              {isOwnListing ? (
                // Own listings: Show stats
                <div className="flex items-center gap-3 ml-auto text-xs text-gray-400">
                  {listing?.created_at && (
                    <span className="flex items-center gap-1">
                      {new Date(listing.created_at).toLocaleDateString('tr-TR')}
                    </span>
                  )}
                  <span>{listing?.views || 0} İzlenme</span>
                </div>
              ) : (
                // Other's listings: Show location and date
                <>
                  {listing?.city && (
                    <div className="flex items-center">
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {listing.district ? `${listing.district}, ${listing.city}` : listing.city}
                    </div>
                  )}
                  <div className="flex items-center ml-auto">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {new Date(listing.created_at).toLocaleDateString('tr-TR')}
                  </div>
                </>
              )}
            </div>

            {/* Action Buttons - Only show for own listings */}
            {isOwnListing && (
              <div className="flex flex-wrap gap-1.5 px-3 pb-3">
                <button
                  onClick={handleEdit}
                  className="px-2 py-1 text-[11px] font-bold text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                >
                  Düzenle
                </button>
                <button
                  onClick={handleExtend}
                  className="px-2 py-1 text-[11px] font-bold text-green-600 bg-white border border-gray-300 rounded hover:bg-green-50 transition-colors"
                >
                  Uzat
                </button>
                <button
                  onClick={handleReserve}
                  className="px-2 py-1 text-[11px] font-bold text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                >
                  {isReserved ? 'Rezervasyonu Kaldır' : 'Rezerve Et'}
                </button>
                <button
                  onClick={handleDelete}
                  className="px-2 py-1 text-[11px] font-bold text-red-600 bg-white border border-gray-300 rounded hover:bg-red-50 transition-colors"
                >
                  Sil
                </button>
                <button
                  onClick={handleBump}
                  className="px-2 py-1 text-[11px] font-bold text-blue-600 bg-white border border-gray-300 rounded hover:bg-blue-50 transition-colors"
                >
                  Yukarı Çıkar
                </button>
              </div>
            )}
          </div>
        </div>
      </div>



      {/* Visibility Packages Modal */}
      <VisibilityPackagesModal
        isOpen={showVisibilityModal}
        onClose={() => setShowVisibilityModal(false)}
        listing={listing}
      />
    </>
  );
};




// Listing Countdown Component
export const ListingCountdown = ({ expiryDate, onExpire }) => {
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const expiry = new Date(expiryDate);
      const difference = expiry - now;

      if (difference <= 0) {
        if (onExpire) onExpire();
        return {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0
        };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    };

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    // Initial calculation
    setTimeLeft(calculateTimeLeft());

    return () => clearInterval(timer);
  }, [expiryDate, onExpire]);

  if (!timeLeft) return null;

  const isLastDay = timeLeft.days === 0;

  // If more than 24 hours remaining, show the date instead of countdown
  if (!isLastDay) {
    const expiryDateObj = new Date(expiryDate);
    const day = String(expiryDateObj.getDate()).padStart(2, '0');
    const month = expiryDateObj.toLocaleString('tr-TR', { month: 'long' });
    const year = expiryDateObj.getFullYear();

    return (
      <div className="flex flex-col items-center">
        <div className="text-lg sm:text-xl font-black text-white">
          {day} {month} {year}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div className={`text-lg sm:text-xl font-black tabular-nums transition-colors duration-300 ${isLastDay ? 'text-red-500 animate-pulse' : 'text-white'}`}>
        {String(timeLeft.hours).padStart(2, '0')}:
        {String(timeLeft.minutes).padStart(2, '0')}:
        {String(timeLeft.seconds).padStart(2, '0')}
      </div>
    </div>
  );
};


// Professional Print Flyer (Sales Sign) Component - Optimized for single page
const PrintFlyer = ({ listing, sellerProfile }) => {
  if (!listing) return null;

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(window.location.href)}`;
  const displayImage = Array.isArray(listing.images) && listing.images.length > 0 ? listing.images[0] : (listing.image || '');
  const addressLine1 = listing.show_location === true ? (listing.address || '') : '';
  const addressLine2 = `${listing.district ? listing.district + ', ' : ''}${listing.city || ''}`.trim();

  return (
    <div className="hidden print:block print-flyer bg-white text-gray-900 font-sans h-[275mm] w-[210mm] relative overflow-hidden box-border border-0">
      {/* Header with Title and Price - Compact */}
      <div className="flex justify-between items-start border-b-4 border-red-600 pb-4 mb-6">
        <div className="flex-1 pr-4">
          <h1 className="text-2xl font-black uppercase tracking-tight leading-tight mb-1">
            {listing.title}
          </h1>
          <div className="text-[12px] text-gray-500 font-bold uppercase tracking-widest">
            No: {listing.listing_number || listing.id.slice(0, 8)} | {new Date().toLocaleDateString('tr-TR')}
          </div>
        </div>
        <div className="bg-red-600 text-white px-6 py-4 rounded-xl text-center shadow-lg flex-shrink-0 min-w-[150px]">
          <div className="text-[12px] font-bold uppercase tracking-widest leading-none mb-2 opacity-90">Fiyat</div>
          <div className="text-5xl font-black tabular-nums leading-none">{listing.price}₺</div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Left Side: Image and Description */}
        <div className="col-span-8">
          <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm mb-4 max-h-[300px]">
            <img src={displayImage} alt={listing.title} className="w-full h-full object-cover" />
          </div>

          <div className="mb-4">
            <h2 className="text-lg font-black uppercase tracking-tight border-b border-gray-100 pb-1 mb-2">
              {t.productDetail.description}
            </h2>
            <div className="text-[12px] text-gray-700 whitespace-pre-wrap leading-snug line-clamp-[12] mb-4">
              {listing.description}
            </div>

            {/* Internal Branding */}
            <div className="border-t border-gray-100 pt-3 flex justify-between items-center text-gray-300 font-bold uppercase tracking-widest text-[8px] w-full">
              <div className="flex items-center gap-1">
                <span className="text-red-600 text-[10px] font-black">LokalPazar</span>
                <span>{t.common.onlineMarketplace}</span>
              </div>
              <div>www.lokalpazar.com</div>
            </div>
          </div>
        </div>

        {/* Right Side: Info Sidebar */}
        <div className="col-span-4 flex flex-col gap-4">
          {/* Kontakt Section */}
          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
            <h3 className="text-sm font-black uppercase tracking-tight mb-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {t.common.contact}
            </h3>
            <div className="space-y-2.5">
              <div>
                <div className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">{t.productDetail.seller}</div>
                <div className="text-sm font-black truncate">{listing.contact_name || sellerProfile?.full_name || listing.sellerName || t.common.privateSeller}</div>
              </div>
              <div>
                <div className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">{t.common.phone}</div>
                <div className="text-base font-black text-red-600">
                  {listing.show_phone_number === true ? (listing.contact_phone || sellerProfile?.phone || t.common.notSpecified) : t.common.notSpecified}
                </div>
              </div>
              <div>
                <div className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">{t.common.location}</div>
                <div className="text-[11px] font-bold leading-tight">
                  <div className="text-gray-900 line-clamp-1">{listing.show_location === true && listing.address ? listing.address : ''}</div>
                  <div className="text-gray-500 line-clamp-1">{listing.district ? listing.district + ', ' : ''}{listing.city || ''}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
            <h3 className="text-sm font-black uppercase tracking-tight mb-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              {t.productDetail.details}
            </h3>
            <div className="space-y-2.5">
              {(listing.katzen_art || listing.art) && (
                <div>
                  <div className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">{t.productDetail.art}</div>
                  <div className="text-sm font-black line-clamp-1">{listing.katzen_art || listing.art}</div>
                </div>
              )}
              {(listing.katzen_alter || listing.alter) && (
                <div>
                  <div className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">{t.productDetail.age}</div>
                  <div className="text-sm font-black line-clamp-1">{listing.katzen_alter || listing.alter}</div>
                </div>
              )}
              {listing.katzen_geimpft && (
                <div>
                  <div className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">{t.productDetail.vaccinatedAndChipped}</div>
                  <div className="text-sm font-black">{listing.katzen_geimpft}</div>
                </div>
              )}
              {listing.katzen_erlaubnis && (
                <div>
                  <div className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">{t.productDetail.officialPermission}</div>
                  <div className="text-sm font-black">{listing.katzen_erlaubnis}</div>
                </div>
              )}
              {!listing.katzen_art && listing.brand && (
                <div>
                  <div className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">{t.addListing.brand}</div>
                  <div className="text-sm font-black">{listing.brand}</div>
                </div>
              )}
            </div>
          </div>

          {/* QR Code Section - More space efficient */}
          <div className="bg-gray-900 text-white p-4 rounded-2xl text-center shadow-xl flex flex-col items-center">
            <div className="bg-white p-2 rounded-xl inline-block mb-3">
              <img src={qrUrl} alt="QR Code" className="w-20 h-20" />
            </div>
            <div className="text-[12px] font-black uppercase mb-1">{t.productDetail.detailsOnline}</div>
            <div className="text-[8px] text-gray-400 font-bold leading-tight uppercase tracking-tighter">{t.productDetail.scanToView}</div>
          </div>
        </div>
      </div>

      {/* Tear-off Tabs (Abreißzettel) */}
      <div className="absolute bottom-0 left-0 right-0 border-t-2 border-dashed border-gray-300 bg-white no-break">
        <div className="flex h-36 overflow-hidden" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
          {[...Array(10)].map((_, i) => (
            <div key={i} className="flex-1 flex flex-col items-center justify-between py-2 border-r border-dashed border-gray-300 last:border-r-0" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
              <div style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }} className="text-[11px] font-black text-red-600 rotate-180">
                {listing.phone || sellerProfile?.phone || t.common.notSpecified}
              </div>
              <div className="bg-white p-1 border border-gray-100 rounded mt-1">
                <img src={qrUrl} alt="QR" className="w-12 h-12" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const ProductDetail = ({ addToCart, toggleFavorite, isFavorite, toggleFollowSeller, isSellerFollowed }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  /* Translations for Amenities and Features */
  const amenityTranslations = {
    // Residential Amenities
    'Möbliert/Teilmöbliert': 'Mobilyalı/Kısmen Mobilyalı',
    'Balkon': 'Balkon',
    'Terrasse': 'Teras',
    'Einbauküche': 'Ankastre Mutfak',
    'Badewanne': 'Küvet',
    'Gäste-WC': 'Misafir Tuvaleti',
    'Stufenloser Zugang': 'Engelsiz Erişim',
    'Fußbodenheizung': 'Yerden Isıtma',
    'WLAN': 'Wi-Fi',
    'Kühlschrank': 'Buzdolabı',
    'Waschmaschine': 'Çamaşır Makinesi',
    'Spülmaschine': 'Bulaşık Makinesi',
    'TV': 'Televizyon',
    // Commercial Amenities
    'Starkstrom': 'Yüksek Akım',
    'Klimaanlage': 'Klima',
    'DV-Verkabelung': 'DV Kablolama',
    'Parkplätze vorhanden': 'Otopark Mevcut',
    'Küche': 'Mutfak',
    // General Features
    'Altbau': 'Eski Yapı',
    'Neubau': 'Yeni Yapı',
    'Aufzug': 'Asansör',
    'Keller': 'Bodrum',
    'Dachboden': 'Çatı Katı',
    'Garage/Stellplatz': 'Garaj/Park Yeri',
    'Garten/-mitnutzung': 'Bahçe/Ortak Bahçe',
    'Haustiere erlaubt': 'Evcil Hayvan İzni',
    'WG-geeignet': 'Paylaşımlı Eve Uygun',
    'Denkmalobjekt': 'Tarihi Eser/Anıt',
    'Aktuell vermietet': 'Halen Kirada',
    // Other values
    'Garage': 'Garaj',
    'Außenstellplatz': 'Açık Otopark',
    'Möglich': 'Mümkün',
    'Nicht möglich': 'Mümkün Değil',
    'Provisionsfrei': 'Komisyonsuz',
    'Mit Provision': 'Komisyonlu',
    'Inland': 'Yurt İçi',
    'Ausland': 'Yurt Dışı',
    'befristet': 'Süreli',
    'unbefristet': 'Süresiz',
    'Gesamte Unterkunft': 'Tüm Konut',
    'Privatzimmer': 'Özel Oda',
    'Gemeinsames Zimmer': 'Paylaşımlı Oda',
    'Einfamilienhaus': 'Müstakil Ev',
    'Mehrfamilienhaus': 'Çok Aileli Ev',
    'Reihenhaus': 'Sıra Ev',
    'Doppelhaushälfte': 'İkiz Ev',
    'Bungalow': 'Bungalov',
    'Bauernhaus': 'Çiftlik Evi',
    'Villa': 'Villa',
    'Schloss': 'Şato',
    'Sonstige': 'Diğer',
    // Car Colors
    'Blau': 'Mavi',
    'Schwarz': 'Siyah',
    'Weiß': 'Beyaz',
    'Silber': 'Gümüş',
    'Grau': 'Gri',
    'Rot': 'Kırmızı',
    'Grün': 'Yeşil',
    'Gelb': 'Sarı',
    'Orange': 'Turuncu',
    'Braun': 'Kahverengi',
    'Beige': 'Bej',
    'Gold': 'Altın',
    'Violett': 'Mor',
    'Helleres Beigegrau': 'Açık Bej Gri',
    'Kosmosschwarz Metallic': 'Kozmos Siyah Metalik',
    // Car Interiors
    'Stoff': 'Kumaş',
    'Teilleder': 'Yarı Deri',
    'Vollleder': 'Tam Deri',
    'Alcantara': 'Alcantara',
    'Velours': 'Kadife',
    // Car Amenities
    'Anhängerkupplung': 'Römork Demiri',
    'Leichtmetallfelgen': 'Alaşım Jant',
    'Radio/Tuner': 'Radyo',
    'Tempomat': 'Hız Sabitleyici',
    'Freisprecheinrichtung': 'Araç Telefonu / Hands-Free',
    'Antiblockiersystem (ABS)': 'ABS',
    'Klimaanlage': 'Klima',
    'Navigationssystem': 'Navigasyon',
    'Schiebedach': 'Sunroof',
    'Sitzheizung': 'Koltuk Isıtma',
    'Bluetooth': 'Bluetooth',
    'Bordcomputer': 'Yol Bilgisayarı',
    'Elektr. Fensterheber': 'Elektrikli Camlar',
    'Elektr. Seitenspiegel': 'Elektrikli Aynalar',
    'Elektr. Sitzeinstellung': 'Elektrikli Koltuk Ayarı',
    'Head-Up Display': 'Head-Up Display',
    'Isofix': 'Isofix',
    'Kurvenlicht': 'Viraj Aydınlatma',
    'Lichtsensor': 'Far Sensörü',
    'Multifunktionslenkrad': 'Çok Fonksiyonlu Direksiyon',
    'Nebelscheinwerfer': 'Sis Farları',
    'Nichtraucher-Fahrzeug': 'Sigara İçilmemiş',
    'Panorama-Dach': 'Panoramik Cam Tavan',
    'Regensensor': 'Yağmur Sensörü',
    'Scheckheftgepflegt': 'Bakımlı (Servis Bakımlı)',
    'Servolenkung': 'Hidrolik Direksiyon',
    'Sitzbelüftung': 'Koltuk Soğutma',
    'Skisack': 'Kayak Torbası',
    'Sommerreifen': 'Yaz Lastikleri',
    'Soundsystem': 'Ses Sistemi',
    'Sportfahrwerk': 'Spor Süspansiyon',
    'Sportpaket': 'Spor Paket',
    'Sportsitze': 'Spor Koltuklar',
    'Sprachsteuerung': 'Sesli Kontrol',
    'Spurhalteassistent': 'Şerit Takip Asistanı',
    'Standheizung': 'Webasto / Park Isıtıcı',
    'Start/Stopp-Automatik': 'Start/Stop',
    'Tagfahrlicht': 'Gündüz Farları',
    'Tempomat': 'Hız Sabitleyici',
    'Totwinkel-Assistent': 'Kör Nokta Asistanı',
    'Touchscreen': 'Dokunmatik Ekran',
    'Traktionskontrolle': 'Çekiş Kontrolü',
    'Tuner/Radio': 'Radyo',
    'TV': 'TV',
    'USB': 'USB',
    'Verkehrszeichenerkennung': 'Trafik İşareti Tanıma',
    'Volldigitales Kombiinstrument': 'Hayalet Gösterge',
    'Winterpaket': 'Kış Paketi',
    'Winterreifen': 'Kış Lastikleri',
    'Xenonscheinwerfer': 'Xenon Farlar',
    'Zentralverriegelung': 'Merkezi Kilit',
    'H-Zulassung': 'Klasik Araç (H Plaka)',
    'Originalzustand': 'Orijinal Durum',
    'Radio': 'Radyo',
    'AMG-Line': 'AMG Paket',
    'Night-Paket': 'Gece Paketi',
    'LED High Performance': 'Yüksek Performans LED',
    'Park-Assistent': 'Park Asistanı',
    'MBUX Multimediasystem': 'MBUX Multimedya'
  };

  const translateVal = (val) => amenityTranslations[val] || val;

  // ALL HOOKS MUST BE CALLED BEFORE ANY CONDITIONAL RETURNS
  // State for listing data
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for seller profile
  const [sellerProfile, setSellerProfile] = useState(null);
  const [sellerLoading, setSellerLoading] = useState(true);

  const [activeImage, setActiveImage] = useState(0);
  const [showPhone, setShowPhone] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [currentStock, setCurrentStock] = useState(1); // Initialize with a default, will be updated by useEffect
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showLegal, setShowLegal] = useState(false);
  const [showLightbox, setShowLightbox] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [favoriteCount, setFavoriteCount] = useState(0);

  // Reservation states
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [reservationLoading, setReservationLoading] = useState(false);

  // Report modal states
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  const [reservation, setReservation] = useState(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [sellerRecentListings, setSellerRecentListings] = useState([]);
  const [categoryListings, setCategoryListings] = useState([]);
  const [sellerRating, setSellerRating] = useState(null);
  const [selectedPromotions, setSelectedPromotions] = useState([]);
  const { user } = useAuth();
  const isMobile = useIsMobile();

  const promotionPackages = [
    { id: 'bump', name: 'Yukarı Çıkar', price: '4,99', duration: 1, effect: 'Yeni dikkat çekin! İlanınız yeni bir ilan gibi görünecek.' },
    { id: 'highlight', name: 'Öne Çıkar', price: '9,99', duration: 7, effect: '2 kata kadar daha fazla görünürlük! İlanınız renkli olarak vurgulanacak.' },
    { id: 'multi-bump', name: 'Tekrarlı Yukarı Çıkarma', price: '16,99', duration: 7, effect: '5 kata kadar daha fazla görünürlük! Bir hafta boyunca ilanınız her gün yukarı çıkarılacak.' },
    { id: 'top', name: 'En Üst İlan', price: '19,99', duration: 7, effect: '10 kata kadar daha fazla görünürlük! İlanınız listenin en başında yer alacak!' },
    { id: 'galerie', name: 'Galeri', price: '59,99', duration: 10, effect: '15 kata kadar daha fazla görünürlük! İlanınız ana sayfada da görünecek!' },
  ];

  // Fetch listing from Supabase
  const isOwnListing = user && listing && user.id === listing.user_id;

  useEffect(() => {
    const loadListing = async () => {
      try {
        setLoading(true);
        const { fetchListingById } = await import('./api/listings');
        const data = await fetchListingById(id);
        console.log('Fetched listing:', data);

        // Demo enhancement for VW Käfer listing (98fd3675-0163-4c93-9a81-318bedc7c31a)
        if (data && data.id === '98fd3675-0163-4c93-9a81-318bedc7c31a') {
          data.kilometerstand = 85000;
          data.erstzulassung = '07/1970';
          data.kraftstoff = 'Benzin';
          data.leistung = 44;
          data.getriebe = 'Schaltgetriebe';
          data.car_brand = 'Volkswagen';
          data.car_model = 'Käfer';
          data.hubraum = 1493;
          data.fahrzeugtyp = 'Limousine';
          data.exterior_color = 'Helleres Beigegrau';
          data.unfallfrei = true;
          data.scheckheftgepflegt = true;
          data.nichtraucher_fahrzeug = true;
          data.car_amenities = ['H-Zulassung', 'Radio', 'Originalzustand'];

          // Match user's specific request for top info
          data.created_at = new Date().toISOString();
          data.listing_number = "1154";
          data.postal_code = '48653';
          data.city = "Coesfeld";
          data.address = "Alter Kirchplatz 5";
          data.views = 1;
          data.versand_art = "Nur Abholung";
        }

        // Demo enhancement for Mercedes A200 listing (b707bb19-ac7b-45df-a5a8-cbd8f25d9461)
        if (data && data.id === 'b707bb19-ac7b-45df-a5a8-cbd8f25d9461') {
          data.kilometerstand = 24500;
          data.erstzulassung = '06/2021';
          data.kraftstoff = 'Benzin';
          data.leistung = 163;
          data.getriebe = 'Automatik';
          data.car_brand = 'Mercedes Benz';
          data.car_model = 'A 200';
          data.hubraum = 1332;
          data.fahrzeugtyp = 'Limousine';
          data.exterior_color = 'Kosmosschwarz Metallic';
          data.unfallfrei = true;
          data.scheckheftgepflegt = true;
          data.nichtraucher_fahrzeug = true;
          data.car_amenities = ['AMG-Line', 'Night-Paket', 'LED High Performance', 'Park-Assistent', 'MBUX Multimediasystem'];

          // Match top info
          data.created_at = "2024-03-15T10:00:00.000Z";
          data.listing_number = "1018";
          data.postal_code = '48653';
          data.city = "Coesfeld";
          data.views = 6;
          data.versand_art = "Versand möglich";
        }

        // Check for expiry (Use expiry_date or default to 90 days)
        if (data && (data.expiry_date || data.created_at)) {
          const expiryDate = data.expiry_date
            ? new Date(data.expiry_date)
            : new Date(new Date(data.created_at).getTime() + 90 * 24 * 60 * 60 * 1000);

          const isExpired = new Date() > expiryDate;
          const isOwner = user && user.id === data.user_id;

          if (isExpired && !isOwner) {
            setError('Bu ilan mevcut değil.');
            setLoading(false);
            return;
          }
        }

        // Fetch seller profile immediately to prevent flicker
        if (data?.user_id) {
          try {
            const { fetchUserProfile } = await import('./api/profile');
            const profile = await fetchUserProfile(data.user_id);
            setSellerProfile(profile);
          } catch (profileErr) {
            console.error('Error loading seller profile during listing load:', profileErr);
          }
        }

        setListing(data);
        setCurrentStock(data?.stock || 1); // Update currentStock once listing data is fetched
      } catch (err) {
        console.error('Error loading listing:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadListing();
    }
  }, [id]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // Auto-fill contact form with user profile data
  useEffect(() => {
    const loadUserProfile = async () => {
      if (user) {
        try {
          const { fetchUserProfile } = await import('./api/profile');
          const profile = await fetchUserProfile(user.id);
          if (profile) {
            setContactName(profile.full_name || '');
            setContactPhone(profile.phone || '');
          }
        } catch (error) {
          console.error('Error loading user profile for contact form:', error);
        }
      }
    };

    loadUserProfile();
  }, [user]);

  // Track user activity for personalized recommendations
  useEffect(() => {
    if (listing) {
      // Track viewed listing
      const viewedListings = JSON.parse(localStorage.getItem('viewedListings') || '[]');
      if (!viewedListings.includes(listing.id)) {
        viewedListings.push(listing.id);
        // Keep only last 50 viewed listings
        if (viewedListings.length > 50) {
          viewedListings.shift();
        }
        localStorage.setItem('viewedListings', JSON.stringify(viewedListings));
      }

      // Track viewed categories
      const viewedCategories = JSON.parse(localStorage.getItem('viewedCategories') || '[]');
      if (!viewedCategories.includes(listing.category)) {
        viewedCategories.push(listing.category);
        localStorage.setItem('viewedCategories', JSON.stringify(viewedCategories));
      }
      if (listing.sub_category && !viewedCategories.includes(listing.sub_category)) {
        viewedCategories.push(listing.sub_category);
        localStorage.setItem('viewedCategories', JSON.stringify(viewedCategories));
      }
    }
  }, [listing]);

  // Load seller rating
  useEffect(() => {
    if (listing?.user_id) {
      const loadSellerRating = async () => {
        try {
          const { getUserRating } = await import('./api/ratings');
          const rating = await getUserRating(listing.user_id);
          setSellerRating(rating);
        } catch (error) {
          console.error('Error loading seller rating:', error);
        }
      };

      loadSellerRating();
    }
  }, [listing]);

  // Load seller's recent 3 listings
  useEffect(() => {
    if (listing?.user_id) {
      const loadSellerListings = async () => {
        try {
          const { data, error } = await supabase
            .from('listings')
            .select('*')
            .eq('user_id', listing.user_id)
            .neq('id', listing.id)
            .order('created_at', { ascending: false })
            .limit(3);

          if (error) throw error;
          setSellerRecentListings(data || []);
        } catch (error) {
          console.error('Error loading seller listings:', error);
        }
      };

      loadSellerListings();
    }
  }, [listing]);

  // Load 10 category-related listings
  useEffect(() => {
    if (listing?.category) {
      const loadCategoryListings = async () => {
        try {
          const { fetchListings } = await import('./api/listings');
          const data = await fetchListings({ category: listing.category }, { count: false });
          // Filter out current listing and seller's listings, get 10 random
          const relatedListings = data
            .filter(l => l.id !== listing.id && l.user_id !== listing.user_id)
            .sort(() => 0.5 - Math.random())
            .slice(0, 10);
          setCategoryListings(relatedListings);
        } catch (error) {
          console.error('Error loading category listings:', error);
        }
      };

      loadCategoryListings();
    }
  }, [listing]);

  // Fetch favorite count
  useEffect(() => {
    const fetchFavoriteCount = async () => {
      if (!id) return;

      try {
        const { favoritesApi } = await import('./api/favorites');
        const count = await favoritesApi.getFavoriteCount(id);
        setFavoriteCount(count);
      } catch (error) {
        console.error('Error fetching favorite count:', error);
      }
    };

    fetchFavoriteCount();
  }, [id]);


  // Increment view count (with 3 second delay to avoid counting quick bounces)
  useEffect(() => {
    if (listing && listing.id) {
      const incrementView = async () => {
        try {
          const { incrementListingView } = await import('./api/views');
          await incrementListingView(listing.id);
        } catch (error) {
          console.error('Error incrementing view:', error);
        }
      };

      // Delay to avoid counting quick bounces
      const timer = setTimeout(incrementView, 3000); // 3 seconds

      return () => clearTimeout(timer);
    }
  }, [listing?.id]);

  // NOW conditional returns AFTER all hooks
  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mb-4"></div>
          <p className="text-gray-600">İlan yükleniyor...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error || !listing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">İlan bulunamadı</h2>
          <p className="text-gray-600 mb-4">{error || 'Bu ilan mevcut değil.'}</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            {t.common.backToHome}
          </button>
        </div>
      </div>
    );
  }

  // Use seller profile from Supabase or fallback to default
  // Use seller profile from Supabase or fallback to listing data if joined, otherwise default
  const seller = sellerProfile || {
    id: listing?.user_id,
    full_name: listing?.profiles?.full_name || t.productDetail.unknownSeller,
    avatar_url: listing?.profiles?.avatar_url || null,
    store_logo: listing?.profiles?.store_logo || null,
    created_at: listing?.profiles?.created_at || new Date().toISOString(),
    is_pro: listing?.profiles?.is_pro,
    is_commercial: listing?.profiles?.is_commercial,
    subscription_tier: listing?.profiles?.subscription_tier,
    user_number: listing?.profiles?.user_number,
    last_seen: listing?.profiles?.last_seen,
    seller_type: listing?.profiles?.seller_type
  };

  // Calculate actual seller listing count
  // TODO: Fetch actual count from Supabase when needed
  const sellerListingsCount = 0;

  // NOW conditional returns AFTER all hooks
  if (!listing) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">İlan bulunamadı</h2>
          <p className="text-gray-600 mb-6">Aradığınız ilan maalesef artık mevcut değil.</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors"
          >
            Ana Sayfa'ya Dön
          </button>
        </div>
      </div>
    );
  }

  const sellerId = listing.sellerId;

  const handleModalSubmit = async (data) => {
    try {
      const { sendMessage } = await import('./api/messages');
      // listing.user_id is the seller's ID
      await sendMessage(listing.user_id, data.message, listing.id);
      alert(t.sellerProfile.messageSuccess);
      setShowMessageModal(false);
    } catch (error) {
      console.error('Error sending message:', error);
      alert(t.sellerProfile.messageError);
    }
  };

  const favorite = isFavorite ? isFavorite(listing.id) : false;

  // TODO: Fetch similar listings from Supabase based on category
  const similarListings = [];

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: listing.title,
        text: listing.description,
        url: url,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(url).then(() => {
        alert('Bağlantı panoya kopyalandı!');
      });
    }
  };

  const defaultDescription = 'Bu ürün çok iyi durumdadır. Diğer detaylar talep üzerine verilebilir. Elden teslim tercih edilir, ek ücret karşılığında kargo mümkündür.';
  const description = listing.description || defaultDescription;

  const activeSinceDisplay = seller.created_at
    ? new Date(seller.created_at).toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })
    : '-';
  const isCommercial = seller.is_pro || seller.is_commercial || seller.seller_type === 'Gewerblicher Nutzer' || (seller && seller.seller_type === 'commercial') || sellerProfile?.seller_type === 'Gewerblicher Nutzer';
  const sellerTypeLabel = isCommercial ? t.addListing.commercial : t.addListing.private;

  const handleAddToCart = () => {
    if (quantity > currentStock) {
      alert(`Sadece ${currentStock} adet kaldı.`);
      return;
    }
    if (addToCart) {
      addToCart({ ...listing, quantity });
      setCurrentStock(prev => prev - quantity);
      setQuantity(1); // Reset quantity to 1
      alert(`${quantity}x ${listing.title} sepete eklendi.`);
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert('Bitte melden Sie sich an, um eine Nachricht zu senden.');
      return;
    }

    try {
      const { sendMessage } = await import('./api/messages');
      await sendMessage({
        sender_id: user.id,
        receiver_id: listing.user_id,
        listing_id: listing.id,
        message: contactMessage,
        sender_name: contactName,
        sender_phone: contactPhone
      });

      alert('Nachricht erfolgreich gesendet!');
      setContactMessage('');
      setShowContactForm(false);
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Fehler beim Senden der Nachricht. Bitte versuchen Sie es erneut.');
    }
  };

  const handleSendMessage = (e) => {
    const handleModalSubmit = async (data) => {
      try {
        const { sendMessage } = await import('./api/messages');
        await sendMessage(listing.user_id, data.message, listing.id);
        alert('Mesaj başarıyla gönderildi!');
        setShowMessageModal(false);
      } catch (error) {
        console.error('Error sending message:', error);
        alert('Mesaj gönderilirken hata oluştu. Lütfen tekrar deneyin.');
      }
    };
    setContactPhone('');
    setContactMessage('');
  };

  const handleReportSubmit = async () => {
    if (!reportReason) {
      alert(t.productDetail.pleaseChoose);
      return;
    }

    try {
      const { reportListing } = await import('./api/reports');
      await reportListing(listing.id, reportReason, reportDescription);
      alert('İlan başarıyla bildirildi. Teşekkürler!');
      setShowReportModal(false);
      setReportReason('');
      setReportDescription('');
    } catch (error) {
      console.error('Error reporting listing:', error);
      if (error.message.includes('angemeldet')) {
        alert(error.message);
      } else {
        alert('İlan silinirken hata oluştu');
      }
    }
  };

  // Owner Dashboard Handlers
  const handleEditDetail = () => {
    navigate(`/add-listing?edit=${listing.id}`);
  };

  const handleReserveDetail = async () => {
    const isReservedInternal = listing.reserved_by;
    const confirmMsg = isReservedInternal
      ? `Rezervasyonu kaldır:\n\n${listing.title}`
      : `Ürünü rezerve et:\n\n${listing.title}\n\nRezervasyonu istediğiniz zaman kaldırabilirsiniz.`;

    if (window.confirm(confirmMsg)) {
      try {
        const { supabase } = await import('./lib/supabase');
        const { data, error } = await supabase
          .from('listings')
          .update({
            reserved_by: isReservedInternal ? null : user.id,
            reserved_until: isReservedInternal ? null : new Date().toISOString()
          })
          .eq('id', listing.id)
          .select();

        if (error) throw error;
        alert(isReservedInternal ? 'Rezervasyon kaldırıldı!' : 'Ürün rezerve edildi!');
        window.location.reload();
      } catch (error) {
        console.error('Error toggling reservation:', error);
        alert('Rezervasyonda hata oluştu');
      }
    }
  };

  const handleExtendDetail = async () => {
    // Note: Price updated to 3.99 for 90 days
    if (window.confirm(t.productDetail.ownerDashboard.extendConfirm.replace('{price}', '3,49₺'))) {
      try {
        const { purchasePromotion } = await import('./api/promotions');

        // New Logic: Update expiry_date directly by 90 days
        // If currently expired, set to now + 90 days
        // If active, add 90 days to current expiry_date
        const now = new Date();
        const currentExpiry = listing.expiry_date ? new Date(listing.expiry_date) : new Date(new Date(listing.created_at).getTime() + 90 * 24 * 60 * 60 * 1000);

        let newExpiryDate;

        if (currentExpiry < now) {
          // Already expired, start fresh 90 days from now
          newExpiryDate = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);
        } else {
          // Still active, extend current expiry by 90 days
          newExpiryDate = new Date(currentExpiry.getTime() + 90 * 24 * 60 * 60 * 1000);
        }

        // Use purchasePromotion to record the transaction and update the listing
        await purchasePromotion(listing.id, {
          id: 'verlängerung',
          price: 3.49, // Adjusted price for longer duration
          duration: 90
        }, user.id, {
          expiry_date: newExpiryDate.toISOString(),
          status: 'active' // Ensure it's reactive if it was expired
        });

        alert('İlanınız başarıyla 90 gün uzatıldı!');
        window.location.reload();
      } catch (error) {
        console.error('Error extending listing:', error);
        alert('İlan uzatılırken hata oluştu');
      }
    }
  };

  const handleDeleteDetail = async () => {
    if (window.confirm(`Möchten Sie diese Anzeige wirklich löschen?\n\n${listing.title}\n\nDiese Aktion kann nicht rückgängig gemacht werden!`)) {
      try {
        const { supabase } = await import('./lib/supabase');
        const { error } = await supabase
          .from('listings')
          .delete()
          .eq('id', listing.id);

        if (error) throw error;
        alert('İlan başarıyla silindi!');
        navigate('/profile?tab=listings');
      } catch (error) {
        console.error('Error deleting listing:', error);
        alert('Fehler beim Löschen der Anzeige');
      }
    }
  };

  const handlePromotionPurchase = async (pkg) => {
    const packagesToPurchase = pkg ? [pkg] : selectedPromotions.map(id => promotionPackages.find(p => p.id === id));

    if (packagesToPurchase.length === 0) return;

    const totalStr = packagesToPurchase.reduce((acc, p) => acc + parseFloat(p.price.replace(',', '.')), 0).toFixed(2).replace('.', ',');
    const names = packagesToPurchase.map(p => p.name).join(', ');

    if (window.confirm(`${names} toplam ${totalStr}₺ karşılığında satın alınsın mı?\n\nÜcret hesabınızdan düşülecektir.`)) {
      try {
        const { purchasePromotion } = await import('./api/promotions');

        // Process each promotion
        for (const p of packagesToPurchase) {
          await purchasePromotion(listing.id, {
            id: p.id,
            price: parseFloat(p.price.replace(',', '.')),
            duration: p.duration
          }, user.id);
        }

        alert(`Vielen Dank! Die gewählten Pakete wurden aktiviert.`);
        setSelectedPromotions([]);
        window.location.reload();
      } catch (error) {
        console.error('Error purchasing promotions:', error);
        alert('Promosyon satın alınırken hata oluştu');
      }
    }
  };

  const togglePromotionSelection = (pkgId) => {
    setSelectedPromotions(prev =>
      prev.includes(pkgId) ? [] : [pkgId]
    );
  };

  const calculateTotal = () => {
    return selectedPromotions.reduce((acc, id) => {
      const pkg = promotionPackages.find(p => p.id === id);
      return acc + (pkg ? parseFloat(pkg.price.replace(',', '.')) : 0);
    }, 0).toFixed(2).replace('.', ',');
  };

  return (
    <>
      {/* Print-Only Flyer */}
      <PrintFlyer listing={listing} sellerProfile={sellerProfile} />

      {/* Web-Only Styles and Content */}
      {/* Safe Print Styles - Optimized for Single Page */}
      <style>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 0;
          }
          
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            height: auto !important;
            overflow: visible !important;
          }

          /* Hide Web UI components */
          .no-print, nav, header, footer, section, button, aside {
            display: none !important;
          }

          /* The Flyer - Locked to top on one page */
          .print-flyer {
            display: block !important;
            visibility: visible !important;
            position: relative !important;
            width: 210mm !important;
            height: 275mm !important; /* Safe height to avoid margins pushing to page 2 */
            margin: 0 auto !important;
            padding: 10mm !important;
            background: white !important;
            box-sizing: border-box !important;
            page-break-after: avoid !important;
            page-break-inside: avoid !important;
            overflow: hidden !important;
          }

          #root, .App {
            height: auto !important;
            min-height: 0 !important;
          }
        }
      `}</style>

      <div className={`min-h-screen bg-gray-50 no-print ${isMobile ? 'pb-32' : ''}`}>
        {listing && <ProductSEO product={listing} />}
        <div className="max-w-7xl mx-auto px-2 sm:px-4 py-3 sm:py-6">
          <div className="mb-3 sm:mb-4 flex items-center gap-1 sm:gap-2 text-xs sm:text-sm overflow-x-auto no-print">
            <button
              onClick={() => navigate('/')}
              className="text-red-500 hover:text-red-600 font-medium whitespace-nowrap"
            >
              Kleinbazaar
            </button>
            <span className="text-gray-400">›</span>
            <button
              onClick={() => navigate(getCategoryPath(listing.category))}
              className="text-gray-700 hover:text-red-500 font-medium transition-colors whitespace-nowrap"
            >
              {listing.category}
            </button>
            {listing.sub_category && (
              <>
                <span className="text-gray-400">›</span>
                <button
                  onClick={() => navigate(getCategoryPath(listing.category, listing.sub_category))}
                  className="text-gray-700 hover:text-red-500 font-medium transition-colors whitespace-nowrap truncate max-w-[150px] sm:max-w-none"
                >
                  {normalizeSubcategoryName(listing.sub_category)}
                </button>
              </>
            )}
          </div>

          {/* Owner Dashboard Overlay */}
          {isOwnListing && (
            <div className="mb-6 bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-red-500/20 no-print">
              <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-4 sm:p-6 text-white">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-1">
                    <h2 className="text-xl sm:text-2xl font-black flex items-center gap-2">
                      <span className="bg-red-500 text-white p-1.5 rounded-lg">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </span>
                      {t.productDetail.ownerDashboard.title}
                    </h2>
                    <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">{t.productDetail.ownerDashboard.subtitle}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 sm:gap-8">
                    <div className="text-center group cursor-help">
                      <div className="text-2xl sm:text-3xl font-black text-white group-hover:text-red-400 transition-colors">{(listing.views || 0).toLocaleString('tr-TR')}</div>
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t.productDetail.ownerDashboard.visits}</div>
                    </div>
                    <div className="w-px h-10 bg-gray-700 hidden sm:block" />
                    <div className="text-center group cursor-help">
                      <div className="text-2xl sm:text-3xl font-black text-white group-hover:text-red-400 transition-colors">{(favoriteCount || 0).toLocaleString('tr-TR')}</div>
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t.productDetail.ownerDashboard.wishlist}</div>
                    </div>
                    <div className="w-px h-10 bg-gray-700 hidden sm:block" />
                    <div className="text-center">
                      <ListingCountdown
                        expiryDate={listing.expiry_date ? new Date(listing.expiry_date) : new Date(new Date(listing.created_at).getTime() + 90 * 24 * 60 * 60 * 1000)}
                        onExpire={() => {
                          // Optional: refresh or handle expiry
                        }}
                      />
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t.productDetail.ownerDashboard.endsOn}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-3 sm:p-4 bg-gray-50/50">
                <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-6 gap-2 mb-6">
                  <button
                    onClick={handleEditDetail}
                    className="flex flex-col items-center justify-center p-3 bg-white rounded-xl border border-gray-200 hover:border-red-500 hover:shadow-lg transition-all group"
                  >
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-red-500 mb-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    <span className="text-[10px] sm:text-xs font-bold text-gray-700">{t.productDetail.ownerDashboard.edit}</span>
                  </button>

                  <button
                    onClick={handleReserveDetail}
                    className={`flex flex-col items-center justify-center p-3 bg-white rounded-xl border ${listing.reserved_by ? 'border-orange-500 bg-orange-50' : 'border-gray-200'} hover:border-blue-500 hover:shadow-lg transition-all group`}
                  >
                    <svg className={`w-5 h-5 ${listing.reserved_by ? 'text-orange-500' : 'text-gray-400'} group-hover:text-blue-500 mb-1.5`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-[10px] sm:text-xs font-bold text-gray-700 text-center">{listing.reserved_by ? t.productDetail.ownerDashboard.unreserve : t.productDetail.ownerDashboard.reserve}</span>
                  </button>

                  <button
                    onClick={handleExtendDetail}
                    className="flex flex-col items-center justify-center p-3 bg-white rounded-xl border border-gray-200 hover:border-green-500 hover:shadow-lg transition-all group relative"
                  >
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-green-500 mb-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span className="text-[10px] sm:text-xs font-bold text-gray-700 text-center leading-none">{t.productDetail.ownerDashboard.extend}<br /><span className="text-[9px] text-green-600 font-black">(3,49₺)</span></span>
                  </button>

                  <button
                    onClick={handleDeleteDetail}
                    className="flex flex-col items-center justify-center p-3 bg-white rounded-xl border border-gray-200 hover:border-red-600 hover:shadow-lg transition-all group"
                  >
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-red-600 mb-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    <span className="text-[10px] sm:text-xs font-bold text-gray-700">{t.productDetail.ownerDashboard.delete}</span>
                  </button>

                  <button
                    onClick={() => window.print()}
                    className="flex flex-col items-center justify-center p-3 bg-white rounded-xl border border-gray-200 hover:border-purple-500 hover:shadow-lg transition-all group"
                  >
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-purple-500 mb-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                    <span className="text-[10px] sm:text-xs font-bold text-gray-700 text-center leading-none">{t.productDetail.ownerDashboard.printFlyer.split(' ').slice(0, 1).join(' ')}<br /><span className="text-[9px]">{t.productDetail.ownerDashboard.printFlyer.split(' ').slice(1).join(' ')}</span></span>
                  </button>

                  <button
                    onClick={() => navigate('/my-invoices')}
                    className="flex flex-col items-center justify-center p-3 bg-white rounded-xl border border-gray-200 hover:border-red-500 hover:shadow-lg transition-all group"
                  >
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-red-500 mb-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="text-[10px] sm:text-xs font-bold text-gray-700">{t.productDetail.ownerDashboard.invoices}</span>
                  </button>

                </div>

                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-gray-100">
                        <tr className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                          <th className="px-6 py-4 w-10">Select</th>
                          <th className="px-6 py-4">{t.productDetail.ownerDashboard.highlightTitle}</th>
                          <th className="px-6 py-4">{t.productDetail.ownerDashboard.effect}</th>
                          <th className="px-6 py-4">{t.productDetail.ownerDashboard.duration}</th>
                          <th className="px-6 py-4 text-right w-32">{t.productDetail.ownerDashboard.price}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 text-sm">
                        {promotionPackages.map((pkg, idx) => (
                          <tr
                            key={pkg.id}
                            onClick={() => togglePromotionSelection(pkg.id)}
                            className={`hover:bg-red-50/30 transition-colors group cursor-pointer ${idx % 2 !== 0 ? 'bg-red-50/10' : ''} ${selectedPromotions.includes(pkg.id) ? 'bg-red-50' : ''}`}
                          >
                            <td className="px-6 py-4">
                              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${selectedPromotions.includes(pkg.id) ? 'bg-red-500 border-red-500' : 'border-gray-300 bg-white'}`}>
                                {selectedPromotions.includes(pkg.id) && (
                                  <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                  </svg>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 font-black text-gray-900 group-hover:text-red-500">{pkg.name}</td>
                            <td className="px-6 py-4 text-gray-500 font-medium">{pkg.effect}</td>
                            <td className="px-6 py-4 font-bold text-gray-600">{pkg.duration === 1 ? t.productDetail.ownerDashboard.once : `${pkg.duration} ${t.productDetail.ownerDashboard.days}`}</td>
                            <td className="px-6 py-4 text-right font-black text-red-600">{pkg.price} ₺</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Promotion Cart Summary */}
                  {selectedPromotions.length > 0 && (
                    <div className="p-6 bg-gray-900 text-white border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="flex items-center gap-6">
                        <div className="bg-red-500 text-white p-2 rounded-lg animate-bounce">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </div>
                        <div>
                          <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">Seçilen Paketler: {selectedPromotions.length}</div>
                          <div className="text-2xl font-black">{t.productDetail.ownerDashboard.totalPrice}: {calculateTotal()} ₺</div>
                        </div>
                      </div>
                      <button
                        onClick={() => handlePromotionPurchase()}
                        className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-black text-lg shadow-xl shadow-red-600/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
                      >
                        {t.productDetail.ownerDashboard.buyNow}
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </button>
                    </div>
                  )}

                  <div className="bg-gray-50 px-6 py-3 text-[10px] font-bold text-gray-400 text-right uppercase tracking-[0.2em]">
                    {t.productDetail.ownerDashboard.vatIncluded}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 printable-content">
            {/* Sol Taraf - Ürün Açıklaması */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              {/* Ürün Resmi */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden relative hover:shadow-xl transition-shadow duration-300 z-0">
                {/* Inner panel for main image */}
                {/* Inner panel for main image */}
                <div className="bg-white rounded-lg overflow-hidden shadow-inner p-3">
                  <div className="relative w-full h-[525px] bg-gray-50 flex items-center justify-center rounded-lg overflow-hidden border border-gray-100">
                    <img
                      src={(listing.images && listing.images[activeImage]) || listing.image}
                      alt={listing.title}
                      className="w-full h-full object-cover z-10"
                      onClick={() => setShowLightbox(true)}
                    />
                    {listing.images && listing.images.length > 0 && (
                      <div className="absolute bottom-3 right-3 bg-black/60 text-white px-3 py-1 rounded-full text-xs font-medium z-20 backdrop-blur-sm">
                        {t.productDetail.imageCount.replace('{current}', activeImage + 1).replace('{total}', listing.images.length)}
                      </div>
                    )}


                    {/* Navigation Arrows */}
                    {listing.images && listing.images.length > 1 && (
                      <>
                        {/* Previous Button */}
                        <button
                          onClick={() => setActiveImage(activeImage === 0 ? listing.images.length - 1 : activeImage - 1)}
                          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-200 hover:scale-110"
                          aria-label={t.productDetail.prevImage}
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>

                        {/* Next Button */}
                        <button
                          onClick={() => setActiveImage(activeImage === listing.images.length - 1 ? 0 : activeImage + 1)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-200 hover:scale-110"
                          aria-label={t.productDetail.nextImage}
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </>
                    )}

                    {/* Status Badges Container */}
                    <div className="absolute top-4 left-4 z-20 flex flex-col items-start gap-2">
                      {/* RESERVIERT Badge */}
                      {listing?.reserved_by && (
                        <div className="bg-yellow-500 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg flex items-center gap-2">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                          </svg>
                          {t.productDetail.reservedLabel}
                        </div>
                      )}

                      {/* TOP Badge */}
                      {listing?.is_top && (
                        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white text-sm font-bold px-4 py-2 rounded-xl shadow-lg">
                          ⭐ TOP
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Gallery Thumbnails */}
                  {listing.images && listing.images.length > 1 && (
                    <div className="mt-3 flex gap-2 overflow-x-auto pb-2 scrollbar-none scroll-smooth">
                      {listing.images.map((img, index) => (
                        <button
                          key={index}
                          onClick={() => setActiveImage(index)}
                          className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${activeImage === index ? 'border-red-500' : 'border-transparent hover:border-gray-200'
                            }`}
                        >
                          <img
                            src={img}
                            alt={`${listing.title} thumbnail ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          {activeImage === index && (
                            <div className="absolute inset-0 bg-red-500/10" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {/* Favori Kalp Butonu */}
                {!isOwnListing && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite && toggleFavorite(listing.id);
                    }}
                    className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow hover:bg-white hover:scale-110 transition-all duration-200 z-30 flex items-center justify-center"
                    title={favorite ? 'Aus Merkliste entfernen' : 'Zur Merkliste hinzufügen'}
                  >
                    {favorite ? (
                      <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    ) : (
                      <svg className="w-6 h-6 text-gray-400 group-hover:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    )}
                  </button>
                )}
              </div>

              <ImageLightbox
                isOpen={showLightbox}
                onClose={() => setShowLightbox(false)}
                imageSrc={listing.image}
                altText={listing.title}
                images={listing.images}
                currentIndex={activeImage}
                onNavigate={setActiveImage}
              />

              {/* Birleştirilmiş İlan Bilgileri Paneli */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                {/* Ürün Başlığı ve Bilgileri */}
                <div className="space-y-6">
                  {/* Başlık ve Fiyat - Üst Kısım - Back to top per user request */}
                  <div className="pb-6 border-b border-gray-100">
                    {/* Fiyat - En Üstte */}
                    {listing.sub_category !== 'Ausbildung' && listing.sub_category !== 'Bau, Handwerk & Produktion' && listing.category !== 'Jobs' && (
                      <div className="mb-4">
                        <div className="text-4xl font-bold text-gray-900 mb-1">
                          {listing.price_type === 'giveaway' || listing.price === 0
                            ? t.productDetail.giveaway
                            : typeof listing.price === 'number'
                              ? `${listing.price.toLocaleString('tr-TR')} ₺${listing.price_type === 'negotiable' ? ' ' + t.productDetail.negotiable : ''}`
                              : listing.price?.toString().includes('₺')
                                ? listing.price
                                : listing.price ? `${listing.price} ₺${listing.price_type === 'negotiable' ? ' ' + t.productDetail.negotiable : ''}` : t.productDetail.negotiable}
                        </div>
                        {listing.stock && (
                          <div className="text-sm text-gray-500">
                            {t.productDetail.stock.replace('{count}', listing.stock || 1)}
                          </div>
                        )}

                        {/* Favorite Count */}
                        {favoriteCount > 0 && (
                          <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
                            <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                            </svg>
                            <span className="font-medium">{favoriteCount}</span>
                            <span>{favoriteCount === 1 ? t.productDetail.personFavorited : t.productDetail.peopleFavorited.replace('{count}', favoriteCount)}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Başlık */}
                    <div>
                      <h1 className="text-xl font-bold text-gray-900 leading-tight">
                        {listing.title}
                      </h1>
                    </div>
                  </div>

                  {/* General Info Grid - Below Title/Price */}
                  <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm bg-gray-50 p-6 rounded-xl border border-gray-100 mb-2">
                    <div className="flex justify-between border-b border-gray-200 pb-2">
                      <span className="text-gray-500">{t.productDetail.postedOn}</span>
                      <span className="font-semibold text-gray-900">
                        {listing.created_at ? new Date(listing.created_at).toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' }) : 'N/A'}
                      </span>
                    </div>
                    {listing.condition && (
                      <div className="flex justify-between border-b border-gray-200 pb-2">
                        <span className="text-gray-500">{t.addListing.condition || 'Durum'}</span>
                        <span className="font-semibold text-gray-900">
                          {listing.condition === 'defekt' ? (t.addListing?.options?.defective || 'Arızalı') :
                            listing.condition === 'in_ordnung' ? (t.addListing?.options?.okay || 'İdare Eder') :
                              listing.condition === 'gut' ? (t.addListing?.options?.good || 'İyi') :
                                listing.condition === 'sehr_gut' ? (t.addListing?.options?.veryGood || 'Çok İyi') :
                                  listing.condition === 'neu' || listing.condition === 'Neu' ? (t.addListing?.options?.new || 'Yeni') :
                                    listing.condition === 'neu_mit_etikett' ? (t.addListing?.options?.newWithTags || 'Yeni (Etiketli)') :
                                      listing.condition === 'gebraucht' ? (t.addListing?.options?.used || 'İkinci El') :
                                        listing.condition}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between border-b border-gray-200 pb-2">
                      <span className="text-gray-500">{t.productDetail.listingId}</span>
                      <span className="font-semibold text-gray-900">{generateListingNumber(listing)}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-200 pb-2">
                      <span className="text-gray-500">{t.productDetail.location}</span>
                      <div className="text-right">
                        <span className="font-semibold text-gray-900 block">
                          {listing.show_location === true && listing.address ? `${listing.address}, ` : ''}
                          {listing.district ? `${listing.district}, ` : ''}
                          {listing.city || ''}
                          {!listing.city && t.common.notAvailable}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between border-b border-gray-200 pb-2">
                      <span className="text-gray-500">{t.productDetail.views}</span>
                      <span className="font-semibold text-gray-900">{(listing.views || 0).toLocaleString('tr-TR')}</span>
                    </div>
                    {listing.versand_art && (
                      <div className="flex justify-between border-b border-gray-200 pb-2">
                        <span className="text-gray-500">{t.addListing.shipping}</span>
                        <span className="font-semibold text-gray-900">
                          {listing.versand_art === 'Versand möglich' ? t.addListing.options.shipping :
                            listing.versand_art === 'Nur Abholung' ? t.addListing.options.noShipping :
                              listing.versand_art}
                        </span>
                      </div>
                    )}

                  </div>


                  {/* Quantity Selector - Only for New items */}
                  {listing.condition === 'Neu' && (
                    <div className="flex items-center gap-4 p-4 bg-blue-50 border border-blue-100 rounded-lg">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                      <span className="text-sm font-medium text-gray-700">Menge:</span>
                      <div className="flex items-center border-2 border-gray-300 rounded-full bg-white overflow-hidden">
                        <button
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="px-4 py-2 hover:bg-gray-50 text-gray-700 font-bold transition-colors"
                          type="button"
                        >−</button>
                        <div className="w-16 text-center font-bold text-gray-900 border-x border-gray-300 py-2">{quantity}</div>
                        <button
                          onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
                          className="px-4 py-2 hover:bg-gray-50 text-gray-700 font-bold transition-colors"
                          type="button"
                        >+</button>
                      </div>
                      <span className="text-sm text-gray-600">
                        <span className="font-semibold text-gray-900">{currentStock}</span> adet mevcut
                      </span>
                    </div>
                  )}

                  <div className="flex gap-3">
                    {listing.condition === 'Neu' && (
                      <button
                        type="button"
                        onClick={() => addToCart({ ...listing, quantity: quantity })}
                        className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        Sepete Ekle
                      </button>
                    )}
                  </div>
                </div>

                {/* Fahrzeugdetails & Ausstattung */}
                {((listing.kilometerstand !== undefined && listing.kilometerstand !== null) || (listing.kilometer !== undefined && listing.kilometer !== null) || listing.erstzulassung || listing.bj || listing.leistung || listing.power || listing.vehicle_type || listing.fahrzeugtyp || listing.hu ||
                  ['Autos', 'Motorräder & Motorroller', 'Wohnwagen & Wohnmobile', 'Nutzfahrzeuge & Anhänger', 'Weiteres Auto, Rad & Boot'].includes(listing.subCategory) ||
                  ['Autos', 'Motorräder & Motorroller', 'Wohnwagen & Wohnmobile', 'Nutzfahrzeuge & Anhänger', 'Weiteres Auto, Rad & Boot'].includes(listing.sub_category)) && (
                    <div className="mb-12 bg-gray-50 rounded-xl border-2 border-gray-100 shadow-sm overflow-hidden">
                      <div className="p-8">
                        <div className="mb-8">
                          <h2 className="text-2xl font-bold text-gray-900">
                            {t.productDetail.vehicleDetails}
                          </h2>
                        </div>

                        {/* Specs Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-5 text-sm mb-8">
                          {(listing.marke || listing.car_brand || listing.carBrand) && (
                            <div className="flex justify-between border-b border-gray-200 pb-3.5">
                              <span className="text-gray-600 font-medium">{t.productDetail.manufacturer}</span>
                              <span className="font-bold text-gray-900">{listing.marke || listing.car_brand || listing.carBrand}</span>
                            </div>
                          )}
                          {(listing.modell || listing.car_model || listing.carModel) && (
                            <div className="flex justify-between border-b border-gray-200 pb-3.5">
                              <span className="text-gray-600 font-medium">{t.productDetail.model}</span>
                              <span className="font-bold text-gray-900">{listing.modell || listing.car_model || listing.carModel}</span>
                            </div>
                          )}
                          {(listing.vehicle_type || listing.fahrzeugtyp || listing.fhz_type || listing.vehicleType) && (
                            <div className="flex justify-between border-b border-gray-200 pb-3.5">
                              <span className="text-gray-600 font-medium">{t.productDetail.propertyType || t.productDetail.art}</span>
                              <span className="font-bold text-gray-900">{listing.vehicle_type || listing.fahrzeugtyp || listing.fhz_type || listing.vehicleType}</span>
                            </div>
                          )}
                          {(listing.kilometerstand !== undefined && listing.kilometerstand !== null || listing.kilometer !== undefined && listing.kilometer !== null || listing.kilometerStand !== undefined && listing.kilometerStand !== null) && (
                            <div className="flex justify-between border-b border-gray-200 pb-3.5">
                              <span className="text-gray-600 font-medium">{t.productDetail.mileage}</span>
                              <span className="font-bold text-gray-900">{(listing.kilometerstand || listing.kilometer || listing.kilometerStand).toLocaleString('tr-TR')} km</span>
                            </div>
                          )}
                          {(listing.erstzulassung || listing.bj) && (
                            <div className="flex justify-between border-b border-gray-200 pb-3.5">
                              <span className="text-gray-600 font-medium">{t.productDetail.firstRegistration}</span>
                              <span className="font-bold text-gray-900">{listing.erstzulassung || listing.bj}</span>
                            </div>
                          )}
                          {(listing.kraftstoff || listing.fuel_type) && (
                            <div className="flex justify-between border-b border-gray-200 pb-3.5">
                              <span className="text-gray-600 font-medium">{t.productDetail.fuelType}</span>
                              <span className="font-bold text-gray-900">{listing.kraftstoff || listing.fuel_type}</span>
                            </div>
                          )}
                          {(listing.leistung || listing.power) && (
                            <div className="flex justify-between border-b border-gray-200 pb-3.5">
                              <span className="text-gray-600 font-medium">{t.productDetail.power}</span>
                              <span className="font-bold text-gray-900">{listing.leistung || listing.power} PS</span>
                            </div>
                          )}
                          {listing.hubraum && (
                            <div className="flex justify-between border-b border-gray-200 pb-3.5">
                              <span className="text-gray-600 font-medium">{t.productDetail.displacement}</span>
                              <span className="font-bold text-gray-900">{listing.hubraum} cm³</span>
                            </div>
                          )}
                          {listing.getriebe && (
                            <div className="flex justify-between border-b border-gray-200 pb-3.5">
                              <span className="text-gray-600 font-medium">{t.productDetail.transmission}</span>
                              <span className="font-bold text-gray-900">{listing.getriebe}</span>
                            </div>
                          )}
                          {listing.door_count && (
                            <div className="flex justify-between border-b border-gray-200 pb-3.5">
                              <span className="text-gray-600 font-medium">{t.productDetail.doorCount}</span>
                              <span className="font-bold text-gray-900">{listing.door_count}</span>
                            </div>
                          )}
                          {listing.hu && (
                            <div className="flex justify-between border-b border-gray-200 pb-3.5">
                              <span className="text-gray-500 font-medium">{t.productDetail.huUntil}</span>
                              <span className="font-bold text-gray-900">{listing.hu}</span>
                            </div>
                          )}
                          {(listing.emission_badge || listing.emission_sticker) && (
                            <div className="flex justify-between border-b border-gray-200 pb-3.5">
                              <span className="text-gray-600 font-medium">{t.productDetail.emissionBadge}</span>
                              <span className="font-bold text-gray-900">{listing.emission_badge || listing.emission_sticker}</span>
                            </div>
                          )}
                          {(listing.schadstoffklasse || listing.emission_class) && (
                            <div className="flex justify-between border-b border-gray-200 pb-3.5">
                              <span className="text-gray-600 font-medium">{t.productDetail.emissionClass}</span>
                              <span className="font-bold text-gray-900">{translateVal(listing.schadstoffklasse || listing.emission_class)}</span>
                            </div>
                          )}
                          {listing.exterior_color && (
                            <div className="flex justify-between border-b border-gray-200 pb-3.5">
                              <span className="text-gray-600 font-medium">{t.productDetail.exteriorColor}</span>
                              <span className="font-bold text-gray-900">{translateVal(listing.exterior_color)}</span>
                            </div>
                          )}
                          {listing.interior_material && (
                            <div className="flex justify-between border-b border-gray-200 pb-3.5">
                              <span className="text-gray-600 font-medium">{t.productDetail.interiorMaterial}</span>
                              <span className="font-bold text-gray-900">{translateVal(listing.interior_material)}</span>
                            </div>
                          )}
                        </div>

                        {/* Status Tags */}
                        <div className="flex flex-wrap gap-8 mb-8">
                          {listing.unfallfrei && (
                            <span className="text-gray-900 text-xs font-bold">
                              Kazasız
                            </span>
                          )}
                          {listing.scheckheftgepflegt && (
                            <span className="text-gray-900 text-xs font-bold">
                              Bakımlı (Servis Bakımlı)
                            </span>
                          )}
                          {listing.nichtraucher_fahrzeug && (
                            <span className="text-gray-900 text-xs font-bold">
                              Sigara İçilmemiş
                            </span>
                          )}
                        </div>

                        {/* Car Amenities */}
                        {listing.car_amenities && listing.car_amenities.length > 0 && (
                          <div className="pt-8 border-t border-gray-200">
                            <h3 className="text-lg font-bold text-gray-900 mb-5">
                              {t.productDetail.amenities}
                            </h3>
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-6">
                              {listing.car_amenities.map(amenity => (
                                <div key={amenity} className="flex items-center gap-2 text-[13px] text-gray-700 font-medium">
                                  <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                  <span>{translateVal(amenity)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}





                {/* Wohnzimmer Details */}
                {listing.wohnzimmer_art && (
                  <div className="mb-8">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">
                      {t.productDetail.details}
                    </h2>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm bg-gray-50 p-6 rounded-xl border border-gray-100">
                      <div className="flex justify-between border-b border-gray-200 pb-2">
                        <span className="text-gray-500">{t.productDetail.art}</span>
                        <span className="font-semibold text-gray-900">{listing.wohnzimmer_art}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Schlafzimmer, Küche, Heimwerken & Beleuchtung Details */}
                {(listing.schlafzimmer_art || listing.kueche_esszimmer_art || listing.heimwerken_art || listing.lamba_aydinlatma_art) && (
                  <div className="mb-8">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">
                      {t.productDetail.details}
                    </h2>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm bg-gray-50 p-6 rounded-xl border border-gray-100">
                      {listing.schlafzimmer_art && (
                        <div className="flex justify-between border-b border-gray-200 pb-2">
                          <span className="text-gray-500">{t.productDetail.art}</span>
                          <span className="font-semibold text-gray-900">{listing.schlafzimmer_art}</span>
                        </div>
                      )}
                      {listing.kueche_esszimmer_art && (
                        <div className="flex justify-between border-b border-gray-200 pb-2">
                          <span className="text-gray-500">{t.productDetail.art}</span>
                          <span className="font-semibold text-gray-900">{listing.kueche_esszimmer_art}</span>
                        </div>
                      )}
                      {listing.heimwerken_art && (
                        <div className="flex justify-between border-b border-gray-200 pb-2">
                          <span className="text-gray-500">{t.productDetail.art}</span>
                          <span className="font-semibold text-gray-900">{listing.heimwerken_art}</span>
                        </div>
                      )}
                      {listing.lamba_aydinlatma_art && (
                        <div className="flex justify-between border-b border-gray-200 pb-2">
                          <span className="text-gray-500">{t.productDetail.art}</span>
                          <span className="font-semibold text-gray-900">{listing.lamba_aydinlatma_art}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Fahrräder & Zubehör Details */}
                {(listing.bike_type || listing.art_type) && (
                  <div className="mb-8">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">
                      {t.productDetail.details}
                    </h2>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm bg-gray-50 p-6 rounded-xl border border-gray-100">
                      {listing.art_type && (
                        <div className="flex justify-between border-b border-gray-200 pb-2">
                          <span className="text-gray-500">{t.productDetail.art}</span>
                          <span className="font-semibold text-gray-900">{listing.art_type}</span>
                        </div>
                      )}
                      {listing.bike_type && (
                        <div className="flex justify-between border-b border-gray-200 pb-2">
                          <span className="text-gray-500">{t.productDetail.art}</span>
                          <span className="font-semibold text-gray-900">{listing.bike_type}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Baby & Kinderkleidung / Kinderschuhe Details */}
                {(listing.baby_kinderkleidung_art || listing.baby_kinderkleidung_size || listing.baby_kinderkleidung_color || listing.baby_kinderkleidung_gender || listing.baby_kinderschuhe_art || listing.baby_kinderschuhe_size || listing.baby_kinderschuhe_color) && (
                  <div className="mb-8">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">
                      {t.productDetail.details}
                    </h2>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm bg-gray-50 p-6 rounded-xl border border-gray-100">
                      {listing.baby_kinderkleidung_art && (
                        <div className="flex justify-between border-b border-gray-200 pb-2">
                          <span className="text-gray-500">{t.productDetail.art}</span>
                          <span className="font-semibold text-gray-900">{listing.baby_kinderkleidung_art}</span>
                        </div>
                      )}
                      {listing.baby_kinderkleidung_size && (
                        <div className="flex justify-between border-b border-gray-200 pb-2">
                          <span className="text-gray-500">{t.addListing.size}</span>
                          <span className="font-semibold text-gray-900">{listing.baby_kinderkleidung_size}</span>
                        </div>
                      )}
                      {listing.baby_kinderkleidung_color && (
                        <div className="flex justify-between border-b border-gray-200 pb-2">
                          <span className="text-gray-500">{t.addListing.color}</span>
                          <span className="font-semibold text-gray-900">{listing.baby_kinderkleidung_color}</span>
                        </div>
                      )}
                      {listing.baby_kinderkleidung_gender && (
                        <div className="flex justify-between border-b border-gray-200 pb-2">
                          <span className="text-gray-500">{t.addListing.gender}</span>
                          <span className="font-semibold text-gray-900">{listing.baby_kinderkleidung_gender}</span>
                        </div>
                      )}
                      {listing.baby_kinderschuhe_art && (
                        <div className="flex justify-between border-b border-gray-200 pb-2">
                          <span className="text-gray-500">{t.productDetail.art}</span>
                          <span className="font-semibold text-gray-900">{listing.baby_kinderschuhe_art}</span>
                        </div>
                      )}
                      {listing.baby_kinderschuhe_size && (
                        <div className="flex justify-between border-b border-gray-200 pb-2">
                          <span className="text-gray-500">{t.addListing.size}</span>
                          <span className="font-semibold text-gray-900">{listing.baby_kinderschuhe_size}</span>
                        </div>
                      )}
                      {listing.baby_kinderschuhe_color && (
                        <div className="flex justify-between border-b border-gray-200 pb-2">
                          <span className="text-gray-500">{t.addListing.color}</span>
                          <span className="font-semibold text-gray-900">{listing.baby_kinderschuhe_color}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Kinderwagen & Buggys Details */}
                {(listing.kinderwagen_buggys_color || listing.kinderwagen_buggys_art) && (
                  <div className="mb-8">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">
                      {t.productDetail.details}
                    </h2>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm bg-gray-50 p-6 rounded-xl border border-gray-100">
                      {listing.kinderwagen_buggys_art && (
                        <div className="flex justify-between border-b border-gray-200 pb-2">
                          <span className="text-gray-500">{t.productDetail.art}</span>
                          <span className="font-semibold text-gray-900">{listing.kinderwagen_buggys_art}</span>
                        </div>
                      )}
                      {listing.kinderwagen_buggys_color && (
                        <div className="flex justify-between border-b border-gray-200 pb-2">
                          <span className="text-gray-500">{t.addListing.color}</span>
                          <span className="font-semibold text-gray-900">{listing.kinderwagen_buggys_color}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Mode & Beauty Details (Legacy for others) */}
                {(listing.damenschuhe_color || listing.damenschuhe_art || listing.damenschuhe_size || listing.damenschuhe_marke ||
                  listing.herrenbekleidung_color || listing.herrenbekleidung_art || listing.herrenbekleidung_size || listing.herrenbekleidung_marke ||
                  listing.herrenschuhe_color || listing.herrenschuhe_art || listing.herrenschuhe_size || listing.herrenschuhe_marke) && (
                    <div className="mb-8">
                      <h2 className="text-lg font-bold text-gray-900 mb-4">
                        {t.productDetail.details}
                      </h2>
                      <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm bg-gray-50 p-6 rounded-xl border border-gray-100">
                        {/* Damenschuhe */}
                        {listing.damenschuhe_art && (
                          <div className="flex justify-between border-b border-gray-200 pb-2">
                            <span className="text-gray-500">{t.productDetail.art}</span>
                            <span className="font-semibold text-gray-900">{listing.damenschuhe_art}</span>
                          </div>
                        )}
                        {listing.damenschuhe_marke && (
                          <div className="flex justify-between border-b border-gray-200 pb-2">
                            <span className="text-gray-500">{t.addListing.brand}</span>
                            <span className="font-semibold text-gray-900">{listing.damenschuhe_marke}</span>
                          </div>
                        )}
                        {listing.damenschuhe_size && (
                          <div className="flex justify-between border-b border-gray-200 pb-2">
                            <span className="text-gray-500">{t.addListing.size}</span>
                            <span className="font-semibold text-gray-900">{listing.damenschuhe_size}</span>
                          </div>
                        )}
                        {listing.damenschuhe_color && (
                          <div className="flex justify-between border-b border-gray-200 pb-2">
                            <span className="text-gray-500">{t.addListing.color}</span>
                            <span className="font-semibold text-gray-900">{listing.damenschuhe_color}</span>
                          </div>
                        )}

                        {/* Herrenbekleidung */}
                        {listing.herrenbekleidung_art && (
                          <div className="flex justify-between border-b border-gray-200 pb-2">
                            <span className="text-gray-500">{t.productDetail.art}</span>
                            <span className="font-semibold text-gray-900">{listing.herrenbekleidung_art}</span>
                          </div>
                        )}
                        {listing.herrenbekleidung_marke && (
                          <div className="flex justify-between border-b border-gray-200 pb-2">
                            <span className="text-gray-500">{t.addListing.brand}</span>
                            <span className="font-semibold text-gray-900">{listing.herrenbekleidung_marke}</span>
                          </div>
                        )}
                        {listing.herrenbekleidung_size && (
                          <div className="flex justify-between border-b border-gray-200 pb-2">
                            <span className="text-gray-500">{t.addListing.size}</span>
                            <span className="font-semibold text-gray-900">{listing.herrenbekleidung_size}</span>
                          </div>
                        )}
                        {listing.herrenbekleidung_color && (
                          <div className="flex justify-between border-b border-gray-200 pb-2">
                            <span className="text-gray-500">{t.addListing.color}</span>
                            <span className="font-semibold text-gray-900">{listing.herrenbekleidung_color}</span>
                          </div>
                        )}

                        {/* Herrenschuhe */}
                        {listing.herrenschuhe_art && (
                          <div className="flex justify-between border-b border-gray-200 pb-2">
                            <span className="text-gray-500">{t.productDetail.art}</span>
                            <span className="font-semibold text-gray-900">{listing.herrenschuhe_art}</span>
                          </div>
                        )}
                        {listing.herrenschuhe_marke && (
                          <div className="flex justify-between border-b border-gray-200 pb-2">
                            <span className="text-gray-500">{t.addListing.brand}</span>
                            <span className="font-semibold text-gray-900">{listing.herrenschuhe_marke}</span>
                          </div>
                        )}
                        {listing.herrenschuhe_size && (
                          <div className="flex justify-between border-b border-gray-200 pb-2">
                            <span className="text-gray-500">{t.addListing.size}</span>
                            <span className="font-semibold text-gray-900">{listing.herrenschuhe_size}</span>
                          </div>
                        )}
                        {listing.herrenschuhe_color && (
                          <div className="flex justify-between border-b border-gray-200 pb-2">
                            <span className="text-gray-500">{t.addListing.color}</span>
                            <span className="font-semibold text-gray-900">{listing.herrenschuhe_color}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                {/* Babyschalen & Kindersitze Details */}
                {listing.babyschalen_kindersitze_color && (
                  <div className="mb-8">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">
                      {t.productDetail.details}
                    </h2>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm bg-gray-50 p-6 rounded-xl border border-gray-100">
                      <div className="flex justify-between border-b border-gray-200 pb-2">
                        <span className="text-gray-500">{t.addListing.color}</span>
                        <span className="font-semibold text-gray-900">{listing.babyschalen_kindersitze_color}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Kinderzimmermöbel Details */}
                {listing.kinderzimmermobel_art && (
                  <div className="mb-8">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">
                      {t.productDetail.details}
                    </h2>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm bg-gray-50 p-6 rounded-xl border border-gray-100">
                      <div className="flex justify-between border-b border-gray-200 pb-2">
                        <span className="text-gray-500">{t.productDetail.art}</span>
                        <span className="font-semibold text-gray-900">{listing.kinderzimmermobel_art}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Spielzeug Details */}
                {listing.spielzeug_art && (
                  <div className="mb-8">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">
                      {t.productDetail.details}
                    </h2>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm bg-gray-50 p-6 rounded-xl border border-gray-100">
                      <div className="flex justify-between border-b border-gray-200 pb-2">
                        <span className="text-gray-500">{t.productDetail.art}</span>
                        <span className="font-semibold text-gray-900">{listing.spielzeug_art}</span>
                      </div>
                    </div>
                  </div>
                )}

                {listing.fische_art && (
                  <div className="mb-8">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">
                      {t.productDetail.details}
                    </h2>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm bg-gray-50 p-6 rounded-xl border border-gray-100">
                      <div className="flex justify-between border-b border-gray-200 pb-2">
                        <span className="text-gray-500">{t.productDetail.art}</span>
                        <span className="font-semibold text-gray-900">{listing.fische_art}</span>
                      </div>
                    </div>
                  </div>
                )}


                {listing.haustier_zubehoer_art && (
                  <div className="mb-8">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">
                      {t.productDetail.details}
                    </h2>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm bg-gray-50 p-6 rounded-xl border border-gray-100">
                      <div className="flex justify-between border-b border-gray-200 pb-2">
                        <span className="text-gray-500">{t.productDetail.art}</span>
                        <span className="font-semibold text-gray-900">{listing.haustier_zubehoer_art}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Hunde Details */}
                {(listing.hunde_art || listing.hunde_alter || listing.hunde_geimpft || listing.hunde_erlaubnis) && (
                  <div className="mb-8">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">
                      {t.productDetail.details}
                    </h2>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm bg-gray-50 p-6 rounded-xl border border-gray-100">
                      {listing.hunde_art && (
                        <div className="flex justify-between border-b border-gray-200 pb-2">
                          <span className="text-gray-500">{t.productDetail.art}</span>
                          <span className="font-semibold text-gray-900">{listing.hunde_art}</span>
                        </div>
                      )}
                      {listing.hunde_alter && (
                        <div className="flex justify-between border-b border-gray-200 pb-2">
                          <span className="text-gray-500">{t.productDetail.age}</span>
                          <span className="font-semibold text-gray-900">{listing.hunde_alter}</span>
                        </div>
                      )}
                      {listing.hunde_geimpft && (
                        <div className="flex justify-between border-b border-gray-200 pb-2">
                          <span className="text-gray-500">{t.productDetail.vaccinatedAndChipped}</span>
                          <span className="font-semibold text-gray-900">{listing.hunde_geimpft}</span>
                        </div>
                      )}
                      {listing.hunde_erlaubnis && (
                        <div className="flex justify-between border-b border-gray-200 pb-2">
                          <span className="text-gray-500">{t.productDetail.officialPermission}</span>
                          <span className="font-semibold text-gray-900">{listing.hunde_erlaubnis}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Katzen Details */}
                {(listing.katzen_art || listing.katzen_alter || listing.katzen_geimpft || listing.katzen_erlaubnis) && (
                  <div className="mb-8">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">
                      {t.productDetail.details}
                    </h2>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm bg-gray-50 p-6 rounded-xl border border-gray-100">
                      {listing.katzen_art && (
                        <div className="flex justify-between border-b border-gray-200 pb-2">
                          <span className="text-gray-500">{t.productDetail.art}</span>
                          <span className="font-semibold text-gray-900">{listing.katzen_art}</span>
                        </div>
                      )}
                      {listing.katzen_alter && (
                        <div className="flex justify-between border-b border-gray-200 pb-2">
                          <span className="text-gray-500">{t.productDetail.age}</span>
                          <span className="font-semibold text-gray-900">{listing.katzen_alter}</span>
                        </div>
                      )}
                      {listing.katzen_geimpft && (
                        <div className="flex justify-between border-b border-gray-200 pb-2">
                          <span className="text-gray-500">{t.productDetail.vaccinatedAndChipped}</span>
                          <span className="font-semibold text-gray-900">{listing.katzen_geimpft}</span>
                        </div>
                      )}
                      {listing.katzen_erlaubnis && (
                        <div className="flex justify-between border-b border-gray-200 pb-2">
                          <span className="text-gray-500">{t.productDetail.officialPermission}</span>
                          <span className="font-semibold text-gray-900">{listing.katzen_erlaubnis}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Kleintiere Details */}
                {(listing.kleintiere_art) && (
                  <div className="mb-8">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">
                      {t.productDetail.details}
                    </h2>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm bg-gray-50 p-6 rounded-xl border border-gray-100">
                      {listing.kleintiere_art && (
                        <div className="flex justify-between border-b border-gray-200 pb-2">
                          <span className="text-gray-500">{t.productDetail.art}</span>
                          <span className="font-semibold text-gray-900">{listing.kleintiere_art}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Nutztiere Details */}
                {(listing.nutztiere_art) && (
                  <div className="mb-8">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">
                      {t.productDetail.details}
                    </h2>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm bg-gray-50 p-6 rounded-xl border border-gray-100">
                      {listing.nutztiere_art && (
                        <div className="flex justify-between border-b border-gray-200 pb-2">
                          <span className="text-gray-500">{t.productDetail.art}</span>
                          <span className="font-semibold text-gray-900">{listing.nutztiere_art}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Pferde Details */}
                {(listing.pferde_art) && (
                  <div className="mb-8">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">
                      {t.productDetail.details}
                    </h2>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm bg-gray-50 p-6 rounded-xl border border-gray-100">
                      {listing.pferde_art && (
                        <div className="flex justify-between border-b border-gray-200 pb-2">
                          <span className="text-gray-500">{t.productDetail.art}</span>
                          <span className="font-semibold text-gray-900">{listing.pferde_art}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Vermisste Tiere Details */}
                {(listing.vermisste_tiere_status) && (
                  <div className="mb-8">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">
                      {t.productDetail.details}
                    </h2>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm bg-gray-50 p-6 rounded-xl border border-gray-100">
                      {listing.vermisste_tiere_status && (
                        <div className="flex justify-between border-b border-gray-200 pb-2">
                          <span className="text-gray-500">{t.productDetail.status}</span>
                          <span className="font-semibold text-gray-900">{listing.vermisste_tiere_status}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Vögel Details */}
                {(listing.voegel_art) && (
                  <div className="mb-8">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">
                      {t.productDetail.details}
                    </h2>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm bg-gray-50 p-6 rounded-xl border border-gray-100">
                      {listing.voegel_art && (
                        <div className="flex justify-between border-b border-gray-200 pb-2">
                          <span className="text-gray-500">{t.productDetail.art}</span>
                          <span className="font-semibold text-gray-900">{listing.voegel_art}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Taschen & Accessoires Details */}
                {listing.taschen_accessoires_art && (
                  <div className="mb-8">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">
                      {t.productDetail.details}
                    </h2>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm bg-gray-50 p-6 rounded-xl border border-gray-100">
                      <div className="flex justify-between border-b border-gray-200 pb-2">
                        <span className="text-gray-500">{t.productDetail.art}</span>
                        <span className="font-semibold text-gray-900">{listing.taschen_accessoires_art}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Uhren & Schmuck Details */}
                {listing.uhren_schmuck_art && (
                  <div className="mb-8">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">
                      {t.productDetail.details}
                    </h2>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm bg-gray-50 p-6 rounded-xl border border-gray-100">
                      <div className="flex justify-between border-b border-gray-200 pb-2">
                        <span className="text-gray-500">{t.productDetail.art}</span>
                        <span className="font-semibold text-gray-900">{listing.uhren_schmuck_art}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Beauty & Gesundheit Details */}
                {listing.beauty_gesundheit_art && (
                  <div className="mb-8">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">
                      {t.productDetail.details}
                    </h2>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm bg-gray-50 p-6 rounded-xl border border-gray-100">
                      <div className="flex justify-between border-b border-gray-200 pb-2">
                        <span className="text-gray-500">{t.productDetail.art}</span>
                        <span className="font-semibold text-gray-900">{listing.beauty_gesundheit_art}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Elektronik Details */}
                {(listing.audio_hifi_art || listing.handy_telefon_art || listing.foto_art ||
                  listing.haushaltsgeraete_art || listing.konsolen_art ||
                  listing.pc_zubehoer_software_art || listing.tablets_reader_art || listing.tv_video_art ||
                  listing.notebooks_art || listing.pcs_art || listing.videospiele_art ||
                  listing.weitere_elektronik_art || listing.dienstleistungen_elektronik_art) && (
                    <div className="mb-8">
                      <h2 className="text-lg font-bold text-gray-900 mb-4">
                        {t.productDetail.details}
                      </h2>
                      <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm bg-gray-50 p-6 rounded-xl border border-gray-100">
                        {listing.audio_hifi_art && (
                          <div className="flex justify-between border-b border-gray-200 pb-2">
                            <span className="text-gray-500">{t.productDetail.art}</span>
                            <span className="font-semibold text-gray-900">{listing.audio_hifi_art}</span>
                          </div>
                        )}
                        {listing.handy_telefon_art && (
                          <div className="flex justify-between border-b border-gray-200 pb-2">
                            <span className="text-gray-500">{t.productDetail.art}</span>
                            <span className="font-semibold text-gray-900">{listing.handy_telefon_art}</span>
                          </div>
                        )}
                        {listing.foto_art && (
                          <div className="flex justify-between border-b border-gray-200 pb-2">
                            <span className="text-gray-500">{t.productDetail.art}</span>
                            <span className="font-semibold text-gray-900">{listing.foto_art}</span>
                          </div>
                        )}
                        {listing.haushaltsgeraete_art && (
                          <div className="flex justify-between border-b border-gray-200 pb-2">
                            <span className="text-gray-500">{t.productDetail.art}</span>
                            <span className="font-semibold text-gray-900">{listing.haushaltsgeraete_art}</span>
                          </div>
                        )}
                        {listing.konsolen_art && (
                          <div className="flex justify-between border-b border-gray-200 pb-2">
                            <span className="text-gray-500">{t.productDetail.art}</span>
                            <span className="font-semibold text-gray-900">{listing.konsolen_art}</span>
                          </div>
                        )}
                        {listing.pc_zubehoer_software_art && (
                          <div className="flex justify-between border-b border-gray-200 pb-2">
                            <span className="text-gray-500">{t.productDetail.art}</span>
                            <span className="font-semibold text-gray-900">{listing.pc_zubehoer_software_art}</span>
                          </div>
                        )}
                        {listing.tablets_reader_art && (
                          <div className="flex justify-between border-b border-gray-200 pb-2">
                            <span className="text-gray-500">{t.productDetail.art}</span>
                            <span className="font-semibold text-gray-900">{listing.tablets_reader_art}</span>
                          </div>
                        )}
                        {listing.tv_video_art && (
                          <div className="flex justify-between border-b border-gray-200 pb-2">
                            <span className="text-gray-500">{t.productDetail.art}</span>
                            <span className="font-semibold text-gray-900">{listing.tv_video_art}</span>
                          </div>
                        )}
                        {listing.notebooks_art && (
                          <div className="flex justify-between border-b border-gray-200 pb-2">
                            <span className="text-gray-500">{t.productDetail.art}</span>
                            <span className="font-semibold text-gray-900">{listing.notebooks_art}</span>
                          </div>
                        )}
                        {listing.pcs_art && (
                          <div className="flex justify-between border-b border-gray-200 pb-2">
                            <span className="text-gray-500">{t.productDetail.art}</span>
                            <span className="font-semibold text-gray-900">{listing.pcs_art}</span>
                          </div>
                        )}
                        {listing.videospiele_art && (
                          <div className="flex justify-between border-b border-gray-200 pb-2">
                            <span className="text-gray-500">{t.productDetail.art}</span>
                            <span className="font-semibold text-gray-900">{listing.videospiele_art}</span>
                          </div>
                        )}
                        {listing.weitere_elektronik_art && (
                          <div className="flex justify-between border-b border-gray-200 pb-2">
                            <span className="text-gray-500">{t.productDetail.art}</span>
                            <span className="font-semibold text-gray-900">{listing.weitere_elektronik_art}</span>
                          </div>
                        )}
                        {listing.dienstleistungen_elektronik_art && (
                          <div className="flex justify-between border-b border-gray-200 pb-2">
                            <span className="text-gray-500">{t.productDetail.art}</span>
                            <span className="font-semibold text-gray-900">{listing.dienstleistungen_elektronik_art}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                {/* Altenpflege Details */}

                {listing.altenpflege_art && (
                  <div className="mb-8">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">
                      {t.productDetail.details}
                    </h2>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm bg-gray-50 p-6 rounded-xl border border-gray-100">
                      <div className="flex justify-between border-b border-gray-200 pb-2">
                        <span className="text-gray-500">{t.productDetail.art}</span>
                        <span className="font-semibold text-gray-900">{listing.altenpflege_art}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Sprachkurse Details */}
                {listing.sprachkurse_art && (
                  <div className="mb-8">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">
                      {t.productDetail.details}
                    </h2>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm bg-gray-50 p-6 rounded-xl border border-gray-100">
                      <div className="flex justify-between border-b border-gray-200 pb-2">
                        <span className="text-gray-500">{t.productDetail.art}</span>
                        <span className="font-semibold text-gray-900">{listing.sprachkurse_art}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Kunst & Gestaltung Details */}
                {listing.kunst_gestaltung_art && (
                  <div className="mb-8">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">
                      {t.productDetail.details}
                    </h2>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm bg-gray-50 p-6 rounded-xl border border-gray-100">
                      <div className="flex justify-between border-b border-gray-200 pb-2">
                        <span className="text-gray-500">{t.productDetail.art}</span>
                        <span className="font-semibold text-gray-900">{listing.kunst_gestaltung_art}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Weiteres Haus & Garten Details */}
                {listing.weiteres_haus_garten_art && (
                  <div className="mb-8">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">
                      {t.productDetail.details}
                    </h2>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm bg-gray-50 p-6 rounded-xl border border-gray-100">
                      <div className="flex justify-between border-b border-gray-200 pb-2">
                        <span className="text-gray-500">{t.productDetail.art}</span>
                        <span className="font-semibold text-gray-900">{listing.weiteres_haus_garten_art}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Küche & Esszimmer Details */}
                {listing.kueche_esszimmer_art && (
                  <div className="mb-8">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">
                      {t.productDetail.details}
                    </h2>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm bg-gray-50 p-6 rounded-xl border border-gray-100">
                      <div className="flex justify-between border-b border-gray-200 pb-2">
                        <span className="text-gray-500">{t.productDetail.art}</span>
                        <span className="font-semibold text-gray-900">{listing.kueche_esszimmer_art}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Heimwerken (Ev Tadilatı) Details */}
                {listing.heimwerken_art && (
                  <div className="mb-8">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">
                      {t.productDetail.details}
                    </h2>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm bg-gray-50 p-6 rounded-xl border border-gray-100">
                      <div className="flex justify-between border-b border-gray-200 pb-2">
                        <span className="text-gray-500">{t.productDetail.art}</span>
                        <span className="font-semibold text-gray-900">{listing.heimwerken_art}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Gartenzubehör & Pflanzen Details */}
                {listing.gartenzubehoer_art && (
                  <div className="mb-8">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">
                      {t.productDetail.details}
                    </h2>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm bg-gray-50 p-6 rounded-xl border border-gray-100">
                      <div className="flex justify-between border-b border-gray-200 pb-2">
                        <span className="text-gray-500">{t.productDetail.art}</span>
                        <span className="font-semibold text-gray-900">{listing.gartenzubehoer_art}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Modellbau Details */}
                {listing.modellbau_art && (
                  <div className="mb-8">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">
                      {t.productDetail.details}
                    </h2>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm bg-gray-50 p-6 rounded-xl border border-gray-100">
                      <div className="flex justify-between border-b border-gray-200 pb-2">
                        <span className="text-gray-500">{t.productDetail.art}</span>
                        <span className="font-semibold text-gray-900">{listing.modellbau_art}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Handarbeit & Basteln Details */}
                {listing.handarbeit_art && (
                  <div className="mb-8">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">
                      {t.productDetail.details}
                    </h2>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm bg-gray-50 p-6 rounded-xl border border-gray-100">
                      <div className="flex justify-between border-b border-gray-200 pb-2">
                        <span className="text-gray-500">{t.productDetail.art}</span>
                        <span className="font-semibold text-gray-900">{listing.handarbeit_art}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Damenbekleidung / Kadın Giyimi Details */}
                {(listing.damenbekleidung_art || listing.damenbekleidung_marke || listing.damenbekleidung_size || listing.damenbekleidung_color) && (
                  <div className="mb-8">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">
                      {t.productDetail.details}
                    </h2>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm bg-gray-50 p-6 rounded-xl border border-gray-100">
                      {listing.damenbekleidung_art && (
                        <div className="flex justify-between border-b border-gray-200 pb-2">
                          <span className="text-gray-500">{t.productDetail.art}</span>
                          <span className="font-semibold text-gray-900">{listing.damenbekleidung_art}</span>
                        </div>
                      )}
                      {listing.damenbekleidung_marke && (
                        <div className="flex justify-between border-b border-gray-200 pb-2">
                          <span className="text-gray-500">Marka</span>
                          <span className="font-semibold text-gray-900">{listing.damenbekleidung_marke}</span>
                        </div>
                      )}
                      {listing.damenbekleidung_size && (
                        <div className="flex justify-between border-b border-gray-200 pb-2">
                          <span className="text-gray-500">Beden</span>
                          <span className="font-semibold text-gray-900">{listing.damenbekleidung_size}</span>
                        </div>
                      )}
                      {listing.damenbekleidung_color && (
                        <div className="flex justify-between border-b border-gray-200 pb-2">
                          <span className="text-gray-500">Renk</span>
                          <span className="font-semibold text-gray-900">{listing.damenbekleidung_color}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Immobilien Details Section */}
                {(listing.category === 'Emlak' || listing.living_space || listing.rooms || listing.auf_zeit_wg_art || listing.wohnungstyp || listing.haustyp || listing.objektart || listing.grundstuecksart || listing.garage_type) && (
                  <div className="mb-8">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm mt-4">
                      {listing.angebotsart && (
                        <div className="flex justify-between border-b border-gray-200 pb-2">
                          <span className="text-gray-500">{t.productDetail.offerType}</span>
                          <span className="font-semibold text-gray-900">{translateVal(listing.angebotsart)}</span>
                        </div>
                      )}
                      {listing.auf_zeit_wg_art && (
                        <div className="flex justify-between border-b border-gray-200 pb-2">
                          <span className="text-gray-500">{t.productDetail.offerType}</span>
                          <span className="font-semibold text-gray-900">{translateVal(listing.auf_zeit_wg_art)}</span>
                        </div>
                      )}
                      {listing.wohnungstyp && (
                        <div className="flex justify-between border-b border-gray-200 pb-2">
                          <span className="text-gray-500">{t.productDetail.propertyType}</span>
                          <span className="font-semibold text-gray-900">{translateVal(listing.wohnungstyp)}</span>
                        </div>
                      )}
                      {listing.haustyp && (
                        <div className="flex justify-between border-b border-gray-200 pb-2">
                          <span className="text-gray-500">{t.productDetail.propertyType}</span>
                          <span className="font-semibold text-gray-900">{translateVal(listing.haustyp)}</span>
                        </div>
                      )}
                      {listing.living_space && (
                        <div className="flex justify-between border-b border-gray-200 pb-2">
                          <span className="text-gray-500">{['Ticari Emlak', 'Konteyner', 'Arsa & Bahçe'].includes(listing.sub_category) ? t.productDetail.totalArea : t.productDetail.livingSpace}</span>
                          <span className="font-semibold text-gray-900">{listing.living_space} m²</span>
                        </div>
                      )}
                      {listing.rooms && (
                        <div className="flex justify-between border-b border-gray-200 pb-2">
                          <span className="text-gray-500">{t.productDetail.rooms}</span>
                          <span className="font-semibold text-gray-900">{listing.rooms}</span>
                        </div>
                      )}
                      {listing.floor !== undefined && listing.floor !== null && (
                        <div className="flex justify-between border-b border-gray-200 pb-2">
                          <span className="text-gray-500">{t.productDetail.floor}</span>
                          <span className="font-semibold text-gray-900">{listing.floor}</span>
                        </div>
                      )}
                      {listing.roommates && (
                        <div className="flex justify-between border-b border-gray-200 pb-2">
                          <span className="text-gray-500">{t.productDetail.roommates}</span>
                          <span className="font-semibold text-gray-900">{listing.roommates}</span>
                        </div>
                      )}
                      {listing.construction_year && (
                        <div className="flex justify-between border-b border-gray-200 pb-2">
                          <span className="text-gray-500">{t.productDetail.constructionYear}</span>
                          <span className="font-semibold text-gray-900">{listing.construction_year}</span>
                        </div>
                      )}
                      {listing.available_from && (
                        <div className="flex justify-between border-b border-gray-200 pb-2">
                          <span className="text-gray-500">{t.productDetail.availableFrom}</span>
                          <span className="font-semibold text-gray-900">
                            {listing.available_from.length === 7
                              ? new Date(listing.available_from + '-01').toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })
                              : new Date(listing.available_from).toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                          </span>
                        </div>
                      )}
                      {listing.warm_rent && (
                        <div className="flex justify-between border-b border-gray-200 pb-2">
                          <span className="text-gray-500">{t.productDetail.warmRent}</span>
                          <span className="font-semibold text-gray-900">{listing.warm_rent.toLocaleString('tr-TR')} ₺</span>
                        </div>
                      )}
                      {listing.price_per_sqm && (
                        <div className="flex justify-between border-b border-gray-200 pb-2">
                          <span className="text-gray-500">{t.productDetail.pricePerSqm}</span>
                          <span className="font-semibold text-gray-900">{listing.price_per_sqm.toLocaleString('tr-TR')} ₺/m²</span>
                        </div>
                      )}
                      {listing.plot_area && (
                        <div className="flex justify-between border-b border-gray-200 pb-2">
                          <span className="text-gray-500">{t.productDetail.plotArea}</span>
                          <span className="font-semibold text-gray-900">{listing.plot_area} m²</span>
                        </div>
                      )}
                      {listing.grundstuecksart && (
                        <div className="flex justify-between border-b border-gray-200 pb-2">
                          <span className="text-gray-500">{t.productDetail.plotType}</span>
                          <span className="font-semibold text-gray-900">{translateVal(listing.grundstuecksart)}</span>
                        </div>
                      )}
                      {listing.objektart && (
                        <div className="flex justify-between border-b border-gray-200 pb-2">
                          <span className="text-gray-500">{t.productDetail.objectType}</span>
                          <span className="font-semibold text-gray-900">{translateVal(listing.objektart)}</span>
                        </div>
                      )}
                      {listing.garage_type && (
                        <div className="flex justify-between border-b border-gray-200 pb-2">
                          <span className="text-gray-500">{t.productDetail.garage}</span>
                          <span className="font-semibold text-gray-900">{translateVal(listing.garage_type)}</span>
                        </div>
                      )}
                      {listing.rental_type && (
                        <div className="flex justify-between border-b border-gray-200 pb-2">
                          <span className="text-gray-500">{t.productDetail.rentalType}</span>
                          <span className="font-semibold text-gray-900">{translateVal(listing.rental_type)}</span>
                        </div>
                      )}
                      {listing.online_viewing && (
                        <div className="flex justify-between border-b border-gray-200 pb-2">
                          <span className="text-gray-500">{t.productDetail.onlineViewing}</span>
                          <span className="font-semibold text-gray-900">{translateVal(listing.online_viewing)}</span>
                        </div>
                      )}
                      {listing.commission && (
                        <div className="flex justify-between border-b border-gray-200 pb-2">
                          <span className="text-gray-500">{t.productDetail.commission}</span>
                          <span className="font-semibold text-gray-900">{translateVal(listing.commission)}</span>
                        </div>
                      )}
                      {listing.lage && (
                        <div className="flex justify-between border-b border-gray-200 pb-2">
                          <span className="text-gray-500">{t.productDetail.location}</span>
                          <span className="font-semibold text-gray-900">{translateVal(listing.lage)}</span>
                        </div>
                      )}
                    </div>

                    {/* Tags Section for Features - Refined Styling */}
                    <div className="mt-8 space-y-8">
                      {listing.amenities?.length > 0 && (
                        <div>
                          <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                            {t.productDetail.amenities}
                          </h3>
                          <div className="flex flex-wrap gap-x-8 gap-y-3">
                            {listing.amenities.map((item, i) => (
                              <span key={i} className="text-sm font-bold text-gray-800 flex items-center gap-2">
                                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                                {translateVal(item)}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {listing.general_features?.length > 0 && (
                        <div>
                          <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                            {t.productDetail.features}
                          </h3>
                          <div className="flex flex-wrap gap-x-8 gap-y-3">
                            {listing.general_features.map((item, i) => (
                              <span key={i} className="text-sm font-bold text-gray-800 flex items-center gap-2">
                                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                                {translateVal(item)}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {listing.apartment_features?.length > 0 && (
                        <div>
                          <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                            {t.productDetail.apartmentFeatures}
                          </h3>
                          <div className="flex flex-wrap gap-x-8 gap-y-3">
                            {listing.apartment_features.map((item, i) => (
                              <span key={i} className="text-sm font-bold text-gray-800 flex items-center gap-2">
                                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                                {translateVal(item)}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {listing.house_features?.length > 0 && (
                        <div>
                          <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                            {t.productDetail.houseFeatures}
                          </h3>
                          <div className="flex flex-wrap gap-x-8 gap-y-3">
                            {listing.house_features.map((item, i) => (
                              <span key={i} className="text-sm font-bold text-gray-800 flex items-center gap-2">
                                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                                {translateVal(item)}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Reise & Eventservices Details */}
                {listing.reise_eventservices_art && (
                  <div className="mb-8">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">
                      {t.productDetail.details}
                    </h2>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm bg-gray-50 p-6 rounded-xl border border-gray-100">
                      <div className="flex justify-between border-b border-gray-200 pb-2">
                        <span className="text-gray-500">{t.productDetail.art}</span>
                        <span className="font-semibold text-gray-900">{listing.reise_eventservices_art}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Çizgi - Beschreibung Ayırıcı */}
                <div className="border-t border-gray-200 my-6"></div>

                {/* Ürün Açıklaması */}
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">{t.productDetail.description}</h2>
                  <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
                    {description}
                  </p>
                </div>

                {/* Çizgi - Rechtliche Angaben Ayırıcı - Only for commercial sellers */}
                {sellerProfile?.seller_type === 'Gewerblicher Nutzer' && (
                  <>
                    <div className="border-t border-gray-200 my-6"></div>

                    {/* Rechtliche Angaben */}
                    <div>
                      <button
                        onClick={() => setShowLegal(!showLegal)}
                        className="flex items-center justify-between w-full text-lg font-semibold text-gray-900 hover:text-red-500"
                      >
                        <span>{t.productDetail.legalInfo}</span>
                        <svg
                          className={`w-5 h-5 transition-transform ${showLegal ? 'rotate-180' : ''}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {showLegal && (
                        <div className="mt-4 text-sm text-gray-600 space-y-2 border-t border-gray-100 pt-4">
                          <p>{t.productDetail.legalText}</p>
                          <p className="font-medium">{seller.name}</p>
                          <p>Örnek Mahallesi 123</p>
                          <p>34000 İstanbul</p>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {/* Çizgi - Nachricht Ayırıcı */}
                <div className="border-t border-gray-200 my-6"></div>

                {/* İlan Mesaj Paneli */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">{t.productDetail.messageToSeller}</h2>
                  <form onSubmit={handleSendMessage} className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1" htmlFor="contactName">
                        {t.addListing.name}
                      </label>
                      <input
                        type="text"
                        id="contactName"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder={t.addListing.name}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1" htmlFor="contactPhone">
                        {t.addListing.phoneNumber}
                      </label>
                      <input
                        type="tel"
                        id="contactPhone"
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        placeholder="+49 ..."
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1" htmlFor="contactMessage">
                        {t.addListing.description}
                      </label>
                      <textarea
                        id="contactMessage"
                        value={contactMessage}
                        onChange={(e) => setContactMessage(e.target.value)}
                        placeholder={t.productDetail.writeMessage}
                        rows={4}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300"
                        required
                      />
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        type="submit"
                        className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                      >
                        {t.productDetail.send}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setContactName('');
                          setContactPhone('');
                          setContactMessage('');
                        }}
                        className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-2 px-4 rounded-lg transition-colors"
                      >
                        {t.addListing.reset}
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              {/* Satıcının Diğer Ürünleri */}
              {(() => {
                // TODO: Fetch seller's other listings from Supabase
                const sellerOtherListings = [];

                if (sellerOtherListings.length === 0) return null;

                return (
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                      {seller.name}'in Diğer İlanları
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {sellerOtherListings.map((otherListing) => (
                        <div
                          key={otherListing.id}
                          onClick={() => navigate(`/product/${otherListing.id}`)}
                          className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer group border border-gray-200"
                        >
                          <div className="relative">
                            <img
                              src={otherListing.image}
                              alt={otherListing.title}
                              className="w-full h-32 object-cover"
                            />
                            {otherListing.isTop && (
                              <div className="absolute top-2 right-2 bg-purple-600 text-white px-2 py-1 rounded text-xs font-medium">
                                TOP
                              </div>
                            )}
                          </div>
                          <div className="p-3">
                            <h3 className="text-xs font-medium text-gray-800 mb-1 line-clamp-2 group-hover:text-red-500 transition-colors">
                              {otherListing.title}
                            </h3>
                            <div className="text-sm font-semibold text-gray-900 mb-1">
                              {otherListing.price}
                            </div>
                            {otherListing.shipping && (
                              <div className="text-xs text-gray-500 mb-1">
                                {otherListing.shipping}
                              </div>
                            )}
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <span>{otherListing.location}</span>
                              {otherListing.created_at && (
                                <div className="flex items-center gap-1">
                                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  <span>{new Date(otherListing.created_at).toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' })}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    {sellerListingsCount > sellerOtherListings.length && (
                      <button
                        onClick={() => navigate(`/seller/${seller?.user_number}`)}
                        className="mt-4 text-red-500 hover:text-red-600 font-medium text-sm"
                      >
                        {t.productDetail.allListings.replace('{count}', sellerListingsCount)} →
                      </button>
                    )}
                  </div>
                );
              })()}
            </div>



            {/* Sağ Taraf - Satıcı Profili */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4">
                {/* Satıcı Profil Bilgileri */}
                <div className="flex flex-col items-center gap-4 mb-4 pb-4 border-b text-center">
                  <img
                    key={seller.store_logo || seller.avatar_url || 'default-avatar'}
                    src={seller.store_logo || seller.avatar_url || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(seller.full_name || 'User') + '&background=ef4444&color=fff&size=200'}
                    alt={seller.full_name}
                    className="w-24 h-24 rounded-full object-cover cursor-pointer hover:opacity-90 transition-opacity border-4 border-gray-100"
                    onClick={() => {
                      if (seller.is_pro || seller.is_commercial || (seller.subscription_tier && seller.subscription_tier !== 'free')) {
                        navigate(`/store/${seller.id}`);
                      } else {
                        navigate(`/seller/${seller.user_number || sellerProfile?.user_number}`);
                      }
                    }}
                  />
                  <div className="flex-1 w-full">
                    <div
                      className="font-semibold text-xl text-gray-900 cursor-pointer hover:text-red-500 transition-colors mb-2"
                      onClick={() => {
                        if (seller.is_pro || seller.is_commercial || (seller.subscription_tier && seller.subscription_tier !== 'free')) {
                          navigate(`/store/${seller.id}`);
                        } else {
                          navigate(`/seller/${seller.user_number || sellerProfile?.user_number}`);
                        }
                      }}
                    >
                      {listing.contact_name || seller.full_name || t.productDetail.unknownSeller}
                    </div>

                    {/* Enhanced Seller Badges */}
                    <div className="flex flex-wrap justify-center gap-2 mb-4">
                      {seller.is_pro && (
                        <div className="bg-red-600 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-lg border-2 border-white hover:bg-red-700 transition-colors flex items-center gap-1">
                          <span>⭐ PRO MAĞAZA</span>
                        </div>
                      )}
                      {(seller.is_commercial || sellerProfile?.seller_type === 'Gewerblicher Nutzer' || (seller && seller.seller_type === 'commercial')) && (
                        <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-lg border-2 border-white hover:bg-blue-700 transition-colors flex items-center gap-1">
                          <span>🏢 KURUMSAL SATICI</span>
                        </div>
                      )}
                    </div>

                    {(seller.is_pro || seller.is_commercial || sellerProfile?.seller_type === 'Gewerblicher Nutzer' || (seller && seller.seller_type === 'commercial')) && (
                      <button
                        onClick={() => navigate(`/store/${seller.id}`)}
                        className="w-full mb-3 py-2 bg-gradient-to-r from-gray-900 to-gray-800 text-white text-xs font-bold rounded-lg hover:from-black hover:to-gray-900 transition-all shadow-sm flex items-center justify-center gap-2"
                      >
                        🏪 MAĞAZAYI ZİYARET ET
                      </button>
                    )}

                    {/* City Location */}
                    {(listing.city || listing.address) && (
                      <div className="flex items-center justify-center gap-1.5 mb-2">
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="text-sm text-gray-600">
                          {listing.city || ''}
                        </span>
                      </div>
                    )}

                    {!isCommercial && (
                      <div className="text-xs uppercase tracking-wide text-red-500 font-semibold mb-2">{sellerTypeLabel}</div>
                    )}

                    {/* Last Seen Indicator */}
                    <div className="flex items-center justify-center gap-1.5 mb-2">
                      <div className={`w-2 h-2 rounded-full ${seller.last_seen && (new Date() - new Date(seller.last_seen)) < 5 * 60 * 1000 ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
                      <span className="text-sm font-medium text-gray-700">
                        {formatLastSeen(seller.last_seen)}
                      </span>
                    </div>

                    <div className="text-xs text-gray-500 font-medium">{t.productDetail.memberSince} {activeSinceDisplay}</div>

                    {/* Seller Rating */}
                    {sellerRating && (
                      <div className="mt-3">
                        <RatingDisplay
                          userRating={sellerRating}
                          showDetails={false}
                          size="small"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Satıcıyı Takip Et Butonu */}
                <button
                  onClick={async () => {
                    setFollowLoading(true);
                    await toggleFollowSeller(listing.user_id);
                    setFollowLoading(false);
                  }}
                  disabled={followLoading}
                  className={`w-full border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-3 px-4 rounded-lg transition-colors mb-3 flex items-center justify-center gap-2 ${isSellerFollowed(listing.user_id) ? 'bg-green-50 border-green-500 text-green-700' : ''
                    } ${followLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {followLoading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {t.productDetail.loading}
                    </>
                  ) : (
                    <>
                      <svg className={`w-5 h-5 ${isSellerFollowed(listing.user_id) ? 'text-green-500' : 'text-blue-500'}`} fill={isSellerFollowed(listing.user_id) ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      {isSellerFollowed(listing.user_id) ? t.productDetail.followingSeller : t.productDetail.followSeller}
                    </>
                  )}
                </button>


                {/* Mesaj Gönderme Butonu */}
                <button
                  type="button"
                  onClick={() => setShowMessageModal(true)}
                  className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-3 px-4 rounded-lg transition-colors mb-3 flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  {t.productDetail.send}
                </button>

                {/* Telefon Butonu */}
                {!showPhone ? (
                  <button
                    type="button"
                    onClick={() => setShowPhone(true)}
                    className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-3 px-4 rounded-lg transition-colors mb-3 flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {t.productDetail.call}
                  </button>
                ) : (
                  <a
                    href={listing.show_phone_number === true ? (listing.contact_phone ? `tel:${listing.contact_phone.replace(/\s+/g, '')}` : (seller?.phone ? `tel:${seller.phone.replace(/\s+/g, '')}` : '#')) : '#'}
                    className="w-full border border-gray-300 hover:bg-green-50 hover:border-green-500 text-gray-700 hover:text-green-700 font-semibold py-3 px-4 rounded-lg transition-colors mb-3 flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {listing.show_phone_number === true ? (listing.contact_phone || seller?.phone || t.productDetail.noPhoneNumber) : t.productDetail.noPhoneNumber}
                  </a>
                )}

                {/* Satıcının Diğer İlanlarına Hızlı Erişim */}
                {sellerListingsCount > 0 && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
                    {t.productDetail.moreListingsFrom.replace('{name}', seller.name)}
                    <button
                      onClick={() => navigate(`/seller/${listing.sellerId}`)}
                      className="text-sm text-red-500 hover:text-red-600 font-medium"
                    >
                      {t.productDetail.allListings.replace('{count}', '')} →
                    </button>
                  </div>
                )}

                {/* Warenkorb Section Removed as per request for Autos & Wohnwagen */}
                <MessageModal
                  isOpen={showMessageModal}
                  onClose={() => setShowMessageModal(false)}
                  onSubmit={handleModalSubmit}
                  sellerName={seller.name}
                  listingTitle={listing.title}
                />

                {/* Teilen & Drucken */}
                <div className="mt-4 space-y-3 pt-4 border-t border-gray-100 no-print">
                  <button
                    onClick={handleShare}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    {t.productDetail.share}
                  </button>
                  <button
                    onClick={() => {
                      window.print();
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 9V2h12v7M6 18H5a2 2 0 01-2-2v-5h18v5a2 2 0 01-2 2h-1m-12 0h12v4H6v-4z" />
                    </svg>
                    {t.productDetail.printFlyer}
                  </button>

                  <button
                    onClick={() => setShowReportModal(true)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors text-gray-700"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    {t.productDetail.report}
                  </button>
                </div>

                {/* Sicherheitstipps */}
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                  <div className="flex items-start gap-2 mb-3">
                    <span className="text-xl">💡</span>
                    <h3 className="font-semibold text-gray-900">{t.productDetail.safetyTips}:</h3>
                  </div>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-600 mt-0.5">•</span>
                      <span>{t.productDetail.safetyTip1}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-600 mt-0.5">•</span>
                      <span>{t.productDetail.safetyTip2}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-600 mt-0.5">•</span>
                      <span>{t.productDetail.safetyTip3}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>


        {/* Ähnliche Anzeigen Section */}
        {
          similarListings.length > 0 && (
            <div className="max-w-7xl mx-auto px-4 py-8 border-t border-gray-200 mt-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">{t.productDetail.similarListings}</h2>
              <div className="flex flex-col gap-4">
                {similarListings.map((similar) => (
                  <HorizontalListingCard
                    key={similar.id}
                    listing={similar}
                    toggleFavorite={toggleFavorite}
                    isFavorite={isFavorite}
                  />
                ))}
              </div>
            </div>
          )
        }


        {/* Report Modal */}
        <ReportModal
          isOpen={showReportModal}
          onClose={() => setShowReportModal(false)}
          onSubmit={handleReportSubmit}
          reason={reportReason}
          setReason={setReportReason}
          description={reportDescription}
          setDescription={setReportDescription}
        />

        {/* Seller's Recent Listings */}
        {sellerRecentListings.length > 0 && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Bu Satıcının Diğer İlanları
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {sellerRecentListings.map(item => (
                <ListingCard
                  key={item.id}
                  listing={item}
                  toggleFavorite={toggleFavorite}
                  isFavorite={isFavorite}
                />
              ))}
            </div>
          </div>
        )}

        {/* Category Related Listings */}
        {categoryListings.length > 0 && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              {listing?.category} Kategorisindeki Benzer İlanlar
            </h2>
            <div className="space-y-4">
              {categoryListings.map(item => (
                <HorizontalListingCard
                  key={item.id}
                  listing={item}
                  toggleFavorite={toggleFavorite}
                  isFavorite={isFavorite}
                  compact={true}
                />
              ))}
            </div>
          </div>
        )}
        {/* Mobile Sticky Contact Buttons */}
        {isMobile && !isOwnListing && (
          <div className="fixed bottom-0 left-0 right-0 z-[100] bg-white/80 backdrop-blur-md border-t border-gray-200 p-4 flex gap-3 pb-safe no-print">
            <button
              id="mobile-contact-message"
              onClick={() => setShowMessageModal(true)}
              className="flex-1 bg-red-600 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg hover:bg-red-700 transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              {t.productDetail.send}
            </button>
            {(!showPhone) ? (
              <button
                id="mobile-contact-phone-reveal"
                onClick={() => setShowPhone(true)}
                className="flex-1 bg-white border-2 border-green-600 text-green-700 font-bold py-3.5 px-4 rounded-xl shadow-md hover:bg-green-50 transition-all flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {t.productDetail.call}
              </button>
            ) : (
              <a
                id="mobile-contact-call"
                href={listing.show_phone_number === true ? (listing.contact_phone ? `tel:${listing.contact_phone.replace(/\s+/g, '')}` : (seller?.phone ? `tel:${seller.phone.replace(/\s+/g, '')}` : '#')) : '#'}
                className="flex-1 bg-green-600 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg hover:bg-green-700 transition-all flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {listing.show_phone_number === true ? (listing.contact_phone || seller?.phone || t.productDetail.noPhoneNumber) : t.productDetail.noPhoneNumber}
              </a>
            )}
          </div>
        )}
      </div>
    </>
  );
};

// All Categories Component
export const AllCategories = ({ setSelectedCategory }) => {
  const navigate = useNavigate();
  const [categories, setCategories] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        const { fetchCategoriesWithCounts } = await import('./api/categories');
        const data = await fetchCategoriesWithCounts();
        setCategories(data);
      } catch (error) {
        console.error('Error loading categories:', error);
      } finally {
        setLoading(false);
      }
    };
    loadCategories();
  }, []);

  // Scroll to top when component mounts
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mb-4"></div>
          <p className="text-gray-600">Kategorien werden geladen...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-6">
          <button
            onClick={() => navigate('/')}
            className="text-red-500 hover:text-red-600 flex items-center gap-2 mb-4"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {t.common.backToHome}
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Alle Kategorien</h1>
        </div>

        <CategoryGallery
          toggleFavorite={() => { }}
          isFavorite={() => false}
        />

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.filter(c => c.name !== 'Alle Kategorien').map((category) => (
              <div key={category.name} className="space-y-3">
                <h2
                  onClick={() => navigate(getCategoryPath(category.name))}
                  className="text-xl font-semibold text-gray-900 flex items-center justify-between border-b border-gray-100 pb-2 cursor-pointer hover:text-red-500 transition-colors"
                >
                  <span className="flex-1">{category.name}</span>
                  <span className="text-sm font-normal text-gray-500">({category.count})</span>
                </h2>
                <ul className="space-y-2">
                  {category.subcategories?.map((sub) => (
                    <li key={sub.name}>
                      <button
                        onClick={() => navigate(getCategoryPath(category.name, sub.name))}
                        className="text-gray-600 hover:text-red-500 hover:underline text-sm flex items-center justify-between w-full text-left"
                      >
                        <span>{sub.name}</span>
                        <span className="text-gray-400 text-xs">({sub.count})</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Seller Profile Component
export const SellerProfile = () => {
  const { sellerId } = useParams();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('Alle');

  const [seller, setSeller] = useState(null);
  const [sellerListings, setSellerListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSellerData = async () => {
      try {
        setLoading(true);
        // Fetch listings
        const { fetchUserListings } = await import('./api/listings');
        const listings = await fetchUserListings(sellerId);
        setSellerListings(listings);

        // Fetch seller profile
        const { fetchUserProfile } = await import('./api/profile');
        const profile = await fetchUserProfile(sellerId);

        if (profile) {
          setSeller({
            id: sellerId,
            name: profile.full_name || (listings.length > 0 ? listings[0].sellerName : 'Verkäufer'),
            rating: 4.5,
            totalSales: listings.length,
            memberSince: profile.created_at,
            profileImage: profile.store_logo || profile.avatar_url || (listings.length > 0 ? listings[0].sellerAvatar : null),
            seller_type: profile.seller_type,
            is_commercial: profile.is_commercial
          });
        } else if (listings.length > 0) {
          // Fallback to listing data if profile fetch fails
          setSeller({
            id: sellerId,
            name: listings[0].sellerName || 'Verkäufer',
            rating: 4.5,
            totalSales: listings.length
          });
        }
      } catch (error) {
        console.error('Error loading seller data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadSellerData();
  }, [sellerId]);

  if (!seller) return <div className="p-8">{t.sellerProfile.sellerNotFound}</div>;

  // Calculate categories and counts
  const categories = sellerListings.reduce((acc, listing) => {
    const cat = listing.category || t.common.others;
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, { [t.sellerProfile.all]: sellerListings.length });

  // Filter listings
  const filteredListings = selectedCategory === t.sellerProfile.all
    ? sellerListings
    : sellerListings.filter(l => (l.category || t.common.others) === selectedCategory);

  const activeSinceDisplay = seller.memberSince
    ? new Date(seller.memberSince).toLocaleDateString('tr-TR')
    : (seller.activeSince || '-');

  // Determine seller type label
  const sellerTypeLabel = seller.seller_type === 'Gewerblicher Nutzer' ? t.addListing.commercial : t.addListing.private;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 text-red-500 hover:text-red-600 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          {t.productDetail.back}
        </button>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <img
              src={seller.profileImage}
              alt={seller.name}
              className="w-24 h-24 rounded-full object-cover border-4 border-gray-100"
            />
            <div className="text-center md:text-left flex-1">
              <h1 className="text-2xl font-bold text-gray-900">{seller.name}</h1>
              <div className={`text-sm uppercase tracking-wide font-semibold mt-1 flex items-center gap-2 ${seller.is_commercial ? 'text-blue-600' : 'text-gray-500'}`}>
                {seller.is_commercial && (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
                {seller.is_commercial ? 'Kurumsal Mağaza' : sellerTypeLabel}
              </div>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-3 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {t.productDetail.memberSince}: {activeSinceDisplay}
                </div>
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  {t.productDetail.listingsOnline.replace('{count}', sellerListings.length)}
                </div>
                {seller.rating > 0 && (
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                    {seller.rating} ({seller.totalRatings} {t.productDetail.ratings})
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => toggleFollowSeller(seller.id)}
                className={`px-6 py-2 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 font-medium ${isSellerFollowed(seller.id) ? 'bg-green-50 border border-green-500 text-green-700' : 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700'}`}
              >
                {isSellerFollowed(seller.id) ? t.sellerProfile.followed : t.sellerProfile.follow}
              </button>
              <button
                onClick={() => setShowMessageModal(true)}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                {t.sellerProfile.message}
              </button>
            </div>
          </div>
        </div>

        <MessageModal
          isOpen={showMessageModal}
          onClose={() => setShowMessageModal(false)}
          onSubmit={handleModalSubmit}
          sellerName={seller.name}
          listingTitle={t.sellerProfile.inquiryToSeller}
        />

        <div className="flex flex-col sm:flex-row gap-8">
          {/* Sidebar Categories */}
          <div className="sm:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-4 sticky top-4">
              <h3 className="font-semibold text-gray-900 mb-4 pb-2 border-b">{t.sellerProfile.categories}</h3>
              <ul className="space-y-2">
                {Object.entries(categories).map(([category, count]) => (
                  <li key={category}>
                    <button
                      onClick={() => setSelectedCategory(category)}
                      className={`w-full flex items-center justify-between text-sm px-2 py-1.5 rounded-md transition-colors ${selectedCategory === category
                        ? 'bg-red-50 text-red-600 font-medium'
                        : 'text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                      <span>{category}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${selectedCategory === category
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-500'
                        }`}>
                        {count}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Listings Grid */}
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {selectedCategory === t.sellerProfile.all ? t.sellerProfile.activeListings : selectedCategory} von {seller.name}
            </h2>
            <div className="flex flex-col gap-4">
              {filteredListings.map((listing) => (
                <HorizontalListingCard
                  key={listing.id}
                  listing={listing}
                  toggleFavorite={toggleFavorite}
                  isFavorite={isFavorite}
                  compact={true}
                />
              ))}
              {filteredListings.length === 0 && (
                <div className="text-center py-12 text-gray-500 bg-white rounded-lg border border-dashed border-gray-300">
                  {t.sellerProfile.sellerNotFound}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Horizontal Listing Card Component


// Satıcı Sayfası Bileşeni
export const SellerPage = ({ toggleFavorite, isFavorite, toggleFollowSeller, isSellerFollowed }) => {

  const { sellerId } = useParams();
  const navigate = useNavigate();

  // IMPORTANT: All hooks must be called at the top, before any conditional returns
  const { user } = useAuth(); // Get current user for isOwnProfile check

  // State for seller data
  const [seller, setSeller] = useState(null);
  const [sellerListings, setSellerListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('Alle');
  const [activeTab, setActiveTab] = useState('listings'); // Tab state for own profile
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [followLoading, setFollowLoading] = useState(false);

  // Initialize states
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Check if current user is viewing their own profile
  // IMPORTANT: This must be defined BEFORE any conditional returns
  // Compare user.id with seller.id (both are UUIDs)
  const isOwnProfile = user && seller && user.id === seller.id;

  // Fetch seller profile and listings from Supabase
  useEffect(() => {
    const loadSellerData = async () => {
      if (!sellerId) return;

      try {
        setLoading(true);
        setError(null); // Clear previous errors
        console.log('=== LOADING SELLER DATA ===');
        console.log('Seller ID/Number:', sellerId);

        // Check if sellerId is a UUID (format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(sellerId);

        let profile;
        if (isUUID) {
          // Fetch by UUID
          console.log('Fetching profile by UUID');
          const { fetchUserProfile } = await import('./api/profile');
          profile = await fetchUserProfile(sellerId);
        } else {
          // Fetch by user_number
          console.log('Fetching profile by user_number');
          const { fetchUserProfileByNumber } = await import('./api/profile');
          profile = await fetchUserProfileByNumber(sellerId);
        }

        console.log('Fetched seller profile:', profile);

        if (!profile) {
          throw new Error('Profile not found');
        }
        setSeller(profile); // Set seller state

        // Fetch seller's listings using the UUID from the fetched profile
        console.log('Fetching listings for seller ID:', profile.id); // Use profile.id
        const { fetchUserListings } = await import('./api/listings');
        const userListings = await fetchUserListings(profile.id); // Use profile.id
        console.log('Fetched seller listings:', userListings);
        setSellerListings(userListings || []); // Set sellerListings state
      } catch (error) {
        console.error('Error loading seller data:', error);
        console.error('Error details:', error.message, error.stack);
        setSeller(null);
        setSellerListings([]);
        setError(t.sellerProfile.sellerNotFound);
      } finally {
        setLoading(false);
      }
    };

    loadSellerData();
  }, [sellerId]);

  // Load follower/following counts
  useEffect(() => {
    const loadFollowCounts = async () => {
      if (!seller?.id) return;

      try {
        const { getFollowersCount, getFollowingCount } = await import('./api/follows');
        const [followers, following] = await Promise.all([
          getFollowersCount(seller.id),
          getFollowingCount(seller.id)
        ]);
        setFollowersCount(followers);
        setFollowingCount(following);
      } catch (error) {
        console.error('Error loading follow counts:', error);
      }
    };

    loadFollowCounts();
  }, [seller?.id]);

  // Scroll to top when page loads
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [sellerId]);

  const handleModalSubmit = async (data) => {
    try {
      const { sendMessage } = await import('./api/messages');
      // Send message to seller without listing ID (general inquiry)
      await sendMessage(seller.id, data.message, null);
      alert(t.sellerProfile.messageSuccess);
      setShowMessageModal(false);
    } catch (error) {
      console.error('Error sending message:', error);
      alert(t.sellerProfile.messageError);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mb-4"></div>
          <p className="text-gray-600">{t.sellerProfile.loadingSeller}</p>
        </div>
      </div>
    );
  }

  // Show error if seller not found
  if (!seller) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{t.sellerProfile.sellerNotFound}</h2>
          <p className="text-gray-600 mb-4">{t.sellerProfile.sellerDoesNotExist}</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            {t.sellerProfile.backToHome}
          </button>
        </div>
      </div>
    );
  }

  // Satıcının ilanlarını filtrele
  // const sellerListings = mockListings.filter(l => String(l.sellerId) === sellerId); // This line is now handled by state

  // Satıcının ilanlarına göre kategorileri belirle
  const sellerCategories = sellerListings.reduce((acc, listing) => {
    const cat = listing.category;
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});

  // Filter listings by selected category
  const filteredListings = selectedCategory === 'Alle' || selectedCategory === t.sellerProfile.all
    ? sellerListings
    : sellerListings.filter(l => l.category === selectedCategory);

  if (!seller) {
    return <div className="p-8 text-center">{t.sellerProfile.sellerNotFound}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 text-red-500 hover:text-red-600 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          {t.productDetail.back}
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Seller Info & Categories */}
          <div className="lg:col-span-1 space-y-6">
            {/* Seller Profile Card */}
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              {/* Profile Picture - Centered at top */}
              <div className="mb-4">
                <img
                  src={seller.store_logo || seller.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(seller.full_name || 'User')}&background=ef4444&color=fff&size=200`}
                  alt={seller.full_name}
                  className="w-24 h-24 rounded-full object-cover border-4 border-gray-100 mx-auto shadow-md"
                />
              </div>

              {/* Seller Name */}
              <div className="mb-3">
                <h2 className="text-2xl font-bold text-gray-900">{seller.full_name || t.productDetail.unknownSeller}</h2>
              </div>

              {/* User Type Badge */}
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${(seller.sellerType || seller.seller_type) === 'Gewerblicher Nutzer'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-800'
                  }`}>
                  {(seller.sellerType || seller.seller_type) === 'Gewerblicher Nutzer' ? t.addListing.commercial : t.addListing.private}
                </span>
              </div>

              {/* Member Status & Since */}
              <div className="flex flex-col items-center gap-1 mb-4">
                <div className="flex items-center gap-1.5">
                  <div className={`w-2 h-2 rounded-full ${seller.last_seen && (new Date() - new Date(seller.last_seen)) < 5 * 60 * 1000 ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
                  <span className="text-sm font-bold text-gray-700">
                    {formatLastSeen(seller.last_seen)}
                  </span>
                </div>
                <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">{t.sellerProfile.memberSince} {seller.created_at ? new Date(seller.created_at).getFullYear() : 'N/A'}</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-100">
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-center">
                    <div className="text-lg font-extrabold text-gray-900">{sellerListings.length}</div>
                    <div className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter">{t.sellerProfile.listings}</div>
                  </div>
                  <div className="text-center border-l border-gray-200">
                    <div className="text-lg font-extrabold text-gray-900">{followersCount}</div>
                    <div className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter">{t.sellerProfile.followers}</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons - Only show for other users' profiles */}
              {!isOwnProfile && (
                <div className="space-y-3">
                  <button
                    onClick={async () => {
                      setFollowLoading(true);
                      await toggleFollowSeller(seller.id);
                      // Refresh follower count after follow/unfollow
                      try {
                        const { getFollowersCount } = await import('./api/follows');
                        const newCount = await getFollowersCount(seller.id);
                        setFollowersCount(newCount);
                      } catch (error) {
                        console.error('Error refreshing follower count:', error);
                      }
                      setFollowLoading(false);
                    }}
                    disabled={followLoading}
                    className={`w-full font-semibold py-2 px-4 rounded-lg shadow-sm transition-all duration-200 flex items-center justify-center gap-2 ${isSellerFollowed(seller.id)
                      ? 'bg-white text-gray-800 border border-gray-300 hover:bg-gray-50'
                      : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white'
                      } ${followLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {followLoading ? (
                      <>
                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {t.sellerProfile.loading}
                      </>
                    ) : (
                      isSellerFollowed(seller.id) ? t.sellerProfile.followed : t.sellerProfile.follow
                    )}
                  </button>
                  <button
                    onClick={() => setShowMessageModal(true)}
                    className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-2 px-4 rounded-lg transition-colors"
                  >
                    {t.sellerProfile.message}
                  </button>
                </div>
              )}
            </div>

            {/* Tab Navigation - Only show for own profile */}
            {isOwnProfile && (
              <div className="bg-white rounded-lg shadow-sm p-4 sticky top-6">
                <h3 className="font-semibold text-gray-900 mb-4 pb-2 border-b">{t.sellerProfile.myProfile}</h3>
                <nav className="space-y-1">
                  {[
                    { id: 'listings', name: t.nav.myListings },
                    { id: 'favorites', name: t.nav.favorites },
                    { id: 'messages', name: t.nav.messages },
                    { id: 'following', name: t.sellerProfile.following },
                    { id: 'settings', name: t.nav.settings }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${activeTab === tab.id
                        ? 'bg-red-50 text-red-600 font-semibold'
                        : 'text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                      <span className="text-sm">{tab.name}</span>
                    </button>
                  ))}
                </nav>
              </div>
            )}

            {/* Categories - Only show when not in own profile or when viewing listings */}
            {(!isOwnProfile || activeTab === 'listings') && (
              <div className="bg-white rounded-lg shadow-sm p-4 sticky top-6">
                <h3 className="font-semibold text-gray-900 mb-4 pb-2 border-b">{t.sellerProfile.categories}</h3>
                <ul className="space-y-2">
                  <li
                    onClick={() => setSelectedCategory('Alle')}
                    className={`flex justify-between items-center font-medium cursor-pointer transition-colors ${selectedCategory === 'Alle' ? 'text-red-500' : 'text-gray-600 hover:text-red-500'}`}
                  >
                    <span>{t.sellerProfile.all}</span>
                    <span className="bg-gray-100 px-2 py-0.5 rounded-full text-xs text-gray-600">{sellerListings.length}</span>
                  </li>
                  {Object.entries(sellerCategories).map(([catName, count]) => (
                    <li
                      key={catName}
                      onClick={() => setSelectedCategory(catName)}
                      className={`flex justify-between items-center cursor-pointer transition-colors ${selectedCategory === catName ? 'text-red-500 font-medium' : 'text-gray-600 hover:text-red-500'}`}
                    >
                      <span>{catName}</span>
                      <span className="bg-gray-100 px-2 py-0.5 rounded-full text-xs text-gray-600">{count}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Right Side - Tab Content */}
          <div className="lg:col-span-3">
            {/* Listings Tab - Show seller info and listings */}
            {(!isOwnProfile || activeTab === 'listings') && (
              <div>
                {/* Seller Info Panel */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6 font-sans">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest border-b border-gray-50 pb-2">{t.sellerProfile.contact}</h2>
                      <div className="space-y-3">
                        {seller.phone && (
                          <div className="flex items-center gap-3 group">
                            <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-500 group-hover:bg-red-500 group-hover:text-white transition-all shadow-sm">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                              </svg>
                            </div>
                            <span className="text-sm font-semibold text-gray-700">{seller.phone}</span>
                          </div>
                        )}
                        {seller.address && (
                          <div className="flex items-center gap-3 group">
                            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all shadow-sm">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                            </div>
                            <span className="text-sm font-semibold text-gray-700">
                              {seller.street ? `${seller.street}, ` : ''}{seller.city}
                            </span>
                          </div>
                        )}
                        {seller.website && (
                          <div className="flex items-center gap-3 group">
                            <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-500 group-hover:bg-purple-500 group-hover:text-white transition-all shadow-sm">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                              </svg>
                            </div>
                            <a href={`http://${seller.website}`} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-gray-700 hover:text-red-600 transition-colors">
                              {seller.website}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest border-b border-gray-50 pb-2">{t.sellerProfile.stats}</h2>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex flex-col items-center justify-center shadow-inner group hover:bg-white hover:border-red-100 transition-all duration-300">
                          <div className="text-2xl font-black text-gray-900 group-hover:text-red-600 transition-colors">{followingCount}</div>
                          <div className="text-[10px] text-gray-400 uppercase font-black tracking-tighter">{t.sellerProfile.following}</div>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex flex-col items-center justify-center shadow-inner group hover:bg-white hover:border-red-100 transition-all duration-300">
                          <div className="text-2xl font-black text-gray-900 group-hover:text-red-600 transition-colors">{sellerListings.filter(l => l.status === 'active').length}</div>
                          <div className="text-[10px] text-gray-400 uppercase font-black tracking-tighter">{t.sellerProfile.activeListings}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">{t.sellerProfile.activeListings}</h2>
                  <div className="grid grid-cols-1 gap-4">
                    {filteredListings.map(listing => (
                      <HorizontalListingCard
                        key={listing.id}
                        listing={listing}
                        toggleFavorite={toggleFavorite}
                        isFavorite={isFavorite}
                        isOwnListing={isOwnProfile}
                        compact={true}
                      />
                    ))}
                  </div>
                  {filteredListings.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                      {t.sellerProfile.sellerNotFound}
                    </div>
                  )}
                </div>
              </div >
            )}
          </div >

          <MessageModal
            isOpen={showMessageModal}
            onClose={() => setShowMessageModal(false)}
            onSubmit={handleModalSubmit}
            sellerName={seller.full_name || t.sellerProfile.message}
            listingTitle={t.sellerProfile.inquiryToSeller}
          />
        </div >
      </div >
    </div >
  );
};

// Footer Component
export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-12 pb-8 mt-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-8">
          {/* Kleinanzeigen */}
          <div>
            <h3 className="text-white font-semibold mb-4">LokalPazar</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/ueber-uns" className="hover:text-white transition-colors">{t.footer.aboutUs}</a></li>
              <li><a href="/karriere" className="hover:text-white transition-colors">{t.footer.career}</a></li>
              <li><a href="/presse" className="hover:text-white transition-colors">{t.footer.press}</a></li>
              <li><a href="/kleinbazaar-magazin" className="hover:text-white transition-colors">{t.footer.magazine}</a></li>
              <li><a href="/engagement" className="hover:text-white transition-colors">{t.footer.engagement}</a></li>
              <li><a href="/mobile-apps" className="hover:text-white transition-colors">{t.footer.mobileApps}</a></li>
            </ul>
          </div>

          {/* Informationen */}
          <div>
            <h3 className="text-white font-semibold mb-4">{t.footer.information}</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">{t.footer.help}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t.footer.safetyTips}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t.footer.reportVulnerability}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t.footer.youthProtection}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t.footer.accessibility}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t.footer.privacyPolicy}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t.footer.privacySettings}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t.footer.terms}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t.footer.imprint}</a></li>
            </ul>
          </div>

          {/* Für Unternehmen */}
          <div>
            <h3 className="text-white font-semibold mb-4">{t.footer.forCompanies}</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">LokalPazar Emlak</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t.footer.proInfopoint}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t.footer.proPackages}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t.footer.advertising}</a></li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-white font-semibold mb-4">{t.footer.socialMedia}</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Facebook</a></li>
              <li><a href="#" className="hover:text-white transition-colors">YouTube</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Instagram</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Threads</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Pinterest</a></li>
              <li><a href="#" className="hover:text-white transition-colors">TikTok</a></li>
            </ul>
          </div>

          {/* Allgemein */}
          <div>
            <h3 className="text-white font-semibold mb-4">{t.footer.general}</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/categories" className="hover:text-white transition-colors">{t.footer.allCategories}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t.footer.popularSearches}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t.footer.listingsOverview}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t.footer.companyOverview}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t.footer.carEvaluation}</a></li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
          <p>{t.footer.copyright}</p>
        </div>
      </div>
    </footer>
  );
};

// Report Modal Component
export const ReportModal = ({ isOpen, onClose, onSubmit, reason, setReason, description, setDescription }) => {
  if (!isOpen) return null;

  const reportReasons = [
    { value: 'spam', label: 'Spam oder Betrug' },
    { value: 'inappropriate', label: 'Unangemessener Inhalt' },
    { value: 'duplicate', label: 'Doppelte Anzeige' },
    { value: 'wrong_category', label: 'Falsche Kategorie' },
    { value: 'sold', label: 'Bereits verkauft' },
    { value: 'other', label: 'Sonstiges' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">{t.productDetail.reportTitle}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.productDetail.reportReasonTitle}
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                required
              >
                <option value="">{t.productDetail.pleaseChoose}</option>
                {Object.entries(t.productDetail.reportReasons).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.productDetail.reportDescriptionLabel}
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                placeholder={t.productDetail.reportDescriptionPlaceholder}
              />
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm text-gray-700">
                <strong>{t.addListing.details}:</strong> {t.productDetail.reportNotice}
              </p>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 font-medium"
            >
              {t.productDetail.reportCancel}
            </button>
            <button
              onClick={onSubmit}
              className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors font-medium"
            >
              {t.productDetail.reportSubmit}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Export ReservationButton
export { ReservationButton };