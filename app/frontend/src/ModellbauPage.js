import React from 'react';
import GenericCategoryPage from './components/GenericCategoryPage';
import { getTurkishCities } from './translations';

const ModellbauPage = ({ toggleFavorite, isFavorite }) => {
    const filterConfig = {
        versand: {
            label: 'Teslimat',
            type: 'multiselect',
            options: [
                { value: 'Kargo Mümkün', label: 'Kargo Mümkün' },
                { value: 'Sadece Elden Teslim', label: 'Sadece Elden Teslim' }
            ],
            field: 'versand_art'
        },
        art: {
            label: 'Tür',
            type: 'multiselect',
            options: [
                { value: 'Model Arabalar', label: 'Model Arabalar' },
                { value: 'Model Trenler', label: 'Model Trenler' },
                { value: 'RC Model Yapımı', label: 'RC Model Yapımı' },
                { value: 'Statik Modeller', label: 'Statik Modeller' },
                { value: 'Alet & Aksesuar', label: 'Alet & Aksesuar' },
                { value: 'Diğer', label: 'Diğer' }
            ],
            field: 'modellbau_art'
        },
        zustand: {
            label: 'Durum',
            type: 'multiselect',
            options: [
                { value: 'Yeni', label: 'Yeni' },
                { value: 'Çok İyi', label: 'Çok İyi' },
                { value: 'İyi', label: 'İyi' },
                { value: 'Makul', label: 'Makul' },
                { value: 'Defolu', label: 'Defolu' }
            ],
            field: 'condition'
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
        description: 'Model Yapımı'
    };

    return (
        <GenericCategoryPage
            category="Eğlence, Hobi & Mahalle"
            subCategory="Model Yapımı"
            pageTitle="Model Yapımı"
            filterConfig={filterConfig}
            bannerConfig={bannerConfig}
            toggleFavorite={toggleFavorite}
            isFavorite={isFavorite}
        />
    );
};

export default ModellbauPage;
