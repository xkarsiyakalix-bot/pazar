import React from 'react';
import GenericCategoryPage from './components/GenericCategoryPage';
import { getTurkishCities } from './translations';

const KonsolenPage = ({ toggleFavorite, isFavorite }) => {
    const filterConfig = {
        art: {
            label: 'Tür',
            type: 'multiselect',
            options: [
                { value: 'El Konsolları', label: 'El Konsolları' },
                { value: 'PlayStation', label: 'PlayStation' },
                { value: 'Xbox', label: 'Xbox' },
                { value: 'Wii', label: 'Wii' },
                { value: 'Diğer Konsollar', label: 'Diğer Konsollar' }
            ],
            field: 'konsolen_art'
        },
        versand: {
            label: 'Kargo',
            type: 'multiselect',
            options: [
                { value: 'Kargo Mümkün', label: 'Kargo Mümkün' },
                { value: 'Sadece Elden Teslim', label: 'Sadece Elden Teslim' }
            ],
            field: 'versand_art'
        },
        zustand: {
            label: 'Durum',
            type: 'multiselect',
            options: [
                { value: 'Yeni', label: 'Yeni' },
                { value: 'Yeni & Etiketli', label: 'Yeni & Etiketli' },
                { value: 'Çok İyi', label: 'Çok İyi' },
                { value: 'İyi', label: 'İyi' },
                { value: 'Makul', label: 'Makul' },
                { value: 'İkinci El', label: 'İkinci El' },
                { value: 'Kusurlu', label: 'Kusurlu' }
            ],
            field: 'condition'
        },
        price: {
            label: 'Fiyat',
            type: 'range',
            field: 'price'
        },
        offerType: {
            label: 'İlan Tipi',
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
            label: 'Konum',
            type: 'multiselect',
            options: getTurkishCities().map(city => ({ value: city, label: city })),
            field: 'federal_state'
        }
    };

    const bannerConfig = {
        bgColor: 'bg-gradient-to-r from-red-500 to-rose-600',
        description: 'Konsol İlanlarını Keşfedin'
    };

    return (
        <GenericCategoryPage
            category="Elektronik"
            subCategory="Konsollar"
            pageTitle="Konsollar"
            filterConfig={filterConfig}
            bannerConfig={bannerConfig}
            toggleFavorite={toggleFavorite}
            isFavorite={isFavorite}
        />
    );
};

export default KonsolenPage;
