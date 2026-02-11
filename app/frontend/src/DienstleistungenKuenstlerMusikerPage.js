import React from 'react';
import GenericCategoryPage from './components/GenericCategoryPage';
import { getTurkishCities } from './translations';

const DienstleistungenKuenstlerMusikerPage = ({ toggleFavorite, isFavorite }) => {
    const filterConfig = {
        price: {
            label: 'Fiyat',
            type: 'range',
            field: 'price'
        },
        offerType: {
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
        federalState: {
            label: 'Şehir',
            type: 'multiselect',
            options: getTurkishCities(),
            field: 'federal_state'
        }
    };

    const bannerConfig = {
        icon: '🎨',
        bgColor: 'bg-gradient-to-r from-red-500 to-rose-600',
        description: 'Sanatçı & Müzisyen'
    };

    return (
        <GenericCategoryPage
            category="Hizmetler"
            subCategory="Sanatçılar & Müzisyenler"
            pageTitle="Sanatçılar & Müzisyenler"
            filterConfig={filterConfig}
            bannerConfig={bannerConfig}
            toggleFavorite={toggleFavorite}
            isFavorite={isFavorite}
        />
    );
};

export default DienstleistungenKuenstlerMusikerPage;
