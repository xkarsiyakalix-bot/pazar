import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const MobileBottomNavigation = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();

    const navItems = [
        {
            id: 'home', path: '/', label: 'Ana Sayfa', icon: (active) => (
                <svg className={`w-6 h-6 ${active ? 'text-red-600' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
            )
        },
        {
            id: 'search', path: '/search', label: 'Ara', icon: (active) => (
                <svg className={`w-6 h-6 ${active ? 'text-red-600' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            )
        },
        {
            id: 'add', path: '/add-listing', label: 'İlan Ver', isSpecial: true, icon: (active) => (
                <div className="bg-red-600 rounded-full p-2 -mt-6 shadow-lg border-4 border-white transition-transform active:scale-95">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                </div>
            )
        },
        {
            id: 'messages', path: '/messages', label: 'Mesajlar', icon: (active) => (
                <svg className={`w-6 h-6 ${active ? 'text-red-600' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
            )
        },
        {
            id: 'profile', path: user ? '/profile' : '/login', label: 'Profil', icon: (active) => (
                <svg className={`w-6 h-6 ${active ? 'text-red-600' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            )
        }
    ];

    const handleNavClick = (path) => {
        navigate(path);
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg md:hidden z-[9999] px-2 pb-safe">
            <div className="flex justify-between items-center max-w-md mx-auto h-16">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <button
                            key={item.id}
                            onClick={() => handleNavClick(item.path)}
                            className="flex flex-col items-center justify-center flex-1 min-w-0"
                        >
                            <div className="relative">
                                {item.icon(isActive)}
                            </div>
                            {!item.isSpecial && (
                                <span className={`text-[10px] mt-1 font-medium truncate w-full px-1 text-center ${isActive ? 'text-red-600' : 'text-gray-500'}`}>
                                    {item.label}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default MobileBottomNavigation;
