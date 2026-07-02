import React from 'react';
import GenericCategoryPage from './components/GenericCategoryPage';
import { getTurkishCities } from './translations';

const SprachkursePage = ({ toggleFavorite, isFavorite }) => {
    const subCategories = [
        { name: 'Tümü', route: '/Egitim-Kurslar' },
        { name: 'Bilgisayar Kursları', route: '/Egitim-Kurslar/Bilgisayar-Kurslari' },
        { name: 'Ezoterizm & Spiritüalizm', route: '/Egitim-Kurslar/Ezoterizm-Spiritualizm' },
        { name: 'Yemek & Pastacılık Kursları', route: '/Egitim-Kurslar/Yemek-Pastacilik-Kurslari' },
        { name: 'Sanat & Tasarım Kursları', route: '/Egitim-Kurslar/Sanat-Tasarim-Kurslari' },
        { name: 'Müzik & Şan Dersleri', route: '/Egitim-Kurslar/Muzik-San-Dersleri' },
        { name: 'Özel Ders', route: '/Egitim-Kurslar/Ozel-Ders' },
        { name: 'Spor Kursları', route: '/Egitim-Kurslar/Spor-Kurslari' },
        { name: 'Dil Kursları', route: '/Egitim-Kurslar/Dil-Kurslari' },
        { name: 'Dans Kursları', route: '/Egitim-Kurslar/Dans-Kurslari' },
        { name: 'Sürekli Eğitim', route: '/Egitim-Kurslar/Surekli-Egitim' },
        { name: 'Diğer Dersler & Kurslar', route: '/Egitim-Kurslar/Diger-Dersler-Kurslar' }
    ];

    const filterConfig = {
        price: {
            label: 'Fiyat',
            type: 'range',
            field: 'price'
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
        },
        art: {
            label: 'Dil',
            type: 'multiselect',
            options: [
                { value: 'Almanca', label: 'Almanca' },
                { value: 'İngilizce', label: 'İngilizce' },
                { value: 'Fransızca', label: 'Fransızca' },
                { value: 'İspanyolca', label: 'İspanyolca' },
                { value: 'İtalyanca', label: 'İtalyanca' },
                { value: 'Rusça', label: 'Rusça' },
                { value: 'Diğer', label: 'Diğer' }
            ],
            field: 'sprachkurse_art'
        }
    };

    const bannerConfig = {
        bgColor: 'bg-gradient-to-r from-red-500 to-rose-600',
        description: 'Dil Kursları'
    };

    return (
        <GenericCategoryPage
            category="Eğitim & Kurslar"
            subCategory="Dil Kursları"
            pageTitle="Dil Kursları"
            subCategories={subCategories}
            filterConfig={filterConfig}
            bannerConfig={bannerConfig}
            toggleFavorite={toggleFavorite}
            isFavorite={isFavorite}
            renderCustomFields={(listing) => (
                <div className="flex flex-wrap mt-1">
                    {listing.sprachkurse_art && (
                        <span className="text-sm mr-3">
                            <span className="text-black font-semibold">Dil: </span>
                            <span className="text-gray-600">{listing.sprachkurse_art}</span>
                        </span>
                    )}
                </div>
            )}
        />
    );
};

export default SprachkursePage;
