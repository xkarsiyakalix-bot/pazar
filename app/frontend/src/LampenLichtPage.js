import React from 'react';
import GenericCategoryPage from './components/GenericCategoryPage';
import { getTurkishCities } from './translations';

const LampenLichtPage = ({ toggleFavorite, isFavorite }) => {
    const filterConfig = {
        art: {
            label: 'Tür',
            type: 'multiselect',
            options: [
                { value: 'Tavan Lambası', label: 'Tavan Lambası' },
                { value: 'Yer Lambası', label: 'Yer Lambası' },
                { value: 'Masa Lambası', label: 'Masa Lambası' },
                { value: 'Dış Aydınlatma', label: 'Dış Aydınlatma' },
                { value: 'Ampul', label: 'Ampul' },
                { value: 'Diğer Lamba & Aydınlatma', label: 'Diğer Lamba & Aydınlatma' }
            ],
            field: 'lamba_aydinlatma_art'
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
                { value: 'Versand möglich', label: 'Kargo Mümkün' },
                { value: 'Nur Abholung', label: 'Sadece Elden Teslim' }
            ],
            field: 'versand_art'
        },
        offerType: {
            label: 'İlan Tipi',
            type: 'multiselect',
            options: [
                { value: 'Angebote', label: 'Satılık/Kiralık' },
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
                { value: 'sehr_gut', label: 'Çok İyi' },
                { value: 'gut', label: 'İyi' },
                { value: 'in_ordnung', label: 'İdare Eder' },
                { value: 'defekt', label: 'Arızalı' }
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
        icon: '💡',
        bgColor: 'bg-gradient-to-r from-red-500 to-rose-600',
        description: 'Lamba & Aydınlatma İlanlarını Keşfedin'
    };

    return (
        <GenericCategoryPage
            category="Ev & Bahçe"
            subCategory="Lamba & Aydınlatma"
            pageTitle="Lamba & Aydınlatma"
            filterConfig={filterConfig}
            bannerConfig={bannerConfig}
            toggleFavorite={toggleFavorite}
            isFavorite={isFavorite}
        />
    );
};

export default LampenLichtPage;
