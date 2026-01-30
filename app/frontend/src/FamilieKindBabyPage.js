import React from 'react';
import GenericCategoryPage from './components/GenericCategoryPage';
import { getTurkishCities, t } from './translations';
import { getCommonFilters } from './config/filterConfigs';

const FamilieKindBabyPage = ({ toggleFavorite, isFavorite }) => {
    const filterConfig = {
        ...getCommonFilters()
    };

    const subCategories = [
        { name: 'Tümü', route: '/Aile-Cocuk-Bebek' },
        { name: 'Yaşlı Bakımı', route: '/Aile-Cocuk-Bebek/Yasli-Bakimi' },
        { name: 'Bebek & Çocuk Giyimi', route: '/Aile-Cocuk-Bebek/Bebek-Cocuk-Giyimi' },
        { name: 'Bebek & Çocuk Ayakkabıları', route: '/Aile-Cocuk-Bebek/Bebek-Cocuk-Ayakkabilari' },
        { name: 'Bebek Ekipmanları', route: '/Aile-Cocuk-Bebek/Bebek-Ekipmanlari' },
        { name: 'Bebek Koltuğu & Oto Koltukları', route: '/Aile-Cocuk-Bebek/Oto-Koltuklari' },
        { name: 'Babysitter & Çocuk Bakımı', route: '/Aile-Cocuk-Bebek/Babysitter-Cocuk-Bakimi' },
        { name: 'Bebek Arabaları & Pusetler', route: '/Aile-Cocuk-Bebek/Bebek-Arabalari-Pusetler' },
        { name: 'Bebek Odası Mobilyaları', route: '/Aile-Cocuk-Bebek/Cocuk-Odasi-Mobilyalari' },
        { name: 'Oyuncaklar', route: '/Aile-Cocuk-Bebek/Oyuncaklar' },
        { name: 'Diğer Aile, Çocuk & Bebek', route: '/Aile-Cocuk-Bebek/Diger-Aile-Cocuk-Bebek' }
    ];

    const bannerConfig = {
        icon: '👶',
        bgColor: 'bg-gradient-to-r from-red-500 to-rose-600',
        description: 'Aile, Çocuk & Bebek'
    };

    return (
        <GenericCategoryPage
            category="Aile, Çocuk & Bebek"
            pageTitle="Aile, Çocuk & Bebek"
            filterConfig={filterConfig}
            bannerConfig={bannerConfig}
            subCategories={subCategories}
            toggleFavorite={toggleFavorite}
            isFavorite={isFavorite}
        />
    );
};

export default FamilieKindBabyPage;
