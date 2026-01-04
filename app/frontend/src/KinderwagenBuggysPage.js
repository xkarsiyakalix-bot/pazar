import React from 'react';
import GenericCategoryPage from './components/GenericCategoryPage';
import { getTurkishCities } from './translations';

const KinderwagenBuggysPage = ({ toggleFavorite, isFavorite }) => {
    const filterConfig = {
        art: {
            label: 'Tür',
            type: 'multiselect',
            options: [
                'Kombi Bebek Arabası', 'Puset', 'Jogger',
                'İkiz & Kardeş Arabası', 'Aksesuar', 'Diğer'
            ],
            field: 'kinderwagen_buggys_art'
        },
        color: {
            label: 'Renk',
            type: 'multiselect',
            options: [
                'Bej', 'Mavi', 'Kahverengi', 'Renkli', 'Krem', 'Sarı', 'Altın',
                'Gri', 'Yeşil', 'Haki', 'Lavanta', 'Mor', 'Turuncu', 'Pembe',
                'Desenli', 'Kırmızı', 'Siyah', 'Gümüş', 'Turkuaz', 'Beyaz',
                'Diğer Renkler'
            ],
            field: 'kinderwagen_buggys_color'
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
                { value: 'neu', label: 'Yeni' },
                { value: 'sehr_gut', label: 'Çok İyi' },
                { value: 'gut', label: 'İyi' },
                { value: 'in_ordnung', label: 'İdare Eder' },
                { value: 'defekt', label: 'Arızalı' }
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
        icon: '🛒',
        bgColor: 'bg-gradient-to-r from-red-500 to-rose-600',
        description: 'Bebek Arabaları & Pusetler'
    };

    return (
        <GenericCategoryPage
            category="Aile, Çocuk & Bebek"
            subCategory="Bebek Arabaları & Pusetler"
            pageTitle="Bebek Arabaları & Pusetler"
            filterConfig={filterConfig}
            bannerConfig={bannerConfig}
            toggleFavorite={toggleFavorite}
            isFavorite={isFavorite}
            renderCustomFields={(listing) => (
                <div className="flex flex-wrap mt-1">
                    {listing.kinderwagen_buggys_art && (
                        <span className="text-sm mr-3">
                            <span className="text-black font-semibold">Tür: </span>
                            <span className="text-gray-600">{listing.kinderwagen_buggys_art}</span>
                        </span>
                    )}
                    {listing.kinderwagen_buggys_color && (
                        <span className="text-sm">
                            <span className="text-black font-semibold">Renk: </span>
                            <span className="text-gray-600">{listing.kinderwagen_buggys_color}</span>
                        </span>
                    )}
                </div>
            )}
        />
    );
};

export default KinderwagenBuggysPage;
