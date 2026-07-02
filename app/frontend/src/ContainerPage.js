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
                { value: 'Satılık', label: 'Satılık' },
                { value: 'Kiralık', label: 'Kiralık' }
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
                { value: 'Mümkün', label: 'Mümkün' },
                { value: 'Mümkün Değil', label: 'Mümkün Değil' }
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
                { value: 'Yüksek Akım', label: 'Yüksek Akım' },
                { value: 'Klima', label: 'Klima' },
                { value: 'DV Kablolama', label: 'DV Kablolama' },
                { value: 'Engelsiz Erişim', label: 'Engelsiz Erişim' },
                { value: 'Mutfak', label: 'Mutfak' },
                { value: 'Yerden Isıtma', label: 'Yerden Isıtma' }
            ],
            field: 'amenities'
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
            options: [], dynamic: true,),
            field: 'federal_state'
        }
    };

    const bannerConfig = {
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
