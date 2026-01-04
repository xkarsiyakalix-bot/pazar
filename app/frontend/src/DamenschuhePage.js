import React from 'react';
import GenericCategoryPage from './components/GenericCategoryPage';
import { getTurkishCities, t } from './translations';

const DamenschuhePage = ({ toggleFavorite, isFavorite }) => {
    const filterConfig = {
        art: {
            label: t.productDetail.art,
            type: 'multiselect',
            options: [
                { value: 'Babetler', label: 'Babetler' },
                { value: 'Yürüyüş & Bağcıklı Ayakkabı', label: 'Yürüyüş & Bağcıklı Ayakkabı' },
                { value: 'Ev Terlikleri', label: 'Ev Terlikleri' },
                { value: 'Outdoor & Doğa Yürüyüşü', label: 'Outdoor & Doğa Yürüyüşü' },
                { value: 'Topuklu Ayakkabılar', label: 'Topuklu Ayakkabılar' },
                { value: 'Sandaletler', label: 'Sandaletler' },
                { value: 'Sneaker & Spor Ayakkabı', label: 'Sneaker & Spor Ayakkabı' },
                { value: 'Çizme & Botlar', label: 'Çizme & Botlar' },
                { value: 'Diğer Ayakkabılar', label: 'Diğer Ayakkabılar' }
            ],
            field: 'damenschuhe_art'
        },
        marke: {
            label: t.addListing.brand,
            type: 'multiselect',
            options: [
                { value: 'Sonstige', label: 'Sonstige' },
                { value: 'Nike', label: 'Nike' },
                { value: 'Adidas', label: 'Adidas' },
                { value: 'Tamaris', label: 'Tamaris' },
                { value: 'Gabor', label: 'Gabor' },
                { value: 'Graceland', label: 'Graceland' },
                { value: 'Puma', label: 'Puma' },
                { value: 'Converse', label: 'Converse' },
                { value: 'Rieker', label: 'Rieker' },
                { value: 'Tommy Hilfiger', label: 'Tommy Hilfiger' },
                { value: 'Dr. Martens', label: 'Dr. Martens' },
                { value: 'Paul Green', label: 'Paul Green' },
                { value: 'UGG', label: 'UGG' },
                { value: 'Buffalo', label: 'Buffalo' },
                { value: 'Vans', label: 'Vans' },
                { value: 'Marco Tozzi', label: 'Marco Tozzi' },
                { value: 'S.Oliver', label: 'S.Oliver' },
                { value: 'Esprit', label: 'Esprit' },
                { value: 'Timberland', label: 'Timberland' },
                { value: 'H&M', label: 'H&M' }
            ],
            field: 'damenschuhe_marke'
        },
        groesse: {
            label: t.addListing.size,
            type: 'multiselect',
            options: [
                { value: '< 35', label: '< 35' },
                { value: '35', label: '35' },
                { value: '35.5', label: '35.5' },
                { value: '36', label: '36' },
                { value: '36.5', label: '36.5' },
                { value: '37', label: '37' },
                { value: '37.5', label: '37.5' },
                { value: '38', label: '38' },
                { value: '38.5', label: '38.5' },
                { value: '39', label: '39' },
                { value: '39.5', label: '39.5' },
                { value: '40', label: '40' },
                { value: '40.5', label: '40.5' },
                { value: '41', label: '41' },
                { value: '41.5', label: '41.5' },
                { value: '42', label: '42' },
                { value: '42.5', label: '42.5' },
                { value: '43', label: '43' },
                { value: '43.5', label: '43.5' },
                { value: '44', label: '44' },
                { value: '44.5', label: '44.5' },
                { value: '45', label: '45' },
                { value: '45.5', label: '45.5' },
                { value: '46', label: '46' },
                { value: '46.5', label: '46.5' },
                { value: '47', label: '47' },
                { value: '47.5', label: '47.5' },
                { value: '48', label: '48' },
                { value: '48.5', label: '48.5' },
                { value: '49', label: '49' },
                { value: '49.5', label: '49.5' },
                { value: '> 50', label: '> 50' }
            ],
            field: 'damenschuhe_size'
        },
        color: {
            label: t.addListing.color,
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
            field: 'damenschuhe_color'
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
        icon: '👠',
        bgColor: 'bg-gradient-to-r from-red-500 to-rose-600',
        description: 'Kadın Ayakkabıları İlanlarını Keşfedin'
    };

    return (
        <GenericCategoryPage
            category="Moda & Güzellik"
            subCategory="Kadın Ayakkabıları"
            pageTitle="Kadın Ayakkabıları"
            filterConfig={filterConfig}
            bannerConfig={bannerConfig}
            toggleFavorite={toggleFavorite}
            isFavorite={isFavorite}
            renderCustomFields={(listing) => (
                <div className="flex flex-wrap mt-1">
                    {listing.damenschuhe_art && (
                        <span className="text-sm mr-3">
                            <span className="text-black font-semibold">Tür: </span>
                            <span className="text-gray-600">{listing.damenschuhe_art}</span>
                        </span>
                    )}
                    {listing.damenschuhe_marke && (
                        <span className="text-sm mr-3">
                            <span className="text-black font-semibold">Marka: </span>
                            <span className="text-gray-600">{listing.damenschuhe_marke}</span>
                        </span>
                    )}
                    {listing.damenschuhe_size && (
                        <span className="text-sm mr-3">
                            <span className="text-black font-semibold">Numara: </span>
                            <span className="text-gray-600">{listing.damenschuhe_size}</span>
                        </span>
                    )}
                    {listing.damenschuhe_color && (
                        <span className="text-sm">
                            <span className="text-black font-semibold">Renk: </span>
                            <span className="text-gray-600">{listing.damenschuhe_color}</span>
                        </span>
                    )}
                </div>
            )}
        />
    );
};

export default DamenschuhePage;
