import React from 'react';
import GenericCategoryPage from './components/GenericCategoryPage';
import { getTurkishCities } from './translations';

const WeiteresModeBeautyPage = ({ toggleFavorite, isFavorite }) => {
    const filterConfig = {
        versand: {
            label: 'Kargo',
            type: 'multiselect',
            options: [
                { value: 'Versand möglich', label: 'Kargo Mümkün' },
                { value: 'Nur Abholung', label: 'Sadece Elden Teslim' }
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
                { value: 'Angebote', label: 'Satılık' },
                { value: 'Gesuche', label: 'Aranıyor' }
            ],
            field: 'offer_type'
        },
        providerType: {
            label: 'Satıcı',
            type: 'multiselect',
            options: [
                { value: 'Privat', label: 'Bireysel' },
                { value: 'Gewerblich', label: 'Kurumsal' }
            ],
            field: 'seller_type'
        },
        zustand: {
            label: 'Durum',
            type: 'multiselect',
            options: [
                { value: 'neu', label: 'Yeni' },
                { value: 'neu_mit_etikett', label: 'Yeni & Etiketli' },
                { value: 'sehr_gut', label: 'Çok İyi' },
                { value: 'gut', label: 'İyi' },
                { value: 'in_ordnung', label: 'Makul' },
                { value: 'used', label: 'İkinci El' },
                { value: 'defekt', label: 'Kusurlu' }
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
        icon: '✨',
        bgColor: 'bg-gradient-to-r from-red-500 to-rose-600',
        description: 'Diğer Moda & Güzellik İlanlarını Keşfedin'
    };

    return (
        <GenericCategoryPage
            category="Moda & Güzellik"
            subCategory="Diğer Moda & Güzellik"
            pageTitle="Diğer Moda & Güzellik"
            filterConfig={filterConfig}
            bannerConfig={bannerConfig}
            toggleFavorite={toggleFavorite}
            isFavorite={isFavorite}
        />
    );
};

export default WeiteresModeBeautyPage;
