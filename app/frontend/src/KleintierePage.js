import React from 'react';
import GenericCategoryPage from './components/GenericCategoryPage';
import { getTurkishCities } from './translations';

const KleintierePage = ({ toggleFavorite, isFavorite }) => {
    const filterConfig = {
        art: {
            label: 'Tür',
            type: 'multiselect',
            options: [
                { value: 'Hamster', label: 'Hamster' },
                { value: 'Tavşan', label: 'Tavşan' },
                { value: 'Fare & Sıçan', label: 'Fare & Sıçan' },
                { value: 'Gine Domuzu', label: 'Gine Domuzu' },
                { value: 'Diğer Küçük Hayvanlar', label: 'Diğer Küçük Hayvanlar' }
            ],
            field: 'kleintiere_art'
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
        federalState: {
            label: 'Şehir',
            type: 'multiselect',
            options: getTurkishCities().map(city => ({ value: city, label: city })),
            field: 'federal_state'
        }
    };

    const bannerConfig = {
        bgColor: 'bg-gradient-to-r from-red-500 to-rose-600',
        description: 'Küçük Hayvanlar'
    };

    const renderCustomFields = (listing) => (
        <div className="flex flex-wrap mt-1">
            {listing.kleintiere_art && (
                <span className="text-sm mr-3">
                    <span className="text-black font-semibold">Tür: </span>
                    <span className="text-gray-600">{listing.kleintiere_art}</span>
                </span>
            )}
        </div>
    );

    return (
        <GenericCategoryPage
            category="Evcil Hayvanlar"
            subCategory="Küçük Hayvanlar"
            pageTitle="Küçük Hayvanlar"
            filterConfig={filterConfig}
            bannerConfig={bannerConfig}
            renderCustomFields={renderCustomFields}
            toggleFavorite={toggleFavorite}
            isFavorite={isFavorite}
        />
    );
};

export default KleintierePage;
