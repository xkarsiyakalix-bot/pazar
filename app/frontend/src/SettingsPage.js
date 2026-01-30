import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { fetchUserProfile, updateUserProfile, getUserStats, cancelSubscription } from './api/profile';
import { t } from './translations';
import LoadingSpinner from './components/LoadingSpinner';
import ProfileLayout from './ProfileLayout';
import { useIsMobile } from './hooks/useIsMobile';

// Helper Components defined outside to prevent focus loss on re-render
const SectionHeader = ({ title, description }) => (
    <div className="mb-4 md:mb-8">
        <h2 className="text-xl md:text-2xl font-display font-bold text-neutral-900 tracking-tight">{title}</h2>
        {description && <p className="text-neutral-500 mt-1 md:mt-2 text-sm md:text-base">{description}</p>}
    </div>
);

const InputField = ({ label, value, onChange, type = 'text', placeholder, required = false, icon = null, disabled = false }) => (
    <div className="group space-y-1.5 md:space-y-2">
        <label className="block text-[10px] md:text-xs font-bold text-neutral-500 uppercase tracking-wider group-focus-within:text-purple-600 transition-colors">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className="relative">
            {icon && (
                <div className="absolute inset-y-0 left-0 pl-3 md:pl-4 flex items-center pointer-events-none text-neutral-400 group-focus-within:text-purple-500 transition-colors">
                    {React.cloneElement(icon, { className: 'w-4 h-4 md:w-5 md:h-5' })}
                </div>
            )}
            <input
                type={type}
                value={value || ''}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                disabled={disabled}
                className={`w-full ${icon ? 'pl-9 md:pl-11' : 'pl-3 md:pl-4'} pr-4 py-2.5 md:py-3.5 bg-white border border-neutral-200 rounded-xl text-sm md:text-base text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 transition-all disabled:opacity-60 disabled:bg-neutral-50`}
            />
        </div>
    </div>
);

const TextArea = ({ label, value, onChange, rows = 4, placeholder, maxLength }) => (
    <div className="group space-y-1.5 md:space-y-2">
        <label className="block text-[10px] md:text-xs font-bold text-neutral-500 uppercase tracking-wider group-focus-within:text-purple-600 transition-colors">
            {label}
        </label>
        <textarea
            value={value || ''}
            onChange={onChange}
            rows={rows}
            placeholder={placeholder}
            maxLength={maxLength}
            className="w-full px-3 md:px-4 py-2.5 md:py-3.5 bg-white border border-neutral-200 rounded-xl text-sm md:text-base text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 transition-all resize-none"
        />
        {maxLength && (
            <div className="text-right">
                <span className="text-[10px] md:text-xs font-medium text-neutral-400">
                    {(value || '').length}/{maxLength}
                </span>
            </div>
        )}
    </div>
);

const Toggle = ({ active, onChange }) => (
    <button
        type="button"
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${active ? 'bg-purple-600' : 'bg-neutral-200'}`}
    >
        <span
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${active ? 'translate-x-5' : 'translate-x-0'}`}
        />
    </button>
);

const SettingsPage = () => {
    const isMobile = useIsMobile();
    const { user, loading: authLoading } = useAuth();
    const navigate = useNavigate();

    // Core State
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeSection, setActiveSection] = useState('profile');

    // Form Data State
    const [formData, setFormData] = useState({
        full_name: '',
        phone: '',
        bio: '',
        street: '',
        postal_code: '',
        city: '',
        district: '',
        website: '',
        legal_info: '',
        seller_type: '',
        store_slug: '',
        facebook_url: '',
        instagram_url: '',
        twitter_url: '',
        tiktok_url: ''
    });

    // Activity States
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('success');
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    const [securityData, setSecurityData] = useState({
        password: '',
        confirmPassword: '',
        email: ''
    });
    const [changingPassword, setChangingPassword] = useState(false);
    const [changingEmail, setChangingEmail] = useState(false);

    // Refs
    const fileInputRef = useRef(null);
    const logoInputRef = useRef(null);
    const bannerInputRef = useRef(null);

    // Store & Pro States
    const [storeName, setStoreName] = useState('');
    const [storeDescription, setStoreDescription] = useState('');
    const [storeLogo, setStoreLogo] = useState('');
    const [storeBanner, setStoreBanner] = useState('');
    const [isPro, setIsPro] = useState(false);
    const [subscriptionTier, setSubscriptionTier] = useState('');

    // Working Hours State
    const defaultWorkingHours = {
        mon: { name: 'Pazartesi', open: '09:00', close: '18:00', active: true },
        tue: { name: 'Salı', open: '09:00', close: '18:00', active: true },
        wed: { name: 'Çarşamba', open: '09:00', close: '18:00', active: true },
        thu: { name: 'Perşembe', open: '09:00', close: '18:00', active: true },
        fri: { name: 'Cuma', open: '09:00', close: '18:00', active: true },
        sat: { name: 'Cumartesi', open: '10:00', close: '16:00', active: true },
        sun: { name: 'Pazar', open: '09:00', close: '18:00', active: false },
        isAlwaysOpen: false
    };
    const [workingHours, setWorkingHours] = useState(defaultWorkingHours);

    // Stats
    const [userStats, setUserStats] = useState(null);

    useEffect(() => {
        if (user && !authLoading) {
            setSecurityData(prev => ({ ...prev, email: user.email || '' }));
            if (user.id) {
                loadProfile();
            }
        } else if (!user && !authLoading) {
            navigate('/login');
        }
    }, [user, authLoading, navigate]);

    // Auto-fetch postal code based on City and District
    useEffect(() => {
        const city = formData.city?.trim();
        const district = formData.district?.trim();

        if (city && district && city.length >= 2 && district.length >= 2) {
            const controller = new AbortController();
            const timeoutId = setTimeout(async () => {
                try {
                    const searchCity = city.toLocaleLowerCase('tr-TR');
                    const searchDist = district.toLocaleLowerCase('tr-TR');

                    // 1. Try fetching districts matching the district name
                    const res = await fetch(
                        `https://api.turkiyeapi.dev/v1/districts?name=${encodeURIComponent(district)}&activatePostalCodes=true`,
                        { signal: controller.signal }
                    );
                    const json = await res.json();

                    if (json.data && json.data.length > 0) {
                        const match = json.data.find(d => {
                            const pName = (typeof d.province === 'string' ? d.province : d.province?.name || '').toLocaleLowerCase('tr-TR');
                            const dName = d.name.toLocaleLowerCase('tr-TR');
                            return (pName.includes(searchCity) || searchCity.includes(pName)) &&
                                (dName.includes(searchDist) || searchDist.includes(dName));
                        });

                        if (match && match.postalCode) {
                            setFormData(prev => ({ ...prev, postal_code: match.postalCode }));
                            return;
                        }
                    }

                    // 2. Fallback: Search the city to get its ID, then fetch all its districts
                    const provRes = await fetch(
                        `https://api.turkiyeapi.dev/v1/provinces?name=${encodeURIComponent(city)}`,
                        { signal: controller.signal }
                    );
                    const provJson = await provRes.json();

                    if (provJson.data && provJson.data.length > 0) {
                        const provinceId = provJson.data[0].id;
                        const allDistRes = await fetch(
                            `https://api.turkiyeapi.dev/v1/provinces/${provinceId}/districts?activatePostalCodes=true`,
                            { signal: controller.signal }
                        );
                        const allDistJson = await allDistRes.json();

                        if (allDistJson.data) {
                            const exactDist = allDistJson.data.find(d => {
                                const dName = d.name.toLocaleLowerCase('tr-TR');
                                return dName.includes(searchDist) || searchDist.includes(dName);
                            });
                            if (exactDist && exactDist.postalCode) {
                                setFormData(prev => ({ ...prev, postal_code: exactDist.postalCode }));
                            }
                        }
                    }
                } catch (err) {
                    if (err.name !== 'AbortError') console.error('Postal code fetch error:', err);
                }
            }, 600);

            return () => {
                clearTimeout(timeoutId);
                controller.abort();
            };
        }
    }, [formData.city, formData.district]);

    const loadProfile = async (isRefresh = false) => {
        if (loading && !isRefresh && profile) return;

        try {
            if (!isRefresh) setLoading(true);
            const [data, stats] = await Promise.all([
                fetchUserProfile(user.id),
                getUserStats(user.id).catch(() => null)
            ]);

            if (data) {
                setProfile(data);
                setUserStats(stats);
                setFormData({
                    full_name: data.full_name || '',
                    phone: data.phone || '',
                    bio: data.bio || '',
                    street: data.street || '',
                    postal_code: data.postal_code || '',
                    city: data.city || '',
                    district: data.district || '',
                    website: data.website || '',
                    legal_info: data.legal_info || '',
                    seller_type: data.seller_type || '',
                    store_slug: data.store_slug || '',
                    facebook_url: data.facebook_url || '',
                    instagram_url: data.instagram_url || '',
                    twitter_url: data.twitter_url || '',
                    tiktok_url: data.tiktok_url || ''
                });
                setStoreName(data.store_name || '');
                setStoreDescription(data.store_description || '');
                setStoreLogo(data.store_logo || '');
                setStoreBanner(data.store_banner || '');
                setIsPro(data.is_pro || false);
                setSubscriptionTier(data.subscription_tier || 'free');

                // Merge loaded working hours with defaults to ensure all keys exist
                if (data.working_hours) {
                    setWorkingHours(prev => ({ ...prev, ...data.working_hours }));
                }
            }
        } catch (error) {
            console.error('Error loading profile:', error);
            showFeedback('Profil bilgileri yüklenirken hata oluştu.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const showFeedback = (msg, type = 'success') => {
        setMessage(msg);
        setMessageType(type);
        setTimeout(() => setMessage(''), 5000);
    };

    const handleAvatarUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) return showFeedback('Dosya çok büyük. Maksimum 2MB.', 'error');
        if (!file.type.startsWith('image/')) return showFeedback('Lütfen geçerli bir resim dosyası seçin.', 'error');

        setUploadingAvatar(true);
        try {
            const { supabase } = await import('./lib/supabase');
            const fileExt = file.name.split('.').pop();
            const fileName = `${user.id}-${Date.now()}.${fileExt}`;
            const filePath = `avatars/${fileName}`;

            const { error: uploadError } = await supabase.storage.from('profile-images').upload(filePath, file);
            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage.from('profile-images').getPublicUrl(filePath);
            await updateUserProfile(profile.id, { avatar_url: publicUrl });

            showFeedback('Profil fotoğrafı güncellendi!');
            loadProfile(true);
        } catch (error) {
            console.error('Error uploading avatar:', error);
            showFeedback('Yükleme sırasında hata oluştu.', 'error');
        } finally {
            setUploadingAvatar(false);
        }
    };

    const handleStoreMediaUpload = async (e, type) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) return showFeedback('Dosya çok büyük. Maksimum 5MB.', 'error');

        if (!profile?.subscription_tier || profile.subscription_tier === 'free') {
            if (window.confirm('Logo ve Banner özellikleri için Premium sürüme geçmelisiniz. Paketleri incelemek ister misiniz?')) {
                navigate('/packages');
            }
            e.target.value = '';
            return;
        }

        const isLogo = type === 'logo';
        setSaving(true);

        try {
            const { supabase } = await import('./lib/supabase');
            const fileExt = file.name.split('.').pop();
            const fileName = `${user.id}-${type}-${Date.now()}.${fileExt}`;
            const filePath = `store/${fileName}`;

            const { error: uploadError } = await supabase.storage.from('listing-images').upload(filePath, file);
            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage.from('listing-images').getPublicUrl(filePath);

            if (isLogo) setStoreLogo(publicUrl);
            else setStoreBanner(publicUrl);

            showFeedback(`${isLogo ? 'Logo' : 'Banner'} başarıyla yüklendi. Kaydetmeyi unutmayın!`);
        } catch (error) {
            console.error(`Error uploading ${type}:`, error);
            showFeedback('Yükleme başarısız.', 'error');
        } finally {
            setSaving(false);
            e.target.value = '';
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const cleanedData = Object.fromEntries(
                Object.entries(formData).map(([key, value]) => [key, value === '' ? null : value])
            );

            if (cleanedData.seller_type === 'Gewerblicher Nutzer') {
                cleanedData.is_commercial = true;
            }

            const finalUpdates = {
                ...cleanedData,
                store_name: storeName,
                store_description: storeDescription,
                store_logo: storeLogo,
                store_banner: storeBanner,
                working_hours: workingHours
            };

            await updateUserProfile(profile.id, finalUpdates);
            showFeedback('Değişiklikler başarıyla kaydedildi!');
            loadProfile(true);
        } catch (error) {
            console.error('Error saving profile:', error);
            showFeedback(`Kaydetme hatası: ${error.message}`, 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleWorkingHourChange = (dayKey, field, value) => {
        setWorkingHours(prev => ({
            ...prev,
            [dayKey]: {
                ...prev[dayKey],
                [field]: value
            }
        }));
    };
    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (securityData.password !== securityData.confirmPassword) {
            return showFeedback('Şifreler eşleşmiyor.', 'error');
        }
        if (securityData.password.length < 6) {
            return showFeedback('Şifre en az 6 karakter olmalıdır.', 'error');
        }

        setChangingPassword(true);
        try {
            const { supabase } = await import('./lib/supabase');
            const { error } = await supabase.auth.updateUser({
                password: securityData.password
            });

            if (error) throw error;
            showFeedback('Şifreniz başarıyla güncellendi!');
            setSecurityData({ password: '', confirmPassword: '' });
        } catch (error) {
            console.error('Password update error:', error);
            showFeedback(`Şifre güncellenirken hata: ${error.message}`, 'error');
        } finally {
            setChangingPassword(false);
        }
    };

    const handleEmailChange = async (e) => {
        e.preventDefault();
        if (!securityData.email || securityData.email === user.email) {
            return showFeedback('Farklı bir e-posta adresi giriniz.', 'error');
        }

        setChangingEmail(true);
        try {
            const { supabase } = await import('./lib/supabase');
            const { error } = await supabase.auth.updateUser({
                email: securityData.email
            });

            if (error) throw error;
            showFeedback('E-posta güncelleme isteği gönderildi. Lütfen yeni e-posta adresinizi onaylayın.');
        } catch (error) {
            console.error('Email update error:', error);
            showFeedback(`E-posta güncellenirken hata: ${error.message}`, 'error');
        } finally {
            setChangingEmail(false);
        }
    };
    const handleCancelSubscription = async () => {
        if (!window.confirm('Mağaza aboneliğinizi iptal etmek istediğinize emin misiniz? Bu işlem sonucunda mağaza özelliklerini ve kurumsal ilan limitlerinizi kaybedeceksiniz.')) {
            return;
        }

        setSaving(true);
        try {
            await cancelSubscription(user.id);
            showFeedback('Aboneliğiniz başarıyla iptal edildi. Standart kullanıcı olarak devam edebilirsiniz.');
            setTimeout(() => window.location.reload(), 1500);
        } catch (error) {
            console.error('Error canceling subscription:', error);
            showFeedback('İptal işlemi sırasında bir hata oluştu.', 'error');
        } finally {
            setSaving(false);
        }
    };




    const sections = [
        { id: 'profile', name: 'Profil', icon: '👤', desc: 'Kişisel bilgiler' },
        { id: 'store', name: 'Mağaza', icon: '🏪', desc: 'Kurumsal ayarlar' },
        { id: 'security', name: 'Güvenlik', icon: '🔒', desc: 'Şifre ve giriş' },
        { id: 'notifications', name: 'Bildirimler', icon: '🔔', desc: 'Haberler' },
    ];

    if (loading || authLoading) return <LoadingSpinner size="large" fullScreen />;

    return (
        <ProfileLayout>
            <div className="max-w-4xl mx-auto pb-20">

                {/* Modern Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6 mb-6 md:mb-10 px-4 md:px-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-display font-bold text-neutral-900">Ayarlar</h1>
                            <p className="text-neutral-500 text-sm md:text-lg">Hesabınızı ve tercihlerinizi yönetin.</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Link
                                to={`/seller/${profile?.user_number || user?.id}`}
                                className="flex items-center gap-2 px-4 py-2 bg-white border border-neutral-200 rounded-xl text-sm font-bold text-neutral-700 hover:bg-neutral-50 hover:border-neutral-300 transition-all shadow-sm"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                Profili Gör
                            </Link>
                            {(isPro || profile?.is_commercial) && (
                                <Link
                                    to={profile?.store_slug ? `/${profile.store_slug}` : `/store/${user?.id}`}
                                    className="flex items-center gap-2 px-4 py-2 bg-purple-50 border border-purple-100 rounded-xl text-sm font-bold text-purple-700 hover:bg-purple-100 hover:border-purple-200 transition-all shadow-sm"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                                    Mağazayı Gör
                                </Link>
                            )}
                        </div>
                    </div>
                    {/* Progress Card (Mockup) */}
                    <div className="bg-white p-3 md:p-4 rounded-xl md:rounded-2xl shadow-sm border border-neutral-100 flex items-center gap-3 md:gap-4 shrink-0 mx-4 md:mx-0">
                        <div className="relative">
                            <svg className="w-10 h-10 md:w-12 md:h-12 text-purple-100" viewBox="0 0 36 36">
                                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" />
                                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831" fill="none" stroke="#9333ea" strokeWidth="4" strokeDasharray="100, 100" />
                            </svg>
                            <span className="absolute inset-0 flex items-center justify-center text-[10px] md:text-xs font-bold text-purple-600">
                                100%
                            </span>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Profil Doluluğu</p>
                            <p className="font-bold text-sm md:text-base text-neutral-900">Harika görünüyorsun! 🎉</p>
                        </div>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="sticky top-[60px] md:top-24 z-30 bg-gray-50/95 backdrop-blur-sm py-2 md:py-4 mb-4 md:mb-8 px-4 md:px-0">
                    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                        {sections.map(section => {
                            const isActive = activeSection === section.id;
                            return (
                                <button
                                    key={section.id}
                                    onClick={() => setActiveSection(section.id)}
                                    className={`
                                        flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 rounded-full text-xs md:text-sm font-bold whitespace-nowrap transition-all duration-300
                                        ${isActive
                                            ? 'bg-neutral-900 text-white shadow-lg shadow-neutral-200 transform scale-105'
                                            : 'bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200 hover:border-neutral-300'
                                        }
                                    `}
                                >
                                    <span className="text-base md:text-inherit">{section.icon}</span>
                                    {section.name}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Feedback Toast */}
                {message && (
                    <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-2xl shadow-2xl font-bold text-sm animate-fade-in-up flex items-center gap-3 backdrop-blur-md ${messageType === 'success' ? 'bg-green-600/90 text-white' : 'bg-red-600/90 text-white'
                        }`}>
                        <span>{messageType === 'success' ? '✨' : '⚠️'}</span>
                        {message}
                    </div>
                )}

                <div className="space-y-6">
                    {/* Profile Section */}
                    {activeSection === 'profile' && (
                        <div className="space-y-6 animate-fade-in">
                            {/* Avatar & Cover Card */}
                            <div className="bg-white rounded-2xl md:rounded-3xl p-4 md:p-8 shadow-sm border border-neutral-100 relative overflow-hidden group mx-4 md:mx-0">
                                <div className="absolute top-0 left-0 w-full h-24 md:h-32 bg-gradient-to-r from-purple-100 to-blue-50 opacity-50"></div>
                                <div className="relative pt-8 md:pt-12 flex flex-col md:flex-row items-center md:items-center gap-4 md:gap-6">
                                    <div className="relative group/avatar cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                        <div className="w-24 h-24 md:w-32 md:h-32 rounded-full p-1 bg-white ring-4 ring-white shadow-xl relative overflow-hidden">
                                            <img
                                                src={profile?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.full_name || 'U')}&background=9333ea&color=fff`}
                                                className="w-full h-full rounded-full object-cover transition-transform duration-500 group-hover/avatar:scale-110"
                                                alt="Avatar"
                                            />
                                            <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity">
                                                <svg className="w-6 h-6 md:w-8 md:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-0.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                            </div>
                                            {uploadingAvatar && (
                                                <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                                                    <LoadingSpinner size="small" />
                                                </div>
                                            )}
                                        </div>
                                        <input type="file" ref={fileInputRef} onChange={handleAvatarUpload} className="hidden" accept="image/*" />
                                    </div>
                                    <div className="flex-1 text-center md:text-left pb-2">
                                        <h3 className="text-xl md:text-2xl font-bold text-neutral-900">{profile?.full_name || 'İsimsiz Kullanıcı'}</h3>
                                        <p className="text-sm md:text-base text-neutral-500 font-medium">@{profile?.user_number || 'user'}</p>
                                    </div>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="bg-white p-5 md:p-8 rounded-2xl md:rounded-3xl shadow-sm border border-neutral-100 space-y-6 md:space-y-8 mx-4 md:mx-0">
                                <SectionHeader title="Kişisel Bilgiler" description="İlanlarınızda ve profilinizde görünecek temel bilgiler." />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <InputField
                                        label="Ad Soyad"
                                        value={formData.full_name}
                                        onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                                        required
                                        placeholder="Adınız ve Soyadınız"
                                        icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}
                                    />
                                    <InputField
                                        label="Telefon"
                                        value={formData.phone}
                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                        type="tel"
                                        placeholder="+90 555 555 55 55"
                                        icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-0.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-0.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>}
                                    />
                                    <div className="md:col-span-2">
                                        <TextArea
                                            label="Hakkımda"
                                            value={formData.bio}
                                            onChange={e => setFormData({ ...formData, bio: e.target.value })}
                                            placeholder="Ziyaretçilerinize kendinizden veya işletmenizden bahsedin..."
                                            maxLength={500}
                                        />
                                    </div>
                                </div>

                                <div className="border-t border-neutral-100" />

                                <SectionHeader title="İletişim & Adres" description="Konumunuz, ilanlarınızın harita üzerinde doğru gösterilmesi için önemlidir." />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="md:col-span-2">
                                        <InputField
                                            label="Adres"
                                            value={formData.street}
                                            onChange={e => setFormData({ ...formData, street: e.target.value })}
                                            placeholder="Mahalle, Sokak, No"
                                            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
                                        />
                                    </div>
                                    <InputField
                                        label="İlçe"
                                        value={formData.district}
                                        onChange={e => setFormData({ ...formData, district: e.target.value })}
                                        placeholder="İlçe"
                                    />
                                    <InputField
                                        label="Şehir"
                                        value={formData.city}
                                        onChange={e => setFormData({ ...formData, city: e.target.value })}
                                        placeholder="Şehir"
                                    />
                                    <InputField
                                        label="Posta Kodu"
                                        value={formData.postal_code}
                                        onChange={e => setFormData({ ...formData, postal_code: e.target.value })}
                                        placeholder="PK"
                                    />
                                </div>

                                <div className="flex justify-end pt-4">
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="w-full md:w-auto px-6 md:px-8 py-3.5 md:py-4 bg-neutral-900 text-white font-bold rounded-xl md:rounded-2xl shadow-xl shadow-neutral-200 hover:bg-black hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-3"
                                    >
                                        {saving && <LoadingSpinner size="small" />}
                                        Değişiklikleri Kaydet
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Store Section */}
                    {activeSection === 'store' && (
                        <div className="space-y-8 animate-fade-in">
                            {!isPro && !profile?.is_commercial ? (
                                <div className="bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 rounded-3xl md:rounded-[3rem] p-0.5 md:p-1 shadow-2xl overflow-hidden relative group mx-4 md:mx-0">
                                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                                    <div className="bg-white/5 backdrop-blur-3xl rounded-[1.4rem] md:rounded-[2.9rem] p-6 md:p-12 relative overflow-hidden">
                                        {/* Background Glows */}
                                        <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl group-hover:bg-purple-600/30 transition-colors duration-1000"></div>
                                        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl"></div>

                                        <div className="relative z-10 text-center max-w-2xl mx-auto">
                                            <div className="inline-block px-4 py-1.5 mb-8 text-[10px] font-black tracking-[0.2em] text-purple-400 uppercase bg-purple-500/10 rounded-full border border-purple-500/20">
                                                KURUMSAL AYRICALIKLAR
                                            </div>
                                            <h3 className="text-2xl md:text-5xl font-black text-white mb-4 md:mb-8 tracking-tight leading-tight">
                                                İşletmenizi <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-rose-400">Üst Seviyeye</span> Taşıyın
                                            </h3>
                                            <p className="text-sm md:text-lg text-white/60 mb-8 md:mb-12 leading-relaxed">
                                                ExVitrin Kurumsal ile kendi mağazanızı açın, ilan limitlerinizi genişletin ve satışlarınızı katlayın. Profesyonellerin tercihi olun.
                                            </p>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 text-left mb-10 md:mb-16">
                                                {[
                                                    { icon: '🏪', title: 'Özel Mağaza Sayfası', desc: 'Size özel URL ve tasarım' },
                                                    { icon: '📈', title: 'Yüksek İlan Limiti', desc: 'Daha fazla ürün listeleme' },
                                                    { icon: '🖼️', title: 'Logo & Banner', desc: 'Kurumsal marka kimliği' },
                                                    { icon: '👔', title: 'PRO Rozeti', desc: 'Müşterilerde güven oluşturun' }
                                                ].map((item, i) => (
                                                    <div key={i} className="flex gap-3 md:gap-4 p-3 md:p-4 rounded-xl md:rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-left">
                                                        <span className="text-2xl">{item.icon}</span>
                                                        <div>
                                                            <div className="font-bold text-white text-sm mb-1">{item.title}</div>
                                                            <div className="text-xs text-white/50">{item.desc}</div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            <button
                                                onClick={() => navigate('/packages')}
                                                className="w-full sm:w-auto px-12 py-5 bg-gradient-to-r from-purple-600 to-rose-600 text-white font-black text-lg rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-purple-500/20 flex items-center justify-center gap-3 mx-auto"
                                            >
                                                PAKETLERİ İNCELE
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-8">
                                    {/* Existing Corporate View Content starts here (Status Card etc.) */}
                                    {/* Enhanced Subscription Status Card */}
                                    {subscriptionTier && subscriptionTier !== 'free' && (
                                        <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 p-5 md:p-8 rounded-2xl md:rounded-[2.5rem] text-white shadow-xl relative overflow-hidden group mx-4 md:mx-0">
                                            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl -mr-32 -mt-32 group-hover:bg-purple-600/30 transition-colors duration-700"></div>
                                            <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl -ml-24 -mb-24"></div>

                                            <div className="relative z-10">
                                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                                                    <div className="flex items-center gap-5">
                                                        <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-3xl shadow-inner border border-white/10">
                                                            {subscriptionTier === 'unlimited' ? '💎' : subscriptionTier === 'pack2' ? '⭐' : '🚀'}
                                                        </div>
                                                        <div>
                                                            <p className="text-white/60 text-sm font-bold uppercase tracking-widest mb-1">Mevcut Planınız</p>
                                                            <h3 className="text-2xl font-black">
                                                                {subscriptionTier === 'unlimited' ? 'Sınırsız Abonelik' :
                                                                    subscriptionTier === 'pack2' ? 'Pro Kurumsal' :
                                                                        subscriptionTier === 'pack1' ? 'Başlangıç Kurumsal' : 'Standart'}
                                                            </h3>
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-col md:items-end gap-2">
                                                        {profile?.subscription_expiry && (
                                                            <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-xl border border-white/10 flex items-center gap-3">
                                                                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                                                                <span className="font-bold text-sm">
                                                                    {(() => {
                                                                        const expiry = new Date(profile.subscription_expiry);
                                                                        const now = new Date();
                                                                        const diff = expiry.getTime() - now.getTime();
                                                                        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
                                                                        return days > 0 ? `${days} GÜN KALDI` : 'SÜRESİ DOLDU';
                                                                    })()}
                                                                </span>
                                                            </div>
                                                        )}
                                                        <button
                                                            onClick={handleCancelSubscription}
                                                            disabled={saving}
                                                            className="px-4 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-[10px] font-black uppercase tracking-widest rounded-lg border border-red-500/20 transition-all active:scale-95 disabled:opacity-50"
                                                        >
                                                            İptal Et
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
                                                    <div className="bg-white/5 backdrop-blur-sm p-6 rounded-3xl border border-white/5">
                                                        <div className="flex items-center justify-between mb-4">
                                                            <p className="text-white/50 text-xs font-bold uppercase tracking-wider">İlan Kullanımı</p>
                                                            <span className="text-sm font-black text-white">
                                                                {userStats?.monthlyListings || 0} / {
                                                                    subscriptionTier === 'unlimited' ? '∞' :
                                                                        subscriptionTier === 'pack2' ? '70' :
                                                                            subscriptionTier === 'pack1' ? '40' : '20'
                                                                }
                                                            </span>
                                                        </div>
                                                        <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden mb-3">
                                                            <div
                                                                className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(147,51,234,0.5)]"
                                                                style={{ width: subscriptionTier === 'unlimited' ? '5%' : `${Math.min(100, ((userStats?.monthlyListings || 0) / (subscriptionTier === 'pack2' ? 70 : subscriptionTier === 'pack1' ? 40 : 20)) * 100)}%` }}
                                                            ></div>
                                                        </div>
                                                        <p className="text-[10px] text-white/40 font-medium italic">Son 30 gündeki aktif ilanlarınızın durumu.</p>
                                                    </div>

                                                    <div className="space-y-4 pb-2">
                                                        <div className="flex items-center justify-between px-2">
                                                            <span className="text-xs text-white/50 font-bold uppercase tracking-wider">Bitiş Tarihi:</span>
                                                            <span className="text-sm font-black text-white">
                                                                {profile?.subscription_expiry ? new Date(profile.subscription_expiry).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center justify-between px-2">
                                                            <span className="text-xs text-white/50 font-bold uppercase tracking-wider">Durum:</span>
                                                            <span className="text-sm font-black text-green-400 uppercase tracking-widest">AKTİF</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="bg-white p-5 md:p-8 rounded-2xl md:rounded-3xl shadow-sm border border-neutral-100 mx-4 md:mx-0">
                                        <SectionHeader title="Mağaza Görünümü" description="Müşterilerinizin sizi nasıl göreceğini tasarlayın." />

                                        {subscriptionTier !== 'unlimited' && (
                                            <div className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-4 text-amber-800">
                                                <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-xl shrink-0">
                                                    ⚠️
                                                </div>
                                                <p className="text-sm font-medium">
                                                    Logo ve Banner yükleme özelliği sadece <span className="font-bold underline cursor-pointer" onClick={() => navigate('/packages')}>Sınırsız Paket</span> üyeleri için geçerlidir.
                                                </p>
                                            </div>
                                        )}

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                            {/* Logo Upload */}
                                            <div className="flex flex-col gap-4">
                                                <div
                                                    onClick={() => subscriptionTier === 'unlimited' ? logoInputRef.current?.click() : navigate('/packages')}
                                                    className={`group relative border-2 border-dashed rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer transition-all w-32 h-32 mx-auto overflow-hidden ${subscriptionTier === 'unlimited'
                                                        ? 'border-neutral-200 hover:border-purple-400 hover:bg-purple-50'
                                                        : 'border-neutral-100 bg-neutral-50/50 grayscale opacity-75'
                                                        }`}
                                                >
                                                    {!isPro && subscriptionTier !== 'unlimited' && (
                                                        <div className="absolute inset-0 z-10 bg-neutral-900/5 flex items-center justify-center">
                                                            <svg className="w-5 h-5 text-neutral-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
                                                        </div>
                                                    )}
                                                    {storeLogo ? (
                                                        <img src={storeLogo} className="absolute inset-0 w-full h-full object-contain p-2 group-hover:scale-110 transition-transform duration-500" alt="Store Logo" />
                                                    ) : (
                                                        <div className="text-center group-hover:scale-110 transition-transform text-neutral-400">
                                                            <svg className="w-6 h-6 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h0.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                                            <span className="text-[10px] font-bold">Logo</span>
                                                        </div>
                                                    )}
                                                    {subscriptionTier === 'unlimited' && (
                                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <span className="text-white text-[10px] font-bold">Değiştir</span>
                                                        </div>
                                                    )}
                                                    <input type="file" ref={logoInputRef} onChange={(e) => handleStoreMediaUpload(e, 'logo')} className="hidden" accept="image/*" />
                                                </div>
                                                <div className="text-center">
                                                    <span className="font-bold text-neutral-900 text-sm block">Logonuzu Buraya Ekleyin</span>
                                                    <span className="text-xs text-neutral-400">Önerilen: 500x500px</span>
                                                </div>
                                            </div>

                                            {/* Banner Upload */}
                                            <div className="flex flex-col gap-4">
                                                <div
                                                    onClick={() => subscriptionTier === 'unlimited' ? bannerInputRef.current?.click() : navigate('/packages')}
                                                    className={`group relative border-2 border-dashed rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer transition-all aspect-[3/1] overflow-hidden ${subscriptionTier === 'unlimited'
                                                        ? 'border-neutral-200 hover:border-blue-400 hover:bg-blue-50'
                                                        : 'border-neutral-100 bg-neutral-50/50 grayscale opacity-75'
                                                        }`}
                                                >
                                                    {!isPro && subscriptionTier !== 'unlimited' && (
                                                        <div className="absolute inset-0 z-10 bg-neutral-900/5 flex items-center justify-center">
                                                            <svg className="w-5 h-5 text-neutral-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
                                                        </div>
                                                    )}
                                                    {storeBanner ? (
                                                        <img src={storeBanner} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Store Banner" />
                                                    ) : (
                                                        <div className="text-center group-hover:scale-110 transition-transform text-neutral-400">
                                                            <svg className="w-8 h-8 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h0.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                                            <span className="text-[10px] font-bold">Banner</span>
                                                        </div>
                                                    )}
                                                    {subscriptionTier === 'unlimited' && (
                                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <span className="text-white text-[10px] font-bold">Değiştir</span>
                                                        </div>
                                                    )}
                                                    <input type="file" ref={bannerInputRef} onChange={(e) => handleStoreMediaUpload(e, 'banner')} className="hidden" accept="image/*" />
                                                </div>
                                                <div className="text-center">
                                                    <span className="font-bold text-neutral-900 text-sm block">Bannerınızı Buraya Ekleyin</span>
                                                    <span className="text-xs text-neutral-400">Önerilen: 1200x400px</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            <InputField
                                                label="Mağaza Adı"
                                                value={storeName}
                                                onChange={e => setStoreName(e.target.value)}
                                                placeholder="Ör: Yıldız Otomotiv"
                                            />
                                            <TextArea
                                                label="Mağaza Açıklaması"
                                                value={storeDescription}
                                                onChange={e => setStoreDescription(e.target.value)}
                                                placeholder="Mağazanız hakkında kısa bir açıklama..."
                                                maxLength={300}
                                                rows={3}
                                            />
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <InputField
                                                    label="Web Sitesi"
                                                    value={formData.website}
                                                    onChange={e => setFormData({ ...formData, website: e.target.value })}
                                                    placeholder="www.siteniz.com"
                                                    icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>}
                                                />
                                                <InputField
                                                    label="Instagram"
                                                    value={formData.instagram_url}
                                                    onChange={e => setFormData({ ...formData, instagram_url: e.target.value })}
                                                    placeholder="instagram.com/kullanici"
                                                    icon={<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584 0.012 4.85 0.07 3.252 0.148 4.771 1.691 4.919 4.919 0.058 1.265 0.069 1.645 0.069 4.849 0 3.205-0.012 3.584-0.069 4.849-0.149 3.225-1.664 4.771-4.919 4.919-1.266 0.058-1.644 0.07-4.85 0.07-3.204 0-3.584-0.012-4.849-0.07-3.26-0.149-4.771-1.699-4.919-4.92-0.058-1.265-0.07-1.644-0.07-4.849 0-3.204 0.013-3.584 0.07-4.849 0.149-3.227 1.664-4.771 4.919-4.919 1.266-0.057 1.645-0.069 4.849-0.069zm0-2.163c-3.259 0-3.667 0.014-4.947 0.072-4.358 0.2-6.78 2.618-6.98 6.98-0.059 1.281-0.073 1.689-0.073 4.948 0 3.259 0.014 3.668 0.072 4.948 0.2 4.358 2.618 6.78 6.98 6.98 1.281 0.058 1.689 0.072 4.948 0.072 3.259 0 3.668-0.014 4.948-0.072 4.354-0.2 6.782-2.618 6.979-6.98 0.059-1.28 0.073-1.689 0.073-4.948 0-3.259-0.014-3.667-0.072-4.947-0.196-4.354-2.617-6.78-6.979-6.98-1.281-0.059-1.69-0.073-4.949-0.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-0.796 0-1.441 0.645-1.441 1.44s0.645 1.44 1.441 1.44c0.795 0 1.439-0.645 1.439-1.44s-0.644-1.44-1.439-1.44z" /></svg>}
                                                />
                                                <InputField
                                                    label="Facebook"
                                                    value={formData.facebook_url}
                                                    onChange={e => setFormData({ ...formData, facebook_url: e.target.value })}
                                                    placeholder="facebook.com/sayfa"
                                                    icon={<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-0.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>}
                                                />
                                                <InputField
                                                    label="X / Twitter"
                                                    value={formData.twitter_url}
                                                    onChange={e => setFormData({ ...formData, twitter_url: e.target.value })}
                                                    placeholder="x.com/kullanici"
                                                    icon={<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 1200 1227"><path d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.137 519.284H714.163ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.854V687.828Z" /></svg>}
                                                />
                                                <InputField
                                                    label="TikTok"
                                                    value={formData.tiktok_url}
                                                    onChange={e => setFormData({ ...formData, tiktok_url: e.target.value })}
                                                    placeholder="tiktok.com/@kullanici"
                                                    icon={<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-0.02 2.61-0.01 3.91-0.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-0.05-2.89-0.35-4.2-0.97-0.57-0.26-1.1-0.59-1.62-0.93-0.01 2.92.01 5.84-0.02 8.75-0.08 1.4-0.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-0.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-0.02-0.5-0.03-1-0.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-0.04 2.96-0.04 4.44-0.99-0.32-2.15-0.23-3.02.37-0.63.41-1.11 1.04-1.36 1.75-0.21.51-0.15 1.07-0.14 1.61.24 1.64 1.82 2.76 3.48 2.53 1.2-0.13 2.18-0.84 2.66-1.89.2-0.41.28-0.85.28-1.31-0.04-3.56-0.01-7.11-0.02-10.67z" /></svg>}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Working Hours Section */}
                                    <div className="bg-white p-5 md:p-8 rounded-2xl md:rounded-3xl shadow-sm border border-neutral-100 mx-4 md:mx-0">
                                        <SectionHeader title="Çalışma Saatleri" description="Müşterileriniz ne zaman açık olduğunuzu bilsin." />

                                        <div className="mb-6 flex items-center justify-between bg-purple-50 p-4 rounded-xl border border-purple-100">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-purple-600 shadow-sm">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                </div>
                                                <span className="font-bold text-purple-900">Her Zaman Açık (7/24)</span>
                                            </div>
                                            <Toggle
                                                active={workingHours.isAlwaysOpen}
                                                onChange={() => setWorkingHours(prev => ({ ...prev, isAlwaysOpen: !prev.isAlwaysOpen }))}
                                            />
                                        </div>

                                        <div className={`space-y-4 transition-all duration-300 ${workingHours.isAlwaysOpen ? 'opacity-50 pointer-events-none grayscale' : 'opacity-100'}`}>
                                            {['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].map((dayKey) => {
                                                const day = workingHours[dayKey];
                                                return (
                                                    <div key={dayKey} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-neutral-100 hover:border-neutral-200 hover:bg-neutral-50 transition-all group">
                                                        <div className="flex items-center justify-between sm:justify-start gap-4 min-w-[150px]">
                                                            <span className="font-bold text-neutral-700 capitalize">{t.days[dayKey] || day.name || dayKey}</span>
                                                            <Toggle
                                                                active={day.active}
                                                                onChange={() => handleWorkingHourChange(dayKey, 'active', !day.active)}
                                                            />
                                                        </div>

                                                        {day.active ? (
                                                            <div className="flex items-center gap-3 animate-fade-in">
                                                                <div className="relative">
                                                                    <input
                                                                        type="time"
                                                                        value={day.open}
                                                                        onChange={(e) => handleWorkingHourChange(dayKey, 'open', e.target.value)}
                                                                        className="px-3 py-2 bg-white border border-neutral-200 rounded-lg text-sm font-bold focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none"
                                                                    />
                                                                </div>
                                                                <span className="text-neutral-400 font-medium">-</span>
                                                                <div className="relative">
                                                                    <input
                                                                        type="time"
                                                                        value={day.close}
                                                                        onChange={(e) => handleWorkingHourChange(dayKey, 'close', e.target.value)}
                                                                        className="px-3 py-2 bg-white border border-neutral-200 rounded-lg text-sm font-bold focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none"
                                                                    />
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div className="flex-1 text-center sm:text-right">
                                                                <span className="text-sm font-bold text-neutral-400 bg-neutral-100 px-3 py-1 rounded-full">Kapalı</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        <div className="mt-8 flex justify-end">
                                            <button
                                                onClick={handleSubmit}
                                                disabled={saving}
                                                className="w-full md:w-auto px-6 md:px-8 py-3.5 md:py-4 bg-neutral-900 text-white font-bold rounded-xl md:rounded-2xl shadow-xl shadow-neutral-200 hover:bg-black hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-3"
                                            >
                                                {saving && <LoadingSpinner size="small" />}
                                                Kaydet
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Security Section */}
                    {activeSection === 'security' && (
                        <div className="space-y-6 animate-fade-in">
                            <div className="bg-white p-5 md:p-8 rounded-2xl md:rounded-3xl shadow-sm border border-neutral-100 mx-4 md:mx-0">
                                <SectionHeader
                                    title="E-posta Adresini Değiştir"
                                    description="Yeni bir e-posta adresi girdiğinizde, onaylamanız için bir doğrulama mesajı alacaksınız."
                                />

                                <form onSubmit={handleEmailChange} className="max-w-md space-y-6">
                                    <InputField
                                        label="Yeni E-posta Adresi"
                                        type="email"
                                        value={securityData.email}
                                        onChange={e => setSecurityData({ ...securityData, email: e.target.value })}
                                        placeholder="ornek@mail.com"
                                        icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
                                    />
                                    <button
                                        type="submit"
                                        disabled={changingEmail || !securityData.email || securityData.email === user.email}
                                        className="w-full sm:w-auto px-8 py-3 bg-neutral-900 text-white rounded-xl font-bold hover:bg-black transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
                                    >
                                        {changingEmail ? (
                                            <LoadingSpinner size="small" />
                                        ) : (
                                            <>
                                                <span>E-postayı Güncelle</span>
                                                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>

                            <div className="bg-white p-5 md:p-8 rounded-2xl md:rounded-3xl shadow-sm border border-neutral-100 mx-4 md:mx-0">
                                <SectionHeader
                                    title="Şifre Değiştir"
                                    description="Hesabınızın güvenliği için düzenli aralıklarla şifrenizi güncellemenizi öneririz."
                                />

                                <form onSubmit={handlePasswordChange} className="max-w-md space-y-6">
                                    <InputField
                                        label="Yeni Şifre"
                                        type="password"
                                        value={securityData.password}
                                        onChange={e => setSecurityData({ ...securityData, password: e.target.value })}
                                        placeholder="••••••••"
                                        icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>}
                                    />
                                    <InputField
                                        label="Yeni Şifre (Tekrar)"
                                        type="password"
                                        value={securityData.confirmPassword}
                                        onChange={e => setSecurityData({ ...securityData, confirmPassword: e.target.value })}
                                        placeholder="••••••••"
                                        icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-0.133-2.052-0.382-3.016z" /></svg>}
                                    />
                                    <button
                                        type="submit"
                                        disabled={changingPassword || !securityData.password}
                                        className="w-full sm:w-auto px-8 py-3 bg-neutral-900 text-white rounded-xl font-bold hover:bg-black transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
                                    >
                                        {changingPassword ? (
                                            <LoadingSpinner size="small" />
                                        ) : (
                                            <>
                                                <span>Şifreyi Güncelle</span>
                                                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>

                            <div className="bg-white p-5 md:p-8 rounded-2xl md:rounded-3xl shadow-sm border border-neutral-100 mx-4 md:mx-0">
                                <SectionHeader
                                    title="İletişim Tercihleri"
                                    description="ExVitrin ekibinin sizinle nasıl iletişim kurmasını istediğinizi seçin."
                                />
                                <div className="space-y-4">
                                    {[
                                        { label: 'E-posta Bildirimleri', desc: 'Kampanyalar ve önemli güncellemeler hakkında mail al.' },
                                        { label: 'SMS Bilgilendirme', desc: 'Acil durumlar ve hesap güvenliği için SMS al.' },
                                        { label: 'Pazarlama İletileri', desc: 'Size özel tekliflerden haberdar olun.' }
                                    ].map((item, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-3 md:p-4 bg-neutral-50 rounded-xl md:rounded-2xl border border-neutral-100 hover:border-purple-200 transition-colors group">
                                            <div>
                                                <p className="font-bold text-neutral-700">{item.label}</p>
                                                <p className="text-xs text-neutral-500">{item.desc}</p>
                                            </div>
                                            <Toggle active={true} onChange={() => { }} />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-white p-5 md:p-8 rounded-2xl md:rounded-3xl shadow-sm border border-neutral-100 mx-4 md:mx-0">
                                <SectionHeader
                                    title="Oturum Yönetimi"
                                    description="Şüpheli bir durum fark ederseniz tüm açık oturumlarınızı kapatabilirsiniz."
                                />
                                <div className="p-6 bg-red-50 rounded-2xl border border-red-100 flex flex-col sm:flex-row items-center justify-between gap-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-red-500 shadow-sm">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                                        </div>
                                        <div>
                                            <p className="font-bold text-red-900">Tüm Oturumlardan Çıkış Yap</p>
                                            <p className="text-xs text-red-600/70 font-medium">Bu işlem mevcut oturumunuz dahil her yerden çıkış yapmanızı sağlar.</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={async () => {
                                            if (window.confirm('Tüm oturumlarınız kapatılacaktır. Devam etmek istiyor musunuz?')) {
                                                const { supabase } = await import('./lib/supabase');
                                                await supabase.auth.signOut();
                                                navigate('/login');
                                            }
                                        }}
                                        className="whitespace-nowrap px-6 py-2.5 bg-white border border-red-200 text-red-600 rounded-xl font-bold hover:bg-red-600 hover:text-white transition-all shadow-sm"
                                    >
                                        Tümünü Kapat
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                    {activeSection === 'notifications' && (
                        <div className="bg-white p-5 md:p-8 rounded-2xl md:rounded-3xl shadow-sm border border-neutral-100 animate-fade-in mx-4 md:mx-0">
                            <SectionHeader title="Bildirim Tercihleri" description="Hangi konularda bildirim almak istediğinizi seçin." />

                            <div className="space-y-4">
                                {['Yeni Mesajlar', 'İlan Onayları', 'Favoriye Eklenenler', 'Fiyat Düşüşleri', 'Sistem Duyuruları'].map((item, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-3 md:p-4 bg-neutral-50 rounded-xl md:rounded-2xl border border-neutral-100 hover:border-purple-200 transition-colors group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-neutral-400 group-hover:text-purple-500 transition-colors shadow-sm">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-0.214 1.055-0.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                                            </div>
                                            <span className="font-bold text-neutral-700">{item}</span>
                                        </div>
                                        <Toggle active={true} onChange={() => { }} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </ProfileLayout>
    );
};

export default SettingsPage;
