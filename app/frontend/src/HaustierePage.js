import React from 'react';
import GenericCategoryPage from './components/GenericCategoryPage';
import { getTurkishCities } from './translations';

const HaustierePage = ({ toggleFavorite, isFavorite }) => {
    const filterConfig = {
        price: {
            label: 'Fiyat',
            type: 'range',
            field: 'price'
        },
        offerType: {
            label: 'Teklif Türü',
            type: 'multiselect',
            options: [
                { value: 'Angebote', label: 'Satılık/Verilecek' },
                { value: 'Gesuche', label: 'Aranıyor' }
            ],
            field: 'offer_type'
        },
        providerType: {
            label: 'Satıcı Tipi',
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
            options: getTurkishCities().map(city => ({ value: city, label: city })),
            field: 'federal_state'
        }
    };

    const subCategories = [
        { name: 'Tümü', route: '/Evcil-Hayvanlar' },
        { name: 'Balıklar', route: '/Evcil-Hayvanlar/Baliklar' },
        { name: 'Köpekler', route: '/Evcil-Hayvanlar/Kopekler' },
        { name: 'Kediler', route: '/Evcil-Hayvanlar/Kedi' },
        { name: 'Küçük Hayvanlar', route: '/Evcil-Hayvanlar/Kucuk-Hayvanlar' },
        { name: 'Çiftlik Hayvanları', route: '/Evcil-Hayvanlar/Ciftlik-Hayvanlari' },
        { name: 'Atlar', route: '/Evcil-Hayvanlar/Atlar' },
        { name: 'Hayvan Bakımı & Eğitim', route: '/Evcil-Hayvanlar/Hayvan-Bakimi-Egitimi' },
        { name: 'Kayıp Hayvanlar', route: '/Evcil-Hayvanlar/Kayip-Hayvanlar' },
        { name: 'Kuşlar', route: '/Evcil-Hayvanlar/Kuslar' },
        { name: 'Aksesuarlar', route: '/Evcil-Hayvanlar/Aksesuarlar' }
    ];

    const bannerConfig = {
        icon: '🐾',
        bgColor: 'bg-gradient-to-r from-red-500 to-rose-600',
        description: 'Evcil Hayvanlar'
    };

    return (
        <GenericCategoryPage
            category="Evcil Hayvanlar"
            pageTitle="Evcil Hayvanlar"
            filterConfig={filterConfig}
            subCategories={subCategories}
            bannerConfig={bannerConfig}
            toggleFavorite={toggleFavorite}
            isFavorite={isFavorite}
        />
    );
};

export default HaustierePage;
