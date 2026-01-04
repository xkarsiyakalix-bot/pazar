import React from 'react';
import GenericCategoryPage from './components/GenericCategoryPage';
import { getTurkishCities } from './translations';

const TaschenAccessoiresPage = ({ toggleFavorite, isFavorite }) => {
    const filterConfig = {
        art: {
            label: 'Tür',
            type: 'multiselect',
            options: [
                { value: 'Bere, Atkı & Eldiven', label: 'Bere, Atkı & Eldiven' },
                { value: 'Güneş Gözlükleri', label: 'Güneş Gözlükleri' },
                { value: 'Çanta & Sırt Çantaları', label: 'Çanta & Sırt Çantaları' },
                { value: 'Diğer Çanta & Aksesuarlar', label: 'Diğer Çanta & Aksesuarlar' }
            ],
            field: 'taschen_accessoires_art'
        },
        versand: {
            label: 'Kargo',
            type: 'multiselect',
            options: [
                { value: 'Versand möglich', label: 'Kargo Mümkün' },
                { value: 'Nur Abholung', label: 'Sadece Elden Teslim' }
            ],
            field: 'versand_art'
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
                { value: 'Gewerblich', label: 'Kurumsal' }
            ],
            field: 'seller_type'
        },
        zustand: {
            label: 'Durum',
            type: 'multiselect',
            options: [
                { value: 'neu', label: 'Yeni' },
                { value: 'neu_mit_etikett', label: 'Yeni & Etiketli' },
                { value: 'sehr_gut', label: 'Çok İyi' },
                { value: 'gut', label: 'İyi' },
                { value: 'in_ordnung', label: 'Makul' },
                { value: 'used', label: 'İkinci El' },
                { value: 'defekt', label: 'Kusurlu' }
            ],
            field: 'condition'
        },
        federalState: {
            label: 'Konum',
            type: 'multiselect',
            options: getTurkishCities().map(city => ({ value: city, label: city })),
            field: 'federal_state'
        }
    };

    const bannerConfig = {
        icon: '👜',
        bgColor: 'bg-gradient-to-r from-red-500 to-rose-600',
        description: 'Çanta & Aksesuarlar İlanlarını Keşfedin'
    };

    return (
        <GenericCategoryPage
            category="Moda & Güzellik"
            subCategory="Çanta & Aksesuarlar"
            pageTitle="Çanta & Aksesuarlar"
            filterConfig={filterConfig}
            bannerConfig={bannerConfig}
            toggleFavorite={toggleFavorite}
            isFavorite={isFavorite}
            renderCustomFields={(listing) => (
                <div className="flex flex-wrap mt-1">
                    {listing.taschen_accessoires_art && (
                        <span className="text-sm mr-3">
                            <span className="text-black font-semibold">Tür: </span>
                            <span className="text-gray-600">{listing.taschen_accessoires_art}</span>
                        </span>
                    )}
                </div>
            )}
        />
    );
};

export default TaschenAccessoiresPage;
