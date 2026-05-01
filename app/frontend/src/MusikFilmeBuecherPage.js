import React from 'react';
import GenericCategoryPage from './components/GenericCategoryPage';
import { getTurkishCities, t } from './translations';
import { getCommonFilters, getConditionFilter, getShippingFilter } from './config/filterConfigs';

const MusikFilmeBuecherPage = ({ toggleFavorite, isFavorite }) => {
    const subCategories = [
        { name: 'Tümü', route: '/Muzik-Film-Kitap' },
        { name: 'Kitap & Dergi', route: '/Muzik-Film-Kitap/Kitap-Dergi' },
        { name: 'Kırtasiye', route: '/Muzik-Film-Kitap/Kirtasiye' },
        { name: 'Çizgi Romanlar', route: '/Muzik-Film-Kitap/Cizgi-Romanlar' },
        { name: 'Ders Kitapları, Okul & Eğitim', route: '/Muzik-Film-Kitap/Ders-Kitaplari-Okul-Egitim' },
        { name: 'Film & DVD', route: '/Muzik-Film-Kitap/Film-DVD' },
        { name: "Müzik & CD'ler", route: '/Muzik-Film-Kitap/Muzik-CDler' },
        { name: 'Müzik Enstrümanları', route: '/Muzik-Film-Kitap/Muzik-Enstrumanlari' },
        { name: 'Diğer Müzik, Film & Kitap', route: '/Muzik-Film-Kitap/Diger-Muzik-Film-Kitap' }
    ];

    const filterConfig = {
        ...getCommonFilters(),
        ...getConditionFilter(),
        ...getShippingFilter()
    };

    const bannerConfig = {
        bgColor: 'bg-gradient-to-r from-red-600 to-red-700',
        description: 'Müzik, Film & Kitap'
    };

    return (
        <GenericCategoryPage
            category="Müzik, Film & Kitap"
            pageTitle="Müzik, Film & Kitap"
            subCategories={subCategories}
            filterConfig={filterConfig}
            bannerConfig={bannerConfig}
            toggleFavorite={toggleFavorite}
            isFavorite={isFavorite}
        />
    );
};

export default MusikFilmeBuecherPage;
