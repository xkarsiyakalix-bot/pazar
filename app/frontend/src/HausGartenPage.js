import React from 'react';
import GenericCategoryPage from './components/GenericCategoryPage';
import { getTurkishCities, t } from './translations';
import { getCommonFilters } from './config/filterConfigs';

const HausGartenPage = ({ toggleFavorite, isFavorite }) => {
    const subCategories = [
        { name: 'Tümü', route: '/Ev-Bahce' },
        { name: 'Banyo', route: '/Ev-Bahce/Banyo' },
        { name: 'Ofis', route: '/Ev-Bahce/Ofis' },
        { name: 'Dekorasyon', route: '/Ev-Bahce/Dekorasyon' },
        { name: 'Ev Hizmetleri', route: '/Ev-Bahce/Ev-Hizmetleri' },
        { name: 'Bahçe Malzemeleri & Bitkiler', route: '/Ev-Bahce/Bahce-Malzemeleri-Bitkiler' },
        { name: 'Ev Tekstili', route: '/Ev-Bahce/Ev-Tekstili' },
        { name: 'Ev Tadilatı', route: '/Ev-Bahce/Ev-Tadilati' },
        { name: 'Mutfak & Yemek Odası', route: '/Ev-Bahce/Mutfak-Yemek-Odasi' },
        { name: 'Lamba & Aydınlatma', route: '/Ev-Bahce/Lamba-Aydinlatma' },
        { name: 'Yatak Odası', route: '/Ev-Bahce/Yatak-Odasi' },
        { name: 'Oturma Odası', route: '/Ev-Bahce/Oturma-Odasi' },
        { name: 'Diğer Ev & Bahçe', route: '/Ev-Bahce/Diger-Ev-Bahce' }
    ];

    const filterConfig = {
        ...getCommonFilters()
    };

    const bannerConfig = {
        icon: '🏠',
        bgColor: 'bg-gradient-to-r from-green-600 to-teal-700',
        description: 'Haus & Garten'
    };

    return (
        <GenericCategoryPage
            category="Ev & Bahçe"
            pageTitle="Ev & Bahçe"
            subCategories={subCategories}
            filterConfig={filterConfig}
            bannerConfig={bannerConfig}
            toggleFavorite={toggleFavorite}
            isFavorite={isFavorite}
        />
    );
};

export default HausGartenPage;
