import React from 'react';
import GenericCategoryPage from './components/GenericCategoryPage';
import { getTurkishCities } from './translations';

const KatzenPage = ({ toggleFavorite, isFavorite }) => {
    const filterConfig = {
        art: {
            label: 'Tür',
            type: 'multiselect',
            options: [
                { value: 'British Shorthair', label: 'British Shorthair' },
                { value: 'Ev Kedisi', label: 'Ev Kedisi' },
                { value: 'Maine Coon', label: 'Maine Coon' },
                { value: 'Siyam', label: 'Siyam' },
                { value: 'Diğer Kediler', label: 'Diğer Kediler' }
            ],
            field: 'katzen_art'
        },
        alter: {
            label: 'Yaş',
            type: 'multiselect',
            options: [
                { value: '12 aydan küçük', label: '12 aydan küçük' },
                { value: '12 aylık veya daha büyük', label: '12 aylık veya daha büyük' }
            ],
            field: 'katzen_alter'
        },
        geimpft: {
            label: 'Aşılı ve çipli',
            type: 'multiselect',
            options: [
                { value: 'Evet', label: 'Evet' },
                { value: 'Hayır', label: 'Hayır' }
            ],
            field: 'katzen_geimpft'
        },
        erlaubnis: {
            label: 'Resmi izin',
            type: 'multiselect',
            options: [
                { value: 'Evet', label: 'Evet' },
                { value: 'Hayır', label: 'Hayır' }
            ],
            field: 'katzen_erlaubnis'
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
        icon: '🐈',
        bgColor: 'bg-gradient-to-r from-red-500 to-rose-600',
        description: 'Kediler & Yavru Kediler'
    };

    const renderCustomFields = (listing) => (
        <div className="flex flex-wrap mt-1">
            {listing.katzen_art && (
                <span className="text-sm mr-3">
                    <span className="text-black font-semibold">Tür: </span>
                    <span className="text-gray-600">{listing.katzen_art}</span>
                </span>
            )}
            {listing.katzen_alter && (
                <span className="text-sm mr-3">
                    <span className="text-black font-semibold">Yaş: </span>
                    <span className="text-gray-600">{listing.katzen_alter}</span>
                </span>
            )}
            {listing.katzen_geimpft && (
                <span className="text-black text-sm font-semibold mr-3">
                    {listing.katzen_geimpft === 'Evet' ? 'Aşılı/Çipli' : 'Aşısız'}
                </span>
            )}
            {listing.katzen_erlaubnis && (
                <span className="text-black text-sm font-semibold">
                    {listing.katzen_erlaubnis === 'Evet' ? 'Resmi İzinli' : 'İzinsiz'}
                </span>
            )}
        </div>
    );

    return (
        <GenericCategoryPage
            category="Evcil Hayvanlar"
            subCategory="Kediler"
            pageTitle="Kediler"
            filterConfig={filterConfig}
            bannerConfig={bannerConfig}
            renderCustomFields={renderCustomFields}
            toggleFavorite={toggleFavorite}
            isFavorite={isFavorite}
        />
    );
};

export default KatzenPage;
