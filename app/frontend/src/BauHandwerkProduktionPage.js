import React from 'react';
import GenericCategoryPage from './components/GenericCategoryPage';
import { getTurkishCities } from './translations';

const BauHandwerkProduktionPage = ({ toggleFavorite, isFavorite }) => {
    const filterConfig = {
        art: {
            label: 'Tür',
            type: 'multiselect',
            options: [
                { value: 'İnşaat Yardımcısı', label: 'İnşaat Yardımcısı' },
                { value: 'Çatı Ustası', label: 'Çatı Ustası' },
                { value: 'Elektrikçi', label: 'Elektrikçi' },
                { value: 'Fayansçı', label: 'Fayansçı' },
                { value: 'Boyacı', label: 'Boyacı' },
                { value: 'Duvarcı', label: 'Duvarcı' },
                { value: 'Üretim Yardımcısı', label: 'Üretim Yardımcısı' },
                { value: 'Çilingir', label: 'Çilingir' },
                { value: 'Marangoz', label: 'Marangoz' },
                { value: 'Diğer Meslekler', label: 'Diğer Meslekler' }
            ],
            field: 'bau_handwerk_produktion_art'
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
