import React from 'react';
import GenericCategoryPage from './components/GenericCategoryPage';
import { getTurkishCities } from './translations';

const TierbetreuungTrainingPage = ({ toggleFavorite, isFavorite }) => {
    const filterConfig = {
        price: {
            label: 'Fiyat',
            type: 'range',
            field: 'price'
        },
        offerType: {
            label: 'Teklif Türü',
            type: 'multiselect',
            options: [
                { value: 'Satılık/Verilecek', label: 'Satılık/Verilecek' },
                { value: 'Aranıyor', label: 'Aranıyor' }
            ],
            field: 'offer_type'
        },
        providerType: {
            label: 'Satıcı Tipi',
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
            options: getTurkishCities().map(city => ({ value: city, label: city })),
            field: 'federal_state'
        }
    };

    const bannerConfig = {
        icon: '🦴',
        bgColor: 'bg-gradient-to-r from-red-500 to-rose-600',
        description: 'Hayvan Bakımı & Eğitimi'
    };

    return (
        <GenericCategoryPage
            category="Evcil Hayvanlar"
            subCategory="Hayvan Bakımı & Eğitim"
            pageTitle="Hayvan Bakımı & Eğitimi"
            filterConfig={filterConfig}
            bannerConfig={bannerConfig}
            toggleFavorite={toggleFavorite}
            isFavorite={isFavorite}
        />
    );
};

export default TierbetreuungTrainingPage;
