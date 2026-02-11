import React from 'react';
import GenericCategoryPage from './components/GenericCategoryPage';
import { getTurkishCities } from './translations';

const WeiteresAutoRadBootPage = ({ toggleFavorite, isFavorite }) => {
    const subCategories = [
        { name: 'Tümü', route: '/Otomobil-Bisiklet-Tekne' },
        { name: 'Otomobiller', route: '/Otomobil-Bisiklet-Tekne/Otomobiller' },
        { name: 'Oto Parça & Lastik', route: '/Otomobil-Bisiklet-Tekne/Oto-Parca-Lastik' },
        { name: 'Tekne & Tekne Malzemeleri', route: '/Otomobil-Bisiklet-Tekne/Tekne-Tekne-Malzemeleri' },
        { name: 'Bisiklet & Aksesuarlar', route: '/Otomobil-Bisiklet-Tekne/Bisiklet-Aksesuarlar' },
        { name: 'Motosiklet & Scooter', route: '/Otomobil-Bisiklet-Tekne/Motosiklet-Scooter' },
        { name: 'Motosiklet Parça & Aksesuarlar', route: '/Otomobil-Bisiklet-Tekne/Motosiklet-Parca-Aksesuarlar' },
        { name: 'Ticari Araçlar & Römorklar', route: '/Otomobil-Bisiklet-Tekne/Ticari-Araclar-Romorklar' },
        { name: 'Tamir & Servis', route: '/Otomobil-Bisiklet-Tekne/Tamir-Servis' },
        { name: 'Karavan & Motokaravan', route: '/Otomobil-Bisiklet-Tekne/Karavan-Motokaravan' },
        { name: 'Diğer Otomobil, Bisiklet & Tekne', route: '/Otomobil-Bisiklet-Tekne/Diger-Otomobil-Bisiklet-Tekne' }
    ];

    const filterConfig = {
        price: {
            label: 'Fiyat',
            type: 'range',
            field: 'price'
        },
        versand: {
            label: 'Kargo',
            type: 'multiselect',
            options: [
                { value: 'Kargo Mümkün', label: 'Kargo Mümkün' },
                { value: 'Sadece Elden Teslim', label: 'Sadece Elden Teslim' }
            ],
            field: 'versand_art'
        },
        offerType: {
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
        federalState: {
            label: 'Konum',
            type: 'multiselect',
            options: getTurkishCities(),
            field: 'federal_state'
        }
    };

    const bannerConfig = {
        icon: '🔧',
        bgColor: 'bg-gray-500',
        description: 'Mobilite hakkında diğer her şey'
    };

    return (
        <GenericCategoryPage
            category="Otomobil, Bisiklet & Tekne"
            subCategory="Diğer Otomobil, Bisiklet & Tekne"
            pageTitle="Diğer Otomobil, Bisiklet & Tekne"
            subCategories={subCategories}
            filterConfig={filterConfig}
            bannerConfig={bannerConfig}
            toggleFavorite={toggleFavorite}
            isFavorite={isFavorite}
        />
    );
};

export default WeiteresAutoRadBootPage;
