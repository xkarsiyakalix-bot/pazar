import React from 'react';
import { carBrands } from '../../data/carBrands';

export const VehicleFields = ({
    category,
    subCategory,
    t,
    // Bike
    selectedBikeArt,
    setSelectedBikeArt,
    selectedBikeType,
    setSelectedBikeType,
    // Auto/Moto/Van Shared
    marke,
    setMarke,
    getriebe,
    setGetriebe,
    kilometerstand,
    setKilometerstand,
    erstzulassung,
    setErstzulassung,
    leistung,
    setLeistung,
    // Auto Specific
    selectedCarBrand,
    setSelectedCarBrand,
    selectedCarModel,
    setSelectedCarModel,
    erstzulassungMonat,
    setErstzulassungMonat,
    kraftstoff,
    setKraftstoff,
    selectedFahrzeugtyp,
    setSelectedFahrzeugtyp,
    selectedDoorCount,
    setSelectedDoorCount,
    selectedExteriorColor,
    setSelectedExteriorColor,
    selectedInteriorMaterial,
    setSelectedInteriorMaterial,
    selectedEmissionBadge,
    setSelectedEmissionBadge,
    selectedSchadstoffklasse,
    setSelectedSchadstoffklasse,
    selectedHU,
    setSelectedHU,
    isUnfallfrei,
    setIsUnfallfrei,
    isScheckheftgepflegt,
    setIsScheckheftgepflegt,
    isNichtraucher,
    setIsNichtraucher,
    selectedCarAmenities,
    setSelectedCarAmenities,
    // Moto specific
    selectedMotorradArt,
    setSelectedMotorradArt,
    hubraum,
    setHubraum,
    // Boat specific
    selectedBooteArt,
    setSelectedBooteArt,
    // Parts specific
    selectedAutoteileArt,
    setSelectedAutoteileArt,
    selectedMotorradteileArt,
    setSelectedMotorradteileArt,
    // Commercial specific
    selectedNutzfahrzeugeArt,
    setSelectedNutzfahrzeugeArt,
    // Caravan specific
    selectedWohnwagenArt,
    setSelectedWohnwagenArt
}) => {
    return (
        <>
            {/* Bike-specific fields */}
            {subCategory.startsWith('Bisiklet') && (
                <div className="mt-4">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">{t.productDetail.details}</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">{t.addListing.art} *</label>
                            <select
                                value={selectedBikeArt}
                                onChange={(e) => setSelectedBikeArt(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white"
                            >
                                <option value="">{t.productDetail.pleaseChoose}</option>
                                <option value="Kadın">{t.addListing.genders.female}</option>
                                <option value="Erkek">{t.addListing.genders.male}</option>
                                <option value="Çocuk">{t.addListing.genders.boys}</option>
                                <option value="Aksesuar">Aksesuar</option>
                                <option value="Diğer Bisiklet & Aksesuarlar">Diğer Bisiklet & Aksesuarlar</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">{t.addListing.art} *</label>
                            <select
                                value={selectedBikeType}
                                onChange={(e) => setSelectedBikeType(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white"
                            >
                                <option value="">{t.productDetail.pleaseChoose}</option>
                                <option value="BMX">BMX</option>
                                <option value="Şehir Bisikleti">Şehir Bisikleti</option>
                                <option value="Cross & Trekking">Cross & Trekking</option>
                                <option value="Cruiser">Cruiser</option>
                                <option value="Elektrikli Bisiklet">Elektrikli Bisiklet</option>
                                <option value="Fixie & Singlespeed">Fixie & Singlespeed</option>
                                <option value="Katlanır Bisiklet">Katlanır Bisiklet</option>
                                <option value="Yük Bisikleti">Yük Bisikleti</option>
                                <option value="Dağ Bisikleti (MTB)">Dağ Bisikleti (MTB)</option>
                                <option value="Yol/Yarış Bisikleti">Yol/Yarış Bisikleti</option>
                                <option value="Tandem">Tandem</option>
                                <option value="Diğer Bisikletler">Diğer Bisikletler</option>
                            </select>
                        </div>
                    </div>
                </div>
            )}

            {/* Art Selection for Autoteile & Reifen */}
            {category === 'Otomobil, Bisiklet & Tekne' && subCategory.startsWith('Oto Parça') && (
                <div>
                    <label className="block text-sm text-gray-600 mb-1">{t.addListing.art}</label>
                    <select
                        value={selectedAutoteileArt}
                        onChange={(e) => setSelectedAutoteileArt(e.target.value)}
                        required
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white text-gray-700"
                    >
                        <option value="">{t.productDetail.pleaseChoose}</option>
                        <option value="Araç Ses Sistemi & Navigasyon">{t.addListing.vehicles.types.audioNav}</option>
                        <option value="Yedek Parça & Onarım">{t.addListing.vehicles.types.spareParts}</option>
                        <option value="Lastik & Jant">{t.addListing.vehicles.types.tires}</option>
                        <option value="Modifiye & Tasarım">{t.addListing.vehicles.types.tuning}</option>
                        <option value="Alet & El Gereçleri">{t.addListing.vehicles.types.tools}</option>
                        <option value="Diğer Oto Parçaları">{t.addListing.vehicles.types.otherParts}</option>
                    </select>
                </div>
            )}

            {/* Art Selection for Boote & Bootszubehör */}
            {category === 'Otomobil, Bisiklet & Tekne' && subCategory.startsWith('Tekne') && (
                <div>
                    <label className="block text-sm text-gray-600 mb-1">{t.addListing.art}</label>
                    <select
                        value={selectedBooteArt}
                        onChange={(e) => setSelectedBooteArt(e.target.value)}
                        required
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white text-gray-700"
                    >
                        <option value="">{t.productDetail.pleaseChoose}</option>
                        <option value="Motorlu Tekneler">{t.addListing.vehicles.types.motorBoats}</option>
                        <option value="Yelkenli Tekneler">{t.addListing.vehicles.types.sailingBoats}</option>
                        <option value="Küçük Tekneler">{t.addListing.vehicles.types.smallBoats}</option>
                        <option value="Şişme Botlar">{t.addListing.vehicles.types.inflatableBoats}</option>
                        <option value="Jetski">{t.addListing.vehicles.types.jetski}</option>
                        <option value="Tekne Römorkları">{t.addListing.vehicles.types.trailers}</option>
                        <option value="Tekne Bağlama Yerleri">{t.addListing.vehicles.types.moorings}</option>
                        <option value="Tekne Aksesuarları">{t.addListing.vehicles.types.accessories}</option>
                        <option value="Diğer Tekneler">{t.addListing.vehicles.types.otherBoats}</option>
                    </select>
                </div>
            )}

            {/* Art Selection for Motorräder & Motorroller */}
            {category === 'Otomobil, Bisiklet & Tekne' && subCategory.startsWith('Motosiklet') && !subCategory.startsWith('Motosiklet Parça') && (
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">{t.addListing.art}</label>
                        <select
                            value={selectedMotorradArt}
                            onChange={(e) => setSelectedMotorradArt(e.target.value)}
                            required
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white text-gray-700"
                        >
                            <option value="">{t.productDetail.pleaseChoose}</option>
                            <option value="Moped & Scooter">{t.addListing.vehicles.types.mopedScooter}</option>
                            <option value="Motosikletler">{t.addListing.vehicles.types.motorcycles}</option>
                            <option value="ATV & Quad">{t.addListing.vehicles.types.atvQuad}</option>
                            <option value="Skuter & Kalın Lastikli Skuter">{t.addListing.vehicles.types.scooter}</option>
                            <option value="Diğer Motosikletler">{t.addListing.vehicles.types.otherMotorcycles}</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">{t.addListing.vehicles.marke}</label>
                            <select
                                value={marke}
                                onChange={(e) => setMarke(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white text-gray-700"
                            >
                                <option value="">{t.productDetail.pleaseChoose}</option>
                                {[
                                    'Aprilia', 'BMW', 'Buell', 'Ducati', 'Harley', 'Honda', 'Husqvarna',
                                    'Kawasaki', 'KTM', 'Kymco', 'Moto Guzzi', 'MZ', 'Peugeot', 'Piaggio',
                                    'Simson', 'Suzuki', 'Triumph', 'Vespa', 'Yamaha', 'Zündapp',
                                    'Diğer'
                                ].map(m => (
                                    <option key={m} value={m}>{m}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">{t.addListing.vehicles.getriebe}</label>
                            <select
                                value={getriebe}
                                onChange={(e) => setGetriebe(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white text-gray-700"
                            >
                                <option value="">{t.productDetail.pleaseChoose}</option>
                                <option value="Automatik">{t.addListing.vehicles.types.automatic}</option>
                                <option value="Manuell">{t.addListing.vehicles.types.manual}</option>
                                <option value="Halbautomatik">{t.addListing.vehicles.types.semiAutomatic}</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mt-4">
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">{t.addListing.vehicles.mileage}</label>
                            <input
                                type="number"
                                value={kilometerstand}
                                onChange={(e) => setKilometerstand(e.target.value)}
                                placeholder={t.addListing.vehicles.mileagePlaceholder}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">{t.addListing.vehicles.firstRegistration}</label>
                            <select
                                value={erstzulassung}
                                onChange={(e) => setErstzulassung(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white text-gray-700"
                            >
                                <option value="">{t.productDetail.pleaseChoose}</option>
                                {Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - i).map(year => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">{t.addListing.vehicles.displacement}</label>
                            <input
                                type="text"
                                value={hubraum}
                                onChange={(e) => setHubraum(e.target.value)}
                                placeholder="örn. 600"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Art Selection for Motorradteile & Zubehör */}
            {category === 'Otomobil, Bisiklet & Tekne' && subCategory.startsWith('Motosiklet Parça') && (
                <div>
                    <label className="block text-sm text-gray-600 mb-1">{t.addListing.art}</label>
                    <select
                        value={selectedMotorradteileArt}
                        onChange={(e) => setSelectedMotorradteileArt(e.target.value)}
                        required
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white text-gray-700"
                    >
                        <option value="">{t.productDetail.pleaseChoose}</option>
                        <option value="Yedek Parça & Onarım">{t.addListing.vehicles.types.spareParts}</option>
                        <option value="Lastik & Jant">{t.addListing.vehicles.types.tires}</option>
                        <option value="Motosiklet Giyimi">{t.addListing.vehicles.types.motorcycleClothing}</option>
                    </select>
                </div>
            )}

            {/* Art Selection for Nutzfahrzeuge & Anhänger */}
            {category === 'Otomobil, Bisiklet & Tekne' && subCategory.startsWith('Ticari Araç') && (
                <div>
                    <label className="block text-sm text-gray-600 mb-1">{t.addListing.art}</label>
                    <select
                        value={selectedNutzfahrzeugeArt}
                        onChange={(e) => setSelectedNutzfahrzeugeArt(e.target.value)}
                        required
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white text-gray-700"
                    >
                        <option value="">{t.productDetail.pleaseChoose}</option>
                        <option value="Tarım Araçları">{t.addListing.vehicles.types.agriculturalVehicles}</option>
                        <option value="Römorklar">{t.addListing.vehicles.types.trailers}</option>
                        <option value="İş Makineleri">{t.addListing.vehicles.types.constructionVehicles}</option>
                        <option value="Otobüsler">{t.addListing.vehicles.types.buses}</option>
                        <option value="Kamyonlar">{t.addListing.vehicles.types.trucks}</option>
                        <option value="Çekiciler & Yarı Römorklar">{t.addListing.vehicles.types.semitrailerTractors}</option>
                        <option value="Forkliftler">{t.addListing.vehicles.types.forklifts}</option>
                        <option value="Traktörler">{t.addListing.vehicles.types.tractors}</option>
                        <option value="Transporterlar">{t.addListing.vehicles.types.vans}</option>
                        <option value="Ticari Araç Parçaları & Aksesuarları">{t.addListing.vehicles.types.commercialParts}</option>
                        <option value="Diğer Ticari Araçlar & Römorklar">{t.addListing.vehicles.types.otherCommercial}</option>
                    </select>
                </div>
            )}

            {/* Art Selection for Wohnwagen & -mobile */}
            {category === 'Otomobil, Bisiklet & Tekne' && subCategory.startsWith('Karavan') && (
                <div className="space-y-5">
                    <h2 className="text-lg font-semibold text-gray-900">{t.addListing.vehicles.vehicleDetails}</h2>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">Tür *</label>
                            <select
                                value={selectedWohnwagenArt}
                                onChange={(e) => setSelectedWohnwagenArt(e.target.value)}
                                required
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white text-gray-700"
                            >
                                <option value="">{t.productDetail.pleaseChoose}</option>
                                <option value="Alkoven">Alkoven</option>
                                <option value="Entegre">Entegre</option>
                                <option value="Panelvan">Panelvan</option>
                                <option value="Yarı Entegre">Yarı Entegre</option>
                                <option value="Karavan">Karavan</option>
                                <option value="Diğer Karavan & Motokaravan">Diğer Karavan & Motokaravan</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm text-gray-600 mb-1">{t.addListing.vehicles.marke} *</label>
                            <select
                                value={marke}
                                onChange={(e) => setMarke(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white text-gray-700"
                            >
                                <option value="">{t.productDetail.pleaseChoose}</option>
                                {[
                                    'Adria', 'Bürstner', 'Carado', 'Carthago', 'Chausson', 'Dethleffs',
                                    'Eura Mobil', 'Fendt', 'Fiat', 'Ford', 'Globecar', 'Hobby',
                                    'Hymer-Eriba', 'Knaus', 'LMC', 'McLouis', 'Mercedes Benz', 'Pössl',
                                    'Rapido', 'Rimor', 'Sunlight', 'Tabbert', 'TEC', 'Volkswagen',
                                    'Weinsberg', 'Diğer'
                                ].sort().map(brand => (
                                    <option key={brand} value={brand}>{brand}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">{t.addListing.vehicles.firstRegistration} *</label>
                            <div className="grid grid-cols-2 gap-2">
                                <select className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white">
                                    <option value="">Ay</option>
                                    {Array.from({ length: 12 }, (_, i) => (
                                        <option key={i + 1} value={i + 1}>{String(i + 1).padStart(2, '0')}</option>
                                    ))}
                                </select>
                                <select
                                    value={erstzulassung}
                                    onChange={(e) => setErstzulassung(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white text-gray-700"
                                >
                                    <option value="">Yıl</option>
                                    {Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - i).map(year => (
                                        <option key={year} value={year}>{year}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">Kilometre *</label>
                            <input
                                type="text"
                                value={kilometerstand}
                                onChange={(e) => setKilometerstand(e.target.value)}
                                placeholder="örn. 50000"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">{t.addListing.vehicles.power} *</label>
                            <input
                                type="text"
                                value={leistung}
                                onChange={(e) => setLeistung(e.target.value)}
                                placeholder="örn. 140"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Auto specific fields */}
            {subCategory === 'Otomobiller' && (
                <div className="space-y-5 pt-5 border-t border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">{t.addListing.vehicles.vehicleDetails}</h2>

                    {/* Basic Auto Info */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">{t.addListing.vehicles.marke} *</label>
                            <select
                                value={selectedCarBrand}
                                onChange={(e) => {
                                    setSelectedCarBrand(e.target.value);
                                    setSelectedCarModel(''); // Reset model when brand changes
                                }}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white"
                            >
                                <option value="">{t.productDetail.pleaseChoose}</option>
                                {carBrands.map((brand) => (
                                    <option key={brand.name} value={brand.name}>
                                        {brand.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">{t.addListing.vehicles.model} *</label>
                            <select
                                value={selectedCarModel}
                                onChange={(e) => setSelectedCarModel(e.target.value)}
                                disabled={!selectedCarBrand}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                            >
                                <option value="">
                                    {selectedCarBrand ? t.productDetail.pleaseChoose : t.addListing.vehicles.selectBrandFirst}
                                </option>
                                {selectedCarBrand && carBrands.find(b => b.name === selectedCarBrand)?.subModels?.map((model) => (
                                    <option key={model.name} value={model.name}>
                                        {model.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">{t.addListing.vehicles.firstRegistration} *</label>
                            <select
                                value={erstzulassungMonat}
                                onChange={(e) => setErstzulassungMonat(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white"
                            >
                                <option value="">{t.addListing.vehicles.month}</option>
                                {Array.from({ length: 12 }, (_, i) => (
                                    <option key={i + 1} value={i + 1}>{String(i + 1).padStart(2, '0')}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">&nbsp;</label>
                            <select
                                value={erstzulassung}
                                onChange={(e) => setErstzulassung(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white"
                            >
                                <option value="">{t.addListing.vehicles.year}</option>
                                {Array.from({ length: 50 }, (_, i) => {
                                    const year = new Date().getFullYear() - i;
                                    return <option key={year} value={year}>{year}</option>;
                                })}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">{t.addListing.vehicles.mileage} *</label>
                            <input
                                type="number"
                                value={kilometerstand}
                                onChange={(e) => setKilometerstand(e.target.value)}
                                placeholder={t.addListing.vehicles.mileagePlaceholder}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">{t.addListing.vehicles.power} *</label>
                            <input
                                type="number"
                                value={leistung}
                                onChange={(e) => setLeistung(e.target.value)}
                                placeholder={t.addListing.vehicles.powerPlaceholder}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">{t.addListing.vehicles.fuel} *</label>
                            <select
                                value={kraftstoff}
                                onChange={(e) => setKraftstoff(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white"
                            >
                                <option value="">{t.productDetail.pleaseChoose}</option>
                                <option value="Benzin">{t.addListing.vehicles.types.petrol}</option>
                                <option value="Diesel">{t.addListing.vehicles.types.diesel}</option>
                                <option value="Elektro">{t.addListing.vehicles.types.electric}</option>
                                <option value="Hybrid">{t.addListing.vehicles.types.hybrid}</option>
                                <option value="LPG & Erdgas (CNG)">{t.addListing.vehicles.types.lpgCng}</option>
                                <option value="Autogas (LPG)">{t.addListing.vehicles.types.autogasLpg}</option>
                                <option value="Andere">{t.addListing.vehicles.types.other}</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">{t.addListing.vehicles.getriebe} *</label>
                            <select
                                value={getriebe}
                                onChange={(e) => setGetriebe(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white"
                            >
                                <option value="">{t.productDetail.pleaseChoose}</option>
                                <option value="Manuell">{t.addListing.vehicles.types.manual}</option>
                                <option value="Automatik">{t.addListing.vehicles.types.automatic}</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">{t.addListing.vehicles.vehicleType} *</label>
                            <select
                                value={selectedFahrzeugtyp}
                                onChange={(e) => setSelectedFahrzeugtyp(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white"
                            >
                                <option value="">{t.productDetail.pleaseChoose}</option>
                                <option value="Kleinwagen">{t.addListing.vehicles.types.smallCar}</option>
                                <option value="Limousine">{t.addListing.vehicles.types.sedan}</option>
                                <option value="Kombi">{t.addListing.vehicles.types.stationWagon}</option>
                                <option value="Cabrio">{t.addListing.vehicles.types.cabrio}</option>
                                <option value="Geländewagen/SUV">{t.addListing.vehicles.types.suv}</option>
                                <option value="Van/Kleinbus">{t.addListing.vehicles.types.minivan}</option>
                                <option value="Coupe">{t.addListing.vehicles.types.coupe}</option>
                                <option value="Andere">{t.addListing.vehicles.types.other}</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">Kapı Sayısı</label>
                            <select
                                value={selectedDoorCount}
                                onChange={(e) => setSelectedDoorCount(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white"
                            >
                                <option value="">{t.productDetail.pleaseChoose}</option>
                                <option>2/3</option>
                                <option>4/5</option>
                                <option>6/7</option>
                                <option value="Andere">{t.addListing.vehicles.types.other}</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">{t.addListing.vehicles.exteriorColor}</label>
                            <select
                                value={selectedExteriorColor}
                                onChange={(e) => setSelectedExteriorColor(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white"
                            >
                                <option value="">{t.productDetail.pleaseChoose}</option>
                                <option value="Schwarz">{t.addListing.colors.black}</option>
                                <option value="Weiß">{t.addListing.colors.white}</option>
                                <option value="Grau">{t.addListing.colors.gray}</option>
                                <option value="Silber">{t.addListing.colors.silver}</option>
                                <option value="Blau">{t.addListing.colors.blue}</option>
                                <option value="Rot">{t.addListing.colors.red}</option>
                                <option value="Grün">{t.addListing.colors.green}</option>
                                <option value="Braun">{t.addListing.colors.brown}</option>
                                <option value="Beige">{t.addListing.colors.beige}</option>
                                <option value="Gelb">{t.addListing.colors.yellow}</option>
                                <option value="Orange">{t.addListing.colors.orange}</option>
                                <option value="Gold">{t.addListing.colors.gold}</option>
                                <option value="Violett">{t.addListing.colors.purple}</option>
                                <option value="Andere">Diğer</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">{t.addListing.vehicles.interiorMaterial}</label>
                            <select
                                value={selectedInteriorMaterial}
                                onChange={(e) => setSelectedInteriorMaterial(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white"
                            >
                                <option value="">{t.productDetail.pleaseChoose}</option>
                                <option value="Vollleder">Tam Deri</option>
                                <option value="Teilleder">Yarı Deri</option>
                                <option value="Stoff">Kumaş</option>
                                <option value="Velours">Kadife</option>
                                <option value="Alcantara">Alcantara</option>
                                <option value="Andere">{t.addListing.vehicles.types.other}</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">{t.addListing.vehicles.emissionBadge}</label>
                            <select
                                value={selectedEmissionBadge}
                                onChange={(e) => setSelectedEmissionBadge(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white"
                            >
                                <option value="">{t.productDetail.pleaseChoose}</option>
                                <option value="4 (Grün)">4 (Yeşil)</option>
                                <option value="3 (Gelb)">3 (Sarı)</option>
                                <option value="2 (Rot)">2 (Kırmızı)</option>
                                <option value="1 (Keine)">1 (Yok)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">{t.addListing.vehicles.emissionClass}</label>
                            <select
                                value={selectedSchadstoffklasse}
                                onChange={(e) => setSelectedSchadstoffklasse(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white"
                            >
                                <option value="">{t.productDetail.pleaseChoose}</option>
                                <option>Euro6</option>
                                <option>Euro5</option>
                                <option>Euro4</option>
                                <option>Euro3</option>
                                <option>Euro2</option>
                                <option>Euro1</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm text-gray-600 mb-1">{t.addListing.vehicles.hu}</label>
                        <input
                            type="month"
                            value={selectedHU}
                            onChange={(e) => setSelectedHU(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-600 mb-2">{t.addListing.vehicles.vehicleCondition}</label>
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={isUnfallfrei}
                                    onChange={(e) => setIsUnfallfrei(e.target.checked)}
                                    className="text-red-500 focus:ring-red-300 rounded"
                                />
                                <span className="text-sm">{t.addListing.vehicles.accidentFree}</span>
                            </label>
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={isScheckheftgepflegt}
                                    onChange={(e) => setIsScheckheftgepflegt(e.target.checked)}
                                    className="text-red-500 focus:ring-red-300 rounded"
                                />
                                <span className="text-sm">{t.addListing.vehicles.fullServiceHistory}</span>
                            </label>
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={isNichtraucher}
                                    onChange={(e) => setIsNichtraucher(e.target.checked)}
                                    className="text-red-500 focus:ring-red-300 rounded"
                                />
                                <span className="text-sm">{t.addListing.vehicles.nonSmokingVehicle}</span>
                            </label>
                        </div>
                    </div>

                    {/* Features */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">{t.addListing.vehicles.amenities}</label>
                        <div className="mb-4">
                            <p className="text-xs text-gray-600 mb-2 font-medium">{t.addListing.vehicles.features}</p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {[
                                    'Anhängerkupplung', 'Einparkhilfe', 'Leichtmetallfelgen', 'Xenon-/LED-Scheinwerfer',
                                    'Klimaanlage', 'Navigationssystem', 'Radio/Tuner', 'Bluetooth',
                                    'Freisprecheinrichtung', 'Schiebedach', 'Sitzheizung', 'Tempomat',
                                    'ABS'
                                ].map(feature => (
                                    <label key={feature} className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={selectedCarAmenities.includes(feature)}
                                            onChange={(e) => {
                                                if (e.target.checked) setSelectedCarAmenities([...selectedCarAmenities, feature]);
                                                else setSelectedCarAmenities(selectedCarAmenities.filter(f => f !== feature));
                                            }}
                                            className="text-red-500 focus:ring-red-300 rounded"
                                        />
                                        <span className="text-sm">
                                            {feature === 'Anhängerkupplung' ? t.amenities.anhaengerkupplung :
                                                feature === 'Einparkhilfe' ? t.amenities.einparkhilfe :
                                                    feature === 'Leichtmetallfelgen' ? t.amenities.leichtmetallfelgen :
                                                        feature === 'Xenon-/LED-Scheinwerfer' ? t.amenities.xenonLed :
                                                            feature === 'Klimaanlage' ? t.amenities.klimaanlage :
                                                                feature === 'Navigationssystem' ? t.amenities.navigationssystem :
                                                                    feature === 'Radio/Tuner' ? t.amenities.radioTuner :
                                                                        feature === 'Bluetooth' ? t.amenities.bluetooth :
                                                                            feature === 'Freisprecheinrichtung' ? t.amenities.freisprecheinrichtung :
                                                                                feature === 'Schiebedach' ? t.amenities.schiebedach :
                                                                                    feature === 'Sitzheizung' ? t.amenities.sitzheizung :
                                                                                        feature === 'Tempomat' ? t.amenities.tempomat :
                                                                                            feature === 'ABS' ? t.amenities.abs :
                                                                                                feature}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
