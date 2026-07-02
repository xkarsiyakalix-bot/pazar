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
                { value: 'Scottish Fold', label: 'Scottish Fold' },
                { value: 'British Longhair', label: 'British Longhair' },
                { value: 'Maine Coon', label: 'Maine Coon' },
                { value: 'İran Kedisi', label: 'İran Kedisi' },
                { value: 'Ragdoll Kedisi', label: 'Ragdoll Kedisi' },
                { value: 'Scottish Fold Longhair', label: 'Scottish Fold Longhair' },
                { value: 'Sfenks Kedisi', label: 'Sfenks Kedisi' },
                { value: 'Munchkin Kedisi', label: 'Munchkin Kedisi' },
                { value: 'Bengal Kedisi', label: 'Bengal Kedisi' },
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
