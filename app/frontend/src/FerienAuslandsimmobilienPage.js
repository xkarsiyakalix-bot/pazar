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
                { value: 'Satılık', label: 'Satılık' },
                { value: 'Kiralık', label: 'Kiralık' }
            ],
            field: 'angebotsart'
        },
        lage: {
            label: 'Konum Türü',
            type: 'multiselect',
            options: [
                { value: 'Yurt İçi', label: 'Yurt İçi' },
                { value: 'Yurt Dışı', label: 'Yurt Dışı' }
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
                { value: 'Eşyalı/Yarı Eşyalı', label: 'Eşyalı/Yarı Eşyalı' },
                { value: 'Balkon', label: 'Balkon' },
                { value: 'Teras', label: 'Teras' },
                { value: 'Ankastre Mutfak', label: 'Ankastre Mutfak' },
                { value: 'Küvet', label: 'Küvet' },
                { value: 'Misafir WC', label: 'Misafir WC' },
                { value: 'Engelsiz Erişim', label: 'Engelsiz Erişim' },
                { value: 'Yerden Isıtma', label: 'Yerden Isıtma' },
                { value: 'Wi-Fi', label: 'Wi-Fi' },
                { value: 'Buzdolabı', label: 'Buzdolabı' },
                { value: 'Çamaşır Makinesi', label: 'Çamaşır Makinesi' },
                { value: 'Bulaşık Makinesi', label: 'Bulaşık Makinesi' },
                { value: 'Televizyon', label: 'Televizyon' }
            ],
            field: 'amenities'
        },
        generalFeatures: {
            label: 'Genel Özellikler',
            type: 'multiselect',
            options: [
                { value: 'Eski Yapı', label: 'Eski Yapı' },
                { value: 'Yeni Yapı', label: 'Yeni Yapı' },
                { value: 'Asansör', label: 'Asansör' },
                { value: 'Bodrum', label: 'Bodrum' },
                { value: 'Tavan Arası', label: 'Tavan Arası' },
                { value: 'Garaj/Park Yeri', label: 'Garaj/Park Yeri' },
                { value: 'Bahçeli/Bahçe Kullanımı', label: 'Bahçeli/Bahçe Kullanımı' },
                { value: 'Evcil Hayvan İzni', label: 'Evcil Hayvan İzni' },
                { value: 'Paylaşımlı Eve Uygun', label: 'Paylaşımlı Eve Uygun' },
                { value: 'Tarihi Eser', label: 'Tarihi Eser' },
                { value: 'Kiracılı', label: 'Kiracılı' }
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
            options: [], dynamic: true.map(city => ({ value: city, label: city })),
            field: 'federal_state'
        }
    };

    const bannerConfig = {
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
