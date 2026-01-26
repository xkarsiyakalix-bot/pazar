import React from 'react';
import { useNavigate } from 'react-router-dom';
import { t } from './translations';
import { fetchTotalActiveListingsCount } from './api/listings';
import { fetchTotalUserCount } from './api/profile';
import { supabase } from './lib/supabase';
import { useState, useEffect } from 'react';

function UberUnsPage() {
    const navigate = useNavigate();
    const [listingCount, setListingCount] = useState(null);
    const [userCount, setUserCount] = useState(null);

    useEffect(() => {
        const loadCounts = async () => {
            const [lCount, uCount] = await Promise.all([
                fetchTotalActiveListingsCount(),
                fetchTotalUserCount()
            ]);
            setListingCount(lCount);
            setUserCount(uCount);
        };
        loadCounts();

        // Real-time subscription for listing updates
        const subscription = supabase
            .channel('public:listings')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'listings' }, () => {
                fetchTotalActiveListingsCount().then(setListingCount);
            })
            .subscribe();

        return () => {
            supabase.removeChannel(subscription);
        };
    }, []);

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-6xl mx-auto px-4 py-12">
                {/* Hero Section */}
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-bold text-gray-900 mb-4">{t.aboutUs.hero.title}</h1>
                    <p className="text-2xl text-gray-600">{t.aboutUs.hero.subtitle}</p>
                </div>

                {/* Team Photo */}
                <div className="mb-16 rounded-2xl overflow-hidden shadow-2xl max-w-4xl mx-auto">
                    <img
                        src="/team_celebration_photo.png"
                        alt="Kleinbazaar Team"
                        className="w-full h-auto max-h-96 object-cover"
                    />
                </div>

                {/* About Section */}
                <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">{t.aboutUs.about.title}</h2>
                    <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
                        <p>
                            {t.aboutUs.about.description1}
                        </p>
                        <p>
                            {t.aboutUs.about.description2}
                        </p>
                    </div>
                </div>

                {/* Facts & Figures */}
                <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-2xl shadow-lg p-8 md:p-12 mb-12 text-white">

                    <div className="grid md:grid-cols-3 gap-8 justify-center">
                        <div className="text-center">
                            <div className="text-5xl font-bold mb-2">{listingCount !== null ? listingCount.toLocaleString('tr-TR') : '...'}</div>
                            <div className="text-lg opacity-90">{t.aboutUs.facts.adsLabel}</div>
                        </div>
                        <div className="text-center">
                            <div className="text-5xl font-bold mb-2">{t.aboutUs.facts.locationCity}</div>
                            <div className="text-lg opacity-90">{t.aboutUs.facts.locationLabel}</div>
                        </div>
                        <div className="text-center">
                            <div className="text-5xl font-bold mb-2">{userCount !== null ? userCount.toLocaleString('tr-TR') : '...'}</div>
                            <div className="text-lg opacity-90">Aktif Kayıtlı Kullanıcı</div>
                        </div>
                    </div>
                </div>

                {/* Mission Section */}
                <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">{t.aboutUs.mission.title}</h2>
                    <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
                        <p className="text-2xl font-semibold text-red-600 mb-4">
                            {t.aboutUs.mission.tagline}
                        </p>
                        <p>
                            {t.aboutUs.mission.description1}
                        </p>
                        <p>
                            {t.aboutUs.mission.description2}
                        </p>
                    </div>
                </div>



                {/* Contact Section */}
                <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">{t.aboutUs.contact.title}</h2>
                    <p className="text-lg text-gray-700 mb-6">
                        {t.aboutUs.contact.description}
                    </p>
                    <button
                        onClick={() => navigate('/iletisim')}
                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
                    >
                        {t.aboutUs.contact.cta}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default UberUnsPage;
