import React from 'react';
import GenericCategoryPage from './components/GenericCategoryPage';
import { getTurkishCities } from './translations';
import { t } from './translations';

const ModeBeautyPage = ({ toggleFavorite, isFavorite }) => {
    const subCategories = [
        { name: 'Tümü', route: '/Moda-Guzellik' },
        { name: 'Güzellik & Sağlık', route: '/Moda-Guzellik/Guzellik-Saglik' },
        { name: 'Kadın Giyimi', route: '/Moda-Guzellik/Kadin-Giyimi' },
        { name: 'Kadın Ayakkabıları', route: '/Moda-Guzellik/Kadin-Ayakkabilari' },
        { name: 'Erkek Giyimi', route: '/Moda-Guzellik/Erkek-Giyimi' },
        { name: 'Erkek Ayakkabıları', route: '/Moda-Guzellik/Erkek-Ayakkabilari' },
        { name: 'Çanta & Aksesuarlar', route: '/Moda-Guzellik/Canta-Aksesuarlar' },
        { name: 'Saat & Takı', route: '/Moda-Guzellik/Saat-Taki' },
        { name: 'Diğer Moda & Güzellik', route: '/Moda-Guzellik/Diger-Moda-Guzellik' }
    ];

    const filterConfig = {
        versand: {
            label: t.addListing.shipping,
            type: 'multiselect',
            options: [
                { value: 'Versand möglich', label: t.addListing.options.shipping },
                { value: 'Nur Abholung', label: t.addListing.options.noShipping }
            ],
            field: 'versand_art'
        },
        price: {
            label: t.common.price,
            type: 'range',
            field: 'price'
        },
        offerType: {
            label: t.addListing.offerType,
            type: 'multiselect',
            options: [
                { value: 'Angebote', label: t.addListing.offering },
                { value: 'Gesuche', label: t.addListing.searching }
            ],
            field: 'offer_type'
        },
        providerType: {
            label: t.addListing.accountType,
            type: 'multiselect',
            options: [
                { value: 'Privatnutzer', label: t.addListing.private },
                { value: 'Gewerblicher Nutzer', label: t.addListing.commercial }
            ],
            field: 'seller_type'
        },
        zustand: {
            label: t.addListing.condition,
            type: 'multiselect',
            options: [
                { value: 'neu', label: t.addListing.options.new },
                { value: 'neu_mit_etikett', label: t.addListing.options.newWithTags },
                { value: 'sehr_gut', label: t.addListing.options.veryGood },
                { value: 'gut', label: t.addListing.options.good },
                { value: 'in_ordnung', label: t.addListing.options.okay },
                { value: 'used', label: t.addListing.options.used },
                { value: 'defekt', label: t.addListing.options.defective }
            ],
            field: 'condition'
        },
        federalState: {
            label: t.addListing.location,
            type: 'multiselect',
            options: getTurkishCities().map(city => ({ value: city, label: city })),
            field: 'federal_state'
        }
    };

    const bannerConfig = {
        icon: '👗',
        bgColor: 'bg-gradient-to-r from-red-500 to-rose-600',
        description: 'Moda & Güzellik'
    };

    return (
        <GenericCategoryPage
            category="Moda & Güzellik"
            pageTitle="Moda & Güzellik"
            subCategories={subCategories}
            filterConfig={filterConfig}
            bannerConfig={bannerConfig}
            toggleFavorite={toggleFavorite}
            isFavorite={isFavorite}
        />
    );
};

export default ModeBeautyPage;
