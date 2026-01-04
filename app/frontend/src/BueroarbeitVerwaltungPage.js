import React from 'react';
import GenericCategoryPage from './components/GenericCategoryPage';
import { getTurkishCities } from './translations';

const BueroarbeitVerwaltungPage = ({ toggleFavorite, isFavorite }) => {
    const filterConfig = {
        art: {
            label: 'Tür',
            type: 'multiselect',
            options: [
                { value: 'Buchhalter/-in', label: 'Muhasebeci' },
                { value: 'Bürokaufmann/-frau', label: 'Ofis Elemanı' },
                { value: 'Sachbearbeiter/-in', label: 'Dosya Sorumlusu' },
                { value: 'Sekretär/-in', label: 'Sekreter' },
                { value: 'Weitere Berufe', label: 'Diğer Meslekler' }
            ],
            field: 'buero_arbeit_verwaltung_art'
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
        icon: '💻',
        bgColor: 'bg-gradient-to-r from-red-500 to-rose-600',
        description: 'Ofis İşleri & Yönetim'
    };

    return (
        <GenericCategoryPage
            category="İş İlanları"
            subCategory="Ofis İşleri & Yönetim"
            pageTitle="Ofis İşleri & Yönetim"
            filterConfig={filterConfig}
            bannerConfig={bannerConfig}
            toggleFavorite={toggleFavorite}
            isFavorite={isFavorite}
        />
    );
};

export default BueroarbeitVerwaltungPage;
