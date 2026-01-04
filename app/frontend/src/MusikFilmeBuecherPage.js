import React from 'react';
import GenericCategoryPage from './components/GenericCategoryPage';
import { getTurkishCities } from './translations';

const MusikFilmeBuecherPage = ({ toggleFavorite, isFavorite }) => {
    const subCategories = [
        { name: 'Tümü', route: '/Muzik-Film-Kitap' },
        { name: 'Kitap & Dergi', route: '/Muzik-Film-Kitap/Kitap-Dergi' },
        { name: 'Kırtasiye', route: '/Muzik-Film-Kitap/Kirtasiye' },
        { name: 'Çizgi Romanlar', route: '/Muzik-Film-Kitap/Cizgi-Romanlar' },
        { name: 'Ders Kitapları, Okul & Eğitim', route: '/Muzik-Film-Kitap/Ders-Kitaplari-Okul-Egitim' },
        { name: 'Film & DVD', route: '/Muzik-Film-Kitap/Film-DVD' },
        { name: "Müzik & CD'ler", route: '/Muzik-Film-Kitap/Muzik-CDler' },
        { name: 'Müzik Enstrümanları', route: '/Muzik-Film-Kitap/Muzik-Enstrumanlari' },
        { name: 'Diğer Müzik, Film & Kitap', route: '/Muzik-Film-Kitap/Diger-Muzik-Film-Kitap' }
    ];

    const filterConfig = {
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
        bgColor: 'bg-gradient-to-r from-red-600 to-red-700',
        description: 'Müzik, Film & Kitap'
    };

    return (
        <GenericCategoryPage
            category="Müzik, Film & Kitap"
            pageTitle="Müzik, Film & Kitap"
            subCategories={subCategories}
            filterConfig={filterConfig}
            bannerConfig={bannerConfig}
            toggleFavorite={toggleFavorite}
            isFavorite={isFavorite}
        />
    );
};

export default MusikFilmeBuecherPage;
