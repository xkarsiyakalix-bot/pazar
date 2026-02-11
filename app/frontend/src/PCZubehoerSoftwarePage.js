import React from 'react';
import GenericCategoryPage from './components/GenericCategoryPage';
import { getTurkishCities } from './translations';

const PCZubehoerSoftwarePage = ({ toggleFavorite, isFavorite }) => {
    const filterConfig = {
        art: {
            label: 'Tür',
            type: 'multiselect',
            options: [
                { value: 'Yazıcı & Tarayıcılar', label: 'Yazıcı & Tarayıcılar' },
                { value: 'Sabit Sürücüler & Optik Sürücüler', label: 'Sabit Sürücüler & Optik Sürücüler' },
                { value: 'Kasa', label: 'Kasa' },
                { value: 'Ekran Kartları', label: 'Ekran Kartları' },
                { value: 'Kablolar & Adaptörler', label: 'Kablolar & Adaptörler' },
                { value: 'Anakartlar', label: 'Anakartlar' },
                { value: 'Monitörler', label: 'Monitörler' },
                { value: 'Multimedya', label: 'Multimedya' },
                { value: 'Ağ & Modem', label: 'Ağ & Modem' },
                { value: 'İşlemciler / CPU', label: 'İşlemciler / CPU' },
                { value: 'Bellek', label: 'Bellek' },
                { value: 'Yazılım', label: 'Yazılım' },
                { value: 'Klavye & Fare', label: 'Klavye & Fare' },
                { value: 'Diğer Bilgisayar Aksesuarları', label: 'Diğer Bilgisayar Aksesuarları' }
            ],
            field: 'pc_zubehoer_software_art'
        },
        versand: {
            label: 'Kargo',
            type: 'multiselect',
            options: [
                { value: 'Kargo Mümkün', label: 'Kargo Mümkün' },
                { value: 'Sadece Elden Teslim', label: 'Sadece Elden Teslim' }
            ],
            field: 'versand_art'
        },
        zustand: {
            label: 'Durum',
            type: 'multiselect',
            options: [
                { value: 'Yeni', label: 'Yeni' },
                { value: 'Yeni & Etiketli', label: 'Yeni & Etiketli' },
                { value: 'Çok İyi', label: 'Çok İyi' },
                { value: 'İyi', label: 'İyi' },
                { value: 'Makul', label: 'Makul' },
                { value: 'İkinci El', label: 'İkinci El' },
                { value: 'Kusurlu', label: 'Kusurlu' }
            ],
            field: 'condition'
        },
        price: {
            label: 'Fiyat',
            type: 'range',
            field: 'price'
        },
        offerType: {
            label: 'İlan Tipi',
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
            label: 'Konum',
            type: 'multiselect',
            options: getTurkishCities().map(city => ({ value: city, label: city })),
            field: 'federal_state'
        }
    };

    const bannerConfig = {
        icon: '🖱️',
        bgColor: 'bg-gradient-to-r from-red-500 to-rose-600',
        description: 'Bilgisayar Aksesuar & Yazılım İlanlarını Keşfedin'
    };

    return (
        <GenericCategoryPage
            category="Elektronik"
            subCategory="Bilgisayar Aksesuarları & Yazılım"
            pageTitle="Bilgisayar Aksesuarları & Yazılım"
            filterConfig={filterConfig}
            bannerConfig={bannerConfig}
            toggleFavorite={toggleFavorite}
            isFavorite={isFavorite}
        />
    );
};

export default PCZubehoerSoftwarePage;
