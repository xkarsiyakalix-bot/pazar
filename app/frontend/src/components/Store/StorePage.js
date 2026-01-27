import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { t } from '../../translations';
import { formatLastSeen, MessageModal } from '../../components';
import LoadingSpinner from '../LoadingSpinner';
import { applyPromotionExpiry } from '../../api/listings';
import { followUser, unfollowUser, isFollowing, getFollowersCount } from '../../api/follows';
import { getRatings, getUserAverageRating } from '../../api/ratings';

const StorePage = ({ sellerId: propSellerId }) => {
    const params = useParams();
    const sellerId = propSellerId || params.sellerId; // Prioritize prop (from SmartRoute) over params
    const navigate = useNavigate();
    const { user } = useAuth();
    const [storeInfo, setStoreInfo] = useState(null);
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isRedirecting, setIsRedirecting] = useState(false);
    const [showHours, setShowHours] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [isFollowingSeller, setIsFollowingSeller] = useState(false);
    const [followersCount, setFollowersCount] = useState(0);
    const [showMessageModal, setShowMessageModal] = useState(false);
    const [ratings, setRatings] = useState([]);
    const [averageRating, setAverageRating] = useState({ average: 0, count: 0 });
    const [activeTab, setActiveTab] = useState('listings'); // 'listings' or 'ratings'

    const [currentTime, setCurrentTime] = useState(new Date());
    const [showMobileShare, setShowMobileShare] = useState(false);
    const hoursDropdownRef = useRef(null);
    const shareDropdownRef = useRef(null);

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

                if (isUuid && profile.store_slug) {
                    setIsRedirecting(true);
                    // Force a hard redirect or use replace to prevent history stack buildup
                    window.location.replace(`/${profile.store_slug}`);
                    return;
                }

                setStoreInfo(profile);

                // Fetch store listings
                const { data: storeListings, error: listingsError } = await supabase
                    .from('listings')
                    .select('*')
                    .eq('user_id', actualSellerId)
                    .eq('status', 'active')
                    .order('created_at', { ascending: false });

                if (listingsError) throw listingsError;
                const processedListings = (storeListings || []).map(l => applyPromotionExpiry(l));
                setListings(processedListings);

                // Fetch ratings using actual UUID
                const ratingsData = await getRatings(actualSellerId);
                setRatings(ratingsData);

                const avgData = await getUserAverageRating(actualSellerId);
                setAverageRating(avgData);

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
    }, [sellerId]);

    // Calculate category counts
    const categoryCounts = listings.reduce((acc, curr) => {
        const cat = curr.category || 'Diğer';
        acc[cat] = (acc[cat] || 0) + 1;
        return acc;
    }, {});

    // Filter listings
    const filteredListings = selectedCategory === 'All'
        ? listings
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
            <div className="max-w-[1400px] mx-auto px-4 py-12 text-center">
                <h2 className="text-2xl font-bold text-gray-900">Mağaza bulunamadı.</h2>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen pb-12">
            {/* Store Banner - Constrained Width & Balanced Height */}
            <div className="max-w-[1400px] mx-auto px-4 pt-6">
                <div className="relative h-56 md:h-[240px] bg-gray-200 overflow-hidden rounded-2xl shadow-xl border-4 border-white">
                    {storeInfo.store_banner ? (
                        <img
                            src={storeInfo.store_banner}
                            alt={storeInfo.store_name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-800 via-gray-900 to-black opacity-95"></div>
                    )}

                    {/* Store Header Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent p-4 md:p-10 flex flex-col justify-end">
                        {/* Unified Share Button - TOP RIGHT */}
                        <div className="absolute top-4 right-4 z-[100]" ref={shareDropdownRef}>
                            <button
                                onClick={() => setShowMobileShare(!showMobileShare)}
                                className="w-9 h-9 md:w-11 md:h-11 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20 shadow-lg active:scale-90 transition-all hover:bg-white/20"
                            >
                                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                </svg>
                            </button>

                            {showMobileShare && (
                                <div className="absolute right-0 top-full -mt-1 w-40 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-1.5 z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
                                    <div className="flex flex-col gap-0.5">
                                        <button
                                            onClick={() => {
                                                const url = window.location.href;
                                                window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
                                                setShowMobileShare(false);
                                            }}
                                            className="flex items-center gap-2.5 px-2 py-1.5 rounded-xl hover:bg-gray-100 text-gray-700 transition-colors"
                                        >
                                            <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center text-white shrink-0">
                                                <svg className="w-3.5 h-3.5 fill-currentColor" viewBox="0 0 24 24">
                                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                                </svg>
                                            </div>
                                            <span className="text-[10px] font-bold">Facebook'ta Paylaş</span>
                                        </button>

                                        <button
                                            onClick={() => {
                                                const url = window.location.href;
                                                const text = `${storeInfo.store_name || storeInfo.full_name} mağazasını ExVitrin'de keşfedin!`;
                                                window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
                                                setShowMobileShare(false);
                                            }}
                                            className="flex items-center gap-2.5 px-2 py-1.5 rounded-xl hover:bg-gray-100 text-gray-700 transition-colors"
                                        >
                                            <div className="w-7 h-7 bg-green-500 rounded-lg flex items-center justify-center text-white shrink-0">
                                                <svg className="w-3.5 h-3.5 fill-currentColor" viewBox="0 0 24 24">
                                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.27 9.27 0 01-4.723-1.292l-.339-.202-3.51.92 1.017-3.65-.213-.339a9.204 9.204 0 01-1.513-5.07c0-5.116 4.158-9.273 9.274-9.273 2.479 0 4.808.966 6.557 2.715a9.192 9.192 0 012.711 6.56c0 5.117-4.158 9.275-9.276 9.275m8.211-17.487A11.026 11.026 0 0012.048 1.177c-6.115 0-11.09 4.974-11.09 11.088 0 2.112.553 4.135 1.611 5.922L.787 23l4.981-1.304c1.722.94 3.655 1.437 5.626 1.437h.005c6.114 0 11.089-4.975 11.089-11.088 0-2.937-1.144-5.698-3.235-7.791z" />
                                                </svg>
                                            </div>
                                            <span className="text-[10px] font-bold">WhatsApp</span>
                                        </button>

                                        <button
                                            onClick={() => {
                                                const url = window.location.href;
                                                const text = `${storeInfo.store_name || storeInfo.full_name} mağazasını ExVitrin'de keşfedin!`;
                                                window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
                                                setShowMobileShare(false);
                                            }}
                                            className="flex items-center gap-2.5 px-2 py-1.5 rounded-xl hover:bg-gray-100 text-gray-700 transition-colors"
                                        >
                                            <div className="w-7 h-7 bg-black rounded-lg flex items-center justify-center text-white shrink-0">
                                                <svg className="w-3.5 h-3.5 fill-currentColor" viewBox="0 0 1200 1227">
                                                    <path d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.137 519.284H714.163ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.854V687.828Z" />
                                                </svg>
                                            </div>
                                            <span className="text-[10px] font-bold">X (Twitter)</span>
                                        </button>

                                        <button
                                            onClick={() => {
                                                navigator.clipboard.writeText(window.location.href).then(() => {
                                                    alert('Bağlantı panoya kopyalandı!');
                                                });
                                                setShowMobileShare(false);
                                            }}
                                            className="flex items-center gap-2.5 px-2 py-1.5 rounded-xl hover:bg-gray-100 text-gray-700 transition-colors"
                                        >
                                            <div className="w-7 h-7 bg-gray-200 rounded-lg flex items-center justify-center text-gray-600 shrink-0">
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                                                </svg>
                                            </div>
                                            <span className="text-[10px] font-bold">Linki Kopyala</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="w-full flex flex-row items-center md:items-end gap-3 md:gap-8 text-white text-left">
                            <div className="relative shrink-0">
                                <img
                                    src={storeInfo.store_logo || storeInfo.avatar_url || 'https://i.pravatar.cc/150'}
                                    alt={storeInfo.store_name}
                                    className="w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-xl md:rounded-2xl border-2 md:border-4 border-white shadow-2xl object-cover bg-white transform hover:scale-105 transition-transform duration-500"
                                />
                                {storeInfo.is_pro && (
                                    <div className="absolute -top-2 -right-2 bg-gradient-to-br from-blue-500 to-blue-600 text-white text-[8px] md:text-xs uppercase font-black px-2 md:px-3 py-0.5 md:py-1 rounded-full shadow-xl border border-white">
                                        PRO
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 pb-0.5 sm:pb-1 min-w-0">
                                <h1 className="text-xl sm:text-3xl md:text-4xl font-black tracking-tight mb-1 sm:mb-2 drop-shadow-2xl truncate">
                                    {storeInfo.store_name || storeInfo.full_name}
                                </h1>
                                <div className="flex flex-wrap items-center justify-start gap-2 sm:gap-3">
                                    <p className="text-red-100 font-bold text-[10px] sm:text-base flex items-center gap-1.5 sm:gap-2 bg-white/10 backdrop-blur-md px-2 sm:px-3 py-0.5 sm:py-1 rounded-full border border-white/10 shadow-lg">
                                        {storeInfo.city && (
                                            <>
                                                <span className="truncate max-w-[80px] sm:max-w-none">{storeInfo.city}</span>
                                                <span className="w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full bg-red-400"></span>
                                            </>
                                        )}
                                        <span className="whitespace-nowrap">{listings.length} İlan</span>
                                    </p>
                                    {averageRating.count > 0 && (
                                        <div
                                            onClick={() => setActiveTab('ratings')}
                                            className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-0.5 sm:py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/10 shadow-lg cursor-pointer hover:bg-white/20 transition-all"
                                        >
                                            <svg className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-current" viewBox="0 0 24 24">
                                                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                            </svg>
                                            <span className="text-white font-bold text-[10px] sm:text-base">{averageRating.average}</span>
                                            <span className="text-white/60 text-[9px] sm:text-xs">({averageRating.count})</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Social Media Icons - Always visible for premium feel */}
                            <div className="pb-0.5 md:pb-1 flex flex-wrap gap-1.5 md:gap-2 justify-end">
                                <div className="flex gap-1.5 md:gap-2">
                                    <button
                                        onClick={() => window.open(storeInfo.facebook_url || 'https://facebook.com/exvitrin', '_blank')}
                                        className="w-8 h-8 md:w-10 md:h-10 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-lg md:rounded-xl flex items-center justify-center text-white transition-all hover:scale-110 shadow-lg border border-white/10"
                                        title={storeInfo.facebook_url ? "Facebook Sayfamız" : "Facebook"}
                                    >
                                        <svg className="w-4 h-4 md:w-5 md:h-5 fill-currentColor" viewBox="0 0 24 24">
                                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => window.open(storeInfo.instagram_url || 'https://instagram.com/exvitrin', '_blank')}
                                        className="w-8 h-8 md:w-10 md:h-10 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-lg md:rounded-xl flex items-center justify-center text-white transition-all hover:scale-110 shadow-lg border border-white/10"
                                        title={storeInfo.instagram_url ? "Instagram Sayfamız" : "Instagram"}
                                    >
                                        <svg className="w-4 h-4 md:w-5 md:h-5 fill-currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => window.open(storeInfo.twitter_url || 'https://x.com/exvitrin', '_blank')}
                                        className="w-8 h-8 md:w-10 md:h-10 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-lg md:rounded-xl flex items-center justify-center text-white transition-all hover:scale-110 shadow-lg border border-white/20"
                                        title={storeInfo.twitter_url ? "X (Twitter) Sayfamız" : "X (Twitter)"}
                                    >
                                        <svg className="w-4 h-4 md:w-5 md:h-5 fill-currentColor" viewBox="0 0 1200 1227">
                                            <path d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.137 519.284H714.163ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.854V687.828Z" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => window.open(storeInfo.tiktok_url || 'https://tiktok.com/@exvitrin', '_blank')}
                                        className="w-8 h-8 md:w-10 md:h-10 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-lg md:rounded-xl flex items-center justify-center text-white transition-all hover:scale-110 shadow-lg border border-white/10"
                                        title={storeInfo.tiktok_url ? "TikTok Sayfamız" : "TikTok"}
                                    >
                                        <svg className="w-4 h-4 md:w-5 md:h-5 fill-currentColor" viewBox="0 0 24 24">
                                            <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Store Info Panel - Separate High Visibility Panel */}
            <div className="relative z-20 mt-4 max-w-[1400px] mx-auto px-4 mb-0 sm:mb-8">
                <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4 md:p-6">
                    <div className="flex flex-wrap items-center justify-between gap-y-4 gap-x-6">
                        <div className="flex flex-wrap items-center gap-6 md:gap-10">
                            {storeInfo.phone && (
                                <div className="flex items-center gap-3 group">
                                    <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-red-500 group-hover:bg-red-500 group-hover:text-white transition-all shadow-sm group-hover:scale-105 duration-300">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Telefon</p>
                                        <p className="text-sm font-bold text-gray-900">{storeInfo.phone}</p>
                                    </div>
                                </div>
                            )}

                            {(storeInfo.street || storeInfo.city) && (
                                <div className="flex items-center gap-3 group">
                                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all shadow-sm group-hover:scale-105 duration-300">
                                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <circle cx="12" cy="12" r="8" />
                                            <circle cx="12" cy="12" r="2.5" fill="currentColor" stroke="none" />
                                            <line x1="12" y1="2" x2="12" y2="4" />
                                            <line x1="12" y1="20" x2="12" y2="22" />
                                            <line x1="2" y1="12" x2="4" y2="12" />
                                            <line x1="20" y1="12" x2="22" y2="12" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Adres</p>
                                        <p className="text-sm font-bold text-gray-900">
                                            {storeInfo.street ? `${storeInfo.street}, ` : ''}
                                            {storeInfo.city || ''}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {storeInfo.website && (
                                <div className="flex items-center gap-3 group">
                                    <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-500 group-hover:bg-purple-500 group-hover:text-white transition-all shadow-sm group-hover:scale-105 duration-300">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9-9c1.657 0 3 3.582 3 8s-1.343 8-3 8m0-16c-1.657 0-3 3.582-3 8s1.343 8 3 8m-11-8h11" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Web Sitesi</p>
                                        <a
                                            href={storeInfo.website.startsWith('http') ? storeInfo.website : `https://${storeInfo.website}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm font-bold text-gray-900 hover:text-red-500 transition-colors block"
                                        >
                                            {storeInfo.website.replace(/^https?:\/\//, '')}
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-3 group relative" ref={hoursDropdownRef}>
                            <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-500 group-hover:bg-green-500 group-hover:text-white transition-all shadow-sm group-hover:scale-105 duration-300 cursor-pointer">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="cursor-pointer" onClick={() => setShowHours(!showHours)}>
                                <div className="flex items-center justify-between mb-0.5">
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Çalışma Saatleri</p>
                                    <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-tighter ${isOpen ? 'bg-green-100 text-green-600 shadow-sm shadow-green-200/50' : 'bg-red-100 text-red-600 shadow-sm shadow-red-200/50'}`}>
                                        {isOpen ? 'AÇIK' : 'KAPALI'}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <p className="text-sm font-bold text-gray-900">
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
                                    <svg className={`w-3.5 h-3.5 text-gray-400 transform transition-transform duration-300 ${showHours ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>

                                {showHours && (
                                    <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 p-4 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                                        <h4 className="text-[10px] font-black text-gray-900 border-b border-gray-100 pb-2 mb-3 uppercase tracking-wider flex items-center justify-between">
                                            <span>Haftalık Program</span>
                                            <span className={`${isOpen ? 'text-green-500 bg-green-50' : 'text-red-500 bg-red-50'} text-[10px] px-2 py-0.5 rounded-full uppercase`}>
                                                {isOpen ? 'AÇIK' : 'KAPALI'}
                                            </span>
                                        </h4>
                                        <div className="space-y-1.5">
                                            {storeInfo.working_hours?.isAlwaysOpen ? (
                                                <div className="p-4 bg-green-50 rounded-xl border border-green-100 text-center">
                                                    <span className="text-xl mb-2 block">🌍</span>
                                                    <p className="text-[11px] font-black text-green-700 uppercase tracking-tight">7/24 Sürekli Açık</p>
                                                    <p className="text-[10px] text-green-600 mt-1 leading-tight">Bu mağaza haftanın her günü kesintisiz hizmet vermektedir.</p>
                                                </div>
                                            ) : (
                                                [
                                                    { id: 'mon', day: 'Pazartesi' },
                                                    { id: 'tue', day: 'Salı' },
                                                    { id: 'wed', day: 'Çarşamba' },
                                                    { id: 'thu', day: 'Perşembe' },
                                                    { id: 'fri', day: 'Cuma' },
                                                    { id: 'sat', day: 'Cumartesi' },
                                                    { id: 'sun', day: 'Pazar' }
                                                ].map((item, idx) => {
                                                    const schedule = storeInfo.working_hours?.[item.id];
                                                    const dayIndex = [0, 1, 2, 3, 4, 5, 6][(idx + 1) % 7]; // mon=1, sun=0
                                                    const isToday = new Date().getDay() === dayIndex;

                                                    return (
                                                        <div key={idx} className={`flex justify-between items-center text-[11px] font-medium ${isToday ? 'text-gray-900 bg-gray-50 -mx-2 px-2 py-1.5 rounded-lg' : 'text-gray-500'}`}>
                                                            <span>{item.day}</span>
                                                            <span className={isToday ? 'font-black' : ''}>
                                                                {schedule?.active ? `${schedule.open} - ${schedule.close}` : 'Kapalı'}
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
                    </div>
                </div>
            </div>

            <main className="max-w-[1400px] mx-auto px-4 pt-0 pb-8 sm:py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar: About Store & Categories */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Seller Profile Card - Desktop Only */}
                        <div className="hidden lg:block bg-white rounded-2xl shadow-xl border border-gray-100 p-8 overflow-hidden relative group">
                            {/* Decorative Background */}
                            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-gray-50 to-gray-100 -z-10"></div>

                            <div className="flex flex-col items-center">
                                <div className="relative mb-4">
                                    <img
                                        src={storeInfo.store_logo || storeInfo.avatar_url || 'https://i.pravatar.cc/150'}
                                        alt={storeInfo.store_name}
                                        className="w-24 h-24 rounded-2xl border-4 border-white shadow-lg object-cover bg-white"
                                    />
                                    {storeInfo.is_pro && (
                                        <div className="absolute -bottom-2 -right-2 bg-blue-500 text-white text-[10px] uppercase font-black px-2 py-0.5 rounded-full shadow-lg border-2 border-white">
                                            PRO
                                        </div>
                                    )}
                                </div>

                                <h3 className="text-xl font-black text-gray-900 text-center mb-1 group-hover:text-red-600 transition-colors">
                                    {storeInfo.store_name || storeInfo.full_name}
                                </h3>

                                <p className="text-[11px] font-bold text-gray-600 uppercase tracking-widest mb-4">
                                    {new Date(storeInfo.created_at).toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })}'den beri üye
                                </p>

                                {/* Rating Summary in Sidebar */}
                                <div className="flex flex-col items-center mb-6 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => setActiveTab('ratings')}>
                                    <div className="flex items-center gap-1 mb-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <svg
                                                key={star}
                                                className={`w-5 h-5 ${star <= Math.round(averageRating.average) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                                viewBox="0 0 24 24"
                                            >
                                                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                            </svg>
                                        ))}
                                    </div>
                                    <p className="text-sm font-bold text-gray-700">
                                        {averageRating.average}
                                    </p>
                                </div>

                                <div className="flex items-center gap-6 mb-6">
                                    <div className="text-center">
                                        <p className="text-lg font-black text-gray-900 leading-none">{listings.length}</p>
                                        <p className="text-[10px] font-bold text-gray-500 uppercase mt-1">İlan</p>
                                    </div>
                                    <div className="w-px h-8 bg-gray-100"></div>
                                    <div className="text-center">
                                        <p className="text-lg font-black text-gray-900 leading-none">{followersCount}</p>
                                        <p className="text-[10px] font-bold text-gray-500 uppercase mt-1">Takipçi</p>
                                    </div>
                                </div>

                                <div className="w-full space-y-3">
                                    <button
                                        onClick={() => setShowMessageModal(true)}
                                        className="w-full bg-white text-gray-900 font-bold py-3 rounded-xl border-2 border-gray-900 hover:bg-gray-900 hover:text-white transition-all flex items-center justify-center gap-2 group/btn"
                                    >
                                        <svg className="w-5 h-5 group-hover/btn:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                        </svg>
                                        Mesaj Gönder
                                    </button>

                                    <button
                                        onClick={handleFollowToggle}
                                        className={`w-full font-black py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 border-2 ${isFollowingSeller
                                            ? 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-red-50 hover:border-red-200 hover:text-red-600'
                                            : 'bg-white border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white'
                                            }`}
                                    >
                                        {isFollowingSeller ? (
                                            <>
                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                                Takibi Bırak
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
                                </div>
                            </div>
                        </div>

                        {/* Categories Filter - Only show if Listings tab is active */}
                        {activeTab === 'listings' && (
                            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                                <h3 className="text-lg font-bold text-gray-900 mb-4 tracking-tight">Kategoriler</h3>
                                <nav className="space-y-1">
                                    <button
                                        onClick={() => setSelectedCategory('All')}
                                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 group ${selectedCategory === 'All'
                                            ? 'bg-red-50 text-red-600 font-bold'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                            }`}
                                    >
                                        <span className="text-sm">Tüm İlanlar</span>
                                        <span className={`text-[11px] px-2 py-0.5 rounded-full ${selectedCategory === 'All' ? 'bg-red-200 text-red-700' : 'bg-gray-100 text-gray-500'}`}>
                                            {listings.length}
                                        </span>
                                    </button>
                                    {Object.entries(categoryCounts).sort((a, b) => b[1] - a[1]).map(([category, count]) => (
                                        <button
                                            key={category}
                                            onClick={() => setSelectedCategory(category)}
                                            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 group ${selectedCategory === category
                                                ? 'bg-red-50 text-red-600 font-bold'
                                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                                }`}
                                        >
                                            <span className="text-sm truncate mr-2">{category}</span>
                                            <span className={`text-[11px] px-2 py-0.5 rounded-full ${selectedCategory === category ? 'bg-red-200 text-red-700' : 'bg-gray-100 text-gray-500'}`}>
                                                {count}
                                            </span>
                                        </button>
                                    ))}
                                </nav>
                            </div>
                        )}



                        {storeInfo.legal_info && (
                            <div className="bg-gray-100 rounded-xl p-6 border border-gray-200">
                                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3">Yasal Künye</h3>
                                <p className="text-xs text-gray-500 whitespace-pre-wrap">{storeInfo.legal_info}</p>
                            </div>
                        )}
                    </div>

                    {/* Listings Grid or Ratings List */}
                    <div className="lg:col-span-3">
                        {/* Tabs */}
                        <div className="flex items-center gap-6 mb-6 border-b border-gray-200">
                            <button
                                onClick={() => setActiveTab('listings')}
                                className={`pb-4 text-sm font-bold uppercase tracking-wider transition-all relative ${activeTab === 'listings'
                                    ? 'text-red-600'
                                    : 'text-gray-500 hover:text-gray-900'
                                    }`}
                            >
                                İlanlar ({listings.length})
                                {activeTab === 'listings' && (
                                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-red-600 rounded-t-full"></div>
                                )}
                            </button>
                            <button
                                onClick={() => setActiveTab('ratings')}
                                className={`pb-4 text-sm font-bold uppercase tracking-wider transition-all relative ${activeTab === 'ratings'
                                    ? 'text-red-600'
                                    : 'text-gray-500 hover:text-gray-900'
                                    }`}
                            >
                                Değerlendirmeler ({averageRating.count})
                                {activeTab === 'ratings' && (
                                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-red-600 rounded-t-full"></div>
                                )}
                            </button>
                        </div>

                        {activeTab === 'listings' ? (
                            <>
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold text-gray-900">
                                        {selectedCategory === 'All' ? 'Mağazadaki İlanlar' : `${selectedCategory} İlanları`}
                                    </h2>
                                    <span className="text-sm text-gray-500 font-medium">{filteredListings.length} sonuç</span>
                                </div>

                                {filteredListings.length === 0 ? (
                                    <div className="bg-white rounded-xl p-12 text-center border-2 border-dashed border-gray-200">
                                        <div className="text-4xl mb-4">📦</div>
                                        <p className="text-gray-500 font-medium">Bu kategoride henüz ilan bulunmuyor.</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-2 sm:gap-6">
                                        {sortedListings.map((listing) => (
                                            <div
                                                key={listing.id}
                                                onClick={() => navigate(`/product/${listing.id}`)}
                                                className={`${(listing.is_gallery || ['galerie', 'gallery', 'galeri', 'vitrin'].includes(listing.package_type?.toLowerCase())) ? 'bg-purple-50/10 border-purple-300' : 'bg-white border-gray-100'} rounded-xl shadow-sm border overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group flex flex-col h-full`}
                                            >
                                                <div className="relative h-32 sm:h-48 overflow-hidden">
                                                    <img
                                                        src={(listing.images && listing.images[0]) || listing.image || 'https://via.placeholder.com/400x300?text=Resim+Yok'}
                                                        alt={listing.title}
                                                        className="w-full h-full object-cover transition-transform duration-500"
                                                    />
                                                    {/* RESERVIERT Badge - highest priority */}
                                                    {(listing.reserved_by || listing.status === 'reserved') && (
                                                        <div className="absolute top-1 left-1 bg-yellow-500 text-white px-2 py-0.5 rounded text-[9px] font-bold shadow-lg flex items-center gap-1 z-20">
                                                            <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                                            </svg>
                                                            REZERVE
                                                        </div>
                                                    )}

                                                    {/* Package Badge */}
                                                    {listing?.package_type &&
                                                        listing.package_type.toLowerCase() !== 'basic' &&
                                                        listing.package_type.toLowerCase() !== 'top' &&
                                                        listing.package_type.toLowerCase() !== 'galerie' && // Vitrin is handled separately
                                                        listing.package_type.toLowerCase() !== 'galeri' &&
                                                        listing.package_type.toLowerCase() !== 'gallery' &&
                                                        listing.package_type.toLowerCase() !== 'vitrin' &&
                                                        listing.package_type.toLowerCase() !== 'verlängerung' &&
                                                        listing.package_type.toLowerCase() !== 'extension' && (
                                                            <div className={`absolute ${(listing.reserved_by || listing.status === 'reserved') ? 'top-8' : 'top-1'} left-1 px-2 py-1 rounded-md text-[10px] font-bold shadow-md border border-white/20 z-10 uppercase tracking-wider ${listing.package_type.toLowerCase() === 'premium' || listing.package_type.toLowerCase() === 'z_premium' ? 'bg-gradient-to-r from-red-600 via-red-500 to-rose-600 text-white shadow-[0_0_15px_rgba(239,68,68,0.4)]' :
                                                                listing.package_type.toLowerCase() === 'multi-bump' || listing.package_type.toLowerCase() === 'z_multi_bump' ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-orange-200' :
                                                                    listing.package_type.toLowerCase() === 'plus' ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' :
                                                                        'bg-gradient-to-r from-yellow-400 to-yellow-600 text-gray-900 border-yellow-200'
                                                                }`}>
                                                                {listing.package_type.toLowerCase() === 'budget' || listing.package_type.toLowerCase() === 'highlight' ? 'ÖNE ÇIKAN' :
                                                                    listing.package_type.toLowerCase() === 'multi-bump' || listing.package_type.toLowerCase() === 'z_multi_bump' ? '⚡ YUKARI' :
                                                                        listing.package_type.toLowerCase() === 'premium' || listing.package_type.toLowerCase() === 'z_premium' ? '👑 PREMIUM' :
                                                                            listing.package_type}
                                                            </div>
                                                        )}

                                                    {/* Vitrin/Gallery Badge - Inclusive check */}
                                                    {(listing.is_gallery || ['galerie', 'gallery', 'galeri', 'vitrin'].includes(listing?.package_type?.toLowerCase())) && (
                                                        <div className={`absolute ${(listing.reserved_by || listing.status === 'reserved') ? 'top-8' : 'top-1'} left-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-md border border-white/20 z-10 flex items-center gap-1`}>
                                                            <span>⭐ VİTRİN</span>
                                                        </div>
                                                    )}

                                                    {listing?.is_highlighted && !listing?.is_top && !listing?.package_type && (
                                                        <div className={`absolute ${(listing.reserved_by || listing.status === 'reserved') ? 'top-8' : 'top-1'} left-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 px-2 py-1 rounded text-[10px] font-bold shadow-md z-10`}>
                                                            ✨ Öne Çıkarılan
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="p-2 sm:p-4 flex flex-col flex-1">
                                                    <h3 className="font-bold text-gray-700 text-sm sm:text-base line-clamp-2 min-h-[32px] sm:min-h-[48px] mb-1 sm:mb-2 transition-colors">
                                                        {listing.title}
                                                    </h3>
                                                    <div className="mt-auto">
                                                        <p className="text-base sm:text-2xl font-black text-gray-700 mb-1 sm:mb-3">
                                                            {listing.price !== null && listing.price !== undefined
                                                                ? `${listing.price.toLocaleString('tr-TR')} ₺`
                                                                : 'Fiyat Belirtilmemiş'}
                                                        </p>
                                                        <div className="flex items-center justify-between text-[10px] sm:text-xs text-gray-500 pt-2 sm:pt-3 border-t border-gray-50">
                                                            <span className="truncate mr-2">{listing.city || listing.location}</span>
                                                            <span className="shrink-0">{new Date(listing.created_at).toLocaleDateString('tr-TR')}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </>
                        ) : (
                            /* RATINGS LIST */
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Değerlendirmeler</h2>
                                <div className="flex items-center gap-8 mb-8 bg-gray-50 p-6 rounded-xl">
                                    <div className="text-center">
                                        <div className="text-5xl font-black text-gray-900 mb-1">{averageRating.average}</div>
                                        <div className="flex items-center gap-1 justify-center mb-1">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <svg
                                                    key={star}
                                                    className={`w-6 h-6 ${star <= Math.round(averageRating.average) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                                </svg>
                                            ))}
                                        </div>
                                        <p className="text-sm text-gray-500">{averageRating.count} Değerlendirme</p>
                                    </div>
                                    <div className="flex-1 border-l border-gray-200 pl-8">
                                        {[5, 4, 3, 2, 1].map((star) => {
                                            const count = ratings.filter(r => r.rating === star).length;
                                            const percentage = ratings.length > 0 ? (count / ratings.length) * 100 : 0;
                                            return (
                                                <div key={star} className="flex items-center gap-3 mb-2">
                                                    <div className="flex items-center gap-1 w-12 text-sm font-bold text-gray-600">
                                                        <span>{star}</span>
                                                        <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>
                                                    </div>
                                                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                        <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${percentage}%` }}></div>
                                                    </div>
                                                    <div className="w-8 text-xs text-gray-400 text-right">{count}</div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    {ratings.length === 0 ? (
                                        <div className="text-center py-12 text-gray-500">
                                            <p>Henüz değerlendirme yapılmamış.</p>
                                        </div>
                                    ) : (
                                        ratings.map((rating) => (
                                            <div key={rating.id} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
                                                <div className="flex items-start gap-4">
                                                    <img
                                                        src={rating.rater?.store_logo || rating.rater?.avatar_url || 'https://i.pravatar.cc/150'}
                                                        alt={rating.rater?.full_name || 'Kullanıcı'}
                                                        className="w-12 h-12 rounded-full object-cover bg-gray-100"
                                                    />
                                                    <div className="flex-1">
                                                        <div className="flex items-center justify-between mb-1">
                                                            <h4 className="font-bold text-gray-900">{rating.rater?.full_name || 'Kullanıcı'}</h4>
                                                            <span className="text-xs text-gray-400">{new Date(rating.created_at).toLocaleDateString('tr-TR')}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1 mb-2">
                                                            {[1, 2, 3, 4, 5].map((star) => (
                                                                <svg
                                                                    key={star}
                                                                    className={`w-4 h-4 ${star <= rating.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                                                    viewBox="0 0 24 24"
                                                                >
                                                                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                                                </svg>
                                                            ))}
                                                        </div>
                                                        {rating.comment && (
                                                            <p className="text-gray-600 text-sm leading-relaxed">{rating.comment}</p>
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

            {/* Mobile Bottom Bar (Sticky) - Positioned above main MobileBottomNavigation (h-16) */}
            <div className="lg:hidden fixed bottom-16 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-100 p-3 z-[9998] flex items-center gap-3 shadow-[0_-4px_15px_rgba(0,0,0,0.05)]">
                <button
                    onClick={handleFollowToggle}
                    className={`flex-1 font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 border-2 text-sm shadow-sm ${isFollowingSeller
                        ? 'bg-gray-50 border-gray-200 text-gray-600'
                        : 'bg-white border-gray-900 text-gray-900'
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
                    className="flex-1 bg-red-600 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg shadow-red-600/20 text-sm"
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
