import React from 'react';
import GenericCategoryPage from './components/GenericCategoryPage';
import { getTurkishCities } from './translations';

const WeiteresFamilieKindBabyPage = ({ toggleFavorite, isFavorite }) => {
    const filterConfig = {
        versand: {
            label: 'Kargo',
            type: 'multiselect',
            options: ['Kargo Mümkün', 'Sadece Elden Teslim'],
            field: 'versand_art'
        },
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
        bgColor: 'bg-gradient-to-r from-red-500 to-rose-600',
        description: 'Diğer Aile, Çocuk & Bebek'
    };

    return (
        <GenericCategoryPage
            category="Aile, Çocuk & Bebek"
            subCategory="Diğer Aile, Çocuk & Bebek"
            pageTitle="Diğer Aile, Çocuk & Bebek"
            filterConfig={filterConfig}
            bannerConfig={bannerConfig}
            toggleFavorite={toggleFavorite}
            isFavorite={isFavorite}
        />
    );
};

export default WeiteresFamilieKindBabyPage;
