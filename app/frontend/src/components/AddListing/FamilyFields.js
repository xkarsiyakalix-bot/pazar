import React from 'react';

export const FamilyFields = ({
    subCategory,
    t,
    babyKinderkleidungArt,
    setBabyKinderkleidungArt,
    babyKinderkleidungSize,
    setBabyKinderkleidungSize,
    babyKinderkleidungGender,
    setBabyKinderkleidungGender,
    babyKinderkleidungColor,
    setBabyKinderkleidungColor,
    babyKinderschuheArt,
    setBabyKinderschuheArt,
    babyKinderschuheSize,
    setBabyKinderschuheSize,
    babyKinderschuheColor,
    setBabyKinderschuheColor,
    kinderwagenBuggysArt,
    setKinderwagenBuggysArt,
    kinderwagenBuggysColor,
    setKinderwagenBuggysColor,
    babyschalenKindersitzeColor,
    setBabyschalenKindersitzeColor,
    selectedKinderzimmermobelArt,
    setSelectedKinderzimmermobelArt,
    selectedSpielzeugArt,
    setSelectedSpielzeugArt
}) => {
    return (
        <div className="space-y-4 pt-4 border-t border-gray-200">
            <h3 className="font-semibold text-gray-900">{t.productDetail.details}</h3>

            {/* Bebek & Çocuk Giyimi */}
            {subCategory === 'Bebek & Çocuk Giyimi' && (
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">{t.addListing.art}</label>
                        <select
                            value={babyKinderkleidungArt}
                            onChange={(e) => setBabyKinderkleidungArt(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white"
                        >
                            <option value="">{t.productDetail.pleaseChoose}</option>
                            {[
                                { val: 'Pantolon & Kot', label: t.addListing.family.clothing.pants },
                                { val: 'Elbise & Etek', label: t.addListing.family.clothing.dress },
                                { val: 'Tişört & Üst', label: t.addListing.family.clothing.tshirt },
                                { val: 'Gömlek', label: t.addListing.family.clothing.shirt },
                                { val: 'Ceket & Mont', label: t.addListing.family.clothing.jacket },
                                { val: 'Kazak & Hırka', label: t.addListing.family.clothing.sweater },
                                { val: 'İç Çamaşırı', label: t.addListing.family.clothing.underwear },
                                { val: 'Spor Giyim', label: t.addListing.family.clothing.sportswear },
                                { val: 'Mayo & Bikini', label: t.addListing.family.clothing.swimwear },
                                { val: 'Aksesuar', label: t.addListing.family.clothing.accessory },
                                { val: 'Giyim Paketleri', label: t.addListing.family.clothing.sets },
                                { val: 'Diğer Bebek & Çocuk Giyimi', label: t.addListing.family.clothing.other }
                            ].map(item => <option key={item.val} value={item.val}>{item.label}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">{t.addListing.size}</label>
                        <select
                            value={babyKinderkleidungSize}
                            onChange={(e) => setBabyKinderkleidungSize(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white"
                        >
                            <option value="">{t.productDetail.pleaseChoose}</option>
                            {['44', '50', '56', '62', '68', '74', '80', '86', '92', '98', '104', '110', '116', '122', '128', '134', '140', '146', '152', '158', '164', '170', '176', '182', '188'].map(size => (
                                <option key={size} value={size}>{size}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">{t.addListing.gender}</label>
                        <select
                            value={babyKinderkleidungGender}
                            onChange={(e) => setBabyKinderkleidungGender(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white"
                        >
                            <option value="">{t.productDetail.pleaseChoose}</option>
                            <option value="Erkek">{t.addListing.genders.male}</option>
                            <option value="Kız">{t.addListing.genders.female}</option>
                            <option value="Unisex">{t.addListing.genders.unisex}</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">{t.addListing.color}</label>
                        <select
                            value={babyKinderkleidungColor}
                            onChange={(e) => setBabyKinderkleidungColor(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white"
                        >
                            <option value="">{t.productDetail.pleaseChoose}</option>
                            {[
                                { val: 'Bej', label: t.addListing.colors.beige },
                                { val: 'Mavi', label: t.addListing.colors.blue },
                                { val: 'Kahverengi', label: t.addListing.colors.brown },
                                { val: 'Renkli', label: t.addListing.colors.multicolor },
                                { val: 'Krem', label: t.addListing.colors.cream },
                                { val: 'Sarı', label: t.addListing.colors.yellow },
                                { val: 'Altın', label: t.addListing.colors.gold },
                                { val: 'Gri', label: t.addListing.colors.gray },
                                { val: 'Yeşil', label: t.addListing.colors.green },
                                { val: 'Haki', label: t.addListing.colors.khaki },
                                { val: 'Lavanta', label: t.addListing.colors.lavender },
                                { val: 'Mor', label: t.addListing.colors.purple },
                                { val: 'Turuncu', label: t.addListing.colors.orange },
                                { val: 'Pembe', label: t.addListing.colors.pink },
                                { val: 'Desenli', label: t.addListing.colors.print },
                                { val: 'Kırmızı', label: t.addListing.colors.red },
                                { val: 'Siyah', label: t.addListing.colors.black },
                                { val: 'Gümüş', label: t.addListing.colors.silver },
                                { val: 'Turkuaz', label: t.addListing.colors.turquoise },
                                { val: 'Beyaz', label: t.addListing.colors.white },
                                { val: 'Diğer Renkler', label: t.addListing.colors.other }
                            ].map(item => <option key={item.val} value={item.val}>{item.label}</option>)}
                        </select>
                    </div>
                </div>
            )}

            {/* Bebek & Çocuk Ayakkabıları */}
            {subCategory === 'Bebek & Çocuk Ayakkabıları' && (
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">{t.addListing.art}</label>
                        <select
                            value={babyKinderschuheArt}
                            onChange={(e) => setBabyKinderschuheArt(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white"
                        >
                            <option value="">{t.productDetail.pleaseChoose}</option>
                            {[
                                { val: 'Babet', label: t.addListing.family.shoes.ballerinas },
                                { val: 'Yarım ve Bağcıklı Ayakkabı', label: t.addListing.family.shoes.outdoor },
                                { val: 'Ev Terliği', label: t.addListing.family.shoes.slippers },
                                { val: 'Sandalet', label: t.addListing.family.shoes.sandals },
                                { val: 'Dış Mekan & Yürüyüş Ayakkabısı', label: t.addListing.family.shoes.hiking },
                                { val: 'Sneaker & Spor Ayakkabı', label: t.addListing.family.shoes.sneakers },
                                { val: 'Bot & Çizme', label: t.addListing.family.shoes.boots },
                                { val: 'Deniz Ayakkabısı', label: t.addListing.family.shoes.water },
                                { val: 'Diğer Ayakkabılar', label: t.addListing.family.shoes.other }
                            ].map(item => <option key={item.val} value={item.val}>{item.label}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">{t.addListing.size}</label>
                        <select
                            value={babyKinderschuheSize}
                            onChange={(e) => setBabyKinderschuheSize(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white"
                        >
                            <option value="">{t.productDetail.pleaseChoose}</option>
                            {['<20', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '>36'].map(size => (
                                <option key={size} value={size}>{size}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">{t.addListing.color}</label>
                        <select
                            value={babyKinderschuheColor}
                            onChange={(e) => setBabyKinderschuheColor(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white"
                        >
                            <option value="">{t.productDetail.pleaseChoose}</option>
                            {[
                                { val: 'Bej', label: t.addListing.colors.beige },
                                { val: 'Mavi', label: t.addListing.colors.blue },
                                { val: 'Kahverengi', label: t.addListing.colors.brown },
                                ...['Renkli', 'Krem', 'Sarı', 'Altın', 'Gri', 'Yeşil', 'Haki', 'Lavanta', 'Mor', 'Turuncu', 'Pembe', 'Desenli', 'Kırmızı', 'Siyah', 'Gümüş', 'Turkuaz', 'Beyaz'].map(c => ({ val: c, label: c })),
                                { val: 'Diğer Renkler', label: t.addListing.colors.other }
                            ].map(item => <option key={item.val} value={item.val}>{item.label}</option>)}
                        </select>
                    </div>
                </div>
            )}

            {/* Bebek Arabaları & Pusetler */}
            {subCategory === 'Bebek Arabaları & Pusetler' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">{t.addListing.art}</label>
                        <select
                            value={kinderwagenBuggysArt}
                            onChange={(e) => setKinderwagenBuggysArt(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white"
                        >
                            <option value="">{t.productDetail.pleaseChoose}</option>
                            {[
                                { val: 'Kombi Bebek Arabası', label: t.addListing.family.strollers.combi },
                                { val: 'Puset', label: t.addListing.family.strollers.buggy },
                                { val: 'Jogger', label: t.addListing.family.strollers.jogger },
                                { val: 'İkiz & Kardeş Arabası', label: t.addListing.family.strollers.twin },
                                { val: 'Aksesuar', label: t.addListing.family.strollers.accessory },
                                { val: 'Diğer', label: t.addListing.family.strollers.other }
                            ].map(item => <option key={item.val} value={item.val}>{item.label}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">{t.addListing.color}</label>
                        <select
                            value={kinderwagenBuggysColor}
                            onChange={(e) => setKinderwagenBuggysColor(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white"
                        >
                            <option value="">{t.productDetail.pleaseChoose}</option>
                            {[
                                { val: 'Bej', label: t.addListing.colors.beige },
                                { val: 'Mavi', label: t.addListing.colors.blue },
                                { val: 'Kahverengi', label: t.addListing.colors.brown },
                                { val: 'Renkli', label: t.addListing.colors.multicolor },
                                { val: 'Krem', label: t.addListing.colors.cream },
                                { val: 'Sarı', label: t.addListing.colors.yellow },
                                { val: 'Altın', label: t.addListing.colors.gold },
                                { val: 'Gri', label: t.addListing.colors.gray },
                                { val: 'Yeşil', label: t.addListing.colors.green },
                                { val: 'Haki', label: t.addListing.colors.khaki },
                                { val: 'Lavanta', label: t.addListing.colors.lavender },
                                { val: 'Mor', label: t.addListing.colors.purple },
                                { val: 'Turuncu', label: t.addListing.colors.orange },
                                { val: 'Pembe', label: t.addListing.colors.pink },
                                { val: 'Desenli', label: t.addListing.colors.print },
                                { val: 'Kırmızı', label: t.addListing.colors.red },
                                { val: 'Siyah', label: t.addListing.colors.black },
                                { val: 'Gümüş', label: t.addListing.colors.silver },
                                { val: 'Turkuaz', label: t.addListing.colors.turquoise },
                                { val: 'Beyaz', label: t.addListing.colors.white },
                                { val: 'Diğer Renkler', label: t.addListing.colors.other }
                            ].map(item => <option key={item.val} value={item.val}>{item.label}</option>)}
                        </select>
                    </div>
                </div>
            )}

            {/* Bebek Koltuğu & Oto Koltukları */}
            {subCategory === 'Bebek Koltuğu & Oto Koltukları' && (
                <div>
                    <label className="block text-sm text-gray-600 mb-1">{t.addListing.color}</label>
                    <select
                        value={babyschalenKindersitzeColor}
                        onChange={(e) => setBabyschalenKindersitzeColor(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white"
                    >
                        <option value="">{t.productDetail.pleaseChoose}</option>
                        {[
                            { val: 'Bej', label: t.addListing.colors.beige },
                            { val: 'Mavi', label: t.addListing.colors.blue },
                            { val: 'Kahverengi', label: t.addListing.colors.brown },
                            { val: 'Renkli', label: t.addListing.colors.multicolor },
                            { val: 'Krem', label: t.addListing.colors.cream },
                            { val: 'Sarı', label: t.addListing.colors.yellow },
                            { val: 'Altın', label: t.addListing.colors.gold },
                            { val: 'Gri', label: t.addListing.colors.gray },
                            { val: 'Yeşil', label: t.addListing.colors.green },
                            { val: 'Haki', label: t.addListing.colors.khaki },
                            { val: 'Lavanta', label: t.addListing.colors.lavender },
                            { val: 'Mor', label: t.addListing.colors.purple },
                            { val: 'Turuncu', label: t.addListing.colors.orange },
                            { val: 'Pembe', label: t.addListing.colors.pink },
                            { val: 'Desenli', label: t.addListing.colors.print },
                            { val: 'Kırmızı', label: t.addListing.colors.red },
                            { val: 'Siyah', label: t.addListing.colors.black },
                            { val: 'Gümüş', label: t.addListing.colors.silver },
                            { val: 'Turkuaz', label: t.addListing.colors.turquoise },
                            { val: 'Beyaz', label: t.addListing.colors.white },
                            { val: 'Diğer Renkler', label: t.addListing.colors.other }
                        ].map(item => <option key={item.val} value={item.val}>{item.label}</option>)}
                    </select>
                </div>
            )}

            {/* Bebek Odası Mobilyaları */}
            {subCategory === 'Bebek Odası Mobilyaları' && (
                <div className="mt-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">{t.addListing.art}</label>
                    <select
                        value={selectedKinderzimmermobelArt}
                        onChange={(e) => setSelectedKinderzimmermobelArt(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white"
                    >
                        <option value="">{t.productDetail.pleaseChoose}</option>
                        {[
                            { val: 'Yatak & Beşik', label: t.addListing.family.nursery.bed },
                            { val: 'Mama Sandalyesi & Oyun Parkı', label: t.addListing.family.nursery.highchair },
                            { val: 'Dolap & Şifonyer', label: t.addListing.family.nursery.closet },
                            { val: 'Alt Açma Masası & Aksesuar', label: t.addListing.family.nursery.changingTable },
                            { val: 'Ana Kucağı & Salıncak', label: t.addListing.family.nursery.swing },
                            { val: 'Diğer Bebek Odası Mobilyaları', label: t.addListing.family.nursery.other }
                        ].map(item => <option key={item.val} value={item.val}>{item.label}</option>)}
                    </select>
                </div>
            )}

            {/* Oyuncak */}
            {subCategory === 'Oyuncak' && (
                <div className="mt-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">{t.addListing.art}</label>
                    <select
                        value={selectedSpielzeugArt}
                        onChange={(e) => setSelectedSpielzeugArt(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white"
                    >
                        <option value="">{t.productDetail.pleaseChoose}</option>
                        {[
                            { val: 'Aksiyon & Figür', label: t.addListing.family.toys.action },
                            { val: 'Bebek Oyuncakları', label: t.addListing.family.toys.baby },
                            { val: 'Barbie & Diğerleri', label: t.addListing.family.toys.barbie },
                            { val: 'Bisiklet & Araçlar', label: t.addListing.family.toys.bikes },
                            { val: 'Masa Oyunları', label: t.addListing.family.toys.boards },
                            { val: 'Ahşap Oyuncaklar', label: t.addListing.family.toys.wood },
                            { val: 'LEGO & Duplo', label: t.addListing.family.toys.lego },
                            { val: 'Eğitici Oyuncaklar', label: t.addListing.family.toys.educational },
                            { val: 'Playmobil', label: t.addListing.family.toys.playmobil },
                            { val: 'Bebekler', label: t.addListing.family.toys.dolls },
                            { val: 'Oyuncak Arabalar', label: t.addListing.family.toys.cars },
                            { val: 'Dış Mekan Oyuncakları', label: t.addListing.family.toys.outdoor },
                            { val: 'Peluş Oyuncaklar', label: t.addListing.family.toys.plush },
                            { val: 'Diğer Oyuncaklar', label: t.addListing.family.toys.other }
                        ].map(item => <option key={item.val} value={item.val}>{item.label}</option>)}
                    </select>
                </div>
            )}
        </div>
    );
};
