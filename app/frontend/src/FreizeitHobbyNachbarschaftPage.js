import React from 'react';
import GenericCategoryPage from './components/GenericCategoryPage';
import { getTurkishCities } from './translations';

const FreizeitHobbyNachbarschaftPage = ({ toggleFavorite, isFavorite }) => {
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
            label: 'Teklif Türü',
            type: 'multiselect',
            options: [
                { value: 'Angebote', label: 'Angebote' },
                { value: 'Gesuche', label: 'Gesuche' }
            ],
            field: 'offer_type'
        },
        providerType: {
            label: 'Sağlayıcı',
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
        icon: '🎨',
        bgColor: 'bg-gradient-to-r from-red-500 to-rose-600',
        description: 'Tüm Eğlence & Hobi'
    };

    const subCategories = [
        { name: 'Tümü', route: '/Eglence-Hobi-Mahalle' },
        { name: 'Ezoterizm & Spiritüalizm', route: '/Eglence-Hobi-Mahalle/Ezoterizm-Spiritualizm' },
        { name: 'Yiyecek & İçecek', route: '/Eglence-Hobi-Mahalle/Yiyecek-Icecek' },
        { name: 'Boş Zaman Aktiviteleri', route: '/Eglence-Hobi-Mahalle/Bos-Zaman-Aktiviteleri' },
        { name: 'El Sanatları & Hobi', route: '/Eglence-Hobi-Mahalle/El-Sanatlari-Hobi' },
        { name: 'Sanat & Antikalar', route: '/Eglence-Hobi-Mahalle/Sanat-Antikalar' },
        { name: 'Sanatçılar & Müzisyenler', route: '/Eglence-Hobi-Mahalle/Sanatcilar-Muzisyenler' },
        { name: 'Model Yapımı', route: '/Eglence-Hobi-Mahalle/Model-Yapimi' },
        { name: 'Seyahat & Etkinlik Hizmetleri', route: '/Eglence-Hobi-Mahalle/Seyahat-Etkinlik-Hizmetleri' },
        { name: 'Koleksiyon', route: '/Eglence-Hobi-Mahalle/Koleksiyon' },
        { name: 'Spor & Kamp', route: '/Eglence-Hobi-Mahalle/Spor-Kamp' },
        { name: 'Bit Pazarı', route: '/Eglence-Hobi-Mahalle/Bit-Pazari' },
        { name: 'Kayıp & Buluntu', route: '/Eglence-Hobi-Mahalle/Kayip-Buluntu' },
        { name: 'Diğer Eğlence, Hobi & Mahalle', route: '/Eglence-Hobi-Mahalle/Diger-Eglence-Hobi-Mahalle' }
    ];

    return (
        <GenericCategoryPage
            category="Eğlence, Hobi & Mahalle"
            pageTitle="Eğlence, Hobi & Mahalle"
            filterConfig={filterConfig}
            bannerConfig={bannerConfig}
            subCategories={subCategories}
            toggleFavorite={toggleFavorite}
            isFavorite={isFavorite}
        />
    );
};

export default FreizeitHobbyNachbarschaftPage;
