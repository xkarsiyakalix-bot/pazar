import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function BMWListingDetail() {
    const navigate = useNavigate();
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);

    // BMW 320d resim galerisi
    const images = [
        {
            url: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1200&q=80',
            alt: 'BMW 320d - Dış Görünüm'
        },
        {
            url: 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=1200&q=80',
            alt: 'BMW 320d - Ön Görünüm'
        },
        {
            url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=1200&q=80',
            alt: 'BMW 320d - İç Mekan'
        },
        {
            url: 'https://images.unsplash.com/photo-1563720360172-67b8f3dce741?w=1200&q=80',
            alt: 'BMW 320d - Gösterge Paneli'
        },
        {
            url: 'https://images.unsplash.com/photo-1619405399517-d7fce0f13302?w=1200&q=80',
            alt: 'BMW 320d - Yan Görünüm'
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header/Navbar would go here */}

            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Back Button */}
                <button
                    onClick={() => navigate('/Auto-Rad-Boot/Autos')}
                    className="flex items-center text-gray-600 hover:text-red-600 mb-6 transition-colors"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Arabalara Geri Dön
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        {/* Image Gallery */}
                        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
                            {/* Ana Resim - Swipeable on mobile/desktop */}
                            <div className="relative">
                                <div
                                    className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none"
                                    style={{ scrollBehavior: 'smooth' }}
                                    onScroll={(e) => {
                                        const scrollLeft = e.target.scrollLeft;
                                        const width = e.target.clientWidth;
                                        const newIndex = Math.round(scrollLeft / width);
                                        if (newIndex !== activeImageIndex) {
                                            setActiveImageIndex(newIndex);
                                        }
                                    }}
                                    ref={(el) => {
                                        if (el && el.scrollLeft !== activeImageIndex * el.clientWidth) {
                                            el.scrollLeft = activeImageIndex * el.clientWidth;
                                        }
                                    }}
                                >
                                    {images.map((image, index) => (
                                        <div key={index} className="w-full flex-shrink-0 snap-center">
                                            <img
                                                src={image.url}
                                                alt={image.alt}
                                                className="w-full h-96 object-cover cursor-pointer"
                                                onClick={() => setIsLightboxOpen(true)}
                                            />
                                        </div>
                                    ))}
                                </div>

                                {/* Resim Sayacı */}
                                <div className="absolute top-4 right-4 bg-black bg-opacity-60 text-white px-3 py-1 rounded-lg text-sm z-10">
                                    {activeImageIndex + 1} / {images.length}
                                </div>

                                {/* Sol Ok */}
                                {activeImageIndex > 0 && (
                                    <button
                                        onClick={() => setActiveImageIndex(activeImageIndex - 1)}
                                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-lg transition-all z-10 hidden md:block"
                                    >
                                        <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                        </svg>
                                    </button>
                                )}

                                {/* Sağ Ok */}
                                {activeImageIndex < images.length - 1 && (
                                    <button
                                        onClick={() => setActiveImageIndex(activeImageIndex + 1)}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-lg transition-all z-10 hidden md:block"
                                    >
                                        <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                )}
                            </div>

                            {/* Thumbnail'ler */}
                            <div className="p-4 bg-gray-50">
                                <div className="flex gap-2 overflow-x-auto">
                                    {images.map((image, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setActiveImageIndex(index)}
                                            className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${activeImageIndex === index
                                                ? 'border-red-500 ring-2 ring-red-200'
                                                : 'border-gray-300 hover:border-gray-400'
                                                }`}
                                        >
                                            <img
                                                src={image.url}
                                                alt={image.alt}
                                                className="w-full h-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Title and Price */}
                        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-start gap-3 flex-1">
                                    <h1 className="text-3xl font-bold text-gray-900">
                                        BMW 320d Limousine - Bakımlı Durum
                                    </h1>
                                    {/* Favorite Button */}
                                    <button
                                        onClick={() => setIsFavorite(!isFavorite)}
                                        className="flex-shrink-0 p-2 rounded-full hover:bg-gray-100 transition-colors group"
                                        title={isFavorite ? "Favorilerden çıkar" : "Favorilere ekle"}
                                    >
                                        <svg
                                            className={`w-7 h-7 transition-all ${isFavorite ? 'fill-red-500 text-red-500' : 'fill-none text-gray-400 group-hover:text-red-500'}`}
                                            stroke="currentColor"
                                            strokeWidth={2}
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                        </svg>
                                    </button>
                                </div>
                                <div className="text-right ml-4">
                                    <div className="text-3xl font-bold text-red-600">18.500 TL</div>
                                    <div className="text-sm text-gray-500">Pazarlıklı</div>
                                </div>
                            </div>

                            {/* Key Details */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-t border-b border-gray-200">
                                <div>
                                    <div className="text-sm text-gray-500">Kilometre</div>
                                    <div className="font-semibold text-gray-900">85.000 km</div>
                                </div>
                                <div>
                                    <div className="text-sm text-gray-500">İlk Tescil</div>
                                    <div className="font-semibold text-gray-900">03/2018</div>
                                </div>
                                <div>
                                    <div className="text-sm text-gray-500">Yakıt</div>
                                    <div className="font-semibold text-gray-900">Diesel</div>
                                </div>
                                <div>
                                    <div className="text-sm text-gray-500">Güç</div>
                                    <div className="font-semibold text-gray-900">190 PS (140 kW)</div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                                <div>
                                    <div className="text-sm text-gray-500">Şanzıman</div>
                                    <div className="font-semibold text-gray-900">Otomatik</div>
                                </div>
                                <div>
                                    <div className="text-sm text-gray-500">Araç Tipi</div>
                                    <div className="font-semibold text-gray-900">Limousine</div>
                                </div>
                                <div>
                                    <div className="text-sm text-gray-500">Kapı Sayısı</div>
                                    <div className="font-semibold text-gray-900">4/5</div>
                                </div>
                                <div>
                                    <div className="text-sm text-gray-500">Dış Renk</div>
                                    <div className="font-semibold text-gray-900">Siyah</div>
                                </div>
                            </div>
                        </div>

                        {/* Features */}
                        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Donanım</h2>

                            <div className="mb-6">
                                <h3 className="font-semibold text-gray-900 mb-3">Dış Donanım</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    <div className="flex items-center text-gray-700">
                                        <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        Xenon-/LED Farlar
                                    </div>
                                    <div className="flex items-center text-gray-700">
                                        <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        Park Yardımı
                                    </div>
                                    <div className="flex items-center text-gray-700">
                                        <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        Alaşım Jantlar
                                    </div>
                                </div>
                            </div>

                            <div className="mb-6">
                                <h3 className="font-semibold text-gray-900 mb-3">İç Donanım</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    <div className="flex items-center text-gray-700">
                                        <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        Navigasyon Sistemi
                                    </div>
                                    <div className="flex items-center text-gray-700">
                                        <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        Klima
                                    </div>
                                    <div className="flex items-center text-gray-700">
                                        <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        Koltuk Isıtma
                                    </div>
                                    <div className="flex items-center text-gray-700">
                                        <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        Bluetooth
                                    </div>
                                    <div className="flex items-center text-gray-700">
                                        <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        Hız Sabitleyici
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="font-semibold text-gray-900 mb-3">Güvenlik</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    <div className="flex items-center text-gray-700">
                                        <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        ABS
                                    </div>
                                    <div className="flex items-center text-gray-700">
                                        <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        Servis Bakımlı
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Açıklama</h2>
                            <div className="text-gray-700 space-y-4">
                                <p>
                                    Çok temiz ve bakımlı BMW 320d aracımı satıyorum. Araç gayet iyi durumdadır,
                                    düzenli olarak bakımı yapılmış ve servis kayıtlıdır. Sigara içilmemiştir.
                                </p>
                                <p>
                                    Araç her zaman garajda park edilmiş ve sadece uzun mesafelerde kullanılmıştır.
                                    Tüm bakımları yetkili BMW servisinde yapılmıştır.
                                </p>
                                <p>
                                    Araç zengin bir donanıma sahiptir ve teknik olarak kusursuzdur.
                                    Muayenesi 08/2025 tarihine kadar geçerlidir.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        {/* Seller Profile */}
                        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 sticky top-4">
                            {/* Seller Profile Info */}
                            <div className="flex flex-col items-center gap-4 mb-4 pb-4 border-b text-center">
                                <img
                                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                    alt="Max Mustermann"
                                    className="w-24 h-24 rounded-full object-cover cursor-pointer hover:opacity-90 transition-opacity border-4 border-gray-100"
                                />
                                <div className="flex-1 w-full">
                                    <div className="font-semibold text-xl text-gray-900 cursor-pointer hover:text-red-500 transition-colors mb-1">
                                        Max Mustermann
                                    </div>

                                    {/* City Location */}
                                    <div className="flex items-center justify-center gap-1.5 mb-2">
                                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        <span className="text-sm text-gray-600">Münih</span>
                                    </div>

                                    <div className="text-xs uppercase tracking-wide text-red-500 font-semibold mb-2">BİREYSEL KULLANICI</div>
                                    <div className="text-sm text-gray-600 mb-2">25.11.2020 tarihinden beri aktif</div>
                                    <div className="flex items-center justify-center gap-1">
                                        <svg className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                                            <path d="M10 15l-5.878 3.09 1.123-6.545L0.489 6.91l6.572-0.955L10 0l2.939 5.955 6.572 0.955-4.756 4.635 1.123 6.545z" />
                                        </svg>
                                        <span className="text-base font-medium text-gray-700">4.8</span>
                                        <span className="text-sm text-gray-500">(127 Değerlendirme)</span>
                                    </div>
                                </div>
                            </div>

                            {/* Follow Seller Button */}
                            <button className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-3 px-4 rounded-lg transition-colors mb-3 flex items-center justify-center gap-2">
                                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                Satıcıyı takip et
                            </button>

                            {/* Message Button */}
                            <button className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-3 px-4 rounded-lg transition-colors mb-3 flex items-center justify-center gap-2">
                                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h0.01M12 12h0.01M16 12h0.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-0.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                                Mesaj gönder
                            </button>

                            {/* Phone Button */}
                            <button className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-3 px-4 rounded-lg transition-colors mb-3 flex items-center justify-center gap-2">
                                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-0.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-0.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                Ara
                            </button>

                            {/* Seller's Other Listings */}
                            <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
                                <div className="text-sm text-gray-600 mb-2">
                                    <span className="font-semibold text-gray-900">12</span> Max Mustermann'ın diğer ilanları
                                </div>
                                <button className="text-sm text-red-500 hover:text-red-600 font-medium">
                                    Tüm ilanları göster →
                                </button>
                            </div>

                            {/* Share & Print */}
                            <div className="mt-4 space-y-3 pt-4 border-t border-gray-100">
                                <button className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-0.482-0.114-0.938-0.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                    </svg>
                                    Paylaş
                                </button>
                                <button
                                    onClick={() => window.print()}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 9V2h12v7M6 18H5a2 2 0 01-2-2v-5h18v5a2 2 0 01-2 2h-1m-12 0h12v4H6v-4z" />
                                    </svg>
                                    İlanı yazdır
                                </button>
                                <button className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors text-gray-700">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h0.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-0.77-1.333-2.694-1.333-3.464 0L3.34 16c-0.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                    İlanı bildir
                                </button>
                            </div>

                            {/* Listing Info */}
                            <div className="mt-4 pt-4 border-t border-gray-100 text-sm text-gray-600 space-y-1">
                                <div>İlan ID: BMW320D-2024</div>
                                <div>Yayınlandı: 25.11.2024</div>
                            </div>

                            {/* Safety Tips */}
                            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                                <div className="flex items-start gap-2 mb-3">
                                    <span className="text-xl">💡</span>
                                    <h3 className="font-semibold text-gray-900">Güvenlik İpuçları:</h3>
                                </div>
                                <ul className="space-y-2 text-sm text-gray-700">
                                    <li className="flex items-start gap-2">
                                        <span className="text-yellow-600 mt-0.5">•</span>
                                        <span>Halka açık bir yerde buluşun</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-yellow-600 mt-0.5">•</span>
                                        <span>Satın almadan önce ürünü kontrol edin</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-yellow-600 mt-0.5">•</span>
                                        <span>Önden para göndermeyin</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Satıcının Diğer İlanları */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                <h2 className="text-xl font-bold text-gray-900 mb-2">Max Mustermann'ın Diğer İlanları</h2>
                <p className="text-sm text-gray-600 mb-6">Bu satıcının diğer ilanlarını keşfedin</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Ilan 1 */}
                    <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer group">
                        <div className="relative overflow-hidden">
                            <img
                                src="https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&q=80"
                                alt="BMW 530d"
                                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                        </div>
                        <div className="p-4">
                            <h3 className="font-semibold text-base text-gray-900 mb-2 line-clamp-2">BMW 530d xDrive Touring - M Spor Paket</h3>
                            <p className="text-xl font-bold text-red-600 mb-3">28.900 TL</p>
                            <div className="space-y-1 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                    </svg>
                                    Münih
                                </div>
                                <div className="flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                    </svg>
                                    92.000 km
                                </div>
                                <div className="flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                    </svg>
                                    EZ 07/2017
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Ilan 2 */}
                    <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer group">
                        <div className="relative overflow-hidden">
                            <img
                                src="https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600&q=80"
                                alt="BMW X3"
                                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                        </div>
                        <div className="p-4">
                            <h3 className="font-semibold text-base text-gray-900 mb-2 line-clamp-2">BMW X3 xDrive30d - Panoramik Tavan</h3>
                            <p className="text-xl font-bold text-red-600 mb-3">32.500 TL</p>
                            <div className="space-y-1 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                    </svg>
                                    Münih
                                </div>
                                <div className="flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                    </svg>
                                    78.000 km
                                </div>
                                <div className="flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                    </svg>
                                    EZ 04/2018
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Ilan 3 */}
                    <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer group">
                        <div className="relative overflow-hidden">
                            <img
                                src="https://images.unsplash.com/photo-1580274455191-1c62238fa333?w=600&q=80"
                                alt="BMW M4"
                                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                        </div>
                        <div className="p-4">
                            <h3 className="font-semibold text-base text-gray-900 mb-2 line-clamp-2">BMW M4 Competition - Karbon Paket</h3>
                            <p className="text-xl font-bold text-red-600 mb-3">65.900 TL</p>
                            <div className="space-y-1 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                    </svg>
                                    Münih
                                </div>
                                <div className="flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                    </svg>
                                    35.000 km
                                </div>
                                <div className="flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                    </svg>
                                    EZ 11/2020
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            {/* Ähnliche Anzeigen in dieser Kategorie - Yatay Format (Horizontal Cards) */}
            <div className="max-w-7xl mx-auto px-4 py-8" >
                <div className="mb-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Arabalarda Benzer İlanlar</h2>
                    <p className="text-sm text-gray-600">Bu kategorideki diğer ilginç araçlar</p>
                </div>

                <div className="space-y-4">
                    {/* Ilan 1 - Horizontal Card */}
                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                        <div className="flex flex-col md:flex-row">
                            <div className="md:w-1/4">
                                <img
                                    src="https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=600&q=80"
                                    alt="Audi A4"
                                    className="w-full h-48 object-cover"
                                />
                            </div>
                            <div className="md:w-3/4 p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="text-lg font-bold text-gray-900">Audi A4 2.0 TDI - Bakımlı Durum</h4>
                                    <span className="text-xl font-bold text-red-600 ml-4">18.500 TL</span>
                                </div>
                                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                    Çok temiz Audi A4 2.0 TDI aracımı satıyorum. Düzenli bakımlı, sigara içilmemiştir.
                                </p>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    <div className="flex items-center text-sm text-gray-600">
                                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                        </svg>
                                        Berlin
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                        </svg>
                                        95.000 km
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                        </svg>
                                        EZ 05/2017
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                                            <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h0.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h0.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                                        </svg>
                                        Dizel
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Ilan 2 */}
                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                        <div className="flex flex-col md:flex-row">
                            <div className="md:w-1/4">
                                <img
                                    src="https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=600&q=80"
                                    alt="Mercedes C-Klasse"
                                    className="w-full h-48 object-cover"
                                />
                            </div>
                            <div className="md:w-3/4 p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="text-lg font-bold text-gray-900">Mercedes C 220d - Full Donanım</h4>
                                    <span className="text-xl font-bold text-red-600 ml-4">22.900 TL</span>
                                </div>
                                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                    Full paket Mercedes C-Klasse, servis bakımlı, ilk elden.
                                </p>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    <div className="flex items-center text-sm text-gray-600">
                                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                        </svg>
                                        Hamburg
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                        </svg>
                                        72.000 km
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                        </svg>
                                        EZ 08/2019
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                                        </svg>
                                        Dizel
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Ilan 3 */}
                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                        <div className="flex flex-col md:flex-row">
                            <div className="md:w-1/4">
                                <img
                                    src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&q=80"
                                    alt="VW Passat"
                                    className="w-full h-48 object-cover"
                                />
                            </div>
                            <div className="md:w-3/4 p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="text-lg font-bold text-gray-900">VW Passat Variant - Station Wagon</h4>
                                    <span className="text-xl font-bold text-red-600 ml-4">16.800 TL</span>
                                </div>
                                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                    Geniş Passat Variant, aileler için ideal, bakımlı durum.
                                </p>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    <div className="flex items-center text-sm text-gray-600">
                                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                        </svg>
                                        Köln
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                        </svg>
                                        110.000 km
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                        </svg>
                                        EZ 02/2016
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                                        </svg>
                                        Dizel
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Ilan 4 */}
                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                        <div className="flex flex-col md:flex-row">
                            <div className="md:w-1/4">
                                <img
                                    src="https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=600&q=80"
                                    alt="BMW 520d"
                                    className="w-full h-48 object-cover"
                                />
                            </div>
                            <div className="md:w-3/4 p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="text-lg font-bold text-gray-900">BMW 520d Touring - M Spor Paket</h4>
                                    <span className="text-xl font-bold text-red-600 ml-4">24.500 TL</span>
                                </div>
                                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                    M Spor Paketli BMW 5 Serisi Touring, full donanım, bakımlı.
                                </p>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    <div className="flex items-center text-sm text-gray-600">
                                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                        </svg>
                                        Frankfurt
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                        </svg>
                                        88.000 km
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                        </svg>
                                        EZ 06/2018
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                                        </svg>
                                        Dizel
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Ilan 5 */}
                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                        <div className="flex flex-col md:flex-row">
                            <div className="md:w-1/4">
                                <img
                                    src="https://images.unsplash.com/photo-1610768764270-790fbec18178?w=600&q=80"
                                    alt="Audi A6"
                                    className="w-full h-48 object-cover"
                                />
                            </div>
                            <div className="md:w-3/4 p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="text-lg font-bold text-gray-900">Audi A6 3.0 TDI - Quattro</h4>
                                    <span className="text-xl font-bold text-red-600 ml-4">28.900 TL</span>
                                </div>
                                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                    Audi A6 Quattro çekiş sistemi, deri döşeme, navigasyon, xenon.
                                </p>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    <div className="flex items-center text-sm text-gray-600">
                                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                        </svg>
                                        Stuttgart
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                        </svg>
                                        65.000 km
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                        </svg>
                                        EZ 09/2019
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                                        </svg>
                                        Dizel
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >

            {/* Lightbox Modal - Tam Ekran Resim Görünümü */}
            {
                isLightboxOpen && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center"
                        onClick={() => setIsLightboxOpen(false)}
                    >
                        {/* Close Button */}
                        <button
                            onClick={() => setIsLightboxOpen(false)}
                            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
                        >
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        {/* Image Counter */}
                        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-white text-lg">
                            {activeImageIndex + 1} / {images.length}
                        </div>

                        {/* Main Image */}
                        <div className="relative max-w-7xl max-h-screen p-4" onClick={(e) => e.stopPropagation()}>
                            <img
                                src={images[activeImageIndex].url}
                                alt={images[activeImageIndex].alt}
                                className="max-w-full max-h-[90vh] object-contain"
                            />

                            {/* Left Arrow */}
                            {activeImageIndex > 0 && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setActiveImageIndex(activeImageIndex - 1);
                                    }}
                                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-40 rounded-full p-3 transition-all"
                                >
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                            )}

                            {/* Right Arrow */}
                            {activeImageIndex < images.length - 1 && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setActiveImageIndex(activeImageIndex + 1);
                                    }}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-40 rounded-full p-3 transition-all"
                                >
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            )}
                        </div>

                        {/* Image Info */}
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-center">
                            <p className="text-lg">{images[activeImageIndex].alt}</p>
                        </div>
                    </div>
                )
            }
        </div >
    );
}

export default BMWListingDetail;
