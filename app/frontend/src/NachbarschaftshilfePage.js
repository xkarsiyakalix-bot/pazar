import React from 'react';
import GenericCategoryPage from './components/GenericCategoryPage';
import { getTurkishCities } from './translations';

const NachbarschaftshilfePage = ({ toggleFavorite, isFavorite }) => {
    const subCategories = [
        { name: 'Komşu Yardımı', route: '/Komsu-Yardimi/Komsu-Yardimi' }
    ];

    const filterConfig = {
        offer_type: {
            label: 'İlan Türü',
            type: 'multiselect',
            options: [
                { value: 'Satılık', label: 'Satılık' },
                { value: 'Aranıyor', label: 'Aranıyor' }
            ],
            field: 'offer_type'
        },
        providerType: {
            label: 'Satıcı',
            type: 'multiselect',
            options: [
                { value: 'Bireysel', label: 'Bireysel' },
                { value: 'Kurumsal', label: 'Kurumsal' }
            ],
            field: 'seller_type'
        },
        federal_state: {
            label: 'Şehir',
            type: 'multiselect',
            options: [], dynamic: true,
            field: 'federal_state'
        }
    };

    const bannerConfig = {
        bgColor: 'bg-gradient-to-r from-red-500 to-rose-600',
        description: 'Komşu Yardımı & Topluluk'
    };

    return (
        <GenericCategoryPage
            category="Komşu Yardımı"
            subCategory="Komşu Yardımı"
            pageTitle="Komşu Yardımı"
            subCategories={subCategories}
            filterConfig={filterConfig}
            bannerConfig={bannerConfig}
            toggleFavorite={toggleFavorite}
            isFavorite={isFavorite}
        />
    );
};

export default NachbarschaftshilfePage;
