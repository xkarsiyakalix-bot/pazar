import React from 'react';
import GenericCategoryPage from './components/GenericCategoryPage';
import { getTurkishCities } from './translations';

const NachbarschaftshilfeMainPage = ({ toggleFavorite, isFavorite }) => {
    const subCategories = [
        { name: 'Komşu Yardımı', route: '/Komsu-Yardimi/Komsu-Yardimi' }
    ];

    const bannerConfig = {
        icon: '🤝',
        bgColor: 'bg-gradient-to-r from-pink-500 to-rose-600',
        description: 'Komşu Yardımı & Topluluk'
    };

    const filterConfig = {
        offerType: {
            label: 'İlan Türü',
            type: 'multiselect',
            options: [
                { value: 'Angebote', label: 'Satılık' },
                { value: 'Gesuche', label: 'Aranıyor' }
            ],
            field: 'offer_type'
        },
        providerType: {
            label: 'Satıcı',
            type: 'multiselect',
            options: [
                { value: 'Privatnutzer', label: 'Bireysel' },
                { value: 'Gewerblicher Nutzer', label: 'Kurumsal' }
            ],
            field: 'seller_type'
        },
        federalState: {
            label: 'Şehir',
            type: 'multiselect',
            options: getTurkishCities(),
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
