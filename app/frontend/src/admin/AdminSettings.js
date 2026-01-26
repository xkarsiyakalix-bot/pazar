import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import LoadingSpinner from '../components/LoadingSpinner';

const AdminSettings = () => {
    const [settings, setSettings] = useState({
        site_name: 'ExVitrin',
        site_description: "Türkiye'nin en büyük ilan pazaryeri.",
        contact_email: 'kerem_aydin@aol.com',
        contact_phone: '+90 212 123 45 67',
        maintenance_mode: false,
        allow_new_registrations: true
    });
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    // In a real app, you would fetch these from a 'site_settings' table
    useEffect(() => {
        const fetchSettings = async () => {
            setLoading(true);
            try {
                // Simulating fetch or fetching from profiles/metadata if stored there
                // For now, we use local state as a placeholder
            } catch (error) {
                console.error('Error fetching settings:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            // Logic to save settings would go here
            // e.g., await supabase.from('site_settings').upsert(settings);
            alert('Ayarlar başarıyla kaydedildi! (Simüle edildi)');
        } catch (error) {
            console.error('Error saving settings:', error);
            alert('Ayarlar kaydedilirken bir hata oluştu.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500 text-sm">Ayarlar yükleniyor...</div>;

    return (
        <div className="max-w-4xl">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 font-outfit">Sistem Ayarları</h2>
                <p className="text-gray-500 text-sm">Site genelindeki temel ayarları buradan yönetebilirsiniz.</p>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                        <h3 className="font-bold text-gray-900 flex items-center gap-2">
                            <span>🌐</span> Genel Bilgiler
                        </h3>
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Site Adı</label>
                                <input
                                    type="text"
                                    value={settings.site_name}
                                    onChange={(e) => setSettings({ ...settings, site_name: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">İletişim E-postası</label>
                                <input
                                    type="email"
                                    value={settings.contact_email}
                                    onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:outline-none"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Site Açıklaması (SEO)</label>
                            <textarea
                                rows="3"
                                value={settings.site_description}
                                onChange={(e) => setSettings({ ...settings, site_description: e.target.value })}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:outline-none"
                            ></textarea>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                        <h3 className="font-bold text-gray-900 flex items-center gap-2">
                            <span>🛡️</span> Güvenlik ve Durum
                        </h3>
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div>
                                <div className="font-bold text-gray-900">Bakım Modu</div>
                                <div className="text-xs text-gray-500">Siteyi sadece yöneticilere açın.</div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setSettings({ ...settings, maintenance_mode: !settings.maintenance_mode })}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${settings.maintenance_mode ? 'bg-red-600' : 'bg-gray-200'}`}
                            >
                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.maintenance_mode ? 'translate-x-6' : 'translate-x-1'}`} />
                            </button>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div>
                                <div className="font-bold text-gray-900">Yeni Kayıtlar</div>
                                <div className="text-xs text-gray-500">Yeni kullanıcı kaydına izin verin.</div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setSettings({ ...settings, allow_new_registrations: !settings.allow_new_registrations })}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${settings.allow_new_registrations ? 'bg-green-600' : 'bg-gray-200'}`}
                            >
                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.allow_new_registrations ? 'translate-x-6' : 'translate-x-1'}`} />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={saving}
                        className="bg-red-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-red-200 hover:bg-red-700 transition-all disabled:opacity-50 flex items-center gap-2"
                    >
                        {saving ? (
                            <>
                                <LoadingSpinner size="small" />
                                Kaydediliyor...
                            </>
                        ) : (
                            'Ayarları Kaydet'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AdminSettings;
