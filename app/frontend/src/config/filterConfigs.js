import { t, getTurkishCities } from '../translations';

export const getCommonFilters = () => ({
    price: {
        label: t.filters?.price || 'Fiyat',
        type: 'range',
        field: 'price'
    },
    offerType: {
        label: t.filters?.offerType || 'İlan Tipi',
        type: 'multiselect',
        options: [
            { value: 'Angebote', label: t.addListing?.offering || 'Satılık' },
            { value: 'Gesuche', label: t.addListing?.searching || 'Aranıyor' }
        ],
        field: 'offer_type'
    },
    providerType: {
        label: t.filters?.sellerType || 'Satıcı',
        type: 'multiselect',
        options: [
            { value: 'Privatnutzer', label: t.addListing?.private || 'Bireysel' },
            { value: 'Gewerblicher Nutzer', label: t.addListing?.commercial || 'Kurumsal' }
        ],
        field: 'seller_type'
    },
    federalState: {
        label: t.filters?.location || 'Konum',
        type: 'multiselect',
        options: getTurkishCities().map(city => ({ label: city, value: city })),
        field: 'federal_state'
    }
});

export const getConditionFilter = () => ({
    zustand: {
        label: t.addListing?.condition || 'Durum',
        type: 'multiselect',
        options: [
            { value: 'neu', label: t.addListing?.options?.new || 'Yeni' },
            { value: 'neu_mit_etikett', label: t.addListing?.options?.newWithTags || 'Yeni & Etiketli' },
            { value: 'sehr_gut', label: t.addListing?.options?.veryGood || 'Çok İyi' },
            { value: 'gut', label: t.addListing?.options?.good || 'İyi' },
            { value: 'in_ordnung', label: t.addListing?.options?.okay || 'Makul' },
            { value: 'used', label: t.addListing?.options?.used || 'İkinci El' },
            { value: 'defekt', label: t.addListing?.options?.defective || 'Kusurlu' }
        ],
        field: 'condition'
    }
});

export const getShippingFilter = () => ({
    versand: {
        label: t.addListing?.shipping || 'Kargo',
        type: 'multiselect',
        options: [
            { value: 'Versand möglich', label: t.addListing?.options?.shipping || 'Kargo Mümkün' },
            { value: 'Nur Abholung', label: t.addListing?.options?.noShipping || 'Sadece Elden Teslim' }
        ],
        field: 'versand_art'
    }
});
