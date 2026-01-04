import React from 'react';
import GenericCategoryPage from './components/GenericCategoryPage';
import { getTurkishCities } from './translations';

const GastronomieTourismusPage = ({ toggleFavorite, isFavorite }) => {
    const filterConfig = {
        art: {
            label: 'Tür',
            type: 'multiselect',
            options: [
                { value: 'Barkeeper/-in', label: 'Barmen/Barmaid' },
                { value: 'Hotelfachmann/-frau', label: 'Otel Elemanı' },
                { value: 'Kellner/-in', label: 'Garson' },
                { value: 'Koch/Köchin', label: 'Aşçı' },
                { value: 'Küchenhilfe', label: 'Mutfak Yardımcısı' },
                { value: 'Servicekraft', label: 'Servis Elemanı' },
                { value: 'Housekeeping', label: 'Kat Hizmetleri' },
                { value: 'Weitere Berufe', label: 'Diğer Meslekler' }
            ],
            field: 'gastronomie_tourismus_art'
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
        icon: '🍽️',
        bgColor: 'bg-gradient-to-r from-red-500 to-rose-600',
        description: 'Gastronomi & Turizm'
    };

    return (
        <GenericCategoryPage
            category="İş İlanları"
            subCategory="Gastronomi & Turizm"
            pageTitle="Gastronomi & Turizm"
            filterConfig={filterConfig}
            bannerConfig={bannerConfig}
            toggleFavorite={toggleFavorite}
            isFavorite={isFavorite}
        />
    );
};

export default GastronomieTourismusPage;
