import React from 'react';
import GenericCategoryPage from './components/GenericCategoryPage';
import { getTurkishCities } from './translations';

const AltenpflegePage = ({ toggleFavorite, isFavorite }) => {
    const filterConfig = {
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
                { value: 'Privat', label: 'Bireysel' },
                { value: 'Gewerblich', label: 'Kurumsal' }
            ],
            field: 'seller_type'
        },
        federalState: {
            label: 'Şehir',
            type: 'multiselect',
            options: getTurkishCities(),
            field: 'federal_state'
        },
        art: {
            label: 'Tür',
            type: 'multiselect',
            options: [
                { value: '24h Betreuung', label: '24 Saat Bakım' },
                { value: 'Stundenweise Betreuung', label: 'Saatlik Bakım' },
                { value: 'Kurzzeitpflege', label: 'Kısa Süreli Bakım' },
                { value: 'Begleitung & Alltagshilfe', label: 'Refakat & Günlük Yardım' },
                { value: 'Sonstiges', label: 'Diğer' }
            ],
            field: 'altenpflege_art'
        }
    };

    const bannerConfig = {
        icon: '👵',
        bgColor: 'bg-gradient-to-r from-red-500 to-rose-600',
        description: 'Yaşlı Bakımı'
    };

    return (
        <GenericCategoryPage
            category="Aile, Çocuk & Bebek"
            subCategory="Yaşlı Bakımı"
            pageTitle="Yaşlı Bakımı"
            filterConfig={filterConfig}
            bannerConfig={bannerConfig}
            toggleFavorite={toggleFavorite}
            isFavorite={isFavorite}
            renderCustomFields={(listing) => (
                <div className="flex flex-wrap mt-1">
                    {listing.altenpflege_art && (
                        <span className="text-sm mr-3">
                            <span className="text-black font-semibold">Tür: </span>
                            <span className="text-gray-600">{listing.altenpflege_art}</span>
                        </span>
                    )}
                </div>
            )}
        />
    );
};

export default AltenpflegePage;
