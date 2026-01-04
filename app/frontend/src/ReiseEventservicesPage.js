import React from 'react';
import GenericCategoryPage from './components/GenericCategoryPage';
import { getTurkishCities } from './translations';

const ReiseEventservicesPage = ({ toggleFavorite, isFavorite }) => {
    const filterConfig = {
        versand: {
            label: 'Teslimat',
            type: 'multiselect',
            options: [
                { value: 'Versand möglich', label: 'Kargo Mümkün' },
                { value: 'Nur Abholung', label: 'Sadece Elden Teslim' }
            ],
            field: 'versand_art'
        },
        art: {
            label: 'Tür',
            type: 'multiselect',
            options: [
                { value: 'Seyahat Teklifleri', label: 'Seyahat Teklifleri' },
                { value: 'Etkinlikler & Biletler', label: 'Etkinlikler & Biletler' },
                { value: 'Kiralama', label: 'Kiralama' },
                { value: 'Servis Personeli', label: 'Servis Personeli' },
                { value: 'Diğer', label: 'Diğer' }
            ],
            field: 'reise_eventservices_art'
        },
        zustand: {
            label: 'Durum',
            type: 'multiselect',
            options: [
                { value: 'neu', label: 'Yeni' },
                { value: 'sehr_gut', label: 'Çok İyi' },
                { value: 'gut', label: 'İyi' },
                { value: 'in_ordnung', label: 'Makul' },
                { value: 'defekt', label: 'Defolu' }
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
                { value: 'Angebote', label: 'Satılık' },
                { value: 'Gesuche', label: 'Aranıyor' }
            ],
            field: 'offer_type'
        },
        providerType: {
            label: 'Satıcı',
            type: 'multiselect',
            options: [
                { value: 'Privatnutzer', label: 'Bireysel' },
                { value: 'Gewerblicher Nutzer', label: 'Kurumsal' }
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
        icon: '🎫',
        bgColor: 'bg-indigo-600',
        description: 'Seyahat & Etkinlik Hizmetleri'
    };

    return (
        <GenericCategoryPage
            category="Eğlence, Hobi & Mahalle"
            subCategory="Seyahat & Etkinlik Hizmetleri"
            pageTitle="Seyahat & Etkinlik Hizmetleri"
            filterConfig={filterConfig}
            bannerConfig={bannerConfig}
            toggleFavorite={toggleFavorite}
            isFavorite={isFavorite}
        />
    );
};

export default ReiseEventservicesPage;
