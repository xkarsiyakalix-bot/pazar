import React from 'react';
import GenericCategoryPage from './components/GenericCategoryPage';
import { getTurkishCities } from './translations';
import { getCommonFilters, getConditionFilter } from './config/filterConfigs';

const VerschenkenTauschenPage = ({ toggleFavorite, isFavorite }) => {
    const filterConfig = {
        ...getCommonFilters(),
        ...getConditionFilter()
    };

    const bannerConfig = {
        bgColor: 'bg-gradient-to-r from-red-500 to-rose-600',
        description: 'Ücretsiz & Takas'
    };

    const subCategories = [
        { name: 'Tümü', route: '/Ucretsiz-Takas' },
        { name: 'Takas', route: '/Ucretsiz-Takas/Takas' },
        { name: 'Kiralama', route: '/Ucretsiz-Takas/Kiralama' },
        { name: 'Ücretsiz', route: '/Ucretsiz-Takas/Ucretsiz' }
    ];

    return (
        <GenericCategoryPage
            category="Ücretsiz & Takas"
            pageTitle="Ücretsiz & Takas"
            filterConfig={filterConfig}
            bannerConfig={bannerConfig}
            toggleFavorite={toggleFavorite}
            isFavorite={isFavorite}
            subCategories={subCategories}
        />
    );
};

export default VerschenkenTauschenPage;
