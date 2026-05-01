import React from 'react';
import GenericCategoryPage from './components/GenericCategoryPage';
import { getTurkishCities, t } from './translations';
import { getCommonFilters, getConditionFilter, getShippingFilter } from './config/filterConfigs';

const AudioHifiPage = ({ toggleFavorite, isFavorite }) => {
    const filterConfig = {
        ...getCommonFilters(),
        ...getConditionFilter(),
        ...getShippingFilter(),
        art: {
            label: 'Tür',
            type: 'multiselect',
            options: [
                { value: 'CD Çalar', label: 'CD Çalar' },
                { value: 'Hoparlör & Kulaklık', label: 'Hoparlör & Kulaklık' },
                { value: 'MP3 Çalar', label: 'MP3 Çalar' },
                { value: 'Radyo & Alıcı', label: 'Radyo & Alıcı' },
                { value: 'Müzik Setleri', label: 'Müzik Setleri' },
                { value: 'Diğer', label: 'Diğer' }
            ],
            field: 'audio_hifi_art'
        }
    };

    const bannerConfig = {
        bgColor: 'bg-gradient-to-r from-red-500 to-rose-600',
        description: 'Ses & Hifi İlanlarını Keşfedin'
    };

    return (
        <GenericCategoryPage
            category="Elektronik"
            subCategory="Ses & Hifi"
            pageTitle="Ses & Hifi"
            filterConfig={filterConfig}
            bannerConfig={bannerConfig}
            toggleFavorite={toggleFavorite}
            isFavorite={isFavorite}
        />
    );
};

export default AudioHifiPage;
