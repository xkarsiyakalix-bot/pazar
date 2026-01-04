import React from 'react';
import GenericCategoryPage from './components/GenericCategoryPage';
import { getTurkishCities } from './translations';

const AufZeitWGPage = ({ toggleFavorite, isFavorite }) => {
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
            label: 'Konaklama Türü',
            type: 'multiselect',
            options: [
                { value: 'Gesamte Unterkunft', label: 'Tüm Konut' },
                { value: 'Privatzimmer', label: 'Özel Oda' },
                { value: 'Gemeinsames Zimmer', label: 'Paylaşımlı Oda' }
            ],
            field: 'auf_zeit_wg_art'
        },
        rentalType: {
            label: 'Kira Türü',
            type: 'multiselect',
            options: [
                { value: 'befristet', label: 'Süreli' },
                { value: 'unbefristet', label: 'Süresiz' }
            ],
            field: 'rental_type'
        },
        livingSpace: {
            label: 'Yaşam Alanı (m²)',
            type: 'range',
            field: 'living_space'
        },
        rooms: {
            label: 'Oda Sayısı',
            type: 'range',
            field: 'rooms'
        },
        roommates: {
            label: 'Ev Arkadaşı Sayısı',
            type: 'range',
            field: 'roommates'
        },
        availableFrom: {
            label: 'Müsaitlik Tarihi',
            type: 'month',
            field: 'available_from'
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
        warmRent: {
            label: 'Toplam Kira (Sıcak)',
            type: 'range',
            field: 'warm_rent'
        },
        amenities: {
            label: 'Donanım',
            type: 'multiselect',
            options: [
                { value: 'WLAN', label: 'Wi-Fi' },
                { value: 'Möbliert', label: 'Mobilyalı' },
                { value: 'Kühlschrank', label: 'Buzdolabı' },
                { value: 'Backofen', label: 'Fırın' },
                { value: 'Herd', label: 'Ocak' },
                { value: 'Waschmaschine', label: 'Çamaşır Makinesi' },
                { value: 'Trockner', label: 'Kurutma Makinesi' },
                { value: 'Spülmaschine', label: 'Bulaşık Makinesi' },
                { value: 'TV', label: 'Televizyon' }
            ],
            field: 'amenities'
        },
        generalFeatures: {
            label: 'Genel Özellikler',
            type: 'multiselect',
            options: [
                { value: 'Keller', label: 'Bodrum' },
                { value: 'Garage/Stellplatz', label: 'Garaj/Park Yeri' },
                { value: 'Haustiere erlaubt', label: 'Evcil Hayvan İzni' },
                { value: 'Stufenloser Zugang', label: 'Engelsiz Erişim' }
            ],
            field: 'general_features'
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
        description: 'Geçici Konaklama & Paylaşımlı Ev İlanlarını Keşfedin'
    };

    return (
        <GenericCategoryPage
            category="Emlak"
            subCategory="Geçici Konaklama & Paylaşımlı Ev"
            pageTitle="Geçici Konaklama & Paylaşımlı Ev"
            filterConfig={filterConfig}
            bannerConfig={bannerConfig}
            subCategories={subCategories}
            toggleFavorite={toggleFavorite}
            isFavorite={isFavorite}
        />
    );
};

export default AufZeitWGPage;
