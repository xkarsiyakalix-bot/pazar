import React from 'react';
import GenericCategoryPage from './components/GenericCategoryPage';
import { getTurkishCities } from './translations';

const VerschenkenPage = ({ toggleFavorite, isFavorite }) => {
    const filterConfig = {
        zustand: {
            label: 'Durum',
            type: 'multiselect',
            options: [
                { value: 'neu_mit_etikett', label: 'Etiketli Yeni' },
                { value: 'neu', label: 'Yeni' },
                { value: 'sehr_gut', label: 'Çok İyi' },
                { value: 'gut', label: 'İyi' },
                { value: 'in_ordnung', label: 'Makul' },
                { value: 'defekt', label: 'Defolu' }
            ],
            field: 'condition'
        },
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

    const bannerConfig = {
        icon: '🎁',
        bgColor: 'bg-gradient-to-r from-red-500 to-rose-600',
        description: 'Ücretsiz'
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
            subCategory="Ücretsiz"
            pageTitle="Ücretsiz"
            filterConfig={filterConfig}
            bannerConfig={bannerConfig}
            toggleFavorite={toggleFavorite}
            isFavorite={isFavorite}
            subCategories={subCategories}
        />
    );
};

export default VerschenkenPage;
