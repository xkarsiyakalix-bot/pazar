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
    selectedSocialCareType,
    setSelectedSocialCareType,
    selectedConstructionType,
    setSelectedConstructionType,
    selectedOfficeType,
    setSelectedOfficeType,
    selectedGastronomyType,
    setSelectedGastronomyType,
    selectedTransportType,
    setSelectedTransportType,
    selectedSalesType,
    setSelectedSalesType,
    selectedOtherJobsType,
    setSelectedOtherJobsType
}) => {
    const isJobCategory = category === 'İş İlanları';

    return (
        <div className="space-y-4">
            {/* Alt Kategorilere Göre Tür Seçimi */}
            {subCategory === 'Sosyal Sektör & Bakım' && (
                <div className="mt-4">
                    <label className="block text-sm font-semibold text-neutral-600 dark:text-neutral-400 mb-2 uppercase tracking-wider">{t.addListing.art}</label>
                    <select
                        value={selectedSocialCareType}
                        onChange={(e) => setSelectedSocialCareType(e.target.value)}
                        className="w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl px-4 py-3 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all appearance-none"
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
                    <label className="block text-sm font-semibold text-neutral-600 dark:text-neutral-400 mb-2 uppercase tracking-wider">{t.addListing.art}</label>
                    <select
                        value={selectedConstructionType}
                        onChange={(e) => setSelectedConstructionType(e.target.value)}
                        required
                        className="w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl px-4 py-3 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all appearance-none"
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
                    <label className="block text-sm font-semibold text-neutral-600 dark:text-neutral-400 mb-2 uppercase tracking-wider">{t.addListing.art}</label>
                    <select
                        value={selectedOfficeType}
                        onChange={(e) => setSelectedOfficeType(e.target.value)}
                        required
                        className="w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl px-4 py-3 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all appearance-none"
                    >
                        <option value="">{t.productDetail.pleaseChoose}</option>
                        {[
                            { val: 'Muhasebeci', label: t.addListing.jobs.categories.office.accountant },
                            { val: 'Büro Memuru', label: t.addListing.jobs.categories.office.clerk },
                            { val: 'İdari İşler', label: t.addListing.jobs.categories.office.admin },
                            { val: 'Sekreter', label: t.addListing.jobs.categories.office.secretary },
                            { val: 'Diğer Meslekler', label: t.addListing.jobs.categories.office.other }
                        ].map(item => <option key={item.val} value={item.val}>{item.label}</option>)}
                    </select>
                </div>
            )}

            {subCategory === 'Gastronomi & Turizm' && (
                <div className="mt-4">
                    <label className="block text-sm font-semibold text-neutral-600 dark:text-neutral-400 mb-2 uppercase tracking-wider">{t.addListing.art}</label>
                    <select
                        value={selectedGastronomyType}
                        onChange={(e) => setSelectedGastronomyType(e.target.value)}
                        required
                        className="w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl px-4 py-3 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all appearance-none"
                    >
                        <option value="">{t.productDetail.pleaseChoose}</option>
                        {[
                            { val: 'Barmen/Barmaid', label: t.addListing.jobs.categories.gastronomy.barkeeper },
                            { val: 'Otel Elemanı', label: t.addListing.jobs.categories.gastronomy.hotel },
                            { val: 'Garson', label: t.addListing.jobs.categories.gastronomy.waiter },
                            { val: 'Aşçı', label: t.addListing.jobs.categories.gastronomy.cook },
                            { val: 'Mutfak Yardımcısı', label: t.addListing.jobs.categories.gastronomy.kitchen },
                            { val: 'Servis Elamanı', label: t.addListing.jobs.categories.gastronomy.service },
                            { val: 'Kat Hizmetleri', label: t.addListing.jobs.categories.gastronomy.housekeeping },
                            { val: 'Diğer Meslekler', label: t.addListing.jobs.categories.gastronomy.other }
                        ].map(item => <option key={item.val} value={item.val}>{item.label}</option>)}
                    </select>
                </div>
            )}

            {subCategory === 'Nakliye, Lojistik & Trafik' && (
                <div className="mt-4">
                    <label className="block text-sm font-semibold text-neutral-600 dark:text-neutral-400 mb-2 uppercase tracking-wider">{t.addListing.art}</label>
                    <select
                        value={selectedTransportType}
                        onChange={(e) => setSelectedTransportType(e.target.value)}
                        required
                        className="w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl px-4 py-3 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all appearance-none"
                    >
                        <option value="">{t.productDetail.pleaseChoose}</option>
                        {[
                            { val: 'Şoför', label: t.addListing.jobs.categories.transport.driver },
                            { val: 'Kurye', label: t.addListing.jobs.categories.transport.courier },
                            { val: 'Depo Yardımcısı', label: t.addListing.jobs.categories.transport.warehouse },
                            { val: 'Forklift Operatörü', label: t.addListing.jobs.categories.transport.forklift },
                            { val: 'Diğer Meslekler', label: t.addListing.jobs.categories.transport.other }
                        ].map(item => <option key={item.val} value={item.val}>{item.label}</option>)}
                    </select>
                </div>
            )}

            {subCategory === 'Satış, Satın Alma & Pazarlama' && (
                <div className="mt-4">
                    <label className="block text-sm font-semibold text-neutral-600 dark:text-neutral-400 mb-2 uppercase tracking-wider">{t.addListing.art}</label>
                    <select
                        value={selectedSalesType}
                        onChange={(e) => setSelectedSalesType(e.target.value)}
                        required
                        className="w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl px-4 py-3 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all appearance-none"
                    >
                        <option value="">{t.productDetail.pleaseChoose}</option>
                        {[
                            { val: 'Muhasebeci', label: t.addListing.jobs.categories.sales.accountant },
                            { val: 'Emlak Danışmanı', label: t.addListing.jobs.categories.sales.realEstate },
                            { val: 'Tüccar', label: t.addListing.jobs.categories.sales.merchant },
                            { val: 'Satış Temsilcisi', label: t.addListing.jobs.categories.sales.sales },
                            { val: 'Diğer Meslekler', label: t.addListing.jobs.categories.sales.other }
                        ].map(item => <option key={item.val} value={item.val}>{item.label}</option>)}
                    </select>
                </div>
            )}

            {subCategory === 'Diğer İşler' && (
                <div className="mt-4">
                    <label className="block text-sm font-semibold text-neutral-600 dark:text-neutral-400 mb-2 uppercase tracking-wider">{t.addListing.art}</label>
                    <select
                        value={selectedOtherJobsType}
                        onChange={(e) => setSelectedOtherJobsType(e.target.value)}
                        required
                        className="w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl px-4 py-3 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all appearance-none"
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
                <div className="space-y-4 pt-4 border-t border-neutral-200 dark:border-white/10">
                    <h3 className="text-xl font-extrabold text-neutral-900 dark:text-neutral-50 mb-6 flex items-center gap-3">{t.addListing.jobs.title}</h3>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-neutral-600 dark:text-neutral-400 mb-2 uppercase tracking-wider">{t.addListing.jobs.type}</label>
                            <select
                                value={jobType}
                                onChange={(e) => setJobType(e.target.value)}
                                className="w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl px-4 py-3 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all appearance-none"
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
                            <label className="block text-sm font-semibold text-neutral-600 dark:text-neutral-400 mb-2 uppercase tracking-wider">{t.addListing.jobs.workingTime}</label>
                            <select
                                value={workingTime}
                                onChange={(e) => setWorkingTime(e.target.value)}
                                className="w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl px-4 py-3 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all appearance-none"
                            >
                                <option value="">{t.productDetail.pleaseChoose}</option>
                                <option value="Tam Zamanlı">{t.addListing.jobs.types.fullTime}</option>
                                <option value="Yarı Zamanlı">{t.addListing.jobs.types.partTime}</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-neutral-600 dark:text-neutral-400 mb-2 uppercase tracking-wider">{t.addListing.jobs.hourlyWage}</label>
                            <input
                                type="number"
                                value={hourlyWage}
                                onChange={(e) => setHourlyWage(e.target.value)}
                                step="0.01"
                                placeholder={t.addListing.jobs.hourlyWagePlaceholder}
                                className="w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl px-4 py-3 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
