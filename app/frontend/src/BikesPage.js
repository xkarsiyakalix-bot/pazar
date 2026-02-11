import React from 'react';
import GenericCategoryPage from './components/GenericCategoryPage';
import { getTurkishCities } from './translations';
import { getCommonFilters } from './config/filterConfigs';

const BikesPage = ({ toggleFavorite, isFavorite }) => {
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
                { value: 'Kadın', label: 'Kadın' },
                { value: 'Erkek', label: 'Erkek' },
                { value: 'Çocuk', label: 'Çocuk' },
                { value: 'Aksesuar', label: 'Aksesuar' },
                { value: 'Diğer Bisiklet & Aksesuarlar', label: 'Diğer Bisiklet & Aksesuarlar' }
            ],
            field: 'bike_art'
        },
        bike_type: {
            label: 'Bisiklet Tipi',
            type: 'multiselect',
            options: [
                { value: 'BMX', label: 'BMX' },
                { value: 'Şehir Bisikleti', label: 'Şehir Bisikleti' },
                { value: 'Cross & Trekking', label: 'Cross & Trekking' },
                { value: 'Cruiser', label: 'Cruiser' },
                { value: 'Elektrikli Bisiklet', label: 'Elektrikli Bisiklet' },
                { value: 'Fixie & Singlespeed', label: 'Fixie & Singlespeed' },
                { value: 'Katlanır Bisiklet', label: 'Katlanır Bisiklet' },
                { value: 'Yük Bisikleti', label: 'Yük Bisikleti' },
                { value: 'Dağ Bisikleti (MTB)', label: 'Dağ Bisikleti (MTB)' },
                { value: 'Yol/Yarış Bisikleti', label: 'Yol/Yarış Bisikleti' },
                { value: 'Tandem', label: 'Tandem' },
                { value: 'Diğer Bisikletler', label: 'Diğer Bisikletler' }
            ],
            field: 'bike_type'
        },
        ...getCommonFilters()
    };

    const bannerConfig = {
        icon: '🚲',
        bgColor: 'bg-gradient-to-r from-red-500 to-rose-600',
        description: 'Mükemmel bisikletinizi bulun'
    };

    return (
        <GenericCategoryPage
            category="Otomobil, Bisiklet & Tekne"
            subCategory="Bisiklet & Aksesuarlar"
            pageTitle="Bisiklet & Aksesuarlar"
            bannerConfig={bannerConfig}
            subCategories={subCategories}
            filterConfig={filterConfig}
            toggleFavorite={toggleFavorite}
            isFavorite={isFavorite}
        />
    );
};

export default BikesPage;
