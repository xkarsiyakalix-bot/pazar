import React from 'react';
import GenericCategoryPage from './components/GenericCategoryPage';
import { getTurkishCities } from './translations';

const TransportLogistikVerkehrPage = ({ toggleFavorite, isFavorite }) => {
    const filterConfig = {
        jobType: {
            label: 'Tür',
            type: 'multiselect',
            options: [
                { value: 'Kraftfahrer/-in', label: 'Şoför' },
                { value: 'Kurierfahrer/-in', label: 'Kurye' },
                { value: 'Lagerhelfer/-in', label: 'Depo Elemanı' },
                { value: 'Staplerfahrer/-in', label: 'Forklift Operatörü' },
                { value: 'Weitere Berufe', label: 'Diğer Meslekler' }
            ],
            field: 'transport_logistik_verkehr_art'
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
        icon: '🚚',
        bgColor: 'bg-gradient-to-r from-red-500 to-rose-600',
        description: 'Nakliye, Lojistik & Trafik'
    };

    return (
        <GenericCategoryPage
            category="İş İlanları"
            subCategory="Nakliye, Lojistik & Trafik"
            pageTitle="Nakliye, Lojistik & Trafik"
            filterConfig={filterConfig}
            bannerConfig={bannerConfig}
            toggleFavorite={toggleFavorite}
            isFavorite={isFavorite}
        />
    );
};

export default TransportLogistikVerkehrPage;
