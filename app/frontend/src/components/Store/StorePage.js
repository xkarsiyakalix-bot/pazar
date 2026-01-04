import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { t } from '../../translations';
import { formatLastSeen, MessageModal } from '../../components';
import { followUser, unfollowUser, isFollowing, getFollowersCount } from '../../api/follows';

const StorePage = () => {
    const { sellerId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [storeInfo, setStoreInfo] = useState(null);
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showHours, setShowHours] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [isFollowingSeller, setIsFollowingSeller] = useState(false);
    const [followersCount, setFollowersCount] = useState(0);
    const [showMessageModal, setShowMessageModal] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());

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
                const { data: profile, error: profileError } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', sellerId)
                    .single();

                if (profileError) throw profileError;
                setStoreInfo(profile);

                // Fetch store listings
                const { data: storeListings, error: listingsError } = await supabase
                    .from('listings')
                    .select('*')
                    .eq('user_id', sellerId)
                    .eq('status', 'active')
                    .order('created_at', { ascending: false });

                if (listingsError) throw listingsError;
                setListings(storeListings);
            } catch (error) {
                console.error('Error fetching store data:', error);
            } finally {
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

    const isStoreOpen = () => {
        if (!storeInfo?.working_hours) return true;

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

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
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
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-6 md:p-10 flex flex-col justify-end">
                        <div className="w-full flex flex-col md:flex-row items-center md:items-end gap-5 md:gap-8 text-white text-center md:text-left">
                            <div className="relative shrink-0">
                                <img
                                    src={storeInfo.store_logo || storeInfo.avatar_url || 'https://i.pravatar.cc/150'}
                                    alt={storeInfo.store_name}
                                    className="w-24 h-24 md:w-32 md:h-32 rounded-2xl border-4 border-white shadow-2xl object-cover bg-white transform hover:scale-105 transition-transform duration-500"
                                />
                                {storeInfo.is_pro && (
                                    <div className="absolute -top-3 -right-3 bg-gradient-to-br from-blue-500 to-blue-600 text-white text-[10px] md:text-xs uppercase font-black px-3 py-1 rounded-full shadow-xl border-2 border-white">
                                        PRO
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 pb-1">
                                <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2 drop-shadow-2xl">{storeInfo.store_name || storeInfo.full_name}</h1>
                                <div className="flex items-center justify-center md:justify-start gap-3">
                                    <p className="text-red-100 font-bold text-sm md:text-base flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 shadow-lg">
                                        {storeInfo.city && (
                                            <>
                                                <span>{storeInfo.city}</span>
                                                <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                                            </>
                                        )}
                                        <span>{listings.length} İlan</span>
                                    </p>
                                </div>
                            </div>
                            <div className="pb-1">
                                <button
                                    onClick={() => setShowMessageModal(true)}
                                    className="bg-white text-gray-900 font-extrabold py-3 px-8 rounded-xl shadow-2xl hover:bg-red-50 hover:scale-105 active:scale-95 transition-all flex items-center gap-3 text-sm group"
                                >
                                    <svg className="w-5 h-5 text-red-500 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                    </svg>
                                    Mesaj Gönder
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Store Info Panel - Separate High Visibility Panel */}
            <div className="relative z-20 mt-4 max-w-[1400px] mx-auto px-4 mb-8">
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

                        <div className="flex items-center gap-3 group relative">
                            <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-500 group-hover:bg-green-500 group-hover:text-white transition-all shadow-sm group-hover:scale-105 duration-300 cursor-help">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="cursor-help" onClick={() => setShowHours(!showHours)}>
                                <div className="flex items-center justify-between mb-0.5">
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Çalışma Saatleri</p>
                                    <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-tighter ${isOpen ? 'bg-green-100 text-green-600 shadow-sm shadow-green-200/50' : 'bg-red-100 text-red-600 shadow-sm shadow-red-200/50'}`}>
                                        {isOpen ? 'AÇIK' : 'KAPALI'}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <p className="text-sm font-bold text-gray-900">
                                        {(() => {
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
                                            {[
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
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <main className="max-w-[1400px] mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar: About Store & Categories */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Seller Profile Card - NEW */}
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 overflow-hidden relative group">
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

                        {/* Categories Filter */}
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

                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Mağaza Hakkında</h3>
                            <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">
                                {storeInfo.store_description || 'Kurumsal mağazamıza hoş geldiniz.'}
                            </p>

                            <hr className="my-6 border-gray-100" />

                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>{formatLastSeen(storeInfo.last_seen)}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span>{new Date(storeInfo.created_at).toLocaleDateString('tr-TR')} tarihinden beri üye</span>
                                </div>
                            </div>
                        </div>

                        {storeInfo.legal_info && (
                            <div className="bg-gray-100 rounded-xl p-6 border border-gray-200">
                                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3">Yasal Künye</h3>
                                <p className="text-xs text-gray-500 whitespace-pre-wrap">{storeInfo.legal_info}</p>
                            </div>
                        )}
                    </div>

                    {/* Listings Grid */}
                    <div className="lg:col-span-3">
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
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                {filteredListings.map((listing) => (
                                    <div
                                        key={listing.id}
                                        onClick={() => navigate(`/product/${listing.id}`)}
                                        className="bg-white rounded-b-xl rounded-t-none shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group flex flex-col h-full"
                                    >
                                        <div className="relative h-48 overflow-hidden">
                                            <img
                                                src={(listing.images && listing.images[0]) || listing.image || 'https://via.placeholder.com/400x300?text=Resim+Yok'}
                                                alt={listing.title}
                                                className="w-full h-full object-cover transition-transform duration-500"
                                            />
                                            {listing.is_top && (
                                                <div className="absolute top-3 left-3 bg-yellow-400 text-gray-900 text-[10px] font-bold px-2 py-1 rounded-md shadow-lg">
                                                    ÖNE ÇIKAN
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-4 flex flex-col flex-1">
                                            <h3 className="font-bold text-gray-700 line-clamp-2 min-h-[48px] mb-2 transition-colors">
                                                {listing.title}
                                            </h3>
                                            <div className="mt-auto">
                                                <p className="text-2xl font-black text-gray-700 mb-3">
                                                    {listing.price !== null && listing.price !== undefined
                                                        ? `${listing.price.toLocaleString('tr-TR')} ₺`
                                                        : 'Fiyat Belirtilmemiş'}
                                                </p>
                                                <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-50">
                                                    <span className="truncate mr-2">{listing.city || listing.location}</span>
                                                    <span className="shrink-0">{new Date(listing.created_at).toLocaleDateString('tr-TR')}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
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
        </div>
    );
};

export default StorePage;
