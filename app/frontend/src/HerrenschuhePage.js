import React from 'react';
import GenericCategoryPage from './components/GenericCategoryPage';
import { getTurkishCities } from './translations';

const HerrenschuhePage = ({ toggleFavorite, isFavorite }) => {
    const filterConfig = {
        art: {
            label: 'Tür',
            type: 'multiselect',
            options: [
                { value: 'Yürüyüş & Bağcıklı Ayakkabı', label: 'Yürüyüş & Bağcıklı Ayakkabı' },
                { value: 'Ev Terlikleri', label: 'Ev Terlikleri' },
                { value: 'Sandaletler', label: 'Sandaletler' },
                { value: 'Sneaker & Spor Ayakkabı', label: 'Sneaker & Spor Ayakkabı' },
                { value: 'Çizme & Botlar', label: 'Çizme & Botlar' },
                { value: 'Outdoor & Doğa Yürüyüşü', label: 'Outdoor & Doğa Yürüyüşü' },
                { value: 'Diğer Ayakkabılar', label: 'Diğer Ayakkabılar' }
            ],
            field: 'herrenschuhe_art'
        },
        marke: {
            label: 'Marke',
            type: 'multiselect',
            options: [
                'Nike', 'Sonstige', 'Adidas', 'Puma', 'Jordan', 'New Balance',
                'ASICS', 'Vans', 'Timberland', 'Converse', 'Lloyd', 'Bugatti',
                'Atlas', 'Tommy Hilfiger', 'Engelbert Strauss', 'FILA',
                'Reebok', 'Haix', 'Yeezy', 'Lacoste'
            ],
            field: 'herrenschuhe_marke'
        },
        groesse: {
            label: 'Numara',
            type: 'multiselect',
            options: [
                '< 40', '40', '40.5', '41', '41.5', '42', '42.5', '43',
                '43.5', '44', '44.5', '45', '45.5', '46', '46.5', '47',
                '47.5', '48', '48.5', '49', '49.5', '> 50'
            ],
            field: 'herrenschuhe_size'
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
            field: 'herrenschuhe_color'
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
        description: 'Erkek Ayakkabıları İlanlarını Keşfedin'
    };

    return (
        <GenericCategoryPage
            category="Moda & Güzellik"
            subCategory="Erkek Ayakkabıları"
            pageTitle="Erkek Ayakkabıları"
            filterConfig={filterConfig}
            bannerConfig={bannerConfig}
            toggleFavorite={toggleFavorite}
            isFavorite={isFavorite}
            renderCustomFields={(listing) => (
                <div className="flex flex-wrap mt-1">
                    {listing.herrenschuhe_art && (
                        <span className="text-sm mr-3">
                            <span className="text-black font-semibold">Tür: </span>
                            <span className="text-gray-600">{listing.herrenschuhe_art}</span>
                        </span>
                    )}
                    {listing.herrenschuhe_marke && (
                        <span className="text-sm mr-3">
                            <span className="text-black font-semibold">Marka: </span>
                            <span className="text-gray-600">{listing.herrenschuhe_marke}</span>
                        </span>
                    )}
                    {listing.herrenschuhe_size && (
                        <span className="text-sm mr-3">
                            <span className="text-black font-semibold">Numara: </span>
                            <span className="text-gray-600">{listing.herrenschuhe_size}</span>
                        </span>
                    )}
                    {listing.herrenschuhe_color && (
                        <span className="text-sm">
                            <span className="text-black font-semibold">Renk: </span>
                            <span className="text-gray-600">{listing.herrenschuhe_color}</span>
                        </span>
                    )}
                </div>
            )}
        />
    );
};

export default HerrenschuhePage;
