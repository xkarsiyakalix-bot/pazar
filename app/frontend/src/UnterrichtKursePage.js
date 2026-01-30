import React from 'react';
import GenericCategoryPage from './components/GenericCategoryPage';
import { getTurkishCities, t } from './translations';
import { getCommonFilters } from './config/filterConfigs';

const UnterrichtKursePage = ({ toggleFavorite, isFavorite }) => {
    const subcategories = [
        { name: 'Tümü', route: '/Egitim-Kurslar' },
        { name: 'Bilgisayar Kursları', route: '/Egitim-Kurslar/Bilgisayar-Kurslari' },
        { name: 'Ezoterizm & Spiritüalizm', route: '/Egitim-Kurslar/Ezoterizm-Spiritualizm' },
        { name: 'Yemek & Pastacılık Kursları', route: '/Egitim-Kurslar/Yemek-Pastacilik-Kurslari' },
        { name: 'Sanat & Tasarım Kursları', route: '/Egitim-Kurslar/Sanat-Tasarim-Kurslari' },
        { name: 'Müzik & Şan Dersleri', route: '/Egitim-Kurslar/Muzik-San-Dersleri' },
        { name: 'Özel Ders', route: '/Egitim-Kurslar/Ozel-Ders' },
        { name: 'Spor Kursları', route: '/Egitim-Kurslar/Spor-Kurslari' },
        { name: 'Dil Kursları', route: '/Egitim-Kurslar/Dil-Kurslari' },
        { name: 'Dans Kursları', route: '/Egitim-Kurslar/Dans-Kurslari' },
        { name: 'Sürekli Eğitim', route: '/Egitim-Kurslar/Surekli-Egitim' },
        { name: 'Diğer Dersler & Kurslar', route: '/Egitim-Kurslar/Diger-Dersler-Kurslar' }
    ];

    const filterConfig = {
        ...getCommonFilters()
    };

    const bannerConfig = {
        icon: '📖',
        bgColor: 'bg-gradient-to-r from-red-500 to-rose-600',
        description: 'Eğitim & Kurslar'
    };


    return (
        <GenericCategoryPage
            category="Eğitim & Kurslar"
            pageTitle="Eğitim & Kurslar"
            subCategories={subcategories}
            filterConfig={filterConfig}
            bannerConfig={bannerConfig}
            toggleFavorite={toggleFavorite}
            isFavorite={isFavorite}
        />
    );
};

export default UnterrichtKursePage;
