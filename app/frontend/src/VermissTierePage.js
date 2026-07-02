import React from 'react';
import GenericCategoryPage from './components/GenericCategoryPage';
import { getTurkishCities } from './translations';

const VermissTierePage = ({ toggleFavorite, isFavorite }) => {
    const filterConfig = {
        status: {
            label: 'Durum',
            type: 'multiselect',
            options: [
                { value: 'Kayboldu', label: 'Kayboldu' },
                { value: 'Bulundu', label: 'Bulundu' }
            ],
            field: 'vermisste_tiere_status'
        },
        price: {
            label: 'Ödül/Fiyat',
            type: 'range',
            field: 'price'
        },
        offer_type: {
            label: 'Teklif Türü',
            type: 'multiselect',
            options: [
                { value: 'Satılık/Verilecek', label: 'Satılık/Verilecek' },
                { value: 'Aranıyor', label: 'Aranıyor' }
            ],
            field: 'offer_type'
        },
        providerType: {
            label: 'Satıcı Tipi',
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
        description: 'Kayıp Hayvanlar'
    };

    const renderCustomFields = (listing) => (
        <div className="flex flex-wrap mt-1">
            {listing.vermisste_tiere_status && (
                <span className="text-sm">
                    <span className="text-black font-semibold">Durum: </span>
                    <span className="text-gray-600">{listing.vermisste_tiere_status}</span>
                </span>
            )}
        </div>
    );

    return (
        <GenericCategoryPage
            category="Evcil Hayvanlar"
            subCategory="Kayıp Hayvanlar"
            pageTitle="Kayıp Hayvanlar"
            filterConfig={filterConfig}
            bannerConfig={bannerConfig}
            renderCustomFields={renderCustomFields}
            toggleFavorite={toggleFavorite}
            isFavorite={isFavorite}
        />
    );
};

export default VermissTierePage;
