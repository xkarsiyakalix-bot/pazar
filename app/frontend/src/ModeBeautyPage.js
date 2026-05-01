import React from 'react';
import GenericCategoryPage from './components/GenericCategoryPage';
import { getTurkishCities, t } from './translations';
import { getCommonFilters, getConditionFilter, getShippingFilter } from './config/filterConfigs';

const ModeBeautyPage = ({ toggleFavorite, isFavorite }) => {
    const subCategories = [
        { name: 'Tümü', route: '/Moda-Guzellik' },
        { name: 'Güzellik & Sağlık', route: '/Moda-Guzellik/Guzellik-Saglik' },
        { name: 'Kadın Giyimi', route: '/Moda-Guzellik/Kadin-Giyimi' },
        { name: 'Kadın Ayakkabıları', route: '/Moda-Guzellik/Kadin-Ayakkabilari' },
        { name: 'Erkek Giyimi', route: '/Moda-Guzellik/Erkek-Giyimi' },
        { name: 'Erkek Ayakkabıları', route: '/Moda-Guzellik/Erkek-Ayakkabilari' },
        { name: 'Çanta & Aksesuarlar', route: '/Moda-Guzellik/Canta-Aksesuarlar' },
        { name: 'Saat & Takı', route: '/Moda-Guzellik/Saat-Taki' },
        { name: 'Diğer Moda & Güzellik', route: '/Moda-Guzellik/Diger-Moda-Guzellik' }
    ];

    const filterConfig = {
        ...getCommonFilters(),
        ...getConditionFilter(),
        ...getShippingFilter()
    };

    const bannerConfig = {
        bgColor: 'bg-gradient-to-r from-red-500 to-rose-600',
        description: 'Moda & Güzellik'
    };

    return (
        <GenericCategoryPage
            category="Moda & Güzellik"
            pageTitle="Moda & Güzellik"
            subCategories={subCategories}
            filterConfig={filterConfig}
            bannerConfig={bannerConfig}
            toggleFavorite={toggleFavorite}
            isFavorite={isFavorite}
        />
    );
};

export default ModeBeautyPage;
