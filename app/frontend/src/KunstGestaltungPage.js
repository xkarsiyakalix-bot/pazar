import React from 'react';
import GenericCategoryPage from './components/GenericCategoryPage';
import { getTurkishCities } from './translations';

const KunstGestaltungPage = ({ toggleFavorite, isFavorite }) => {
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
                { value: 'Privatnutzer', label: 'Bireysel' },
                { value: 'Gewerblicher Nutzer', label: 'Kurumsal' }
            ],
            field: 'seller_type'
        },
        federalState: {
            label: 'Şehir',
            type: 'multiselect',
            options: getTurkishCities(),
            field: 'federal_state'
        },
        art: {
            label: 'Tür',
            type: 'multiselect',
            options: [
                { value: 'Malen & Zeichnen', label: 'Resim & Çizim' },
                { value: 'Fotografie', label: 'Fotoğrafçılık' },
                { value: 'Töpfern & Keramik', label: 'Çömlekçilik & Seramik' },
                { value: 'Nähen & Textil', label: 'Dikiş & Tekstil' },
                { value: 'Schmuckdesign', label: 'Takı Tasarımı' },
                { value: 'Sonstiges', label: 'Diğer' }
            ],
            field: 'kunst_gestaltung_art'
        }
    };

    const bannerConfig = {
        icon: '🎨',
        bgColor: 'bg-gradient-to-r from-red-500 to-rose-600',
        description: 'Sanat & Tasarım Kursları'
    };

    return (
        <GenericCategoryPage
            category="Eğitim & Kurslar"
            subCategory="Sanat & Tasarım"
            pageTitle="Sanat & Tasarım Kursları"
            subCategories={subCategories}
            filterConfig={filterConfig}
            bannerConfig={bannerConfig}
            toggleFavorite={toggleFavorite}
            isFavorite={isFavorite}
            renderCustomFields={(listing) => (
                <div className="flex flex-wrap mt-1">
                    {listing.kunst_gestaltung_art && (
                        <span className="text-sm mr-3">
                            <span className="text-black font-semibold">Tür: </span>
                            <span className="text-gray-600">{listing.kunst_gestaltung_art}</span>
                        </span>
                    )}
                </div>
            )}
        />
    );
};

export default KunstGestaltungPage;
