import React from 'react';

export const HomeGardenFields = ({
    subCategory,
    category,
    t,
    // Schlafzimmer
    selectedSchlafzimmerArt,
    setSelectedSchlafzimmerArt,
    // Küche & Esszimmer
    selectedKuecheEsszimmerArt,
    setSelectedKuecheEsszimmerArt,
    // Gartenzubehör & Pflanzen
    selectedGartenzubehoerArt,
    setSelectedGartenzubehoerArt,
    // Lamba & Aydınlatma
    selectedLambaAydinlatmaArt,
    setSelectedLambaAydinlatmaArt,
    // Dekoration
    selectedDekorationArt,
    setSelectedDekorationArt,
    // Oturma Odası
    selectedWohnzimmerArt,
    setSelectedWohnzimmerArt,
    // Dienstleistungen Haus & Garten
    selectedDienstleistungenHausGartenArt,
    setSelectedDienstleistungenHausGartenArt
}) => {
    return (
        <div className="space-y-4 pt-4 border-t border-gray-200">
            {/* Wohnzimmer */}
            {category === 'Ev & Bahçe' && subCategory === 'Oturma Odası' && (
                <div>
                    <label className="block text-sm text-gray-600 mb-1">{t.addListing.art}</label>
                    <select
                        value={selectedWohnzimmerArt}
                        onChange={(e) => setSelectedWohnzimmerArt(e.target.value)}
                        required
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white text-gray-700"
                    >
                        <option value="">{t.productDetail.pleaseChoose}</option>
                        <option value="Raflar">{t.addListing.homeGarden.types.shelves}</option>
                        <option value="Dolaplar & Üniteler">{t.addListing.homeGarden.types.cabinets}</option>
                        <option value="Oturma Grubu">{t.addListing.homeGarden.types.seating}</option>
                        <option value="Kanepeler & Koltuklar">{t.addListing.homeGarden.types.sofas}</option>
                        <option value="Masalar">{t.addListing.homeGarden.types.table}</option>
                        <option value="TV & Ses Sistemleri Mobilyaları">{t.addListing.homeGarden.types.tvFurniture}</option>
                        <option value="Diğer Oturma Odası">{t.addListing.homeGarden.types.otherLivingRoom}</option>
                    </select>
                </div>
            )}

            {/* Schlafzimmer */}
            {category === 'Ev & Bahçe' && subCategory === 'Yatak Odası' && (
                <div>
                    <label className="block text-sm text-gray-600 mb-1">{t.addListing.art}</label>
                    <select
                        value={selectedSchlafzimmerArt}
                        onChange={(e) => setSelectedSchlafzimmerArt(e.target.value)}
                        required
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white text-gray-700"
                    >
                        <option value="">{t.productDetail.pleaseChoose}</option>
                        <option value="Yatak">{t.addListing.homeGarden.types.bed}</option>
                        <option value="Latalı Izgaralar">{t.addListing.homeGarden.types.slats}</option>
                        <option value="Yatak Şilteleri">{t.addListing.homeGarden.types.mattress}</option>
                        <option value="Komodin">{t.addListing.homeGarden.types.nightstand}</option>
                        <option value="Dolap">{t.addListing.homeGarden.types.closet}</option>
                        <option value="Diğer Yatak Odası Mobilyaları">{t.addListing.homeGarden.types.otherBedroom}</option>
                    </select>
                </div>
            )}

            {/* Küche & Esszimmer */}
            {category === 'Ev & Bahçe' && subCategory === 'Mutfak & Yemek Odası' && (
                <div>
                    <label className="block text-sm text-gray-600 mb-1">{t.addListing.art}</label>
                    <select
                        value={selectedKuecheEsszimmerArt}
                        onChange={(e) => setSelectedKuecheEsszimmerArt(e.target.value)}
                        required
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white text-gray-700"
                    >
                        <option value="">{t.productDetail.pleaseChoose}</option>
                        <option value="Çatal Bıçak Takımı">{t.addListing.homeGarden.types.cutlery}</option>
                        <option value="Sofra Takımı">{t.addListing.homeGarden.types.tableware}</option>
                        <option value="Bardak">{t.addListing.homeGarden.types.glass}</option>
                        <option value="Küçük Ev Aletleri">{t.addListing.homeGarden.types.appliances}</option>
                        <option value="Mutfak Dolabı">{t.addListing.homeGarden.types.kitchenCabinet}</option>
                        <option value="Sandalye">{t.addListing.homeGarden.types.chair}</option>
                        <option value="Masa">{t.addListing.homeGarden.types.table}</option>
                        <option value="Diğer Mutfak & Yemek Odası">{t.addListing.homeGarden.types.otherKitchen}</option>
                    </select>
                </div>
            )}

            {/* Gartenzubehör & Pflanzen */}
            {category === 'Ev & Bahçe' && subCategory === 'Bahçe Malzemeleri & Bitkiler' && (
                <div>
                    <label className="block text-sm text-gray-600 mb-1">{t.addListing.art}</label>
                    <select
                        value={selectedGartenzubehoerArt}
                        onChange={(e) => setSelectedGartenzubehoerArt(e.target.value)}
                        required
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white text-gray-700"
                    >
                        <option value="">{t.productDetail.pleaseChoose}</option>
                        <option value="Çiçek Saksısı">{t.addListing.homeGarden.types.pot}</option>
                        <option value="Dekorasyon">{t.addListing.homeGarden.types.decoration}</option>
                        <option value="Bahçe Aletleri">{t.addListing.homeGarden.types.tools}</option>
                        <option value="Bahçe Mobilyası">{t.addListing.homeGarden.types.furniture}</option>
                        <option value="Bitki">{t.addListing.homeGarden.types.plant}</option>
                        <option value="Diğer Bahçe Malzemeleri & Bitkiler">{t.addListing.homeGarden.types.otherGarden}</option>
                    </select>
                </div>
            )}

            {/* Lamba & Aydınlatma */}
            {category === 'Ev & Bahçe' && (subCategory === 'Lamba & Aydınlatma' || subCategory === 'Aydınlatma') && (
                <div>
                    <label className="block text-sm text-gray-600 mb-1">{t.addListing.art}</label>
                    <select
                        value={selectedLambaAydinlatmaArt}
                        onChange={(e) => setSelectedLambaAydinlatmaArt(e.target.value)}
                        required
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white text-gray-700"
                    >
                        <option value="">{t.productDetail.pleaseChoose}</option>
                        <option value="Tavan Lambası">{t.addListing.homeGarden.types.ceilingLamp}</option>
                        <option value="Yer Lambası">{t.addListing.homeGarden.types.floorLamp}</option>
                        <option value="Masa Lambası">{t.addListing.homeGarden.types.tableLamp}</option>
                        <option value="Dış Aydınlatma">{t.addListing.homeGarden.types.outdoorLighting}</option>
                        <option value="Ampul">{t.addListing.homeGarden.types.bulb}</option>
                        <option value="Diğer Lamba & Aydınlatma">{t.addListing.homeGarden.types.otherLighting}</option>
                    </select>
                </div>
            )}

            {/* Dekoration */}
            {category === 'Ev & Bahçe' && subCategory === 'Dekorasyon' && (
                <div>
                    <label className="block text-sm text-gray-600 mb-1">{t.addListing.art}</label>
                    <select
                        value={selectedDekorationArt}
                        onChange={(e) => setSelectedDekorationArt(e.target.value)}
                        required
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white text-gray-700"
                    >
                        <option value="">{t.productDetail.pleaseChoose}</option>
                        <option value="Resim & Poster">{t.addListing.homeGarden.types.poster}</option>
                        <option value="Mum & Mum Sabitleyici">{t.addListing.homeGarden.types.candle}</option>
                        <option value="Ayna">{t.addListing.homeGarden.types.mirror}</option>
                        <option value="Vazo">{t.addListing.homeGarden.types.vase}</option>
                        <option value="Diğer Dekorasyon">{t.addListing.homeGarden.types.otherDecoration}</option>
                    </select>
                </div>
            )}

            {/* Dienstleistungen Haus & Garten */}
            {((category === 'Ev & Bahçe' && (subCategory === 'Ev & Bahçe Hizmetleri' || subCategory === 'Ev & Bahçe')) ||
                (category === 'Hizmetler' && (subCategory === 'Ev & Bahçe Hizmetleri' || subCategory === 'Ev & Bahçe'))) && (
                    <div className="mt-4">
                        <label className="block text-sm text-gray-600 mb-1">{t.addListing.art}</label>
                        <select
                            value={selectedDienstleistungenHausGartenArt}
                            onChange={(e) => setSelectedDienstleistungenHausGartenArt(e.target.value)}
                            required
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white text-gray-700"
                        >
                            <option value="">{t.productDetail.pleaseChoose}</option>
                            <option value="Bau & Handwerk">{t.addListing.services.types.construction}</option>
                            <option value="Garten- & Landschaftsbau">{t.addListing.services.types.gardenLandscape}</option>
                            <option value="Haushaltshilfe">{t.addListing.services.types.householdHelp}</option>
                            <option value="Reinigungsservice">{t.addListing.services.types.cleaningService}</option>
                            <option value="Reparaturen">{t.addListing.services.types.repairs}</option>
                            <option value="Wohnungsauflösungen">{t.addListing.services.types.clearance}</option>
                            <option value="Weitere Dienstleistungen Haus & Garten">{t.addListing.services.types.otherHomeGarden}</option>
                        </select>
                    </div>
                )}
        </div>
    );
};
