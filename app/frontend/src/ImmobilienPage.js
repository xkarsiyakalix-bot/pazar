import React from 'react';
import GenericCategoryPage from './components/GenericCategoryPage';
import { getTurkishCities } from './translations';
import { getCommonFilters } from './config/filterConfigs';

const ImmobilienPage = ({ toggleFavorite, isFavorite }) => {
    const subCategories = [
        { name: 'Tümü', route: '/Emlak' },
        { name: 'Geçici Konaklama & Paylaşımlı Ev', route: '/Emlak/Gecici-Konaklama-Paylasimli-Ev' },
        { name: 'Konteyner', route: '/Emlak/Konteyner' },
        { name: 'Satılık Daire', route: '/Emlak/Satilik-Daireler' },
        { name: 'Satılık Yazlık', route: '/Emlak/Satilik-Yazlik' },
        { name: 'Tatil Evi & Yurt Dışı Emlak', route: '/Emlak/Tatil-Evi-Yurt-Disi-Emlak' },
        { name: 'Garaj & Otopark', route: '/Emlak/Garaj-Otopark' },
        { name: 'Ticari Emlak', route: '/Emlak/Ticari-Emlak' },
        { name: 'Arsa & Bahçe', route: '/Emlak/Arsa-Bahce' },
        { name: 'Satılık Müstakil Ev', route: '/Emlak/Satilik-Evler' },
        { name: 'Kiralık Müstakil Ev', route: '/Emlak/Kiralik-Evler' },
        { name: 'Kiralık Daire', route: '/Emlak/Kiralik-Daireler' },
        { name: 'Yeni Projeler', route: '/Emlak/Yeni-Projeler' },
        { name: 'Taşımacılık & Nakliye', route: '/Emlak/Tasimacilik-Nakliye' },
        { name: 'Diğer Emlak', route: '/Emlak/Diger-Emlak' }
    ];

    const filterConfig = {
        ...getCommonFilters()
    };

    const bannerConfig = {
        bgColor: 'bg-gradient-to-r from-red-500 to-rose-600',
        description: 'Emlak İlanlarını Keşfedin'
    };

    return (
        <GenericCategoryPage
            category="Emlak"
            pageTitle="Emlak"
            filterConfig={filterConfig}
            bannerConfig={bannerConfig}
            subCategories={subCategories}
            toggleFavorite={toggleFavorite}
            isFavorite={isFavorite}
        />
    );
};

export default ImmobilienPage;
