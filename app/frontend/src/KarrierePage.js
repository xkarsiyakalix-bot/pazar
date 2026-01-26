import React from 'react';
import { useNavigate } from 'react-router-dom';
import { t } from './translations';

function KarrierePage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-red-600 to-red-700 text-white py-20">
                <div className="max-w-6xl mx-auto px-4 text-center">
                    <h1 className="text-5xl font-bold mb-6">{t.karriere.hero.title}</h1>
                    <button className="bg-white text-red-600 font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors text-lg">
                        {t.karriere.hero.cta}
                    </button>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-12">
                {/* Intro */}
                <div className="mb-16 text-center">
                    <p className="text-xl text-gray-700 leading-relaxed max-w-4xl mx-auto">
                        {t.karriere.intro.description}
                    </p>
                </div>

                {/* Main Content */}
                <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">
                        {t.karriere.main.title}
                    </h2>
                    <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
                        <p>{t.karriere.main.description1}</p>
                        <p>{t.karriere.main.description2}</p>
                        <p>{t.karriere.main.description3}</p>
                    </div>
                </div>

                {/* Job Categories */}
                <div className="mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">{t.karriere.areas.title}</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            'Product & Tech, UX/UI, Data',
                            'Sales & Advertising & Customer Service',
                            'Finance, Strategy & Legal',
                            'Marketing & Communications',
                            'People',
                            'Administration & Support'
                        ].map((category, index) => (
                            <div key={index} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all p-6 text-center">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">{category}</h3>
                                <button className="text-red-600 hover:text-red-700 font-medium">
                                    {t.karriere.areas.cta} →
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Culture Section */}
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-lg p-8 md:p-12 mb-12 text-white">
                    <h2 className="text-3xl font-bold mb-6">
                        {t.karriere.culture.title}
                    </h2>
                    <p className="text-lg leading-relaxed opacity-90 mb-6">
                        {t.karriere.culture.description1}
                    </p>
                    <p className="text-lg leading-relaxed opacity-90">
                        {t.karriere.culture.description2}
                    </p>
                </div>

                {/* Values - CAKE */}
                <div className="mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                        {t.karriere.values.title}
                    </h2>
                    <p className="text-center text-lg text-gray-700 mb-8 max-w-3xl mx-auto">
                        {t.karriere.values.description}
                    </p>
                    <div className="grid md:grid-cols-2 gap-6">
                        {t.karriere.values.items.map((value, index) => (
                            <div key={index} className="bg-white rounded-xl shadow-md p-6">
                                <h3 className="text-xl font-bold text-red-600 mb-4">{value.title}</h3>
                                <ul className="space-y-2">
                                    {value.points.map((point, i) => (
                                        <li key={i} className="flex items-start">
                                            <span className="text-red-600 mr-2">•</span>
                                            <span className="text-gray-700">{point}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sustainability */}
                <div className="bg-green-50 rounded-2xl shadow-lg p-8 md:p-12 mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">
                        {t.karriere.sustainability.title}
                    </h2>
                    <p className="text-lg text-gray-700 leading-relaxed mb-6">
                        {t.karriere.sustainability.description}
                    </p>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="font-bold text-lg mb-2">{t.karriere.sustainability.items.greenSunday.title}</h3>
                            <p className="text-gray-700">{t.karriere.sustainability.items.greenSunday.description}</p>
                        </div>
                        <div>
                            <h3 className="font-bold text-lg mb-2">{t.karriere.sustainability.items.socialEngagement.title}</h3>
                            <p className="text-gray-700">{t.karriere.sustainability.items.socialEngagement.description}</p>
                        </div>
                        <div>
                            <h3 className="font-bold text-lg mb-2">{t.karriere.sustainability.items.climateInvestment.title}</h3>
                            <p className="text-gray-700">{t.karriere.sustainability.items.climateInvestment.description}</p>
                        </div>
                        <div>
                            <h3 className="font-bold text-lg mb-2">{t.karriere.sustainability.items.campusCleanliness.title}</h3>
                            <p className="text-gray-700">{t.karriere.sustainability.items.campusCleanliness.description}</p>
                        </div>
                    </div>
                </div>

                {/* Benefits */}
                <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">
                        {t.karriere.benefits.title}
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6 text-gray-700">
                        <div>
                            <h3 className="font-bold text-lg mb-2">{t.karriere.benefits.items.smartWorking.title}</h3>
                            <p>{t.karriere.benefits.items.smartWorking.description}</p>
                        </div>
                        <div>
                            <h3 className="font-bold text-lg mb-2">{t.karriere.benefits.items.parentalLeave.title}</h3>
                            <p>{t.karriere.benefits.items.parentalLeave.description}</p>
                        </div>
                        <div>
                            <h3 className="font-bold text-lg mb-2">{t.karriere.benefits.items.development.title}</h3>
                            <p>{t.karriere.benefits.items.development.description}</p>
                        </div>
                        <div>
                            <h3 className="font-bold text-lg mb-2">{t.karriere.benefits.items.culture.title}</h3>
                            <p>{t.karriere.benefits.items.culture.description}</p>
                        </div>
                    </div>
                </div>

                {/* Application Process */}
                <div className="bg-gray-100 rounded-2xl shadow-lg p-8 md:p-12 mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">{t.karriere.process.title}</h2>
                    <p className="text-lg text-gray-700 leading-relaxed mb-6">
                        {t.karriere.process.description1}
                    </p>
                    <p className="text-gray-700 mb-6">
                        {t.karriere.process.description2}
                    </p>
                    <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg transition-colors">
                        {t.karriere.process.cta}
                    </button>
                </div>

                {/* Social Links */}
                <div className="text-center">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">{t.karriere.social.title}</h3>
                    <div className="flex justify-center gap-6">
                        {['LinkedIn', 'Instagram', 'Facebook', 'X'].map((platform) => (
                            <a key={platform} href="#" className="text-red-600 hover:text-red-700 font-medium text-lg">
                                {platform}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default KarrierePage;
