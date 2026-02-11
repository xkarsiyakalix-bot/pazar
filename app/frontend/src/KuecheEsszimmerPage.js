import React from 'react';
import GenericCategoryPage from './components/GenericCategoryPage';
import { getTurkishCities } from './translations';

const KuecheEsszimmerPage = ({ toggleFavorite, isFavorite }) => {
    const filterConfig = {
        art: {
            label: 'Tür',
            type: 'multiselect',
            options: [
                { value: 'Çatal Bıçak Takımı', label: 'Çatal Bıçak Takımı' },
                { value: 'Sofra Takımı', label: 'Sofra Takımı' },
                { value: 'Bardak', label: 'Bardak' },
                { value: 'Küçük Ev Aletleri', label: 'Küçük Ev Aletleri' },
                { value: 'Mutfak Dolabı', label: 'Mutfak Dolabı' },
                { value: 'Sandalye', label: 'Sandalye' },
                { value: 'Masa', label: 'Masa' },
                { value: 'Diğer Mutfak & Yemek Odası', label: 'Diğer Mutfak & Yemek Odası' }
            ],
            field: 'kueche_esszimmer_art'
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
        price: {
            label: 'Fiyat',
            type: 'range',
            field: 'price'
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
        icon: '🍽️',
        bgColor: 'bg-gradient-to-r from-red-500 to-rose-600',
        description: 'Mutfak & Yemek Odası İlanlarını Keşfedin'
    };

    return (
        <GenericCategoryPage
            category="Ev & Bahçe"
            subCategory="Mutfak & Yemek Odası"
            pageTitle="Mutfak & Yemek Odası"
            filterConfig={filterConfig}
            bannerConfig={bannerConfig}
            toggleFavorite={toggleFavorite}
            isFavorite={isFavorite}
        />
    );
};

export default KuecheEsszimmerPage;
