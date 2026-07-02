import React from 'react';
import GenericCategoryPage from './components/GenericCategoryPage';
import { getTurkishCities } from './translations';

const UnterrichtEsoterikPage = ({ toggleFavorite, isFavorite }) => {
    const filterConfig = {
        price: {
            label: 'Preis',
            type: 'range',
            field: 'price'
        },
        offer_type: {
            label: 'Angebotstyp',
            type: 'radio',
            options: [
                { value: 'Angebote', label: 'Angebote' },
                { value: 'Gesuche', label: 'Gesuche' }
            ],
            field: 'offer_type'
        },
        providerType: {
            label: 'Anbieter',
            type: 'radio',
            options: [
                { value: 'Privat', label: 'Privat' },
                { value: 'Gewerblich', label: 'Gewerblich' }
            ],
            field: 'seller_type'
        },
        federal_state: {
            label: 'Ort',
            type: 'radio',
            options: [], dynamic: true,
            field: 'federal_state'
        }
    };

    const bannerConfig = {
        bgColor: 'bg-gradient-to-r from-red-500 to-rose-600',
        description: 'Esoterik & Spirituelles Kurse'
    };

    return (
        <GenericCategoryPage
            category="Unterricht & Kurse"
            subCategory="Esoterik & Spirituelles"
            pageTitle="Esoterik & Spirituelles"
            filterConfig={filterConfig}
            bannerConfig={bannerConfig}
            toggleFavorite={toggleFavorite}
            isFavorite={isFavorite}
        />
    );
};

export default UnterrichtEsoterikPage;
