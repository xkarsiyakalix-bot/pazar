import React from 'react';
import GenericCategoryPage from './components/GenericCategoryPage';
import { getTurkishCities } from './translations';

const TransportLogistikVerkehrPage = ({ toggleFavorite, isFavorite }) => {
    const filterConfig = {
        jobType: {
            label: 'Tür',
            type: 'multiselect',
            options: [
                { value: 'Şoför', label: 'Şoför' },
                { value: 'Kurye', label: 'Kurye' },
                { value: 'Depo Elemanı', label: 'Depo Elemanı' },
                { value: 'Forklift Operatörü', label: 'Forklift Operatörü' },
                { value: 'Diğer Meslekler', label: 'Diğer Meslekler' }
            ],
            field: 'transport_logistik_verkehr_art'
        },
        workingTime: {
            label: 'Çalışma Süresi',
            type: 'multiselect',
            options: [
                { value: 'Tam Zamanlı', label: 'Tam Zamanlı' },
                { value: 'Yarı Zamanlı', label: 'Yarı Zamanlı' }
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
            label: 'Şehir',
            type: 'multiselect',
            options: getTurkishCities(),
            field: 'federal_state'
        }
    };

    const bannerConfig = {
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
