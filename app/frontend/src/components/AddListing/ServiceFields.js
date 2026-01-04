import React from 'react';

export const ServiceFields = ({
    subCategory,
    category,
    t,
    selectedTierbetreuungTrainingArt,
    setSelectedTierbetreuungTrainingArt,
    selectedAltenpflegeArt,
    setSelectedAltenpflegeArt
}) => {
    return (
        <div className="space-y-4">
            {/* Evcil Hayvan Bakımı & Eğitim */}
            {category === 'Hizmetler' && subCategory === 'Evcil Hayvan Bakımı & Eğitim' && (
                <div className="mt-4">
                    <label className="block text-sm text-gray-600 mb-1">{t.addListing.art}</label>
                    <select
                        value={selectedTierbetreuungTrainingArt}
                        onChange={(e) => setSelectedTierbetreuungTrainingArt(e.target.value)}
                        required
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white text-gray-700"
                    >
                        <option value="">{t.productDetail.pleaseChoose}</option>
                        <option value="Bakım">{t.addListing.services.types.care}</option>
                        <option value="Eğitim">{t.addListing.services.types.training}</option>
                        <option value="Temizlik">{t.addListing.services.types.cleaning}</option>
                        <option value="Gezdirme">{t.addListing.services.types.walking}</option>
                        <option value="Diğer">{t.addListing.services.types.other}</option>
                    </select>
                </div>
            )}

            {/* Yaşlı Bakımı (Altenpflege) */}
            {subCategory === 'Yaşlı Bakımı' && (
                <div className="mt-4">
                    <label className="block text-sm text-gray-600 mb-1">{t.addListing.art}</label>
                    <select
                        value={selectedAltenpflegeArt}
                        onChange={(e) => setSelectedAltenpflegeArt(e.target.value)}
                        required
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white text-gray-700"
                    >
                        <option value="">{t.productDetail.pleaseChoose}</option>
                        <option value="24 Saat Bakım">{t.addListing.services.types.twentyFourHourCare}</option>
                        <option value="Saatlik Bakım">{t.addListing.services.types.hourlyCare}</option>
                        <option value="Kısa Süreli Bakım">{t.addListing.services.types.shortTermCare}</option>
                        <option value="Refakat & Günlük Yardım">{t.addListing.services.types.companion}</option>
                        <option value="Diğer Bakım Hizmetleri">{t.addListing.services.types.otherCare}</option>
                    </select>
                </div>
            )}
        </div>
    );
};
