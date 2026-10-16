import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { fetchUserProfile, updateUserProfile, getUserStats, cancelSubscription, reactivateSubscription, checkUsernameAvailability } from './api/profile';
import { checkUserListingLimit } from './api/listings';
import { clearCache } from './utils/cache';
import { t } from './translations';
import LoadingSpinner from './components/LoadingSpinner';
import ProfileLayout from './ProfileLayout';
import { useIsMobile } from './hooks/useIsMobile';
import { getSellerUrl } from './utils/slug';
import { turkeyDistricts } from './data/turkey_districts';
import { turkeyCities } from './data/turkey_cities';

const fieldBorder = (status) => {
    if (status === 'available') return 'border-emerald-600/70';
    if (status === 'unavailable' || status === 'invalid') return 'border-rose-400';
    return 'border-neutral-200 dark:border-neutral-700 focus:border-neutral-400 dark:focus:border-neutral-500';
};

const SectionHeader = ({ title, description }) => (
    <div className="mb-5 pb-3 border-b border-neutral-200 dark:border-neutral-700">
        <h2 className="text-base md:text-[17px] font-medium text-neutral-900 dark:text-neutral-100">{title}</h2>
        {description && <p className="text-neutral-500 dark:text-neutral-400 mt-1 text-sm leading-relaxed">{description}</p>}
    </div>
);

const InputField = ({ label, value, onChange, type = 'text', placeholder, required = false, icon = null, disabled = false, rightElement = null, helperText = null, status = null }) => (
    <div className="space-y-1.5">
        <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                {label} {required && <span className="text-rose-500">*</span>}
            </label>
            {status === 'available' && (
                <span className="text-xs text-emerald-700 dark:text-emerald-400">Kullanılabilir</span>
            )}
        </div>
        <div className="relative">
            {icon && (
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400 dark:text-neutral-500">
                    {React.cloneElement(icon, { className: 'w-4 h-4' })}
                </div>
            )}
            <input
                type={type}
                value={value || ''}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                disabled={disabled}
                className={`w-full ${icon ? 'pl-9' : 'pl-3'} ${rightElement ? 'pr-10' : 'pr-3'} py-2.5 bg-white dark:bg-neutral-900 border rounded-md text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-0 transition-colors duration-200 disabled:opacity-60 disabled:bg-neutral-50 dark:disabled:bg-neutral-800 ${fieldBorder(status)}`}
            />
            {rightElement && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    {rightElement}
                </div>
            )}
        </div>
        {helperText && (
            <p className={`text-xs leading-relaxed ${
                status === 'available'
                    ? 'text-emerald-700 dark:text-emerald-400'
                    : status === 'unavailable' || status === 'invalid'
                    ? 'text-rose-500 dark:text-rose-400'
                    : 'text-neutral-500 dark:text-neutral-400'
            }`}>
                {helperText}
            </p>
        )}
    </div>
);

const TextArea = ({ label, value, onChange, rows = 4, placeholder, maxLength }) => (
    <div className="space-y-1.5">
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
            {label}
        </label>
        <textarea
            value={value || ''}
            onChange={onChange}
            rows={rows}
            placeholder={placeholder}
            maxLength={maxLength}
            className="w-full px-3 py-2.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-md text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-0 focus:border-neutral-400 dark:focus:border-neutral-500 transition-colors duration-200 resize-none"
        />
        {maxLength && (
            <div className="text-right">
                <span className="text-xs text-neutral-400 dark:text-neutral-500">
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
        aria-pressed={active}
        className="relative inline-flex h-11 min-w-[44px] items-center justify-center flex-shrink-0 cursor-pointer rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400/60"
    >
        <span className={`relative inline-flex h-5 w-9 items-center rounded-full border transition-colors duration-200 ${active ? 'bg-neutral-900 border-neutral-900 dark:bg-neutral-100 dark:border-neutral-100' : 'bg-neutral-200 border-neutral-200 dark:bg-neutral-700 dark:border-neutral-600'}`}>
            <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white dark:bg-neutral-900 transition duration-200 ${active ? 'translate-x-4' : 'translate-x-0.5'}`}
            />
        </span>
    </button>
);

const SectionIcon = ({ id }) => {
    const cls = 'w-4 h-4';
    if (id === 'profile') return (
        <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
    );
    if (id === 'store') return (
        <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
    );
    if (id === 'security') return (
        <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
    );
    return (
        <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
    );
};

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
    const [usernameStatus, setUsernameStatus] = useState('idle'); // 'idle' | 'checking' | 'available' | 'unavailable' | 'invalid'
    const [usernameMessage, setUsernameMessage] = useState('');

    useEffect(() => {
        const rawUsername = (formData.username || '').trim();
        if (!rawUsername) {
            setUsernameStatus('idle');
            setUsernameMessage('');
            return;
        }

        // Kullanıcının kendi mevcut kullanıcı adı ise
        if (profile?.username && rawUsername.toLowerCase() === profile.username.toLowerCase()) {
            setUsernameStatus('available');
            setUsernameMessage('Mevcut kullanıcı adınız');
            return;
        }

        if (rawUsername.length < 3) {
            setUsernameStatus('invalid');
            setUsernameMessage('Kullanıcı adı en az 3 karakter olmalıdır');
            return;
        }

        const usernameRegex = /^[a-zA-Z0-9_.]+$/;
        if (!usernameRegex.test(rawUsername)) {
            setUsernameStatus('invalid');
            setUsernameMessage('Sadece harf, rakam, nokta ve alt çizgi kullanılabilir');
            return;
        }

        setUsernameStatus('checking');
        setUsernameMessage('Kontrol ediliyor...');

        const timer = setTimeout(async () => {
            const res = await checkUsernameAvailability(rawUsername, user?.id);
            if (res.available) {
                setUsernameStatus('available');
                setUsernameMessage('Bu kullanıcı adı boşta ve kullanılabilir');
            } else {
                setUsernameStatus('unavailable');
                setUsernameMessage(res.message || 'Bu kullanıcı adı zaten alınmış');
            }
        }, 350);

        return () => clearTimeout(timer);
    }, [formData.username, profile?.username, user?.id]);

    // Kullanıcı adı ayda 1 defa (30 günde bir) değiştirilebilir
    const getUsernameChangeInfo = () => {
        if (!profile?.username_changed_at) {
            return { canChange: true, daysRemaining: 0 };
        }
        const lastChanged = new Date(profile.username_changed_at).getTime();
        if (isNaN(lastChanged)) {
            return { canChange: true, daysRemaining: 0 };
        }
        const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;
        const diff = Date.now() - lastChanged;

        if (diff < thirtyDaysMs) {
            const daysRemaining = Math.max(1, Math.ceil((thirtyDaysMs - diff) / (24 * 60 * 60 * 1000)));
            return { canChange: false, daysRemaining };
        }
        return { canChange: true, daysRemaining: 0 };
    };

    const { canChange: canChangeUsername, daysRemaining: usernameDaysRemaining } = getUsernameChangeInfo();

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

            const { uploadToR2 } = await import('./api/storage');
            const publicUrl = await uploadToR2(optimizedFile, filePath);

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

            const { uploadToR2 } = await import('./api/storage');
            const publicUrl = await uploadToR2(optimizedFile, filePath);

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

        const isUsernameChanged = (formData.username || '').trim().toLowerCase() !== (profile?.username || '').trim().toLowerCase();

        if (isUsernameChanged) {
            if (!canChangeUsername) {
                showFeedback(`Kullanıcı adınızı ayda 1 defa değiştirebilirsiniz. Bir sonraki değişiklik için ${usernameDaysRemaining} gün kaldı.`, 'error');
                return;
            }

            if (usernameStatus === 'unavailable') {
                showFeedback('Lütfen boşta olan, farklı bir kullanıcı adı seçin.', 'error');
                return;
            }

            if (usernameStatus === 'invalid') {
                showFeedback(usernameMessage || 'Geçerli bir kullanıcı adı girin.', 'error');
                return;
            }
        }

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
                working_hours: workingHours,
                ...(isUsernameChanged ? { username_changed_at: new Date().toISOString() } : {})
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
        { id: 'profile', name: 'Profil', desc: 'Kişisel bilgiler' },
        { id: 'store', name: 'Mağaza', desc: 'Kurumsal ayarlar' },
        { id: 'security', name: 'Güvenlik', desc: 'Şifre ve giriş' },
        { id: 'notifications', name: 'Bildirimler', desc: 'Haberler' },
    ];

    if (loading || authLoading) return <LoadingSpinner size="large" fullScreen />;

    return (
        <ProfileLayout>
            <div className="max-w-4xl mx-auto pb-20">

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 md:mb-8 px-4 md:px-0">
                    <div>
                        <h1 className="text-xl md:text-2xl font-medium text-neutral-900 dark:text-neutral-100">Ayarlar</h1>
                        <p className="text-neutral-500 dark:text-neutral-400 text-sm mt-1">Hesabınızı ve tercihlerinizi yönetin.</p>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                        <Link
                            to={getSellerUrl(profile)}
                            className="inline-flex items-center gap-2 px-3 py-2 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-md text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:border-neutral-400 dark:hover:border-neutral-500 transition-colors duration-200"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                            {isPro && (profile?.subscription_expiry ? new Date(profile.subscription_expiry) > new Date() : false) ? 'Mağazamı Gör' : 'Profilimi Gör'}
                        </Link>
                        {(isPro || profile?.is_commercial) && (profile?.subscription_expiry ? new Date(profile.subscription_expiry) > new Date() : false) ? (
                            <Link
                                to={profile?.store_slug ? `/${profile.store_slug}` : `/store/${user?.id}`}
                                className="inline-flex items-center gap-2 px-3 py-2 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-md text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:border-neutral-400 dark:hover:border-neutral-500 transition-colors duration-200"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                                Mağazayı Gör
                            </Link>
                        ) : (
                            <button
                                onClick={() => navigate('/packages')}
                                className="inline-flex items-center gap-2 px-3 py-2 bg-neutral-900 dark:bg-neutral-100 border border-neutral-900 dark:border-neutral-100 rounded-md text-sm font-medium text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-white transition-colors duration-200 cursor-pointer"
                            >
                                Mağaza oluştur
                            </button>
                        )}
                    </div>
                </div>

                <div className="sticky top-[60px] md:top-24 z-30 bg-gray-50/95 dark:bg-neutral-900/95 backdrop-blur-sm mb-6 md:mb-8 px-4 md:px-0">
                    <div className="flex gap-0 overflow-x-auto no-scrollbar border-b border-neutral-200 dark:border-neutral-700">
                        {sections.map(section => {
                            const isActive = activeSection === section.id;
                            return (
                                <button
                                    key={section.id}
                                    onClick={() => setActiveSection(section.id)}
                                    className={`flex items-center gap-2 px-3 md:px-4 py-2.5 text-sm whitespace-nowrap border-b -mb-px transition-colors duration-200 cursor-pointer ${
                                        isActive
                                            ? 'border-neutral-900 dark:border-neutral-100 text-neutral-900 dark:text-neutral-100 font-medium'
                                            : 'border-transparent text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200'
                                    }`}
                                >
                                    <SectionIcon id={section.id} />
                                    {section.name}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {message && (
                    <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-md border text-sm font-medium ${
                        messageType === 'success'
                            ? 'bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-100 border-neutral-200 dark:border-neutral-600'
                            : 'bg-white dark:bg-neutral-800 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800'
                    }`}>
                        {message}
                    </div>
                )}

                <div className="space-y-6">
                    {/* Profile Section */}
                    {activeSection === 'profile' && (
                        <div className="space-y-6">
                            <div className="bg-white dark:bg-neutral-800 rounded-lg p-5 md:p-6 border border-neutral-200 dark:border-neutral-700 mx-4 md:mx-0">
                                <div className="flex flex-col sm:flex-row items-center sm:items-center gap-4">
                                    <div className="relative cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                        <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border border-neutral-200 dark:border-neutral-600 relative">
                                            <img
                                                src={profile?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.full_name || 'U')}&background=e5e5e5&color=404040`}
                                                className="w-full h-full rounded-full object-cover"
                                                alt="Avatar"
                                            />
                                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
                                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-0.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                            </div>
                                            {uploadingAvatar && (
                                                <div className="absolute inset-0 bg-white/80 dark:bg-neutral-800/80 flex items-center justify-center">
                                                    <LoadingSpinner size="small" />
                                                </div>
                                            )}
                                        </div>
                                        <input type="file" ref={fileInputRef} onChange={handleAvatarUpload} className="hidden" accept="image/*" />
                                    </div>
                                    <div className="flex-1 text-center sm:text-left">
                                        <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
                                            {profile?.username || profile?.full_name || 'İsimsiz Kullanıcı'}
                                        </h3>
                                        <p className="text-sm text-neutral-500 dark:text-neutral-400">@{profile?.user_number || 'user'}</p>
                                    </div>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-8 mx-4 md:mx-0 bg-white dark:bg-neutral-800 p-5 md:p-6 rounded-lg border border-neutral-200 dark:border-neutral-700">
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
                                            disabled={!canChangeUsername}
                                            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                                            status={canChangeUsername ? usernameStatus : null}
                                            helperText={
                                                !canChangeUsername
                                                    ? `Kullanıcı adınızı ayda 1 kez değiştirebilirsiniz. Değişiklik için ${usernameDaysRemaining} gün kaldı.`
                                                    : (usernameMessage || 'Kullanıcı adınızı 30 günde bir kez değiştirebilirsiniz.')
                                            }
                                            rightElement={
                                                !canChangeUsername ? (
                                                    <div className="w-6 h-6 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center" title={`Kullanıcı adınızı değiştirmek için ${usernameDaysRemaining} gün kaldı`}>
                                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                        </svg>
                                                    </div>
                                                ) : usernameStatus === 'checking' ? (
                                                    <div className="w-4 h-4 border border-neutral-300 border-t-neutral-700 rounded-full animate-spin" />
                                                ) : usernameStatus === 'available' ? (
                                                    <div className="w-5 h-5 rounded-full border border-emerald-600 text-emerald-600 flex items-center justify-center" title="Kullanıcı adı kullanılabilir">
                                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    </div>
                                                ) : (usernameStatus === 'unavailable' || usernameStatus === 'invalid') ? (
                                                    <div className="w-5 h-5 rounded-full border border-rose-500 text-rose-500 flex items-center justify-center" title={usernameMessage}>
                                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </div>
                                                ) : null
                                            }
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
                                        {/* Şehir */}
                                        <div className="space-y-1.5">
                                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                                Şehir
                                            </label>
                                            <div className="relative">
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                </span>
                                                <select
                                                    value={formData.city}
                                                    onChange={e => setFormData({ ...formData, city: e.target.value, district: '' })}
                                                    className="w-full pl-9 pr-8 py-2.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-md text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-0 focus:border-neutral-400 dark:focus:border-neutral-500 transition-colors duration-200 appearance-none"
                                                >
                                                    <option value="">Şehir seçin</option>
                                                    {turkeyCities.map(c => (
                                                        <option key={c.city} value={c.city}>{c.city}</option>
                                                    ))}
                                                </select>
                                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                </span>
                                            </div>
                                        </div>

                                        {/* İlçe */}
                                        <div className="space-y-1.5">
                                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                                İlçe
                                            </label>
                                            <div className="relative">
                                                <select
                                                    value={formData.district}
                                                    onChange={e => setFormData({ ...formData, district: e.target.value })}
                                                    disabled={!formData.city}
                                                    className={`w-full px-3 py-2.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-md text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-0 focus:border-neutral-400 dark:focus:border-neutral-500 transition-colors duration-200 appearance-none ${!formData.city ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                >
                                                    <option value="">{formData.city ? 'İlçe seçin' : 'Önce şehir seçin'}</option>
                                                    {(turkeyDistricts[formData.city] || []).map(d => (
                                                        <option key={d} value={d}>{d}</option>
                                                    ))}
                                                </select>
                                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                </span>
                                            </div>
                                        </div>

                                    </div>
                                </div>

                                <div className="flex justify-end pt-2 border-t border-neutral-200 dark:border-neutral-700">
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="w-full md:w-auto px-5 py-2.5 mt-4 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-sm font-medium rounded-md hover:bg-neutral-800 dark:hover:bg-white transition-colors duration-200 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
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
                        <div className="space-y-6">
                            {!isPro && !profile?.is_commercial ? (
                                <>
                                    <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 mx-4 md:mx-0 p-5 md:p-8">
                                        <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-3">Kurumsal PRO</p>
                                        <h3 className="text-xl md:text-2xl font-medium text-neutral-900 dark:text-white mb-3 leading-snug">
                                            Sadece ilan vermeyin, marka olun.
                                        </h3>
                                        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6 leading-relaxed max-w-xl">
                                            <strong className="font-medium text-neutral-900 dark:text-white">Kurumsal PRO</strong> paket ile sınırsız ilan, onaylı mağaza rozeti ve size özel vitrin tasarımı. Rakiplerinizin bir adım önüne geçin.
                                        </p>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 border border-neutral-200 dark:border-neutral-700 rounded-md overflow-hidden mb-6">
                                            {[
                                                { title: 'Kurumsal PRO', desc: 'En prestijli satıcı rozeti' },
                                                { title: 'Sınırsız İlan', desc: 'Limitsiz ürün listeleme hakkı' },
                                                { title: 'Özel Vitrin', desc: 'Size özel mağaza tasarımı' },
                                                { title: 'Onaylı Satıcı', desc: 'Mavi tik ile güven verin' }
                                            ].map((item, i) => (
                                                <div key={i} className={`p-4 ${i % 2 === 0 ? 'sm:border-r' : ''} ${i < 2 ? 'border-b' : ''} border-neutral-200 dark:border-neutral-700`}>
                                                    <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100 mb-0.5">{item.title}</div>
                                                    <div className="text-xs text-neutral-500 dark:text-neutral-400">{item.desc}</div>
                                                </div>
                                            ))}
                                        </div>
                                        <button
                                            onClick={() => navigate('/packages')}
                                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-sm font-medium rounded-md hover:bg-neutral-800 dark:hover:bg-white transition-colors duration-200 cursor-pointer"
                                        >
                                            Kurumsal PRO'ya geç
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                            </svg>
                                        </button>
                                    </div>

                                    <div className="bg-white dark:bg-neutral-800 p-5 md:p-6 rounded-lg border border-neutral-200 dark:border-neutral-700 mx-4 md:mx-0">
                                        <SectionHeader title="İlan Kullanımı" description="Standart kullanıcı olarak ilan limitleriniz ve kullanım durumunuz." />

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="p-4 rounded-md border border-neutral-200 dark:border-neutral-700">
                                                <div className="flex justify-between items-center mb-3">
                                                    <span className="text-sm text-neutral-500">Aktif kullanım</span>
                                                    <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                                                        {listingLimit?.currentCount || userStats?.monthlyListings || 0} / 20
                                                    </span>
                                                </div>
                                                <div className="h-px w-full bg-neutral-200 dark:bg-neutral-700 overflow-hidden mb-3">
                                                    <div
                                                        className="h-full bg-neutral-800 dark:bg-neutral-200 transition-all duration-300"
                                                        style={{ width: `${Math.min(100, (((listingLimit?.currentCount || userStats?.monthlyListings || 0) / 20) * 100))}%` }}
                                                    ></div>
                                                </div>
                                                <p className="text-xs text-neutral-500">Ücretsiz ilan hakkınız her 30 günde bir yenilenir.</p>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="p-4 rounded-md border border-neutral-200 dark:border-neutral-700 flex flex-col justify-center">
                                                    <span className="text-sm text-neutral-500 mb-1">Kalan hak</span>
                                                    <span className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
                                                        {Math.max(0, 20 - (listingLimit?.currentCount || userStats?.monthlyListings || 0))}
                                                    </span>
                                                </div>
                                                <div className="p-4 rounded-md border border-neutral-200 dark:border-neutral-700 flex flex-col justify-center">
                                                    <span className="text-sm text-neutral-500 mb-1">Toplam limit</span>
                                                    <span className="text-lg font-medium text-neutral-900 dark:text-neutral-100">20</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-5 pt-4 border-t border-neutral-200 dark:border-neutral-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                            <div>
                                                <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">Daha fazla ilan vermeniz mi gerekiyor?</p>
                                                <p className="text-xs text-neutral-500 mt-0.5">Kurumsal paketlerle limitlerinizi artırın.</p>
                                            </div>
                                            <button onClick={() => navigate('/packages')} className="px-4 py-2 border border-neutral-200 dark:border-neutral-600 text-neutral-800 dark:text-neutral-200 text-sm font-medium rounded-md hover:border-neutral-400 transition-colors duration-200 cursor-pointer">Paketleri incele</button>
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
                                                <div className="bg-white dark:bg-neutral-800 p-5 md:p-6 rounded-lg border border-neutral-200 dark:border-neutral-700 mx-4 md:mx-0">
                                                    <div>
                                                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-6 pb-6 border-b border-neutral-200 dark:border-neutral-700">
                                                            <div>
                                                                                <div className="flex items-center gap-2 mb-1.5">
                                                                                    <span className="text-sm text-neutral-500 dark:text-neutral-400">Mevcut planınız</span>
                                                                                    <span className="px-2 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 rounded-md">Aktif</span>
                                                                                </div>
                                                                                <h3 className="text-xl md:text-2xl font-medium text-neutral-900 dark:text-white leading-snug mb-3">
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
                                                                                            <div className="flex items-center gap-2 pr-4 border-r border-neutral-200 dark:border-neutral-700">
                                                                                                <span className="text-base font-medium text-neutral-900 dark:text-white">{listingLimit?.currentCount || 0} / {effectiveLimit}</span>
                                                                                                <span className="text-xs text-neutral-500">ilan</span>
                                                                                            </div>
                                                                                            {expiryDate && (() => {
                                                                                                const diff = expiryDate.getTime() - now.getTime();
                                                                                                const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
                                                                                                return (
                                                                                                    <div className="flex items-center gap-2">
                                                                                                        <span className="text-base font-medium text-neutral-900 dark:text-neutral-100">{days}</span>
                                                                                                        <span className="text-xs text-neutral-500">gün kaldı</span>
                                                                                                    </div>
                                                                                                );
                                                                                            })()}
                                                                                        </div>
                                                                                    );
                                                                                })()}
                                                            </div>

                                                            {displayTier !== 'free' && (
                                                                profile?.cancel_at_period_end ? (
                                                                    <button
                                                                        onClick={handleReactivateSubscription}
                                                                        disabled={saving}
                                                                        className="px-4 py-2 text-sm font-medium rounded-md border border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors duration-200 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                                                                    >
                                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                                                        Yenilemeyi Tekrar Aç
                                                                    </button>
                                                                ) : (
                                                                    <button
                                                                        onClick={handleCancelSubscription}
                                                                        disabled={saving}
                                                                        className="px-4 py-2 text-sm font-medium rounded-md border border-neutral-200 dark:border-neutral-600 text-neutral-600 dark:text-neutral-400 hover:border-neutral-400 transition-colors duration-200 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
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
                                                                    <div className="p-4 rounded-md border border-neutral-200 dark:border-neutral-700">
                                                                        <div className="flex items-center justify-between mb-3">
                                                                            <p className="text-sm text-neutral-500">İlan kullanımı</p>
                                                                            <span className="text-sm font-medium text-neutral-900 dark:text-white">
                                                                                {currentCount} / {limitStr}
                                                                            </span>
                                                                        </div>
                                                                        <div className="h-px w-full bg-neutral-200 dark:bg-neutral-700 overflow-hidden mb-3">
                                                                            <div
                                                                                className="h-full bg-neutral-800 dark:bg-neutral-200 transition-all duration-300"
                                                                                style={{ width: limitNum === Infinity ? '5%' : `${Math.min(100, (currentCount / (limitNum || 1)) * 100)}%` }}
                                                                            ></div>
                                                                        </div>
                                                                        <p className="text-xs text-neutral-500">Son 30 gündeki aktif ilanlarınızın durumu.</p>
                                                                    </div>
                                                                );
                                                            })()}

                                                            <div className="p-4 rounded-md border border-neutral-200 dark:border-neutral-700 flex flex-col justify-center">
                                                                <div className="space-y-3">
                                                                    <div className="flex items-center justify-between">
                                                                        <span className="text-sm text-neutral-500">Bitiş tarihi</span>
                                                                        <span className="text-sm font-medium text-neutral-900 dark:text-white">
                                                                            {profile?.subscription_expiry ? new Date(profile.subscription_expiry).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Süresiz'}
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex items-center justify-between pt-3 border-t border-neutral-200 dark:border-neutral-700">
                                                                        <span className="text-sm text-neutral-500">Abonelik durumu</span>
                                                                        <span className={`text-sm font-medium ${isActive ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-600'}`}>
                                                                            {isActive ? 'Aktif' : 'Süresi doldu'}
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex items-center justify-between pt-3 border-t border-neutral-200 dark:border-neutral-700">
                                                                        <span className="text-sm text-neutral-500">Yenileme</span>
                                                                        <span className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                                                                            {profile?.cancel_at_period_end ? 'Kapalı (bitişte sona erer)' : 'Açık (otomatik yenilenir)'}
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
                                                        <div className="bg-white dark:bg-neutral-800 p-5 md:p-6 rounded-lg border border-neutral-200 dark:border-neutral-700 mx-4 md:mx-0">
                                                            <SectionHeader title="Mağaza Görünümü" description="Müşterilerinizin sizi nasıl göreceğini tasarlayın." />
                                                            {(!subscriptionTier || subscriptionTier === 'free') && (
                                                                <div className="mb-5 p-3 border border-neutral-200 dark:border-neutral-700 rounded-md text-sm text-neutral-600 dark:text-neutral-400">
                                                                    Logo, banner ve özelleştirilmiş mağaza linki özellikleri <span className="underline cursor-pointer" onClick={() => navigate('/packages')}>Kurumsal Paket</span> üyeleri için geçerlidir.
                                                                </div>
                                                            )}

                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                                                <div className="flex flex-col gap-2">
                                                                    <div
                                                                        onClick={() => (subscriptionTier && subscriptionTier !== 'free') ? logoInputRef.current?.click() : navigate('/packages')}
                                                                        className={`relative border border-dashed rounded-md p-4 flex flex-col items-center justify-center cursor-pointer transition-colors duration-200 w-32 h-32 mx-auto overflow-hidden ${(subscriptionTier && subscriptionTier !== 'free') ? 'border-neutral-300 dark:border-neutral-600 hover:border-neutral-500' : 'border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 opacity-70'}`}
                                                                    >
                                                                        {storeLogo ? <img src={storeLogo} className="absolute inset-0 w-full h-full object-contain p-2" alt="Logo" /> : <div className="text-center text-neutral-400"><svg className="w-5 h-5 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h0.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg><span className="text-xs">Logo</span></div>}
                                                                        <input type="file" ref={logoInputRef} onChange={(e) => handleStoreMediaUpload(e, 'logo')} className="hidden" accept="image/*" />
                                                                    </div>
                                                                    <div className="text-center text-sm text-neutral-600 dark:text-neutral-300">Logo</div>
                                                                </div>

                                                                <div className="flex flex-col gap-2">
                                                                    <div
                                                                        onClick={() => (subscriptionTier && subscriptionTier !== 'free') ? bannerInputRef.current?.click() : navigate('/packages')}
                                                                        className={`relative border border-dashed rounded-md p-4 flex flex-col items-center justify-center cursor-pointer transition-colors duration-200 aspect-[3/1] overflow-hidden ${(subscriptionTier && subscriptionTier !== 'free') ? 'border-neutral-300 dark:border-neutral-600 hover:border-neutral-500' : 'border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 opacity-70'}`}
                                                                    >
                                                                        {storeBanner ? <img src={storeBanner} className="absolute inset-0 w-full h-full object-cover" alt="Banner" /> : <div className="text-center text-neutral-400"><svg className="w-5 h-5 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h0.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg><span className="text-xs">Banner</span></div>}
                                                                        <input type="file" ref={bannerInputRef} onChange={(e) => handleStoreMediaUpload(e, 'banner')} className="hidden" accept="image/*" />
                                                                    </div>
                                                                    <div className="text-center text-sm text-neutral-600 dark:text-neutral-300">Banner</div>
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
                                                                            <p className="text-xs text-neutral-500">Sadece Sınırsız Paket ile değiştirilebilir.</p>
                                                                        )}
                                                                    </div>
                                                                    <div className="space-y-1">
                                                                        <InputField
                                                                            label="Mağaza Linki (Slug)"
                                                                            value={formData.store_slug}
                                                                            onChange={e => setFormData({ ...formData, store_slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                                                                            placeholder="emre"
                                                                            disabled={subscriptionTier !== 'unlimited'}
                                                                            icon={<span className="text-[10px] text-neutral-400">exvitrin/</span>}
                                                                        />
                                                                        {subscriptionTier !== 'unlimited' && (
                                                                            <p className="text-xs text-neutral-500">Sadece Sınırsız Paket ile kişiselleştirilebilir.</p>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                <TextArea label="Mağaza Açıklaması" value={storeDescription} onChange={e => setStoreDescription(e.target.value)} placeholder="Mağazanız hakkında kısa bir açıklama..." maxLength={300} rows={3} />
                                                            </div>
                                                        </div>

                                                        <div className="bg-white dark:bg-neutral-800 p-5 md:p-6 rounded-lg border border-neutral-200 dark:border-neutral-700 mx-4 md:mx-0">
                                                            <SectionHeader title="Çalışma Saatleri" description="Müşterileriniz ne zaman açık olduğunuzu bilsin." />
                                                            <div className="mb-5 flex items-center justify-between p-3 rounded-md border border-neutral-200 dark:border-neutral-700">
                                                                <div className="flex items-center gap-3">
                                                                    <svg className="w-4 h-4 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                                    <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">Her zaman açık (7/24)</span>
                                                                </div>
                                                                <Toggle active={workingHours.isAlwaysOpen} onChange={() => setWorkingHours(prev => ({ ...prev, isAlwaysOpen: !prev.isAlwaysOpen }))} />
                                                            </div>

                                                            {!workingHours.isAlwaysOpen && (
                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                                                                    {Object.entries(workingHours).map(([key, day]) => {
                                                                        if (key === 'isAlwaysOpen') return null;
                                                                        return (
                                                                            <div key={key} className={`p-3 rounded-md border ${day.active ? 'border-neutral-200 dark:border-neutral-700' : 'border-neutral-100 dark:border-neutral-800 opacity-60'}`}>
                                                                                <div className="flex items-center justify-between mb-3">
                                                                                    <span className="font-medium text-sm text-neutral-900 dark:text-neutral-100">
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
                                                                                            className="flex-1 px-3 py-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-md text-xs focus:outline-none focus:ring-0 focus:border-neutral-400"
                                                                                        />
                                                                                        <span className="text-neutral-400">–</span>
                                                                                        <input
                                                                                            type="time"
                                                                                            value={day.close}
                                                                                            onChange={(e) => handleWorkingHourChange(key, 'close', e.target.value)}
                                                                                            className="flex-1 px-3 py-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-md text-xs focus:outline-none focus:ring-0 focus:border-neutral-400"
                                                                                        />
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        );
                                                                    })}
                                                                </div>
                                                            )}

                                                            <div className="mt-5 pt-4 border-t border-neutral-200 dark:border-neutral-700 flex justify-end">
                                                                <button onClick={handleSubmit} disabled={saving} className="w-full md:w-auto px-5 py-2.5 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-sm font-medium rounded-md hover:bg-neutral-800 dark:hover:bg-white transition-colors duration-200 disabled:opacity-50 cursor-pointer">Kaydet</button>
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
                        <div className="space-y-6">
                            <div className="bg-white dark:bg-neutral-800 p-5 md:p-6 rounded-lg border border-neutral-200 dark:border-neutral-700 mx-4 md:mx-0">
                                <SectionHeader
                                    title="E-posta Adresini Değiştir"
                                    description="Yeni bir e-posta adresi girdiğinizde, onaylamanız için bir doğrulama mesajı alacaksınız."
                                />

                                <form onSubmit={handleEmailChange} className="max-w-md space-y-4">
                                    <InputField
                                        label="Yeni E-posta Adresi"
                                        type="email"
                                        value={securityData.email}
                                        onChange={e => setSecurityData({ ...securityData, email: e.target.value })}
                                        placeholder="ornek@mail.com"
                                        icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
                                    />
                                    <button
                                        type="submit"
                                        disabled={changingEmail || !securityData.email || securityData.email === user.email}
                                        className="w-full sm:w-auto px-5 py-2.5 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 rounded-md text-sm font-medium hover:bg-neutral-800 dark:hover:bg-white transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                    >
                                        {changingEmail ? <LoadingSpinner size="small" /> : 'E-postayı güncelle'}
                                    </button>
                                </form>
                            </div>

                            <div className="bg-white dark:bg-neutral-800 p-5 md:p-6 rounded-lg border border-neutral-200 dark:border-neutral-700 mx-4 md:mx-0">
                                <SectionHeader
                                    title="Şifre Değiştir"
                                    description="Hesabınızın güvenliği için düzenli aralıklarla şifrenizi güncellemenizi öneririz."
                                />

                                <form onSubmit={handlePasswordChange} className="max-w-md space-y-4">
                                    <InputField
                                        label="Yeni Şifre"
                                        type="password"
                                        value={securityData.password}
                                        onChange={e => setSecurityData({ ...securityData, password: e.target.value })}
                                        placeholder="••••••••"
                                        icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>}
                                    />
                                    <InputField
                                        label="Yeni Şifre (Tekrar)"
                                        type="password"
                                        value={securityData.confirmPassword}
                                        onChange={e => setSecurityData({ ...securityData, confirmPassword: e.target.value })}
                                        placeholder="••••••••"
                                        icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-0.133-2.052-0.382-3.016z" /></svg>}
                                    />
                                    <button
                                        type="submit"
                                        disabled={changingPassword || !securityData.password}
                                        className="w-full sm:w-auto px-5 py-2.5 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 rounded-md text-sm font-medium hover:bg-neutral-800 dark:hover:bg-white transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                    >
                                        {changingPassword ? <LoadingSpinner size="small" /> : 'Şifreyi güncelle'}
                                    </button>
                                </form>
                            </div>

                            <div className="bg-white dark:bg-neutral-800 p-5 md:p-6 rounded-lg border border-neutral-200 dark:border-neutral-700 mx-4 md:mx-0">
                                <SectionHeader
                                    title="İletişim Tercihleri"
                                    description="ExVitrin ekibinin sizinle nasıl iletişim kurmasını istediğinizi seçin."
                                />
                                <div className="divide-y divide-neutral-200 dark:divide-neutral-700 border border-neutral-200 dark:border-neutral-700 rounded-md">
                                    {[
                                        { label: 'E-posta Bildirimleri', desc: 'Kampanyalar ve önemli güncellemeler hakkında mail al.' },
                                        { label: 'SMS Bilgilendirme', desc: 'Acil durumlar ve hesap güvenliği için SMS al.' },
                                        { label: 'Pazarlama İletileri', desc: 'Size özel tekliflerden haberdar olun.' }
                                    ].map((item, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-3 md:p-4">
                                            <div>
                                                <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">{item.label}</p>
                                                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">{item.desc}</p>
                                            </div>
                                            <Toggle active={true} onChange={() => { }} />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-white dark:bg-neutral-800 p-5 md:p-6 rounded-lg border border-neutral-200 dark:border-neutral-700 mx-4 md:mx-0">
                                <SectionHeader
                                    title="Oturum Yönetimi"
                                    description="Şüpheli bir durum fark ederseniz tüm açık oturumlarınızı kapatabilirsiniz."
                                />
                                <div className="p-4 rounded-md border border-rose-200 dark:border-rose-900/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                    <div>
                                        <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">Tüm oturumlardan çıkış yap</p>
                                        <p className="text-xs text-neutral-500 mt-0.5">Bu işlem mevcut oturumunuz dahil her yerden çıkış yapmanızı sağlar.</p>
                                    </div>
                                    <button
                                        onClick={async () => {
                                            if (window.confirm('Tüm oturumlarınız kapatılacaktır. Devam etmek istiyor musunuz?')) {
                                                const { supabase } = await import('./lib/supabase');
                                                await supabase.auth.signOut();
                                                navigate('/login');
                                            }
                                        }}
                                        className="whitespace-nowrap px-4 py-2 border border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-400 rounded-md text-sm font-medium hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors duration-200 cursor-pointer"
                                    >
                                        Tümünü kapat
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                    {activeSection === 'notifications' && (
                        <div className="bg-white dark:bg-neutral-800 p-5 md:p-6 rounded-lg border border-neutral-200 dark:border-neutral-700 mx-4 md:mx-0">
                            <SectionHeader title="Bildirim Tercihleri" description="Hangi konularda bildirim almak istediğinizi seçin." />

                            <div className="divide-y divide-neutral-200 dark:divide-neutral-700 border border-neutral-200 dark:border-neutral-700 rounded-md">
                                {['Yeni Mesajlar', 'İlan Onayları', 'Favoriye Eklenenler', 'Fiyat Düşüşleri', 'Sistem Duyuruları'].map((item, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-3 md:p-4">
                                        <span className="text-sm font-medium text-neutral-800 dark:text-neutral-200">{item}</span>
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
