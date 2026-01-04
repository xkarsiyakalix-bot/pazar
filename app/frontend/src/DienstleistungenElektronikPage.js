import React from 'react';
import GenericCategoryPage from './components/GenericCategoryPage';
import { getTurkishCities } from './translations';

const DienstleistungenElektronikPage = ({ toggleFavorite, isFavorite }) => {
    const filterConfig = {
        art: {
            label: 'Tür',
            type: 'multiselect',
            options: [
                { value: 'Reparaturen', label: 'Onarım' },
                { value: 'Installationen', label: 'Kurulum' },
                { value: 'Weitere Dienstleistungen', label: 'Diğer Hizmetler' }
            ],
            field: 'dienstleistungen_elektronik_art'
        },
        price: {
            label: 'Fiyat',
            type: 'range',
            field: 'price'
        },
        offerType: {
            label: 'İlan Türü',
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
                { value: 'Gewerblicher Nutzer', label: 'Kurumsal' }
            ],
            field: 'seller_type'
        },
        federalState: {
            label: 'Şehir',
            type: 'multiselect',
            options: getTurkishCities(),
            field: 'federal_state'
        }
    };

    const bannerConfig = {
        icon: '🛠️',
        bgColor: 'bg-gradient-to-r from-red-500 to-rose-600',
        description: 'Elektronik'
    };

    return (
        <GenericCategoryPage
            category="Hizmetler"
            subCategory="Elektronik"
            pageTitle="Elektronik"
            filterConfig={filterConfig}
            bannerConfig={bannerConfig}
            toggleFavorite={toggleFavorite}
            isFavorite={isFavorite}
        />
    );
};

export default DienstleistungenElektronikPage;
