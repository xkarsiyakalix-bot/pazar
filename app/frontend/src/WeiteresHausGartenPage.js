import React from 'react';
import GenericCategoryPage from './components/GenericCategoryPage';
import { getTurkishCities } from './translations';

const WeiteresHausGartenPage = ({ toggleFavorite, isFavorite }) => {
    const filterConfig = {
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
                { value: 'Satılık/Kiralık', label: 'Satılık/Kiralık' },
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
                { value: 'Çok İyi', label: 'Çok İyi' },
                { value: 'İyi', label: 'İyi' },
                { value: 'İdare Eder', label: 'İdare Eder' },
                { value: 'Arızalı', label: 'Arızalı' }
            ],
            field: 'condition'
        },
        federal_state: {
            label: 'Konum',
            type: 'multiselect',
            options: [], dynamic: true.map(city => ({ value: city, label: city })),
            field: 'federal_state'
        },
        art: {
            label: 'Tür',
            type: 'multiselect',
            options: [
                { value: 'Aletler', label: 'Aletler' },
                { value: 'Bahçe Aletleri', label: 'Bahçe Aletleri' },
                { value: 'İnşaat Malzemeleri', label: 'İnşaat Malzemeleri' },
                { value: 'Diğer', label: 'Diğer' }
            ],
            field: 'weiteres_haus_garten_art'
        }
    };

    const bannerConfig = {
        bgColor: 'bg-gradient-to-r from-red-500 to-rose-600',
        description: 'Diğer Ev & Bahçe İlanlarını Keşfedin'
    };

    return (
        <GenericCategoryPage
            category="Ev & Bahçe"
            subCategory="Diğer Ev & Bahçe"
            pageTitle="Diğer Ev & Bahçe"
            filterConfig={filterConfig}
            bannerConfig={bannerConfig}
            toggleFavorite={toggleFavorite}
            isFavorite={isFavorite}
            renderCustomFields={(listing) => (
                <div className="flex flex-wrap mt-1">
                    {listing.weiteres_haus_garten_art && (
                        <span className="text-sm mr-3">
                            <span className="text-black font-semibold">Tür: </span>
                            <span className="text-gray-600">{listing.weiteres_haus_garten_art}</span>
                        </span>
                    )}
                    {listing.condition && (
                        <span className="text-sm mr-3">
                            <span className="text-black font-semibold">Durum: </span>
                            <span className="text-gray-600">
                                {listing.condition === 'neu' ? 'Yeni' :
                                    listing.condition === 'sehr_gut' ? 'Çok İyi' :
                                        listing.condition === 'gut' ? 'İyi' :
                                            listing.condition === 'in_ordnung' ? 'İdare Eder' :
                                                listing.condition === 'defekt' ? 'Arızalı' : listing.condition}
                            </span>
                        </span>
                    )}
                </div>
            )}
        />
    );
};

export default WeiteresHausGartenPage;
