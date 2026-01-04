import React from 'react';
import GenericCategoryPage from './components/GenericCategoryPage';
import { getTurkishCities } from './translations';

const KuenstlerMusikerPage = ({ toggleFavorite, isFavorite }) => {
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
                { value: 'Ressam & Heykeltıraş', label: 'Ressam & Heykeltıraş' },
                { value: 'Müzisyen & Grup', label: 'Müzisyen & Grup' },
                { value: 'Şarkıcı', label: 'Şarkıcı' },
                { value: 'Oyuncu', label: 'Oyuncu' },
                { value: 'Dansçı', label: 'Dansçı' },
                { value: 'Ders', label: 'Dersler' },
                { value: 'Diğer Sanat dalları', label: 'Diğer' }
            ],
            field: 'kuenstler_musiker_art'
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
        icon: '🎭',
        bgColor: 'bg-purple-600',
        description: 'Sanatçılar & Müzisyenler'
    };

    return (
        <GenericCategoryPage
            category="Eğlence, Hobi & Mahalle"
            subCategory="Sanatçılar & Müzisyenler"
            pageTitle="Sanatçılar & Müzisyenler"
            filterConfig={filterConfig}
            bannerConfig={bannerConfig}
            toggleFavorite={toggleFavorite}
            isFavorite={isFavorite}
        />
    );
};

export default KuenstlerMusikerPage;
