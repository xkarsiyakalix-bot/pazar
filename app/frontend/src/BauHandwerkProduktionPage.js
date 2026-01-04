import React from 'react';
import GenericCategoryPage from './components/GenericCategoryPage';
import { getTurkishCities } from './translations';

const BauHandwerkProduktionPage = ({ toggleFavorite, isFavorite }) => {
    const filterConfig = {
        art: {
            label: 'Tür',
            type: 'multiselect',
            options: [
                { value: 'Bauhelfer/-in', label: 'İnşaat Yardımcısı' },
                { value: 'Dachdecker/-in', label: 'Çatı Ustası' },
                { value: 'Elektriker/-in', label: 'Elektrikçi' },
                { value: 'Fliesenleger/-in', label: 'Fayansçı' },
                { value: 'Maler/-in', label: 'Boyacı' },
                { value: 'Maurer/-in', label: 'Duvarcı' },
                { value: 'Produktionshelfer/-in', label: 'Üretim Yardımcısı' },
                { value: 'Schlosser/-in', label: 'Çilingir' },
                { value: 'Tischler/-in', label: 'Marangoz' },
                { value: 'Weitere Berufe', label: 'Diğer Meslekler' }
            ],
            field: 'bau_handwerk_produktion_art'
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
        icon: '🏗️',
        bgColor: 'bg-gradient-to-r from-red-500 to-rose-600',
        description: 'İnşaat, Sanat & Üretim'
    };

    return (
        <GenericCategoryPage
            category="İş İlanları"
            subCategory="İnşaat, Sanat & Üretim"
            pageTitle="İnşaat, Sanat & Üretim"
            filterConfig={filterConfig}
            bannerConfig={bannerConfig}
            toggleFavorite={toggleFavorite}
            isFavorite={isFavorite}
            hidePrice={true}
        />
    );
};

export default BauHandwerkProduktionPage;
