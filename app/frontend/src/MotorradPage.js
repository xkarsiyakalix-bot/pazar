import React from 'react';
import GenericCategoryPage from './components/GenericCategoryPage';
import { getTurkishCities } from './translations';

const MotorradPage = ({ toggleFavorite, isFavorite }) => {
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
                { value: 'Moped & Scooter', label: 'Moped & Scooter' },
                { value: 'Motosikletler', label: 'Motosikletler' },
                { value: 'ATV & Quad', label: 'ATV & Quad' },
                { value: 'Skuter & Kalın Lastikli Skuter', label: 'Skuter & Kalın Lastikli Skuter' },
                { value: 'Diğer Motosikletler', label: 'Diğer Motosikletler' }
            ],
            field: 'motorrad_art'
        },
        marke: {
            label: 'Marka',
            type: 'multiselect',
            options: [
                'Aprilia', 'BMW', 'Buell', 'Ducati', 'Harley', 'Honda', 'Husqvarna',
                'Kawasaki', 'KTM', 'Kymco', 'Moto Guzzi', 'MZ', 'Peugeot', 'Piaggio',
                'Simson', 'Suzuki', 'Triumph', 'Vespa', 'Yamaha', 'Zündapp',
                'Weitere Motorräder'
            ].map(m => m === 'Weitere Motorräder' ? { value: m, label: 'Diğer Motosikletler' } : m),
            field: 'marke'
        },
        kilometerstand: {
            label: 'Kilometre',
            type: 'range',
            field: 'kilometerstand'
        },
        erstzulassung: {
            label: 'İlk Tescil Yılı',
            type: 'range',
            field: 'erstzulassung'
        },
        hubraum: {
            label: 'Motor Hacmi (ccm)',
            type: 'range',
            field: 'hubraum'
        },

        getriebe: {
            label: 'Şanzıman',
            type: 'multiselect',
            options: [
                { value: 'Otomatik', label: 'Otomatik' },
                { value: 'Manuel', label: 'Manuel' },
                { value: 'Yarı Otomatik', label: 'Yarı Otomatik' }
            ],
            field: 'getriebe'
        },

        price: {
            label: 'Fiyat',
            type: 'range',
            field: 'price'
        },
        offer_type: {
            label: 'İlan Tipi',
            type: 'multiselect',
            options: [
                { value: 'Satılık', label: 'Satılık' },
                { value: 'Aranıyor', label: 'Aranıyor' }
            ],
            field: 'offer_type'
        },

        federal_state: {
            label: 'Konum',
            type: 'multiselect',
            options: [], dynamic: true,
            field: 'federal_state'
        }
    };

    const bannerConfig = {
        bgColor: 'bg-gray-800',
        description: 'Hayalinizdeki motosiklet veya scooterı bulun'
    };

    return (
        <GenericCategoryPage
            category="Otomobil, Bisiklet & Tekne"
            subCategory="Motosiklet & Scooter"
            pageTitle="Motosiklet & Scooter"
            subCategories={subCategories}
            filterConfig={filterConfig}
            bannerConfig={bannerConfig}
            toggleFavorite={toggleFavorite}
            isFavorite={isFavorite}
        />
    );
};

export default MotorradPage;
