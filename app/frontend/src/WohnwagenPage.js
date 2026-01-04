import React from 'react';
import GenericCategoryPage from './components/GenericCategoryPage';
import { getTurkishCities } from './translations';

const WohnwagenPage = ({ toggleFavorite, isFavorite }) => {
    const subCategories = [
        { name: 'Tümü', route: '/Otomobil-Bisiklet-Tekne' },
        { name: 'Otomobiller', route: '/Otomobil-Bisiklet-Tekne/Otomobiller' },
        { name: 'Oto Parça & Lastik', route: '/Otomobil-Bisiklet-Tekne/Oto-Parca-Lastik' },
        { name: 'Tekne & Tekne Malzemeleri', route: '/Otomobil-Bisiklet-Tekne/Tekne-Tekne-Malzemeleri' },
        { name: 'Bisiklet & Aksesuarlar', route: '/Otomobil-Bisiklet-Tekne/Bisiklet-Aksesuarlar' },
        { name: 'Motosiklet & Scooter', route: '/Otomobil-Bisiklet-Tekne/Motosiklet-Scooter' },
        { name: 'Motosiklet Parça & Aksesuarlar', route: '/Otomobil-Bisiklet-Tekne/Motosiklet-Parca-Aksesuarlar' },
        { name: 'Ticari Araçlar & Römorklar', route: '/Otomobil-Bisiklet-Tekne/Ticari-Araclar-Romorklar' },
        { name: 'Tamir & Servis', route: '/Otomobil-Bisiklet-Tekne/Tamir-Servis' },
        { name: 'Karavan & Motokaravan', route: '/Otomobil-Bisiklet-Tekne/Karavan-Motokaravan' },
        { name: 'Diğer Otomobil, Bisiklet & Tekne', route: '/Otomobil-Bisiklet-Tekne/Diger-Otomobil-Bisiklet-Tekne' }
    ];

    const filterConfig = {
        art: {
            label: 'Tür',
            type: 'radio',
            options: [
                { value: 'Alkoven', label: 'Alkoven' },
                { value: 'Entegre', label: 'Tam Entegre' },
                { value: 'Panelvan', label: 'Panelvan' },
                { value: 'Yarı Entegre', label: 'Yarı Entegre' },
                { value: 'Karavan', label: 'Karavan' },
                { value: 'Diğer Karavan & Motokaravan', label: 'Diğer Karavan & Motokaravan' }
            ],
            field: 'wohnwagen_art'
        },
        marke: {
            label: 'Marka',
            type: 'radio',
            options: [
                'Adria', 'Bürstner', 'Carado', 'Carthago', 'Chausson', 'Dethleffs',
                'Eura Mobil', 'Fendt', 'Fiat', 'Ford', 'Globecar', 'Hobby',
                'Hymer-Eriba', 'Knaus', 'LMC', 'McLouis', 'Mercedes Benz', 'Pössl',
                'Rapido', 'Rimor', 'Sunlight', 'Tabbert', 'TEC', 'Volkswagen',
                'Weinsberg', 'Weitere Marken'
            ].map(m => m === 'Weitere Marken' ? { value: m, label: 'Diğer Markalar' } : m),
            field: 'marke'
        },
        kilometerstand: {
            label: 'Kilometre',
            type: 'range',
            field: 'kilometerstand'
        },
        erstzulassung: {
            label: 'İlk Tescil Yılı',
            type: 'range',
            field: 'erstzulassung'
        },
        price: {
            label: 'Fiyat',
            type: 'range',
            field: 'price'
        },
        offerType: {
            label: 'İlan Tipi',
            type: 'radio',
            options: [
                { value: 'Angebote', label: 'Satılık' },
                { value: 'Gesuche', label: 'Aranıyor' }
            ],
            field: 'offer_type'
        },
        providerType: {
            label: 'Satıcı',
            type: 'radio',
            options: [
                { value: 'Privatnutzer', label: 'Bireysel' },
                { value: 'Gewerblicher Nutzer', label: 'Kurumsal' }
            ],
            field: 'seller_type'
        },
        federalState: {
            label: 'Konum',
            type: 'radio',
            options: getTurkishCities(),
            field: 'federal_state'
        }
    };

    const bannerConfig = {
        icon: '🚐',
        bgColor: 'bg-gradient-to-r from-red-500 to-rose-600',
        description: 'Yoldaki mobil eviniz'
    };

    return (
        <GenericCategoryPage
            category="Otomobil, Bisiklet & Tekne"
            subCategory="Karavan & Motokaravan"
            pageTitle="Karavan & Motokaravan"
            subCategories={subCategories}
            filterConfig={filterConfig}
            bannerConfig={bannerConfig}
            toggleFavorite={toggleFavorite}
            isFavorite={isFavorite}
        />
    );
};

export default WohnwagenPage;
