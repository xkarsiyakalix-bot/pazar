import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { fetchUserProfile, updateUserProfile, getUserStats, cancelSubscription, reactivateSubscription } from './api/profile';
import { checkUserListingLimit } from './api/listings';
import { clearCache } from './utils/cache';
import { t } from './translations';
import LoadingSpinner from './components/LoadingSpinner';
import ProfileLayout from './ProfileLayout';
import { useIsMobile } from './hooks/useIsMobile';
import { getSellerUrl } from './utils/slug';

// Helper Components defined outside to prevent focus loss on re-render
const SectionHeader = ({ title, description }) => (
    <div className="mb-3 md:mb-4">
        <h2 className="text-lg md:text-xl font-display font-bold text-neutral-900 dark:text-neutral-100 tracking-tight">{title}</h2>
        {description && <p className="text-neutral-500 dark:text-neutral-400 mt-1 text-xs md:text-sm">{description}</p>}
    </div>
);

const InputField = ({ label, value, onChange, type = 'text', placeholder, required = false, icon = null, disabled = false }) => (
    <div className="group space-y-1.5 md:space-y-2">
        <label className="block text-[10px] md:text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider group-focus-within:text-purple-600 transition-colors">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className="relative">
            {icon && (
                <div className="absolute inset-y-0 left-0 pl-3 md:pl-4 flex items-center pointer-events-none text-neutral-400 dark:text-neutral-500 group-focus-within:text-purple-500 transition-colors">
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
                className={`w-full ${icon ? 'pl-9 md:pl-11' : 'pl-3 md:pl-4'} pr-4 py-2.5 md:py-3.5 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-white/10 rounded-xl text-sm md:text-base text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 transition-all disabled:opacity-60 disabled:bg-neutral-50 dark:disabled:bg-neutral-900`}
            />
        </div>
    </div>
);

const TextArea = ({ label, value, onChange, rows = 4, placeholder, maxLength }) => (
    <div className="group space-y-1.5 md:space-y-2">
        <label className="block text-[10px] md:text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider group-focus-within:text-purple-600 transition-colors">
            {label}
        </label>
        <textarea
            value={value || ''}
            onChange={onChange}
            rows={rows}
            placeholder={placeholder}
            maxLength={maxLength}
            className="w-full px-3 md:px-4 py-2.5 md:py-3.5 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-white/10 rounded-xl text-sm md:text-base text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 transition-all resize-none"
        />
        {maxLength && (
            <div className="text-right">
                <span className="text-[10px] md:text-xs font-medium text-neutral-400 dark:text-neutral-500">
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

    // Load all data from cache first
    const getCachedData = () => {
        try {
            const saved = sessionStorage.getItem('mySettingsData');
            return saved ? JSON.parse(saved) : null;
        } catch (e) {
            console.error('Error parsing settings cache:', e);
            return null;
        }
    };
    const cachedData = getCachedData();

    // Core State - Init from Cache
    const [profile, setProfile] = useState(cachedData?.profile || null);
    const [userStats, setUserStats] = useState(cachedData?.userStats || null);

    // Form States
    const defaultFormData = {
        username: '', full_name: '', phone: '', bio: '', street: '', postal_code: '',
        city: '', district: '', website: '', legal_info: '', seller_type: '',
        store_slug: '', facebook_url: '', instagram_url: '', twitter_url: '', tiktok_url: ''
    };
    const [formData, setFormData] = useState(cachedData?.formData || defaultFormData);

    // Store States
    const [storeName, setStoreName] = useState(cachedData?.storeSettings?.storeName || '');
    const [storeDescription, setStoreDescription] = useState(cachedData?.storeSettings?.storeDescription || '');
    const [storeLogo, setStoreLogo] = useState(cachedData?.storeSettings?.storeLogo || '');
    const [storeBanner, setStoreBanner] = useState(cachedData?.storeSettings?.storeBanner || '');
    const [isPro, setIsPro] = useState(cachedData?.storeSettings?.isPro || false);
    const [subscriptionTier, setSubscriptionTier] = useState(cachedData?.storeSettings?.subscriptionTier || '');

    // Working Hours
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
    const [workingHours, setWorkingHours] = useState(cachedData?.workingHours || defaultWorkingHours);

    // Initial Loading State based on cache presence (if we have cache, don't show loading)
    const [loading, setLoading] = useState(!cachedData);

    const [activeSection, setActiveSection] = useState('profile');

    // Activity States
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('success');
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    const [securityData, setSecurityData] = useState({ password: '', confirmPassword: '', email: '' });
    const [changingPassword, setChangingPassword] = useState(false);
    const [changingEmail, setChangingEmail] = useState(false);
    const [listingLimit, setListingLimit] = useState(null);

    // Refs
    const fileInputRef = useRef(null);
    const logoInputRef = useRef(null);
    const bannerInputRef = useRef(null);

    // Save to cache whenever data updates
    useEffect(() => {
        if (profile) {
            const cacheData = {
                profile,
                userStats,
                formData,
                storeSettings: {
                    storeName, storeDescription, storeLogo, storeBanner, isPro, subscriptionTier
                },
                workingHours
            };
            try {
                sessionStorage.setItem('mySettingsData', JSON.stringify(cacheData));
            } catch (e) {
                console.warn('Could not save settings data to cache:', e);
            }
        }
    }, [profile, userStats, formData, storeName, storeDescription, storeLogo, storeBanner, isPro, subscriptionTier, workingHours]);

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
        // Don't reload if we have profile data and it's not a forced refresh
        if (loading && !isRefresh && profile) {
            setLoading(false); // Ensure loading is false if we have data
            return;
        }

        try {
            if (!isRefresh && !profile) setLoading(true);
            const [data, stats, limitData] = await Promise.all([
                fetchUserProfile(user.id),
                getUserStats(user.id).catch(() => null),
                checkUserListingLimit(user.id).catch(() => null)
            ]);

            if (data) {
                setProfile(data);
                setUserStats(stats);
                setFormData({
                    username: data.username || '',
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

                // Merge loaded working hours with defaults to ensure all keys and names exist
                if (data.working_hours) {
                    setWorkingHours(prev => {
                        const merged = { ...prev };
                        Object.keys(data.working_hours).forEach(key => {
                            if (key !== 'isAlwaysOpen') {
                                merged[key] = {
                                    ...prev[key],
                                    ...data.working_hours[key],
                                    name: prev[key]?.name // Ensure name is preserved
                                };
                            } else {
                                merged.isAlwaysOpen = !!data.working_hours.isAlwaysOpen;
                            }
                        });
                        return merged;
                    });
                }

                if (limitData) {
                    setListingLimit(limitData);
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
            const { resizeAndOptimizeImage } = await import('./utils/imageOptimization');

            // Optimize image before upload (512x512 for avatars)
            const optimizedBlob = await resizeAndOptimizeImage(file, 512, 512, 0.9);
            const optimizedFile = new File([optimizedBlob], `${user.id}-avatar.webp`, { type: 'image/webp' });

            const fileName = `${user.id}-${Date.now()}.webp`;
            const filePath = `avatars/${fileName}`;

            const { error: uploadError } = await supabase.storage.from('profile-images').upload(filePath, optimizedFile, {
                cacheControl: '31536000',
                upsert: false,
                contentType: 'image/webp'
            });
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
            const { resizeAndOptimizeImage } = await import('./utils/imageOptimization');

            // Optimize image before upload
            // Logo: 400x400 square, Banner: 1920x600 wide
            const [maxWidth, maxHeight] = isLogo ? [400, 400] : [1920, 600];
            const optimizedBlob = await resizeAndOptimizeImage(file, maxWidth, maxHeight, 0.9);
            const optimizedFile = new File([optimizedBlob], `${user.id}-${type}.webp`, { type: 'image/webp' });

            const fileName = `${user.id}-${type}-${Date.now()}.webp`;
            const filePath = `store/${fileName}`;

            const { error: uploadError } = await supabase.storage.from('listing-images').upload(filePath, optimizedFile, {
                cacheControl: '31536000',
                upsert: false,
                contentType: 'image/webp'
            });
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

            if (cleanedData.seller_type === 'Kurumsal Kullanıcı') {
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
        if (!window.confirm('Abonelik yenilemesini kapatmak istediğinize emin misiniz? Mevcut paketiniz süre bitimine kadar aktif kalacaktır, ancak süre sonunda otomatik olarak Standart Paket\'e düşürülecektir.')) {
            return;
        }

        setSaving(true);
        try {
            await cancelSubscription(user.id);
            clearCache();
            showFeedback('Abonelik yenilemesi kapatıldı. Mevcut haklarınızı süre sonuna kadar kullanmaya devam edebilirsiniz.');
            setTimeout(() => window.location.reload(), 1500);
        } catch (error) {
            console.error('Error canceling subscription:', error);
            showFeedback('İşlem sırasında bir hata oluştu.', 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleReactivateSubscription = async () => {
        setSaving(true);
        try {
            await reactivateSubscription(user.id);
            clearCache();
            showFeedback('Abonelik yenilemesi tekrar açıldı!');
            setTimeout(() => window.location.reload(), 1500);
        } catch (error) {
            console.error('Error reactivating subscription:', error);
            showFeedback('İşlem sırasında bir hata oluştu.', 'error');
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
                            <h1 className="text-2xl md:text-3xl font-display font-bold text-neutral-900 dark:text-neutral-100">Ayarlar</h1>
                            <p className="text-neutral-500 dark:text-neutral-400 text-sm md:text-lg">Hesabınızı ve tercihlerinizi yönetin.</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Link
                                to={getSellerUrl(profile)}
                                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-white/10 rounded-xl text-sm font-bold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 hover:border-neutral-300 transition-all shadow-sm"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                {isPro && (profile?.subscription_expiry ? new Date(profile.subscription_expiry) > new Date() : false) ? 'Mağazamı Gör' : 'Profilimi Gör'}
                            </Link>
                            {(isPro || profile?.is_commercial) && (profile?.subscription_expiry ? new Date(profile.subscription_expiry) > new Date() : false) ? (
                                <Link
                                    to={profile?.store_slug ? `/${profile.store_slug}` : `/store/${user?.id}`}
                                    className="flex items-center gap-2 px-4 py-2 bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800/30 rounded-xl text-sm font-bold text-purple-700 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/40 hover:border-purple-200 transition-all shadow-sm"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                                    Mağazayı Gör
                                </Link>
                            ) : (
                                <button
                                    onClick={() => navigate('/packages')}
                                    className="relative overflow-hidden flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-amber-400 to-orange-500 rounded-xl text-sm font-black text-white shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 hover:scale-105 active:scale-95 transition-all group border border-amber-400/50"
                                >
                                    <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
                                    <span className="relative z-10 text-lg">✨</span>
                                    <span className="relative z-10">MAĞAZA OLUŞTUR</span>
                                </button>
                            )}
                            {/* Progress Indicator */}

                        </div>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="sticky top-[60px] md:top-24 z-30 bg-gray-50/95 dark:bg-neutral-900/95 backdrop-blur-sm py-2 md:py-4 mb-4 md:mb-8 px-4 md:px-0 transition-colors">
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
                                            ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 shadow-lg shadow-neutral-200 dark:shadow-none transform scale-105'
                                            : 'bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700 border border-neutral-200 dark:border-white/10 hover:border-neutral-300'
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
                    <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-xl shadow-2xl font-bold text-sm animate-fade-in-up flex items-center gap-3 backdrop-blur-md ${messageType === 'success' ? 'bg-green-600/90 text-white' : 'bg-red-600/90 text-white'
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
                            <div className="bg-white dark:bg-neutral-800 rounded-xl md:rounded-xl p-4 md:p-8 shadow-sm border border-neutral-100 dark:border-white/5 relative overflow-hidden group mx-4 md:mx-0">
                                <div className="absolute top-0 left-0 w-full h-24 md:h-32 bg-gradient-to-r from-purple-100 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/10 opacity-50"></div>
                                <div className="relative pt-8 md:pt-12 flex flex-col md:flex-row items-center md:items-center gap-4 md:gap-6">
                                    <div className="relative group/avatar cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                        <div className="w-24 h-24 md:w-32 md:h-32 rounded-full p-1 bg-white dark:bg-neutral-700 ring-4 ring-white dark:ring-neutral-700 shadow-xl relative overflow-hidden">
                                            <img
                                                src={profile?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.full_name || 'U')}&background=9333ea&color=fff`}
                                                className="w-full h-full rounded-full object-cover transition-transform duration-500 group-hover/avatar:scale-110"
                                                alt="Avatar"
                                            />
                                            <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity">
                                                <svg className="w-6 h-6 md:w-8 md:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-0.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                            </div>
                                            {uploadingAvatar && (
                                                <div className="absolute inset-0 bg-white/80 dark:bg-neutral-800/80 flex items-center justify-center">
                                                    <LoadingSpinner size="small" />
                                                </div>
                                            )}
                                        </div>
                                        <input type="file" ref={fileInputRef} onChange={handleAvatarUpload} className="hidden" accept="image/*" />
                                    </div>
                                    <div className="flex-1 text-center md:text-left pb-2">
                                        <h3 className="text-xl md:text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                                            {profile?.username || profile?.full_name || 'İsimsiz Kullanıcı'}
                                        </h3>
                                        <p className="text-sm md:text-base text-neutral-500 dark:text-neutral-400 font-medium">@{profile?.user_number || 'user'}</p>
                                    </div>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-8 md:space-y-10 mx-4 md:mx-0">
                                {/* Kişisel Bilgiler Section */}
                                <div className="space-y-4 md:space-y-5">
                                    <SectionHeader title="Kişisel Bilgiler" description="İlanlarınızda ve profilinizde görünecek temel bilgiler." />

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                        <InputField
                                            label="Ad Soyad"
                                            value={formData.full_name}
                                            onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                                            required
                                            placeholder="Adınız ve Soyadınız"
                                            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}
                                        />
                                        <InputField
                                            label="Takma İsim (Kullanıcı Adı)"
                                            value={formData.username}
                                            onChange={e => setFormData({ ...formData, username: e.target.value })}
                                            placeholder="Profilinizde görünecek takma adınız"
                                            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
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
                                </div>

                                {/* İletişim & Adres Section */}
                                <div className="space-y-4 md:space-y-5">
                                    <SectionHeader title="İletişim & Adres" description="Konumunuz, ilanlarınızın harita üzerinde doğru gösterilmesi için önemlidir." />

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
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

                                    </div>
                                </div>

                                <div className="flex justify-end pt-4">
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="w-full md:w-auto px-6 md:px-8 py-3.5 md:py-4 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 font-bold rounded-xl md:rounded-xl shadow-xl shadow-neutral-200 dark:shadow-none hover:bg-black dark:hover:bg-white hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-3"
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
                                <>
                                    <div className="bg-gradient-to-br from-amber-50/50 via-white to-orange-50/30 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900 rounded-xl md:rounded-xl p-0.5 md:p-1 shadow-2xl overflow-hidden relative group mx-4 md:mx-0 border border-amber-100 dark:border-white/5">
                                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] dark:opacity-10"></div>
                                        <div className="bg-white/60 dark:bg-white/5 backdrop-blur-3xl rounded-lg md:rounded-xl p-6 md:p-12 relative overflow-hidden">
                                            {/* Background Glows (Adaptive) */}
                                            <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-400/10 dark:bg-purple-600/20 rounded-full blur-3xl group-hover:bg-amber-400/20 dark:group-hover:bg-purple-600/30 transition-colors duration-1000"></div>
                                            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-orange-600/5 dark:bg-rose-600/10 rounded-full blur-3xl"></div>

                                            <div className="relative z-10 text-center max-w-2xl mx-auto">
                                                <div className="inline-block px-4 py-1.5 mb-8 text-[10px] font-black tracking-[0.2em] text-amber-600 dark:text-amber-400 uppercase bg-amber-500/10 rounded-full border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.1)] dark:shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                                                    ★ KURUMSAL PRO DÜNYASI ★
                                                </div>
                                                <h3 className="text-2xl md:text-5xl font-black text-neutral-900 dark:text-white mb-4 md:mb-8 tracking-tight leading-tight">
                                                    Sadece İlan Vermeyin,<br />
                                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-orange-500 to-amber-700 dark:from-amber-300 dark:via-yellow-400 dark:to-amber-500 drop-shadow-sm dark:drop-shadow-lg font-black">Marka Olun.</span>
                                                </h3>
                                                <p className="text-sm md:text-lg text-neutral-600 dark:text-white/70 mb-8 md:mb-12 leading-relaxed max-w-xl mx-auto font-medium">
                                                    <strong className="text-neutral-900 dark:text-white">Kurumsal PRO</strong> paket ile sınırsız ilan, onaylı mağaza rozeti ve size özel vitrin tasarımı. Rakiplerinizin bir adım önüne geçin.
                                                </p>

                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 text-left mb-10 md:mb-16">
                                                    {[
                                                        { icon: '👑', title: 'Kurumsal PRO', desc: 'En prestijli satıcı rozeti' },
                                                        { icon: '🚀', title: 'Sınırsız İlan', desc: 'Limitsiz ürün listeleme hakkı' },
                                                        { icon: '💎', title: 'Özel Vitrin', desc: 'Size özel mağaza tasarımı' },
                                                        { icon: '✅', title: 'Onaylı Satıcı', desc: 'Mavi tik ile güven verin' }
                                                    ].map((item, i) => (
                                                        <div key={i} className="flex gap-3 md:gap-4 p-3 md:p-4 rounded-xl md:rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 hover:border-amber-500/30 hover:bg-amber-50/50 dark:hover:bg-neutral-800 transition-all text-left group-hover:scale-[1.02] duration-300 shadow-sm dark:shadow-none">
                                                            <span className="text-2xl drop-shadow-md">{item.icon}</span>
                                                            <div>
                                                                <div className="font-bold text-neutral-900 dark:text-neutral-100 text-sm mb-1">{item.title}</div>
                                                                <div className="text-xs text-neutral-500 dark:text-neutral-400 group-hover:text-amber-700 dark:group-hover:text-neutral-300 transition-colors font-medium">{item.desc}</div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                                <button
                                                    onClick={() => navigate('/packages')}
                                                    className="relative overflow-hidden w-full sm:w-auto px-12 py-5 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-black text-lg rounded-xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-amber-500/30 hover:shadow-amber-500/50 flex items-center justify-center gap-3 mx-auto group"
                                                >
                                                    <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 skew-x-12"></div>
                                                    <span className="relative z-10">KURUMSAL PRO'YA GEÇ</span>
                                                    <svg className="w-6 h-6 relative z-10 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Standard User Listing Stats */}
                                    <div className="bg-white dark:bg-neutral-800 p-6 md:p-8 rounded-xl md:rounded-xl shadow-sm border border-neutral-100 dark:border-white/5 mx-4 md:mx-0">
                                        <SectionHeader title="İlan Kullanımı" description="Standart kullanıcı olarak ilan limitleriniz ve kullanım durumunuz." />

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                                            <div className="bg-neutral-50 dark:bg-neutral-900/50 p-6 rounded-xl border border-neutral-100 dark:border-white/5">
                                                <div className="flex justify-between items-center mb-4">
                                                    <span className="text-xs font-bold text-neutral-400 uppercase">Aktif Kullanım</span>
                                                    <span className="text-sm font-black text-neutral-900 dark:text-neutral-100">
                                                        {listingLimit?.currentCount || userStats?.monthlyListings || 0} / 20
                                                    </span>
                                                </div>
                                                <div className="h-2 w-full bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden mb-2">
                                                    <div
                                                        className="h-full bg-blue-500 rounded-full transition-all duration-1000"
                                                        style={{ width: `${Math.min(100, (((listingLimit?.currentCount || userStats?.monthlyListings || 0) / 20) * 100))}%` }}
                                                    ></div>
                                                </div>
                                                <p className="text-[10px] text-neutral-400 italic">Ücretsiz ilan hakkınız her 30 günde bir yenilenir.</p>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="bg-neutral-50 dark:bg-neutral-900/50 p-4 rounded-xl border border-neutral-100 dark:border-white/5 flex flex-col justify-center">
                                                    <span className="text-[10px] font-bold text-neutral-400 uppercase mb-1">Kalan Hak</span>
                                                    <span className="text-xl font-black text-neutral-900 dark:text-neutral-100">
                                                        {Math.max(0, 20 - (listingLimit?.currentCount || userStats?.monthlyListings || 0))}
                                                    </span>
                                                </div>
                                                <div className="bg-neutral-50 dark:bg-neutral-900/50 p-4 rounded-xl border border-neutral-100 dark:border-white/5 flex flex-col justify-center">
                                                    <span className="text-[10px] font-bold text-neutral-400 uppercase mb-1">Toplam Limit</span>
                                                    <span className="text-xl font-black text-neutral-900 dark:text-neutral-100">20</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-8 p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-900/30 rounded-xl flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-white dark:bg-neutral-800 rounded-xl flex items-center justify-center text-xl shadow-sm border border-purple-100 dark:border-purple-800/20">👑</div>
                                                <div>
                                                    <p className="text-xs font-bold text-neutral-900 dark:text-neutral-100">Daha fazla ilan vermeniz mi gerekiyor?</p>
                                                    <p className="text-[10px] text-neutral-500">Kurumsal paketlerle limitlerinizi artırın.</p>
                                                </div>
                                            </div>
                                            <button onClick={() => navigate('/packages')} className="px-4 py-2 bg-purple-600 text-white text-[10px] font-bold rounded-lg hover:bg-purple-700 transition-colors">Paketleri İncele</button>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="space-y-8">
                                    {subscriptionTier && subscriptionTier !== 'free' && (() => {
                                        const now = new Date();
                                        const expiryDate = profile?.subscription_expiry ? new Date(profile.subscription_expiry) : null;
                                        const isActive = subscriptionTier !== 'free' && (!expiryDate || expiryDate > now);
                                        const displayTier = subscriptionTier;

                                        return (
                                            <div className="space-y-8">
                                                {/* Enhanced Subscription Status Card - Adaptive Light/Dark Design */}
                                                <div className="bg-white dark:bg-neutral-900 p-6 md:p-10 rounded-xl md:rounded-xl shadow-xl shadow-neutral-200/50 dark:shadow-none border border-neutral-100 dark:border-white/10 relative overflow-hidden group mx-4 md:mx-0">
                                                    {/* Background Glows (Adaptive) */}
                                                    <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 dark:bg-purple-600/20 rounded-full blur-[100px] -mr-40 -mt-40 transition-colors duration-700"></div>
                                                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 dark:bg-blue-600/10 rounded-full blur-[100px] -ml-32 -mb-32"></div>

                                                    <div className="relative z-10">
                                                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 mb-10">
                                                            <div className="flex items-center gap-6">
                                                                {(() => {
                                                                    const icon = displayTier === 'unlimited' ? '💎' : displayTier === 'pack2' ? '⭐' : displayTier === 'pack1' ? '🚀' : '📦';
                                                                    const gradient = displayTier === 'unlimited' ? 'from-indigo-500 to-purple-600' : 'from-amber-400 to-orange-500';
                                                                    return (
                                                                        <>
                                                                            <div className={`w-20 h-20 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center text-4xl shadow-lg shadow-purple-500/20 text-white shrink-0`}>
                                                                                {icon}
                                                                            </div>
                                                                            <div>
                                                                                <div className="flex items-center gap-2 mb-1.5">
                                                                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 dark:text-neutral-500">Mevcut Planınız</span>
                                                                                    <span className="px-2 py-0.5 bg-green-500/10 text-green-600 dark:text-green-400 text-[9px] font-bold rounded-full border border-green-500/20">AKTİF</span>
                                                                                </div>
                                                                                <h3 className="text-2xl md:text-3xl font-black text-neutral-900 dark:text-white leading-none mb-3">
                                                                                    {displayTier === 'unlimited' ? 'Sınırsız Abonelik' :
                                                                                        displayTier === 'pack2' ? 'Pro Kurumsal' :
                                                                                            displayTier === 'pack1' ? 'Başlangıç Kurumsal' : 'Standart Kullanıcı'}
                                                                                </h3>
                                                                                {(() => {
                                                                                    const TIER_LIMITS = { 'free': 20, 'pack1': 40, 'pack2': 70, 'unlimited': '∞' };
                                                                                    const tierBaseLimit = TIER_LIMITS[displayTier] || 20;
                                                                                    let effectiveLimit = listingLimit ? (listingLimit.limit === 999999 ? '∞' : listingLimit.limit) : tierBaseLimit;

                                                                                    if (displayTier !== 'free' && effectiveLimit === 20 && isActive) {
                                                                                        effectiveLimit = tierBaseLimit;
                                                                                    }

                                                                                    return (
                                                                                        <div className="flex items-center gap-4">
                                                                                            <div className="flex items-center gap-2 pr-4 border-r border-neutral-200 dark:border-white/10">
                                                                                                <span className="text-lg font-black text-neutral-900 dark:text-white">{listingLimit?.currentCount || 0} / {effectiveLimit}</span>
                                                                                                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-tighter">İlan</span>
                                                                                            </div>
                                                                                            {expiryDate && (() => {
                                                                                                const diff = expiryDate.getTime() - now.getTime();
                                                                                                const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
                                                                                                return (
                                                                                                    <div className="flex items-center gap-2">
                                                                                                        <span className="text-lg font-black text-purple-600 dark:text-purple-400">{days}</span>
                                                                                                        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-tighter">GÜN KALDI</span>
                                                                                                    </div>
                                                                                                );
                                                                                            })()}
                                                                                        </div>
                                                                                    );
                                                                                })()}
                                                                            </div>
                                                                        </>
                                                                    );
                                                                })()}
                                                            </div>

                                                            {displayTier !== 'free' && (
                                                                profile?.cancel_at_period_end ? (
                                                                    <button
                                                                        onClick={handleReactivateSubscription}
                                                                        disabled={saving}
                                                                        className="px-5 py-2.5 bg-green-500/10 hover:bg-green-500/20 text-green-600 dark:text-green-400 text-xs font-bold rounded-xl border border-green-500/20 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                                                                    >
                                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                                                        Yenilemeyi Tekrar Aç
                                                                    </button>
                                                                ) : (
                                                                    <button
                                                                        onClick={handleCancelSubscription}
                                                                        disabled={saving}
                                                                        className="px-5 py-2.5 bg-neutral-100 dark:bg-white/5 hover:bg-neutral-200 dark:hover:bg-white/10 text-neutral-600 dark:text-neutral-400 text-xs font-bold rounded-xl border border-neutral-200 dark:border-white/10 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                                                                    >
                                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                                                        Yenilemeyi Kapat
                                                                    </button>
                                                                )
                                                            )}
                                                        </div>

                                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
                                                            {(() => {
                                                                const TIER_LIMITS = { 'free': 20, 'pack1': 40, 'pack2': 70, 'unlimited': '∞' };
                                                                const tierBaseLimit = TIER_LIMITS[displayTier] || 20;
                                                                let effectiveLimit = listingLimit ? listingLimit.limit : tierBaseLimit;
                                                                if (effectiveLimit === 999999) effectiveLimit = '∞';
                                                                if (displayTier !== 'free' && effectiveLimit === 20 && isActive) {
                                                                    effectiveLimit = tierBaseLimit;
                                                                }
                                                                const limitStr = effectiveLimit;
                                                                const limitNum = effectiveLimit === '∞' ? Infinity : Number(effectiveLimit);
                                                                const currentCount = listingLimit ? listingLimit.currentCount : (userStats?.monthlyListings || 0);

                                                                return (
                                                                    <div className="bg-neutral-50 dark:bg-white/5 p-6 rounded-xl border border-neutral-100 dark:border-white/5">
                                                                        <div className="flex items-center justify-between mb-4">
                                                                            <div className="flex items-center gap-2">
                                                                                <div className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]"></div>
                                                                                <p className="text-neutral-500 dark:text-white/50 text-[10px] font-black uppercase tracking-widest">İlan Kullanımı</p>
                                                                            </div>
                                                                            <span className="text-lg font-black text-neutral-900 dark:text-white">
                                                                                {currentCount} / {limitStr}
                                                                            </span>
                                                                        </div>
                                                                        <div className="h-3 w-full bg-neutral-200 dark:bg-white/10 rounded-full overflow-hidden mb-3">
                                                                            <div
                                                                                className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 rounded-full transition-all duration-1000"
                                                                                style={{ width: limitNum === Infinity ? '5%' : `${Math.min(100, (currentCount / (limitNum || 1)) * 100)}%` }}
                                                                            ></div>
                                                                        </div>
                                                                        <p className="text-[10px] text-neutral-400 dark:text-white/40 font-bold italic pl-1">Son 30 gündeki aktif ilanlarınızın durumu.</p>
                                                                    </div>
                                                                );
                                                            })()}

                                                            <div className="bg-neutral-50 dark:bg-white/5 p-6 rounded-xl border border-neutral-100 dark:border-white/5 relative overflow-hidden flex flex-col justify-center">
                                                                <div className="space-y-4">
                                                                    <div className="flex items-center justify-between">
                                                                        <div className="flex items-center gap-2">
                                                                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                                                            <span className="text-[10px] text-neutral-500 dark:text-white/50 font-black uppercase tracking-widest">Bitiş Tarihi</span>
                                                                        </div>
                                                                        <span className="text-sm font-black text-neutral-900 dark:text-white">
                                                                            {profile?.subscription_expiry ? new Date(profile.subscription_expiry).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Süresiz'}
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex items-center justify-between pt-4 border-t border-neutral-200 dark:border-white/10">
                                                                        <div className="flex items-center gap-2">
                                                                            <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                                                            <span className="text-[10px] text-neutral-500 dark:text-white/50 font-black uppercase tracking-widest">Abonelik Durumu</span>
                                                                        </div>
                                                                        <span className={`text-xs font-black uppercase tracking-[0.15em] ${isActive ? 'text-green-600 dark:text-green-400' : 'text-red-500'}`}>
                                                                            {isActive ? 'AKTİF' : 'SÜRESİ DOLDU'}
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex items-center justify-between pt-4 border-t border-neutral-200 dark:border-white/10">
                                                                        <div className="flex items-center gap-2">
                                                                            <div className={`w-2 h-2 rounded-full ${profile?.cancel_at_period_end ? 'bg-amber-500' : 'bg-green-500'}`}></div>
                                                                            <span className="text-[10px] text-neutral-500 dark:text-white/50 font-black uppercase tracking-widest">Yenileme</span>
                                                                        </div>
                                                                        <span className={`text-[10px] font-black uppercase tracking-widest ${profile?.cancel_at_period_end ? 'text-amber-600 dark:text-amber-400' : 'text-green-600 dark:text-green-400'}`}>
                                                                            {profile?.cancel_at_period_end ? 'KAPALI (Bitişte Sona Erer)' : 'AÇIK (Otomatik Yenilenir)'}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Mağaza Görünümü ve Çalışma Saatleri */}
                                                {(subscriptionTier !== 'free') && (
                                                    <>
                                                        <div className="bg-white dark:bg-neutral-800 p-5 md:p-8 rounded-xl md:rounded-xl shadow-sm border border-neutral-100 dark:border-white/10 mx-4 md:mx-0">
                                                            <SectionHeader title="Mağaza Görünümü" description="Müşterilerinizin sizi nasıl göreceğini tasarlayın." />
                                                            {(!subscriptionTier || subscriptionTier === 'free') && (
                                                                <div className="mb-8 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/30 rounded-xl flex items-center gap-4 text-amber-800 dark:text-amber-400">
                                                                    <div className="w-10 h-10 bg-amber-100 dark:bg-amber-800/30 rounded-xl flex items-center justify-center text-xl shrink-0">⚠️</div>
                                                                    <p className="text-sm font-medium">
                                                                        Logo, Banner ve Özelleştirilmiş Mağaza Linki özellikleri <span className="font-bold underline cursor-pointer" onClick={() => navigate('/packages')}>Kurumsal Paket</span> üyeleri için geçerlidir.
                                                                    </p>
                                                                </div>
                                                            )}

                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                                                <div className="flex flex-col gap-4">
                                                                    <div
                                                                        onClick={() => (subscriptionTier && subscriptionTier !== 'free') ? logoInputRef.current?.click() : navigate('/packages')}
                                                                        className={`group relative border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-all w-32 h-32 mx-auto overflow-hidden ${(subscriptionTier && subscriptionTier !== 'free') ? 'border-neutral-200 dark:border-neutral-700 hover:border-purple-400 dark:hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20' : 'border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900 grayscale opacity-75'}`}
                                                                    >
                                                                        {storeLogo ? <img src={storeLogo} className="absolute inset-0 w-full h-full object-contain p-2 group-hover:scale-110 transition-transform duration-500" alt="Logo" /> : <div className="text-center group-hover:scale-110 transition-transform text-neutral-400"><svg className="w-6 h-6 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h0.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg><span className="text-[10px] font-bold">Logo</span></div>}
                                                                        <input type="file" ref={logoInputRef} onChange={(e) => handleStoreMediaUpload(e, 'logo')} className="hidden" accept="image/*" />
                                                                    </div>
                                                                    <div className="text-center text-sm font-bold">Logo</div>
                                                                </div>

                                                                <div className="flex flex-col gap-4">
                                                                    <div
                                                                        onClick={() => (subscriptionTier && subscriptionTier !== 'free') ? bannerInputRef.current?.click() : navigate('/packages')}
                                                                        className={`group relative border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-all aspect-[3/1] overflow-hidden ${(subscriptionTier && subscriptionTier !== 'free') ? 'border-neutral-200 dark:border-neutral-700 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20' : 'border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900 grayscale opacity-75'}`}
                                                                    >
                                                                        {storeBanner ? <img src={storeBanner} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Banner" /> : <div className="text-center group-hover:scale-110 transition-transform text-neutral-400"><svg className="w-8 h-8 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h0.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg><span className="text-[10px] font-bold">Banner</span></div>}
                                                                        <input type="file" ref={bannerInputRef} onChange={(e) => handleStoreMediaUpload(e, 'banner')} className="hidden" accept="image/*" />
                                                                    </div>
                                                                    <div className="text-center text-sm font-bold">Banner</div>
                                                                </div>
                                                            </div>

                                                            <div className="space-y-6">
                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                                    <div className="space-y-1">
                                                                        <InputField
                                                                            label="Mağaza Adı"
                                                                            value={storeName}
                                                                            onChange={e => setStoreName(e.target.value)}
                                                                            placeholder="Ör: Yıldız Otomotiv"
                                                                            disabled={subscriptionTier !== 'unlimited'}
                                                                        />
                                                                        {subscriptionTier !== 'unlimited' && (
                                                                            <p className="text-[10px] text-amber-500 font-medium">Sadece Sınırsız Paket ile değiştirilebilir.</p>
                                                                        )}
                                                                    </div>
                                                                    <div className="space-y-1">
                                                                        <InputField
                                                                            label="Mağaza Linki (Slug)"
                                                                            value={formData.store_slug}
                                                                            onChange={e => setFormData({ ...formData, store_slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                                                                            placeholder="emre"
                                                                            disabled={subscriptionTier !== 'unlimited'}
                                                                            icon={<span className="text-[10px] font-black text-neutral-400">exvitrin/</span>}
                                                                        />
                                                                        {subscriptionTier !== 'unlimited' && (
                                                                            <p className="text-[10px] text-amber-500 font-medium">Sadece Sınırsız Paket ile kişiselleştirilebilir.</p>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                <TextArea label="Mağaza Açıklaması" value={storeDescription} onChange={e => setStoreDescription(e.target.value)} placeholder="Mağazanız hakkında kısa bir açıklama..." maxLength={300} rows={3} />
                                                            </div>
                                                        </div>

                                                        <div className="bg-white dark:bg-neutral-800 p-5 md:p-8 rounded-xl md:rounded-xl shadow-sm border border-neutral-100 dark:border-white/10 mx-4 md:mx-0">
                                                            <SectionHeader title="Çalışma Saatleri" description="Müşterileriniz ne zaman açık olduğunuzu bilsin." />
                                                            <div className="mb-6 flex items-center justify-between bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl border border-purple-100 dark:border-purple-800/30">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-10 h-10 rounded-full bg-white dark:bg-neutral-700 flex items-center justify-center text-purple-600 dark:text-purple-400 shadow-sm">
                                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                                    </div>
                                                                    <span className="font-bold text-purple-900 dark:text-neutral-100">Her Zaman Açık (7/24)</span>
                                                                </div>
                                                                <Toggle active={workingHours.isAlwaysOpen} onChange={() => setWorkingHours(prev => ({ ...prev, isAlwaysOpen: !prev.isAlwaysOpen }))} />
                                                            </div>

                                                            {!workingHours.isAlwaysOpen && (
                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 animate-in fade-in slide-in-from-top-4 duration-500">
                                                                    {Object.entries(workingHours).map(([key, day]) => {
                                                                        if (key === 'isAlwaysOpen') return null;
                                                                        return (
                                                                            <div key={key} className={`p-4 rounded-xl border transition-all ${day.active ? 'bg-white dark:bg-neutral-800/50 border-neutral-100 dark:border-white/5' : 'bg-neutral-50/50 dark:bg-neutral-900/30 border-transparent opacity-60'}`}>
                                                                                <div className="flex items-center justify-between mb-3">
                                                                                    <span className="font-bold text-sm text-neutral-900 dark:text-neutral-100">
                                                                                        {day.name || {
                                                                                            mon: 'Pazartesi', tue: 'Salı', wed: 'Çarşamba',
                                                                                            thu: 'Perşembe', fri: 'Cuma', sat: 'Cumartesi', sun: 'Pazar'
                                                                                        }[key]}
                                                                                    </span>
                                                                                    <Toggle active={day.active} onChange={() => handleWorkingHourChange(key, 'active', !day.active)} />
                                                                                </div>
                                                                                {day.active && (
                                                                                    <div className="flex items-center gap-2">
                                                                                        <input
                                                                                            type="time"
                                                                                            value={day.open}
                                                                                            onChange={(e) => handleWorkingHourChange(key, 'open', e.target.value)}
                                                                                            className="flex-1 px-3 py-2 bg-neutral-100 dark:bg-neutral-800 border-none rounded-lg text-xs font-bold focus:ring-2 focus:ring-purple-500"
                                                                                        />
                                                                                        <span className="text-neutral-400 font-bold">-</span>
                                                                                        <input
                                                                                            type="time"
                                                                                            value={day.close}
                                                                                            onChange={(e) => handleWorkingHourChange(key, 'close', e.target.value)}
                                                                                            className="flex-1 px-3 py-2 bg-neutral-100 dark:bg-neutral-800 border-none rounded-lg text-xs font-bold focus:ring-2 focus:ring-purple-500"
                                                                                        />
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        );
                                                                    })}
                                                                </div>
                                                            )}

                                                            <div className="mt-8 flex justify-end">
                                                                <button onClick={handleSubmit} disabled={saving} className="w-full md:w-auto px-8 py-4 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 font-bold rounded-xl hover:scale-105 transition-all disabled:opacity-50">Kaydet</button>
                                                            </div>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        );
                                    })()}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Security Section */}
                    {activeSection === 'security' && (
                        <div className="space-y-6 animate-fade-in">
                            <div className="bg-white dark:bg-neutral-800 p-5 md:p-8 rounded-xl md:rounded-xl shadow-sm border border-neutral-100 dark:border-white/5 mx-4 md:mx-0">
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
                                        className="w-full sm:w-auto px-8 py-3 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 rounded-xl font-bold hover:bg-black dark:hover:bg-white transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
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

                            <div className="bg-white dark:bg-neutral-800 p-5 md:p-8 rounded-xl md:rounded-xl shadow-sm border border-neutral-100 dark:border-white/10 mx-4 md:mx-0">
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
                                        className="w-full sm:w-auto px-8 py-3 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 rounded-xl font-bold hover:bg-black dark:hover:bg-white transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
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

                            <div className="bg-white dark:bg-neutral-800 p-5 md:p-8 rounded-xl md:rounded-xl shadow-sm border border-neutral-100 dark:border-white/10 mx-4 md:mx-0">
                                <SectionHeader
                                    title="İletişim Tercihleri"
                                    description="ExVitrin ekibinin sizinle nasıl iletişim kurmasını istediğinizi seçin."
                                />
                                <div className="space-y-4">
                                    {/* ... iterated items ... */}
                                    {[
                                        { label: 'E-posta Bildirimleri', desc: 'Kampanyalar ve önemli güncellemeler hakkında mail al.' },
                                        { label: 'SMS Bilgilendirme', desc: 'Acil durumlar ve hesap güvenliği için SMS al.' },
                                        { label: 'Pazarlama İletileri', desc: 'Size özel tekliflerden haberdar olun.' }
                                    ].map((item, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-3 md:p-4 bg-neutral-50 dark:bg-neutral-900 rounded-xl md:rounded-xl border border-neutral-100 dark:border-white/5 hover:border-purple-200 transition-colors group">
                                            <div>
                                                <p className="font-bold text-neutral-700 dark:text-neutral-200">{item.label}</p>
                                                <p className="text-xs text-neutral-500 dark:text-neutral-400">{item.desc}</p>
                                            </div>
                                            <Toggle active={true} onChange={() => { }} />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-white dark:bg-neutral-800 p-5 md:p-8 rounded-xl md:rounded-xl shadow-sm border border-neutral-100 dark:border-white/10 mx-4 md:mx-0">
                                <SectionHeader
                                    title="Oturum Yönetimi"
                                    description="Şüpheli bir durum fark ederseniz tüm açık oturumlarınızı kapatabilirsiniz."
                                />
                                <div className="p-6 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-100 dark:border-red-900/20 flex flex-col sm:flex-row items-center justify-between gap-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-white dark:bg-neutral-700 rounded-xl flex items-center justify-center text-red-500 shadow-sm">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                                        </div>
                                        <div>
                                            <p className="font-bold text-red-900 dark:text-red-400">Tüm Oturumlardan Çıkış Yap</p>
                                            <p className="text-xs text-red-600/70 dark:text-red-400/60 font-medium">Bu işlem mevcut oturumunuz dahil her yerden çıkış yapmanızı sağlar.</p>
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
                                        className="whitespace-nowrap px-6 py-2.5 bg-white dark:bg-neutral-800 border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 rounded-xl font-bold hover:bg-red-600 dark:hover:bg-red-600 hover:text-white transition-all shadow-sm"
                                    >
                                        Tümünü Kapat
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                    {activeSection === 'notifications' && (
                        <div className="bg-white dark:bg-neutral-800 p-5 md:p-8 rounded-xl md:rounded-xl shadow-sm border border-neutral-100 dark:border-white/10 animate-fade-in mx-4 md:mx-0">
                            <SectionHeader title="Bildirim Tercihleri" description="Hangi konularda bildirim almak istediğinizi seçin." />

                            <div className="space-y-4">
                                {['Yeni Mesajlar', 'İlan Onayları', 'Favoriye Eklenenler', 'Fiyat Düşüşleri', 'Sistem Duyuruları'].map((item, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-3 md:p-4 bg-neutral-50 dark:bg-neutral-900 rounded-xl md:rounded-xl border border-neutral-100 dark:border-white/5 hover:border-purple-200 transition-colors group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-white dark:bg-neutral-800 flex items-center justify-center text-neutral-400 group-hover:text-purple-500 transition-colors shadow-sm">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-0.214 1.055-0.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                                            </div>
                                            <span className="font-bold text-neutral-700 dark:text-neutral-200">{item}</span>
                                        </div>
                                        <Toggle active={true} onChange={() => { }} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </ProfileLayout >
    );
};

export default SettingsPage;
