import React from 'react';
import GenericCategoryPage from './components/GenericCategoryPage';
import { getTurkishCities } from './translations';

const SatilikYazlikPage = ({ toggleFavorite, isFavorite }) => {
    const filterConfig = {
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
        priceRange: {
            label: 'Fiyat Aralığı',
            type: 'range',
            field: 'price'
        },
        rooms: {
            label: 'Oda Sayısı',
            type: 'multiselect',
            options: [
                { value: '1+0', label: '1+0' },
                { value: '1+1', label: '1+1' },
                { value: '2+1', label: '2+1' },
                { value: '2+2', label: '2+2' },
                { value: '3+1', label: '3+1' },
                { value: '3+2', label: '3+2' },
                { value: '4+1', label: '4+1' },
                { value: '4+1 ve üzeri', label: '4+1 ve üzeri' }
            ],
            field: 'rooms'
        },
        m2Range: {
            label: 'Metrekare (m²)',
            type: 'range',
            field: 'living_space'
        },
        plotAreaRange: {
            label: 'Arsa Alanı (m²)',
            type: 'range',
            field: 'plot_area'
        },
        constructionYear: {
            label: 'Yapım Yılı',
            type: 'range',
            field: 'construction_year'
        },
        amenities: {
            label: 'Donanım',
            type: 'multiselect',
            options: [
                { value: 'Mobilyalı/Kısmen Mobilyalı', label: 'Mobilyalı/Kısmen Mobilyalı' },
                { value: 'Balkon', label: 'Balkon' },
                { value: 'Teras', label: 'Teras' },
                { value: 'Ankastre Mutfak', label: 'Ankastre Mutfak' },
                { value: 'Küvet', label: 'Küvet' },
                { value: 'Misafir Tuvaleti', label: 'Misafir Tuvaleti' },
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
            label: 'Özellikler',
            type: 'multiselect',
            options: [
                { value: 'Eski Yapı', label: 'Eski Yapı' },
                { value: 'Yeni Yapı', label: 'Yeni Yapı' },
                { value: 'Asansör', label: 'Asansör' },
                { value: 'Kiler/Bodrum', label: 'Kiler/Bodrum' },
                { value: 'Çatı Katı', label: 'Çatı Katı' },
                { value: 'Garaj/Park Yeri', label: 'Garaj/Park Yeri' },
                { value: 'Bahçe', label: 'Bahçe' },
                { value: 'Evcil Hayvan İzni', label: 'Evcil Hayvan İzni' },
                { value: 'Paylaşımlı Eve Uygun', label: 'Paylaşımlı Eve Uygun' },
                { value: 'Tarihi Eser/Anıt', label: 'Tarihi Eser/Anıt' },
                { value: 'Halen Kirada', label: 'Halen Kirada' }
            ],
            field: 'general_features'
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
        federal_state: {
            label: 'Konum',
            type: 'multiselect',
            options: [], dynamic: true,),
            field: 'federal_state'
        }
    };

    const bannerConfig = {
        bgColor: 'bg-gradient-to-r from-blue-500 to-cyan-600',
        description: 'Satılık Yazlık İlanlarını Keşfedin'
    };

    return (
        <GenericCategoryPage
            category="Emlak"
            subCategory="Satılık Yazlık"
            pageTitle="Satılık Yazlık"
            filterConfig={filterConfig}
            bannerConfig={bannerConfig}
            toggleFavorite={toggleFavorite}
            isFavorite={isFavorite}
        />
    );
};

export default SatilikYazlikPage;
