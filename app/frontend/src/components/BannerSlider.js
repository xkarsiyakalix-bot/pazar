
import React, { useState, useEffect } from 'react';

const slides = [
    {
        image: '/assets/marketplace_banner.png',
        title: 'İkinci el eşyalarınıza\nikinci bir hayat verin',
        subtitle: '',
        link: '/add-listing',
        buttonText: 'Hemen İlan Ver'
    },
    {
        image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=1200',
        title: 'Aradığınız her şey\nburada',
        subtitle: 'Binlerce ilan arasından size uygun olanı bulun',
        link: '/Butun-Kategoriler',
        buttonText: 'Alışverişe Başla'
    },
    {
        image: 'https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&q=80&w=1200',
        title: 'Hemen İlan Ver,\nKazanmaya Başla',
        subtitle: 'Eşyalarınızı kolayca nakite çevirin',
        link: '/add-listing',
        buttonText: 'Ücretsiz İlan Ver'
    }
];

const BannerSlider = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);

        return () => clearInterval(timer);
    }, []);

    const goToSlide = (index) => {
        setCurrentSlide(index);
    };

    return (
        <div className="mb-6 sm:mb-8 overflow-hidden shadow-lg relative bg-gray-100 h-[180px] sm:h-[250px] md:h-[300px] group">
            {/* Slides */}
            {slides.map((slide, index) => (
                <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'
                        }`}
                >
                    <img
                        src={slide.image}
                        alt={slide.title.replace('\n', ' ')}
                        className="w-full h-full object-cover"
                        loading={index === 0 ? 'eager' : 'lazy'}
                        {...(index === 0 ? { fetchpriority: "high" } : {})}
                    />

                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-black/60"></div>

                    {/* Text Content */}
                    <div className="absolute top-1/2 right-4 sm:right-12 transform -translate-y-1/2 text-right max-w-[70%] sm:max-w-[60%] pr-4 sm:pr-8 z-10">
                        <h2 className="text-white font-bold text-xl sm:text-4xl lg:text-5xl leading-tight drop-shadow-lg whitespace-pre-line mb-2">
                            {slide.title}
                        </h2>
                        {slide.subtitle && (
                            <p className="text-white/90 text-sm sm:text-lg font-medium drop-shadow-md mb-4 hidden sm:block">
                                {slide.subtitle}
                            </p>
                        )}
                        <a
                            href={slide.link}
                            className="inline-block bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 sm:py-2.5 sm:px-6 rounded-lg transition-colors text-xs sm:text-sm shadow-md"
                        >
                            {slide.buttonText}
                        </a>
                    </div>
                </div>
            ))}

            {/* Navigation Dots */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${index === currentSlide
                            ? 'bg-white w-4 sm:w-6'
                            : 'bg-white/50 hover:bg-white/80'
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>

            {/* Arrow Controls (Visible on Hover) */}
            <button
                onClick={() => setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))}
                className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden sm:block"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 sm:w-6 sm:h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
            </button>
            <button
                onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
                className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden sm:block"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 sm:w-6 sm:h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
            </button>
        </div>
    );
};

export default BannerSlider;
