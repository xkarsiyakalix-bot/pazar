import React from 'react';
import GenericCategoryPage from './components/GenericCategoryPage';
import { getTurkishCities } from './translations';

const FerienAuslandsimmobilienPage = ({ toggleFavorite, isFavorite }) => {
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
        lage: {
            label: 'Konum Türü',
            type: 'multiselect',
            options: [
                { value: 'Inland', label: 'Yurt İçi' },
                { value: 'Ausland', label: 'Yurt Dışı' }
            ],
            field: 'lage'
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
        price: {
            label: 'Fiyat',
            type: 'range',
            field: 'price'
        },
        amenities: {
            label: 'Donanım',
            type: 'multiselect',
            options: [
                { value: 'Möbliert/Teilmöbliert', label: 'Eşyalı/Yarı Eşyalı' },
                { value: 'Balkon', label: 'Balkon' },
                { value: 'Terrasse', label: 'Teras' },
                { value: 'Einbauküche', label: 'Ankastre Mutfak' },
                { value: 'Badewanne', label: 'Küvet' },
                { value: 'Gäste-WC', label: 'Misafir WC' },
                { value: 'Stufenloser Zugang', label: 'Engelsiz Erişim' },
                { value: 'Fußbodenheizung', label: 'Yerden Isıtma' },
                { value: 'WLAN', label: 'Wi-Fi' },
                { value: 'Kühlschrank', label: 'Buzdolabı' },
                { value: 'Waschmaschine', label: 'Çamaşır Makinesi' },
                { value: 'Spülmaschine', label: 'Bulaşık Makinesi' },
                { value: 'TV', label: 'Televizyon' }
            ],
            field: 'amenities'
        },
        generalFeatures: {
            label: 'Genel Özellikler',
            type: 'multiselect',
            options: [
                { value: 'Altbau', label: 'Eski Yapı' },
                { value: 'Neubau', label: 'Yeni Yapı' },
                { value: 'Aufzug', label: 'Asansör' },
                { value: 'Keller', label: 'Bodrum' },
                { value: 'Dachboden', label: 'Tavan Arası' },
                { value: 'Garage/Stellplatz', label: 'Garaj/Park Yeri' },
                { value: 'Garten/-mitnutzung', label: 'Bahçeli/Bahçe Kullanımı' },
                { value: 'Haustiere erlaubt', label: 'Evcil Hayvan İzni' },
                { value: 'WG-geeignet', label: 'Paylaşımlı Eve Uygun' },
                { value: 'Denkmalobjekt', label: 'Tarihi Eser' },
                { value: 'Aktuell vermietet', label: 'Kiracılı' }
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
        description: 'Dünya Genelinde Hayalinizdeki Emlakları Keşfedin'
    };

    return (
        <GenericCategoryPage
            category="Emlak"
            subCategory="Tatil Evi & Yurt Dışı Emlak"
            pageTitle="Tatil Evi & Yurt Dışı Emlak"
            filterConfig={filterConfig}
            bannerConfig={bannerConfig}
            subCategories={subCategories}
            toggleFavorite={toggleFavorite}
            isFavorite={isFavorite}
        />
    );
};

export default FerienAuslandsimmobilienPage;
