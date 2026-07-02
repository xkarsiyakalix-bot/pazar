import React from 'react';
import GenericCategoryPage from './components/GenericCategoryPage';
import { getTurkishCities } from './translations';

const SportCampingPage = ({ toggleFavorite, isFavorite }) => {
    const filterConfig = {
        art: {
            label: 'Tür',
            type: 'multiselect',
            options: [
                { value: 'Top Sporları', label: 'Top Sporları' },
                { value: 'Kamp & Outdoor', label: 'Kamp & Outdoor' },
                { value: 'Fitness', label: 'Fitness' },
                { value: 'Bisiklet Sporu', label: 'Bisiklet Sporu' },
                { value: 'Dans & Koşu', label: 'Dans & Koşu' },
                { value: 'Su Sporları', label: 'Su Sporları' },
                { value: 'Kış Sporları', label: 'Kış Sporları' },
                { value: 'Diğer Spor & Kamp', label: 'Diğer Spor & Kamp' }
            ],
            field: 'sport_camping_art'
        },
        versand: {
            label: 'Teslimat',
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
                { value: 'Defolu', label: 'Defolu' }
            ],
            field: 'condition'
        },
        price: {
            label: 'Fiyat',
            type: 'range',
            field: 'price'
        },
        offer_type: {
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
        federal_state: {
            label: 'Şehir',
            type: 'multiselect',
            options: [], dynamic: true,
            field: 'federal_state'
        }
    };

    const bannerConfig = {
        bgColor: 'bg-gradient-to-r from-red-500 to-rose-600',
        description: 'Spor & Kamp'
    };

    return (
        <GenericCategoryPage
            category="Eğlence, Hobi & Mahalle"
            subCategory="Spor & Kamp"
            pageTitle="Spor & Kamp"
            filterConfig={filterConfig}
            bannerConfig={bannerConfig}
            toggleFavorite={toggleFavorite}
            isFavorite={isFavorite}
        />
    );
};

export default SportCampingPage;
