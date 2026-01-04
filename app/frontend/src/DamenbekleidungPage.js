import React from 'react';
import GenericCategoryPage from './components/GenericCategoryPage';
import { getTurkishCities } from './translations';

const DamenbekleidungPage = ({ toggleFavorite, isFavorite }) => {
    const filterConfig = {
        art: {
            label: 'Tür',
            type: 'multiselect',
            options: [
                { value: 'Takımlar', label: 'Takımlar' },
                { value: 'Deniz Giyimi', label: 'Deniz Giyimi' },
                { value: 'Gömlek & Bluz', label: 'Gömlek & Bluz' },
                { value: 'Gelinlik & Düğün', label: 'Gelinlik & Düğün' },
                { value: 'Pantolonlar', label: 'Pantolonlar' },
                { value: 'Ceket & Palto', label: 'Ceket & Palto' },
                { value: 'Kot Pantolonlar', label: 'Kot Pantolonlar' },
                { value: 'Kostüm & Kıyafet', label: 'Kostüm & Kıyafet' },
                { value: 'Kazaklar', label: 'Kazaklar' },
                { value: 'Etek & Elbiseler', label: 'Etek & Elbiseler' },
                { value: 'Tişört & Üst', label: 'Tişört & Üst' },
                { value: 'Şortlar', label: 'Şortlar' },
                { value: 'Spor Giyim', label: 'Spor Giyim' },
                { value: 'Hamile Giyim', label: 'Hamile Giyim' },
                { value: 'Diğer Kadın Giyimi', label: 'Diğer Kadın Giyimi' }
            ],
            field: 'damenbekleidung_art'
        },
        marke: {
            label: 'Marka',
            type: 'multiselect',
            options: [
                'Sonstige', 'H&M', 'Esprit', 'Zara', 'Only', 'S.Oliver',
                'Tommy Hilfiger', 'C&A', 'Shein', 'Adidas', 'Tom Tailor',
                'Street One', 'Wellensteyn', 'Cecil', 'Vero Moda',
                'Marc O´Polo', 'Mango', 'Nike', 'Naketano', 'Gerry Weber'
            ],
            field: 'damenbekleidung_marke'
        },
        groesse: {
            label: 'Beden',
            type: 'multiselect',
            options: [
                'Einheitsgröße', 'XXXS (30)', 'XXS (32)', 'XS (34)', 'S (36)',
                'M (38)', 'L (40)', 'XL (42)', 'XXL (44)', 'XXXL (46)',
                '4XL (48)', '5XL (50)', '6XL (52)', '7XL (54)', '8XL (56) & mehr'
            ],
            field: 'damenbekleidung_size'
        },
        color: {
            label: 'Renk',
            type: 'multiselect',
            options: [
                { value: 'Bej', label: 'Bej' },
                { value: 'Mavi', label: 'Mavi' },
                { value: 'Kahverengi', label: 'Kahverengi' },
                { value: 'Renkli', label: 'Renkli' },
                { value: 'Krem', label: 'Krem' },
                { value: 'Sarı', label: 'Sarı' },
                { value: 'Altın', label: 'Altın' },
                { value: 'Gri', label: 'Gri' },
                { value: 'Yeşil', label: 'Yeşil' },
                { value: 'Haki', label: 'Haki' },
                { value: 'Lavanta', label: 'Lavanta' },
                { value: 'Mor', label: 'Mor' },
                { value: 'Turuncu', label: 'Turuncu' },
                { value: 'Pembe', label: 'Pembe' },
                { value: 'Desenli', label: 'Desenli' },
                { value: 'Kırmızı', label: 'Kırmızı' },
                { value: 'Siyah', label: 'Siyah' },
                { value: 'Gümüş', label: 'Gümüş' },
                { value: 'Turkuaz', label: 'Turkuaz' },
                { value: 'Beyaz', label: 'Beyaz' },
                { value: 'Diğer Renkler', label: 'Diğer Renkler' }
            ],
            field: 'damenbekleidung_color'
        },
        versand: {
            label: 'Kargo',
            type: 'multiselect',
            options: [
                { value: 'Versand möglich', label: 'Kargo Mümkün' },
                { value: 'Nur Abholung', label: 'Sadece Elden Teslim' }
            ],
            field: 'versand_art'
        },
        price: {
            label: 'Fiyat',
            type: 'range',
            field: 'price'
        },
        offerType: {
            label: 'İlan Tipi',
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
                { value: 'Privat', label: 'Bireysel' },
                { value: 'Gewerblich', label: 'Kurumsal' }
            ],
            field: 'seller_type'
        },
        zustand: {
            label: 'Durum',
            type: 'multiselect',
            options: [
                { value: 'neu', label: 'Yeni' },
                { value: 'neu_mit_etikett', label: 'Yeni & Etiketli' },
                { value: 'sehr_gut', label: 'Çok İyi' },
                { value: 'gut', label: 'İyi' },
                { value: 'in_ordnung', label: 'Makul' },
                { value: 'used', label: 'İkinci El' },
                { value: 'defekt', label: 'Kusurlu' }
            ],
            field: 'condition'
        },
        federalState: {
            label: 'Konum',
            type: 'multiselect',
            options: getTurkishCities().map(city => ({ value: city, label: city })),
            field: 'federal_state'
        }
    };

    const bannerConfig = {
        icon: '👗',
        bgColor: 'bg-gradient-to-r from-red-500 to-rose-600',
        description: 'Kadın Giyimi İlanlarını Keşfedin'
    };

    return (
        <GenericCategoryPage
            category="Moda & Güzellik"
            subCategory="Kadın Giyimi"
            pageTitle="Kadın Giyimi"
            filterConfig={filterConfig}
            bannerConfig={bannerConfig}
            toggleFavorite={toggleFavorite}
            isFavorite={isFavorite}
            renderCustomFields={(listing) => (
                <div className="flex flex-wrap mt-1">
                    {listing.damenbekleidung_art && (
                        <span className="text-sm mr-3">
                            <span className="text-black font-semibold">Tür: </span>
                            <span className="text-gray-600">{listing.damenbekleidung_art}</span>
                        </span>
                    )}
                    {listing.damenbekleidung_marke && (
                        <span className="text-sm mr-3">
                            <span className="text-black font-semibold">Marka: </span>
                            <span className="text-gray-600">{listing.damenbekleidung_marke}</span>
                        </span>
                    )}
                    {listing.damenbekleidung_size && (
                        <span className="text-sm mr-3">
                            <span className="text-black font-semibold">Beden: </span>
                            <span className="text-gray-600">{listing.damenbekleidung_size}</span>
                        </span>
                    )}
                    {listing.damenbekleidung_color && (
                        <span className="text-sm">
                            <span className="text-black font-semibold">Renk: </span>
                            <span className="text-gray-600">{listing.damenbekleidung_color}</span>
                        </span>
                    )}
                </div>
            )}
        />
    );
};

export default DamenbekleidungPage;
