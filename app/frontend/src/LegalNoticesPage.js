import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { t } from './translations';

const LegalNoticesPage = () => {
    const [activeSection, setActiveSection] = useState(null);

    const toggleSection = (section) => {
        setActiveSection(activeSection === section ? null : section);
    };

    const sections = [
        {
            id: 'animal',
            title: 'Hayvan Hakları ve Yasal Uyarı',
            icon: '🐾',
            color: 'from-green-500 to-emerald-600',
            link: '/hayvan-haklari-ve-yasal-uyari'
        },
        {
            id: 'realestate',
            title: 'Emlak İlanları Yasal Uyarı',
            icon: '🏠',
            color: 'from-blue-500 to-cyan-600',
            link: '/emlak-ilanlari-yasal-uyari'
        },
        {
            id: 'vehicle',
            title: 'Vasıta İlanları Yasal Uyarı',
            icon: '🚗',
            color: 'from-purple-500 to-indigo-600',
            link: '/vasita-ilanlari-yasal-uyari'
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-neutral-950 dark:to-neutral-900 transition-colors duration-300">
            {/* Header */}
            <div className="bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 text-white py-16 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>

                <div className="max-w-4xl mx-auto px-4 relative z-10">
                    <div className="inline-block px-4 py-1.5 mb-6 text-xs font-black tracking-widest text-purple-400 uppercase bg-purple-500/10 rounded-full border border-purple-500/20">
                        📋 YASAL BİLGİLENDİRME
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">
                        Yasal Uyarılar
                    </h1>
                    <p className="text-lg text-white/70 max-w-2xl">
                        ExVitrin platformunda ilan verirken dikkat etmeniz gereken yasal düzenlemeler ve uyarılar.
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 py-12">
                {/* Introduction Card */}
                <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-neutral-100 dark:border-white/5 p-8 mb-8">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/20 rounded-xl flex items-center justify-center text-2xl shrink-0">
                            ⚖️
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-50 mb-2">
                                Önemli Bilgilendirme
                            </h2>
                            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                                Aşağıdaki kategorilerde ilan verirken ilgili yasal düzenlemelere uymanız gerekmektedir.
                                Her kategori için detaylı bilgilere ulaşmak için ilgili bölüme tıklayınız.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Legal Notice Cards */}
                <div className="space-y-4">
                    {sections.map((section) => (
                        <div
                            key={section.id}
                            className="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-neutral-100 dark:border-white/5 overflow-hidden transition-all duration-300 hover:shadow-md"
                        >
                            <button
                                onClick={() => toggleSection(section.id)}
                                className="w-full p-6 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-14 h-14 bg-gradient-to-br ${section.color} rounded-xl flex items-center justify-center text-2xl shadow-lg`}>
                                        {section.icon}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-50">
                                            {section.title}
                                        </h3>
                                        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                                            Detaylı bilgi için tıklayın
                                        </p>
                                    </div>
                                </div>
                                <svg
                                    className={`w-6 h-6 text-neutral-400 transition-transform duration-300 ${activeSection === section.id ? 'rotate-180' : ''
                                        }`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {activeSection === section.id && (
                                <div className="px-6 pb-6 animate-fade-in">
                                    <div className="pt-4 border-t border-neutral-100 dark:border-white/5">
                                        <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                                            Bu kategoride ilan vermeden önce ilgili yasal düzenlemeleri okumanız önemlidir.
                                        </p>
                                        <Link
                                            to={section.link}
                                            className={`inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r ${section.color} text-white font-bold rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg`}
                                        >
                                            Detaylı Bilgi
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                            </svg>
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Quick Links */}
                <div className="mt-12 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-neutral-900 dark:to-neutral-800 rounded-2xl p-8 border border-purple-100 dark:border-white/5">
                    <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-50 mb-4 flex items-center gap-2">
                        <span className="text-2xl">🔗</span>
                        Hızlı Erişim
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {sections.map((section) => (
                            <Link
                                key={section.id}
                                to={section.link}
                                className="flex items-center gap-3 p-4 bg-white dark:bg-neutral-900 rounded-xl hover:shadow-md transition-all group border border-transparent dark:border-white/5"
                            >
                                <span className="text-2xl">{section.icon}</span>
                                <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 group-hover:text-neutral-900 dark:group-hover:text-neutral-50">
                                    {section.title.split(' ')[0]} {section.title.split(' ')[1]}
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Back to Home */}
                <div className="mt-8 text-center">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-50 font-semibold transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Ana Sayfaya Dön
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default LegalNoticesPage;
