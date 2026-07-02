import React from 'react';
import GenericCategoryPage from './components/GenericCategoryPage';
import { getTurkishCities } from './translations';

const BabyKinderkleidungPage = ({ toggleFavorite, isFavorite }) => {
    const filterConfig = {
        art: {
            label: 'Tür',
            type: 'multiselect',
            options: [
                { value: 'Pantolon & Kot', label: 'Pantolon & Kot' },
                { value: 'Elbise & Etek', label: 'Elbise & Etek' },
                { value: 'Tişört & Üst', label: 'Tişört & Üst' },
                { value: 'Gömlek', label: 'Gömlek' },
                { value: 'Ceket & Mont', label: 'Ceket & Mont' },
                { value: 'Kazak & Hırka', label: 'Kazak & Hırka' },
                { value: 'İç Giyim', label: 'İç Giyim' },
                { value: 'Spor Giyim', label: 'Spor Giyim' },
                { value: 'Plaj Giyimi', label: 'Plaj Giyimi' },
                { value: 'Aksesuar', label: 'Aksesuar' },
                { value: 'Giyim Paketleri', label: 'Giyim Paketleri' },
                { value: 'Diğer Bebek & Çocuk Giyimi', label: 'Diğer Bebek & Çocuk Giyimi' }
            ],
            field: 'baby_kinderkleidung_art'
        },
        size: {
            label: 'Beden',
            type: 'multiselect',
            options: [
                '44', '50', '56', '62', '68', '74', '80', '86', '92', '98',
                '104', '110', '116', '122', '128', '134', '140', '146', '152',
                '158', '164', '170', '176', '182', '188'
            ],
            field: 'baby_kinderkleidung_size'
        },
        gender: {
            label: 'Cinsiyet',
            type: 'multiselect',
            options: [
                { value: 'Erkek', label: 'Erkek' },
                { value: 'Kız', label: 'Kız' },
                { value: 'Üniseks', label: 'Üniseks' }
            ],
            field: 'baby_kinderkleidung_gender'
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
            field: 'baby_kinderkleidung_color'
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
            options: [], dynamic: true.map(city => ({ value: city, label: city })),
            field: 'federal_state'
        }
    };

    const bannerConfig = {
        bgColor: 'bg-gradient-to-r from-red-500 to-rose-600',
        description: 'Bebek & Çocuk Giyimi İlanlarını Keşfedin'
    };

    return (
        <GenericCategoryPage
            category="Aile, Çocuk & Bebek"
            subCategory="Bebek & Çocuk Giyimi"
            pageTitle="Bebek & Çocuk Giyimi"
            filterConfig={filterConfig}
            bannerConfig={bannerConfig}
            toggleFavorite={toggleFavorite}
            isFavorite={isFavorite}
            renderCustomFields={(listing) => (
                <div className="flex flex-wrap mt-1">
                    {listing.baby_kinderkleidung_art && (
                        <span className="text-sm mr-3">
                            <span className="text-black font-semibold">Tür: </span>
                            <span className="text-gray-600">{listing.baby_kinderkleidung_art}</span>
                        </span>
                    )}
                    {listing.baby_kinderkleidung_size && (
                        <span className="text-sm mr-3">
                            <span className="text-black font-semibold">Beden: </span>
                            <span className="text-gray-600">{listing.baby_kinderkleidung_size}</span>
                        </span>
                    )}
                    {listing.baby_kinderkleidung_color && (
                        <span className="text-sm">
                            <span className="text-black font-semibold">Renk: </span>
                            <span className="text-gray-600">{listing.baby_kinderkleidung_color}</span>
                        </span>
                    )}
                </div>
            )}
        />
    );
};

export default BabyKinderkleidungPage;
