import React from 'react';
import GenericCategoryPage from './components/GenericCategoryPage';
import { getTurkishCities } from './translations';

const EintrittskartenTicketsPage = ({ toggleFavorite, isFavorite }) => {
    const subCategories = [
        { name: 'Tümü', route: '/Biletler' },
        { name: 'Tren & Toplu Taşıma', route: '/Biletler/Tren-Toplu-Tasima' },
        { name: 'Komedi & Kabare', route: '/Biletler/Komedi-Kabare' },
        { name: 'Hediye Çekleri', route: '/Biletler/Hediye-Kartlari' },
        { name: 'Çocuk', route: '/Biletler/Cocuk' },
        { name: 'Konserler', route: '/Biletler/Konserler' },
        { name: 'Spor', route: '/Biletler/Spor' },
        { name: 'Tiyatro & Müzikal', route: '/Biletler/Tiyatro-Muzikal' },
        { name: 'Diğer Biletler', route: '/Biletler/Diger-Biletler' }
    ];

    const filterConfig = {
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
        bgColor: 'bg-gradient-to-r from-blue-600 to-indigo-700',
        description: 'Biletler'
    };

    return (
        <GenericCategoryPage
            category="Biletler"
            pageTitle="Biletler"
            subCategories={subCategories}
            filterConfig={filterConfig}
            bannerConfig={bannerConfig}
            toggleFavorite={toggleFavorite}
            isFavorite={isFavorite}
        />
    );
};

export default EintrittskartenTicketsPage;
