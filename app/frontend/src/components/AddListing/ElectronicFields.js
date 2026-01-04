import React from 'react';

export const ElectronicFields = ({
    subCategory,
    t,
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
    return (
        <div className="space-y-4 pt-4 border-t border-gray-200">
            {subCategory === 'Ses & Hifi' && (
                <div>
                    <label className="block text-sm text-gray-600 mb-1">{t.addListing.art}</label>
                    <select
                        value={selectedElektronikAudioHifiArt}
                        onChange={(e) => setSelectedElektronikAudioHifiArt(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white text-gray-700"
                    >
                        <option value="">{t.productDetail.pleaseChoose}</option>
                        <option value="CD Player">{t.addListing.electronics.types.cdPlayer}</option>
                        <option value="Hoparlör & Kulaklık">{t.addListing.electronics.types.speakers}</option>
                        <option value="MP3 Player">{t.addListing.electronics.types.mp3Player}</option>
                        <option value="Radyo & Alıcı">{t.addListing.electronics.types.radioReceiver}</option>
                        <option value="Müzik Setleri">{t.addListing.electronics.types.stereo}</option>
                        <option value="Diğer Ses & Hifi">{t.addListing.electronics.types.otherAudio}</option>
                    </select>
                </div>
            )}
            {subCategory === 'Cep Telefonu & Aksesuar' && (
                <div>
                    <label className="block text-sm text-gray-600 mb-1">{t.addListing.art}</label>
                    <select
                        value={selectedHandyTelefonArt}
                        onChange={(e) => setSelectedHandyTelefonArt(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white text-gray-700"
                    >
                        <option value="">{t.productDetail.pleaseChoose}</option>
                        <option value="Apple">{t.addListing.electronics.types.apple}</option>
                        <option value="Google">Google</option>
                        <option value="HTC">HTC</option>
                        <option value="Huawei">Huawei</option>
                        <option value="LG">LG</option>
                        <option value="Motorola">Motorola</option>
                        <option value="Nokia">Nokia</option>
                        <option value="Samsung">Samsung</option>
                        <option value="Siemens">Siemens</option>
                        <option value="Sony">Sony</option>
                        <option value="Xiaomi">Xiaomi</option>
                        <option value="Faks Cihazları">Faks Cihazları</option>
                        <option value="Telefonlar">Telefonlar</option>
                        <option value="Diğer Cep Telefonları & Telefonlar">{t.addListing.electronics.types.otherPhone}</option>
                    </select>
                </div>
            )}
            {subCategory === 'Fotoğraf & Kamera' && (
                <div>
                    <label className="block text-sm text-gray-600 mb-1">{t.addListing.art}</label>
                    <select
                        value={selectedFotoArt}
                        onChange={(e) => setSelectedFotoArt(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white text-gray-700"
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
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white text-gray-700"
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
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white text-gray-700"
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
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white text-gray-700"
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
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white text-gray-700"
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
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white text-gray-700"
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
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white text-gray-700"
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
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white text-gray-700"
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
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white text-gray-700"
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
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white text-gray-700"
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
