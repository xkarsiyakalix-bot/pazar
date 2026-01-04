import React from 'react';
import GenericCategoryPage from './components/GenericCategoryPage';
import { getTurkishCities } from './translations';

const BuecherZeitschriftenPage = ({ toggleFavorite, isFavorite }) => {
    const filterConfig = {
        art: {
            label: 'Tür',
            type: 'multiselect',
            options: [
                { value: 'Antiquarische Bücher', label: 'Eski Kitaplar' },
                { value: 'Kinderbücher', label: 'Çocuk Kitapları' },
                { value: 'Krimis & Thriller', label: 'Polisiye & Gerilim' },
                { value: 'Kunst & Kultur', label: 'Sanat & Kültür' },
                { value: 'Sachbücher', label: 'Kurgu Dışı' },
                { value: 'Science Fiction', label: 'Bilim Kurgu' },
                { value: 'Unterhaltungsliteratur', label: 'Eğlence Edebiyatı' },
                { value: 'Zeitgenössische Literatur & Klassiker', label: 'Çağdaş Edebiyat & Klasikler' },
                { value: 'Zeitschriften', label: 'Dergiler' },
                { value: 'Weitere Bücher & Zeitschriften', label: 'Diğer Kitap & Dergi' }
            ],
            field: 'buecher_zeitschriften_art'
        },
        versand: {
            label: 'Teslimat',
            type: 'multiselect',
            options: [
                { value: 'Versand möglich', label: 'Kargo Mümkün' },
                { value: 'Nur Abholung', label: 'Sadece Elden Teslim' }
            ],
            field: 'versand_art'
        },
        zustand: {
            label: 'Durum',
            type: 'multiselect',
            options: [
                { value: 'neu', label: 'Yeni' },
                { value: 'sehr_gut', label: 'Çok İyi' },
                { value: 'gut', label: 'İyi' },
                { value: 'in_ordnung', label: 'Makul' },
                { value: 'defekt', label: 'Defolu' }
            ],
            field: 'condition'
        },
        price: {
            label: 'Fiyat',
            type: 'range',
            field: 'price'
        },
        offerType: {
            label: 'İlan Türü',
            type: 'multiselect',
            options: [
                { value: 'Angebote', label: 'Satılık' },
                { value: 'Gesuche', label: 'Aranıyor' }
            ],
            field: 'offer_type'
        },
        providerType: {
            label: 'Satıcı',
            type: 'multiselect',
            options: [
                { value: 'Privatnutzer', label: 'Bireysel' },
                { value: 'Gewerblicher Nutzer', label: 'Kurumsal' }
            ],
            field: 'seller_type'
        },
        federalState: {
            label: 'Şehir',
            type: 'multiselect',
            options: getTurkishCities(),
            field: 'federal_state'
        }
    };

    const bannerConfig = {
        icon: '📚',
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
