import React from 'react';

export const FashionFields = ({
    category,
    subCategory,
    t,
    // Beauty
    selectedBeautyGesundheitArt,
    setSelectedBeautyGesundheitArt,
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
                    <label className="block text-sm font-semibold text-neutral-600 dark:text-neutral-400 mb-2 uppercase tracking-wider">{t.addListing.art}</label>
                    <select
                        value={selectedBeautyGesundheitArt}
                        onChange={(e) => setSelectedBeautyGesundheitArt(e.target.value)}
                        className="w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl px-4 py-3 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all appearance-none"
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

            {/* Unified Fashion Details (Men's & shared) */}
            {(subCategory === 'Kadın Giyimi' || subCategory === 'Kadın Ayakkabıları' || subCategory === 'Erkek Giyimi') && (
                <div className="space-y-4 pt-4 border-t border-neutral-200 dark:border-white/10">
                    <h3 className="text-xl font-extrabold text-neutral-900 dark:text-neutral-50 mb-6 flex items-center gap-3">{t.productDetail.details}</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Art Selector */}
                        <div>
                            <label className="block text-sm font-semibold text-neutral-600 dark:text-neutral-400 mb-2 uppercase tracking-wider">{t.addListing.art}</label>
                            <select
                                value={
                                    (subCategory === 'Kadın Giyimi') ? damenbekleidungArt :
                                        (subCategory === 'Kadın Ayakkabıları') ? damenschuheArt :
                                            herrenbekleidungArt
                                }
                                onChange={(e) => {
                                    const val = e.target.value;
                                    if (subCategory === 'Kadın Giyimi') setDamenbekleidungArt(val);
                                    else if (subCategory === 'Kadın Ayakkabıları') setDamenschuheArt(val);
                                    else if (subCategory === 'Erkek Giyimi') setHerrenbekleidungArt(val);
                                }}
                                className="w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl px-4 py-3 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all appearance-none"
                            >
                                <option value="">{t.productDetail.pleaseChoose}</option>
                                {subCategory === 'Kadın Giyimi' && [
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
                                {subCategory === 'Kadın Ayakkabıları' && [
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
                                {subCategory === 'Erkek Giyimi' && [
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
                            <label className="block text-sm font-semibold text-neutral-600 dark:text-neutral-400 mb-2 uppercase tracking-wider">{t.addListing.brand}</label>
                            <select
                                value={
                                    (subCategory === 'Kadın Giyimi') ? damenbekleidungMarke :
                                        (subCategory === 'Kadın Ayakkabıları') ? damenschuheMarke :
                                            herrenbekleidungMarke
                                }
                                onChange={(e) => {
                                    const val = e.target.value;
                                    if (subCategory === 'Kadın Giyimi') setDamenbekleidungMarke(val);
                                    else if (subCategory === 'Kadın Ayakkabıları') setDamenschuheMarke(val);
                                    else if (subCategory === 'Erkek Giyimi') setHerrenbekleidungMarke(val);
                                }}
                                className="w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl px-4 py-3 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all appearance-none"
                            >
                                <option value="">{t.productDetail.pleaseChoose}</option>
                                {subCategory === 'Kadın Giyimi' && ['Diğer', 'H&M', 'Esprit', 'Zara', 'Only', 'S.Oliver', 'Tommy Hilfiger', 'C&A', 'Shein', 'Adidas', 'Tom Tailor', 'Street One', 'Wellensteyn', 'Cecil', 'Vero Moda', 'Marc O´Polo', 'Mango', 'Nike', 'Naketano', 'Gerry Weber'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                {subCategory === 'Kadın Ayakkabıları' && ['Diğer', 'Nike', 'Adidas', 'Tamaris', 'Gabor', 'Graceland', 'Puma', 'Converse', 'Rieker', 'Tommy Hilfiger', 'Dr. Martens', 'Paul Green', 'UGG', 'Buffalo', 'Vans', 'Marco Tozzi', 'S.Oliver', 'Esprit', 'Timberland', 'H&M'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                {subCategory === 'Erkek Giyimi' && ['Diğer', 'Adidas', 'Nike', 'Tommy Hilfiger', 'Jack & Jones', 'H&M', 'Ralph Lauren', 'S.Oliver', 'Tom Tailor', 'Zara', 'Puma', 'Camp David', 'Wellensteyn', 'Levi\'s', 'Hugo Boss', 'Esprit', 'C&A', 'Engelbert Strauss', 'Lacoste', 'G-Star'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                        </div>

                        {/* Größe Selector */}
                        <div>
                            <label className="block text-sm font-semibold text-neutral-600 dark:text-neutral-400 mb-2 uppercase tracking-wider">{t.addListing.size}</label>
                            <select
                                value={
                                    (subCategory === 'Kadın Giyimi') ? damenbekleidungSize :
                                        (subCategory === 'Kadın Ayakkabıları') ? damenschuheSize :
                                            herrenbekleidungSize
                                }
                                onChange={(e) => {
                                    const val = e.target.value;
                                    if (subCategory === 'Kadın Giyimi') setDamenbekleidungSize(val);
                                    else if (subCategory === 'Kadın Ayakkabıları') setDamenschuheSize(val);
                                    else if (subCategory === 'Erkek Giyimi') setHerrenbekleidungSize(val);
                                }}
                                className="w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl px-4 py-3 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all appearance-none"
                            >
                                <option value="">{t.productDetail.pleaseChoose}</option>
                                {subCategory === 'Kadın Giyimi' && ['Standart Beden', 'XXXS (30)', 'XXS (32)', 'XS (34)', 'S (36)', 'M (38)', 'L (40)', 'XL (42)', 'XXL (44)', 'XXXL (46)', '4XL (48)', '5XL (50)', '6XL (52)', '7XL (54)', '8XL (56) ve üzeri'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                {subCategory === 'Kadın Ayakkabıları' && ['< 35', '35', '35.5', '36', '36.5', '37', '37.5', '38', '38.5', '39', '39.5', '40', '40.5', '41', '41.5', '42', '42.5', '43', '43.5', '44', '44.5', '45', '45.5', '46', '46.5', '47', '47.5', '48', '48.5', '49', '49.5', '> 50'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                {subCategory === 'Erkek Giyimi' && ['Standart Beden', 'XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', '4XL', '5XL', '6XL', '7XL', '8XL ve üzeri'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                        </div>

                        {/* Color Selector */}
                        <div>
                            <label className="block text-sm font-semibold text-neutral-600 dark:text-neutral-400 mb-2 uppercase tracking-wider">{t.addListing.color}</label>
                            <select
                                value={
                                    (subCategory === 'Kadın Giyimi') ? damenbekleidungColor :
                                        (subCategory === 'Kadın Ayakkabıları') ? damenschuheColor :
                                            herrenbekleidungColor
                                }
                                onChange={(e) => {
                                    const val = e.target.value;
                                    if (subCategory === 'Kadın Giyimi') setDamenbekleidungColor(val);
                                    else if (subCategory === 'Kadın Ayakkabıları') setDamenschuheColor(val);
                                    else if (subCategory === 'Erkek Giyimi') setHerrenbekleidungColor(val);
                                }}
                                className="w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl px-4 py-3 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all appearance-none"
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
                            <label className="block text-sm font-semibold text-neutral-600 dark:text-neutral-400 mb-2 uppercase tracking-wider">{t.addListing.art}</label>
                            <select
                                value={selectedHerrenschuheArt}
                                onChange={(e) => setSelectedHerrenschuheArt(e.target.value)}
                                className="w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl px-4 py-3 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all appearance-none"
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
                            <label className="block text-sm font-semibold text-neutral-600 dark:text-neutral-400 mb-2 uppercase tracking-wider">{t.addListing.brand}</label>
                            <select
                                value={selectedHerrenschuheMarke}
                                onChange={(e) => setSelectedHerrenschuheMarke(e.target.value)}
                                className="w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl px-4 py-3 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all appearance-none"
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
                            <label className="block text-sm font-semibold text-neutral-600 dark:text-neutral-400 mb-2 uppercase tracking-wider">{t.addListing.size}</label>
                            <select
                                value={selectedHerrenschuheSize}
                                onChange={(e) => setSelectedHerrenschuheSize(e.target.value)}
                                className="w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl px-4 py-3 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all appearance-none"
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
                            <label className="block text-sm font-semibold text-neutral-600 dark:text-neutral-400 mb-2 uppercase tracking-wider">{t.addListing.color}</label>
                            <select
                                value={selectedHerrenschuheColor}
                                onChange={(e) => setSelectedHerrenschuheColor(e.target.value)}
                                className="w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl px-4 py-3 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all appearance-none"
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
                    <label className="block text-sm font-semibold text-neutral-600 dark:text-neutral-400 mb-2 uppercase tracking-wider">{t.addListing.art}</label>
                    <select
                        value={selectedTaschenAccessoiresArt}
                        onChange={(e) => setSelectedTaschenAccessoiresArt(e.target.value)}
                        className="w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl px-4 py-3 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all appearance-none"
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
                    <label className="block text-sm font-semibold text-neutral-600 dark:text-neutral-400 mb-2 uppercase tracking-wider">{t.addListing.art}</label>
                    <select
                        value={selectedUhrenSchmuckArt}
                        onChange={(e) => setSelectedUhrenSchmuckArt(e.target.value)}
                        className="w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl px-4 py-3 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all appearance-none"
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
