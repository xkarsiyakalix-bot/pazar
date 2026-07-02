import React from 'react';
import GenericCategoryPage from './components/GenericCategoryPage';
import { getTurkishCities } from './translations';

const AufZeitWGPage = ({ toggleFavorite, isFavorite }) => {
    const subCategories = [
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
                { value: 'Tüm Konut', label: 'Tüm Konut' },
                { value: 'Özel Oda', label: 'Özel Oda' },
                { value: 'Paylaşımlı Oda', label: 'Paylaşımlı Oda' }
            ],
            field: 'auf_zeit_wg_art'
        },
        rentalType: {
            label: 'Kira Türü',
            type: 'multiselect',
            options: [
                { value: 'Süreli', label: 'Süreli' },
                { value: 'Süresiz', label: 'Süresiz' }
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
                { value: 'Mümkün', label: 'Mümkün' },
                { value: 'Mümkün Değil', label: 'Mümkün Değil' }
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
                { value: 'Wi-Fi', label: 'Wi-Fi' },
                { value: 'Mobilyalı', label: 'Mobilyalı' },
                { value: 'Buzdolabı', label: 'Buzdolabı' },
                { value: 'Fırın', label: 'Fırın' },
                { value: 'Ocak', label: 'Ocak' },
                { value: 'Çamaşır Makinesi', label: 'Çamaşır Makinesi' },
                { value: 'Kurutma Makinesi', label: 'Kurutma Makinesi' },
                { value: 'Bulaşık Makinesi', label: 'Bulaşık Makinesi' },
                { value: 'Televizyon', label: 'Televizyon' }
            ],
            field: 'amenities'
        },
        generalFeatures: {
            label: 'Genel Özellikler',
            type: 'multiselect',
            options: [
                { value: 'Bodrum', label: 'Bodrum' },
                { value: 'Garaj/Park Yeri', label: 'Garaj/Park Yeri' },
                { value: 'Evcil Hayvan İzni', label: 'Evcil Hayvan İzni' },
                { value: 'Engelsiz Erişim', label: 'Engelsiz Erişim' }
            ],
            field: 'general_features'
        },
        offer_type: {
            label: 'İlan Tipi',
            type: 'multiselect',
            options: [
                { value: 'Satılık/Kiralık', label: 'Satılık/Kiralık' },
                { value: 'Aranıyor', label: 'Aranıyor' }
            ],
            field: 'offer_type'
        },
        providerType: {
            label: 'Satıcı',
            type: 'multiselect',
            options: [
                { value: 'Bireysel', label: 'Bireysel' },
                { value: 'Kurumsal', label: 'Kurumsal' }
            ],
            field: 'seller_type'
        },
        federal_state: {
            label: 'Konum',
            type: 'multiselect',
            options: [], dynamic: true,
            field: 'federal_state'
        }
    };

    const bannerConfig = {
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
