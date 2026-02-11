import React from 'react';
import GenericCategoryPage from './components/GenericCategoryPage';
import { getTurkishCities } from './translations';
import { getCommonFilters } from './config/filterConfigs';

const JobsPage = ({ toggleFavorite, isFavorite }) => {
    const filterConfig = {
        ...getCommonFilters(),
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
        }
    };

    const bannerConfig = {
        icon: '💼',
        bgColor: 'bg-gradient-to-r from-red-500 to-rose-600',
        description: 'İş İlanları'
    };

    const subCategories = [
        { name: 'Tümü', route: '/Is-Ilanlari' },
        { name: 'Mesleki Eğitim', route: '/Is-Ilanlari/Mesleki-Egitim' },
        { name: 'İnşaat, Sanat & Üretim', route: '/Is-Ilanlari/Insaat-Sanat-Uretim' },
        { name: 'Ofis İşleri & Yönetim', route: '/Is-Ilanlari/Buroarbeit-Yonetim' },
        { name: 'Gastronomi & Turizm', route: '/Is-Ilanlari/Gastronomi-Turizm' },
        { name: 'Müşteri Hizmetleri & Çağrı Merkezi', route: '/Is-Ilanlari/Musteri-Hizmetleri-Cagri-Merkezi' },
        { name: 'Mini & Ek İşler', route: '/Is-Ilanlari/Ek-Isler' },
        { name: 'Staj', route: '/Is-Ilanlari/Staj' },
        { name: 'Sosyal Sektör & Bakım', route: '/Is-Ilanlari/Sosyal-Sektor-Bakim' },
        { name: 'Nakliye, Lojistik & Trafik', route: '/Is-Ilanlari/Tasimacilik-Lojistik' },
        { name: 'Satış, Satın Alma & Pazarlama', route: '/Is-Ilanlari/Satis-Pazarlama' },
        { name: 'Diğer İş İlanları', route: '/Is-Ilanlari/Diger-Is-Ilanlari' }
    ];

    return (
        <GenericCategoryPage
            category="İş İlanları"
            pageTitle="İş İlanları"
            filterConfig={filterConfig}
            bannerConfig={bannerConfig}
            toggleFavorite={toggleFavorite}
            isFavorite={isFavorite}
            subCategories={subCategories}
        />
    );
};

export default JobsPage;
