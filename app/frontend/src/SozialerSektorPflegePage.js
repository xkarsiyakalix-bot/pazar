import React from 'react';
import GenericCategoryPage from './components/GenericCategoryPage';
import { getTurkishCities } from './translations';

const SozialerSektorPflegePage = ({ toggleFavorite, isFavorite }) => {
    const filterConfig = {
        art: {
            label: 'Tür',
            type: 'multiselect',
            options: [
                { value: 'Altenpfleger/-in', label: 'Yaşlı Bakıcısı' },
                { value: 'Arzthelfer/-in', label: 'Doktor Asistanı' },
                { value: 'Erzieher/-in', label: 'Eğitmen' },
                { value: 'Krankenpfleger/-in', label: 'Hemşire' },
                { value: 'Physiotherapeut/-in', label: 'Fizyoterapist' },
                { value: 'Weitere Berufe', label: 'Diğer Meslekler' }
            ],
            field: 'sozialer_sektor_pflege_art'
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
        icon: '🏥',
        bgColor: 'bg-gradient-to-r from-red-500 to-rose-600',
        description: 'Sosyal Sektör & Bakım'
    };

    return (
        <GenericCategoryPage
            category="İş İlanları"
            subCategory="Sosyal Sektör & Bakım"
            pageTitle="Sosyal Sektör & Bakım"
            filterConfig={filterConfig}
            bannerConfig={bannerConfig}
            toggleFavorite={toggleFavorite}
            isFavorite={isFavorite}
        />
    );
};

export default SozialerSektorPflegePage;
