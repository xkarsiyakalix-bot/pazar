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
        offer_type: {
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
        federal_state: {
            label: 'Konum',
            type: 'multiselect',
            options: [], dynamic: true.map(city => ({ value: city, label: city })),
            field: 'federal_state'
        }
    };

    const bannerConfig = {
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
