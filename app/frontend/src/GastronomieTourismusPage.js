import React from 'react';
import GenericCategoryPage from './components/GenericCategoryPage';
import { getTurkishCities } from './translations';

const GastronomieTourismusPage = ({ toggleFavorite, isFavorite }) => {
    const filterConfig = {
        art: {
            label: 'Tür',
            type: 'multiselect',
            options: [
                { value: 'Barmen/Barmaid', label: 'Barmen/Barmaid' },
                { value: 'Otel Elemanı', label: 'Otel Elemanı' },
                { value: 'Garson', label: 'Garson' },
                { value: 'Aşçı', label: 'Aşçı' },
                { value: 'Mutfak Yardımcısı', label: 'Mutfak Yardımcısı' },
                { value: 'Servis Elemanı', label: 'Servis Elemanı' },
                { value: 'Kat Hizmetleri', label: 'Kat Hizmetleri' },
                { value: 'Diğer Meslekler', label: 'Diğer Meslekler' }
            ],
            field: 'gastronomie_tourismus_art'
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
        jobType: {
            label: 'İş Türü',
            type: 'multiselect',
            options: [
                { value: 'Tam Zamanlı', label: 'Tam Zamanlı' },
                { value: 'Yarı Zamanlı', label: 'Yarı Zamanlı' },
                { value: 'Mini İş', label: 'Mini İş' },
                { value: 'Staj', label: 'Staj' },
                { value: 'Çalışan Öğrenci', label: 'Çalışan Öğrenci' },
                { value: 'Serbest Çalışan', label: 'Serbest Çalışan' }
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
