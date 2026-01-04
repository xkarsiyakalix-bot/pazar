import React from 'react';
import GenericCategoryPage from './components/GenericCategoryPage';
import { getTurkishCities } from './translations';

const ContainerPage = ({ toggleFavorite, isFavorite }) => {
    const subCategories = [
        { name: 'Tümü', route: '/Emlak' },
        { name: 'Geçici Konaklama & Paylaşımlı Ev', route: '/Emlak/Gecici-Konaklama-Paylasimli-Ev' },
        { name: 'Konteyner', route: '/Emlak/Konteyner' },
        { name: 'Satılık Daireler', route: '/Emlak/Satilik-Daireler' },
        { name: 'Tatil Evi & Yurt Dışı Emlak', route: '/Emlak/Tatil-Evi-Yurt-Disi-Emlak' },
        { name: 'Garaj & Otopark', route: '/Emlak/Garaj-Otopark' },
        { name: 'Ticari Emlak', route: '/Emlak/Ticari-Emlak' },
        { name: 'Arsa & Bahçe', route: '/Emlak/Arsa-Bahce' },
        { name: 'Satılık Evler', route: '/Emlak/Satilik-Evler' },
        { name: 'Kiralık Evler', route: '/Emlak/Kiralik-Evler' },
        { name: 'Kiralık Daireler', route: '/Emlak/Kiralik-Daireler' },
        { name: 'Yeni Projeler', route: '/Emlak/Yeni-Projeler' },
        { name: 'Taşımacılık & Nakliye', route: '/Emlak/Tasimacilik-Nakliye' },
        { name: 'Diğer Emlak', route: '/Emlak/Diger-Emlak' }
    ];

    const filterConfig = {
        art: {
            label: 'İlan Türü',
            type: 'multiselect',
            options: [
                { value: 'Kaufen', label: 'Satılık' },
                { value: 'Mieten', label: 'Kiralık' }
            ],
            field: 'angebotsart'
        },
        area: {
            label: 'Alan (m²)',
            type: 'range',
            field: 'area'
        },
        availableFrom: {
            label: 'Müsaitlik Tarihi',
            type: 'month',
            field: 'available_from'
        },
        pricePerSqm: {
            label: 'Metrekare Fiyatı',
            type: 'range',
            field: 'price_per_sqm'
        },
        onlineViewing: {
            label: 'Online Gösterim',
            type: 'multiselect',
            options: [
                { value: 'Möglich', label: 'Mümkün' },
                { value: 'Nicht möglich', label: 'Mümkün Değil' }
            ],
            field: 'online_viewing'
        },
        price: {
            label: 'Fiyat',
            type: 'range',
            field: 'price'
        },
        amenities: {
            label: 'Donanım',
            type: 'multiselect',
            options: [
                { value: 'Starkstrom', label: 'Yüksek Akım' },
                { value: 'Klimaanlage', label: 'Klima' },
                { value: 'DV-Verkabelung', label: 'DV Kablolama' },
                { value: 'Stufenloser Zugang', label: 'Engelsiz Erişim' },
                { value: 'Küche', label: 'Mutfak' },
                { value: 'Fußbodenheizung', label: 'Yerden Isıtma' }
            ],
            field: 'amenities'
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
        federalState: {
            label: 'Konum',
            type: 'multiselect',
            options: getTurkishCities().map(city => ({ value: city, label: city })),
            field: 'federal_state'
        }
    };

    const bannerConfig = {
        icon: '🏠',
        bgColor: 'bg-gradient-to-r from-red-500 to-rose-600',
        description: 'Konteyner İlanlarını Keşfedin'
    };

    return (
        <GenericCategoryPage
            category="Emlak"
            subCategory="Konteyner"
            pageTitle="Konteyner"
            filterConfig={filterConfig}
            bannerConfig={bannerConfig}
            subCategories={subCategories}
            toggleFavorite={toggleFavorite}
            isFavorite={isFavorite}
        />
    );
};

export default ContainerPage;
