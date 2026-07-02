import React from 'react';
import GenericCategoryPage from './components/GenericCategoryPage';
import { getTurkishCities } from './translations';

const FischePage = ({ toggleFavorite, isFavorite }) => {
    const filterConfig = {
        art: {
            label: 'Tür',
            type: 'multiselect',
            options: [
                { value: 'Akvaryum Balıkları', label: 'Akvaryum Balıkları' },
                { value: 'Tatlı Su Balıkları', label: 'Tatlı Su Balıkları' },
                { value: 'Discus Balıkları', label: 'Discus Balıkları' },
                { value: 'Karides & Yengeç', label: 'Karides & Yengeç' },
                { value: 'Koi', label: 'Koi' },
                { value: 'Salyangoz', label: 'Salyangoz' },
                { value: 'Su Bitkileri', label: 'Su Bitkileri' },
                { value: 'Vatozlar', label: 'Vatozlar' },
                { value: 'Diğer Balıklar', label: 'Diğer Balıklar' }
            ],
            field: 'fische_art'
        },
        price: {
            label: 'Fiyat',
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
            options: [], dynamic: true.map(city => ({ value: city, label: city })),
            field: 'federal_state'
        }
    };

    const bannerConfig = {
        bgColor: 'bg-gradient-to-r from-red-500 to-rose-600',
        description: 'Balıklar & Akvaryum'
    };

    const renderCustomFields = (listing) => (
        <div className="flex flex-wrap mt-1">
            {listing.fische_art && (
                <span className="text-sm mr-3">
                    <span className="text-black font-semibold">Tür: </span>
                    <span className="text-gray-600">{listing.fische_art}</span>
                </span>
            )}
        </div>
    );

    return (
        <GenericCategoryPage
            category="Evcil Hayvanlar"
            subCategory="Balıklar"
            pageTitle="Balıklar"
            filterConfig={filterConfig}
            bannerConfig={bannerConfig}
            renderCustomFields={renderCustomFields}
            toggleFavorite={toggleFavorite}
            isFavorite={isFavorite}
        />
    );
};

export default FischePage;
