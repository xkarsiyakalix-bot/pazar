import React from 'react';
import GenericCategoryPage from './components/GenericCategoryPage';
import { getTurkishCities } from './translations';

const DienstleistungenPage = ({ toggleFavorite, isFavorite }) => {
    const subCategories = [
        { name: 'Tümü', route: '/Hizmetler' },
        { name: 'Yaşlı Bakımı', route: '/Hizmetler/Yasli-Bakimi' },
        { name: 'Otomobil, Bisiklet & Tekne', route: '/Hizmetler/Otomobil-Bisiklet-Tekne-Servisi' },
        { name: 'Bebek Bakıcısı & Kreş', route: '/Hizmetler/Babysitter-Cocuk-Bakimi' },
        { name: 'Elektronik', route: '/Hizmetler/Elektronik' },
        { name: 'Ev & Bahçe', route: '/Hizmetler/Ev-Bahce' },
        { name: 'Sanatçılar & Müzisyenler', route: '/Hizmetler/Sanatcilar-Muzisyenler' },
        { name: 'Seyahat & Etkinlik', route: '/Hizmetler/Seyahat-Etkinlik' },
        { name: 'Evcil Hayvan Bakımı & Eğitim', route: '/Hizmetler/Hayvan-Bakimi-Egitimi' },
        { name: 'Taşımacılık & Nakliye', route: '/Hizmetler/Tasimacilik-Nakliye' },
        { name: 'Diğer Hizmetler', route: '/Hizmetler/Diger-Hizmetler' }
    ];

    const filterConfig = {
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
        icon: '🛠️',
        bgColor: 'bg-gradient-to-r from-red-500 to-rose-600',
        description: 'Hizmetler'
    };

    return (
        <GenericCategoryPage
            category="Hizmetler"
            pageTitle="Hizmetler"
            subCategories={subCategories}
            filterConfig={filterConfig}
            bannerConfig={bannerConfig}
            toggleFavorite={toggleFavorite}
            isFavorite={isFavorite}
        />
    );
};

export default DienstleistungenPage;
