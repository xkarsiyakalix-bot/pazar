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
                { value: 'CD Player', label: 'CD Çalar' },
                { value: 'Lautsprecher & Kopfhörer', label: 'Hoparlör & Kulaklık' },
                { value: 'MP3 Player', label: 'MP3 Çalar' },
                { value: 'Radio & Receiver', label: 'Radyo & Alıcı' },
                { value: 'Stereoanlagen', label: 'Müzik Setleri' },
                { value: 'Weiteres Audio & Hifi', label: 'Diğer' }
            ],
            field: 'audio_hifi_art'
        }
    };

    const bannerConfig = {
        icon: '🎧',
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
