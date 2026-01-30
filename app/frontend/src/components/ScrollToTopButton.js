import React, { useState, useEffect } from 'react';

/**
 * ScrollToTopButton Component
 * Displays a floating button that appears when user scrolls down
 * Smoothly scrolls to top of page when clicked
 */
const ScrollToTopButton = () => {
    const [isVisible, setIsVisible] = useState(false);

    // Show button when page is scrolled down 300px
    const toggleVisibility = () => {
        if (window.pageYOffset > 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    // Smooth scroll to top
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    useEffect(() => {
        window.addEventListener('scroll', toggleVisibility);

        return () => {
            window.removeEventListener('scroll', toggleVisibility);
        };
    }, []);

    return (
        <>
            {isVisible && (
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-32 sm:bottom-8 right-6 z-[10000] p-2.5 sm:p-4 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-md sm:shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 active:scale-95 group"
                    aria-label="Yukarı çık"
                    title="Sayfanın başına dön"
                >
                    {/* Arrow Up Icon */}
                    <svg
                        className="w-5 h-5 sm:w-6 sm:h-6 transform group-hover:-translate-y-1 transition-transform duration-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M5 10l7-7m0 0l7 7m-7-7v18"
                        />
                    </svg>

                    {/* Pulse animation ring */}
                    <span className="absolute inset-0 rounded-full bg-red-600 opacity-0 group-hover:opacity-25 group-hover:animate-ping"></span>
                </button>
            )}
        </>
    );
};

export default ScrollToTopButton;
