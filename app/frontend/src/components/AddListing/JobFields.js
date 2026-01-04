import React from 'react';

export const JobFields = ({
    subCategory,
    category,
    t,
    jobType,
    setJobType,
    workingTime,
    setWorkingTime,
    hourlyWage,
    setHourlyWage,
    selectedSozialerSektorPflegeArt,
    setSelectedSozialerSektorPflegeArt,
    selectedBauHandwerkProduktionArt,
    setSelectedBauHandwerkProduktionArt,
    selectedBueroArbeitVerwaltungArt,
    setSelectedBueroArbeitVerwaltungArt,
    selectedGastronomieTourismusArt,
    setSelectedGastronomieTourismusArt,
    selectedTransportLogistikVerkehrArt,
    setSelectedTransportLogistikVerkehrArt,
    selectedVertriebEinkaufVerkaufArt,
    setSelectedVertriebEinkaufVerkaufArt,
    selectedWeitereJobsArt,
    setSelectedWeitereJobsArt
}) => {
    const isJobCategory = category === 'İş İlanları';

    return (
        <div className="space-y-4">
            {/* Alt Kategorilere Göre Tür Seçimi */}
            {subCategory === 'Sosyal Sektör & Bakım' && (
                <div className="mt-4">
                    <label className="block text-sm text-gray-600 mb-1">{t.addListing.art}</label>
                    <select
                        value={selectedSozialerSektorPflegeArt}
                        onChange={(e) => setSelectedSozialerSektorPflegeArt(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white text-gray-700"
                    >
                        <option value="">{t.productDetail.pleaseChoose}</option>
                        {[
                            { val: 'Yaşlı Bakıcısı', label: t.addListing.jobs.categories.social.elderlyCare },
                            { val: 'Doktor Yardımcısı', label: t.addListing.jobs.categories.social.medicalAsst },
                            { val: 'Eğitmen', label: t.addListing.jobs.categories.social.educator },
                            { val: 'Hemşire', label: t.addListing.jobs.categories.social.nurse },
                            { val: 'Fizyoterapist', label: t.addListing.jobs.categories.social.physio },
                            { val: 'Diğer Meslekler', label: t.addListing.jobs.categories.social.other }
                        ].map(item => <option key={item.val} value={item.val}>{item.label}</option>)}
                    </select>
                </div>
            )}

            {subCategory === 'İnşaat, Zanaat & Üretim' && (
                <div className="mt-4">
                    <label className="block text-sm text-gray-600 mb-1">{t.addListing.art}</label>
                    <select
                        value={selectedBauHandwerkProduktionArt}
                        onChange={(e) => setSelectedBauHandwerkProduktionArt(e.target.value)}
                        required
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white text-gray-700"
                    >
                        <option value="">{t.productDetail.pleaseChoose}</option>
                        {[
                            { val: 'İnşaat Yardımcısı', label: t.addListing.jobs.categories.construction.helper },
                            { val: 'Çatı Ustası', label: t.addListing.jobs.categories.construction.roofer },
                            { val: 'Elektrikçi', label: t.addListing.jobs.categories.construction.electrician },
                            { val: 'Fayans Ustası', label: t.addListing.jobs.categories.construction.tiler },
                            { val: 'Boyacı', label: t.addListing.jobs.categories.construction.painter },
                            { val: 'Duvar Ustası', label: t.addListing.jobs.categories.construction.mason },
                            { val: 'Üretim Yardımcısı', label: t.addListing.jobs.categories.construction.production },
                            { val: 'Çilingir', label: t.addListing.jobs.categories.construction.locksmith },
                            { val: 'Marangoz', label: t.addListing.jobs.categories.construction.carpenter },
                            { val: 'Diğer Meslekler', label: t.addListing.jobs.categories.construction.other }
                        ].map(item => <option key={item.val} value={item.val}>{item.label}</option>)}
                    </select>
                </div>
            )}

            {subCategory === 'Ofis İşleri & Yönetim' && (
                <div className="mt-4">
                    <label className="block text-sm text-gray-600 mb-1">{t.addListing.art}</label>
                    <select
                        value={selectedBueroArbeitVerwaltungArt}
                        onChange={(e) => setSelectedBueroArbeitVerwaltungArt(e.target.value)}
                        required
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white text-gray-700"
                    >
                        <option value="">{t.productDetail.pleaseChoose}</option>
                        {[
                            { val: 'Buchhalter/-in', label: t.addListing.jobs.categories.office.accountant },
                            { val: 'Bürokaufmann/-frau', label: t.addListing.jobs.categories.office.clerk },
                            { val: 'Sachbearbeiter/-in', label: t.addListing.jobs.categories.office.admin },
                            { val: 'Sekretär/-in', label: t.addListing.jobs.categories.office.secretary },
                            { val: 'Weitere Berufe', label: t.addListing.jobs.categories.office.other }
                        ].map(item => <option key={item.val} value={item.val}>{item.label}</option>)}
                    </select>
                </div>
            )}

            {subCategory === 'Gastronomi & Turizm' && (
                <div className="mt-4">
                    <label className="block text-sm text-gray-600 mb-1">{t.addListing.art}</label>
                    <select
                        value={selectedGastronomieTourismusArt}
                        onChange={(e) => setSelectedGastronomieTourismusArt(e.target.value)}
                        required
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white text-gray-700"
                    >
                        <option value="">{t.productDetail.pleaseChoose}</option>
                        {[
                            { val: 'Barkeeper/-in', label: t.addListing.jobs.categories.gastronomy.barkeeper },
                            { val: 'Hotelfachmann/-frau', label: t.addListing.jobs.categories.gastronomy.hotel },
                            { val: 'Kellner/-in', label: t.addListing.jobs.categories.gastronomy.waiter },
                            { val: 'Koch/Köchin', label: t.addListing.jobs.categories.gastronomy.cook },
                            { val: 'Küchenhilfe', label: t.addListing.jobs.categories.gastronomy.kitchen },
                            { val: 'Servicekraft', label: t.addListing.jobs.categories.gastronomy.service },
                            { val: 'Housekeeping', label: t.addListing.jobs.categories.gastronomy.housekeeping },
                            { val: 'Weitere Berufe', label: t.addListing.jobs.categories.gastronomy.other }
                        ].map(item => <option key={item.val} value={item.val}>{item.label}</option>)}
                    </select>
                </div>
            )}

            {subCategory === 'Nakliye, Lojistik & Trafik' && (
                <div className="mt-4">
                    <label className="block text-sm text-gray-600 mb-1">{t.addListing.art}</label>
                    <select
                        value={selectedTransportLogistikVerkehrArt}
                        onChange={(e) => setSelectedTransportLogistikVerkehrArt(e.target.value)}
                        required
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white text-gray-700"
                    >
                        <option value="">{t.productDetail.pleaseChoose}</option>
                        {[
                            { val: 'Kraftfahrer/-in', label: t.addListing.jobs.categories.transport.driver },
                            { val: 'Kurierfahrer/-in', label: t.addListing.jobs.categories.transport.courier },
                            { val: 'Lagerhelfer/-in', label: t.addListing.jobs.categories.transport.warehouse },
                            { val: 'Staplerfahrer/-in', label: t.addListing.jobs.categories.transport.forklift },
                            { val: 'Weitere Berufe', label: t.addListing.jobs.categories.transport.other }
                        ].map(item => <option key={item.val} value={item.val}>{item.label}</option>)}
                    </select>
                </div>
            )}

            {subCategory === 'Satış, Satın Alma & Pazarlama' && (
                <div className="mt-4">
                    <label className="block text-sm text-gray-600 mb-1">{t.addListing.art}</label>
                    <select
                        value={selectedVertriebEinkaufVerkaufArt}
                        onChange={(e) => setSelectedVertriebEinkaufVerkaufArt(e.target.value)}
                        required
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white text-gray-700"
                    >
                        <option value="">{t.productDetail.pleaseChoose}</option>
                        {[
                            { val: 'Buchhalter/-in', label: t.addListing.jobs.categories.sales.accountant },
                            { val: 'Immobilienmakler/-in', label: t.addListing.jobs.categories.sales.realEstate },
                            { val: 'Kaufmann/-frau', label: t.addListing.jobs.categories.sales.merchant },
                            { val: 'Verkäufer/-in', label: t.addListing.jobs.categories.sales.sales },
                            { val: 'Weitere Berufe', label: t.addListing.jobs.categories.sales.other }
                        ].map(item => <option key={item.val} value={item.val}>{item.label}</option>)}
                    </select>
                </div>
            )}

            {subCategory === 'Diğer İşler' && (
                <div className="mt-4">
                    <label className="block text-sm text-gray-600 mb-1">{t.addListing.art}</label>
                    <select
                        value={selectedWeitereJobsArt}
                        onChange={(e) => setSelectedWeitereJobsArt(e.target.value)}
                        required
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white text-gray-700"
                    >
                        <option value="">{t.productDetail.pleaseChoose}</option>
                        {[
                            { val: 'Tasarımcı & Grafiker', label: t.addListing.jobs.categories.other.designer },
                            { val: 'Kuaför', label: t.addListing.jobs.categories.other.hairdresser },
                            { val: 'Ev Yardımcısı', label: t.addListing.jobs.categories.other.householdHelp },
                            { val: 'Apartman Görevlisi', label: t.addListing.jobs.categories.other.janitor },
                            { val: 'Temizlik Elemanı', label: t.addListing.jobs.categories.other.cleaner },
                            { val: 'Diğer Meslekler', label: t.addListing.jobs.categories.other.other }
                        ].map(item => <option key={item.val} value={item.val}>{item.label}</option>)}
                    </select>
                </div>
            )}

            {/* Genel İş Alanları */}
            {isJobCategory && (
                <div className="space-y-4 pt-4 border-t border-gray-200">
                    <h3 className="font-semibold text-gray-900">{t.addListing.jobs.title}</h3>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">{t.addListing.jobs.type}</label>
                            <select
                                value={jobType}
                                onChange={(e) => setJobType(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white"
                            >
                                <option value="">{t.productDetail.pleaseChoose}</option>
                                <option value="Tam Zamanlı">{t.addListing.jobs.types.fullTime}</option>
                                <option value="Yarı Zamanlı">{t.addListing.jobs.types.partTime}</option>
                                <option value="Ek İş (Minijob)">{t.addListing.jobs.types.minijob}</option>
                                <option value="Staj">{t.addListing.jobs.types.internship}</option>
                                <option value="Öğrenci Çalışan">{t.addListing.jobs.types.student}</option>
                                <option value="Serbest Zamanlı">{t.addListing.jobs.types.freelance}</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">{t.addListing.jobs.workingTime}</label>
                            <select
                                value={workingTime}
                                onChange={(e) => setWorkingTime(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white"
                            >
                                <option value="">{t.productDetail.pleaseChoose}</option>
                                <option value="Tam Zamanlı">{t.addListing.jobs.types.fullTime}</option>
                                <option value="Yarı Zamanlı">{t.addListing.jobs.types.partTime}</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">{t.addListing.jobs.hourlyWage}</label>
                            <input
                                type="number"
                                value={hourlyWage}
                                onChange={(e) => setHourlyWage(e.target.value)}
                                step="0.01"
                                placeholder={t.addListing.jobs.hourlyWagePlaceholder}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
