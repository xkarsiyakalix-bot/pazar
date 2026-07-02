import React from 'react';
import GenericCategoryPage from './components/GenericCategoryPage';
import { getTurkishCities } from './translations';

const EigentumswohnungenPage = ({ toggleFavorite, isFavorite }) => {
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
        floor: {
            label: 'Kat',
            type: 'range',
            field: 'floor'
        },
        availableFrom: {
            label: 'Müsaitlik Tarihi',
            type: 'month',
            field: 'available_from'
        },
        art: {
            label: 'Konut Tipi',
            type: 'multiselect',
            options: [
                { value: 'Çatı Katı', label: 'Çatı Katı' },
                { value: 'Giriş Katı', label: 'Giriş Katı' },
                { value: 'Ara Kat', label: 'Ara Kat' },
                { value: 'Yüksek Giriş', label: 'Yüksek Giriş' },
                { value: 'Loft', label: 'Loft' },
                { value: 'Dubleks', label: 'Dubleks' },
                { value: 'Penthouse', label: 'Penthouse' },
                { value: 'Bodrum Kat', label: 'Bodrum Kat' },
                { value: 'Teraslı Daire', label: 'Teraslı Daire' },
                { value: 'Diğer Konut Tipleri', label: 'Diğer Konut Tipleri' }
            ],
            field: 'wohnungstyp'
        },
        constructionYear: {
            label: 'Yapım Yılı',
            type: 'range',
            field: 'construction_year'
        },
        commission: {
            label: 'Komisyon',
            type: 'multiselect',
            options: [
                { value: 'Komisyonsuz', label: 'Komisyonsuz' },
                { value: 'Komisyonlu', label: 'Komisyonlu' }
            ],
            field: 'commission'
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
        apartmentFeatures: {
            label: 'Daire Özellikleri',
            type: 'multiselect',
            options: [
                { value: 'Eşyalı/Yarı Eşyalı', label: 'Eşyalı/Yarı Eşyalı' },
                { value: 'Balkon', label: 'Balkon' },
                { value: 'Teras', label: 'Teras' },
                { value: 'Ankastre Mutfak', label: 'Ankastre Mutfak' },
                { value: 'Küvet', label: 'Küvet' },
                { value: 'Misafir WC', label: 'Misafir WC' },
                { value: 'Engelsiz Erişim', label: 'Engelsiz Erişim' },
                { value: 'Yerden Isıtma', label: 'Yerden Isıtma' }
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
                { value: 'Tarihi Eser', label: 'Tarihi Eser' },
                { value: 'Kiracılı', label: 'Kiracılı' }
            ],
            field: 'general_features'
        },
        offer_type: {
            label: 'İlan Tipi',
            type: 'multiselect',
            options: [
                { value: 'Satılık', label: 'Satılık' },
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
        description: 'Satılık Daire İlanlarını Keşfedin'
    };

    return (
        <GenericCategoryPage
            category="Emlak"
            subCategory="Satılık Daire"
            pageTitle="Satılık Daireler"
            filterConfig={filterConfig}
            bannerConfig={bannerConfig}
            subCategories={subCategories}
            toggleFavorite={toggleFavorite}
            isFavorite={isFavorite}
        />
    );
};

export default EigentumswohnungenPage;
