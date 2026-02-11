import React from 'react';
import GenericCategoryPage from './components/GenericCategoryPage';
import { getTurkishCities } from './translations';

const VideospielePage = ({ toggleFavorite, isFavorite }) => {
    const filterConfig = {
        art: {
            label: 'Tür',
            type: 'multiselect',
            options: [
                { value: 'DS(i) & PSP Oyunları', label: 'DS(i) & PSP Oyunları' },
                { value: 'Nintendo Oyunları', label: 'Nintendo Oyunları' },
                { value: 'PlayStation Oyunları', label: 'PlayStation Oyunları' },
                { value: 'Xbox Oyunları', label: 'Xbox Oyunları' },
                { value: 'Wii Oyunları', label: 'Wii Oyunları' },
                { value: 'PC Oyunları', label: 'PC Oyunları' },
                { value: 'Diğer Video Oyunları', label: 'Diğer Video Oyunları' }
            ],
            field: 'videospiele_art'
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
                { value: 'Çok İyi', label: 'Çok İyi' },
                { value: 'İyi', label: 'İyi' },
                { value: 'Makul', label: 'Makul' },
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
        icon: '🕹️',
        bgColor: 'bg-gradient-to-r from-red-500 to-rose-600',
        description: 'Video Oyunları İlanlarını Keşfedin'
    };

    return (
        <GenericCategoryPage
            category="Elektronik"
            subCategory="Video Oyunları"
            pageTitle="Video Oyunları"
            filterConfig={filterConfig}
            bannerConfig={bannerConfig}
            toggleFavorite={toggleFavorite}
            isFavorite={isFavorite}
        />
    );
};

export default VideospielePage;
