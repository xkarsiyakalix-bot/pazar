import React from 'react';
import GenericCategoryPage from './components/GenericCategoryPage';
import { getTurkishCities } from './translations';
import { getCommonFilters } from './config/filterConfigs';

const EintrittskartenTicketsPage = ({ toggleFavorite, isFavorite }) => {
    const subCategories = [
        { name: 'Tümü', route: '/Biletler' },
        { name: 'Tren & Toplu Taşıma', route: '/Biletler/Tren-Toplu-Tasima' },
        { name: 'Komedi & Kabare', route: '/Biletler/Komedi-Kabare' },
        { name: 'Hediye Çekleri', route: '/Biletler/Hediye-Kartlari' },
        { name: 'Çocuk', route: '/Biletler/Cocuk' },
        { name: 'Konserler', route: '/Biletler/Konserler' },
        { name: 'Spor', route: '/Biletler/Spor' },
        { name: 'Tiyatro & Müzikal', route: '/Biletler/Tiyatro-Muzikal' },
        { name: 'Diğer Biletler', route: '/Biletler/Diger-Biletler' }
    ];

    const filterConfig = {
        ...getCommonFilters()
    };

    const bannerConfig = {
        icon: '🎫',
        bgColor: 'bg-gradient-to-r from-blue-600 to-indigo-700',
        description: 'Biletler'
    };

    return (
        <GenericCategoryPage
            category="Biletler"
            pageTitle="Biletler"
            subCategories={subCategories}
            filterConfig={filterConfig}
            bannerConfig={bannerConfig}
            toggleFavorite={toggleFavorite}
            isFavorite={isFavorite}
        />
    );
};

export default EintrittskartenTicketsPage;
