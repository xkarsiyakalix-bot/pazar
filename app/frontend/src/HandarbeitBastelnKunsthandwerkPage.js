import React from 'react';
import GenericCategoryPage from './components/GenericCategoryPage';
import { getTurkishCities } from './translations';

const HandarbeitBastelnKunsthandwerkPage = ({ toggleFavorite, isFavorite }) => {
    const filterConfig = {
        versand: {
            label: 'Teslimat',
            type: 'multiselect',
            options: [
                { value: 'Versand möglich', label: 'Kargo Mümkün' },
                { value: 'Nur Abholung', label: 'Sadece Elden Teslim' }
            ],
            field: 'versand_art'
        },
        art: {
            label: 'Tür',
            type: 'multiselect',
            options: [
                { value: 'Stoffe & Nähen', label: 'Kumaş & Dikiş' },
                { value: 'Stricken & Häkeln', label: 'Örgü & Tığ İşi' },
                { value: 'Resim & Çizim', label: 'Resim & Çizim' },
                { value: 'Perlen & Schmuck', label: 'Boncuk & Takı' },
                { value: 'Basteln', label: 'El İşi' },
                { value: 'Werkzeug', label: 'Aletler' },
                { value: 'Sonstiges', label: 'Diğer' }
            ],
            field: 'handarbeit_art'
        },
        zustand: {
            label: 'Durum',
            type: 'multiselect',
            options: [
                { value: 'neu', label: 'Yeni' },
                { value: 'sehr_gut', label: 'Çok İyi' },
                { value: 'gut', label: 'İyi' },
                { value: 'in_ordnung', label: 'Makul' },
                { value: 'defekt', label: 'Defolu' }
            ],
            field: 'condition'
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
        icon: '🧶',
        bgColor: 'bg-gradient-to-r from-red-500 to-rose-600',
        description: 'El Sanatları & Hobi'
    };

    return (
        <GenericCategoryPage
            category="Eğlence, Hobi & Mahalle"
            subCategory="El Sanatları & Hobi"
            pageTitle="El Sanatları & Hobi"
            filterConfig={filterConfig}
            bannerConfig={bannerConfig}
            toggleFavorite={toggleFavorite}
            isFavorite={isFavorite}
        />
    );
};

export default HandarbeitBastelnKunsthandwerkPage;
