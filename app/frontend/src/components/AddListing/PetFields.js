import React from 'react';

export const PetFields = ({
    subCategory,
    t,
    selectedFischeArt,
    setSelectedFischeArt,
    selectedHundeArt,
    setSelectedHundeArt,
    selectedHundeAlter,
    setSelectedHundeAlter,
    selectedHundeGeimpft,
    setSelectedHundeGeimpft,
    selectedHundeErlaubnis,
    setSelectedHundeErlaubnis,
    selectedKatzenArt,
    setSelectedKatzenArt,
    selectedKatzenAlter,
    setSelectedKatzenAlter,
    selectedKatzenGeimpft,
    setSelectedKatzenGeimpft,
    selectedKatzenErlaubnis,
    setSelectedKatzenErlaubnis,
    selectedKleintiereArt,
    setSelectedKleintiereArt,
    selectedNutztiereArt,
    setSelectedNutztiereArt,
    selectedPferdeArt,
    setSelectedPferdeArt,
    selectedVermisstetiereStatus,
    setSelectedVermisstetiereStatus,
    selectedVoegelArt,
    setSelectedVoegelArt,
    selectedHaustierZubehoerArt,
    setSelectedHaustierZubehoerArt
}) => {
    return (
        <div className="space-y-4 pt-4 border-t border-gray-200">
            <h3 className="font-semibold text-gray-900">{t.productDetail.details}</h3>

            {/* Balıklar */}
            {subCategory === 'Balıklar' && (
                <div>
                    <label className="block text-sm text-gray-600 mb-1">{t.addListing.art}</label>
                    <select
                        value={selectedFischeArt}
                        onChange={(e) => setSelectedFischeArt(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white"
                    >
                        <option value="">{t.productDetail.pleaseChoose}</option>
                        {['Akvaryum Balıkları', 'Tatlı Su Balıkları', 'Discus Balıkları', 'Karides & Yengeç', 'Koi', 'Salyangoz', 'Su Bitkileri', 'Vatozlar', 'Diğer Balıklar'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                </div>
            )}

            {/* Köpekler */}
            {subCategory === 'Köpekler' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">{t.addListing.art}</label>
                        <select
                            value={selectedHundeArt}
                            onChange={(e) => setSelectedHundeArt(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white"
                        >
                            <option value="">{t.productDetail.pleaseChoose}</option>
                            {['Karışık', 'Beagle', 'Bernhardiner', 'Border Collie', 'Cocker Spaniel', 'Collie', 'Dackel', 'Dalmaçyalı', 'Dobermann', 'Dogge', 'Golden Retriever', 'Husky', 'Jack Russell Terrier', 'Labrador', 'Maltiz', 'Kaniş', 'Çoban Köpeği', 'Spitz', 'Terrier', 'Diğer Köpekler'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">{t.addListing.age || 'Yaş'}</label>
                        <select
                            value={selectedHundeAlter}
                            onChange={(e) => setSelectedHundeAlter(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white"
                        >
                            <option value="">{t.productDetail.pleaseChoose}</option>
                            <option value="12 aydan küçük">12 aydan küçük</option>
                            <option value="12 aylık veya daha büyük">12 aylık veya daha büyük</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">{t.addListing.pets.vaccinated}</label>
                        <select
                            value={selectedHundeGeimpft}
                            onChange={(e) => setSelectedHundeGeimpft(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white"
                        >
                            <option value="">{t.productDetail.pleaseChoose}</option>
                            <option value="Evet">{t.common?.yes || 'Evet'}</option>
                            <option value="Hayır">{t.common?.no || 'Hayır'}</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">{t.addListing.pets.permission}</label>
                        <select
                            value={selectedHundeErlaubnis}
                            onChange={(e) => setSelectedHundeErlaubnis(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white"
                        >
                            <option value="">{t.productDetail.pleaseChoose}</option>
                            <option value="Evet">{t.common?.yes || 'Evet'}</option>
                            <option value="Hayır">{t.common?.no || 'Hayır'}</option>
                        </select>
                    </div>
                </div>
            )}

            {/* Kediler */}
            {subCategory === 'Kediler' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">{t.addListing.art}</label>
                        <select
                            value={selectedKatzenArt}
                            onChange={(e) => setSelectedKatzenArt(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white"
                        >
                            <option value="">{t.productDetail.pleaseChoose}</option>
                            {['British Shorthair', 'Scottish Fold', 'British Longhair', 'Maine Coon', 'İran Kedisi', 'Ragdoll Kedisi', 'Scottish Fold Longhair', 'Sfenks Kedisi', 'Munchkin Kedisi', 'Bengal Kedisi', 'Diğer Kediler'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">{t.addListing.age || 'Yaş'}</label>
                        <select
                            value={selectedKatzenAlter}
                            onChange={(e) => setSelectedKatzenAlter(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white"
                        >
                            <option value="">{t.productDetail.pleaseChoose}</option>
                            <option value="12 aydan küçük">12 aydan küçük</option>
                            <option value="12 aylık veya daha büyük">12 aylık veya daha büyük</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">{t.addListing.pets.vaccinated}</label>
                        <select
                            value={selectedKatzenGeimpft}
                            onChange={(e) => setSelectedKatzenGeimpft(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white"
                        >
                            <option value="">{t.productDetail.pleaseChoose}</option>
                            <option value="Evet">{t.common?.yes || 'Evet'}</option>
                            <option value="Hayır">{t.common?.no || 'Hayır'}</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">{t.addListing.pets.permission}</label>
                        <select
                            value={selectedKatzenErlaubnis}
                            onChange={(e) => setSelectedKatzenErlaubnis(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white"
                        >
                            <option value="">{t.productDetail.pleaseChoose}</option>
                            <option value="Evet">{t.common?.yes || 'Evet'}</option>
                            <option value="Hayır">{t.common?.no || 'Hayır'}</option>
                        </select>
                    </div>
                </div>
            )}

            {/* Küçük Hayvanlar */}
            {subCategory === 'Küçük Hayvanlar' && (
                <div>
                    <label className="block text-sm text-gray-600 mb-1">{t.addListing.art}</label>
                    <select
                        value={selectedKleintiereArt}
                        onChange={(e) => setSelectedKleintiereArt(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white"
                    >
                        <option value="">{t.productDetail.pleaseChoose}</option>
                        {['Hamster', 'Tavşan', 'Fare & Sıçan', 'Gine Domuzu', 'Diğer Küçükbaş Hayvanlar'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                </div>
            )}

            {/* Çiftlik Hayvanları */}
            {subCategory === 'Çiftlik Hayvanları' && (
                <div>
                    <label className="block text-sm text-gray-600 mb-1">{t.addListing.art}</label>
                    <select
                        value={selectedNutztiereArt}
                        onChange={(e) => setSelectedNutztiereArt(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white"
                    >
                        <option value="">{t.productDetail.pleaseChoose}</option>
                        {['Atlar', 'Koyunlar', 'Keçiler', 'Domuzlar', 'Tavuklar', 'Kazlar & Ördekler', 'Diğer Kümes Hayvanları'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                </div>
            )}

            {/* Atlar */}
            {subCategory === 'Atlar' && (
                <div>
                    <label className="block text-sm text-gray-600 mb-1">{t.addListing.art}</label>
                    <select
                        value={selectedPferdeArt}
                        onChange={(e) => setSelectedPferdeArt(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white"
                    >
                        <option value="">{t.productDetail.pleaseChoose}</option>
                        {['Büyük Atlar', 'Küçük Atlar & Midilliler'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                </div>
            )}

            {/* Kayıp Hayvanlar */}
            {subCategory === 'Kayıp Hayvanlar' && (
                <div>
                    <label className="block text-sm text-gray-600 mb-1">{t.addListing.art}</label>
                    <select
                        value={selectedVermisstetiereStatus}
                        onChange={(e) => setSelectedVermisstetiereStatus(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white"
                    >
                        <option value="">{t.productDetail.pleaseChoose}</option>
                        <option value="Kayboldu">Kayboldu</option>
                        <option value="Bulundu">Bulundu</option>
                    </select>
                </div>
            )}

            {/* Kuşlar */}
            {subCategory === 'Kuşlar' && (
                <div>
                    <label className="block text-sm text-gray-600 mb-1">{t.addListing.art}</label>
                    <select
                        value={selectedVoegelArt}
                        onChange={(e) => setSelectedVoegelArt(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white"
                    >
                        <option value="">{t.productDetail.pleaseChoose}</option>
                        {['Muhabbet Kuşları', 'Papağanlar', 'Kanaryalar', 'Egzotik Kuşlar', 'Diğer Kuşlar'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                </div>
            )}

            {/* Aksesuarlar (Evcil Hayvan) */}
            {subCategory === 'Aksesuarlar' && (
                <div>
                    <label className="block text-sm text-gray-600 mb-1">{t.addListing.art}</label>
                    <select
                        value={selectedHaustierZubehoerArt}
                        onChange={(e) => setSelectedHaustierZubehoerArt(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white"
                    >
                        <option value="">{t.productDetail.pleaseChoose}</option>
                        {['Balıklar', 'Köpekler', 'Kediler', 'Küçükbaş Hayvanlar', 'Atlar', 'Sürüngenler', 'Kuşlar', 'Diğer Evcil Hayvan Aksesuarları'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                </div>
            )}
        </div>
    );
};
