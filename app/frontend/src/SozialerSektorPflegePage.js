import React from 'react';
import GenericCategoryPage from './components/GenericCategoryPage';
import { getTurkishCities } from './translations';

const SozialerSektorPflegePage = ({ toggleFavorite, isFavorite }) => {
    const filterConfig = {
        art: {
            label: 'Tür',
            type: 'multiselect',
            options: [
                { value: 'Yaşlı Bakıcısı', label: 'Yaşlı Bakıcısı' },
                { value: 'Doktor Asistanı', label: 'Doktor Asistanı' },
                { value: 'Eğitmen', label: 'Eğitmen' },
                { value: 'Hemşire', label: 'Hemşire' },
                { value: 'Fizyoterapist', label: 'Fizyoterapist' },
                { value: 'Diğer Meslekler', label: 'Diğer Meslekler' }
            ],
            field: 'sozialer_sektor_pflege_art'
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
        offer_type: {
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
        federal_state: {
            label: 'Şehir',
            type: 'multiselect',
            options: [], dynamic: true,
            field: 'federal_state'
        }
    };

    const bannerConfig = {
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
