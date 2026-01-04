import React from 'react';
import GenericCategoryPage from './components/GenericCategoryPage';
import { getTurkishCities } from './translations';

const BeautyGesundheitPage = ({ toggleFavorite, isFavorite }) => {
    const filterConfig = {
        art: {
            label: 'Tür',
            type: 'multiselect',
            options: [
                { value: 'Makyaj & Cilt Bakımı', label: 'Makyaj & Cilt Bakımı' },
                { value: 'Saç Bakımı', label: 'Saç Bakımı' },
                { value: 'Vücut Bakımı', label: 'Vücut Bakımı' },
                { value: 'El & Tırnak Bakımı', label: 'El & Tırnak Bakımı' },
                { value: 'Sağlık', label: 'Sağlık' },
                { value: 'Diğer Güzellik & Sağlık', label: 'Diğer Güzellik & Sağlık' }
            ],
            field: 'beauty_gesundheit_art'
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
        federalState: {
            label: 'Konum',
            type: 'multiselect',
            options: getTurkishCities().map(city => ({ value: city, label: city })),
            field: 'federal_state'
        }
    };

    const bannerConfig = {
        icon: '💄',
        bgColor: 'bg-gradient-to-r from-red-500 to-rose-600',
        description: 'Güzellik & Sağlık İlanlarını Keşfedin'
    };

    return (
        <GenericCategoryPage
            category="Moda & Güzellik"
            subCategory="Güzellik & Sağlık"
            pageTitle="Güzellik & Sağlık"
            filterConfig={filterConfig}
            bannerConfig={bannerConfig}
            renderCustomFields={(listing) => (
                <div className="flex flex-wrap mt-1">
                    {listing.beauty_gesundheit_art && (
                        <span className="text-sm mr-3">
                            <span className="text-black font-semibold">Tür: </span>
                            <span className="text-gray-600">{listing.beauty_gesundheit_art}</span>
                        </span>
                    )}
                </div>
            )}
            toggleFavorite={toggleFavorite}
            isFavorite={isFavorite}
        />
    );
};

export default BeautyGesundheitPage;
