import React from 'react';

export const EducationFields = ({
    subCategory,
    t,
    selectedSprachkurseArt,
    setSelectedSprachkurseArt,
    selectedKunstGestaltungArt,
    setSelectedKunstGestaltungArt
}) => {
    return (
        <div className="space-y-4">
            {/* Dil Kursları (Sprachkurse) */}
            {subCategory === 'Dil Kursları' && (
                <div className="mt-4">
                    <label className="block text-sm text-gray-600 mb-1">{t.addListing.art}</label>
                    <select
                        value={selectedSprachkurseArt}
                        onChange={(e) => setSelectedSprachkurseArt(e.target.value)}
                        required
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white text-gray-700"
                    >
                        <option value="">{t.productDetail.pleaseChoose}</option>
                        <option value="Almanca">{t.addListing.lessons.types.german}</option>
                        <option value="İngilizce">{t.addListing.lessons.types.english}</option>
                        <option value="Fransızca">{t.addListing.lessons.types.french}</option>
                        <option value="İspanyolca">{t.addListing.lessons.types.spanish}</option>
                        <option value="İtalyanca">{t.addListing.lessons.types.italian}</option>
                        <option value="Rusça">{t.addListing.lessons.types.russian}</option>
                        <option value="Diğer Diller">{t.addListing.lessons.types.otherLanguages}</option>
                    </select>
                </div>
            )}

            {/* Sanat & Tasarım Kursları (Kunst & Gestaltung) */}
            {subCategory === 'Sanat & Tasarım Kursları' && (
                <div className="mt-4">
                    <label className="block text-sm text-gray-600 mb-1">{t.addListing.art}</label>
                    <select
                        value={selectedKunstGestaltungArt}
                        onChange={(e) => setSelectedKunstGestaltungArt(e.target.value)}
                        required
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white text-gray-700"
                    >
                        <option value="">{t.productDetail.pleaseChoose}</option>
                        <option value="Resim & Çizim">{t.addListing.lessons.types.paintingDrawing}</option>
                        <option value="Fotoğrafçılık">{t.addListing.lessons.types.photography}</option>
                        <option value="Çömlekçilik & Seramik">{t.addListing.lessons.types.pottery}</option>
                        <option value="Dikiş & Tekstil">{t.addListing.lessons.types.sewing}</option>
                        <option value="Takı Tasarımı">{t.addListing.lessons.types.jewelryDesign}</option>
                        <option value="Diğer Sanat Kursları">{t.addListing.lessons.types.otherArtCourses}</option>
                    </select>
                </div>
            )}
        </div>
    );
};
