import React from 'react';
import GenericCategoryPage from './components/GenericCategoryPage';
import { getTurkishCities } from './translations';

const HundePage = ({ toggleFavorite, isFavorite }) => {
    const filterConfig = {
        art: {
            label: 'Tür',
            type: 'multiselect',
            options: [
                { value: 'Karışık', label: 'Karışık' },
                { value: 'Beagle', label: 'Beagle' },
                { value: 'Bernhardiner', label: 'Bernhardiner' },
                { value: 'Border Collie', label: 'Border Collie' },
                { value: 'Cocker Spaniel', label: 'Cocker Spaniel' },
                { value: 'Collie', label: 'Collie' },
                { value: 'Dackel', label: 'Dackel' },
                { value: 'Dalmaçyalı', label: 'Dalmaçyalı' },
                { value: 'Dobermann', label: 'Dobermann' },
                { value: 'Dogge', label: 'Dogge' },
                { value: 'Golden Retriever', label: 'Golden Retriever' },
                { value: 'Husky', label: 'Husky' },
                { value: 'Jack Russell Terrier', label: 'Jack Russell Terrier' },
                { value: 'Labrador', label: 'Labrador' },
                { value: 'Maltiz', label: 'Maltiz' },
                { value: 'Kaniş', label: 'Kaniş' },
                { value: 'Çoban Köpeği', label: 'Çoban Köpeği' },
                { value: 'Spitz', label: 'Spitz' },
                { value: 'Terrier', label: 'Terrier' },
                { value: 'Diğer Köpekler', label: 'Diğer Köpekler' }
            ],
            field: 'hunde_art'
        },
        alter: {
            label: 'Yaş',
            type: 'multiselect',
            options: [
                { value: '12 aydan küçük', label: '12 aydan küçük' },
                { value: '12 aylık veya daha büyük', label: '12 aylık veya daha büyük' }
            ],
            field: 'hunde_alter'
        },
        geimpft: {
            label: 'Aşılı ve çipli',
            type: 'multiselect',
            options: [
                { value: 'Evet', label: 'Evet' },
                { value: 'Hayır', label: 'Hayır' }
            ],
            field: 'hunde_geimpft'
        },
        erlaubnis: {
            label: 'Resmi izin',
            type: 'multiselect',
            options: [
                { value: 'Evet', label: 'Evet' },
                { value: 'Hayır', label: 'Hayır' }
            ],
            field: 'hunde_erlaubnis'
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
        icon: '🐕',
        bgColor: 'bg-gradient-to-r from-red-500 to-rose-600',
        description: 'Köpekler & Yavru Köpekler'
    };

    const renderCustomFields = (listing) => (
        <div className="flex flex-wrap mt-1">
            {listing.hunde_art && (
                <span className="text-sm mr-3">
                    <span className="text-black font-semibold">Tür: </span>
                    <span className="text-gray-600">{listing.hunde_art}</span>
                </span>
            )}
            {listing.hunde_alter && (
                <span className="text-sm mr-3">
                    <span className="text-black font-semibold">Yaş: </span>
                    <span className="text-gray-600">{listing.hunde_alter}</span>
                </span>
            )}
            {listing.hunde_geimpft && (
                <span className="text-black text-sm font-semibold mr-3">
                    {listing.hunde_geimpft === 'Evet' ? 'Aşılı/Çipli' : 'Aşısız'}
                </span>
            )}
            {listing.hunde_erlaubnis && (
                <span className="text-black text-sm font-semibold">
                    {listing.hunde_erlaubnis === 'Evet' ? 'Resmi İzinli' : 'İzinsiz'}
                </span>
            )}
        </div>
    );

    return (
        <GenericCategoryPage
            category="Evcil Hayvanlar"
            subCategory="Köpekler"
            pageTitle="Köpekler"
            filterConfig={filterConfig}
            bannerConfig={bannerConfig}
            renderCustomFields={renderCustomFields}
            toggleFavorite={toggleFavorite}
            isFavorite={isFavorite}
        />
    );
};

export default HundePage;
