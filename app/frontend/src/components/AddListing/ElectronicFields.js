import React, { useState } from 'react';
import { phoneBrands, getPhoneModels } from '../../data/phoneBrands';

export const ElectronicFields = ({
    subCategory,
    t,
    brand,
    setBrand,
    selectedPhoneBrand,
    setSelectedPhoneBrand,
    selectedPhoneModel,
    setSelectedPhoneModel,
    // Ses & Hifi
    selectedElektronikAudioHifiArt,
    setSelectedElektronikAudioHifiArt,
    // Cep Telefonu & Aksesuar
    selectedHandyTelefonArt,
    setSelectedHandyTelefonArt,
    // Fotoğraf & Kamera
    selectedFotoArt,
    setSelectedFotoArt,
    // Beyaz Eşya & Ev Aletleri
    selectedHaushaltsgeraeteArt,
    setSelectedHaushaltsgeraeteArt,
    // Oyun Konsolları / Konsollar
    selectedKonsolenArt,
    setSelectedKonsolenArt,
    // Bilgisayar Aksesuar & Yazılım
    selectedPCZubehoerSoftwareArt,
    setSelectedPCZubehoerSoftwareArt,
    // Tablet & E-Okuyucu
    selectedTabletsReaderArt,
    setSelectedTabletsReaderArt,
    // TV & Video
    selectedTVVideoArt,
    setSelectedTVVideoArt,
    // Dizüstü Bilgisayar
    selectedNotebooksArt,
    setSelectedNotebooksArt,
    // Masaüstü Bilgisayar
    selectedPCsArt,
    setSelectedPCsArt,
    // Video Oyunları
    selectedVideospieleArt,
    setSelectedVideospieleArt,
    // Elektronik Hizmetler
    selectedDienstleistungenElektronikArt,
    setSelectedDienstleistungenElektronikArt
}) => {
    const popularElectronicBrands = [
        'Apple', 'Samsung', 'Xiaomi', 'Huawei', 'Sony', 'LG', 'Philips',
        'Bosch', 'Siemens', 'Arçelik', 'Beko', 'Vestel', 'Profilo', 'Dyson',
        'Tefal', 'Asus', 'Lenovo', 'HP', 'Dell', 'Acer', 'MSI', 'Monster',
        'Canon', 'Nikon', 'JBL', 'Nintendo', 'Microsoft', 'Diğer'
    ];

    const [isCustomBrand, setIsCustomBrand] = useState(
        Boolean(brand && !popularElectronicBrands.filter(b => b !== 'Diğer').includes(brand))
    );

    const isPhoneCategory = subCategory === 'Cep Telefonu & Telefon' || 
                            subCategory === 'Cep Telefonu & Aksesuar' || 
                            subCategory === 'Telefon & Aksesuar';

    return (
        <div className="space-y-4 pt-4 border-t border-neutral-200 dark:border-white/10">
            {/* Phone Specific Brand & Model Selector */}
            {isPhoneCategory ? (
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-neutral-600 dark:text-neutral-400 mb-2 uppercase tracking-wider">
                                {t.addListing?.brand || 'Marka'} *
                            </label>
                            <select
                                value={selectedPhoneBrand || ''}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    if (setSelectedPhoneBrand) setSelectedPhoneBrand(val);
                                    if (setSelectedPhoneModel) setSelectedPhoneModel('');
                                    if (setSelectedHandyTelefonArt) setSelectedHandyTelefonArt(val);
                                    if (val !== 'Diğer' && setBrand) setBrand(val);
                                }}
                                className="w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl px-4 py-3 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all appearance-none"
                            >
                                <option value="">{t.productDetail?.pleaseChoose || 'Lütfen Seçiniz'}</option>
                                {phoneBrands.map((b) => (
                                    <option key={b.name} value={b.name}>{b.name}</option>
                                ))}
                                <option value="Diğer">{t.addListing?.other || 'Diğer'}</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-neutral-600 dark:text-neutral-400 mb-2 uppercase tracking-wider">
                                {t.productDetail?.model || 'Model'} *
                            </label>
                            {selectedPhoneBrand === 'Diğer' ? (
                                <input
                                    type="text"
                                    value={selectedPhoneModel || ''}
                                    onChange={(e) => setSelectedPhoneModel && setSelectedPhoneModel(e.target.value)}
                                    placeholder="Model adını yazınız (örn. Pixel 7, Magic 6...)"
                                    className="w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl px-4 py-3 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                                />
                            ) : (
                                <select
                                    value={selectedPhoneModel || ''}
                                    onChange={(e) => setSelectedPhoneModel && setSelectedPhoneModel(e.target.value)}
                                    disabled={!selectedPhoneBrand}
                                    className="w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl px-4 py-3 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all appearance-none disabled:bg-neutral-50 dark:disabled:bg-neutral-900 disabled:cursor-not-allowed"
                                >
                                    <option value="">
                                        {selectedPhoneBrand ? (t.productDetail?.pleaseChoose || 'Model Seçiniz') : 'Önce Marka Seçiniz'}
                                    </option>
                                    {selectedPhoneBrand && getPhoneModels(selectedPhoneBrand).map((m) => (
                                        <option key={m.name} value={m.name}>{m.name}</option>
                                    ))}
                                    <option value="Diğer">{t.addListing?.other || 'Diğer Model'}</option>
                                </select>
                            )}
                        </div>
                    </div>

                    {/* Custom Brand or Custom Model Inputs */}
                    {(selectedPhoneBrand === 'Diğer' || selectedPhoneModel === 'Diğer') && (
                        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/30 rounded-xl p-4 space-y-3">
                            {selectedPhoneBrand === 'Diğer' && (
                                <div>
                                    <label className="block text-sm font-semibold text-amber-900 dark:text-amber-200 mb-1">
                                        Özel Marka Adı *
                                    </label>
                                    <input
                                        type="text"
                                        value={brand || ''}
                                        onChange={(e) => setBrand && setBrand(e.target.value)}
                                        placeholder="Marka adını yazınız (örn. Nothing, POCO, Infinix, Tecno...)"
                                        className="w-full bg-white dark:bg-neutral-800 border border-amber-300 dark:border-amber-700 rounded-xl px-4 py-2.5 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                                    />
                                </div>
                            )}
                            {selectedPhoneModel === 'Diğer' && selectedPhoneBrand !== 'Diğer' && (
                                <div>
                                    <label className="block text-sm font-semibold text-amber-900 dark:text-amber-200 mb-1">
                                        Özel Model Adı *
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Model adını buraya yazınız"
                                        onChange={(e) => setSelectedPhoneModel && setSelectedPhoneModel(e.target.value)}
                                        className="w-full bg-white dark:bg-neutral-800 border border-amber-300 dark:border-amber-700 rounded-xl px-4 py-2.5 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                                    />
                                </div>
                            )}
                        </div>
                    )}
                </div>
            ) : (
                /* General Brand Selector for Other Electronics */
                <div>
                    <label className="block text-sm font-semibold text-neutral-600 dark:text-neutral-400 mb-2 uppercase tracking-wider">
                        {t.addListing?.brand || 'Marka'}
                    </label>
                    <select
                        value={isCustomBrand ? 'Diğer' : (brand || '')}
                        onChange={(e) => {
                            const val = e.target.value;
                            if (val === 'Diğer') {
                                setIsCustomBrand(true);
                                if (setBrand) setBrand('');
                            } else {
                                setIsCustomBrand(false);
                                if (setBrand) setBrand(val);
                            }
                        }}
                        className="w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl px-4 py-3 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all appearance-none"
                    >
                        <option value="">{t.productDetail?.pleaseChoose || 'Lütfen Seçiniz'}</option>
                        {popularElectronicBrands.map((b) => (
                            <option key={b} value={b}>{b}</option>
                        ))}
                    </select>

                    {isCustomBrand && (
                        <div className="mt-2">
                            <input
                                type="text"
                                placeholder="Özel marka adını yazınız (örn. Roborock, Dreame, Anker...)"
                                value={brand || ''}
                                onChange={(e) => setBrand && setBrand(e.target.value)}
                                className="w-full bg-white dark:bg-neutral-800 border border-amber-300 dark:border-amber-700 rounded-xl px-4 py-2.5 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                            />
                        </div>
                    )}
                </div>
            )}
            {subCategory === 'Fotoğraf & Kamera' && (
                <div>
                    <label className="block text-sm text-gray-600 mb-1">{t.addListing.art}</label>
                    <select
                        value={selectedFotoArt}
                        onChange={(e) => setSelectedFotoArt(e.target.value)}
                        className="w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl px-4 py-3 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all appearance-none"
                    >
                        <option value="">{t.productDetail.pleaseChoose}</option>
                        <option value="Kamera">{t.addListing.electronics.types.camera}</option>
                        <option value="Lens">{t.addListing.electronics.types.lens}</option>
                        <option value="Aksesuar">{t.addListing.electronics.types.accessory}</option>
                        <option value="Kamera & Aksesuar">Kamera & Aksesuar</option>
                        <option value="Diğer Fotoğraf & Kamera">{t.addListing.electronics.types.otherPhoto}</option>
                    </select>
                </div>
            )}
            {subCategory === 'Beyaz Eşya & Ev Aletleri' && (
                <div>
                    <label className="block text-sm text-gray-600 mb-1">{t.addListing.art}</label>
                    <select
                        value={selectedHaushaltsgeraeteArt}
                        onChange={(e) => setSelectedHaushaltsgeraeteArt(e.target.value)}
                        className="w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl px-4 py-3 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all appearance-none"
                    >
                        <option value="">{t.productDetail.pleaseChoose}</option>
                        <option value="Küçük Ev Aletleri">Küçük Ev Aletleri</option>
                        <option value="Ocak & Fırınlar">{t.addListing.electronics.types.oven}</option>
                        <option value="Kahve & Espresso Makineleri">Kahve & Espresso Makineleri</option>
                        <option value="Buzdolapları & Dondurucular">{t.addListing.electronics.types.fridge}</option>
                        <option value="Bulaşık Makineleri">{t.addListing.electronics.types.dishwasher}</option>
                        <option value="Elektrikli Süpürgeler">Elektrikli Süpürgeler</option>
                        <option value="Çamaşır & Kurutma Makineleri">{t.addListing.electronics.types.washingMachine}</option>
                        <option value="Diğer Ev Aletleri">{t.addListing.electronics.types.otherAppliance}</option>
                    </select>
                </div>
            )}
            {(subCategory === 'Oyun Konsolları' || subCategory === 'Konsollar') && (
                <div>
                    <label className="block text-sm text-gray-600 mb-1">{t.addListing.art}</label>
                    <select
                        value={selectedKonsolenArt}
                        onChange={(e) => setSelectedKonsolenArt(e.target.value)}
                        className="w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl px-4 py-3 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all appearance-none"
                    >
                        <option value="">{t.productDetail.pleaseChoose}</option>
                        <option value="El Konsolları">El Konsolları</option>
                        <option value="PlayStation">{t.addListing.electronics.types.playstation}</option>
                        <option value="Xbox">{t.addListing.electronics.types.xbox}</option>
                        <option value="Wii">{t.addListing.electronics.types.nintendo}</option>
                        <option value="Diğer Konsollar">{t.addListing.electronics.types.otherConsole}</option>
                    </select>
                </div>
            )}
            {(subCategory === 'Bilgisayar Aksesuar & Yazılım' || subCategory === 'Bilgisayar Aksesuarları & Yazılım') && (
                <div>
                    <label className="block text-sm text-gray-600 mb-1">{t.addListing.art}</label>
                    <select
                        value={selectedPCZubehoerSoftwareArt}
                        onChange={(e) => setSelectedPCZubehoerSoftwareArt(e.target.value)}
                        className="w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl px-4 py-3 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all appearance-none"
                    >
                        <option value="">{t.productDetail.pleaseChoose}</option>
                        <option value="Yazıcı & Tarayıcılar">Yazıcı & Tarayıcılar</option>
                        <option value="Sabit Sürücüler & Optik Sürücüler">Sabit Sürücüler & Optik Sürücüler</option>
                        <option value="Kasa">Kasa</option>
                        <option value="Ekran Kartları">Ekran Kartları</option>
                        <option value="Kablolar & Adaptörler">Kablolar & Adaptörler</option>
                        <option value="Anakartlar">Anakartlar</option>
                        <option value="Monitörler">Monitörler</option>
                        <option value="Multimedya">Multimedya</option>
                        <option value="Ağ & Modem">Ağ & Modem</option>
                        <option value="İşlemciler / CPU">İşlemciler / CPU</option>
                        <option value="Bellek">Bellek</option>
                        <option value="Yazılım">{t.addListing.electronics.types.software}</option>
                        <option value="Klavye & Fare">Klavye & Fare</option>
                        <option value="Diğer PC Aksesuar & Yazılım">{t.addListing.electronics.types.otherPC}</option>
                    </select>
                </div>
            )}
            {(subCategory === 'Tablet & E-Okuyucu' || subCategory === 'Tabletler & E-Okuyucular') && (
                <div>
                    <label className="block text-sm text-gray-600 mb-1">{t.addListing.art}</label>
                    <select
                        value={selectedTabletsReaderArt}
                        onChange={(e) => setSelectedTabletsReaderArt(e.target.value)}
                        className="w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl px-4 py-3 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all appearance-none"
                    >
                        <option value="">{t.productDetail.pleaseChoose}</option>
                        <option value="Apple">{t.addListing.electronics.types.ipad}</option>
                        <option value="Samsung">{t.addListing.electronics.types.tablet}</option>
                        <option value="Lenovo">Lenovo</option>
                        <option value="Huawei">Huawei</option>
                        <option value="Amazon">Amazon</option>
                        <option value="E-Kitap Okuyucu">{t.addListing.electronics.types.ereader}</option>
                        <option value="Aksesuar">{t.addListing.electronics.types.accessory}</option>
                        <option value="Diğer Tabletler & Okuyucular">{t.addListing.electronics.types.otherTablet}</option>
                    </select>
                </div>
            )}
            {subCategory === 'TV & Video' && (
                <div>
                    <label className="block text-sm text-gray-600 mb-1">{t.addListing.art}</label>
                    <select
                        value={selectedTVVideoArt}
                        onChange={(e) => setSelectedTVVideoArt(e.target.value)}
                        className="w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl px-4 py-3 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all appearance-none"
                    >
                        <option value="">{t.productDetail.pleaseChoose}</option>
                        <option value="DVD Oynatıcı & Kaydedici">{t.addListing.electronics.types.video}</option>
                        <option value="Televizyonlar">{t.addListing.electronics.types.tv}</option>
                        <option value="TV Alıcıları">TV Alıcıları</option>
                        <option value="Diğer TV & Video">{t.addListing.electronics.types.otherTV}</option>
                    </select>
                </div>
            )}
            {(subCategory === 'Dizüstü Bilgisayar' || subCategory === 'Dizüstü Bilgisayarlar') && (
                <div>
                    <label className="block text-sm text-gray-600 mb-1">{t.addListing.art}</label>
                    <select
                        value={selectedNotebooksArt}
                        onChange={(e) => setSelectedNotebooksArt(e.target.value)}
                        className="w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl px-4 py-3 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all appearance-none"
                    >
                        <option value="">{t.productDetail.pleaseChoose}</option>
                        <option value="Apple">{t.addListing.electronics.types.macbook}</option>
                        <option value="Acer">Acer</option>
                        <option value="Asus">Asus</option>
                        <option value="Dell">Dell</option>
                        <option value="HP">HP</option>
                        <option value="Lenovo">Lenovo</option>
                        <option value="Microsoft">Microsoft</option>
                        <option value="MSI">MSI</option>
                        <option value="Sony">Sony</option>
                        <option value="Toshiba">Toshiba</option>
                        <option value="Diğer Dizüstü Bilgisayarlar">{t.addListing.electronics.types.otherNotebook}</option>
                    </select>
                </div>
            )}
            {(subCategory === 'Masaüstü Bilgisayar' || subCategory === 'Bilgisayarlar') && (
                <div>
                    <label className="block text-sm text-gray-600 mb-1">{t.addListing.art}</label>
                    <select
                        value={selectedPCsArt}
                        onChange={(e) => setSelectedPCsArt(e.target.value)}
                        className="w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl px-4 py-3 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all appearance-none"
                    >
                        <option value="">{t.productDetail.pleaseChoose}</option>
                        <option value="Apple">{t.addListing.electronics.types.pc}</option>
                        <option value="Acer">Acer</option>
                        <option value="Asus">Asus</option>
                        <option value="Dell">Dell</option>
                        <option value="HP">HP</option>
                        <option value="Lenovo">Lenovo</option>
                        <option value="Medion">Medion</option>
                        <option value="MSI">MSI</option>
                        <option value="Diğer Bilgisayarlar">{t.addListing.electronics.types.otherPCDesktop}</option>
                    </select>
                </div>
            )}
            {subCategory === 'Video Oyunları' && (
                <div>
                    <label className="block text-sm text-gray-600 mb-1">{t.addListing.art}</label>
                    <select
                        value={selectedVideospieleArt}
                        onChange={(e) => setSelectedVideospieleArt(e.target.value)}
                        className="w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl px-4 py-3 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all appearance-none"
                    >
                        <option value="">{t.productDetail.pleaseChoose}</option>
                        <option value="DS(i) & PSP Oyunları">DS(i) & PSP Oyunları</option>
                        <option value="Nintendo Oyunları">Nintendo Oyunları</option>
                        <option value="PlayStation Oyunları">PlayStation Oyunları</option>
                        <option value="Xbox Oyunları">Xbox Oyunları</option>
                        <option value="Wii Oyunları">Wii Oyunları</option>
                        <option value="PC Oyunları">PC Oyunları</option>
                        <option value="Diğer Video Oyunları">{t.addListing.electronics.types.videogame}</option>
                    </select>
                </div>
            )}
            {(subCategory === 'Dienstleistungen Elektronik' || subCategory === 'Elektronik Hizmetler' || subCategory === 'Elektronik Servisler') && (
                <div>
                    <label className="block text-sm text-gray-600 mb-1">{t.addListing.art}</label>
                    <select
                        value={selectedDienstleistungenElektronikArt}
                        onChange={(e) => setSelectedDienstleistungenElektronikArt(e.target.value)}
                        className="w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl px-4 py-3 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all appearance-none"
                    >
                        <option value="">{t.productDetail.pleaseChoose}</option>
                        <option value="Onarım">{t.addListing.electronics.types.repair}</option>
                        <option value="Kurulum">{t.addListing.electronics.types.installation}</option>
                        <option value="Diğer Hizmetler">{t.addListing.electronics.types.otherService}</option>
                    </select>
                </div>
            )}
        </div>
    );
};
