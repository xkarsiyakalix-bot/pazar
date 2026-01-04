import React from 'react';
import GenericCategoryPage from './components/GenericCategoryPage';
import { getTurkishCities } from './translations';

const HaushaltsgeraetePage = ({ toggleFavorite, isFavorite }) => {
    const filterConfig = {
        art: {
            label: 'Tür',
            type: 'multiselect',
            options: [
                { value: 'Küçük Ev Aletleri', label: 'Küçük Ev Aletleri' },
                { value: 'Ocak & Fırınlar', label: 'Ocak & Fırınlar' },
                { value: 'Kahve & Espresso Makineleri', label: 'Kahve & Espresso Makineleri' },
                { value: 'Buzdolapları & Dondurucular', label: 'Buzdolapları & Dondurucular' },
                { value: 'Bulaşık Makineleri', label: 'Bulaşık Makineleri' },
                { value: 'Elektrikli Süpürgeler', label: 'Elektrikli Süpürgeler' },
                { value: 'Çamaşır & Kurutma Makineleri', label: 'Çamaşır & Kurutma Makineleri' },
                { value: 'Diğer Ev Aletleri', label: 'Diğer Ev Aletleri' }
            ],
            field: 'haushaltsgeraete_art'
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
        federalState: {
            label: 'Konum',
            type: 'multiselect',
            options: getTurkishCities().map(city => ({ value: city, label: city })),
            field: 'federal_state'
        }
    };

    const bannerConfig = {
        icon: '🧺',
        bgColor: 'bg-gradient-to-r from-red-500 to-rose-600',
        description: 'Ev Aletleri İlanlarını Keşfedin'
    };

    return (
        <GenericCategoryPage
            category="Elektronik"
            subCategory="Ev Aletleri"
            pageTitle="Ev Aletleri"
            filterConfig={filterConfig}
            bannerConfig={bannerConfig}
            toggleFavorite={toggleFavorite}
            isFavorite={isFavorite}
        />
    );
};

export default HaushaltsgeraetePage;
