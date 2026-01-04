import React from 'react';
import GenericCategoryPage from './components/GenericCategoryPage';
import { getTurkishCities } from './translations';

const TierzubehoerPage = ({ toggleFavorite, isFavorite }) => {
    const filterConfig = {
        art: {
            label: 'Tür',
            type: 'multiselect',
            options: [
                { value: 'Balıklar', label: 'Balıklar' },
                { value: 'Köpekler', label: 'Köpekler' },
                { value: 'Kediler', label: 'Kediler' },
                { value: 'Küçük Hayvanlar', label: 'Küçük Hayvanlar' },
                { value: 'Atlar', label: 'Atlar' },
                { value: 'Sürüngenler', label: 'Sürüngenler' },
                { value: 'Kuşlar', label: 'Kuşlar' },
                { value: 'Diğer Aksesuarlar', label: 'Diğer Aksesuarlar' }
            ],
            field: 'haustier_zubehoer_art'
        },
        versand: {
            label: 'Gönderim',
            type: 'multiselect',
            options: [
                { value: 'Versand möglich', label: 'Gönderim mümkün' },
                { value: 'Nur Abholung', label: 'Sadece elden teslim' }
            ],
            field: 'versand_art'
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
        icon: '🥣',
        bgColor: 'bg-gradient-to-r from-red-500 to-rose-600',
        description: 'Hayvan Aksesuarları'
    };

    const renderCustomFields = (listing) => (
        <div className="flex flex-wrap mt-1">
            {listing.haustier_zubehoer_art && (
                <span className="text-sm">
                    <span className="text-black font-semibold">Tür: </span>
                    <span className="text-gray-600">{listing.haustier_zubehoer_art}</span>
                </span>
            )}
        </div>
    );

    return (
        <GenericCategoryPage
            category="Evcil Hayvanlar"
            subCategory="Aksesuarlar"
            pageTitle="Aksesuarlar"
            filterConfig={filterConfig}
            bannerConfig={bannerConfig}
            renderCustomFields={renderCustomFields}
            toggleFavorite={toggleFavorite}
            isFavorite={isFavorite}
        />
    );
};

export default TierzubehoerPage;
