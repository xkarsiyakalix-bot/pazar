import React from 'react';
import GenericCategoryPage from './components/GenericCategoryPage';
import { getTurkishCities } from './translations';

const WeitereJobsPage = ({ toggleFavorite, isFavorite }) => {
    const filterConfig = {
        jobType: {
            label: 'Tür',
            type: 'multiselect',
            options: [
                { value: 'Tasarımcı & Grafiker', label: 'Tasarımcı & Grafiker' },
                { value: 'Kuaför', label: 'Kuaför' },
                { value: 'Ev Yardımcısı', label: 'Ev Yardımcısı' },
                { value: 'Apartman Görevlisi', label: 'Apartman Görevlisi' },
                { value: 'Temizlik Elemanı', label: 'Temizlik Elemanı' },
                { value: 'Diğer Meslekler', label: 'Diğer Meslekler' }
            ],
            field: 'weitere_jobs_art'
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
        icon: '💼',
        bgColor: 'bg-gradient-to-r from-red-500 to-rose-600',
        description: 'Diğer İş İlanları'
    };

    return (
        <GenericCategoryPage
            category="İş İlanları"
            subCategory="Diğer İş İlanları"
            pageTitle="Diğer İş İlanları"
            filterConfig={filterConfig}
            bannerConfig={bannerConfig}
            toggleFavorite={toggleFavorite}
            isFavorite={isFavorite}
        />
    );
};

export default WeitereJobsPage;
