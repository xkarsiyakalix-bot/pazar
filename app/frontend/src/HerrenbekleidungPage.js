import React from 'react';
import GenericCategoryPage from './components/GenericCategoryPage';
import { getTurkishCities } from './translations';

const HerrenbekleidungPage = ({ toggleFavorite, isFavorite }) => {
    const filterConfig = {
        art: {
            label: 'Tür',
            type: 'multiselect',
            options: [
                { value: 'Anzüge', label: 'Takımlar' },
                { value: 'Bademode', label: 'Deniz Giyimi' },
                { value: 'Hemden', label: 'Gömlekler' },
                { value: 'Hochzeitsmode', label: 'Düğün Giyimi' },
                { value: 'Hosen', label: 'Pantolonlar' },
                { value: 'Jacken & Mäntel', label: 'Ceket & Palto' },
                { value: 'Jeans', label: 'Kot Pantolonlar' },
                { value: 'Kostüme & Verkleidungen', label: 'Kostüm & Kıyafet' },
                { value: 'Pullover', label: 'Kazaklar' },
                { value: 'Shirts', label: 'Tişörtler' },
                { value: 'Shorts', label: 'Şortlar' },
                { value: 'Sportbekleidung', label: 'Spor Giyim' },
                { value: 'Weitere Herrenbekleidung', label: 'Diğer Erkek Giyimi' }
            ],
            field: 'herrenbekleidung_art'
        },
        marke: {
            label: 'Marke',
            type: 'multiselect',
            options: [
                'Sonstige', 'Adidas', 'Nike', 'Tommy Hilfiger', 'Jack & Jones',
                'H&M', 'Ralph Lauren', 'S.Oliver', 'Tom Tailor', 'Zara',
                'Puma', 'Camp David', 'Wellensteyn', 'Levi\'s', 'Hugo Boss',
                'Esprit', 'C&A', 'Engelbert Strauss', 'Lacoste', 'G-Star'
            ],
            field: 'herrenbekleidung_marke'
        },
        groesse: {
            label: 'Beden',
            type: 'multiselect',
            options: [
                'Einheitsgröße', 'XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL',
                'XXXL', '4XL', '5XL', '6XL', '7XL', '8XL & mehr'
            ],
            field: 'herrenbekleidung_size'
        },
        color: {
            label: 'Renk',
            type: 'multiselect',
            options: [
                { value: 'Beige', label: 'Bej' },
                { value: 'Blau', label: 'Mavi' },
                { value: 'Braun', label: 'Kahverengi' },
                { value: 'Bunt', label: 'Renkli' },
                { value: 'Creme', label: 'Krem' },
                { value: 'Gelb', label: 'Sarı' },
                { value: 'Gold', label: 'Altın' },
                { value: 'Grau', label: 'Gri' },
                { value: 'Grün', label: 'Yeşil' },
                { value: 'Khaki', label: 'Haki' },
                { value: 'Lavendel', label: 'Lavanta' },
                { value: 'Lila', label: 'Mor' },
                { value: 'Orange', label: 'Turuncu' },
                { value: 'Pink', label: 'Pembe' },
                { value: 'Print', label: 'Desenli' },
                { value: 'Rot', label: 'Kırmızı' },
                { value: 'Schwarz', label: 'Siyah' },
                { value: 'Silber', label: 'Gümüş' },
                { value: 'Türkis', label: 'Turkuaz' },
                { value: 'Weiß', label: 'Beyaz' },
                { value: 'Andere Farben', label: 'Diğer Renkler' }
            ],
            field: 'herrenbekleidung_color'
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
                { value: 'Privatnutzer', label: 'Bireysel' },
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
        icon: '👔',
        bgColor: 'bg-gradient-to-r from-red-500 to-rose-600',
        description: 'Erkek Giyimi İlanlarını Keşfedin'
    };

    return (
        <GenericCategoryPage
            category="Moda & Güzellik"
            subCategory="Erkek Giyimi"
            pageTitle="Erkek Giyimi"
            filterConfig={filterConfig}
            bannerConfig={bannerConfig}
            toggleFavorite={toggleFavorite}
            isFavorite={isFavorite}
            renderCustomFields={(listing) => (
                <div className="flex flex-wrap mt-1">
                    {listing.herrenbekleidung_art && (
                        <span className="text-sm mr-3">
                            <span className="text-black font-semibold">Tür: </span>
                            <span className="text-gray-600">{listing.herrenbekleidung_art}</span>
                        </span>
                    )}
                    {listing.herrenbekleidung_marke && (
                        <span className="text-sm mr-3">
                            <span className="text-black font-semibold">Marka: </span>
                            <span className="text-gray-600">{listing.herrenbekleidung_marke}</span>
                        </span>
                    )}
                    {listing.herrenbekleidung_size && (
                        <span className="text-sm mr-3">
                            <span className="text-black font-semibold">Beden: </span>
                            <span className="text-gray-600">{listing.herrenbekleidung_size}</span>
                        </span>
                    )}
                    {listing.herrenbekleidung_color && (
                        <span className="text-sm">
                            <span className="text-black font-semibold">Renk: </span>
                            <span className="text-gray-600">{listing.herrenbekleidung_color}</span>
                        </span>
                    )}
                </div>
            )}
        />
    );
};

export default HerrenbekleidungPage;
