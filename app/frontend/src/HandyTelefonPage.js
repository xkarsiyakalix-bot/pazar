import React from 'react';
import GenericCategoryPage from './components/GenericCategoryPage';
import { getTurkishCities } from './translations';
import { getCommonFilters, getConditionFilter, getShippingFilter } from './config/filterConfigs';

const HandyTelefonPage = ({ toggleFavorite, isFavorite }) => {
    const filterConfig = {
        ...getCommonFilters(),
        ...getConditionFilter(),
        ...getShippingFilter(),
        art: {
            label: 'Tür',
            type: 'multiselect',
            options: [
                'Apple', 'Google', 'HTC', 'Huawei', 'LG', 'Motorola',
                'Nokia', 'Samsung', 'Siemens', 'Sony', 'Xiaomi',
                { value: 'Faks Cihazları', label: 'Faks Cihazları' },
                { value: 'Telefonlar', label: 'Telefonlar' },
                { value: 'Diğer Cep Telefonu & Telefonlar', label: 'Diğer Cep Telefonu & Telefonlar' }
            ],
            field: 'handy_telefon_art'
        }
    };

    const bannerConfig = {
        bgColor: 'bg-gradient-to-r from-red-500 to-rose-600',
        description: 'Cep Telefonu & Telefon İlanlarını Keşfedin'
    };

    return (
        <GenericCategoryPage
            category="Elektronik"
            subCategory="Cep Telefonu & Telefon"
            pageTitle="Cep Telefonu & Telefon"
            filterConfig={filterConfig}
            bannerConfig={bannerConfig}
            toggleFavorite={toggleFavorite}
            isFavorite={isFavorite}
        />
    );
};

export default HandyTelefonPage;
