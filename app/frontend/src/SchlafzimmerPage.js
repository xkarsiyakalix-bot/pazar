import React from 'react';
import GenericCategoryPage from './components/GenericCategoryPage';
import { getTurkishCities } from './translations';

const SchlafzimmerPage = ({ toggleFavorite, isFavorite }) => {
    const filterConfig = {
        art: {
            label: 'Tür',
            type: 'multiselect',
            options: [
                { value: 'Yatak', label: 'Yatak' },
                { value: 'Latalı Izgaralar', label: 'Latalı Izgaralar' },
                { value: 'Yatak Şilteleri', label: 'Yatak Şilteleri' },
                { value: 'Komodin', label: 'Komodin' },
                { value: 'Dolap', label: 'Dolap' },
                { value: 'Diğer Yatak Odası Mobilyaları', label: 'Diğer Yatak Odası Mobilyaları' }
            ],
            field: 'schlafzimmer_art'
        },
        price: {
            label: 'Fiyat',
            type: 'range',
            field: 'price'
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
        offerType: {
            label: 'İlan Tipi',
            type: 'multiselect',
            options: [
                { value: 'Satılık/Kiralık', label: 'Satılık/Kiralık' },
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
        federalState: {
            label: 'Konum',
            type: 'multiselect',
            options: getTurkishCities().map(city => ({ value: city, label: city })),
            field: 'federal_state'
        }
    };

    const bannerConfig = {
        bgColor: 'bg-gradient-to-r from-red-500 to-rose-600',
        description: 'Yatak Odası İlanlarını Keşfedin'
    };

    return (
        <GenericCategoryPage
            category="Ev & Bahçe"
            subCategory="Yatak Odası"
            pageTitle="Yatak Odası"
            filterConfig={filterConfig}
            bannerConfig={bannerConfig}
            toggleFavorite={toggleFavorite}
            isFavorite={isFavorite}
        />
    );
};

export default SchlafzimmerPage;
