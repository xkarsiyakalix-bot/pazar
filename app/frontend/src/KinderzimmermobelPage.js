import React from 'react';
import GenericCategoryPage from './components/GenericCategoryPage';
import { getTurkishCities } from './translations';

const KinderzimmermobelPage = ({ toggleFavorite, isFavorite }) => {
    const filterConfig = {
        art: {
            label: 'Tür',
            type: 'multiselect',
            options: [
                { value: 'Yatak & Beşik', label: 'Yatak & Beşik' },
                { value: 'Mama Sandalyesi & Oyun Parkı', label: 'Mama Sandalyesi & Oyun Parkı' },
                { value: 'Dolap & Şifonyer', label: 'Dolap & Şifonyer' },
                { value: 'Alt Değiştirme Masası & Aksesuar', label: 'Alt Değiştirme Masası & Aksesuar' },
                { value: 'Ana Kucağı & Salıncak', label: 'Ana Kucağı & Salıncak' },
                { value: 'Diğer Çocuk Odası Mobilyaları', label: 'Diğer Çocuk Odası Mobilyaları' }
            ],
            field: 'kinderzimmermobel_art'
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
        icon: '🛏️',
        bgColor: 'bg-gradient-to-r from-red-500 to-rose-600',
        description: 'Bebek Odası Mobilyaları'
    };

    return (
        <GenericCategoryPage
            category="Aile, Çocuk & Bebek"
            subCategory="Bebek Odası Mobilyaları"
            pageTitle="Bebek Odası Mobilyaları"
            filterConfig={filterConfig}
            bannerConfig={bannerConfig}
            toggleFavorite={toggleFavorite}
            isFavorite={isFavorite}
        />
    );
};

export default KinderzimmermobelPage;
