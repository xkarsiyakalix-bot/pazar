import React from 'react';

export const FashionFields = ({
    category,
    subCategory,
    t,
    // Beauty
    selectedBeautyGesundheitArt,
    setSelectedBeautyGesundheitArt,
    // Women's Clothing
    selectedDamenbekleidungArt,
    setSelectedDamenbekleidungArt,
    selectedDamenbekleidungMarke,
    setSelectedDamenbekleidungMarke,
    selectedDamenbekleidungSize,
    setSelectedDamenbekleidungSize,
    selectedDamenbekleidungColor,
    setSelectedDamenbekleidungColor,
    // Women's Shoes
    damenschuheArt,
    setDamenschuheArt,
    damenschuheMarke,
    setDamenschuheMarke,
    damenschuheSize,
    setDamenschuheSize,
    damenschuheColor,
    setDamenschuheColor,
    // Unified Fashion (Men's & shared)
    herrenbekleidungArt,
    setHerrenbekleidungArt,
    herrenbekleidungMarke,
    setHerrenbekleidungMarke,
    herrenbekleidungSize,
    setHerrenbekleidungSize,
    herrenbekleidungColor,
    setHerrenbekleidungColor,
    damenbekleidungArt,
    setDamenbekleidungArt,
    damenbekleidungMarke,
    setDamenbekleidungMarke,
    damenbekleidungSize,
    setDamenbekleidungSize,
    damenbekleidungColor,
    setDamenbekleidungColor,
    // Men's Shoes
    selectedHerrenschuheArt,
    setSelectedHerrenschuheArt,
    selectedHerrenschuheMarke,
    setSelectedHerrenschuheMarke,
    selectedHerrenschuheSize,
    setSelectedHerrenschuheSize,
    selectedHerrenschuheColor,
    setSelectedHerrenschuheColor,
    // Accessories
    selectedTaschenAccessoiresArt,
    setSelectedTaschenAccessoiresArt,
    // Watches & Jewelry
    selectedUhrenSchmuckArt,
    setSelectedUhrenSchmuckArt
}) => {
    if (category !== 'Moda & Güzellik') return null;

    return (
        <>
            {/* Beauty & Gesundheit Specific Fields */}
            {(subCategory === 'Güzellik & Sağlık' || subCategory === 'Kişisel Bakım & Sağlık') && (
                <div className="mt-4">
                    <label className="block text-sm text-gray-600 mb-1">{t.addListing.art}</label>
                    <select
                        value={selectedBeautyGesundheitArt}
                        onChange={(e) => setSelectedBeautyGesundheitArt(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white text-gray-700"
                    >
                        <option value="">{t.productDetail.pleaseChoose}</option>
                        <option value="Makyaj & Cilt Bakımı">{t.addListing.fashion.beauty.makeup}</option>
                        <option value="Saç Bakımı">{t.addListing.fashion.beauty.hair}</option>
                        <option value="Vücut Bakımı">{t.addListing.fashion.beauty.body}</option>
                        <option value="El & Tırnak Bakımı">{t.addListing.fashion.beauty.nails}</option>
                        <option value="Sağlık">{t.addListing.fashion.beauty.health}</option>
                        <option value="Diğer Güzellik & Sağlık">{t.addListing.fashion.beauty.other}</option>
                    </select>
                </div>
            )}

            {/* Kadın Giyimi (Damenbekleidung) Specific Fields */}
            {(subCategory === 'Kadın Giyimi' || subCategory === 'Kadın Giyim') && (
                <div className="mt-4 space-y-4">
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">{t.addListing.art}</label>
                        <select
                            value={selectedDamenbekleidungArt}
                            onChange={(e) => setSelectedDamenbekleidungArt(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white text-gray-700"
                        >
                            <option value="">{t.productDetail.pleaseChoose}</option>
                            <option value="Takımlar">{t.addListing.fashion.women.suits}</option>
                            <option value="Deniz Giyimi">{t.addListing.fashion.women.swimwear}</option>
                            <option value="Gömlek & Bluz">{t.addListing.fashion.women.shirts}</option>
                            <option value="Gelinlik & Düğün">{t.addListing.fashion.women.wedding}</option>
                            <option value="Pantolonlar">{t.addListing.fashion.women.pants}</option>
                            <option value="Ceket & Palto">{t.addListing.fashion.women.jackets}</option>
                            <option value="Kot Pantolonlar">{t.addListing.fashion.women.jeans}</option>
                            <option value="Kostüm & Kıyafet">{t.addListing.fashion.women.costumes}</option>
                            <option value="Kazaklar">{t.addListing.fashion.women.sweaters}</option>
                            <option value="Etek & Elbiseler">{t.addListing.fashion.women.skirts}</option>
                            <option value="Tişört & Üst">{t.addListing.fashion.women.tops}</option>
                            <option value="Şortlar">{t.addListing.fashion.women.shorts}</option>
                            <option value="Spor Giyim">{t.addListing.fashion.women.sportswear}</option>
                            <option value="Hamile Giyim">{t.addListing.fashion.women.maternity}</option>
                            <option value="Diğer Kadın Giyimi">{t.addListing.fashion.women.other}</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm text-gray-600 mb-1">{t.addListing.brand}</label>
                        <select
                            value={selectedDamenbekleidungMarke}
                            onChange={(e) => setSelectedDamenbekleidungMarke(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white text-gray-700"
                        >
                            <option value="">{t.productDetail.pleaseChoose}</option>
                            <option value="Diğer">{t.addListing.other}</option>
                            <option value="H&M">H&M</option>
                            <option value="Esprit">Esprit</option>
                            <option value="Zara">Zara</option>
                            <option value="Only">Only</option>
                            <option value="S.Oliver">S.Oliver</option>
                            <option value="Tommy Hilfiger">Tommy Hilfiger</option>
                            <option value="C&A">C&A</option>
                            <option value="Shein">Shein</option>
                            <option value="Adidas">Adidas</option>
                            <option value="Tom Tailor">Tom Tailor</option>
                            <option value="Street One">Street One</option>
                            <option value="Wellensteyn">Wellensteyn</option>
                            <option value="Cecil">Cecil</option>
                            <option value="Vero Moda">Vero Moda</option>
                            <option value="Marc O´Polo">Marc O´Polo</option>
                            <option value="Mango">Mango</option>
                            <option value="Nike">Nike</option>
                            <option value="Naketano">Naketano</option>
                            <option value="Gerry Weber">Gerry Weber</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm text-gray-600 mb-1">{t.addListing.size}</label>
                        <select
                            value={selectedDamenbekleidungSize}
                            onChange={(e) => setSelectedDamenbekleidungSize(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white text-gray-700"
                        >
                            <option value="">{t.productDetail.pleaseChoose}</option>
                            <option value="Standart Beden">{t.addListing.sizes.oneSize}</option>
                            <option value="XXXS (30)">XXXS (30)</option>
                            <option value="XXS (32)">XXS (32)</option>
                            <option value="XS (34)">XS (34)</option>
                            <option value="S (36)">S (36)</option>
                            <option value="M (38)">M (38)</option>
                            <option value="L (40)">L (40)</option>
                            <option value="XL (42)">XL (42)</option>
                            <option value="XXL (44)">XXL (44)</option>
                            <option value="XXXL (46)">XXXL (46)</option>
                            <option value="4XL (48)">4XL (48)</option>
                            <option value="5XL (50)">5XL (50)</option>
                            <option value="6XL (52)">6XL (52)</option>
                            <option value="7XL (54)">7XL (54)</option>
                            <option value="8XL (56) ve üzeri">8XL (56) {t.addListing.sizes.above}</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm text-gray-600 mb-1">{t.addListing.color}</label>
                        <select
                            value={selectedDamenbekleidungColor}
                            onChange={(e) => setSelectedDamenbekleidungColor(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white text-gray-700"
                        >
                            <option value="">{t.productDetail.pleaseChoose}</option>
                            <option value="Bej">{t.addListing.colors.beige}</option>
                            <option value="Mavi">{t.addListing.colors.blue}</option>
                            <option value="Kahverengi">{t.addListing.colors.brown}</option>
                            <option value="Renkli">{t.addListing.colors.multicolor}</option>
                            <option value="Krem">{t.addListing.colors.cream}</option>
                            <option value="Sarı">{t.addListing.colors.yellow}</option>
                            <option value="Altın">{t.addListing.colors.gold}</option>
                            <option value="Gri">{t.addListing.colors.gray}</option>
                            <option value="Yeşil">{t.addListing.colors.green}</option>
                            <option value="Haki">{t.addListing.colors.khaki}</option>
                            <option value="Lavanta">{t.addListing.colors.lavender}</option>
                            <option value="Mor">{t.addListing.colors.purple}</option>
                            <option value="Turuncu">{t.addListing.colors.orange}</option>
                            <option value="Pembe">{t.addListing.colors.pink}</option>
                            <option value="Desenli">{t.addListing.colors.print}</option>
                            <option value="Kırmızı">{t.addListing.colors.red}</option>
                            <option value="Siyah">{t.addListing.colors.black}</option>
                            <option value="Gümüş">{t.addListing.colors.silver}</option>
                            <option value="Turkuaz">{t.addListing.colors.turquoise}</option>
                            <option value="Beyaz">{t.addListing.colors.white}</option>
                            <option value="Diğer Renkler">{t.addListing.colors.other}</option>
                        </select>
                    </div>
                </div>
            )}

            {/* Kadın Ayakkabıları (Damenschuhe) Specific Fields */}
            {(subCategory === 'Kadın Ayakkabıları' || subCategory === 'Kadın Ayakkabı') && (
                <div className="mt-4 space-y-4">
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">{t.addListing.art}</label>
                        <select
                            value={damenschuheArt}
                            onChange={(e) => setDamenschuheArt(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white text-gray-700"
                        >
                            <option value="">{t.productDetail.pleaseChoose}</option>
                            <option value="Babetler">{t.addListing.fashion.shoes.ballerinas}</option>
                            <option value="Yürüyüş & Bağcıklı Ayakkabı">Yürüyüş & Bağcıklı Ayakkabı</option>
                            <option value="Ev Terlikleri">{t.addListing.fashion.shoes.slippers}</option>
                            <option value="Outdoor & Doğa Yürüyüşü">{t.addListing.fashion.shoes.outdoor}</option>
                            <option value="Topuklu Ayakkabılar">{t.addListing.fashion.shoes.pumps}</option>
                            <option value="Sandaletler">{t.addListing.fashion.shoes.sandals}</option>
                            <option value="Sneaker & Spor Ayakkabı">{t.addListing.fashion.shoes.sneakers}</option>
                            <option value="Çizme & Botlar">{t.addListing.fashion.shoes.boots}</option>
                            <option value="Diğer Ayakkabılar">{t.addListing.fashion.shoes.other}</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm text-gray-600 mb-1">{t.addListing.brand}</label>
                        <select
                            value={damenschuheMarke}
                            onChange={(e) => setDamenschuheMarke(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white text-gray-700"
                        >
                            <option value="">{t.productDetail.pleaseChoose}</option>
                            <option value="Diğer">{t.addListing.other}</option>
                            <option value="Nike">Nike</option>
                            <option value="Adidas">Adidas</option>
                            <option value="Tamaris">Tamaris</option>
                            <option value="Gabor">Gabor</option>
                            <option value="Graceland">Graceland</option>
                            <option value="Puma">Puma</option>
                            <option value="Converse">Converse</option>
                            <option value="Rieker">Rieker</option>
                            <option value="Tommy Hilfiger">Tommy Hilfiger</option>
                            <option value="Dr. Martens">Dr. Martens</option>
                            <option value="Paul Green">Paul Green</option>
                            <option value="UGG">UGG</option>
                            <option value="Buffalo">Buffalo</option>
                            <option value="Vans">Vans</option>
                            <option value="Marco Tozzi">Marco Tozzi</option>
                            <option value="S.Oliver">S.Oliver</option>
                            <option value="Esprit">Esprit</option>
                            <option value="Timberland">Timberland</option>
                            <option value="H&M">H&M</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm text-gray-600 mb-1">{t.addListing.size}</label>
                        <select
                            value={damenschuheSize}
                            onChange={(e) => setDamenschuheSize(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white text-gray-700"
                        >
                            <option value="">{t.productDetail.pleaseChoose}</option>
                            <option value="< 35">&lt; 35</option>
                            <option value="35">35</option>
                            <option value="35.5">35.5</option>
                            <option value="36">36</option>
                            <option value="36.5">36.5</option>
                            <option value="37">37</option>
                            <option value="37.5">37.5</option>
                            <option value="38">38</option>
                            <option value="38.5">38.5</option>
                            <option value="39">39</option>
                            <option value="39.5">39.5</option>
                            <option value="40">40</option>
                            <option value="40.5">40.5</option>
                            <option value="41">41</option>
                            <option value="41.5">41.5</option>
                            <option value="42">42</option>
                            <option value="42.5">42.5</option>
                            <option value="43">43</option>
                            <option value="43.5">43.5</option>
                            <option value="44">44</option>
                            <option value="44.5">44.5</option>
                            <option value="45">45</option>
                            <option value="45.5">45.5</option>
                            <option value="46">46</option>
                            <option value="46.5">46.5</option>
                            <option value="47">47</option>
                            <option value="47.5">47.5</option>
                            <option value="48">48</option>
                            <option value="48.5">48.5</option>
                            <option value="49">49</option>
                            <option value="49.5">49.5</option>
                            <option value="> 50">&gt; 50</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm text-gray-600 mb-1">{t.addListing.color}</label>
                        <select
                            value={damenschuheColor}
                            onChange={(e) => setDamenschuheColor(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white text-gray-700"
                        >
                            <option value="">{t.productDetail.pleaseChoose}</option>
                            <option value="Bej">{t.addListing.colors.beige}</option>
                            <option value="Mavi">{t.addListing.colors.blue}</option>
                            <option value="Kahverengi">{t.addListing.colors.brown}</option>
                            <option value="Renkli">{t.addListing.colors.multicolor}</option>
                            <option value="Krem">{t.addListing.colors.cream}</option>
                            <option value="Sarı">{t.addListing.colors.yellow}</option>
                            <option value="Altın">{t.addListing.colors.gold}</option>
                            <option value="Gri">{t.addListing.colors.gray}</option>
                            <option value="Yeşil">{t.addListing.colors.green}</option>
                            <option value="Haki">{t.addListing.colors.khaki}</option>
                            <option value="Lavanta">{t.addListing.colors.lavender}</option>
                            <option value="Mor">{t.addListing.colors.purple}</option>
                            <option value="Turuncu">{t.addListing.colors.orange}</option>
                            <option value="Pembe">{t.addListing.colors.pink}</option>
                            <option value="Desenli">{t.addListing.colors.print}</option>
                            <option value="Kırmızı">{t.addListing.colors.red}</option>
                            <option value="Siyah">{t.addListing.colors.black}</option>
                            <option value="Gümüş">{t.addListing.colors.silver}</option>
                            <option value="Turkuaz">{t.addListing.colors.turquoise}</option>
                            <option value="Beyaz">{t.addListing.colors.white}</option>
                            <option value="Diğer Renkler">{t.addListing.colors.other}</option>
                        </select>
                    </div>
                </div>
            )}

            {/* Unified Fashion Details (Men's & shared) */}
            {(subCategory === 'Kadın Giyim' || subCategory === 'Kadın Ayakkabı' || subCategory === 'Kadın Giyimi' || subCategory === 'Erkek Giyim' || subCategory === 'Erkek Giyimi') && (
                <div className="space-y-4 pt-4 border-t border-gray-200">
                    <h3 className="font-semibold text-gray-900">{t.productDetail.details}</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Art Selector */}
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">{t.addListing.art}</label>
                            <select
                                value={
                                    (subCategory === 'Kadın Giyim' || subCategory === 'Kadın Giyimi') ? damenbekleidungArt :
                                        subCategory === 'Kadın Ayakkabı' ? damenschuheArt :
                                            herrenbekleidungArt
                                }
                                onChange={(e) => {
                                    const val = e.target.value;
                                    if (subCategory === 'Damenbekleidung' || subCategory === 'Kadın Giyimi') setDamenbekleidungArt(val);
                                    else if (subCategory === 'Damenschuhe' || subCategory === 'Kadın Ayakkabı') setDamenschuheArt(val);
                                    else if (subCategory === 'Herrenbekleidung' || subCategory === 'Erkek Giyim' || subCategory === 'Erkek Giyimi') setHerrenbekleidungArt(val);
                                }}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white"
                            >
                                <option value="">{t.productDetail.pleaseChoose}</option>
                                {(subCategory === 'Damenbekleidung' || subCategory === 'Kadın Giyimi') && [
                                    { val: 'Anzüge', label: t.addListing.fashion.women.suits },
                                    { val: 'Bademode', label: t.addListing.fashion.women.swimwear },
                                    { val: 'Hemden & Blusen', label: t.addListing.fashion.women.shirts },
                                    { val: 'Hochzeitsmode', label: t.addListing.fashion.women.wedding },
                                    { val: 'Hosen', label: t.addListing.fashion.women.pants },
                                    { val: 'Jacken & Mäntel', label: t.addListing.fashion.women.jackets },
                                    { val: 'Jeans', label: t.addListing.fashion.women.jeans },
                                    { val: 'Kostüme & Verkleidungen', label: t.addListing.fashion.women.costumes },
                                    { val: 'Pullover', label: t.addListing.fashion.women.sweaters },
                                    { val: 'Röcke & Kleider', label: t.addListing.fashion.women.skirts },
                                    { val: 'Shirts & Tops', label: t.addListing.fashion.women.tops },
                                    { val: 'Shorts', label: t.addListing.fashion.women.shorts },
                                    { val: 'Sportbekleidung', label: t.addListing.fashion.women.sportswear },
                                    { val: 'Umstandsmode', label: t.addListing.fashion.women.maternity },
                                    { val: 'Weitere Damenbekleidung', label: t.addListing.fashion.women.other }
                                ].map(item => <option key={item.val} value={item.val}>{item.label}</option>)}
                                {subCategory === 'Damenschuhe' && [
                                    { val: 'Ballerinas', label: t.addListing.fashion.shoes.ballerinas },
                                    { val: 'Halb- & Schnürschuhe', label: 'Yürüyüş & Bağcıklı Ayakkabı' },
                                    { val: 'Hausschuhe', label: t.addListing.fashion.shoes.slippers },
                                    { val: 'Outdoor & Wanderschuhe', label: t.addListing.fashion.shoes.outdoor },
                                    { val: 'Pumps & High Heels', label: t.addListing.fashion.shoes.pumps },
                                    { val: 'Sandalen', label: t.addListing.fashion.shoes.sandals },
                                    { val: 'Sneaker & Sportschuhe', label: t.addListing.fashion.shoes.sneakers },
                                    { val: 'Stiefel & Stiefeletten', label: t.addListing.fashion.shoes.boots },
                                    { val: 'Weitere Schuhe', label: t.addListing.fashion.shoes.other }
                                ].map(item => <option key={item.val} value={item.val}>{item.label}</option>)}
                                {(subCategory === 'Herrenbekleidung' || subCategory === 'Erkek Giyim' || subCategory === 'Erkek Giyimi') && [
                                    { val: 'Takımlar', label: t.addListing.fashion.men.suits },
                                    { val: 'Deniz Giyimi', label: t.addListing.fashion.men.swimwear },
                                    { val: 'Gömlekler', label: t.addListing.fashion.men.shirts },
                                    { val: 'Düğün Giyimi', label: t.addListing.fashion.men.wedding },
                                    { val: 'Pantolonlar', label: t.addListing.fashion.men.pants },
                                    { val: 'Ceket & Palto', label: t.addListing.fashion.men.jackets },
                                    { val: 'Kot Pantolonlar', label: t.addListing.fashion.men.jeans },
                                    { val: 'Kostüm & Kıyafet', label: t.addListing.fashion.men.costumes },
                                    { val: 'Kazaklar', label: t.addListing.fashion.men.sweaters },
                                    { val: 'Tişörtler', label: t.addListing.fashion.men.tops },
                                    { val: 'Şortlar', label: t.addListing.fashion.men.shorts },
                                    { val: 'Spor Giyim', label: t.addListing.fashion.men.sportswear },
                                    { val: 'Diğer Erkek Giyimi', label: t.addListing.fashion.men.other }
                                ].map(item => <option key={item.val} value={item.val}>{item.label}</option>)}
                            </select>
                        </div>

                        {/* Marke Selector */}
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">{t.addListing.brand}</label>
                            <select
                                value={
                                    (subCategory === 'Damenbekleidung' || subCategory === 'Kadın Giyimi') ? damenbekleidungMarke :
                                        subCategory === 'Damenschuhe' || subCategory === 'Kadın Ayakkabı' ? damenschuheMarke :
                                            herrenbekleidungMarke
                                }
                                onChange={(e) => {
                                    const val = e.target.value;
                                    if (subCategory === 'Damenbekleidung' || subCategory === 'Kadın Giyimi' || subCategory === 'Kadın Giyim') setDamenbekleidungMarke(val);
                                    else if (subCategory === 'Damenschuhe' || subCategory === 'Kadın Ayakkabı') setDamenschuheMarke(val);
                                    else if (subCategory === 'Herrenbekleidung' || subCategory === 'Erkek Giyim' || subCategory === 'Erkek Giyimi') setHerrenbekleidungMarke(val);
                                }}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white"
                            >
                                <option value="">{t.productDetail.pleaseChoose}</option>
                                {(subCategory === 'Damenbekleidung' || subCategory === 'Kadın Giyimi') && ['Diğer', 'H&M', 'Esprit', 'Zara', 'Only', 'S.Oliver', 'Tommy Hilfiger', 'C&A', 'Shein', 'Adidas', 'Tom Tailor', 'Street One', 'Wellensteyn', 'Cecil', 'Vero Moda', 'Marc O´Polo', 'Mango', 'Nike', 'Naketano', 'Gerry Weber'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                {subCategory === 'Damenschuhe' && ['Diğer', 'Nike', 'Adidas', 'Tamaris', 'Gabor', 'Graceland', 'Puma', 'Converse', 'Rieker', 'Tommy Hilfiger', 'Dr. Martens', 'Paul Green', 'UGG', 'Buffalo', 'Vans', 'Marco Tozzi', 'S.Oliver', 'Esprit', 'Timberland', 'H&M'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                {(subCategory === 'Herrenbekleidung' || subCategory === 'Erkek Giyimi') && ['Diğer', 'Adidas', 'Nike', 'Tommy Hilfiger', 'Jack & Jones', 'H&M', 'Ralph Lauren', 'S.Oliver', 'Tom Tailor', 'Zara', 'Puma', 'Camp David', 'Wellensteyn', 'Levi\'s', 'Hugo Boss', 'Esprit', 'C&A', 'Engelbert Strauss', 'Lacoste', 'G-Star'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                        </div>

                        {/* Größe Selector */}
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">{t.addListing.size}</label>
                            <select
                                value={
                                    (subCategory === 'Damenbekleidung' || subCategory === 'Kadın Giyimi') ? damenbekleidungSize :
                                        subCategory === 'Damenschuhe' ? damenschuheSize :
                                            herrenbekleidungSize
                                }
                                onChange={(e) => {
                                    const val = e.target.value;
                                    if (subCategory === 'Damenbekleidung' || subCategory === 'Kadın Giyimi') setDamenbekleidungSize(val);
                                    else if (subCategory === 'Damenschuhe') setDamenschuheSize(val);
                                    else if (subCategory === 'Herrenbekleidung' || subCategory === 'Erkek Giyimi') setHerrenbekleidungSize(val);
                                }}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white"
                            >
                                <option value="">{t.productDetail.pleaseChoose}</option>
                                {(subCategory === 'Damenbekleidung' || subCategory === 'Kadın Giyimi') && ['Standart Beden', 'XXXS (30)', 'XXS (32)', 'XS (34)', 'S (36)', 'M (38)', 'L (40)', 'XL (42)', 'XXL (44)', 'XXXL (46)', '4XL (48)', '5XL (50)', '6XL (52)', '7XL (54)', '8XL (56) ve üzeri'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                {subCategory === 'Damenschuhe' && ['< 35', '35', '35.5', '36', '36.5', '37', '37.5', '38', '38.5', '39', '39.5', '40', '40.5', '41', '41.5', '42', '42.5', '43', '43.5', '44', '44.5', '45', '45.5', '46', '46.5', '47', '47.5', '48', '48.5', '49', '49.5', '> 50'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                {(subCategory === 'Herrenbekleidung' || subCategory === 'Erkek Giyimi') && ['Standart Beden', 'XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', '4XL', '5XL', '6XL', '7XL', '8XL ve üzeri'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                        </div>

                        {/* Color Selector */}
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">{t.addListing.color}</label>
                            <select
                                value={
                                    (subCategory === 'Damenbekleidung' || subCategory === 'Kadın Giyimi') ? damenbekleidungColor :
                                        subCategory === 'Damenschuhe' ? damenschuheColor :
                                            herrenbekleidungColor
                                }
                                onChange={(e) => {
                                    const val = e.target.value;
                                    if (subCategory === 'Damenbekleidung' || subCategory === 'Kadın Giyimi') setDamenbekleidungColor(val);
                                    else if (subCategory === 'Damenschuhe') setDamenschuheColor(val);
                                    else if (subCategory === 'Herrenbekleidung' || subCategory === 'Erkek Giyimi') setHerrenbekleidungColor(val);
                                }}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white"
                            >
                                <option value="">{t.productDetail.pleaseChoose}</option>
                                <option value="Bej">{t.addListing.colors.beige}</option>
                                <option value="Mavi">{t.addListing.colors.blue}</option>
                                <option value="Kahverengi">{t.addListing.colors.brown}</option>
                                <option value="Renkli">{t.addListing.colors.multicolor}</option>
                                <option value="Krem">{t.addListing.colors.cream}</option>
                                <option value="Sarı">{t.addListing.colors.yellow}</option>
                                <option value="Altın">{t.addListing.colors.gold}</option>
                                <option value="Gri">{t.addListing.colors.gray}</option>
                                <option value="Yeşil">{t.addListing.colors.green}</option>
                                <option value="Haki">{t.addListing.colors.khaki}</option>
                                <option value="Lavanta">{t.addListing.colors.lavender}</option>
                                <option value="Mor">{t.addListing.colors.purple}</option>
                                <option value="Turuncu">{t.addListing.colors.orange}</option>
                                <option value="Pembe">{t.addListing.colors.pink}</option>
                                <option value="Desenli">{t.addListing.colors.print}</option>
                                <option value="Kırmızı">{t.addListing.colors.red}</option>
                                <option value="Siyah">{t.addListing.colors.black}</option>
                                <option value="Gümüş">{t.addListing.colors.silver}</option>
                                <option value="Turkuaz">{t.addListing.colors.turquoise}</option>
                                <option value="Beyaz">{t.addListing.colors.white}</option>
                                <option value="Diğer Renkler">{t.addListing.colors.other}</option>
                            </select>
                        </div>
                    </div>
                </div>
            )}

            {/* Erkek Ayakkabıları (Herrenschuhe) Specific Fields */}
            {(subCategory === 'Erkek Ayakkabı' || subCategory === 'Erkek Ayakkabıları') && (
                <div className="space-y-4 pt-4 border-t border-gray-200">
                    <h3 className="font-semibold text-gray-900">{t.productDetail.details}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        {/* Art */}
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">{t.addListing.art}</label>
                            <select
                                value={selectedHerrenschuheArt}
                                onChange={(e) => setSelectedHerrenschuheArt(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white"
                            >
                                <option value="">{t.productDetail.pleaseChoose}</option>
                                <option value="Yürüyüş & Bağcıklı Ayakkabı">{t.addListing.fashion.shoes.outdoor}</option>
                                <option value="Ev Terlikleri">{t.addListing.fashion.shoes.slippers}</option>
                                <option value="Sandaletler">{t.addListing.fashion.shoes.sandals}</option>
                                <option value="Sneaker & Spor Ayakkabı">{t.addListing.fashion.shoes.sneakers}</option>
                                <option value="Çizme & Botlar">{t.addListing.fashion.shoes.boots}</option>
                                <option value="Outdoor & Doğa Yürüyüşü">{t.addListing.fashion.shoes.outdoor}</option>
                                <option value="Diğer Ayakkabılar">{t.addListing.fashion.shoes.other}</option>
                            </select>
                        </div>

                        {/* Marke */}
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">{t.addListing.brand}</label>
                            <select
                                value={selectedHerrenschuheMarke}
                                onChange={(e) => setSelectedHerrenschuheMarke(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white"
                            >
                                <option value="">{t.productDetail.pleaseChoose}</option>
                                <option value="Nike">Nike</option>
                                <option value="Diğer">{t.addListing.other}</option>
                                <option value="Adidas">Adidas</option>
                                <option value="Puma">Puma</option>
                                <option value="Jordan">Jordan</option>
                                <option value="New Balance">New Balance</option>
                                <option value="ASICS">ASICS</option>
                                <option value="Vans">Vans</option>
                                <option value="Timberland">Timberland</option>
                                <option value="Converse">Converse</option>
                                <option value="Lloyd">Lloyd</option>
                                <option value="Bugatti">Bugatti</option>
                                <option value="Atlas">Atlas</option>
                                <option value="Tommy Hilfiger">Tommy Hilfiger</option>
                                <option value="Engelbert Strauss">Engelbert Strauss</option>
                                <option value="FILA">FILA</option>
                                <option value="Reebok">Reebok</option>
                                <option value="Haix">Haix</option>
                                <option value="Yeezy">Yeezy</option>
                                <option value="Lacoste">Lacoste</option>
                            </select>
                        </div>

                        {/* Size */}
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">{t.addListing.size}</label>
                            <select
                                value={selectedHerrenschuheSize}
                                onChange={(e) => setSelectedHerrenschuheSize(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white"
                            >
                                <option value="">{t.productDetail.pleaseChoose}</option>
                                <option value="< 40">&lt; 40</option>
                                <option value="40">40</option>
                                <option value="40.5">40.5</option>
                                <option value="41">41</option>
                                <option value="41.5">41.5</option>
                                <option value="42">42</option>
                                <option value="42.5">42.5</option>
                                <option value="43">43</option>
                                <option value="43.5">43.5</option>
                                <option value="44">44</option>
                                <option value="44.5">44.5</option>
                                <option value="45">45</option>
                                <option value="45.5">45.5</option>
                                <option value="46">46</option>
                                <option value="46.5">46.5</option>
                                <option value="47">47</option>
                                <option value="47.5">47.5</option>
                                <option value="48">48</option>
                                <option value="48.5">48.5</option>
                                <option value="49">49</option>
                                <option value="49.5">49.5</option>
                                <option value="> 50">&gt; 50</option>
                            </select>
                        </div>

                        {/* Color */}
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">{t.addListing.color}</label>
                            <select
                                value={selectedHerrenschuheColor}
                                onChange={(e) => setSelectedHerrenschuheColor(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white"
                            >
                                <option value="">{t.productDetail.pleaseChoose}</option>
                                <option value="Bej">{t.addListing.colors.beige}</option>
                                <option value="Mavi">{t.addListing.colors.blue}</option>
                                <option value="Kahverengi">{t.addListing.colors.brown}</option>
                                <option value="Renkli">{t.addListing.colors.multicolor}</option>
                                <option value="Krem">{t.addListing.colors.cream}</option>
                                <option value="Sarı">{t.addListing.colors.yellow}</option>
                                <option value="Altın">{t.addListing.colors.gold}</option>
                                <option value="Gri">{t.addListing.colors.gray}</option>
                                <option value="Yeşil">{t.addListing.colors.green}</option>
                                <option value="Haki">{t.addListing.colors.khaki}</option>
                                <option value="Lavanta">{t.addListing.colors.lavender}</option>
                                <option value="Mor">{t.addListing.colors.purple}</option>
                                <option value="Turuncu">{t.addListing.colors.orange}</option>
                                <option value="Pembe">{t.addListing.colors.pink}</option>
                                <option value="Desenli">{t.addListing.colors.print}</option>
                                <option value="Kırmızı">{t.addListing.colors.red}</option>
                                <option value="Siyah">{t.addListing.colors.black}</option>
                                <option value="Gümüş">{t.addListing.colors.silver}</option>
                                <option value="Turkuaz">{t.addListing.colors.turquoise}</option>
                                <option value="Beyaz">{t.addListing.colors.white}</option>
                                <option value="Diğer Renkler">{t.addListing.colors.other}</option>
                            </select>
                        </div>
                    </div>
                </div>
            )}

            {/* Art Selection for Taschen & Accessoires */}
            {(subCategory === 'Çanta & Aksesuar' || subCategory === 'Çanta & Aksesuarlar') && (
                <div className="mt-4">
                    <label className="block text-sm text-gray-600 mb-1">{t.addListing.art}</label>
                    <select
                        value={selectedTaschenAccessoiresArt}
                        onChange={(e) => setSelectedTaschenAccessoiresArt(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white text-gray-700"
                    >
                        <option value="">{t.productDetail.pleaseChoose}</option>
                        {[
                            { val: 'Bere, Atkı & Eldiven', label: t.addListing.fashion.accessories.hats },
                            { val: 'Güneş Gözlükleri', label: t.addListing.fashion.accessories.sunglasses },
                            { val: 'Çanta & Sırt Çantaları', label: t.addListing.fashion.accessories.bags },
                            { val: 'Diğer Çanta & Aksesuarlar', label: t.addListing.fashion.accessories.other }
                        ].map(item => (
                            <option key={item.val} value={item.val}>{item.label}</option>
                        ))}
                    </select>
                </div>
            )}

            {/* Art Selection for Uhren & Schmuck */}
            {subCategory === 'Saat & Takı' && (
                <div className="mt-4">
                    <label className="block text-sm text-gray-600 mb-1">{t.addListing.art}</label>
                    <select
                        value={selectedUhrenSchmuckArt}
                        onChange={(e) => setSelectedUhrenSchmuckArt(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white text-gray-700"
                    >
                        <option value="">{t.productDetail.pleaseChoose}</option>
                        {[
                            { val: 'Takı', label: t.addListing.fashion.beauty.jewelry },
                            { val: 'Saat', label: t.addListing.fashion.beauty.watch },
                            { val: 'Diğer', label: t.addListing.fashion.beauty.other }
                        ].map(item => (
                            <option key={item.val} value={item.val}>{item.label}</option>
                        ))}
                    </select>
                </div>
            )}
        </>
    );
};
