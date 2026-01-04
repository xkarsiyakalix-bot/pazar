import React from 'react';
import GenericCategoryPage from './components/GenericCategoryPage';
import { getTurkishCities } from './translations';

const VertriebEinkaufVerkaufPage = ({ toggleFavorite, isFavorite }) => {
    const filterConfig = {
        jobType: {
            label: 'Tür',
            type: 'multiselect',
            options: [
                { value: 'Buchhalter/-in', label: 'Muhasebeci' },
                { value: 'Immobilienmakler/-in', label: 'Emlak Danışmanı' },
                { value: 'Kaufmann/-frau', label: 'Ticari Eleman' },
                { value: 'Verkäufer/-in', label: 'Satış Elemanı' },
                { value: 'Weitere Berufe', label: 'Diğer Meslekler' }
            ],
            field: 'vertrieb_einkauf_verkauf_art'
        },
        workingTime: {
            label: 'Çalışma Süresi',
            type: 'multiselect',
            options: [
                { value: 'Vollzeit', label: 'Tam Zamanlı' },
                { value: 'Teilzeit', label: 'Yarı Zamanlı' }
            ],
            field: 'working_time'
        },
        hourlyWage: {
            label: 'Saatlik Ücret',
            type: 'range',
            field: 'hourly_wage'
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
                { value: 'Privat', label: 'Bireysel' },
                { value: 'Gewerblich', label: 'Kurumsal' }
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
        icon: '🤝',
        bgColor: 'bg-gradient-to-r from-red-500 to-rose-600',
        description: 'Satış, Satın Alma & Pazarlama'
    };

    return (
        <GenericCategoryPage
            category="İş İlanları"
            subCategory="Satış, Satın Alma & Pazarlama"
            pageTitle="Satış, Satın Alma & Pazarlama"
            filterConfig={filterConfig}
            bannerConfig={bannerConfig}
            toggleFavorite={toggleFavorite}
            isFavorite={isFavorite}
        />
    );
};

export default VertriebEinkaufVerkaufPage;
