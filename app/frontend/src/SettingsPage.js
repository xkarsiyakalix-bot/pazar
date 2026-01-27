import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { fetchUserProfile, updateUserProfile, getUserStats, cancelSubscription, deleteUserProfile } from './api/profile';
import { t } from './translations';
import LoadingSpinner from './components/LoadingSpinner';

import ProfileLayout from './ProfileLayout';
import { useIsMobile } from './hooks/useIsMobile';

const SettingsPage = () => {
    const isMobile = useIsMobile();
    const { user, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeSection, setActiveSection] = useState('profile');
    const [formData, setFormData] = useState({
        full_name: '',
        phone: '',
        bio: '',
        street: '',
        postal_code: '',
        city: '',
        website: '',
        legal_info: '',
        seller_type: '',
        store_slug: ''
    });
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    const fileInputRef = useRef(null);
    const logoInputRef = useRef(null);
    const bannerInputRef = useRef(null);

    // Store Management States
    const [storeName, setStoreName] = useState('');
    const [storeDescription, setStoreDescription] = useState('');
    const [storeLogo, setStoreLogo] = useState('');
    const [storeBanner, setStoreBanner] = useState('');
    const [isPro, setIsPro] = useState(false);
    const [workingHours, setWorkingHours] = useState({
        mon: { open: '09:00', close: '18:00', active: true },
        tue: { open: '09:00', close: '18:00', active: true },
        wed: { open: '09:00', close: '18:00', active: true },
        thu: { open: '09:00', close: '18:00', active: true },
        fri: { open: '09:00', close: '18:00', active: true },
        sat: { id: 'sat', name: 'Cumartesi', open: '10:00', close: '16:00', active: true },
        sun: { open: '09:00', close: '18:00', active: false },
        isAlwaysOpen: false
    });

    // Subscription & Stats
    const [userStats, setUserStats] = useState(null);

    // Email change states
    const [showEmailModal, setShowEmailModal] = useState(false);
    const [newEmail, setNewEmail] = useState('');
    const [emailPassword, setEmailPassword] = useState('');
    const [emailMessage, setEmailMessage] = useState('');

    // Password change states
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordMessage, setPasswordMessage] = useState('');

    const sections = [
        { id: 'profile', name: 'Profil', icon: '👤' },
        { id: 'security', name: 'Güvenlik', icon: '🔒' },
        { id: 'privacy', name: 'Gizlilik', icon: '🔐' },
        { id: 'notifications', name: 'Bildirimler', icon: '🔔' },
    ];

    useEffect(() => {
        if (authLoading) return;
        if (!user) {
            navigate('/login');
            return;
        }
        // Only load if not already loaded OR if user changed
        if (!profile || profile.id !== user.id) {
            loadProfile();
        }
    }, [user?.id, authLoading, navigate]); // Use user.id for stability

    const loadProfile = async (isRefresh = false) => {
        if (loading && !isRefresh && profile) return; // Prevent double loading

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
                if (data.working_hours) {
                    setWorkingHours(data.working_hours);
                }
            }
        } catch (error) {
            console.error('Error loading profile:', error);
            setMessage('Profil bilgileri yüklenirken bir hata oluştu.');
        } finally {
            setLoading(false);
        }
    };

    const handleAvatarUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            setMessage('Dosya çok büyük. Maksimum 2MB izin veriliyor.');
            return;
        }

        if (!file.type.startsWith('image/')) {
            setMessage('Lütfen bir resim dosyası seçin.');
            return;
        }

        setUploadingAvatar(true);
        setMessage('');

        try {
            const { supabase } = await import('./lib/supabase');
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                setMessage('Giriş yapmış olmanız gerekiyor.');
                return;
            }

            const fileExt = file.name.split('.').pop();
            const fileName = `${user.id}-${Date.now()}.${fileExt}`;
            const filePath = `avatars/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('profile-images')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('profile-images')
                .getPublicUrl(filePath);

            await updateUserProfile(profile.id, { avatar_url: publicUrl });

            setMessage('Profil resmi başarıyla güncellendi!');
            loadProfile();
        } catch (error) {
            console.error('Error uploading avatar:', error);
            setMessage('Resim yüklenirken hata oluştu.');
        } finally {
            setUploadingAvatar(false);
        }
    };

    const handleStoreMediaUpload = async (e, type) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            setMessage('Dosya çok büyük. Maksimum 5MB izin veriliyor.');
            return;
        }

        // Check subscription tier
        if (!profile?.subscription_tier || profile.subscription_tier === 'free') {
            if (window.confirm('Logo ve Banner yüklemek için Kurumsal/Premium pakete geçmeniz gerekmektedir. Paketleri şimdi incelemek ister misiniz?')) {
                navigate('/packages');
            }
            e.target.value = ''; // Reset input
            return;
        }

        const isLogo = type === 'logo';
        setSaving(true);
        setMessage('');

        try {
            const { supabase } = await import('./lib/supabase');
            const { data: { user: currentUser } } = await supabase.auth.getUser();

            if (!currentUser) {
                setMessage('Giriş yapmış olmanız gerekiyor.');
                return;
            }

            const fileExt = file.name.split('.').pop();
            const fileName = `${currentUser.id}-${type}-${Date.now()}.${fileExt}`;
            const filePath = `store/${fileName}`;

            // Try 'listing-images' bucket which is know to work for many types of content
            const { error: uploadError } = await supabase.storage
                .from('listing-images')
                .upload(filePath, file);

            if (uploadError) {
                console.error(`Upload error details for ${type}:`, uploadError);
                throw new Error(uploadError.message || 'Yükleme başarısız oldu.');
            }

            const { data: { publicUrl } } = supabase.storage
                .from('listing-images')
                .getPublicUrl(filePath);

            if (isLogo) {
                setStoreLogo(publicUrl);
            } else {
                setStoreBanner(publicUrl);
            }

            setMessage(`${isLogo ? 'Logo' : 'Afiş'} başarıyla seçildi! Değişikliklerin kaydedilmesi için lütfen "Kaydet" butonuna basın.`);
        } catch (error) {
            console.error(`Error uploading ${type}:`, error);
            setMessage(`Hata: ${error.message || 'Resim yüklenirken bir problem oluştu.'}`);
        } finally {
            setSaving(false);
            // Reset input value to allow selecting the same file again if needed
            e.target.value = '';
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage('');

        try {
            const cleanedData = Object.fromEntries(
                Object.entries(formData).map(([key, value]) => {
                    if (value === '') return [key, null];
                    return [key, value];
                })
            );

            // Sync is_commercial flag if seller_type is corporate
            if (cleanedData.seller_type === 'Gewerblicher Nutzer') {
                cleanedData.is_commercial = true;
            }

            // Include store management fields and working hours
            const finalUpdates = {
                ...cleanedData,
                store_name: storeName,
                store_description: storeDescription,
                store_logo: storeLogo,
                store_banner: storeBanner,
                working_hours: workingHours
            };

            await updateUserProfile(profile.id, finalUpdates);
            setMessage('✅ Değişiklikler Kaydedildi!');
            loadProfile(true);
            // Clear message after 5 seconds
            setTimeout(() => setMessage(''), 5000);
        } catch (error) {
            console.error('Error saving profile:', error);
            setMessage(`Kaydedilirken hata oluştu: ${error.message || JSON.stringify(error)}`);
        } finally {
            setSaving(false);
        }
    };


    const handleEmailChange = async (e) => {
        e.preventDefault();
        setEmailMessage('');

        if (!newEmail) {
            setEmailMessage('Lütfen yeni bir e-posta adresi girin.');
            return;
        }

        try {
            const { supabase } = await import('./lib/supabase');
            const { error } = await supabase.auth.updateUser({ email: newEmail });

            if (error) throw error;

            setEmailMessage('E-posta adresi başarıyla değiştirildi! Lütfen onay için yeni e-postanızı kontrol edin.');
            setTimeout(() => {
                setShowEmailModal(false);
                setNewEmail('');
                setEmailPassword('');
                setEmailMessage('');
            }, 3000);
        } catch (error) {
            console.error('Error changing email:', error);
            setEmailMessage(`Hata: ${error.message}`);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setPasswordMessage('');

        if (!currentPassword || !newPassword || !confirmPassword) {
            setPasswordMessage('Lütfen tüm alanları doldurun.');
            return;
        }

        if (newPassword !== confirmPassword) {
            setPasswordMessage('Yeni şifreler eşleşmiyor.');
            return;
        }

        if (newPassword.length < 6) {
            setPasswordMessage('Yeni şifre en az 6 karakter uzunluğunda olmalıdır.');
            return;
        }

        try {
            const { supabase } = await import('./lib/supabase');
            const { error } = await supabase.auth.updateUser({ password: newPassword });

            if (error) throw error;

            setPasswordMessage('Şifre başarıyla değiştirildi!');
            setTimeout(() => {
                setShowPasswordModal(false);
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
                setPasswordMessage('');
            }, 2000);
        } catch (error) {
            console.error('Error changing password:', error);
            setPasswordMessage(`Hata: ${error.message}`);
        }
    };

    const handleCancelSubscription = async () => {
        if (!window.confirm('Kurumsal aboneliğinizi iptal etmek istediğinize emin misiniz? Bu işlem sonucunda ilan limitleriniz standart seviyeye düşecek ve mağaza özellikleriniz devre dışı kalacaktır.')) {
            return;
        }

        try {
            setSaving(true);
            await cancelSubscription(user.id);
            setMessage('✅ Aboneliğiniz başarıyla iptal edildi ve hesabınız bireye dönüştürüldü.');
            loadProfile(true);
        } catch (error) {
            console.error('Error cancelling subscription:', error);
            setMessage(`Hata: ${error.message}`);
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteAccount = async () => {
        const confirm1 = window.confirm('HESABINIZI KAPATMAK ÜZERESİNİZ. Tüm ilanlarınız, mesajlarınız ve profil bilgileriniz silinecektir. Devam etmek istiyor musunuz?');
        if (!confirm1) return;

        const confirm2 = window.prompt('Onaylamak için lütfen "HESABIMI SİL" yazın:');
        if (confirm2 !== 'HESABIMI SİL') {
            alert('Yanlış kelime girdiniz, işlem iptal edildi.');
            return;
        }

        try {
            setSaving(true);
            await deleteUserProfile(user.id);
            alert('Hesabınız başarıyla kapatıldı. Aramızdan ayrıldığınız için üzgünüz.');
            navigate('/');
        } catch (error) {
            console.error('Error deleting account:', error);
            setMessage(`Hesap silinirken hata oluştu: ${error.message}`);
            setSaving(false);
        }
    };


    // Helper to calculate limits
    const getPackageLimit = (tier) => {
        switch (tier) {
            case 'unlimited': return Infinity;
            case 'pack2': return 70; // Pro
            case 'pack1': return 40; // Basic
            case 'free': return 20;
            default: return 20;
        }
    };

    const getPackageName = (tier) => {
        switch (tier) {
            case 'unlimited': return 'Sınırsız Paket';
            case 'pack2': return 'Pro Kurumsal';
            case 'pack1': return 'Temel Kurumsal';
            case 'free': return 'Standart (Ücretsiz)';
            default: return 'Standart (Ücretsiz)';
        }
    };

    // Calculate next limit reset date based on user registration date
    const getNextLimitResetDate = () => {
        if (!profile?.created_at) return null;

        const createdDate = new Date(profile.created_at);
        const today = new Date();
        const resetDay = createdDate.getDate();

        // Calculate next reset date
        let nextReset = new Date(today.getFullYear(), today.getMonth(), resetDay);

        // If this month's reset day has passed, move to next month
        if (nextReset <= today) {
            nextReset = new Date(today.getFullYear(), today.getMonth() + 1, resetDay);
        }

        // Handle edge case where reset day doesn't exist in next month (e.g., Jan 31 -> Feb 28)
        if (nextReset.getDate() !== resetDay) {
            // Set to last day of the month
            nextReset = new Date(nextReset.getFullYear(), nextReset.getMonth() + 1, 0);
        }

        return nextReset;
    };

    if (loading || authLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <LoadingSpinner size="large" />
            </div>
        );
    }

    const packageLimit = getPackageLimit(profile?.subscription_tier);
    const extraLimit = profile?.extra_paid_listings || 0;
    const totalLimit = packageLimit === Infinity ? Infinity : packageLimit + extraLimit;
    const activeListings = userStats?.activeListings || 0;
    const monthlyListings = userStats?.monthlyListings || 0;
    const remainingLimit = totalLimit === Infinity ? 'Sınırsız' : Math.max(0, totalLimit - monthlyListings);

    // Check if user is on free tier
    const isFreeTier = !profile?.subscription_tier || profile.subscription_tier === 'free';

    return (
        <ProfileLayout>
            {isMobile && (
                <button
                    onClick={() => navigate(-1)}
                    className="mb-4 flex items-center gap-1.5 text-gray-500 hover:text-gray-900 font-bold bg-white px-3 py-1.5 rounded-lg shadow-sm border border-gray-100 text-xs"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Geri
                </button>
            )}
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Ayarlar</h1>

            <div className="space-y-6">
                {/* Section Tabs */}
                <div className="flex gap-2 mb-6 border-b border-gray-200 overflow-x-auto">
                    {sections.map(section => (
                        <button
                            key={section.id}
                            onClick={() => setActiveSection(section.id)}
                            className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold transition-colors whitespace-nowrap ${activeSection === section.id
                                ? 'text-red-600 border-b-2 border-red-600'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            <span className="mr-1.5 sm:mr-2">{section.icon}</span>
                            {section.name}
                        </button>
                    ))}
                </div>

                {message && (
                    <div className={`mb-4 p-4 rounded-lg ${message.includes('başarıyla') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                        {message}
                    </div>
                )}

                {/* Profile Section */}
                {activeSection === 'profile' && (
                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Account Type Selection */}
                        <div className="sm:bg-blue-50/50 p-0 sm:p-4 sm:rounded-xl sm:border sm:border-blue-100">
                            <h3 className="text-sm font-bold text-gray-900 mb-1.5">Hesap Türü *</h3>
                            <p className="text-[11px] text-gray-600 mb-3 border-b border-blue-100/50 pb-3">
                                Lütfen hesap türünüzü seçin. <span className="font-bold text-red-600">Not:</span> "Kurumsal" hesaptan tekrar "Bireysel" hesaba geçiş yapılamaz.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, seller_type: 'Privatnutzer' })}
                                    className={`p-3 rounded-xl border-2 text-left transition-all ${formData.seller_type === 'Privatnutzer'
                                        ? 'border-red-600 bg-red-50'
                                        : 'border-gray-200 bg-white hover:border-red-200'
                                        }`}
                                >
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-lg">👤</span>
                                        <span className={`text-sm font-bold ${formData.seller_type === 'Privatnutzer' ? 'text-red-600' : 'text-gray-900'}`}>
                                            Bireysel
                                        </span>
                                    </div>
                                    <p className="text-[10px] leading-tight text-gray-500">
                                        Özel satışlar ve alışverişler için. Ücretsiz.
                                    </p>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => {
                                        if (window.confirm('Kurumsal hesaba geçmek için bir abonelik paketi seçmeniz gerekmektedir. Paketleri incelemek için yönlendiriliyorsunuz.')) {
                                            navigate('/packages');
                                        }
                                    }}
                                    className={`p-3 rounded-xl border-2 text-left transition-all ${formData.seller_type === 'Gewerblicher Nutzer'
                                        ? 'border-blue-600 bg-blue-50'
                                        : 'border-gray-200 bg-white hover:border-blue-200'
                                        }`}
                                >
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-lg">🏢</span>
                                        <span className={`text-sm font-bold ${formData.seller_type === 'Gewerblicher Nutzer' ? 'text-blue-600' : 'text-gray-900'}`}>
                                            Kurumsal
                                        </span>
                                    </div>
                                    <p className="text-[10px] leading-tight text-gray-500">
                                        Ticari satıcılar için. Fatura ile.
                                    </p>
                                </button>
                            </div>
                        </div>

                        {/* Form Fields */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Ad Soyad *</label>
                            <input
                                type="text"
                                value={formData.full_name}
                                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-transparent"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Telefon</label>
                            <input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Hakkımda</label>
                            <textarea
                                value={formData.bio}
                                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                rows={4}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-transparent"
                                placeholder="Kendinizden bahsedin..."
                            />
                            <p className="text-sm text-gray-500 mt-1">{formData.bio.length}/500 karakter</p>
                        </div>

                        <div className="pt-6 border-t border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Adres</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Sokak ve Kapı Numarası</label>
                                    <input
                                        type="text"
                                        value={formData.street}
                                        onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-transparent"
                                        placeholder="Örnek Sokak No: 123"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Şehir</label>
                                    <input
                                        type="text"
                                        value={formData.city}
                                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-transparent"
                                        placeholder="İstanbul"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Web sitesi (isteğe bağlı)</label>
                                    <input
                                        type="text"
                                        value={formData.website}
                                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-transparent"
                                        placeholder="https://example.com"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Remove redundant middle button, it will be at the bottom now */}

                        {/* Mağaza Ayarları Section (For PRO or Commercial users) */}
                        {(isPro || (profile && profile.is_commercial)) && (
                            <div className="pt-8 border-t border-gray-200">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-bold text-gray-900">{t.store.title}</h2>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (formData.store_slug && profile?.subscription_tier === 'unlimited') {
                                                window.open(`/${formData.store_slug}`, '_blank');
                                            } else {
                                                window.open(`/store/${profile.id}`, '_blank');
                                            }
                                        }}
                                        className="text-red-600 hover:text-red-700 font-medium text-sm flex items-center gap-1"
                                    >
                                        {t.store.preview}
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                    </button>
                                </div>

                                {/* Subscription Status Card - NEW */}
                                <div className="sm:bg-gradient-to-br sm:from-gray-50 sm:to-gray-100 sm:rounded-xl sm:border sm:border-gray-200 p-0 mb-6 sm:p-6 sm:mb-8 text-sm">
                                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <span className="text-xl">💳</span> Abonelik Durumu
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <p className="text-sm text-gray-500 mb-1">Mevcut Paket</p>
                                            <p className="text-sm font-bold text-gray-900">
                                                {getPackageName(profile?.subscription_tier)}
                                            </p>

                                            {/* Subscription Expiry Date Display */}
                                            {profile?.subscription_expiry ? (
                                                <div className="mt-4 p-3 bg-blue-50/50 rounded-lg border border-blue-100">
                                                    <p className="text-xs text-blue-600 font-bold uppercase tracking-wider mb-1">
                                                        Bitiş Tarihi
                                                    </p>
                                                    <p className="text-sm font-medium text-gray-700">
                                                        {new Date(profile.subscription_expiry).toLocaleDateString('tr-TR', {
                                                            day: 'numeric',
                                                            month: 'long',
                                                            year: 'numeric'
                                                        })}
                                                    </p>
                                                </div>
                                            ) : (
                                                <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
                                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">
                                                        Bitiş Tarihi
                                                    </p>
                                                    <p className="text-sm font-medium text-gray-400 italic">
                                                        Süresiz / Belirtilmedi
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 mb-1">İlan Limitleri</p>
                                            <div className="flex flex-col gap-1">
                                                <div className="flex justify-between text-xs sm:text-sm">
                                                    <span>Toplam Limit:</span>
                                                    <span className="font-semibold">{totalLimit === Infinity ? 'Sınırsız' : totalLimit}</span>
                                                </div>
                                                <div className="flex justify-between text-xs sm:text-sm">
                                                    <span>Bu Ayki İlanlar (Son 30 Gün):</span>
                                                    <span className="font-semibold text-blue-600">{monthlyListings}</span>
                                                </div>
                                                <div className="flex justify-between text-xs sm:text-sm">
                                                    <span>Toplam Aktif İlan:</span>
                                                    <span className="text-gray-600">{activeListings}</span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                                    <div
                                                        className={`h-2 rounded-full ${remainingLimit === 0 ? 'bg-red-500' : 'bg-green-500'}`}
                                                        style={{
                                                            width: totalLimit === Infinity ? '0%' : `${Math.min(100, (monthlyListings / totalLimit) * 100)}%`
                                                        }}
                                                    ></div>
                                                </div>
                                                <div className="flex justify-between text-xs sm:text-sm mt-1">
                                                    <span className="font-medium text-gray-700">Kalan Ekleme Hakkı:</span>
                                                    <span className={`font-bold ${remainingLimit === 0 ? 'text-red-600' : 'text-green-600'}`}>
                                                        {remainingLimit}
                                                    </span>
                                                </div>

                                                {/* Limit Reset Date for All Users */}
                                                {(() => {
                                                    const nextResetDate = getNextLimitResetDate();
                                                    if (!nextResetDate || totalLimit === Infinity) return null;

                                                    const currentPackageLimit = getPackageLimit(profile?.subscription_tier);

                                                    return (
                                                        <div className={`mt-3 p-3 rounded-lg border ${remainingLimit === 0 || remainingLimit === '0'
                                                            ? 'bg-amber-50/50 border-amber-200'
                                                            : 'bg-blue-50/50 border-blue-100'
                                                            }`}>
                                                            <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${remainingLimit === 0 || remainingLimit === '0'
                                                                ? 'text-amber-700'
                                                                : 'text-blue-600'
                                                                }`}>
                                                                {remainingLimit === 0 || remainingLimit === '0'
                                                                    ? '⏰ Limit Sıfırlanacak'
                                                                    : '📅 Sonraki Sıfırlama'
                                                                }
                                                            </p>
                                                            <p className="text-sm font-medium text-gray-700">
                                                                {nextResetDate.toLocaleDateString('tr-TR', {
                                                                    day: 'numeric',
                                                                    month: 'long',
                                                                    year: 'numeric'
                                                                })}
                                                            </p>
                                                            {(remainingLimit === 0 || remainingLimit === '0') && (
                                                                <p className="text-xs text-gray-600 mt-1">
                                                                    Bu tarihte {currentPackageLimit === Infinity ? 'sınırsız' : currentPackageLimit} yeni ilan hakkı kazanacaksınız.
                                                                </p>
                                                            )}
                                                        </div>
                                                    );
                                                })()}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                                        {!isFreeTier && (
                                            <button
                                                type="button"
                                                onClick={handleCancelSubscription}
                                                className="text-xs font-bold text-red-500 hover:text-red-700 bg-red-50 px-3 py-1.5 rounded-lg border border-red-100 transition-colors"
                                            >
                                                Aboneliği İptal Et
                                            </button>
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => navigate('/packages')}
                                            className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors border border-indigo-100 ml-auto"
                                        >
                                            Paket Yükselt / Süreyi Uzat
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">{t.store.name}</label>
                                    <input
                                        type="text"
                                        value={storeName}
                                        onChange={(e) => setStoreName(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-transparent"
                                        placeholder="Mağaza adınızı girin"
                                    />
                                </div>

                                <div className="mb-6">
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="block text-xs sm:text-sm font-medium text-gray-700">Mağaza URL Uzantısı</label>
                                        {profile?.subscription_tier !== 'unlimited' && (
                                            <span className="text-[10px] text-amber-600 font-bold flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
                                                🔒 Sadece SINIRSIZ Paket
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center">
                                        <div className="bg-gray-100 border border-r-0 border-gray-300 px-3 py-3 rounded-l-lg text-sm text-gray-500 font-medium">
                                            exvitrin.com/
                                        </div>
                                        <input
                                            type="text"
                                            value={formData.store_slug}
                                            onChange={(e) => {
                                                const val = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
                                                setFormData({ ...formData, store_slug: val });
                                            }}
                                            disabled={profile?.subscription_tier !== 'unlimited'}
                                            className={`flex-1 px-4 py-3 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-red-400 focus:border-transparent ${profile?.subscription_tier !== 'unlimited' ? 'bg-gray-50 cursor-not-allowed opacity-60' : ''}`}
                                            placeholder="magaza-adin"
                                        />
                                    </div>
                                    <p className="text-[11px] text-gray-500 mt-2 italic px-1">
                                        * Sadece küçük harf, rakam ve tire (-) içerebilir.
                                    </p>
                                    {formData.store_slug && profile?.subscription_tier === 'unlimited' && (
                                        <div className="mt-4 p-4 bg-green-50 rounded-2xl border border-green-200 shadow-sm">
                                            <div className="flex items-center justify-between mb-3">
                                                <div>
                                                    <p className="text-[10px] text-green-600 font-bold uppercase tracking-wider mb-1">Mağaza Adresiniz</p>
                                                    <p className="text-sm font-black text-gray-900">exvitrin.com/{formData.store_slug}</p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const url = `https://exvitrin.com/${formData.store_slug}`;
                                                        navigator.clipboard.writeText(url).then(() => {
                                                            alert('Link kopyalandı!');
                                                        });
                                                    }}
                                                    className="p-2 hover:bg-green-100 rounded-lg transition-colors text-green-600"
                                                    title="Linki Kopyala"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                                                    </svg>
                                                </button>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => window.open(`/${formData.store_slug}`, '_blank')}
                                                className="w-full bg-green-600 text-white py-2.5 rounded-xl font-bold text-sm hover:bg-green-700 transition-all flex items-center justify-center gap-2 shadow-md shadow-green-600/20"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                </svg>
                                                Mağazaya Git
                                            </button>
                                        </div>
                                    )}
                                </div>


                                {/* Store Media Preview */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <label className="block text-xs sm:text-sm font-medium text-gray-700">{t.store.logo}</label>
                                            <div className="flex items-center gap-2">
                                                {isFreeTier && <span className="text-xs text-amber-600 font-bold flex items-center gap-1">🔒 Premium Özellik</span>}
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        if (isFreeTier) {
                                                            if (window.confirm('Logo yüklemek için Premium/Kurumsal paket gereklidir. Yükseltmek ister misiniz?')) {
                                                                navigate('/packages');
                                                            }
                                                            return;
                                                        }
                                                        logoInputRef.current?.click();
                                                    }}
                                                    className={`px-4 py-2 rounded-lg transition-colors text-xs font-bold ${isFreeTier
                                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                        }`}
                                                >
                                                    {isFreeTier ? '🔒 Kilitli' : '🚀 Logo Yükle'}
                                                </button>
                                            </div>
                                        </div>
                                        <div className={`relative group aspect-square w-32 rounded-2xl overflow-hidden border-2 border-dashed flex items-center justify-center ${isFreeTier ? 'bg-gray-100 border-gray-300' : 'bg-gray-50 border-gray-200'}`}>
                                            {storeLogo ? (
                                                <img src={storeLogo} alt="Mağaza Logosu" className={`w-full h-full object-cover ${isFreeTier ? 'opacity-50 grayscale' : ''}`} />
                                            ) : (
                                                <span className="text-3xl">{isFreeTier ? '🔒' : '🏗️'}</span>
                                            )}
                                            <input
                                                ref={logoInputRef}
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleStoreMediaUpload(e, 'logo')}
                                                className="hidden"
                                                disabled={isFreeTier}
                                            />
                                        </div>
                                        <p className="text-[10px] text-gray-400">Önerilen: 200x200px</p>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <label className="block text-xs sm:text-sm font-medium text-gray-700">{t.store.banner}</label>
                                            <div className="flex items-center gap-2">
                                                {isFreeTier && <span className="text-xs text-amber-600 font-bold flex items-center gap-1">🔒 Premium Özellik</span>}
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        if (isFreeTier) {
                                                            if (window.confirm('Banner yüklemek için Premium/Kurumsal paket gereklidir. Yükseltmek ister misiniz?')) {
                                                                navigate('/packages');
                                                            }
                                                            return;
                                                        }
                                                        bannerInputRef.current?.click()
                                                    }}
                                                    className={`px-4 py-2 rounded-lg transition-colors text-xs font-bold ${isFreeTier
                                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                        }`}
                                                >
                                                    {isFreeTier ? '🔒 Kilitli' : '🖼️ Afiş Yükle'}
                                                </button>
                                            </div>
                                        </div>
                                        <div className={`relative group aspect-[3/1] w-full rounded-2xl overflow-hidden border-2 border-dashed flex items-center justify-center ${isFreeTier ? 'bg-gray-100 border-gray-300' : 'bg-gray-50 border-gray-200'}`}>
                                            {storeBanner ? (
                                                <img src={storeBanner} alt="Mağaza Afişi" className={`w-full h-full object-cover ${isFreeTier ? 'opacity-50 grayscale' : ''}`} />
                                            ) : (
                                                <span className="text-3xl italic opacity-30 font-black">{isFreeTier ? 'PREMIUM' : 'BANNER'}</span>
                                            )}
                                            <input
                                                ref={bannerInputRef}
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleStoreMediaUpload(e, 'banner')}
                                                className="hidden"
                                                disabled={isFreeTier}
                                            />
                                        </div>
                                        <p className="text-[10px] text-gray-400">Önerilen: 1200x400px</p>
                                    </div>
                                </div>

                                {/* Social Media Links - NEW */}
                                <div className="mt-8 pt-8 border-t border-gray-100">
                                    <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                        <span className="text-xl">🌐</span> Sosyal Medya Hesapları
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5 ml-1">Facebook Profil Linki</label>
                                            <div className="relative">
                                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-600">
                                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                                    </svg>
                                                </div>
                                                <input
                                                    type="url"
                                                    value={formData.facebook_url}
                                                    onChange={(e) => setFormData({ ...formData, facebook_url: e.target.value })}
                                                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-400 focus:border-transparent text-sm"
                                                    placeholder="https://facebook.com/profiliniz"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5 ml-1">Instagram Profil Linki</label>
                                            <div className="relative">
                                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-pink-600">
                                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                                    </svg>
                                                </div>
                                                <input
                                                    type="url"
                                                    value={formData.instagram_url}
                                                    onChange={(e) => setFormData({ ...formData, instagram_url: e.target.value })}
                                                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-400 focus:border-transparent text-sm"
                                                    placeholder="https://instagram.com/kullaniciadi"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5 ml-1">X (Twitter) Profil Linki</label>
                                            <div className="relative">
                                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-black">
                                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 1200 1227">
                                                        <path d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.137 519.284H714.163ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.854V687.828Z" />
                                                    </svg>
                                                </div>
                                                <input
                                                    type="url"
                                                    value={formData.twitter_url}
                                                    onChange={(e) => setFormData({ ...formData, twitter_url: e.target.value })}
                                                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-400 focus:border-transparent text-sm"
                                                    placeholder="https://x.com/kullaniciadi"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5 ml-1">TikTok Profil Linki</label>
                                            <div className="relative">
                                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-900">
                                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                                                    </svg>
                                                </div>
                                                <input
                                                    type="url"
                                                    value={formData.tiktok_url}
                                                    onChange={(e) => setFormData({ ...formData, tiktok_url: e.target.value })}
                                                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-400 focus:border-transparent text-sm"
                                                    placeholder="https://tiktok.com/@kullaniciadi"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>


                                <div className="mt-8 pt-8 border-t border-gray-100">
                                    <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
                                        <h3 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
                                            <span className="text-xl">🕒</span> Çalışma Saatleri (Kurumsal)
                                        </h3>
                                        <div className="flex items-center gap-3 sm:bg-green-50 sm:px-4 sm:py-2 sm:rounded-xl sm:border sm:border-green-100">
                                            <span className="text-xs sm:text-sm font-bold text-green-700">7/24 Sürekli Çevrimiçi</span>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    className="sr-only peer"
                                                    checked={workingHours.isAlwaysOpen}
                                                    onChange={(e) => setWorkingHours({
                                                        ...workingHours,
                                                        isAlwaysOpen: e.target.checked
                                                    })}
                                                />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bottom-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                                            </label>
                                        </div>
                                    </div>

                                    {!workingHours.isAlwaysOpen ? (
                                        <div className="space-y-4">
                                            {[
                                                { id: 'mon', name: 'Pazartesi' },
                                                { id: 'tue', name: 'Salı' },
                                                { id: 'wed', name: 'Çarşamba' },
                                                { id: 'thu', name: 'Perşembe' },
                                                { id: 'fri', name: 'Cuma' },
                                                { id: 'sat', name: 'Cumartesi' },
                                                { id: 'sun', name: 'Pazar' }
                                            ].map((day) => (
                                                <div key={day.id} className="flex flex-wrap items-center justify-between py-4 sm:p-4 sm:rounded-xl border-b sm:border border-gray-100 sm:bg-gray-50/50 hover:bg-gray-50 transition-colors gap-4">
                                                    <div className="flex items-center gap-4 min-w-[140px]">
                                                        <label className="relative inline-flex items-center cursor-pointer">
                                                            <input
                                                                type="checkbox"
                                                                className="sr-only peer"
                                                                checked={workingHours[day.id]?.active}
                                                                onChange={(e) => setWorkingHours({
                                                                    ...workingHours,
                                                                    [day.id]: { ...workingHours[day.id], active: e.target.checked }
                                                                })}
                                                            />
                                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bottom-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                                                        </label>
                                                        <span className={`text-xs sm:text-sm font-bold ${workingHours[day.id]?.active ? 'text-gray-900' : 'text-gray-400'}`}>
                                                            {day.name}
                                                        </span>
                                                    </div>

                                                    {workingHours[day.id]?.active ? (
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase">Açılış</span>
                                                                <input
                                                                    type="time"
                                                                    value={workingHours[day.id]?.open}
                                                                    onChange={(e) => setWorkingHours({
                                                                        ...workingHours,
                                                                        [day.id]: { ...workingHours[day.id], open: e.target.value }
                                                                    })}
                                                                    className="px-2 py-1 sm:px-3 sm:py-1.5 border border-gray-200 rounded-lg text-xs sm:text-sm font-medium focus:ring-2 focus:ring-red-400 focus:border-transparent bg-white w-24 sm:w-auto"
                                                                />
                                                            </div>
                                                            <span className="text-gray-300">/</span>
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase">Kapanış</span>
                                                                <input
                                                                    type="time"
                                                                    value={workingHours[day.id]?.close}
                                                                    onChange={(e) => setWorkingHours({
                                                                        ...workingHours,
                                                                        [day.id]: { ...workingHours[day.id], close: e.target.value }
                                                                    })}
                                                                    className="px-2 py-1 sm:px-3 sm:py-1.5 border border-gray-200 rounded-lg text-xs sm:text-sm font-medium focus:ring-2 focus:ring-red-400 focus:border-transparent bg-white w-24 sm:w-auto"
                                                                />
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <span className="text-[10px] sm:text-xs font-bold text-red-500 bg-red-50 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-red-100">KAPALI</span>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="py-6 sm:p-8 sm:bg-green-50/50 sm:rounded-2xl sm:border-2 sm:border-dashed sm:border-green-200 text-center">
                                            <div className="text-4xl mb-3">🌍</div>
                                            <p className="text-green-800 font-bold text-lg mb-1">Mağazanız Sürekli Açık</p>
                                            <p className="text-green-600 text-sm">Ziyaretçileriniz mağazanızı haftanın her günü, günün her saati "AÇIK" olarak görecektir.</p>
                                        </div>
                                    )}
                                    <p className="mt-3 text-[11px] text-gray-500 italic">
                                        * Çalışma saatleri mağaza sayfanızda otomatik olarak Open/Closed durumunu belirlemek için kullanılır.
                                    </p>
                                </div>

                            </div>
                        )}

                        <div className="mt-8 pt-6 border-t border-gray-100">
                            {message && (
                                <div className={`mb-4 p-4 rounded-xl text-center font-bold animate-in fade-in slide-in-from-bottom-2 ${message.includes('Kaydedildi') ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'}`}>
                                    {message}
                                </div>
                            )}
                            <button
                                type="submit"
                                disabled={saving}
                                className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-4 rounded-xl hover:from-red-700 hover:to-red-800 transition-all font-black shadow-lg shadow-red-600/20 disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {saving ? (
                                    <LoadingSpinner size="small" />
                                ) : (
                                    <>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Değişiklikleri Kaydet
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                )}

                {activeSection === 'security' && (
                    <div className="space-y-6">
                        <div className="p-6 bg-gray-50 rounded-lg">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">E-posta Adresi</h3>
                            <p className="text-gray-600 mb-4">{profile?.email || 'E-posta adresi kayıtlı değil'}</p>
                            <button
                                onClick={() => setShowEmailModal(true)}
                                className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                E-postayı değiştir
                            </button>
                        </div>
                        <div className="p-6 bg-gray-50 rounded-lg">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Şifre</h3>
                            <p className="text-gray-600 mb-4">••••••••</p>
                            <button
                                onClick={() => setShowPasswordModal(true)}
                                className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                Şifreyi değiştir
                            </button>
                        </div>

                        {/* Danger Zone */}
                        <div className="mt-12 pt-8 border-t border-gray-200">
                            <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
                                <h3 className="text-lg font-bold text-red-700 mb-2 flex items-center gap-2">
                                    Hesabımı kapatmak istiyorum
                                </h3>
                                <p className="text-sm text-red-600 mb-6">
                                    Hesabınızı kapattığınızda tüm verileriniz kalıcı olarak silinir. Bu işlem geri alınamaz.
                                </p>
                                <button
                                    type="button"
                                    onClick={handleDeleteAccount}
                                    className="px-6 py-2 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors shadow-sm"
                                >
                                    Hesabımı Kapat
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {activeSection === 'privacy' && (
                    <div className="space-y-6">
                        <p className="text-gray-600">Gizlilik ayarları yakında eklenecek...</p>
                    </div>
                )}

                {activeSection === 'notifications' && (
                    <div className="space-y-6">
                        <p className="text-gray-600">Bildirim tercihleri yakında eklenecek...</p>
                    </div>
                )}
            </div>

            {/* Email Change Modal */}
            {
                showEmailModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">E-posta Adresini Değiştir</h2>
                            <form onSubmit={handleEmailChange} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Yeni E-posta Adresi</label>
                                    <input
                                        type="email"
                                        value={newEmail}
                                        onChange={(e) => setNewEmail(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-transparent"
                                        placeholder="yeni@email.com"
                                        required
                                    />
                                </div>
                                {emailMessage && (
                                    <div className={`p-3 rounded-lg ${emailMessage.includes('başarıyla') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                        {emailMessage}
                                    </div>
                                )}
                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowEmailModal(false);
                                            setNewEmail('');
                                            setEmailMessage('');
                                        }}
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                                    >
                                        İptal
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                    >
                                        Değiştir
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }

            {/* Password Change Modal */}
            {
                showPasswordModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Şifreyi Değiştir</h2>
                            <form onSubmit={handlePasswordChange} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Güncel Şifre</label>
                                    <input
                                        type="password"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-transparent"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Yeni Şifre</label>
                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-transparent"
                                        minLength={6}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Yeni Şifreyi Onayla</label>
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-transparent"
                                        minLength={6}
                                        required
                                    />
                                </div>
                                {passwordMessage && (
                                    <div className={`p-3 rounded-lg ${passwordMessage.includes('başarıyla') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                        {passwordMessage}
                                    </div>
                                )}
                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowPasswordModal(false);
                                            setCurrentPassword('');
                                            setNewPassword('');
                                            setConfirmPassword('');
                                            setPasswordMessage('');
                                        }}
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                                    >
                                        İptal
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                    >
                                        Değiştir
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }
        </ProfileLayout >
    );
};

export default SettingsPage;
