import React from 'react';
import GenericCategoryPage from './components/GenericCategoryPage';
import { getTurkishCities } from './translations';

const NachbarschaftshilfeMainPage = ({ toggleFavorite, isFavorite }) => {
    const subCategories = [
        { name: 'Komşu Yardımı', route: '/Komsu-Yardimi/Komsu-Yardimi' }
    ];

    const bannerConfig = {
        bgColor: 'bg-gradient-to-r from-pink-500 to-rose-600',
        description: 'Komşu Yardımı & Topluluk'
    };

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

    return (
        <GenericCategoryPage
            category="Komşu Yardımı"
            pageTitle="Komşu Yardımı"
            bannerConfig={bannerConfig}
            filterConfig={filterConfig}
            subCategories={subCategories}
            toggleFavorite={toggleFavorite}
            isFavorite={isFavorite}
        />
    );
};

export default NachbarschaftshilfeMainPage;
