import React from 'react';
import GenericCategoryPage from './components/GenericCategoryPage';
import { getTurkishCities } from './translations';

const BuecherZeitschriftenPage = ({ toggleFavorite, isFavorite }) => {
    const filterConfig = {
        art: {
            label: 'Tür',
            type: 'multiselect',
            options: [
                { value: 'Eski Kitaplar', label: 'Eski Kitaplar' },
                { value: 'Çocuk Kitapları', label: 'Çocuk Kitapları' },
                { value: 'Polisiye & Gerilim', label: 'Polisiye & Gerilim' },
                { value: 'Sanat & Kültür', label: 'Sanat & Kültür' },
                { value: 'Kurgu Dışı', label: 'Kurgu Dışı' },
                { value: 'Bilim Kurgu', label: 'Bilim Kurgu' },
                { value: 'Eğlence Edebiyatı', label: 'Eğlence Edebiyatı' },
                { value: 'Çağdaş Edebiyat & Klasikler', label: 'Çağdaş Edebiyat & Klasikler' },
                { value: 'Dergiler', label: 'Dergiler' },
                { value: 'Diğer Kitap & Dergi', label: 'Diğer Kitap & Dergi' }
            ],
            field: 'buecher_zeitschriften_art'
        },
        versand: {
            label: 'Teslimat',
            type: 'multiselect',
            options: [
                { value: 'Kargo Mümkün', label: 'Kargo Mümkün' },
                { value: 'Sadece Elden Teslim', label: 'Sadece Elden Teslim' }
            ],
            field: 'versand_art'
        },
        zustand: {
            label: 'Durum',
            type: 'multiselect',
            options: [
                { value: 'Yeni', label: 'Yeni' },
                { value: 'Çok İyi', label: 'Çok İyi' },
                { value: 'İyi', label: 'İyi' },
                { value: 'Makul', label: 'Makul' },
                { value: 'Defolu', label: 'Defolu' }
            ],
            field: 'condition'
        },
        price: {
            label: 'Fiyat',
            type: 'range',
            field: 'price'
        },
        offer_type: {
            label: 'İlan Türü',
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
            label: 'Şehir',
            type: 'multiselect',
            options: [], dynamic: true,
            field: 'federal_state'
        }
    };

    const bannerConfig = {
        bgColor: 'bg-gradient-to-r from-red-500 to-rose-600',
        description: 'Kitap & Dergi'
    };

    return (
        <GenericCategoryPage
            category="Müzik, Film & Kitap"
            subCategory="Kitap & Dergi"
            pageTitle="Kitap & Dergi"
            filterConfig={filterConfig}
            bannerConfig={bannerConfig}
            toggleFavorite={toggleFavorite}
            isFavorite={isFavorite}
        />
    );
};

export default BuecherZeitschriftenPage;
