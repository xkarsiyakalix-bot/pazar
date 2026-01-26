import React from 'react';
import GenericCategoryPage from './components/GenericCategoryPage';
import { getTurkishCities } from './translations';

const SatilikYazlikPage = ({ toggleFavorite, isFavorite }) => {
    const filterConfig = {
        offerType: {
            label: 'İlan Tipi',
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
                { value: 'Privat', label: 'Bireysel' },
                { value: 'Gewerblich', label: 'Kurumsal' }
            ],
            field: 'seller_type'
        },
        priceRange: {
            label: 'Fiyat Aralığı',
            type: 'range',
            field: 'price'
        },
        rooms: {
            label: 'Oda Sayısı',
            type: 'multiselect',
            options: [
                { value: '1', label: '1+0' },
                { value: '1.5', label: '1+1' },
                { value: '2', label: '2+1' },
                { value: '2.5', label: '2+2' },
                { value: '3', label: '3+1' },
                { value: '3.5', label: '3+2' },
                { value: '4', label: '4+1' },
                { value: '4+', label: '4+1 ve üzeri' }
            ],
            field: 'rooms'
        },
        m2Range: {
            label: 'Metrekare (m²)',
            type: 'range',
            field: 'living_space'
        },
        plotAreaRange: {
            label: 'Arsa Alanı (m²)',
            type: 'range',
            field: 'plot_area'
        },
        constructionYear: {
            label: 'Yapım Yılı',
            type: 'range',
            field: 'construction_year'
        },
        amenities: {
            label: 'Donanım',
            type: 'multiselect',
            options: [
                { value: 'Möbliert/Teilmöbliert', label: 'Mobilyalı/Kısmen Mobilyalı' },
                { value: 'Balkon', label: 'Balkon' },
                { value: 'Terrasse', label: 'Teras' },
                { value: 'Einbauküche', label: 'Ankastre Mutfak' },
                { value: 'Badewanne', label: 'Küvet' },
                { value: 'Gäste-WC', label: 'Misafir Tuvaleti' },
                { value: 'Stufenloser Zugang', label: 'Engelsiz Erişim' },
                { value: 'Fußbodenheizung', label: 'Yerden Isıtma' },
                { value: 'WLAN', label: 'Wi-Fi' },
                { value: 'Kühlschrank', label: 'Buzdolabı' },
                { value: 'Waschmaschine', label: 'Çamaşır Makinesi' },
                { value: 'Spülmaschine', label: 'Bulaşık Makinesi' },
                { value: 'TV', label: 'Televizyon' }
            ],
            field: 'amenities'
        },
        generalFeatures: {
            label: 'Özellikler',
            type: 'multiselect',
            options: [
                { value: 'Altbau', label: 'Eski Yapı' },
                { value: 'Neubau', label: 'Yeni Yapı' },
                { value: 'Aufzug', label: 'Asansör' },
                { value: 'Keller', label: 'Kiler/Bodrum' },
                { value: 'Dachboden', label: 'Çatı Katı' },
                { value: 'Garage/Stellplatz', label: 'Garaj/Park Yeri' },
                { value: 'Garten/-mitnutzung', label: 'Bahçe' },
                { value: 'Haustiere erlaubt', label: 'Evcil Hayvan İzni' },
                { value: 'WG-geeignet', label: 'Paylaşımlı Eve Uygun' },
                { value: 'Denkmalobjekt', label: 'Tarihi Eser/Anıt' },
                { value: 'Aktuell vermietet', label: 'Halen Kirada' }
            ],
            field: 'general_features'
        },
        commission: {
            label: 'Komisyon',
            type: 'multiselect',
            options: [
                { value: 'Provisionsfrei', label: 'Komisyonsuz' },
                { value: 'Mit Provision', label: 'Komisyonlu' }
            ],
            field: 'commission'
        },
        federalState: {
            label: 'Konum',
            type: 'multiselect',
            options: getTurkishCities().map(city => ({ label: city, value: city })),
            field: 'federal_state'
        }
    };

    const bannerConfig = {
        icon: '🏖️',
        bgColor: 'bg-gradient-to-r from-blue-500 to-cyan-600',
        description: 'Satılık Yazlık İlanlarını Keşfedin'
    };

    return (
        <GenericCategoryPage
            category="Emlak"
            subCategory="Satılık Yazlık"
            pageTitle="Satılık Yazlık"
            filterConfig={filterConfig}
            bannerConfig={bannerConfig}
            toggleFavorite={toggleFavorite}
            isFavorite={isFavorite}
        />
    );
};

export default SatilikYazlikPage;
