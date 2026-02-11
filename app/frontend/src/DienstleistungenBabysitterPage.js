import React from 'react';
import GenericCategoryPage from './components/GenericCategoryPage';
import { getTurkishCities } from './translations';

const DienstleistungenBabysitterPage = ({ toggleFavorite, isFavorite }) => {
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
        icon: '👶',
        bgColor: 'bg-gradient-to-r from-red-500 to-rose-600',
        description: 'Bebek Bakıcısı & Kreş'
    };

    return (
        <GenericCategoryPage
            category="Hizmetler"
            subCategory="Bebek Bakıcısı & Kreş"
            pageTitle="Bebek Bakıcısı & Kreş"
            filterConfig={filterConfig}
            bannerConfig={bannerConfig}
            toggleFavorite={toggleFavorite}
            isFavorite={isFavorite}
        />
    );
};

export default DienstleistungenBabysitterPage;
