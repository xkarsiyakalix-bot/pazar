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
                { value: 'Yeni', label: 'Yeni' },
                { value: 'Çok İyi', label: 'Çok İyi' },
                { value: 'İyi', label: 'İyi' },
                { value: 'İdare Eder', label: 'İdare Eder' },
                { value: 'Arızalı', label: 'Arızalı' }
            ],
            field: 'condition'
        },
        price: {
            label: 'Fiyat',
            type: 'range',
            field: 'price'
        },
        offer_type: {
            label: 'İlan Türü',
            type: 'multiselect',
            options: [
                { value: 'Satılık', label: 'Satılık' },
                { value: 'Aranıyor', label: 'Aranıyor' }
            ],
            field: 'offer_type'
        },
        providerType: {
            label: 'Satıcı',
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
