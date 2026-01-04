import React from 'react';
import GenericCategoryPage from './components/GenericCategoryPage';
import { getTurkishCities } from './translations';

const NutzfahrzeugePage = ({ toggleFavorite, isFavorite }) => {
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
                { value: 'Tarım Araçları', label: 'Tarım Araçları' },
                { value: 'Römorklar', label: 'Römorklar' },
                { value: 'İş Makineleri', label: 'İş Makineleri' },
                { value: 'Otobüsler', label: 'Otobüsler' },
                { value: 'Kamyonlar', label: 'Kamyonlar' },
                { value: 'Çekiciler & Yarı Römorklar', label: 'Çekiciler & Yarı Römorklar' },
                { value: 'Forkliftler', label: 'Forkliftler' },
                { value: 'Traktörler', label: 'Traktörler' },
                { value: 'Transporterlar', label: 'Transporterlar' },
                { value: 'Ticari Araç Parçaları & Aksesuarları', label: 'Ticari Araç Parçaları & Aksesuarları' },
                { value: 'Diğer Ticari Araçlar & Römorklar', label: 'Diğer Ticari Araçlar & Römorklar' }
            ],
            field: 'nutzfahrzeuge_art'
        },
        price: {
            label: 'Fiyat',
            type: 'range',
            field: 'price'
        },
        offerType: {
            label: 'İlan Tipi',
            type: 'multiselect',
            options: [
                { value: 'Angebote', label: 'Satılık' },
                { value: 'Gesuche', label: 'Aranıyor' }
            ],
            field: 'offer_type'
        },
        federalState: {
            label: 'Konum',
            type: 'multiselect',
            options: getTurkishCities(),
            field: 'federal_state'
        }
    };

    const bannerConfig = {
        icon: '🚛',
        bgColor: 'bg-orange-600',
        description: 'Kamyonlar, Ticari Araçlar, Römorklar ve daha fazlası'
    };

    return (
        <GenericCategoryPage
            category="Otomobil, Bisiklet & Tekne"
            subCategory="Ticari Araçlar & Römorklar"
            pageTitle="Ticari Araçlar & Römorklar"
            subCategories={subCategories}
            filterConfig={filterConfig}
            bannerConfig={bannerConfig}
            toggleFavorite={toggleFavorite}
            isFavorite={isFavorite}
        />
    );
};

export default NutzfahrzeugePage;
