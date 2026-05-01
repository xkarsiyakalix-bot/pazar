import React from 'react';
import GenericCategoryPage from './components/GenericCategoryPage';
import { getTurkishCities } from './translations';

const VoegelPage = ({ toggleFavorite, isFavorite }) => {
    const filterConfig = {
        art: {
            label: 'Tür',
            type: 'multiselect',
            options: [
                { value: 'Muhabbet Kuşları', label: 'Muhabbet Kuşları' },
                { value: 'Papağanlar', label: 'Papağanlar' },
                { value: 'Kanaryalar', label: 'Kanaryalar' },
                { value: 'Egzotik Kuşlar', label: 'Egzotik Kuşlar' },
                { value: 'Diğer Kuşlar', label: 'Diğer Kuşlar' }
            ],
            field: 'voegel_art'
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
        description: 'Kuşlar & Aksesuarlar'
    };

    const renderCustomFields = (listing) => (
        <div className="flex flex-wrap mt-1">
            {listing.voegel_art && (
                <span className="text-sm">
                    <span className="text-black font-semibold">Tür: </span>
                    <span className="text-gray-600">{listing.voegel_art}</span>
                </span>
            )}
        </div>
    );

    return (
        <GenericCategoryPage
            category="Evcil Hayvanlar"
            subCategory="Kuşlar"
            pageTitle="Kuşlar"
            filterConfig={filterConfig}
            bannerConfig={bannerConfig}
            renderCustomFields={renderCustomFields}
            toggleFavorite={toggleFavorite}
            isFavorite={isFavorite}
        />
    );
};

export default VoegelPage;
