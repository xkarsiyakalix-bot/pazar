import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { t } from '../../translations';
import { formatLastSeen, MessageModal, ListingCard, Breadcrumb } from '../../components';
import LoadingSpinner from '../LoadingSpinner';
import SEO from '../../SEO';
import VerifiedBadge from '../VerifiedBadge';
import { applyPromotionExpiry } from '../../api/listings';
import { followUser, unfollowUser, isFollowing, getFollowersCount } from '../../api/follows';
import { getRatings, getUserAverageRating } from '../../api/ratings';
import { getOptimizedImageUrl } from '../../utils/imageUtils';
import { shareToFacebook, shareToWhatsApp, shareToTwitter, copyShareLink } from '../../utils/shareUtils';

const StorePage = ({ sellerId: propSellerId }) => {
    const params = useParams();
    const sellerId = propSellerId || params.sellerId; // Prioritize prop (from SmartRoute) over params
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();

    const [currentTime, setCurrentTime] = useState(new Date());
    const [showMobileShare, setShowMobileShare] = useState(false);
    const hoursDropdownRef = useRef(null);
    const shareDropdownRef = useRef(null);

    // Cache Helpers
    const CACHE_KEY = `store_page_${sellerId}`;
    const getCachedStoreData = () => {
        try {
            const saved = sessionStorage.getItem(CACHE_KEY);
            return saved ? JSON.parse(saved) : null;
        } catch (e) {
            console.error('Error parsing store cache:', e);
            return null;
        }
    };

    const cachedData = getCachedStoreData();

    // Initialize state from cache if available
    const [storeInfo, setStoreInfo] = useState(location.state?.sellerProfile || cachedData?.storeInfo || null);
    const [listings, setListings] = useState(cachedData?.listings || []);
    const [loading, setLoading] = useState(!cachedData?.storeInfo); // Only show loading if no cache
    const [isRedirecting, setIsRedirecting] = useState(false);
    const [showHours, setShowHours] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [isFollowingSeller, setIsFollowingSeller] = useState(cachedData?.isFollowingSeller || false);
    const [followersCount, setFollowersCount] = useState(cachedData?.followersCount || 0);
    const [showMessageModal, setShowMessageModal] = useState(false);
    const [ratings, setRatings] = useState(cachedData?.ratings || []);
    const [averageRating, setAverageRating] = useState(cachedData?.averageRating || { average: 0, count: 0 });
    const [activeTab, setActiveTab] = useState('listings');
    const [userStats, setUserStats] = useState(cachedData?.userStats || null);

    // Save to cache whenever data changes
    useEffect(() => {
        if (storeInfo) {
            const dataToCache = {
                storeInfo,
                listings,
                ratings,
                averageRating,
                userStats,
                followersCount,
                isFollowingSeller
            };
            try {
                sessionStorage.setItem(CACHE_KEY, JSON.stringify(dataToCache));
            } catch (e) {
                console.warn('Could not save store data to cache:', e);
            }
        }
    }, [storeInfo, listings, ratings, averageRating, userStats, followersCount, isFollowingSeller, CACHE_KEY]);

    // Handle click outside to close dropdowns
    useEffect(() => {
        function handleClickOutside(event) {
            if (hoursDropdownRef.current && !hoursDropdownRef.current.contains(event.target)) {
                setShowHours(false);
            }
            if (shareDropdownRef.current && !shareDropdownRef.current.contains(event.target)) {
                setShowMobileShare(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    async function handleSendMessage(data) {
        if (!user) {
            alert(t.sellerProfile.loginToMessage);
            return;
        }

        try {
            const { sendMessage } = await import('../../api/messages');
            await sendMessage(storeInfo.id, data.message, null);
            alert(t.sellerProfile.messageSuccess || 'Mesajınız gönderildi!');
            setShowMessageModal(false);
        } catch (error) {
            console.error('Error sending message:', error);
            alert(t.sellerProfile.messageError || 'Mesaj gönderilirken bir hata oluştu.');
        }
    }

    // Update current time every minute to refresh store status
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const fetchStoreData = async () => {
            try {
                // If we don't have cache, show loading
                if (!storeInfo) setLoading(true);

                // Fetch store/profile info
                const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(sellerId);

                let query = supabase.from('profiles').select('*');

                if (isUuid) {
                    query = query.eq('id', sellerId);
                } else {
                    query = query.eq('store_slug', sellerId);
                }

                const { data: profile, error: profileError } = await query.single();

                if (profileError) {
                    console.error('Profile fetch error:', profileError);
                    throw profileError;
                }

                const actualSellerId = profile.id;

                // Update store info
                setStoreInfo(prev => JSON.stringify(prev) !== JSON.stringify(profile) ? profile : prev);

                // Fetch stats only if the viewing user is the owner
                if (user?.id === actualSellerId) {
                    try {
                        const { getUserStats } = await import('../../api/profile');
                        const stats = await getUserStats(actualSellerId);
                        setUserStats(stats);
                    } catch (err) {
                        console.error('Error fetching owner stats:', err);
                    }
                }

                if (isUuid && profile.store_slug) {
                    setIsRedirecting(true);
                    // Use react-router navigate instead of window.location.replace to prevent full page reload
                    navigate(`/${profile.store_slug}`, { replace: true, state: { sellerProfile: profile } });
                    return;
                }

                // Fetch store listings
                const { data: storeListings, error: listingsError } = await supabase
                    .from('listings')
                    .select('*')
                    .eq('user_id', actualSellerId)
                    .eq('status', 'active')
                    .order('created_at', { ascending: false });

                if (listingsError) throw listingsError;
                const processedListings = (storeListings || []).map(l => applyPromotionExpiry(l));
                setListings(prev => JSON.stringify(prev) !== JSON.stringify(processedListings) ? processedListings : prev);

                // Fetch ratings using actual UUID
                const ratingsData = await getRatings(actualSellerId);
                setRatings(ratingsData);

                const avgData = await getUserAverageRating(actualSellerId);
                setAverageRating(avgData);

                // Fetch follow status logic is moved inside here to happen in parallel/sequence
                try {
                    const following = await isFollowing(actualSellerId);
                    setIsFollowingSeller(following);
                    const count = await getFollowersCount(actualSellerId);
                    setFollowersCount(count);
                } catch (followErr) {
                    console.error(followErr);
                }

                // Only set loading false if we are staying on this page
                setLoading(false);
            } catch (error) {
                console.error('Error fetching store data:', error);
                setLoading(false);
            }
        };

        if (sellerId) {
            fetchStoreData();
        }
    }, [sellerId, user?.id]); // Added user?.id dependency

    // Calculate category counts
    const categoryCounts = listings.reduce((acc, curr) => {
        const cat = curr.category || 'Diğer';
        acc[cat] = (acc[cat] || 0) + 1;
        return acc;
    }, {});

    const freeListingsCount = listings.filter(l => l.price === 0 || l.price_type === 'giveaway').length;

    // Filter listings
    const filteredListings = selectedCategory === 'All'
        ? listings
        : selectedCategory === 'Free'
            ? listings.filter(l => l.price === 0 || l.price_type === 'giveaway')
            : listings.filter(l => l.category === selectedCategory);

    // Sort listings: Premium (z_premium) first, then z_multi_bump, then is_top, then highlighted, then newest
    const sortedListings = [...filteredListings].sort((a, b) => {
        // Priority: z_premium > z_multi_bump > other is_top > highlighted > basic
        const getPriority = (l) => {
            const type = l.package_type?.toLowerCase();
            if (type === 'z_premium' || type === 'premium') return 100;
            if (type === 'z_multi_bump' || type === 'multi-bump') return 80;
            if (l.is_top) return 50;
            if (l.is_highlighted || type === 'highlight' || type === 'budget') return 10;
            return 0;
        };

        const prioA = getPriority(a);
        const prioB = getPriority(b);

        if (prioA !== prioB) return prioB - prioA;
        return new Date(b.created_at) - new Date(a.created_at);
    });

    const isStoreOpen = () => {
        if (!storeInfo?.working_hours) return true;
        if (storeInfo.working_hours.isAlwaysOpen) return true;

        const now = currentTime;
        const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
        const currentDay = days[now.getDay()];
        const schedule = storeInfo.working_hours[currentDay];

        if (!schedule || !schedule.active || !schedule.open || !schedule.close) return false;

        try {
            const currentTime = now.getHours() * 60 + now.getMinutes();
            const [openH, openM] = schedule.open.split(':').map(Number);
            const [closeH, closeM] = schedule.close.split(':').map(Number);

            const openTotal = openH * 60 + openM;
            const closeTotal = closeH * 60 + closeM;

            return currentTime >= openTotal && currentTime <= closeTotal;
        } catch (e) {
            console.error('Error calculating store status:', e);
            return false;
        }
    };

    const isOpen = isStoreOpen();

    useEffect(() => {
        if (!storeInfo?.id) return;

        const checkFollowStatus = async () => {
            try {
                const following = await isFollowing(storeInfo.id);
                setIsFollowingSeller(following);
                const count = await getFollowersCount(storeInfo.id);
                setFollowersCount(count);
            } catch (error) {
                console.error('Error checking follow status:', error);
            }
        };

        checkFollowStatus();
    }, [storeInfo?.id]);

    const handleFollowToggle = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        try {
            if (isFollowingSeller) {
                await unfollowUser(storeInfo.id);
                setIsFollowingSeller(false);
                setFollowersCount(prev => Math.max(0, prev - 1));
            } else {
                await followUser(storeInfo.id);
                setIsFollowingSeller(true);
                setFollowersCount(prev => prev + 1);
            }
        } catch (error) {
            console.error('Error toggling follow:', error);
            alert('Takip işlemi sırasında bir hata oluştu.');
        }
    };

    if (loading || isRedirecting) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <LoadingSpinner size="large" />
            </div>
        );
    }

    if (!storeInfo) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[600px] text-center p-4 transition-colors">
                <div className="w-14 h-14 border border-neutral-200 dark:border-neutral-800 rounded-md flex items-center justify-center text-neutral-500 mb-6 mx-auto">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50">Mağaza bulunamadı.</h2>
                <p className="text-neutral-500 dark:text-neutral-400 mt-2 mb-8 text-sm">Aradığınız mağaza silinmiş veya adresi değişmiş olabilir.</p>
                <button
                    onClick={() => navigate('/')}
                    className="px-6 py-2.5 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-sm font-medium rounded-md hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors cursor-pointer"
                >
                    Ana Sayfaya Dön
                </button>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-neutral-950 min-h-screen pb-24 lg:pb-12 transition-colors">
            <SEO
                title={storeInfo.store_name || storeInfo.full_name}
                description={`${storeInfo.store_name || storeInfo.full_name} mağazasını ExVitrin'de ziyaret edin. ${listings.length} aktif ilan, uygun fiyatlar ve güvenli alışveriş.`}
                image={storeInfo.store_logo || storeInfo.avatar_url}
            />

            {/* Breadcrumb */}
            <div className="max-w-[1400px] mx-auto px-4 pt-4 -mb-2">
                <Breadcrumb
                    items={[
                        { label: 'ExVitrin', path: '/' },
                        { label: storeInfo.store_name || storeInfo.full_name, isActive: true }
                    ]}
                />
            </div>

            {/* ── BANNER ─────────────────────────────────────────────────────── */}
            <div className="max-w-[1400px] mx-auto px-0 md:px-4 pt-0 md:pt-4">
                <div className="relative h-52 md:h-56 bg-neutral-200 dark:bg-neutral-900 overflow-hidden md:rounded-md md:border md:border-neutral-200 dark:md:border-neutral-800">
                    {storeInfo.store_banner ? (
                        <img
                            src={getOptimizedImageUrl(storeInfo.store_banner, 1400, 480, 'cover')}
                            alt={storeInfo.store_name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-neutral-800" />
                    )}

                    {/* Gradient overlay + content */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/5 p-4 md:p-7 flex flex-col justify-end">

                        {/* Share button – top right */}
                        <div className="absolute top-3 right-3 z-[100]" ref={shareDropdownRef}>
                            <button
                                onClick={() => setShowMobileShare(!showMobileShare)}
                                className="w-9 h-9 bg-black/30 rounded-md flex items-center justify-center text-white border border-white/30 hover:bg-black/45 transition-colors cursor-pointer"
                                aria-label="Paylaş"
                            >
                                <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                </svg>
                            </button>

                            {showMobileShare && (
                                <div className="absolute right-0 top-full mt-1.5 w-44 bg-white dark:bg-neutral-900 rounded-md shadow-sm border border-neutral-200 dark:border-neutral-800 p-1 z-[100]">
                                    <div className="flex flex-col gap-0.5">
                                        <button
                                            onClick={() => { shareToFacebook(window.location.href, storeInfo.store_name || storeInfo.full_name); setShowMobileShare(false); }}
                                            className="flex items-center gap-2.5 px-2 py-1.5 rounded-md hover:bg-neutral-50 dark:hover:bg-white/5 text-neutral-700 dark:text-neutral-300 transition-colors cursor-pointer"
                                        >
                                            <div className="w-7 h-7 bg-blue-600 rounded-md flex items-center justify-center text-white shrink-0">
                                                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                                            </div>
                                            <span className="text-[11px] font-medium">Facebook</span>
                                        </button>
                                        <button
                                            onClick={() => { shareToWhatsApp(window.location.href, storeInfo.store_name || storeInfo.full_name); setShowMobileShare(false); }}
                                            className="flex items-center gap-2.5 px-2 py-1.5 rounded-md hover:bg-neutral-50 dark:hover:bg-white/5 text-neutral-700 dark:text-neutral-300 transition-colors cursor-pointer"
                                        >
                                            <div className="w-7 h-7 bg-green-600 rounded-md flex items-center justify-center text-white shrink-0">
                                                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.27 9.27 0 01-4.723-1.292l-.339-.202-3.51.92 1.017-3.65-.213-.339a9.204 9.204 0 01-1.513-5.07c0-5.116 4.158-9.273 9.274-9.273 2.479 0 4.808.966 6.557 2.715a9.192 9.192 0 012.711 6.56c0 5.117-4.158 9.275-9.276 9.275m8.211-17.487A11.026 11.026 0 0012.048 1.177c-6.115 0-11.09 4.974-11.09 11.088 0 2.112.553 4.135 1.611 5.922L.787 23l4.981-1.304c1.722.94 3.655 1.437 5.626 1.437h.005c6.114 0 11.089-4.975 11.089-11.088 0-2.937-1.144-5.698-3.235-7.791z" /></svg>
                                            </div>
                                            <span className="text-[11px] font-medium">WhatsApp</span>
                                        </button>
                                        <button
                                            onClick={() => { shareToTwitter(window.location.href, storeInfo.store_name || storeInfo.full_name); setShowMobileShare(false); }}
                                            className="flex items-center gap-2.5 px-2 py-1.5 rounded-md hover:bg-neutral-50 dark:hover:bg-white/5 text-neutral-700 dark:text-neutral-300 transition-colors cursor-pointer"
                                        >
                                            <div className="w-7 h-7 bg-neutral-900 rounded-md flex items-center justify-center text-white shrink-0">
                                                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 1200 1227"><path d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.137 519.284H714.163ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.854V687.828Z" /></svg>
                                            </div>
                                            <span className="text-[11px] font-medium">X</span>
                                        </button>
                                        <button
                                            onClick={() => { navigator.clipboard.writeText(window.location.href).then(() => alert('Bağlantı panoya kopyalandı!')); setShowMobileShare(false); }}
                                            className="flex items-center gap-2.5 px-2 py-1.5 rounded-md hover:bg-neutral-50 dark:hover:bg-white/5 text-neutral-700 dark:text-neutral-300 transition-colors cursor-pointer"
                                        >
                                            <div className="w-7 h-7 border border-neutral-200 dark:border-neutral-700 rounded-md flex items-center justify-center text-neutral-600 dark:text-neutral-300 shrink-0">
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                                            </div>
                                            <span className="text-[11px] font-medium">Linki kopyala</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Avatar + name row at bottom of banner */}
                        <div className="w-full flex flex-row items-center md:items-end gap-3 md:gap-6 text-white text-left">
                            {/* Avatar */}
                            <div className="relative shrink-0">
                                {(storeInfo.store_logo || storeInfo.avatar_url) ? (
                                    <img
                                        src={getOptimizedImageUrl(storeInfo.store_logo || storeInfo.avatar_url, 300, 300, 'cover')}
                                        alt={storeInfo.store_name}
                                        className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-md border border-white/70 object-cover bg-white dark:bg-neutral-800"
                                    />
                                ) : (
                                    <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-md border border-white/70 bg-white/10" />
                                )}
                                {storeInfo.is_pro && (
                                    <div className="absolute -top-1.5 -right-1.5 bg-white text-neutral-900 text-[9px] uppercase tracking-[0.12em] font-medium px-1.5 py-0.5 rounded-sm border border-white">
                                        Pro
                                    </div>
                                )}
                            </div>

                            {/* Name + meta */}
                            <div className="flex-1 pb-0.5 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <h1 className="text-lg sm:text-2xl md:text-[28px] font-semibold tracking-tight truncate">
                                        {storeInfo.store_name || storeInfo.full_name}
                                    </h1>
                                    <VerifiedBadge isVerified={storeInfo.is_verified} size="lg" />
                                </div>
                                <div className="flex flex-wrap items-center justify-start gap-x-3 gap-y-1 text-[11px] sm:text-sm text-white/80">
                                    {storeInfo.city && (
                                        <span className="truncate max-w-[120px] sm:max-w-none">{storeInfo.city}</span>
                                    )}
                                    {storeInfo.city && <span className="text-white/35">·</span>}
                                    <span className="whitespace-nowrap">{listings.length} ilan</span>
                                    {averageRating.count > 0 && (
                                        <>
                                            <span className="text-white/35">·</span>
                                            <button
                                                type="button"
                                                onClick={() => setActiveTab('ratings')}
                                                className="inline-flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
                                            >
                                                <svg className="w-3.5 h-3.5 text-amber-300 fill-current" viewBox="0 0 24 24">
                                                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                                </svg>
                                                <span>{averageRating.average}</span>
                                                <span className="text-white/55">({averageRating.count})</span>
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Social icons */}
                            <div className="pb-0.5 flex flex-wrap gap-1.5 justify-end">
                                <div className="flex gap-1.5">
                                    <button
                                        onClick={() => {
                                            const url = storeInfo.facebook_url;
                                            const finalUrl = url
                                                ? (url.includes('facebook.com') ? (url.startsWith('http') ? url : `https://${url}`) : `https://facebook.com/${url}`)
                                                : 'https://facebook.com/exvitrin';
                                            window.open(finalUrl, '_blank');
                                        }}
                                        className="w-8 h-8 border border-white/35 hover:border-white/70 hover:bg-white/10 rounded-md flex items-center justify-center text-white transition-colors cursor-pointer"
                                        title={storeInfo.facebook_url ? "Facebook Sayfamız" : "Facebook"}
                                    >
                                        <svg className="w-4 h-4 md:w-5 md:h-5 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                                    </button>
                                    <button
                                        onClick={() => {
                                            const url = storeInfo.instagram_url;
                                            const finalUrl = url
                                                ? (url.includes('instagram.com') ? (url.startsWith('http') ? url : `https://${url}`) : `https://instagram.com/${url.replace('@', '')}`)
                                                : 'https://instagram.com/exvitrin';
                                            window.open(finalUrl, '_blank');
                                        }}
                                        className="w-8 h-8 border border-white/35 hover:border-white/70 hover:bg-white/10 rounded-md flex items-center justify-center text-white transition-colors cursor-pointer"
                                        title={storeInfo.instagram_url ? "Instagram Sayfamız" : "Instagram"}
                                    >
                                        <svg className="w-4 h-4 md:w-5 md:h-5 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                                    </button>
                                    <button
                                        onClick={() => {
                                            const url = storeInfo.twitter_url;
                                            const finalUrl = url
                                                ? ((url.includes('twitter.com') || url.includes('x.com')) ? (url.startsWith('http') ? url : `https://${url}`) : `https://x.com/${url}`)
                                                : 'https://x.com/exvitrin';
                                            window.open(finalUrl, '_blank');
                                        }}
                                        className="w-8 h-8 border border-white/35 hover:border-white/70 hover:bg-white/10 rounded-md flex items-center justify-center text-white transition-colors cursor-pointer"
                                        title={storeInfo.twitter_url ? "X (Twitter) Sayfamız" : "X (Twitter)"}
                                    >
                                        <svg className="w-4 h-4 md:w-5 md:h-5 fill-current" viewBox="0 0 1200 1227"><path d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.137 519.284H714.163ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.854V687.828Z" /></svg>
                                    </button>
                                    <button
                                        onClick={() => {
                                            const url = storeInfo.tiktok_url;
                                            const finalUrl = url
                                                ? (url.includes('tiktok.com') ? (url.startsWith('http') ? url : `https://${url}`) : `https://tiktok.com/@${url.replace('@', '')}`)
                                                : 'https://tiktok.com/@exvitrin';
                                            window.open(finalUrl, '_blank');
                                        }}
                                        className="w-8 h-8 border border-white/35 hover:border-white/70 hover:bg-white/10 rounded-md flex items-center justify-center text-white transition-colors cursor-pointer"
                                        title={storeInfo.tiktok_url ? "TikTok Sayfamız" : "TikTok"}
                                    >
                                        <svg className="w-4 h-4 md:w-5 md:h-5 fill-current" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" /></svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── INFO BAR (only renders fields that have data) ──────────────── */}
            {(storeInfo.phone || storeInfo.street || storeInfo.city || storeInfo.website || storeInfo.working_hours) && (
                <div className="relative z-20 mt-0 md:mt-3 max-w-[1400px] mx-auto px-0 md:px-4 mb-0 sm:mb-6">
                    <div className="bg-white dark:bg-neutral-950 border-y md:border border-neutral-200 dark:border-neutral-800 md:rounded-md p-4 md:px-5 md:py-4">
                        <div className="flex flex-wrap items-center justify-between gap-y-4 gap-x-8">
                            <div className="flex flex-wrap items-center gap-6 md:gap-10">
                                {storeInfo.phone && (
                                    <div className="flex items-center gap-3">
                                        <svg className="w-4 h-4 text-neutral-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                        <div>
                                            <p className="text-[10px] text-neutral-400 font-medium uppercase tracking-[0.16em] mb-0.5">Telefon</p>
                                            <p className="text-sm text-neutral-900 dark:text-neutral-50">{storeInfo.phone}</p>
                                        </div>
                                    </div>
                                )}

                                {(storeInfo.street || storeInfo.city) && (
                                    <div className="flex items-center gap-3">
                                        <svg className="w-4 h-4 text-neutral-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        <div>
                                            <p className="text-[10px] text-neutral-400 font-medium uppercase tracking-[0.16em] mb-0.5">Adres</p>
                                            <p className="text-sm text-neutral-900 dark:text-neutral-50">
                                                {storeInfo.street ? `${storeInfo.street}, ` : ''}{storeInfo.city || ''}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {storeInfo.website && (
                                    <div className="flex items-center gap-3">
                                        <svg className="w-4 h-4 text-neutral-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9-9c1.657 0 3 3.582 3 8s-1.343 8-3 8m0-16c-1.657 0-3 3.582-3 8s1.343 8 3 8m-11-8h11" />
                                        </svg>
                                        <div>
                                            <p className="text-[10px] text-neutral-400 font-medium uppercase tracking-[0.16em] mb-0.5">Web sitesi</p>
                                            <a
                                                href={storeInfo.website.startsWith('http') ? storeInfo.website : `https://${storeInfo.website}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm text-neutral-900 dark:text-neutral-50 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors block"
                                            >
                                                {storeInfo.website.replace(/^https?:\/\//, '')}
                                            </a>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Working hours dropdown */}
                            {storeInfo.working_hours && (
                                <div className="flex items-center gap-3 relative" ref={hoursDropdownRef}>
                                    <svg className="w-4 h-4 text-neutral-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <div className="cursor-pointer" onClick={() => setShowHours(!showHours)}>
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <p className="text-[10px] text-neutral-400 font-medium uppercase tracking-[0.16em]">Çalışma saatleri</p>
                                            <span className={`text-[10px] tracking-[0.12em] uppercase ${isOpen ? 'text-emerald-700 dark:text-emerald-400' : 'text-neutral-500'}`}>
                                                {isOpen ? 'Açık' : 'Kapalı'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm text-neutral-900 dark:text-neutral-100">
                                                {(() => {
                                                    if (storeInfo.working_hours?.isAlwaysOpen) return '7/24 Açık';
                                                    const now = currentTime;
                                                    const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
                                                    const currentDay = days[now.getDay()];
                                                    const schedule = storeInfo.working_hours?.[currentDay];
                                                    if (!schedule || !schedule.active) return 'Kapalı';
                                                    if (isOpen) return `${schedule.open} - ${schedule.close}`;
                                                    return 'Kapalı';
                                                })()}
                                            </p>
                                            <svg className={`w-3.5 h-3.5 text-neutral-400 transform transition-transform duration-200 ${showHours ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>

                                        {showHours && (
                                            <div className="absolute top-full left-0 md:left-auto md:right-0 mt-2 w-72 max-w-[calc(100vw-32px)] bg-white dark:bg-neutral-900 rounded-md shadow-sm border border-neutral-200 dark:border-neutral-800 p-4 z-50">
                                                <h4 className="text-[10px] font-medium text-neutral-900 dark:text-neutral-100 border-b border-neutral-200 dark:border-neutral-800 pb-2 mb-3 uppercase tracking-[0.16em] flex items-center justify-between">
                                                    <span>Haftalık program</span>
                                                    <span className={`${isOpen ? 'text-emerald-700 dark:text-emerald-400' : 'text-neutral-500'} text-[10px] uppercase tracking-[0.12em]`}>
                                                        {isOpen ? 'Açık' : 'Kapalı'}
                                                    </span>
                                                </h4>
                                                <div className="space-y-1.5">
                                                    {storeInfo.working_hours?.isAlwaysOpen ? (
                                                        <div className="p-3 border border-neutral-200 dark:border-neutral-800 rounded-md">
                                                            <p className="text-[12px] font-medium text-neutral-800 dark:text-neutral-200">7/24 sürekli açık</p>
                                                            <p className="text-[11px] text-neutral-500 mt-1 leading-relaxed">Bu mağaza haftanın her günü kesintisiz hizmet vermektedir.</p>
                                                        </div>
                                                    ) : (
                                                        [
                                                            { key: 'mon', label: 'Pzt' },
                                                            { key: 'tue', label: 'Sal' },
                                                            { key: 'wed', label: 'Çar' },
                                                            { key: 'thu', label: 'Per' },
                                                            { key: 'fri', label: 'Cum' },
                                                            { key: 'sat', label: 'Cmt' },
                                                            { key: 'sun', label: 'Paz' }
                                                        ].map(({ key, label }) => {
                                                            const schedule = storeInfo.working_hours?.[key];
                                                            const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
                                                            const todayKey = days[currentTime.getDay()];
                                                            const isToday = key === todayKey;
                                                            return (
                                                                <div key={key} className={`flex items-center justify-between py-1 px-2 rounded-sm ${isToday ? 'bg-neutral-50 dark:bg-white/5' : ''}`}>
                                                                    <span className={`text-[12px] w-8 ${isToday ? 'font-medium text-neutral-900 dark:text-neutral-100' : 'text-neutral-500'}`}>{label}</span>
                                                                    <span className={`text-[12px] ${isToday ? 'text-neutral-900 dark:text-neutral-100' : 'text-neutral-500'}`}>
                                                                        {schedule?.active && schedule?.open && schedule?.close
                                                                            ? `${schedule.open} – ${schedule.close}`
                                                                            : 'Kapalı'}
                                                                    </span>
                                                                </div>
                                                            );
                                                        })
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* ── MAIN CONTENT ───────────────────────────────────────────────── */}
            <main className="max-w-[1400px] mx-auto px-4 pt-5 pb-8 sm:py-6">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

                    {/* ── SIDEBAR ──────────────────────────────────────────── */}
                    <div className="lg:col-span-1 space-y-4">

                        {/* About card (desktop) – no duplicate avatar/name */}
                        <div className="hidden lg:block bg-white dark:bg-neutral-950 rounded-md border border-neutral-200 dark:border-neutral-800 p-5">

                            {/* Stats row */}
                            <div className="flex items-center gap-5 mb-4">
                                <div className="text-center">
                                    <p className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 leading-none">{listings.length}</p>
                                    <p className="text-[11px] text-neutral-500 mt-1.5 tracking-[0.12em] uppercase">İlan</p>
                                </div>
                                <div className="w-px h-8 bg-neutral-200 dark:bg-neutral-800" />
                                <div
                                    onClick={() => user?.id === storeInfo.id && navigate('/followers')}
                                    className={`text-center ${user?.id === storeInfo.id ? 'cursor-pointer hover:opacity-70 transition-opacity' : ''}`}
                                >
                                    <p className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 leading-none">{followersCount}</p>
                                    <p className="text-[11px] text-neutral-500 mt-1.5 tracking-[0.12em] uppercase">Takipçi</p>
                                </div>
                                {averageRating.count > 0 && (
                                    <>
                                        <div className="w-px h-8 bg-neutral-200 dark:bg-neutral-800" />
                                        <div
                                            className="text-center cursor-pointer hover:opacity-70 transition-opacity"
                                            onClick={() => setActiveTab('ratings')}
                                        >
                                            <div className="flex items-center gap-0.5 justify-center leading-none mb-1">
                                                <svg className="w-3.5 h-3.5 text-amber-400 fill-current" viewBox="0 0 24 24">
                                                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                                </svg>
                                                <span className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">{averageRating.average}</span>
                                            </div>
                                            <p className="text-[11px] text-neutral-500 tracking-[0.12em] uppercase">Puan</p>
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Member since */}
                            <p className="text-[11px] text-neutral-400 border-t border-neutral-100 dark:border-neutral-800/60 pt-3.5 pb-3.5">
                                <span className="font-medium text-neutral-500">Üyelik:</span>{' '}
                                {new Date(storeInfo.created_at).toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })}
                            </p>

                            {/* Bio / Store description */}
                            {(storeInfo.store_description || storeInfo.bio) && (
                                <p className="text-[12.5px] text-neutral-500 dark:text-neutral-400 leading-relaxed border-t border-neutral-100 dark:border-neutral-800/60 pt-3.5 pb-3.5">
                                    {storeInfo.store_description || storeInfo.bio}
                                </p>
                            )}

                            {/* Action buttons */}
                            <div className="space-y-2 border-t border-neutral-100 dark:border-neutral-800/60 pt-3.5">
                                <button
                                    onClick={() => setShowMessageModal(true)}
                                    className="w-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-medium py-2.5 rounded-md hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2 cursor-pointer text-sm"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                    </svg>
                                    Mesaj Gönder
                                </button>

                                <button
                                    onClick={handleFollowToggle}
                                    className={`w-full font-medium py-2.5 rounded-md transition-colors flex items-center justify-center gap-2 border text-sm cursor-pointer ${isFollowingSeller
                                        ? 'bg-white dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:border-neutral-400'
                                        : 'bg-white dark:bg-neutral-950 border-neutral-900 dark:border-neutral-200 text-neutral-900 dark:text-neutral-100 hover:bg-neutral-50 dark:hover:bg-neutral-900'
                                        }`}
                                >
                                    {isFollowingSeller ? (
                                        <>
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                            Takiptesin
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                            Takip Et
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Categories Filter */}
                        {activeTab === 'listings' && (
                            <div className="bg-white dark:bg-neutral-950 rounded-md p-5 border border-neutral-200 dark:border-neutral-800 transition-colors">
                                <h3 className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400 mb-3 tracking-[0.16em] uppercase">Kategoriler</h3>
                                <nav className="space-y-0.5">
                                    <button
                                        onClick={() => setSelectedCategory('All')}
                                        className={`w-full flex items-center justify-between px-2 py-2 rounded-sm transition-colors duration-200 cursor-pointer ${selectedCategory === 'All'
                                            ? 'text-neutral-900 dark:text-white font-medium border-l border-neutral-900 dark:border-white pl-[7px]'
                                            : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
                                            }`}
                                    >
                                        <span className="text-sm">Tüm ilanlar</span>
                                        <span className="text-[11px] tabular-nums text-neutral-400">{listings.length}</span>
                                    </button>

                                    {freeListingsCount > 0 && (
                                        <button
                                            onClick={() => setSelectedCategory('Free')}
                                            className={`w-full flex items-center justify-between px-2 py-2 rounded-sm transition-colors duration-200 cursor-pointer ${selectedCategory === 'Free'
                                                ? 'text-neutral-900 dark:text-white font-medium border-l border-neutral-900 dark:border-white pl-[7px]'
                                                : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
                                                }`}
                                        >
                                            <span className="text-sm">Ücretsiz ilanlar</span>
                                            <span className="text-[11px] tabular-nums text-neutral-400">{freeListingsCount}</span>
                                        </button>
                                    )}

                                    {Object.entries(categoryCounts).sort((a, b) => b[1] - a[1]).map(([category, count]) => (
                                        <button
                                            key={category}
                                            onClick={() => setSelectedCategory(category)}
                                            className={`w-full flex items-center justify-between px-2 py-2 rounded-sm transition-colors duration-200 cursor-pointer ${selectedCategory === category
                                                ? 'text-neutral-900 dark:text-white font-medium border-l border-neutral-900 dark:border-white pl-[7px]'
                                                : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
                                                }`}
                                        >
                                            <span className="text-sm truncate mr-2">{category}</span>
                                            <span className="text-[11px] tabular-nums text-neutral-400">{count}</span>
                                        </button>
                                    ))}
                                </nav>
                            </div>
                        )}

                        {/* Legal info */}
                        {storeInfo.legal_info && (
                            <div className="hidden lg:block bg-white dark:bg-neutral-950 rounded-md p-5 border border-neutral-200 dark:border-neutral-800 transition-colors">
                                <h3 className="text-[11px] font-medium text-neutral-500 uppercase tracking-[0.16em] mb-3">Yasal künye</h3>
                                <p className="text-xs text-neutral-500 dark:text-neutral-400 whitespace-pre-wrap leading-relaxed">{storeInfo.legal_info}</p>
                            </div>
                        )}
                    </div>

                    {/* ── MAIN PANEL ───────────────────────────────────────── */}
                    <div className="lg:col-span-3">
                        {/* Tabs */}
                        <div className="flex items-center gap-8 mb-6 border-b border-neutral-200 dark:border-neutral-800 transition-colors">
                            <button
                                onClick={() => setActiveTab('listings')}
                                className={`pb-3 text-sm tracking-[0.08em] uppercase transition-colors relative cursor-pointer ${activeTab === 'listings'
                                    ? 'text-neutral-900 dark:text-white font-medium'
                                    : 'text-neutral-400 dark:text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-100'
                                    }`}
                            >
                                İlanlar ({listings.length})
                                {activeTab === 'listings' && (
                                    <div className="absolute bottom-0 left-0 w-full h-px bg-neutral-900 dark:bg-white" />
                                )}
                            </button>
                            <button
                                onClick={() => setActiveTab('ratings')}
                                className={`pb-3 text-sm tracking-[0.08em] uppercase transition-colors relative cursor-pointer ${activeTab === 'ratings'
                                    ? 'text-neutral-900 dark:text-white font-medium'
                                    : 'text-neutral-400 dark:text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-100'
                                    }`}
                            >
                                Değerlendirmeler ({averageRating.count})
                                {activeTab === 'ratings' && (
                                    <div className="absolute bottom-0 left-0 w-full h-px bg-neutral-900 dark:bg-white" />
                                )}
                            </button>
                        </div>

                        {activeTab === 'listings' ? (
                            <>
                                <div className="flex items-center justify-between mb-5 transition-colors">
                                    <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">
                                        {selectedCategory === 'All' ? 'Mağazadaki ilanlar' : `${selectedCategory} ilanları`}
                                    </h2>
                                    <span className="text-sm text-neutral-400">{filteredListings.length} sonuç</span>
                                </div>

                                {filteredListings.length === 0 ? (
                                    <div className="bg-white dark:bg-neutral-950 rounded-md p-12 text-center border border-dashed border-neutral-200 dark:border-neutral-800 transition-colors">
                                        <p className="text-neutral-500 dark:text-neutral-400 text-sm">Bu kategoride henüz ilan bulunmuyor.</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-4 gap-2 sm:gap-6">
                                        {sortedListings.map((listing) => (
                                            <ListingCard key={listing.id} listing={listing} />
                                        ))}
                                    </div>
                                )}
                            </>
                        ) : (
                            /* RATINGS */
                            <div className="bg-white dark:bg-neutral-950 rounded-md border border-neutral-200 dark:border-neutral-800 p-6 transition-colors">
                                <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50 mb-6">Değerlendirmeler</h2>
                                <div className="flex items-center gap-8 mb-8 border border-neutral-200 dark:border-neutral-800 p-5 rounded-md">
                                    <div className="text-center">
                                        <div className="text-4xl font-semibold text-neutral-900 dark:text-neutral-100 mb-1">{averageRating.average}</div>
                                        <div className="flex items-center gap-0.5 justify-center mb-1">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <svg key={star} className={`w-4 h-4 ${star <= Math.round(averageRating.average) ? 'text-amber-400 fill-current' : 'text-neutral-300 dark:text-neutral-700'}`} viewBox="0 0 24 24">
                                                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                                </svg>
                                            ))}
                                        </div>
                                        <p className="text-sm text-neutral-500 dark:text-neutral-400">{averageRating.count} değerlendirme</p>
                                    </div>
                                    <div className="flex-1 border-l border-neutral-200 dark:border-neutral-800 pl-8">
                                        {[5, 4, 3, 2, 1].map((star) => {
                                            const count = ratings.filter(r => r.rating === star).length;
                                            const percentage = ratings.length > 0 ? (count / ratings.length) * 100 : 0;
                                            return (
                                                <div key={star} className="flex items-center gap-3 mb-2">
                                                    <div className="flex items-center gap-1 w-12 text-sm text-neutral-600 dark:text-neutral-400">
                                                        <span>{star}</span>
                                                        <svg className="w-3.5 h-3.5 text-amber-400 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>
                                                    </div>
                                                    <div className="flex-1 h-px bg-neutral-200 dark:bg-neutral-700 overflow-visible relative">
                                                        <div className="h-px bg-neutral-800 dark:bg-neutral-200" style={{ width: `${percentage}%` }} />
                                                    </div>
                                                    <div className="w-8 text-xs text-neutral-400 text-right tabular-nums">{count}</div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    {ratings.length === 0 ? (
                                        <div className="text-center py-12 text-gray-500 dark:text-neutral-400">
                                            <p>Henüz değerlendirme yapılmamış.</p>
                                        </div>
                                    ) : (
                                        ratings.map((rating) => (
                                            <div key={rating.id} className="border-b border-neutral-200 dark:border-neutral-800 last:border-0 pb-6 last:pb-0">
                                                <div className="flex items-start gap-4">
                                                    <img
                                                        src={rating.rater?.store_logo || rating.rater?.avatar_url || 'https://i.pravatar.cc/150'}
                                                        alt={rating.rater?.full_name || 'Kullanıcı'}
                                                        className="w-10 h-10 rounded-md object-cover bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-800"
                                                    />
                                                    <div className="flex-1">
                                                        <div className="flex items-center justify-between mb-1">
                                                            <h4 className="font-medium text-neutral-900 dark:text-neutral-100">{rating.rater?.full_name || 'Kullanıcı'}</h4>
                                                            <span className="text-xs text-neutral-400 dark:text-neutral-500">{new Date(rating.created_at).toLocaleDateString('tr-TR')}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1 mb-2">
                                                            {[1, 2, 3, 4, 5].map((star) => (
                                                                <svg key={star} className={`w-4 h-4 ${star <= rating.rating ? 'text-amber-400 fill-current' : 'text-neutral-300 dark:text-neutral-700'}`} viewBox="0 0 24 24">
                                                                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                                                </svg>
                                                            ))}
                                                        </div>
                                                        {rating.comment && (
                                                            <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">{rating.comment}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <MessageModal
                isOpen={showMessageModal}
                onClose={() => setShowMessageModal(false)}
                onSubmit={handleSendMessage}
                sellerName={storeInfo?.full_name || 'Mağaza'}
                listingTitle={t.sellerProfile.inquiryToSeller}
            />

            {/* Mobile Bottom Bar – above main nav (bottom-16) */}
            <div className="lg:hidden fixed bottom-16 left-0 right-0 bg-white dark:bg-neutral-950 border-t border-neutral-200 dark:border-neutral-800 p-3 z-[9998] flex items-center gap-3 transition-colors">
                <button
                    onClick={handleFollowToggle}
                    className={`flex-1 font-medium py-3 rounded-md transition-colors flex items-center justify-center gap-2 border text-sm cursor-pointer ${isFollowingSeller
                        ? 'bg-white dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400'
                        : 'bg-white dark:bg-neutral-950 border-neutral-900 dark:border-neutral-200 text-neutral-900 dark:text-neutral-100'
                        }`}
                >
                    {isFollowingSeller ? (
                        <>
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Takiptesin
                        </>
                    ) : (
                        <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                            </svg>
                            Takip Et
                        </>
                    )}
                </button>
                <button
                    onClick={() => setShowMessageModal(true)}
                    className="flex-1 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-medium py-3 rounded-md flex items-center justify-center gap-2 transition-colors text-sm cursor-pointer"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                    Mesaj Gönder
                </button>
            </div>
        </div>
    );
};

export default StorePage;
