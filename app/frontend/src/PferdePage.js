import React from 'react';
import GenericCategoryPage from './components/GenericCategoryPage';
import { getTurkishCities } from './translations';

const PferdePage = ({ toggleFavorite, isFavorite }) => {
    const filterConfig = {
        art: {
            label: 'Tür',
            type: 'multiselect',
            options: [
                { value: 'Büyük Atlar', label: 'Büyük Atlar' },
                { value: 'Küçük Atlar & Midilliler', label: 'Küçük Atlar & Midilliler' }
            ],
            field: 'pferde_art'
        },
        price: {
            label: 'Fiyat',
            type: 'range',
            field: 'price'
        },
        offerType: {
            label: 'Teklif Türü',
            type: 'multiselect',
            options: [
                { value: 'Angebote', label: 'Satılık/Verilecek' },
                { value: 'Gesuche', label: 'Aranıyor' }
            ],
            field: 'offer_type'
        },
        providerType: {
            label: 'Satıcı Tipi',
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
            options: getTurkishCities().map(city => ({ value: city, label: city })),
            field: 'federal_state'
        }
    };

    const bannerConfig = {
        icon: '🐎',
        bgColor: 'bg-gradient-to-r from-red-500 to-rose-600',
        description: 'Atlar & Aksesuarlar'
    };

    const renderCustomFields = (listing) => (
        <div className="flex flex-wrap mt-1">
            {listing.pferde_art && (
                <span className="text-sm mr-3">
                    <span className="text-black font-semibold">Tür: </span>
                    <span className="text-gray-600">{listing.pferde_art}</span>
                </span>
            )}
        </div>
    );

    return (
        <GenericCategoryPage
            category="Evcil Hayvanlar"
            subCategory="Atlar"
            pageTitle="Atlar"
            filterConfig={filterConfig}
            bannerConfig={bannerConfig}
            renderCustomFields={renderCustomFields}
            toggleFavorite={toggleFavorite}
            isFavorite={isFavorite}
        />
    );
};

export default PferdePage;
