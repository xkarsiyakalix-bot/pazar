import React from 'react';
import GenericCategoryPage from './components/GenericCategoryPage';
import { getTurkishCities, t } from './translations';
import { getCommonFilters } from './config/filterConfigs';

const HaustierePage = ({ toggleFavorite, isFavorite }) => {
    const filterConfig = {
        ...getCommonFilters()
    };

    const subCategories = [
        { name: 'Tümü', route: '/Evcil-Hayvanlar' },
        { name: 'Balıklar', route: '/Evcil-Hayvanlar/Baliklar' },
        { name: 'Köpekler', route: '/Evcil-Hayvanlar/Kopekler' },
        { name: 'Kediler', route: '/Evcil-Hayvanlar/Kedi' },
        { name: 'Küçük Hayvanlar', route: '/Evcil-Hayvanlar/Kucuk-Hayvanlar' },
        { name: 'Çiftlik Hayvanları', route: '/Evcil-Hayvanlar/Ciftlik-Hayvanlari' },
        { name: 'Atlar', route: '/Evcil-Hayvanlar/Atlar' },
        { name: 'Hayvan Bakımı & Eğitim', route: '/Evcil-Hayvanlar/Hayvan-Bakimi-Egitimi' },
        { name: 'Kayıp Hayvanlar', route: '/Evcil-Hayvanlar/Kayip-Hayvanlar' },
        { name: 'Kuşlar', route: '/Evcil-Hayvanlar/Kuslar' },
        { name: 'Aksesuarlar', route: '/Evcil-Hayvanlar/Aksesuarlar' }
    ];

    const bannerConfig = {
        bgColor: 'bg-gradient-to-r from-red-500 to-rose-600',
        description: 'Evcil Hayvanlar'
    };

    return (
        <GenericCategoryPage
            category="Evcil Hayvanlar"
            pageTitle="Evcil Hayvanlar"
            filterConfig={filterConfig}
            subCategories={subCategories}
            bannerConfig={bannerConfig}
            toggleFavorite={toggleFavorite}
            isFavorite={isFavorite}
        />
    );
};

export default HaustierePage;
