import React from 'react';
import GenericCategoryPage from './components/GenericCategoryPage';
import { getTurkishCities } from './translations';

const SalesPurchasingMarketingPage = ({ toggleFavorite, isFavorite }) => {
    const filterConfig = {
        jobType: {
            label: 'Meslek',
            type: 'multiselect',
            options: [
                { value: 'Muhasebeci', label: 'Muhasebeci' },
                { value: 'Emlak Danışmanı', label: 'Emlak Danışmanı' },
                { value: 'Tüccar', label: 'Tüccar' },
                { value: 'Satış Temsilcisi', label: 'Satış Temsilcisi' },
                { value: 'Diğer Meslekler', label: 'Diğer Meslekler' }
            ],
            field: 'vertrieb_einkauf_verkauf_art'
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
        description: 'Satış, Satın Alma & Pazarlama'
    };

    return (
        <GenericCategoryPage
            category="İş İlanları"
            subCategory="Satış, Satın Alma & Pazarlama"
            pageTitle="Satış, Satın Alma & Pazarlama"
            filterConfig={filterConfig}
            bannerConfig={bannerConfig}
            toggleFavorite={toggleFavorite}
            isFavorite={isFavorite}
        />
    );
};

export default SalesPurchasingMarketingPage;
