import React from 'react';
import GenericCategoryPage from './components/GenericCategoryPage';
import { getTurkishCities } from './translations';

const BadezimmerPage = ({ toggleFavorite, isFavorite }) => {
    const subCategories = [
        { name: 'Tümü', route: '/Ev-Bahce' },
        { name: 'Ev Hizmetleri', route: '/Ev-Bahce/Ev-Hizmetleri' },
        { name: 'Bahçe Malzemeleri & Bitkiler', route: '/Ev-Bahce/Bahce-Malzemeleri-Bitkiler' },
        { name: 'Mutfak & Yemek Odası', route: '/Ev-Bahce/Mutfak-Yemek-Odasi' },
        { name: 'Lamba & Aydınlatma', route: '/Ev-Bahce/Lamba-Aydinlatma' },
        { name: 'Banyo', route: '/Ev-Bahce/Banyo' },
        { name: 'Ofis', route: '/Ev-Bahce/Ofis' },
        { name: 'Dekorasyon', route: '/Ev-Bahce/Dekorasyon' },
        { name: 'Ev Tekstili', route: '/Ev-Bahce/Ev-Tekstili' },
        { name: 'Ev Tadilatı', route: '/Ev-Bahce/Ev-Tadilati' },
        { name: 'Yatak Odası', route: '/Ev-Bahce/Yatak-Odasi' },
        { name: 'Oturma Odası', route: '/Ev-Bahce/Oturma-Odasi' },
        { name: 'Diğer Ev & Bahçe', route: '/Ev-Bahce/Diger-Ev-Bahce' }
    ];

    const filterConfig = {
        versand: {
            label: 'Kargo',
            type: 'multiselect',
            options: [
                { value: 'Elden Teslim', label: 'Elden Teslim' },
                { value: 'Kargo Mümkün', label: 'Kargo Mümkün' }
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
                { value: 'İdare Eder', label: 'İdare Eder' },
                { value: 'Arızalı', label: 'Arızalı' }
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
        icon: '🛁',
        bgColor: 'bg-gradient-to-r from-red-500 to-rose-600',
        description: 'Banyo İlanlarını Keşfedin'
    };

    return (
        <GenericCategoryPage
            category="Ev & Bahçe"
            subCategory="Banyo"
            pageTitle="Banyo"
            filterConfig={filterConfig}
            bannerConfig={bannerConfig}
            subCategories={subCategories}
            toggleFavorite={toggleFavorite}
            isFavorite={isFavorite}
        />
    );
};

export default BadezimmerPage;
