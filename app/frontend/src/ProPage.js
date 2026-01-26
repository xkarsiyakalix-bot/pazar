import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { t } from './translations';

function ProPage() {
    const navigate = useNavigate();
    const [selectedAds, setSelectedAds] = useState(10);
    const [selectedPackage, setSelectedPackage] = useState(null);

    const adOptions = [1, 5, 10, 25, 50, 100, 200, 400];

    const packages = [
        {
            name: 'Basic',
            subtitle: t.pro.packages.basic.subtitle,
            price: 59,
            features: 11,
            color: 'blue',
            description: t.pro.packages.basic.description,
            mainFeatures: [
                t.pro.packages.features.companyPage,
                t.pro.packages.features.categoryPlacement,
                t.pro.packages.features.unlimitedRuntime,
                t.pro.packages.features.proUrl,
                t.pro.packages.features.autoPush,
                t.pro.packages.features.noCompetitorAds,
                t.pro.packages.features.exclusiveVisibility,
                t.pro.packages.features.easyManagement,
                t.pro.packages.features.stats,
                t.pro.packages.features.salesLabels,
                t.pro.packages.features.salesSign
            ]
        },
        {
            name: 'Power',
            subtitle: t.pro.packages.power.subtitle,
            price: 129,
            features: 16,
            color: 'purple',
            popular: true,
            description: t.pro.packages.power.description,
            mainFeatures: [
                t.pro.packages.features.basicFunctions,
                t.pro.packages.features.homePlacement,
                t.pro.packages.features.followerEngagement,
                t.pro.packages.features.favoriteEngagement,
                t.pro.packages.features.providerPreview,
                t.pro.packages.features.topAd1
            ]
        },
        {
            name: 'Premium',
            subtitle: t.pro.packages.premium.subtitle,
            price: 189,
            features: 20,
            color: 'red',
            description: t.pro.packages.premium.description,
            mainFeatures: [
                t.pro.packages.features.powerFunctions,
                t.pro.packages.features.adFreePage,
                t.pro.packages.features.customCompanyPage,
                t.pro.packages.features.advancedDesign,
                t.pro.packages.features.topAd2
            ]
        }
    ];

    const getPackageColor = (color) => {
        const colors = {
            blue: {
                bg: 'from-blue-500 to-blue-600',
                border: 'border-blue-500',
                text: 'text-blue-600',
                hover: 'hover:from-blue-600 hover:to-blue-700'
            },
            purple: {
                bg: 'from-purple-500 to-purple-600',
                border: 'border-purple-500',
                text: 'text-purple-600',
                hover: 'hover:from-purple-600 hover:to-purple-700'
            },
            red: {
                bg: 'from-red-500 to-red-600',
                border: 'border-red-500',
                text: 'text-red-600',
                hover: 'hover:from-red-600 hover:to-red-700'
            }
        };
        return colors[color];
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-red-600 to-rose-600 text-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <div className="inline-block bg-white/20 backdrop-blur-sm px-6 py-2 rounded-full mb-6">
                            <span className="text-sm font-semibold">PRO</span>
                        </div>
                        <h1 className="text-5xl font-bold mb-6">{t.pro.intro.title}</h1>
                        <p className="text-xl text-red-100 max-w-3xl mx-auto">
                            {t.pro.hero.subtitle}
                        </p>
                    </div>
                </div>
            </div>

            {/* Introduction */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
                    <p className="text-lg text-gray-700 leading-relaxed">
                        {t.pro.intro.description.split('Kurumsal görünümden')[0]}
                        <span className="font-semibold text-red-600">güçlü bir kurumsal görünümden</span>,
                        {t.pro.intro.description.split('güçlü bir kurumsal görünümden')[1]?.split('daha fazla görünürlükten')[0]}
                        <span className="font-semibold text-red-600">ilanlarınız için daha fazla görünürlükten</span>
                        {t.pro.intro.description.split('daha fazla görünürlükten')[1]?.split('kolay yönetiminden')[0]}
                        <span className="font-semibold text-red-600"> kolay yönetiminden</span>
                        {t.pro.intro.description.split('kolay yönetiminden')[1]}
                    </p>
                </div>

                {/* Ad Selector */}
                <div className="mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                        {t.pro.selector.title}
                    </h2>
                    <div className="bg-white rounded-2xl shadow-xl p-8">
                        <label className="block text-lg font-semibold text-gray-900 mb-6">
                            {t.pro.selector.label}
                        </label>
                        <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
                            {adOptions.map((num) => (
                                <button
                                    key={num}
                                    onClick={() => setSelectedAds(num)}
                                    className={`py-4 px-6 rounded-xl font-semibold transition-all duration-200 ${selectedAds === num
                                        ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg scale-105'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    {num}
                                </button>
                            ))}
                            <button
                                onClick={() => setSelectedAds(400)}
                                className={`py-4 px-6 rounded-xl font-semibold transition-all duration-200 ${selectedAds === 400
                                    ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg scale-105'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                400+
                            </button>
                        </div>
                    </div>
                </div>

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    {packages.map((pkg) => {
                        const colors = getPackageColor(pkg.color);
                        const isSelected = selectedPackage === pkg.name;
                        return (
                            <div
                                key={pkg.name}
                                onClick={() => setSelectedPackage(pkg.name)}
                                className={`relative bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:scale-105 cursor-pointer ${pkg.popular ? 'ring-4 ring-purple-500' : ''
                                    } ${isSelected ? 'ring-4 ring-green-500 scale-105' : ''
                                    }`}
                            >
                                {isSelected && (
                                    <div className="absolute top-4 left-4 bg-green-500 text-white p-2 rounded-full z-10">
                                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                )}
                                {pkg.popular && (
                                    <div className="absolute top-0 right-0 bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-2 rounded-bl-2xl font-semibold">
                                        {t.pro.packages.popular}
                                    </div>
                                )}

                                <div className={`bg-gradient-to-r ${colors.bg} p-8 text-white`}>
                                    <h3 className="text-2xl font-bold mb-2">{pkg.name}</h3>
                                    <p className="text-white/90 mb-6">{pkg.subtitle}</p>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-5xl font-bold">{pkg.price}₺</span>
                                        <span className="text-white/80">{t.pro.packages.perMonth}</span>
                                    </div>
                                    <p className="text-sm text-white/80 mt-2">{t.pro.packages.upTo.replace('{count}', selectedAds)}</p>
                                </div>

                                <div className="p-8">
                                    <div className="mb-6">
                                        <span className="inline-block bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-semibold">
                                            {t.pro.packages.functions.replace('{count}', pkg.features)}
                                        </span>
                                    </div>

                                    <ul className="space-y-3 mb-8">
                                        {pkg.mainFeatures.map((feature, idx) => (
                                            <li key={idx} className="flex items-start gap-3">
                                                <svg className={`w-5 h-5 ${colors.text} flex-shrink-0 mt-0.5`} fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>
                                                <span className="text-gray-700 text-sm">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedPackage(pkg.name);
                                        }}
                                        className={`w-full font-bold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 ${isSelected
                                            ? 'bg-green-500 hover:bg-green-600 text-white'
                                            : `bg-gradient-to-r ${colors.bg} ${colors.hover} text-white`
                                            }`}
                                    >
                                        {isSelected ? t.pro.packages.selected : `${pkg.name} ${t.pro.packages.select}`}
                                    </button>

                                    <button className="w-full mt-3 text-gray-600 hover:text-gray-900 font-medium py-2 transition-colors">
                                        {t.pro.packages.moreInfo} →
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Benefits Section */}
                <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl shadow-2xl p-12 text-white mb-16">
                    <h2 className="text-3xl font-bold mb-8 text-center">{t.pro.benefits.title}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                icon: '🚀',
                                title: t.pro.benefits.visibility.title,
                                description: t.pro.benefits.visibility.description
                            },
                            {
                                icon: '⭐',
                                title: t.pro.benefits.appearance.title,
                                description: t.pro.benefits.appearance.description
                            },
                            {
                                icon: '📊',
                                title: t.pro.benefits.stats.title,
                                description: t.pro.benefits.stats.description
                            },
                            {
                                icon: '🎯',
                                title: t.pro.benefits.target.title,
                                description: t.pro.benefits.target.description
                            },
                            {
                                icon: '💼',
                                title: t.pro.benefits.management.title,
                                description: t.pro.benefits.management.description
                            },
                            {
                                icon: '🔒',
                                title: t.pro.benefits.trust.title,
                                description: t.pro.benefits.trust.description
                            }
                        ].map((benefit, idx) => (
                            <div key={idx} className="text-center">
                                <div className="text-5xl mb-4">{benefit.icon}</div>
                                <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
                                <p className="text-gray-300">{benefit.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA Section */}
                <div className="bg-gradient-to-r from-red-600 to-rose-600 rounded-2xl shadow-2xl p-12 text-white text-center">
                    <h2 className="text-4xl font-bold mb-4">{t.pro.cta.title}</h2>
                    {selectedPackage ? (
                        <>
                            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 mb-6 max-w-md mx-auto">
                                <p className="text-lg mb-2">{t.pro.cta.selected}</p>
                                <p className="text-3xl font-bold mb-2">{selectedPackage}</p>
                                <p className="text-xl">
                                    {packages.find(p => p.name === selectedPackage)?.price}₺ {t.pro.packages.perMonth}
                                </p>
                                <p className="text-sm text-red-100 mt-2">
                                    {t.pro.cta.ads.replace('{count}', selectedAds)}
                                </p>
                            </div>
                            <p className="text-xl text-red-100 mb-8 max-w-2xl mx-auto">
                                {t.pro.cta.riskFree}
                            </p>
                            <button
                                onClick={() => {
                                    alert(`Vielen Dank für Ihr Interesse am ${selectedPackage} Paket!\n\nSie werden zur Checkout-Seite weitergeleitet.`);
                                }}
                                className="bg-white text-red-600 font-bold py-4 px-12 rounded-xl text-lg hover:bg-gray-100 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
                            >
                                {t.pro.cta.bookNow.replace('{package}', selectedPackage)}
                            </button>
                        </>
                    ) : (
                        <>
                            <p className="text-xl text-red-100 mb-8 max-w-2xl mx-auto">
                                {t.pro.cta.chooseFirst}
                            </p>
                            <button
                                disabled
                                className="bg-gray-400 text-gray-200 font-bold py-4 px-12 rounded-xl text-lg cursor-not-allowed opacity-60"
                            >
                                {t.pro.cta.chooseBtn}
                            </button>
                        </>
                    )}
                </div>

                {/* Contact Section */}
                <div className="mt-16 bg-white rounded-2xl shadow-xl p-8">
                    <div className="flex items-center justify-center gap-8 flex-wrap">
                        <div className="text-center">
                            <div className="text-5xl mb-4">💬</div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">{t.pro.contact.title}</h3>
                            <p className="text-gray-600 mb-4">{t.pro.contact.subtitle}</p>
                            <a href="tel:+493070016033" className="text-red-600 font-semibold hover:underline">
                                {t.pro.contact.tel} +49 30 700160333
                            </a>
                        </div>
                    </div>
                </div>

                {/* Footer Note */}
                <div className="mt-8 text-center text-sm text-gray-500">
                    <p>
                        {t.pro.footnote}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default ProPage;
