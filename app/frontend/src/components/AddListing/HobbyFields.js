import React from 'react';

export const HobbyFields = ({
    subCategory,
    category,
    t,
    selectedSammelnArt,
    setSelectedSammelnArt,
    selectedSportCampingArt,
    setSelectedSportCampingArt,
    selectedModellbauArt,
    setSelectedModellbauArt,
    selectedHandarbeitArt,
    setSelectedHandarbeitArt,
    selectedKuenstlerMusikerArt,
    setSelectedKuenstlerMusikerArt,
    selectedReiseEventservicesArt,
    setSelectedReiseEventservicesArt,
    selectedBuecherZeitschriftenArt,
    setSelectedBuecherZeitschriftenArt
}) => {
    return (
        <div className="space-y-4">
            {/* Koleksiyon (Sammeln) */}
            {category === 'Eğlence, Hobi & Mahalle' && subCategory === 'Koleksiyon' && (
                <div className="mt-4">
                    <label className="block text-sm text-gray-600 mb-1">{t.addListing.art}</label>
                    <select
                        value={selectedSammelnArt}
                        onChange={(e) => setSelectedSammelnArt(e.target.value)}
                        required
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white text-gray-700"
                    >
                        <option value="">{t.productDetail.pleaseChoose}</option>
                        <option value="Kartpostal">{t.addListing.hobbies.types.postcard}</option>
                        <option value="Otograf">{t.addListing.hobbies.types.autograph}</option>
                        <option value="Bira Bardağı">{t.addListing.hobbies.types.beerGlass}</option>
                        <option value="Posta Pulu">{t.addListing.hobbies.types.stamp}</option>
                        <option value="Çizgi Roman">{t.addListing.hobbies.types.comic}</option>
                        <option value="Bayrak">{t.addListing.hobbies.types.flag}</option>
                        <option value="Madeni Para">{t.addListing.hobbies.types.coin}</option>
                        <option value="Porselen">{t.addListing.hobbies.types.porcelain}</option>
                        <option value="Bebek & Bebek Aksesuar">{t.addListing.hobbies.types.doll}</option>
                        <option value="Çıkartma & Sticker">{t.addListing.hobbies.types.sticker}</option>
                        <option value="Koleksiyon Kart Oyunları">{t.addListing.hobbies.types.cardGames}</option>
                        <option value="Sürpriz Yumurta">{t.addListing.hobbies.types.surpriseEgg}</option>
                        <option value="Promosyon Ürünleri">{t.addListing.hobbies.types.promo}</option>
                        <option value="Diğer Koleksiyonlar">{t.addListing.hobbies.types.otherCollection}</option>
                    </select>
                </div>
            )}

            {/* Sport & Camping */}
            {category === 'Eğlence, Hobi & Mahalle' && subCategory === 'Spor & Kamp' && (
                <div className="mt-4">
                    <label className="block text-sm text-gray-600 mb-1">{t.addListing.art}</label>
                    <select
                        value={selectedSportCampingArt}
                        onChange={(e) => setSelectedSportCampingArt(e.target.value)}
                        required
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white text-gray-700"
                    >
                        <option value="">{t.productDetail.pleaseChoose}</option>
                        <option value="Top Sporları">{t.addListing.hobbies.types.ballSports}</option>
                        <option value="Kamp & Outdoor">{t.addListing.hobbies.types.camping}</option>
                        <option value="Fitness">{t.addListing.hobbies.types.fitness}</option>
                        <option value="Bisiklet Sporu">{t.addListing.hobbies.types.cycling}</option>
                        <option value="Dans & Koşu">{t.addListing.hobbies.types.danceRun}</option>
                        <option value="Su Sporları">{t.addListing.hobbies.types.waterSports}</option>
                        <option value="Kış Sporları">{t.addListing.hobbies.types.winterSports}</option>
                        <option value="Diğer Spor & Kamp">{t.addListing.hobbies.types.otherSport}</option>
                    </select>
                </div>
            )}

            {/* Modellbau */}
            {category === 'Eğlence, Hobi & Mahalle' && subCategory === 'Model Yapımı' && (
                <div className="mt-4">
                    <label className="block text-sm text-gray-600 mb-1">{t.addListing.art}</label>
                    <select
                        value={selectedModellbauArt}
                        onChange={(e) => setSelectedModellbauArt(e.target.value)}
                        required
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white text-gray-700"
                    >
                        <option value="">{t.productDetail.pleaseChoose}</option>
                        <option value="Model Arabalar">{t.addListing.hobbies.types.modelCars}</option>
                        <option value="Model Tren">{t.addListing.hobbies.types.modelTrain}</option>
                        <option value="RC Model Yapımı">{t.addListing.hobbies.types.rcModel}</option>
                        <option value="Statik Modeller">{t.addListing.hobbies.types.staticModel}</option>
                        <option value="Alet & Aksesuar">{t.addListing.hobbies.types.toolAccessory}</option>
                        <option value="Diğer">{t.addListing.hobbies.types.otherModel}</option>
                    </select>
                </div>
            )}

            {/* El Sanatları & Hobi (Handarbeit) */}
            {category === 'Eğlence, Hobi & Mahalle' && subCategory === 'El Sanatları & Hobi' && (
                <div className="mt-4">
                    <label className="block text-sm text-gray-600 mb-1">{t.addListing.art}</label>
                    <select
                        value={selectedHandarbeitArt}
                        onChange={(e) => setSelectedHandarbeitArt(e.target.value)}
                        required
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white text-gray-700"
                    >
                        <option value="">{t.productDetail.pleaseChoose}</option>
                        <option value="Kumaş & Dikiş">{t.addListing.hobbies.types.fabricSewing}</option>
                        <option value="Örgü & Tığ İşi">{t.addListing.hobbies.types.knitting}</option>
                        <option value="Resim & Çizim">{t.addListing.hobbies.types.paintingDrawing}</option>
                        <option value="Boncuk & Takı">{t.addListing.hobbies.types.beadsJewelry}</option>
                        <option value="El Sanatları">{t.addListing.hobbies.types.handicraft}</option>
                        <option value="Alet">{t.addListing.hobbies.types.tool}</option>
                        <option value="Diğer">{t.addListing.hobbies.types.otherCraft}</option>
                    </select>
                </div>
            )}

            {/* Sanatçılar & Müzisyenler */}
            {subCategory === 'Sanatçılar & Müzisyenler' && (
                <div className="mt-4">
                    <label className="block text-sm text-gray-600 mb-1">{t.addListing.art}</label>
                    <select
                        value={selectedKuenstlerMusikerArt}
                        onChange={(e) => setSelectedKuenstlerMusikerArt(e.target.value)}
                        required
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white text-gray-700"
                    >
                        <option value="">{t.productDetail.pleaseChoose}</option>
                        <option value="Ressam & Heykeltıraş">{t.addListing.hobbies.types.artistSculptor}</option>
                        <option value="Müzisyen & Grup">{t.addListing.hobbies.types.musicianBand}</option>
                        <option value="Şarkıcı">{t.addListing.hobbies.types.singer}</option>
                        <option value="Oyuncu">{t.addListing.hobbies.types.actor}</option>
                        <option value="Dansçı">{t.addListing.hobbies.types.dancer}</option>
                        <option value="Ders">{t.addListing.hobbies.types.lesson}</option>
                        <option value="Diğer Sanat dalları">{t.addListing.hobbies.types.otherArt}</option>
                    </select>
                </div>
            )}

            {/* Seyahat & Etkinlik Hizmetleri */}
            {category === 'Eğlence, Hobi & Mahalle' && subCategory === 'Seyahat & Etkinlik Hizmetleri' && (
                <div className="mt-4">
                    <label className="block text-sm text-gray-600 mb-1">{t.addListing.art}</label>
                    <select
                        value={selectedReiseEventservicesArt}
                        onChange={(e) => setSelectedReiseEventservicesArt(e.target.value)}
                        required
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white text-gray-700"
                    >
                        <option value="">{t.productDetail.pleaseChoose}</option>
                        <option value="Seyahat Teklifleri">{t.addListing.hobbies.types.travelOffers}</option>
                        <option value="Etkinlikler & Biletler">{t.addListing.hobbies.types.eventsTickets}</option>
                        <option value="Kiralama">{t.addListing.hobbies.types.rental}</option>
                        <option value="Servis Personeli">{t.addListing.hobbies.types.serviceStaff}</option>
                        <option value="Diğer">{t.addListing.hobbies.types.otherTravel}</option>
                    </select>
                </div>
            )}

            {/* Kitap & Dergi */}
            {category && category.includes('Müzik, Film & Kitap') &&
                subCategory && subCategory.includes('Kitap & Dergi') && (
                    <div className="mt-4">
                        <label className="block text-sm text-gray-600 mb-1">{t.addListing.art}</label>
                        <select
                            value={selectedBuecherZeitschriftenArt}
                            onChange={(e) => setSelectedBuecherZeitschriftenArt(e.target.value)}
                            required
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white text-gray-700"
                        >
                            <option value="">{t.productDetail.pleaseChoose}</option>
                            <option value="Antika Kitaplar">{t.addListing.musicFilmBooks.types.antiqueBooks}</option>
                            <option value="Çocuk Kitapları">{t.addListing.musicFilmBooks.types.childrensBooks}</option>
                            <option value="Polisiye & Gerilim">{t.addListing.musicFilmBooks.types.mystery}</option>
                            <option value="Sanat & Kültür">{t.addListing.musicFilmBooks.types.artCulture}</option>
                            <option value="Kurgu Dışı">{t.addListing.musicFilmBooks.types.nonFiction}</option>
                            <option value="Bilim Kurgu">{t.addListing.musicFilmBooks.types.sciFi}</option>
                            <option value="Edebiyat">{t.addListing.musicFilmBooks.types.literature}</option>
                            <option value="Klasik Edebiyat">{t.addListing.musicFilmBooks.types.classicLiterature}</option>
                            <option value="Dergiler">{t.addListing.musicFilmBooks.types.magazines}</option>
                            <option value="Diğer Kitap & Dergiler">{t.addListing.musicFilmBooks.types.otherBooks}</option>
                        </select>
                    </div>
                )}
        </div>
    );
};
