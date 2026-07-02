import React from 'react';
import GenericCategoryPage from './components/GenericCategoryPage';
import { getTurkishCities } from './translations';

const VerschenkenPage = ({ toggleFavorite, isFavorite }) => {
    const filterConfig = {
        zustand: {
            label: 'Durum',
            type: 'multiselect',
            options: [
                { value: 'Etiketli Yeni', label: 'Etiketli Yeni' },
                { value: 'Yeni', label: 'Yeni' },
                { value: 'Çok İyi', label: 'Çok İyi' },
                { value: 'İyi', label: 'İyi' },
                { value: 'Makul', label: 'Makul' },
                { value: 'Defolu', label: 'Defolu' }
            ],
            field: 'condition'
        },
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
