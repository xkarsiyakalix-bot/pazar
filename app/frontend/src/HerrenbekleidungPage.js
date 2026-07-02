import React from 'react';
import GenericCategoryPage from './components/GenericCategoryPage';
import { getTurkishCities } from './translations';

const HerrenbekleidungPage = ({ toggleFavorite, isFavorite }) => {
    const filterConfig = {
        art: {
            label: 'Tür',
            type: 'multiselect',
            options: [
                { value: 'Takımlar', label: 'Takımlar' },
                { value: 'Deniz Giyimi', label: 'Deniz Giyimi' },
                { value: 'Gömlekler', label: 'Gömlekler' },
                { value: 'Düğün Giyimi', label: 'Düğün Giyimi' },
                { value: 'Pantolonlar', label: 'Pantolonlar' },
                { value: 'Ceket & Palto', label: 'Ceket & Palto' },
                { value: 'Kot Pantolonlar', label: 'Kot Pantolonlar' },
                { value: 'Kostüm & Kıyafet', label: 'Kostüm & Kıyafet' },
                { value: 'Kazaklar', label: 'Kazaklar' },
                { value: 'Tişörtler', label: 'Tişörtler' },
                { value: 'Şortlar', label: 'Şortlar' },
                { value: 'Spor Giyim', label: 'Spor Giyim' },
                { value: 'Diğer Erkek Giyimi', label: 'Diğer Erkek Giyimi' }
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
            field: 'herrenbekleidung_color'
        },
        versand: {
            label: 'Kargo',
            type: 'multiselect',
            options: [
                { value: 'Kargo Mümkün', label: 'Kargo Mümkün' },
                { value: 'Sadece Elden Teslim', label: 'Sadece Elden Teslim' }
            ],
            field: 'versand_art'
        },
        price: {
            label: 'Fiyat',
            type: 'range',
            field: 'price'
        },
        offer_type: {
            label: 'İlan Tipi',
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
        zustand: {
            label: 'Durum',
            type: 'multiselect',
            options: [
                { value: 'Yeni', label: 'Yeni' },
                { value: 'Yeni & Etiketli', label: 'Yeni & Etiketli' },
                { value: 'Çok İyi', label: 'Çok İyi' },
                { value: 'İyi', label: 'İyi' },
                { value: 'Makul', label: 'Makul' },
                { value: 'İkinci El', label: 'İkinci El' },
                { value: 'Kusurlu', label: 'Kusurlu' }
            ],
            field: 'condition'
        },
        federal_state: {
            label: 'Konum',
            type: 'multiselect',
            options: [], dynamic: true,
            field: 'federal_state'
        }
    };

    const bannerConfig = {
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
