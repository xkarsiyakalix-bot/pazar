import React from 'react';
import { useNavigate } from 'react-router-dom';
import GenericCategoryPage from './components/GenericCategoryPage';
import { getTurkishCities } from './translations';

const ElektronikPage = ({ toggleFavorite, isFavorite }) => {
    const filterConfig = {
        versand: {
            label: 'Versand',
            type: 'multiselect',
            options: [
                'Versand möglich',
                'Nur Abholung'
            ],
            field: 'versand_art'
        },
        zustand: {
            label: 'Zustand',
            type: 'multiselect',
            options: [
                { value: 'neu', label: 'Neu' },
                { value: 'sehr_gut', label: 'Sehr Gut' },
                { value: 'gut', label: 'Gut' },
                { value: 'in_ordnung', label: 'In Ordnung' },
                { value: 'defekt', label: 'Defekt' }
            ],
            field: 'condition'
        },
        price: {
            label: 'Preis',
            type: 'range',
            field: 'price'
        },
        offerType: {
            label: 'Angebotstyp',
            type: 'multiselect',
            options: [
                { value: 'Angebote', label: 'Angebote' },
                { value: 'Gesuche', label: 'Gesuche' }
            ],
            field: 'offer_type'
        },
        providerType: {
            label: 'Anbieter',
            type: 'multiselect',
            options: [
                { value: 'Privatnutzer', label: 'Privat' },
                { value: 'Gewerblicher Nutzer', label: 'Gewerblich' }
            ],
            field: 'seller_type'
        },
        federalState: {
            label: 'Ort',
            type: 'multiselect',
            options: getTurkishCities(),
            field: 'federal_state'
        }
    };

    const subcategories = [
        { name: 'Tümü', route: '/Elektronik' },
        { name: 'Ses & Hifi', route: '/Elektronik/Ses-Hifi' },
        { name: 'Elektronik Hizmetler', route: '/Elektronik/Elektronik-Hizmetler' },
        { name: 'Fotoğraf & Kamera', route: '/Elektronik/Fotograf-Kamera' },
        { name: 'Cep Telefonu & Telefon', route: '/Elektronik/Cep-Telefonu-Telefon' },
        { name: 'Ev Aletleri', route: '/Elektronik/Ev-Aletleri' },
        { name: 'Konsollar', route: '/Elektronik/Konsollar' },
        { name: 'Dizüstü Bilgisayarlar', route: '/Elektronik/Dizustu-Bilgisayarlar' },
        { name: 'Bilgisayarlar', route: '/Elektronik/Bilgisayarlar' },
        { name: 'Bilgisayar Aksesuarları & Yazılım', route: '/Elektronik/Bilgisayar-Aksesuarlari-Yazilim' },
        { name: 'Tabletler & E-Okuyucular', route: '/Elektronik/Tabletler-E-Okuyucular' },
        { name: 'TV & Video', route: '/Elektronik/TV-Video' },
        { name: 'Video Oyunları', route: '/Elektronik/Video-Oyunlari' },
        { name: 'Diğer Elektronik', route: '/Elektronik/Diger-Elektronik' }
    ];

    const bannerConfig = {
        icon: '📱',
        bgColor: 'bg-gradient-to-r from-red-500 to-rose-600',
        description: 'Elektronik'
    };

    return (
        <GenericCategoryPage
            category="Elektronik"
            pageTitle="Elektronik"
            filterConfig={filterConfig}
            bannerConfig={bannerConfig}
            subCategories={subcategories}
            toggleFavorite={toggleFavorite}
            isFavorite={isFavorite}
        />
    );
};

export default ElektronikPage;
