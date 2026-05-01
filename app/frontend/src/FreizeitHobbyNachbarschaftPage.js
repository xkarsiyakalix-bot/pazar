import React from 'react';
import GenericCategoryPage from './components/GenericCategoryPage';
import { getTurkishCities, t } from './translations';
import { getCommonFilters, getConditionFilter, getShippingFilter } from './config/filterConfigs';

const FreizeitHobbyNachbarschaftPage = ({ toggleFavorite, isFavorite }) => {
    const filterConfig = {
        ...getCommonFilters(),
        ...getConditionFilter(),
        ...getShippingFilter()
    };

    const bannerConfig = {
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
