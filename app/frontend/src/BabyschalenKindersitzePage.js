import React from 'react';
import GenericCategoryPage from './components/GenericCategoryPage';
import { getTurkishCities } from './translations';

const BabyschalenKindersitzePage = ({ toggleFavorite, isFavorite }) => {
    const filterConfig = {
        color: {
            label: 'Renk',
            type: 'multiselect',
            options: [
                'Bej', 'Mavi', 'Kahverengi', 'Renkli', 'Krem', 'Sarı', 'Altın',
                'Gri', 'Yeşil', 'Haki', 'Lavanta', 'Mor', 'Turuncu', 'Pembe',
                'Desenli', 'Kırmızı', 'Siyah', 'Gümüş', 'Turkuaz', 'Beyaz',
                'Diğer Renkler'
            ],
            field: 'babyschalen_kindersitze_color'
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
        offerType: {
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
        federalState: {
            label: 'Şehir',
            type: 'multiselect',
            options: getTurkishCities(),
            field: 'federal_state'
        }
    };

    const bannerConfig = {
        icon: '💺',
        bgColor: 'bg-gradient-to-r from-red-500 to-rose-600',
        description: 'Oto Koltukları'
    };

    return (
        <GenericCategoryPage
            category="Aile, Çocuk & Bebek"
            subCategory="Bebek Koltuğu & Oto Koltukları"
            pageTitle="Oto Koltukları"
            filterConfig={filterConfig}
            bannerConfig={bannerConfig}
            toggleFavorite={toggleFavorite}
            isFavorite={isFavorite}
            renderCustomFields={(listing) => (
                <div className="flex flex-wrap mt-1">
                    {listing.babyschalen_kindersitze_color && (
                        <span className="text-sm">
                            <span className="text-black font-semibold">Renk: </span>
                            <span className="text-gray-600">{listing.babyschalen_kindersitze_color}</span>
                        </span>
                    )}
                </div>
            )}
        />
    );
};

export default BabyschalenKindersitzePage;
