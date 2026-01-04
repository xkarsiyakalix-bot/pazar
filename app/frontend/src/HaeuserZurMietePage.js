import React from 'react';
import GenericCategoryPage from './components/GenericCategoryPage';
import { getTurkishCities } from './translations';

const HaeuserZurMietePage = ({ toggleFavorite, isFavorite }) => {
    const subCategories = [
        { name: 'Tümü', route: '/Emlak' },
        { name: 'Geçici Konaklama & Paylaşımlı Ev', route: '/Emlak/Gecici-Konaklama-Paylasimli-Ev' },
        { name: 'Konteyner', route: '/Emlak/Konteyner' },
        { name: 'Satılık Daire', route: '/Emlak/Satilik-Daireler' },
        { name: 'Tatil Evi & Yurt Dışı Emlak', route: '/Emlak/Tatil-Evi-Yurt-Disi-Emlak' },
        { name: 'Garaj & Otopark', route: '/Emlak/Garaj-Otopark' },
        { name: 'Ticari Emlak', route: '/Emlak/Ticari-Emlak' },
        { name: 'Arsa & Bahçe', route: '/Emlak/Arsa-Bahce' },
        { name: 'Satılık Müstakil Ev', route: '/Emlak/Satilik-Evler' },
        { name: 'Kiralık Müstakil Ev', route: '/Emlak/Kiralik-Evler' },
        { name: 'Kiralık Daire', route: '/Emlak/Kiralik-Daireler' },
        { name: 'Yeni Projeler', route: '/Emlak/Yeni-Projeler' },
        { name: 'Taşımacılık & Nakliye', route: '/Emlak/Tasimacilik-Nakliye' },
        { name: 'Diğer Emlak', route: '/Emlak/Diger-Emlak' }
    ];

    const filterConfig = {
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
        availableFrom: {
            label: 'Müsaitlik Tarihi',
            type: 'month',
            field: 'available_from'
        },
        art: {
            label: 'Ev Tipi',
            type: 'multiselect',
            options: [
                { value: 'Einfamilienhaus freistehend', label: 'Müstakil Ev' },
                { value: 'Reihenhaus', label: 'Sıra Ev' },
                { value: 'Mehrfamilienhaus', label: 'Apartman' },
                { value: 'Bungalow', label: 'Bungalov' },
                { value: 'Bauernhaus', label: 'Çiftlik Evi' },
                { value: 'Doppelhaushälfte', label: 'İkiz Ev' },
                { value: 'Villa', label: 'Villa' },
                { value: 'Andere Haustypen', label: 'Diğer Ev Tipleri' }
            ],
            field: 'haustyp'
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
        rent: {
            label: 'Kira (Yalın)',
            type: 'range',
            field: 'price'
        },
        houseFeatures: {
            label: 'Ev Özellikleri',
            type: 'multiselect',
            options: [
                { value: 'Möbliert/Teilmöbliert', label: 'Eşyalı/Yarı Eşyalı' },
                { value: 'Balkon', label: 'Balkon' },
                { value: 'Terrasse', label: 'Teras' },
                { value: 'Einbauküche', label: 'Ankastre Mutfak' },
                { value: 'Keller', label: 'Bodrum' },
                { value: 'Dachboden', label: 'Tavan Arası' },
                { value: 'Badewanne', label: 'Küvet' },
                { value: 'Gäste-WC', label: 'Misafir WC' },
                { value: 'Stufenloser Zugang', label: 'Engelsiz Erişim' },
                { value: 'Fußbodenheizung', label: 'Yerden Isıtma' }
            ],
            field: 'amenities'
        },
        generalFeatures: {
            label: 'Genel Özellikler',
            type: 'multiselect',
            options: [
                { value: 'Neubau', label: 'Yeni Yapı' },
                { value: 'WG-geeignet', label: 'Paylaşımlı Eve Uygun' },
                { value: 'Garage/Stellplatz', label: 'Garaj/Park Yeri' },
                { value: 'Garten/-mitnutzung', label: 'Bahçeli/Bahçe Kullanımı' },
                { value: 'Haustiere erlaubt', label: 'Evcil Hayvan İzni' }
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
        description: 'Kiralık Ev İlanlarını Keşfedin'
    };

    return (
        <GenericCategoryPage
            category="Emlak"
            subCategory="Kiralık Müstakil Ev"
            pageTitle="Kiralık Evler"
            filterConfig={filterConfig}
            bannerConfig={bannerConfig}
            subCategories={subCategories}
            toggleFavorite={toggleFavorite}
            isFavorite={isFavorite}
        />
    );
};

export default HaeuserZurMietePage;
