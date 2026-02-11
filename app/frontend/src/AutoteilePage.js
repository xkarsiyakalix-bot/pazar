import React from 'react';
import GenericCategoryPage from './components/GenericCategoryPage';
import { getTurkishCities } from './translations';

const AutoteilePage = ({ toggleFavorite, isFavorite }) => {
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
        art: {
            label: 'Tür',
            type: 'multiselect',
            options: [
                { value: 'Araç Ses Sistemi & Navigasyon', label: 'Araç Ses Sistemi & Navigasyon' },
                { value: 'Yedek Parça & Onarım', label: 'Yedek Parça & Onarım' },
                { value: 'Lastik & Jant', label: 'Lastik & Jant' },
                { value: 'Modifiye & Tasarım', label: 'Modifiye & Tasarım' },
                { value: 'Alet & El Gereçleri', label: 'Alet & El Gereçleri' },
                { value: 'Diğer Oto Parçaları', label: 'Diğer Oto Parçaları' }
            ],
            field: 'autoteile_art'
        },
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
            field: 'autoteile_angebotstyp'
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
        bgColor: 'bg-gradient-to-r from-red-500 to-rose-600',
        description: 'Aracınız için uygun parçaları bulun'
    };

    return (
        <GenericCategoryPage
            category="Otomobil, Bisiklet & Tekne"
            subCategory="Oto Parça & Lastik"
            pageTitle="Oto Parça & Lastik"
            subCategories={subCategories}
            filterConfig={filterConfig}
            bannerConfig={bannerConfig}
            toggleFavorite={toggleFavorite}
            isFavorite={isFavorite}
        />
    );
};

export default AutoteilePage;
