import React from 'react';
import GenericCategoryPage from './components/GenericCategoryPage';
import { getTurkishCities } from './translations';

const AusbildungPage = ({ toggleFavorite, isFavorite }) => {
    const filterConfig = {
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
            label: 'Saatlik Ücret (TL)',
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
        description: 'Mesleki Eğitim'
    };

    return (
        <GenericCategoryPage
            category="İş İlanları"
            subCategory="Eğitim / Meslek Eğitimi"
            pageTitle="Eğitim / Meslek Eğitimi"
            filterConfig={filterConfig}
            bannerConfig={bannerConfig}
            toggleFavorite={toggleFavorite}
            isFavorite={isFavorite}
        />
    );
};

export default AusbildungPage;
