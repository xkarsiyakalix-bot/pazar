import React from 'react';
import GenericCategoryPage from './components/GenericCategoryPage';
import { getTurkishCities } from './translations';

const SammelnPage = ({ toggleFavorite, isFavorite }) => {
    const filterConfig = {
        art: {
            label: 'Tür',
            type: 'multiselect',
            options: [
                { value: 'Kartpostallar', label: 'Kartpostallar' },
                { value: 'İmzalar', label: 'İmzalar' },
                { value: 'Bira Bardakları', label: 'Bira Bardakları' },
                { value: 'Posta Pulu', label: 'Posta Pulu' },
                { value: 'Çizgi Romanlar', label: 'Çizgi Romanlar' },
                { value: 'Bayraklar', label: 'Bayraklar' },
                { value: 'Madeni Paralar', label: 'Madeni Paralar' },
                { value: 'Porselen', label: 'Porselen' },
                { value: 'Bebekler & Aksesuarlar', label: 'Bebekler & Aksesuarlar' },
                { value: 'Çıkartmalar & Etiketler', label: 'Çıkartmalar & Etiketler' },
                { value: 'Koleksiyon Kart Oyunları', label: 'Koleksiyon Kart Oyunları' },
                { value: 'Sürpriz Yumurtalar', label: 'Sürpriz Yumurtalar' },
                { value: 'Promosyon Ürünleri', label: 'Promosyon Ürünleri' },
                { value: 'Diğer Koleksiyonlar', label: 'Diğer Koleksiyonlar' }
            ],
            field: 'sammeln_art'
        },
        versand: {
            label: 'Teslimat',
            type: 'multiselect',
            options: [
                { value: 'Versand möglich', label: 'Kargo Mümkün' },
                { value: 'Nur Abholung', label: 'Sadece Elden Teslim' }
            ],
            field: 'versand_art'
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
        icon: '🪙',
        bgColor: 'bg-gradient-to-r from-red-500 to-rose-600',
        description: 'Koleksiyon'
    };

    return (
        <GenericCategoryPage
            category="Eğlence, Hobi & Mahalle"
            subCategory="Koleksiyon"
            pageTitle="Koleksiyon"
            filterConfig={filterConfig}
            bannerConfig={bannerConfig}
            toggleFavorite={toggleFavorite}
            isFavorite={isFavorite}
            layoutVariant="compact"
        />
    );
};

export default SammelnPage;
