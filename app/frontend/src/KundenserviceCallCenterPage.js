import React from 'react';
import GenericCategoryPage from './components/GenericCategoryPage';
import { getTurkishCities } from './translations';

const KundenserviceCallCenterPage = ({ toggleFavorite, isFavorite }) => {
    const filterConfig = {
        workingTime: {
            label: 'Çalışma Süresi',
            type: 'multiselect',
            options: [
                { value: 'Vollzeit', label: 'Tam Zamanlı' },
                { value: 'Teilzeit', label: 'Yarı Zamanlı' }
            ],
            field: 'working_time'
        },
        jobType: {
            label: 'İş Türü',
            type: 'multiselect',
            options: [
                { value: 'Vollzeit', label: 'Tam Zamanlı' },
                { value: 'Teilzeit', label: 'Yarı Zamanlı' },
                { value: 'Minijob', label: 'Mini İş' },
                { value: 'Praktikum', label: 'Staj' },
                { value: 'Werkstudent', label: 'Çalışan Öğrenci' },
                { value: 'Selbstständig', label: 'Serbest Çalışan' }
            ],
            field: 'job_type'
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
        icon: '🎧',
        bgColor: 'bg-gradient-to-r from-red-500 to-rose-600',
        description: 'Müşteri Hizmetleri & Çağrı Merkezi'
    };

    return (
        <GenericCategoryPage
            category="İş İlanları"
            subCategory="Müşteri Hizmetleri & Çağrı Merkezi"
            pageTitle="Müşteri Hizmetleri & Çağrı Merkezi"
            filterConfig={filterConfig}
            bannerConfig={bannerConfig}
            toggleFavorite={toggleFavorite}
            isFavorite={isFavorite}
        />
    );
};

export default KundenserviceCallCenterPage;
