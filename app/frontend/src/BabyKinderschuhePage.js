import React from 'react';
import GenericCategoryPage from './components/GenericCategoryPage';
import { getTurkishCities } from './translations';

const BabyKinderschuhePage = ({ toggleFavorite, isFavorite }) => {
    const filterConfig = {
        art: {
            label: 'Tür',
            type: 'multiselect',
            options: [
                { value: 'Balerin', label: 'Balerin' },
                { value: 'Yarım & Bağcıklı Ayakkabı', label: 'Yarım & Bağcıklı Ayakkabı' },
                { value: 'Ev Ayakkabısı', label: 'Ev Ayakkabısı' },
                { value: 'Ev Terliği', label: 'Ev Terliği' },
                { value: 'Sandalet', label: 'Sandalet' },
                { value: 'Outdoor & Doğa Yürüyüşü Ayakkabısı', label: 'Outdoor & Doğa Yürüyüşü Ayakkabısı' },
                { value: 'Sneaker & Spor Ayakkabı', label: 'Sneaker & Spor Ayakkabı' },
                { value: 'Bot & Çizme', label: 'Bot & Çizme' },
                { value: 'Deniz Ayakkabısı', label: 'Deniz Ayakkabısı' },
                { value: 'Diğer Ayakkabılar', label: 'Diğer Ayakkabılar' }
            ],
            field: 'baby_kinderschuhe_art'
        },
        size: {
            label: 'Numara',
            type: 'multiselect',
            options: [
                '<20', '20', '21', '22', '23', '24', '25', '26', '27', '28',
                '29', '30', '31', '32', '33', '34', '35', '36', '>36'
            ],
            field: 'baby_kinderschuhe_size'
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
                { value: 'Baskılı', label: 'Baskılı' },
                { value: 'Kırmızı', label: 'Kırmızı' },
                { value: 'Siyah', label: 'Siyah' },
                { value: 'Gümüş', label: 'Gümüş' },
                { value: 'Turkuaz', label: 'Turkuaz' },
                { value: 'Beyaz', label: 'Beyaz' },
                { value: 'Diğer Renkler', label: 'Diğer Renkler' }
            ],
            field: 'baby_kinderschuhe_color'
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
        zustand: {
            label: 'Durum',
            type: 'multiselect',
            options: [
                { value: 'Yeni', label: 'Yeni' },
                { value: 'Çok İyi', label: 'Çok İyi' },
                { value: 'İyi', label: 'İyi' },
                { value: 'Makul', label: 'Makul' },
                { value: 'İkinci El', label: 'İkinci El' },
                { value: 'Kusurlu', label: 'Kusurlu' }
            ],
            field: 'condition'
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
        federal_state: {
            label: 'Konum',
            type: 'multiselect',
            options: [], dynamic: true,
            field: 'federal_state'
        }
    };

    const bannerConfig = {
        bgColor: 'bg-gradient-to-r from-red-500 to-rose-600',
        description: 'Bebek & Çocuk Ayakkabısı İlanlarını Keşfedin'
    };

    return (
        <GenericCategoryPage
            category="Aile, Çocuk & Bebek"
            subCategory="Bebek & Çocuk Ayakkabıları"
            pageTitle="Bebek & Çocuk Ayakkabıları"
            filterConfig={filterConfig}
            bannerConfig={bannerConfig}
            toggleFavorite={toggleFavorite}
            isFavorite={isFavorite}
            renderCustomFields={(listing) => (
                <div className="flex flex-wrap mt-1">
                    {listing.baby_kinderschuhe_art && (
                        <span className="text-sm mr-3">
                            <span className="text-black font-semibold">Tür: </span>
                            <span className="text-gray-600">{listing.baby_kinderschuhe_art}</span>
                        </span>
                    )}
                    {listing.baby_kinderschuhe_size && (
                        <span className="text-sm mr-3">
                            <span className="text-black font-semibold">Numara: </span>
                            <span className="text-gray-600">{listing.baby_kinderschuhe_size}</span>
                        </span>
                    )}
                    {listing.baby_kinderschuhe_color && (
                        <span className="text-sm">
                            <span className="text-black font-semibold">Renk: </span>
                            <span className="text-gray-600">{listing.baby_kinderschuhe_color}</span>
                        </span>
                    )}
                </div>
            )}
        />
    );
};

export default BabyKinderschuhePage;
