import React from 'react';
import { useLocation } from 'react-router-dom';
import GenericCategoryPage from './components/GenericCategoryPage';
import { getTurkishCities } from './translations';

const DienstleistungenHausGartenPage = ({ toggleFavorite, isFavorite }) => {
    const { pathname } = useLocation();

    // Determine category and subcategory based on path
    const isServiceContext = pathname.startsWith('/Hizmetler');
    const category = isServiceContext ? "Hizmetler" : "Ev & Bahçe";
    const subCategory = isServiceContext ? "Ev & Bahçe" : "Ev Hizmetleri";
    const pageTitle = isServiceContext ? "Ev & Bahçe" : "Ev Hizmetleri";

    const filterConfig = {
        art: {
            label: 'Tür',
            type: 'multiselect',
            options: [
                { value: 'Bau & Handwerk', label: 'İnşaat & El Sanatları' },
                { value: 'Garten- & Landschaftsbau', label: 'Bahçe & Peyzaj' },
                { value: 'Haushaltshilfe', label: 'Ev Yardımcısı' },
                { value: 'Reinigungsservice', label: 'Temizlik Hizmeti' },
                { value: 'Reparaturen', label: 'Onarım & Tamir' },
                { value: 'Wohnungsauflösungen', label: 'Ev Boşaltma/Tasfiye' },
                { value: 'Weitere Dienstleistungen Haus & Garten', label: 'Diğer Ev & Bahçe Hizmetleri' }
            ],
            field: 'dienstleistungen_haus_garten_art'
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
        description: pageTitle
    };

    return (
        <GenericCategoryPage
            category={category}
            subCategory={subCategory}
            pageTitle={pageTitle}
            filterConfig={filterConfig}
            bannerConfig={bannerConfig}
            toggleFavorite={toggleFavorite}
            isFavorite={isFavorite}
            showDescription={false}
        />
    );
};

export default DienstleistungenHausGartenPage;
