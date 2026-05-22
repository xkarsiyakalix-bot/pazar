import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import LoadingSpinner from '../components/LoadingSpinner';

const AdminSettings = () => {
    const [settings, setSettings] = useState(() => {
        const saved = localStorage.getItem('site_settings');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) { }
        }
        return {
            siteName: 'ExVitrin',
            siteDescription: "Türkiye'nin en büyük ilan pazaryeri.",
            contactEmail: 'kerem_aydin@aol.com',
            contactPhone: '+90 212 123 45 67',
            maintenanceMode: false,
            allowRegistration: true,
            searchBgColor: ''
        };
    });
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('general');

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            // Save to localStorage
            localStorage.setItem('site_settings', JSON.stringify(settings));
            // Dispatch a custom event so other components in the same tab can update
            window.dispatchEvent(new CustomEvent('site_settings_updated'));
            alert('Ayarlar başarıyla kaydedildi!');
        } catch (error) {
            console.error('Error saving settings:', error);
            alert('Ayarlar kaydedilirken bir hata oluştu.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500 text-sm">Ayarlar yükleniyor...</div>;

    return (
        <div className="space-y-6 animate-fade-in pb-12">
            <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                <div>
                    <h1 className="text-3xl font-display font-bold text-neutral-900 dark:text-neutral-50 tracking-tight transition-colors duration-300">Sistem Ayarları</h1>
                    <p className="text-neutral-500 dark:text-neutral-400 font-medium mt-1 transition-colors duration-300">Platform genelindeki ayarları yapılandırın</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Sol Menü */}
                {/* Sol Menü */}
                <div className="bg-white dark:bg-neutral-900 rounded-3xl shadow-sm border border-neutral-100 dark:border-white/5 p-2 lg:col-span-1 h-fit transition-colors duration-300">
                    <button
                        onClick={() => setActiveTab('general')}
                        className={`w-full text-left px-5 py-4 rounded-2xl font-bold flex items-center justify-between transition-all group ${activeTab === 'general'
                            ? 'bg-neutral-900 dark:bg-neutral-800 text-white shadow-lg shadow-neutral-200 dark:shadow-black/20 scale-[1.02]'
                            : 'text-neutral-500 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 hover:text-neutral-900 dark:hover:text-neutral-200'
                            }`}
                    >
                        <span className="flex items-center gap-3">
                            <span className={`p-2 rounded-xl transition-colors ${activeTab === 'general' ? 'bg-white/10' : 'bg-neutral-100 dark:bg-neutral-800 group-hover:bg-white dark:group-hover:bg-neutral-700 border border-neutral-200 dark:border-white/10'}`}>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-0.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-0.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-0.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-0.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-0.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-0.94-1.543.826 3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                            </span>
                            Genel Ayarlar
                        </span>
                        {activeTab === 'general' && <svg className="w-5 h-5 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>}
                    </button>

                    <button
                        onClick={() => setActiveTab('email')}
                        className={`w-full text-left px-5 py-4 rounded-2xl font-bold flex items-center justify-between transition-all mt-2 group ${activeTab === 'email'
                            ? 'bg-neutral-900 dark:bg-neutral-800 text-white shadow-lg shadow-neutral-200 dark:shadow-black/20 scale-[1.02]'
                            : 'text-neutral-500 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 hover:text-neutral-900 dark:hover:text-neutral-200'
                            }`}
                    >
                        <span className="flex items-center gap-3">
                            <span className={`p-2 rounded-xl transition-colors ${activeTab === 'email' ? 'bg-white/10' : 'bg-neutral-100 dark:bg-neutral-800 group-hover:bg-white dark:group-hover:bg-neutral-700 border border-neutral-200 dark:border-white/10'}`}>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                            </span>
                            E-posta Bildirimleri
                        </span>
                        {activeTab === 'email' && <svg className="w-5 h-5 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>}
                    </button>

                    <button
                        onClick={() => setActiveTab('security')}
                        className={`w-full text-left px-5 py-4 rounded-2xl font-bold flex items-center justify-between transition-all mt-2 group ${activeTab === 'security'
                            ? 'bg-neutral-900 dark:bg-neutral-800 text-white shadow-lg shadow-neutral-200 dark:shadow-black/20 scale-[1.02]'
                            : 'text-neutral-500 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 hover:text-neutral-900 dark:hover:text-neutral-200'
                            }`}
                    >
                        <span className="flex items-center gap-3">
                            <span className={`p-2 rounded-xl transition-colors ${activeTab === 'security' ? 'bg-white/10' : 'bg-neutral-100 dark:bg-neutral-800 group-hover:bg-white dark:group-hover:bg-neutral-700 border border-neutral-200 dark:border-white/10'}`}>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                            </span>
                            Güvenlik & Erişim
                        </span>
                        {activeTab === 'security' && <svg className="w-5 h-5 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>}
                    </button>

                    <button
                        onClick={() => setActiveTab('backup')}
                        className={`w-full text-left px-5 py-4 rounded-2xl font-bold flex items-center justify-between transition-all mt-2 group ${activeTab === 'backup'
                            ? 'bg-neutral-900 dark:bg-neutral-800 text-white shadow-lg shadow-neutral-200 dark:shadow-black/20 scale-[1.02]'
                            : 'text-neutral-500 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 hover:text-neutral-900 dark:hover:text-neutral-200'
                            }`}
                    >
                        <span className="flex items-center gap-3">
                            <span className={`p-2 rounded-xl transition-colors ${activeTab === 'backup' ? 'bg-white/10' : 'bg-neutral-100 dark:bg-neutral-800 group-hover:bg-white dark:group-hover:bg-neutral-700 border border-neutral-200 dark:border-white/10'}`}>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                            </span>
                            Yedekleme
                        </span>
                        {activeTab === 'backup' && <svg className="w-5 h-5 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>}
                    </button>
                </div>

                {/* Sağ İçerik Alanı */}
                <div className="lg:col-span-2">
                    <form onSubmit={handleSubmit} className="bg-white dark:bg-neutral-900 rounded-3xl shadow-sm border border-neutral-100 dark:border-white/5 p-8 space-y-8 h-full transition-colors duration-300">

                        {activeTab === 'general' && (
                            <div className="space-y-6 animate-fade-in">
                                <div>
                                    <h2 className="text-xl font-display font-bold text-neutral-900 dark:text-neutral-50 flex items-center gap-2">
                                        <span className="w-2 h-6 bg-red-600 rounded-full"></span>
                                        Site Bilgileri
                                    </h2>
                                    <p className="text-neutral-500 dark:text-neutral-400 text-sm mt-1 ml-4">Temel site ayarlarını buradan yönetebilirsiniz.</p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="block text-xs font-bold text-neutral-500 dark:text-neutral-500 uppercase tracking-wide ml-1">Site Başlığı</label>
                                        <input
                                            type="text"
                                            value={settings.siteName}
                                            onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                                            className="block w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-white/5 rounded-xl text-sm font-medium focus:outline-none focus:border-red-500 dark:focus:border-red-700 focus:ring-4 focus:ring-red-500/10 dark:focus:ring-red-900/20 transition-all text-neutral-900 dark:text-neutral-50"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-xs font-bold text-neutral-500 dark:text-neutral-500 uppercase tracking-wide ml-1">İletişim E-posta</label>
                                        <input
                                            type="email"
                                            value={settings.contactEmail}
                                            onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                                            className="block w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-white/5 rounded-xl text-sm font-medium focus:outline-none focus:border-red-500 dark:focus:border-red-700 focus:ring-4 focus:ring-red-500/10 dark:focus:ring-red-900/20 transition-all text-neutral-900 dark:text-neutral-50"
                                        />
                                    </div>
                                </div>

                                {/* Görünüm Ayarları */}
                                <div>
                                    <h2 className="text-xl font-display font-bold text-neutral-900 dark:text-neutral-50 flex items-center gap-2 mt-8">
                                        <span className="w-2 h-6 bg-purple-600 rounded-full"></span>
                                        Görünüm Ayarları
                                    </h2>
                                    <p className="text-neutral-500 dark:text-neutral-400 text-sm mt-1 ml-4">Sitenizin renklerini ve tasarımını kişiselleştirin.</p>
                                </div>
                                <div className="grid grid-cols-1 gap-6">
                                    <div className="space-y-3">
                                        <label className="block text-xs font-bold text-neutral-500 dark:text-neutral-500 uppercase tracking-wide ml-1">Marka Rengi (Ara butonu, İlan Ver butonu vb.)</label>
                                        
                                        {/* Preset swatches */}
                                        <div className="flex flex-wrap gap-2">
                                            {[
                                                { label: 'Kırmızı (Varsayılan)', value: '#dc2626' },
                                                { label: 'Turuncu', value: '#ea580c' },
                                                { label: 'Mor', value: '#7c3aed' },
                                                { label: 'Mavi', value: '#2563eb' },
                                                { label: 'Yeşil', value: '#16a34a' },
                                                { label: 'Pembe', value: '#db2777' },
                                                { label: 'Sarı', value: '#ca8a04' },
                                                { label: 'Siyah', value: '#171717' },
                                            ].map(swatch => (
                                                <button
                                                    key={swatch.value}
                                                    type="button"
                                                    title={swatch.label}
                                                    onClick={() => setSettings({ ...settings, searchBgColor: swatch.value })}
                                                    className="w-8 h-8 rounded-lg border-2 transition-all hover:scale-110"
                                                    style={{
                                                        backgroundColor: swatch.value,
                                                        borderColor: settings.searchBgColor === swatch.value ? '#fff' : 'transparent',
                                                        boxShadow: settings.searchBgColor === swatch.value ? `0 0 0 2px ${swatch.value}` : 'none'
                                                    }}
                                                />
                                            ))}
                                        </div>

                                        {/* Custom color picker */}
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="color"
                                                value={settings.searchBgColor || '#dc2626'}
                                                onChange={(e) => setSettings({ ...settings, searchBgColor: e.target.value })}
                                                className="w-12 h-12 rounded cursor-pointer bg-transparent border-0 p-0"
                                                title="Özel renk seç"
                                            />
                                            <span className="text-xs text-neutral-500 dark:text-neutral-400">Özel renk seç</span>
                                            <button
                                                type="button"
                                                onClick={() => setSettings({ ...settings, searchBgColor: '' })}
                                                className="ml-auto text-xs text-red-500 hover:text-red-700 underline"
                                            >
                                                Sıfırla
                                            </button>
                                        </div>

                                        {/* Live preview */}
                                        <div className="mt-2 p-4 rounded-xl bg-neutral-100 dark:bg-neutral-950 border border-neutral-200 dark:border-white/5">
                                            <p className="text-xs text-neutral-400 mb-3 uppercase tracking-wide font-bold">Canlı Önizleme</p>
                                            <div className="flex gap-3 flex-wrap">
                                                <button
                                                    type="button"
                                                    className="px-5 py-2 rounded-lg text-sm font-semibold text-white shadow-md"
                                                    style={{ backgroundColor: settings.searchBgColor || '#dc2626' }}
                                                >
                                                    Ara
                                                </button>
                                                <button
                                                    type="button"
                                                    className="px-5 py-2 rounded-xl text-sm font-semibold text-white shadow-md"
                                                    style={{ backgroundColor: settings.searchBgColor || '#dc2626' }}
                                                >
                                                    İlan Ver
                                                </button>
                                                <span
                                                    className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold text-white"
                                                    style={{ backgroundColor: settings.searchBgColor || '#dc2626' }}
                                                >
                                                    5 yeni mesaj
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold text-neutral-500 dark:text-neutral-500 uppercase tracking-wide ml-1">Bakım Modu</label>
                                    <div className="flex items-center gap-3 p-4 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-white/5 rounded-xl transition-colors duration-300">
                                        <div className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${settings.maintenanceMode ? 'bg-red-600' : 'bg-neutral-300 dark:bg-neutral-800'}`} onClick={() => setSettings({ ...settings, maintenanceMode: !settings.maintenanceMode })}>
                                            <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${settings.maintenanceMode ? 'translate-x-5' : 'translate-x-0'}`} />
                                        </div>
                                        <span className={`text-sm font-bold ${settings.maintenanceMode ? 'text-red-600 dark:text-red-500' : 'text-neutral-500 dark:text-neutral-400'}`}>
                                            {settings.maintenanceMode ? 'Bakım modu AÇIK - Site kullanıcılara kapalı' : 'Bakım modu KAPALI - Site aktif'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'email' && (
                            <div className="space-y-6 animate-fade-in">
                                <div>
                                    <h2 className="text-xl font-display font-bold text-neutral-900 dark:text-neutral-50 flex items-center gap-2">
                                        <span className="w-2 h-6 bg-red-600 rounded-full"></span>
                                        E-posta Ayarları
                                    </h2>
                                    <p className="text-neutral-500 dark:text-neutral-400 text-sm mt-1 ml-4">SMTP ve gönderim ayarları.</p>
                                </div>
                                <div className="p-12 text-center bg-neutral-50 dark:bg-neutral-950 border border-dashed border-neutral-300 dark:border-white/10 rounded-2xl transition-colors duration-300">
                                    <div className="w-16 h-16 bg-white dark:bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-neutral-100 dark:border-white/5">
                                        <svg className="w-8 h-8 text-neutral-400 dark:text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                                    </div>
                                    <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">Yakında Gelecek</h3>
                                    <p className="text-neutral-500 dark:text-neutral-400 max-w-xs mx-auto mt-2 text-sm leading-relaxed">Gelişmiş e-posta şablonları ve SMTP yapılandırması bir sonraki güncellemede eklenecektir.</p>
                                </div>
                            </div>
                        )}

                        {activeTab === 'security' && (
                            <div className="space-y-6 animate-fade-in">
                                <div>
                                    <h2 className="text-xl font-display font-bold text-neutral-900 dark:text-neutral-50 flex items-center gap-2">
                                        <span className="w-2 h-6 bg-green-600 rounded-full"></span>
                                        Güvenlik Tercihleri
                                    </h2>
                                    <p className="text-neutral-500 dark:text-neutral-400 text-sm mt-1 ml-4">Giriş ve kayıt kısıtlamaları.</p>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-white/5 rounded-xl transition-colors duration-300">
                                        <div>
                                            <div className="font-bold text-neutral-900 dark:text-neutral-50">Yeni Üye Kaydı</div>
                                            <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">Yeni kullanıcıların siteye üye olmasına izin ver</div>
                                        </div>
                                        <div className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${settings.allowRegistration ? 'bg-green-500' : 'bg-neutral-300 dark:bg-neutral-800'}`} onClick={() => setSettings({ ...settings, allowRegistration: !settings.allowRegistration })}>
                                            <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${settings.allowRegistration ? 'translate-x-5' : 'translate-x-0'}`} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'backup' && (
                            <div className="space-y-6 animate-fade-in">
                                <div>
                                    <h2 className="text-xl font-display font-bold text-neutral-900 dark:text-neutral-50 flex items-center gap-2">
                                        <span className="w-2 h-6 bg-blue-600 rounded-full"></span>
                                        Veritabanı Yedekleme
                                    </h2>
                                    <p className="text-neutral-500 dark:text-neutral-400 text-sm mt-1 ml-4">Manuel yedekleme oluşturun.</p>
                                </div>
                                <div className="flex justify-center p-8 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-white/5 rounded-2xl transition-colors duration-300">
                                    <button type="button" className="flex items-center gap-3 px-6 py-4 bg-neutral-900 dark:bg-neutral-800 text-white font-bold rounded-xl hover:bg-black dark:hover:bg-neutral-700 transition-all shadow-lg active:scale-95">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                                        Şimdi Yedekle (Supabase)
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="pt-6 border-t border-neutral-100 dark:border-white/5 flex justify-end">
                            <button
                                type="submit"
                                disabled={saving}
                                className="flex items-center gap-2 px-8 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-200 dark:shadow-red-900/20 hover:shadow-red-300 active:scale-95 disabled:opacity-50 disabled:active:scale-100"
                            >
                                {saving ? (
                                    <>
                                        <LoadingSpinner size="small" />
                                        Kaydediliyor...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                        Değişiklikleri Kaydet
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminSettings;
