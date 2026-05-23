import React from 'react';
import { useNavigate } from 'react-router-dom';

const CATEGORIES = [
  { name: 'Otomobil', icon: '🚗', color: '#EFF6FF', path: '/Otomobil-Bisiklet-Tekne' },
  { name: 'Emlak', icon: '🏠', color: '#F0FDF4', path: '/Emlak' },
  { name: 'Ev & Bahçe', icon: '🛋️', color: '#FFF7ED', path: '/Ev-Bahce' },
  { name: 'Elektronik', icon: '📱', color: '#F5F3FF', path: '/Elektronik' },
  { name: 'Moda', icon: '👗', color: '#FFF1F2', path: '/Moda-Guzellik' },
  { name: 'Evcil Hayvan', icon: '🐾', color: '#ECFDF5', path: '/Evcil-Hayvanlar' },
  { name: 'Çocuk & Bebek', icon: '👶', color: '#FEF9C3', path: '/Aile-Cocuk-Bebek' },
  { name: 'İş İlanları', icon: '💼', color: '#EFF6FF', path: '/Is-Ilanlari' },
  { name: 'Hobi', icon: '🎮', color: '#FDF4FF', path: '/Eglence-Hobi-Mahalle' },
  { name: 'Müzik & Kitap', icon: '📚', color: '#F0FDF4', path: '/Muzik-Film-Kitap' },
  { name: 'Biletler', icon: '🎟️', color: '#FFF7ED', path: '/Biletler' },
  { name: 'Hizmetler', icon: '🔧', color: '#F1F5F9', path: '/Hizmetler' },
  { name: 'Eğitim', icon: '🎓', color: '#ECFEFF', path: '/Egitim-Kurslar' },
  { name: 'Ücretsiz', icon: '🤝', color: '#FFFBEB', path: '/Ucretsiz-Takas' },
  { name: 'Komşuluk', icon: '🏘️', color: '#F0FDF4', path: '/Komsu-Yardimi' },
  { name: 'Tüm Kategoriler', icon: '☰', color: '#F8FAFC', path: '/Butun-Kategoriler' },
];

const MobileCategoryGrid = ({ setSelectedCategory }) => {
  const navigate = useNavigate();

  const handleCategoryClick = (cat) => {
    navigate(cat.path);
  };

  return (
    <div className="lg:hidden mt-3 mb-1">
      <div className="grid grid-cols-4 gap-2 px-1">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.name}
            onClick={() => handleCategoryClick(cat)}
            className="flex flex-col items-center justify-start gap-1.5 p-2 rounded-2xl transition-all duration-150 active:scale-95 hover:opacity-80 focus:outline-none text-center"
            style={{ backgroundColor: cat.color }}
          >
            <span className="text-2xl leading-none">{cat.icon}</span>
            <span className="text-[10px] font-semibold text-gray-700 dark:text-gray-800 leading-tight line-clamp-2">
              {cat.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MobileCategoryGrid;
