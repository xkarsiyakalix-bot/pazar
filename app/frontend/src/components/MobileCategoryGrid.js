import React from 'react';
import { useNavigate } from 'react-router-dom';

const CATEGORIES = [
  { name: 'Otomobil', icon: '🚗', color: '#EFF6FF', path: '/autos' },
  { name: 'Emlak', icon: '🏠', color: '#F0FDF4', path: '/immobilien' },
  { name: 'Ev & Bahçe', icon: '🛋️', color: '#FFF7ED', path: '/haus-garten' },
  { name: 'Elektronik', icon: '📱', color: '#F5F3FF', path: '/elektronik' },
  { name: 'Moda', icon: '👗', color: '#FFF1F2', path: '/mode-beauty' },
  { name: 'Evcil Hayvan', icon: '🐾', color: '#ECFDF5', path: '/haustiere' },
  { name: 'Çocuk & Bebek', icon: '👶', color: '#FEF9C3', path: '/familie-kind-baby' },
  { name: 'İş İlanları', icon: '💼', color: '#EFF6FF', path: '/jobs' },
  { name: 'Hobi', icon: '🎮', color: '#FDF4FF', path: '/freizeit-hobby' },
  { name: 'Müzik & Kitap', icon: '📚', color: '#F0FDF4', path: '/musik-film-buecher' },
  { name: 'Biletler', icon: '🎟️', color: '#FFF7ED', path: '/tickets' },
  { name: 'Hizmetler', icon: '🔧', color: '#F1F5F9', path: '/dienstleistungen' },
  { name: 'Eğitim', icon: '🎓', color: '#ECFEFF', path: '/unterricht-kurse' },
  { name: 'Ücretsiz', icon: '🤝', color: '#FFFBEB', path: '/verschenken-tauschen' },
  { name: 'Komşuluk', icon: '🏘️', color: '#F0FDF4', path: '/nachbarschaftshilfe' },
  { name: 'Tüm Kategoriler', icon: '☰', color: '#F8FAFC', path: '/alle-kategorien' },
];

const MobileCategoryGrid = ({ setSelectedCategory }) => {
  const navigate = useNavigate();

  const handleCategoryClick = (cat) => {
    if (cat.path === '/alle-kategorien') {
      navigate('/alle-kategorien');
    } else {
      navigate(cat.path);
    }
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
