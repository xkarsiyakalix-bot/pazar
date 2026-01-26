import React from 'react';

export const RealEstateFields = ({
    subCategory,
    t,
    selectedObjektart,
    setSelectedObjektart,
    selectedGrundstuecksart,
    setSelectedGrundstuecksart,
    selectedWohnungstyp,
    setSelectedWohnungstyp,
    selectedHaustyp,
    setSelectedHaustyp,
    selectedAngebotsart,
    setSelectedAngebotsart,
    livingSpace,
    setLivingSpace,
    rooms,
    setRooms,
    floor,
    setFloor,
    availableFrom,
    setAvailableFrom,
    selectedOnlineViewing,
    setSelectedOnlineViewing,
    plotArea,
    setPlotArea,
    pricePerSqm,
    setPricePerSqm,
    warmRent,
    setWarmRent,
    roommates,
    setRoommates,
    constructionYear,
    setConstructionYear,
    selectedTauschangebot,
    setSelectedTauschangebot,
    selectedCommission,
    setSelectedCommission,
    selectedGarageType,
    setSelectedGarageType,
    selectedAufZeitWGArt,
    setSelectedAufZeitWGArt,
    selectedRentalType,
    setSelectedRentalType,
    selectedLage,
    setSelectedLage,
    selectedAmenities,
    setSelectedAmenities,
    selectedGeneralFeatures,
    setSelectedGeneralFeatures
}) => {
    return (
        <div className="space-y-4 pt-4 border-t border-gray-200">
            {/* Specific Art Selectors */}
            {['Konteyner', 'Tatil Evi & Yurt Dışı Emlak', 'Ticari Emlak', 'Arsa & Bahçe', 'Kiralık Müstakil Ev', 'Satılık Müstakil Ev', 'Kiralık Daire', 'Satılık Daire', 'Satılık Yazlık'].includes(subCategory) && (
                <div className="space-y-4 mb-4">
                    {subCategory === 'Ticari Emlak' && (
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">{t.addListing.realEstate.type}</label>
                            <select
                                value={selectedObjektart}
                                onChange={(e) => setSelectedObjektart(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white"
                            >
                                <option value="">{t.productDetail.pleaseChoose}</option>
                                <option value="Büros & Praxen">Ofis & Muayenehane</option>
                                <option value="Weitere Gewerbeeinheiten">Diğer Ticari Birimler</option>
                                <option value="Lager, Hallen & Produktion">Depo, Antrepo & Üretim</option>
                                <option value="Gastronomie & Hotels">Gastronomi & Otel</option>
                                <option value="Einzelhandel & Kioske">Perakende & Büfe</option>
                            </select>
                        </div>
                    )}
                    {subCategory === 'Arsa & Bahçe' && (
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">{t.addListing.realEstate.landType}</label>
                            <select
                                value={selectedGrundstuecksart}
                                onChange={(e) => setSelectedGrundstuecksart(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white"
                            >
                                <option value="">{t.productDetail.pleaseChoose}</option>
                                <option value="Baugrundstück">İmar Parseli</option>
                                <option value="Garten">Bahçe</option>
                                <option value="Land-/Forstwirtschaft">Tarım/Orman Arazisi</option>
                                <option value="Weitere Grundstücke & Gärten">Diğer Arsa & Bahçeler</option>
                            </select>
                        </div>
                    )}
                    {['Kiralık Daire', 'Satılık Daire'].includes(subCategory) && (
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">{t.addListing.realEstate.apartmentType}</label>
                            <select
                                value={selectedWohnungstyp}
                                onChange={(e) => setSelectedWohnungstyp(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white"
                            >
                                <option value="">{t.productDetail.pleaseChoose}</option>
                                {['Çatı Katı Dairesi', 'Giriş Kat Dairesi', 'Ara Kat Daire', 'Yüksek Giriş', 'Loft', 'Dubleks', 'Penthouse', 'Bodrum Kat', 'Teraslı Daire', 'Diğer Daire Tipleri'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                        </div>
                    )}
                    {['Kiralık Müstakil Ev', 'Satılık Müstakil Ev'].includes(subCategory) && (
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">{t.addListing.realEstate.houseType}</label>
                            <select
                                value={selectedHaustyp}
                                onChange={(e) => setSelectedHaustyp(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white"
                            >
                                <option value="">{t.productDetail.pleaseChoose}</option>
                                <option value="Einfamilienhaus freistehend">Bağımsız Müstakil Ev</option>
                                <option value="Reihenhaus">Sıra Ev</option>
                                <option value="Mehrfamilienhaus">Apartman</option>
                                <option value="Bungalow">Bungalow</option>
                                <option value="Bauernhaus">Çiftlik Evi</option>
                                <option value="Doppelhaushälfte">İkiz Villa</option>
                                <option value="Villa">Villa</option>
                                <option value="Andere Haustypen">Diğer Ev Tipleri</option>
                            </select>
                        </div>
                    )}
                    {!['Kiralık Müstakil Ev', 'Satılık Müstakil Ev', 'Kiralık Daire', 'Satılık Daire', 'Satılık Yazlık'].includes(subCategory) && (
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">{t.addListing.art}</label>
                            <select
                                value={selectedAngebotsart}
                                onChange={(e) => setSelectedAngebotsart(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white"
                            >
                                <option value="">{t.productDetail.pleaseChoose}</option>
                                <option value="Kaufen">Satılık</option>
                                <option value="Mieten">Kiralık</option>
                            </select>
                        </div>
                    )}
                </div>
            )}

            {!['Taşımacılık & Nakliye', 'Diğer Emlak'].includes(subCategory) && (
                <h3 className="font-semibold text-gray-900">{t.addListing.realEstate.title}</h3>
            )}

            {!['Taşımacılık & Nakliye', 'Diğer Emlak'].includes(subCategory) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Living Space */}
                    {!['Taşımacılık & Nakliye', 'Diğer Emlak', 'Garaj & Otopark', 'Arsa & Bahçe', 'Konteyner'].includes(subCategory) && (
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">{t.addListing.realEstate.area}</label>
                            <input
                                type="number"
                                value={livingSpace}
                                onChange={(e) => setLivingSpace(e.target.value)}
                                placeholder="Örn: 75"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300"
                            />
                        </div>
                    )}

                    {/* Rooms */}
                    {!['Taşımacılık & Nakliye', 'Diğer Emlak', 'Garaj & Otopark', 'Arsa & Bahçe', 'Konteyner'].includes(subCategory) && (
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">{t.addListing.realEstate.rooms}</label>
                            <input
                                type="number"
                                step="0.5"
                                value={rooms}
                                onChange={(e) => setRooms(e.target.value)}
                                placeholder="Örn: 3"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300"
                            />
                        </div>
                    )}

                    {/* Floor */}
                    {['Kiralık Daire', 'Satılık Daire', 'Geçici Konaklama & Paylaşımlı Ev'].includes(subCategory) && (
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">{t.addListing.realEstate.floor}</label>
                            <input
                                type="number"
                                value={floor}
                                onChange={(e) => setFloor(e.target.value)}
                                placeholder="Örn: 2"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300"
                            />
                        </div>
                    )}

                    {/* Available From */}
                    {!['Umzug & Transport', 'Weitere Immobilien'].includes(subCategory) && (
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">{t.addListing.realEstate.availableFrom}</label>
                            <input
                                type="date"
                                value={availableFrom}
                                onChange={(e) => setAvailableFrom(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300"
                            />
                        </div>
                    )}

                    {/* Online Viewing */}
                    {!['Umzug & Transport', 'Weitere Immobilien'].includes(subCategory) && (
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">{t.addListing.realEstate.onlineViewing}</label>
                            <select
                                value={selectedOnlineViewing}
                                onChange={(e) => setSelectedOnlineViewing(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white"
                            >
                                <option value="">{t.productDetail.pleaseChoose}</option>
                                <option value="Möglich">Mümkün</option>
                                <option value="Nicht möglich">Mümkün Değil</option>
                            </select>
                        </div>
                    )}

                    {/* Plot Area */}
                    {['Kiralık Müstakil Ev', 'Satılık Müstakil Ev', 'Arsa & Bahçe', 'Satılık Yazlık'].includes(subCategory) && (
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">{t.addListing.realEstate.lotArea}</label>
                            <input
                                type="number"
                                value={plotArea}
                                onChange={(e) => setPlotArea(e.target.value)}
                                placeholder="Örn: 400"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300"
                            />
                        </div>
                    )}

                    {/* Area (Generic) */}
                    {['Ticari Emlak', 'Konteyner'].includes(subCategory) && (
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">{t.addListing.realEstate.totalArea}</label>
                            <input
                                type="number"
                                value={livingSpace}
                                onChange={(e) => setLivingSpace(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300"
                            />
                        </div>
                    )}

                    {/* Price Per Sqm */}
                    {['Ticari Emlak', 'Konteyner'].includes(subCategory) && (
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">{t.addListing.realEstate.sqmPrice}</label>
                            <input
                                type="number"
                                value={pricePerSqm}
                                onChange={(e) => setPricePerSqm(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300"
                            />
                        </div>
                    )}

                    {/* Warm Rent */}
                    {['Kiralık Daire', 'Geçici Konaklama & Paylaşımlı Ev', 'Kiralık Müstakil Ev'].includes(subCategory) && (
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">{t.addListing.realEstate.warmRent}</label>
                            <input
                                type="number"
                                value={warmRent}
                                onChange={(e) => setWarmRent(e.target.value)}
                                placeholder="Örn: 950"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300"
                            />
                        </div>
                    )}

                    {/* Roommates */}
                    {subCategory === 'Geçici Konaklama & Paylaşımlı Ev' && (
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">{t.addListing.realEstate.roommates}</label>
                            <input
                                type="number"
                                value={roommates}
                                onChange={(e) => setRoommates(e.target.value)}
                                placeholder="Örn: 2"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300"
                            />
                        </div>
                    )}

                    {/* Construction Year */}
                    {['Kiralık Daire', 'Satılık Daire', 'Kiralık Müstakil Ev', 'Satılık Müstakil Ev', 'Satılık Yazlık'].includes(subCategory) && (
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">{t.addListing.realEstate.buildYear}</label>
                            <input
                                type="number"
                                value={constructionYear}
                                onChange={(e) => setConstructionYear(e.target.value)}
                                placeholder="Örn: 1995"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300"
                            />
                        </div>
                    )}

                    {/* Tauschangebot */}
                    {['Kiralık Daire', 'Geçici Konaklama & Paylaşımlı Ev'].includes(subCategory) && (
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">{t.addListing.realEstate.exchange}</label>
                            <select
                                value={selectedTauschangebot}
                                onChange={(e) => setSelectedTauschangebot(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white"
                            >
                                <option value="">{t.productDetail.pleaseChoose}</option>
                                <option value="Ja">Evet</option>
                                <option value="Nein">Hayır</option>
                            </select>
                        </div>
                    )}

                    {/* Commission */}
                    {['Satılık Daire', 'Satılık Müstakil Ev', 'Arsa & Bahçe', 'Ticari Emlak', 'Garaj & Park Yeri', 'Satılık Yazlık'].includes(subCategory) && (
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">{t.addListing.realEstate.commission}</label>
                            <select
                                value={selectedCommission}
                                onChange={(e) => setSelectedCommission(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white"
                            >
                                <option value="">{t.productDetail.pleaseChoose}</option>
                                <option value="Provisionsfrei">Komisyonsuz</option>
                                <option value="Mit Provision">Komisyonlu</option>
                            </select>
                        </div>
                    )}

                    {subCategory === 'Garaj & Park Yeri' && (
                        <>
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">{t.addListing.realEstate.garageType}</label>
                                <select
                                    value={selectedGarageType}
                                    onChange={(e) => setSelectedGarageType(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white"
                                >
                                    <option value="">{t.productDetail.pleaseChoose}</option>
                                    <option value="Garage">Garaj</option>
                                    <option value="Außenstellplatz">Açık Otopark</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">{t.addListing.realEstate.listingType}</label>
                                <select
                                    value={selectedAngebotsart}
                                    onChange={(e) => setSelectedAngebotsart(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white"
                                >
                                    <option value="">{t.productDetail.pleaseChoose}</option>
                                    <option value="Kaufen">Satılık</option>
                                    <option value="Mieten">Kiralık</option>
                                </select>
                            </div>
                        </>
                    )}

                    {subCategory === 'Geçici Konaklama & Paylaşımlı Ev' && (
                        <>
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">{t.addListing.realEstate.stayType}</label>
                                <select
                                    value={selectedAufZeitWGArt}
                                    onChange={(e) => setSelectedAufZeitWGArt(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white"
                                >
                                    <option value="">{t.productDetail.pleaseChoose}</option>
                                    <option value="Gesamte Unterkunft">Tüm Konut</option>
                                    <option value="Privatzimmer">Özel Oda</option>
                                    <option value="Gemeinsames Zimmer">Paylaşımlı Oda</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">{t.addListing.realEstate.rentType}</label>
                                <select
                                    value={selectedRentalType}
                                    onChange={(e) => setSelectedRentalType(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white"
                                >
                                    <option value="">{t.productDetail.pleaseChoose}</option>
                                    <option value="befristet">Süreli</option>
                                    <option value="unbefristet">Süresiz</option>
                                </select>
                            </div>
                        </>
                    )}

                    {subCategory === 'Tatil Evi & Yurt Dışı Emlak' && (
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">{t.addListing.realEstate.location}</label>
                            <select
                                value={selectedLage}
                                onChange={(e) => setSelectedLage(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white"
                            >
                                <option value="">{t.productDetail.pleaseChoose}</option>
                                <option value="Inland">Yurt İçi</option>
                                <option value="Ausland">Yurt Dışı</option>
                            </select>
                        </div>
                    )}
                </div>
            )}

            {/* Features (Checkboxes) */}
            {['Kiralık Daire', 'Satılık Daire', 'Kiralık Müstakil Ev', 'Satılık Müstakil Ev', 'Geçici Konaklama & Paylaşımlı Ev', 'Tatil Evi & Yurt Dışı Emlak', 'Satılık Yazlık'].includes(subCategory) && (
                <div>
                    <label className="block text-sm text-gray-600 mb-2">{t.addListing.realEstate.amenities}</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {[
                            { val: 'Möbliert/Teilmöbliert', label: 'Mobilyalı/Kısmen Mobilyalı' },
                            { val: 'Balkon', label: 'Balkon' },
                            { val: 'Terrasse', label: 'Teras' },
                            { val: 'Einbauküche', label: 'Ankastre Mutfak' },
                            { val: 'Badewanne', label: 'Küvet' },
                            { val: 'Gäste-WC', label: 'Misafir Tuvaleti' },
                            { val: 'Stufenloser Zugang', label: 'Engelsiz Erişim' },
                            { val: 'Fußbodenheizung', label: 'Yerden Isıtma' },
                            { val: 'WLAN', label: 'Wi-Fi' },
                            { val: 'Kühlschrank', label: 'Buzdolabı' },
                            { val: 'Waschmaschine', label: 'Çamaşır Makinesi' },
                            { val: 'Spülmaschine', label: 'Bulaşık Makinesi' },
                            { val: 'TV', label: 'Televizyon' }
                        ].map(item => (
                            <label key={item.val} className="flex items-center space-x-2 text-sm text-gray-700 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={selectedAmenities.includes(item.val)}
                                    onChange={(e) => {
                                        if (e.target.checked) setSelectedAmenities([...selectedAmenities, item.val]);
                                        else setSelectedAmenities(selectedAmenities.filter(a => a !== item.val));
                                    }}
                                    className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                                />
                                <span>{item.label}</span>
                            </label>
                        ))}
                    </div>
                </div>
            )}

            {/* Commercial Amenities (Ticari Emlak & Konteyner) */}
            {['Ticari Emlak', 'Konteyner'].includes(subCategory) && (
                <div>
                    <label className="block text-sm text-gray-600 mb-2">{t.addListing.realEstate.amenities}</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {[
                            { val: 'Starkstrom', label: 'Yüksek Akım' },
                            { val: 'Klimaanlage', label: 'Klima' },
                            { val: 'DV-Verkabelung', label: 'DV Kablolama' },
                            { val: 'Parkplätze vorhanden', label: 'Otopark Mevcut' },
                            { val: 'Stufenloser Zugang', label: 'Engelsiz Erişim' },
                            { val: 'Küche', label: 'Mutfak' },
                            { val: 'Fußbodenheizung', label: 'Yerden Isıtma' }
                        ].map(item => (
                            <label key={item.val} className="flex items-center space-x-2 text-sm text-gray-700 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={selectedAmenities.includes(item.val)}
                                    onChange={(e) => {
                                        if (e.target.checked) setSelectedAmenities([...selectedAmenities, item.val]);
                                        else setSelectedAmenities(selectedAmenities.filter(a => a !== item.val));
                                    }}
                                    className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                                />
                                <span>{item.label}</span>
                            </label>
                        ))}
                    </div>
                </div>
            )}

            {/* General Features */}
            {['Kiralık Daire', 'Satılık Daire', 'Kiralık Müstakil Ev', 'Satılık Müstakil Ev', 'Geçici Konaklama & Paylaşımlı Ev', 'Tatil Evi & Yurt Dışı Emlak', 'Ticari Emlak', 'Satılık Yazlık'].includes(subCategory) && (
                <div>
                    <label className="block text-sm text-gray-600 mb-2">{t.addListing.realEstate.generalFeatures}</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {[
                            { val: 'Altbau', label: 'Eski Yapı' },
                            { val: 'Neubau', label: 'Yeni Yapı' },
                            { val: 'Aufzug', label: t.productDetail.features.elevator },
                            { val: 'Keller', label: t.productDetail.features.cellar },
                            { val: 'Dachboden', label: 'Çatı Katı' },
                            { val: 'Garage/Stellplatz', label: 'Garaj/Park Yeri' },
                            { val: 'Garten/-mitnutzung', label: t.productDetail.features.garden },
                            { val: 'Haustiere erlaubt', label: 'Evcil Hayvan İzni' },
                            { val: 'WG-geeignet', label: 'Paylaşımlı Eve Uygun' },
                            { val: 'Denkmalobjekt', label: 'Tarihi Eser/Anıt' },
                            { val: 'Aktuell vermietet', label: 'Halen Kirada' }
                        ].map(item => (
                            <label key={item.val} className="flex items-center space-x-2 text-sm text-gray-700 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={selectedGeneralFeatures.includes(item.val)}
                                    onChange={(e) => {
                                        if (e.target.checked) setSelectedGeneralFeatures([...selectedGeneralFeatures, item.val]);
                                        else setSelectedGeneralFeatures(selectedGeneralFeatures.filter(f => f !== item.val));
                                    }}
                                    className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                                />
                                <span>{item.label}</span>
                            </label>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
