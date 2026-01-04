import React from 'react';
import GenericCategoryPage from './components/GenericCategoryPage';
import { getTurkishCities } from './translations';

const SpielzeugPage = ({ toggleFavorite, isFavorite }) => {
    const filterConfig = {
        art: {
            label: 'Tür',
            type: 'multiselect',
            options: [
                { value: 'Aksiyon & Oyun Figürleri', label: 'Aksiyon & Oyun Figürleri' },
                { value: 'Bebek Oyuncakları', label: 'Bebek Oyuncakları' },
                { value: 'Barbie & Arkadaşları', label: 'Barbie & Arkadaşları' },
                { value: 'Bisiklet & Araçlar', label: 'Bisiklet & Araçlar' },
                { value: 'Masa Oyunları', label: 'Masa Oyunları' },
                { value: 'Ahşap Oyuncaklar', label: 'Ahşap Oyuncaklar' },
                { value: 'LEGO & Duplo', label: 'LEGO & Duplo' },
                { value: 'Eğitici Oyuncaklar', label: 'Eğitici Oyuncaklar' },
                { value: 'Playmobil', label: 'Playmobil' },
                { value: 'Bebekler', label: 'Bebekler' },
                { value: 'Oyuncak Arabalar', label: 'Oyuncak Arabalar' },
                { value: 'Dış Mekan Oyuncakları', label: 'Dış Mekan Oyuncakları' },
                { value: 'Peluş Oyuncaklar', label: 'Peluş Oyuncaklar' },
                { value: 'Diğer Oyuncaklar', label: 'Diğer Oyuncaklar' }
            ],
            field: 'spielzeug_art'
        },
        versand: {
            label: 'Kargo',
            type: 'multiselect',
            options: ['Kargo Mümkün', 'Sadece Elden Teslim'],
            field: 'versand_art'
        },
        zustand: {
            label: 'Durum',
            type: 'multiselect',
            options: [
                { value: 'neu', label: 'Yeni' },
                { value: 'sehr_gut', label: 'Çok İyi' },
                { value: 'gut', label: 'İyi' },
                { value: 'in_ordnung', label: 'İdare Eder' },
                { value: 'defekt', label: 'Arızalı' }
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
        icon: '🎲',
        bgColor: 'bg-gradient-to-r from-red-500 to-rose-600',
        description: 'Oyuncaklar'
    };

    return (
        <GenericCategoryPage
            category="Aile, Çocuk & Bebek"
            subCategory="Oyuncaklar"
            pageTitle="Oyuncaklar"
            filterConfig={filterConfig}
            bannerConfig={bannerConfig}
            toggleFavorite={toggleFavorite}
            isFavorite={isFavorite}
        />
    );
};

export default SpielzeugPage;
