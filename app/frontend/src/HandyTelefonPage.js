import React from 'react';
import GenericCategoryPage from './components/GenericCategoryPage';
import { getTurkishCities } from './translations';
import { getCommonFilters, getConditionFilter, getShippingFilter } from './config/filterConfigs';
import { phoneBrands } from './data/phoneBrands';

const HandyTelefonPage = ({ toggleFavorite, isFavorite }) => {
    const filterConfig = {
        phone_brand_model: {
            label: 'Tür / Marka & Model',
            type: 'brand-models',
            brands: phoneBrands,
            brandField: 'handy_telefon_art',
            modelField: 'modell'
        },
        other_types: {
            label: 'Cihaz Türü',
            type: 'multiselect',
            options: [
                { value: 'Faks Cihazları', label: 'Faks Cihazları' },
                { value: 'Telefonlar', label: 'Sabit Telefonlar' },
                { value: 'Diğer Cep Telefonu & Telefonlar', label: 'Diğer Cep Telefonu & Telefonlar' }
            ],
            field: 'handy_telefon_art'
        },
        ...getCommonFilters(),
        ...getConditionFilter(),
        ...getShippingFilter()
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
