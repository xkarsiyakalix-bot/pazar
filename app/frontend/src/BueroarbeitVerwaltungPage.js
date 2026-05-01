import React from 'react';
import GenericCategoryPage from './components/GenericCategoryPage';
import { getTurkishCities } from './translations';

const BueroarbeitVerwaltungPage = ({ toggleFavorite, isFavorite }) => {
    const filterConfig = {
        art: {
            label: 'Tür',
            type: 'multiselect',
            options: [
                { value: 'Muhasebeci', label: 'Muhasebeci' },
                { value: 'Ofis Elemanı', label: 'Ofis Elemanı' },
                { value: 'Dosya Sorumlusu', label: 'Dosya Sorumlusu' },
                { value: 'Sekreter', label: 'Sekreter' },
                { value: 'Diğer Meslekler', label: 'Diğer Meslekler' }
            ],
            field: 'buero_arbeit_verwaltung_art'
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
