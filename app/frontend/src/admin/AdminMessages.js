import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import LoadingSpinner from '../components/LoadingSpinner';
import { getListingUrl, getSellerUrl } from '../utils/slug';

export const AdminMessages = () => {
    const [messages, setMessages] = useState([]);
    const [profiles, setProfiles] = useState(new Map());
    const [listings, setListings] = useState(new Map());
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedConversationKey, setSelectedConversationKey] = useState(null);
    const [filterType, setFilterType] = useState('all'); // 'all', 'with_listing', 'direct'
    const [rlsNotice, setRlsNotice] = useState(false);

    useEffect(() => {
        loadAllMessages();
    }, []);

    const loadAllMessages = async () => {
        try {
            setLoading(true);
            setRlsNotice(false);

            // Fetch all messages (newest first)
            const { data: messagesData, error: messagesError } = await supabase
                .from('messages')
                .select('*')
                .order('created_at', { ascending: false });

            if (messagesError) {
                console.error('Error fetching admin messages:', messagesError);
                setRlsNotice(true);
                setLoading(false);
                return;
            }

            const rawMessages = messagesData || [];
            setMessages(rawMessages);

            if (rawMessages.length === 0) {
                // Could be RLS or genuinely no messages yet
                setLoading(false);
                return;
            }

            // Extract unique user IDs and listing IDs
            const userIds = new Set();
            const listingIds = new Set();

            rawMessages.forEach(msg => {
                if (msg.sender_id) userIds.add(msg.sender_id);
                if (msg.receiver_id) userIds.add(msg.receiver_id);
                if (msg.listing_id) listingIds.add(msg.listing_id);
            });

            // Fetch Profiles
            const profileMap = new Map();
            if (userIds.size > 0) {
                const { data: profilesData } = await supabase
                    .from('profiles')
                    .select('id, full_name, avatar_url, email, phone, user_number, store_slug, is_commercial')
                    .in('id', Array.from(userIds));

                profilesData?.forEach(p => profileMap.set(p.id, p));
            }
            setProfiles(profileMap);

            // Fetch Listings
            const listingMap = new Map();
            if (listingIds.size > 0) {
                const { data: listingsData } = await supabase
                    .from('listings')
                    .select('id, title, price, price_type, images, status, slug, listing_number')
                    .in('id', Array.from(listingIds));

                listingsData?.forEach(l => listingMap.set(l.id, l));
            }
            setListings(listingMap);

        } catch (err) {
            console.error('AdminMessages unexpected error:', err);
        } finally {
            setLoading(false);
        }
    };

    // Group messages into distinct conversations:
    // A conversation is between two users (User A & User B), optionally tied to a listing
    const conversations = useMemo(() => {
        const map = new Map();

        messages.forEach(msg => {
            const userA = msg.sender_id;
            const userB = msg.receiver_id;
            if (!userA || !userB) return;

            // Normalize user pair order so A->B and B->A share the same conversation
            const [firstUser, secondUser] = [userA, userB].sort();
            const listingKey = msg.listing_id || 'general';
            const conversationKey = `${firstUser}_${secondUser}_${listingKey}`;

            if (!map.has(conversationKey)) {
                map.set(conversationKey, {
                    key: conversationKey,
                    userA: profiles.get(firstUser) || { id: firstUser, full_name: 'Kullanıcı #' + firstUser.slice(0, 6) },
                    userB: profiles.get(secondUser) || { id: secondUser, full_name: 'Kullanıcı #' + secondUser.slice(0, 6) },
                    listing: msg.listing_id ? (listings.get(msg.listing_id) || { id: msg.listing_id, title: 'İlan (Silinmiş veya Arşivlenmiş)' }) : null,
                    lastMessage: msg,
                    messages: []
                });
            }

            const conv = map.get(conversationKey);
            conv.messages.push(msg);

            // Keep most recent message as lastMessage
            if (new Date(msg.created_at) > new Date(conv.lastMessage.created_at)) {
                conv.lastMessage = msg;
            }
        });

        // Convert to array and sort conversations by latest message date
        return Array.from(map.values()).sort(
            (a, b) => new Date(b.lastMessage.created_at) - new Date(a.lastMessage.created_at)
        );
    }, [messages, profiles, listings]);

    // Filter conversations
    const filteredConversations = useMemo(() => {
        return conversations.filter(conv => {
            // Type filter
            if (filterType === 'with_listing' && !conv.listing) return false;
            if (filterType === 'direct' && conv.listing) return false;

            // Search term filter
            if (!searchTerm.trim()) return true;
            const q = searchTerm.toLowerCase();

            const userAName = (conv.userA.full_name || conv.userA.email || '').toLowerCase();
            const userBName = (conv.userB.full_name || conv.userB.email || '').toLowerCase();
            const listingTitle = (conv.listing?.title || '').toLowerCase();
            const hasMatchingMessage = conv.messages.some(m => (m.content || '').toLowerCase().includes(q));

            return userAName.includes(q) || userBName.includes(q) || listingTitle.includes(q) || hasMatchingMessage;
        });
    }, [conversations, filterType, searchTerm]);

    // Automatically select first conversation if none selected
    useEffect(() => {
        if (!selectedConversationKey && filteredConversations.length > 0) {
            setSelectedConversationKey(filteredConversations[0].key);
        }
    }, [filteredConversations, selectedConversationKey]);

    const activeConversation = useMemo(() => {
        return conversations.find(c => c.key === selectedConversationKey) || null;
    }, [conversations, selectedConversationKey]);

    // Active conversation messages in chronological order (oldest to newest for chat flow)
    const activeMessagesSorted = useMemo(() => {
        if (!activeConversation) return [];
        return [...activeConversation.messages].sort(
            (a, b) => new Date(a.created_at) - new Date(b.created_at)
        );
    }, [activeConversation]);

    // Statistics
    const stats = useMemo(() => {
        const total = messages.length;
        const totalConversations = conversations.length;
        const withListing = conversations.filter(c => c.listing).length;
        const direct = totalConversations - withListing;
        const unread = messages.filter(m => !m.read).length;

        return { total, totalConversations, withListing, direct, unread };
    }, [messages, conversations]);

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        return d.toLocaleDateString('tr-TR', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatTimeOnly = (dateStr) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        return d.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
    };

    const getListingImageUrl = (listing) => {
        if (!listing || !listing.images || listing.images.length === 0) {
            return '/placeholder-image.jpg';
        }
        return listing.images[0];
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <span>💬</span> Mesajlaşmalar
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-neutral-400 mt-1">
                        Platformdaki tüm kullanıcılar arası mesajlaşmaları, ilgili ilanları ve geçmiş sohbet kayıtlarını denetleyin.
                    </p>
                </div>

                <button
                    onClick={loadAllMessages}
                    disabled={loading}
                    className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-xl text-white bg-red-600 hover:bg-red-700 active:scale-95 transition-all shadow-sm disabled:opacity-50"
                >
                    <span className={`mr-2 ${loading ? 'animate-spin' : ''}`}>🔄</span>
                    Yenile
                </button>
            </div>

            {/* RLS / Permission Notice if needed */}
            {rlsNotice && (
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-4 text-amber-900 dark:text-amber-200 text-sm flex items-start gap-3">
                    <span className="text-xl">⚠️</span>
                    <div className="flex-1">
                        <strong className="block font-semibold">Veritabanı İzni (RLS Politikası) Gerekli Olabilir:</strong>
                        <span>
                            Eğer mesajlar listelenmiyorsa, Supabase SQL Editor'de admin rolünün tüm mesajları görebilmesi için 
                            <code className="mx-1 px-1.5 py-0.5 bg-amber-100 dark:bg-amber-800/40 rounded text-xs">ADD_ADMIN_MESSAGES_POLICY.sql</code> 
                            dosyasını çalıştırmanız gerekebilir.
                        </span>
                    </div>
                </div>
            )}

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-neutral-900 p-4 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-gray-500 dark:text-neutral-400 uppercase tracking-wider">Toplam Mesaj</span>
                        <span className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-xl text-lg">💬</span>
                    </div>
                    <div className="text-2xl font-black text-gray-900 dark:text-white mt-2">
                        {stats.total.toLocaleString('tr-TR')}
                    </div>
                    <div className="text-xs text-gray-400 dark:text-neutral-500 mt-1">Platform genelinde yazılan</div>
                </div>

                <div className="bg-white dark:bg-neutral-900 p-4 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-gray-500 dark:text-neutral-400 uppercase tracking-wider">Konuşmalar</span>
                        <span className="p-2 bg-purple-50 dark:bg-purple-900/20 text-purple-600 rounded-xl text-lg">👥</span>
                    </div>
                    <div className="text-2xl font-black text-gray-900 dark:text-white mt-2">
                        {stats.totalConversations.toLocaleString('tr-TR')}
                    </div>
                    <div className="text-xs text-gray-400 dark:text-neutral-500 mt-1">Farklı kullanıcı & ilan çifti</div>
                </div>

                <div className="bg-white dark:bg-neutral-900 p-4 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-gray-500 dark:text-neutral-400 uppercase tracking-wider">İlan Sohbetleri</span>
                        <span className="p-2 bg-green-50 dark:bg-green-900/20 text-green-600 rounded-xl text-lg">🏷️</span>
                    </div>
                    <div className="text-2xl font-black text-gray-900 dark:text-white mt-2">
                        {stats.withListing.toLocaleString('tr-TR')}
                    </div>
                    <div className="text-xs text-gray-400 dark:text-neutral-500 mt-1">Bir ilana bağlı mesajlar</div>
                </div>

                <div className="bg-white dark:bg-neutral-900 p-4 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-gray-500 dark:text-neutral-400 uppercase tracking-wider">Direkt Mesaj</span>
                        <span className="p-2 bg-rose-50 dark:bg-rose-900/20 text-rose-600 rounded-xl text-lg">✉️</span>
                    </div>
                    <div className="text-2xl font-black text-gray-900 dark:text-white mt-2">
                        {stats.direct.toLocaleString('tr-TR')}
                    </div>
                    <div className="text-xs text-gray-400 dark:text-neutral-500 mt-1">İlansız direkt konuşmalar</div>
                </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="bg-white dark:bg-neutral-900 p-4 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
                <div className="relative flex-1">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                        🔍
                    </span>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Kullanıcı adı, ilan başlığı veya mesaj içeriği ara..."
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-neutral-800 bg-gray-50 dark:bg-neutral-950 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
                    />
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm('')}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-white"
                        >
                            ✕
                        </button>
                    )}
                </div>

                {/* Filter Tabs */}
                <div className="flex items-center gap-1.5 p-1 bg-gray-100 dark:bg-neutral-800 rounded-xl">
                    <button
                        onClick={() => setFilterType('all')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${filterType === 'all'
                            ? 'bg-white dark:bg-neutral-900 text-gray-900 dark:text-white shadow-sm'
                            : 'text-gray-600 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white'
                            }`}
                    >
                        Tümü ({conversations.length})
                    </button>
                    <button
                        onClick={() => setFilterType('with_listing')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${filterType === 'with_listing'
                            ? 'bg-white dark:bg-neutral-900 text-gray-900 dark:text-white shadow-sm'
                            : 'text-gray-600 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white'
                            }`}
                    >
                        🏷️ İlanlı ({stats.withListing})
                    </button>
                    <button
                        onClick={() => setFilterType('direct')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${filterType === 'direct'
                            ? 'bg-white dark:bg-neutral-900 text-gray-900 dark:text-white shadow-sm'
                            : 'text-gray-600 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white'
                            }`}
                    >
                        ✉️ Direkt ({stats.direct})
                    </button>
                </div>
            </div>

            {/* Main Chat Layout: Left (Conversations List) & Right (Chat Thread) */}
            {loading ? (
                <div className="py-20 flex flex-col items-center justify-center bg-white dark:bg-neutral-900 rounded-3xl border border-gray-100 dark:border-white/5">
                    <LoadingSpinner size="large" />
                    <p className="text-sm text-gray-500 dark:text-neutral-400 mt-4">Mesajlar ve kullanıcı geçmişi yükleniyor...</p>
                </div>
            ) : filteredConversations.length === 0 ? (
                <div className="py-20 text-center bg-white dark:bg-neutral-900 rounded-3xl border border-dashed border-gray-200 dark:border-neutral-800">
                    <div className="text-5xl mb-3">📭</div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Henüz Mesaj Bulunamadı</h3>
                    <p className="text-sm text-gray-500 dark:text-neutral-400 mt-1 max-w-md mx-auto">
                        {searchTerm ? 'Arama kriterlerinize uygun mesajlaşma bulunamadı.' : 'Veritabanında henüz kayıtlı bir kullanıcı mesajı bulunmuyor veya admin RLS izni gerekiyor.'}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[720px]">
                    {/* Left Column: Conversations List (5 cols) */}
                    <div className="lg:col-span-5 bg-white dark:bg-neutral-900 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm flex flex-col overflow-hidden">
                        <div className="p-4 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-neutral-500">
                                Konuşma Listesi ({filteredConversations.length})
                            </span>
                            <span className="text-[11px] text-gray-400 dark:text-neutral-500">
                                En son mesaja göre sıralı
                            </span>
                        </div>

                        <div className="flex-1 overflow-y-auto divide-y divide-gray-50 dark:divide-white/5 custom-scrollbar">
                            {filteredConversations.map(conv => {
                                const isSelected = conv.key === selectedConversationKey;
                                const userA = conv.userA;
                                const userB = conv.userB;
                                const listing = conv.listing;
                                const lastMsg = conv.lastMessage;

                                return (
                                    <div
                                        key={conv.key}
                                        onClick={() => setSelectedConversationKey(conv.key)}
                                        className={`p-4 cursor-pointer transition-all hover:bg-gray-50 dark:hover:bg-neutral-800/40 relative ${isSelected
                                            ? 'bg-red-50/60 dark:bg-red-950/20 border-l-4 border-red-600'
                                            : ''
                                            }`}
                                    >
                                        {/* Top row: User A -> User B */}
                                        <div className="flex items-center justify-between gap-2 mb-1.5">
                                            <div className="flex items-center gap-1.5 min-w-0 font-semibold text-sm text-gray-900 dark:text-white truncate">
                                                <span className="truncate" title={userA.full_name || 'Kullanıcı'}>
                                                    {userA.full_name || 'Kullanıcı'}
                                                </span>
                                                <span className="text-xs text-gray-400">➔</span>
                                                <span className="truncate" title={userB.full_name || 'Kullanıcı'}>
                                                    {userB.full_name || 'Kullanıcı'}
                                                </span>
                                            </div>
                                            <span className="text-[10px] text-gray-400 whitespace-nowrap">
                                                {formatTimeOnly(lastMsg.created_at)}
                                            </span>
                                        </div>

                                        {/* Listing badge if attached */}
                                        {listing && (
                                            <div className="flex items-center gap-2 mb-2 p-1.5 bg-gray-50 dark:bg-neutral-800/80 rounded-lg border border-gray-100 dark:border-white/5">
                                                <img
                                                    src={getListingImageUrl(listing)}
                                                    alt={listing.title}
                                                    className="w-7 h-7 rounded object-cover flex-shrink-0"
                                                    onError={(e) => { e.currentTarget.src = '/placeholder-image.jpg'; }}
                                                />
                                                <span className="text-xs font-medium text-gray-700 dark:text-neutral-300 truncate">
                                                    🏷️ {listing.title}
                                                </span>
                                            </div>
                                        )}

                                        {/* Last message preview */}
                                        <div className="flex items-center justify-between gap-2 text-xs text-gray-500 dark:text-neutral-400">
                                            <p className="truncate flex-1">
                                                {lastMsg.content}
                                            </p>
                                            <span className="px-2 py-0.5 rounded-full text-[10px] bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-neutral-400 font-medium">
                                                {conv.messages.length} mesaj
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Right Column: Chat History & Participants Details (7 cols) */}
                    <div className="lg:col-span-7 bg-white dark:bg-neutral-900 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm flex flex-col overflow-hidden">
                        {activeConversation ? (
                            <>
                                {/* Conversation Header */}
                                <div className="p-4 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-neutral-800/20">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                        {/* User Pair */}
                                        <div className="flex items-center gap-3">
                                            <div className="flex -space-x-2">
                                                <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-sm ring-2 ring-white dark:ring-neutral-900">
                                                    {(activeConversation.userA.full_name || 'U').charAt(0).toUpperCase()}
                                                </div>
                                                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm ring-2 ring-white dark:ring-neutral-900">
                                                    {(activeConversation.userB.full_name || 'U').charAt(0).toUpperCase()}
                                                </div>
                                            </div>

                                            <div>
                                                <div className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-1.5">
                                                    <span>{activeConversation.userA.full_name || 'Kullanıcı'}</span>
                                                    <span className="text-gray-400">ve</span>
                                                    <span>{activeConversation.userB.full_name || 'Kullanıcı'}</span>
                                                </div>
                                                <div className="text-xs text-gray-500 dark:text-neutral-400 flex items-center gap-2 mt-0.5">
                                                    {activeConversation.userA.user_number && (
                                                        <span>#{activeConversation.userA.user_number}</span>
                                                    )}
                                                    {activeConversation.userA.email && (
                                                        <span>• {activeConversation.userA.email}</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* User profile links */}
                                        <div className="flex items-center gap-2">
                                            <a
                                                href={getSellerUrl(activeConversation.userA)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="px-2.5 py-1 rounded-lg text-xs font-medium text-gray-600 dark:text-neutral-300 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 hover:text-red-600 transition-colors"
                                            >
                                                1. Profil ↗
                                            </a>
                                            <a
                                                href={getSellerUrl(activeConversation.userB)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="px-2.5 py-1 rounded-lg text-xs font-medium text-gray-600 dark:text-neutral-300 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 hover:text-red-600 transition-colors"
                                            >
                                                2. Profil ↗
                                            </a>
                                        </div>
                                    </div>

                                    {/* Associated Listing Banner */}
                                    {activeConversation.listing && (
                                        <div className="mt-3 p-3 bg-white dark:bg-neutral-900 rounded-xl border border-gray-100 dark:border-neutral-800 flex items-center justify-between gap-3 shadow-xs">
                                            <div className="flex items-center gap-3 min-w-0">
                                                <img
                                                    src={getListingImageUrl(activeConversation.listing)}
                                                    alt={activeConversation.listing.title}
                                                    className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                                                    onError={(e) => { e.currentTarget.src = '/placeholder-image.jpg'; }}
                                                />
                                                <div className="min-w-0">
                                                    <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">İlgili İlan</div>
                                                    <div className="text-sm font-bold text-gray-900 dark:text-white truncate">
                                                        {activeConversation.listing.title}
                                                    </div>
                                                    {activeConversation.listing.price !== undefined && (
                                                        <div className="text-xs font-bold text-red-600">
                                                            {Number(activeConversation.listing.price).toLocaleString('tr-TR')} TL
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {activeConversation.listing.id && (
                                                <a
                                                    href={getListingUrl(activeConversation.listing)}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors whitespace-nowrap"
                                                >
                                                    İlanı Aç ↗
                                                </a>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Messages Flow (Scrollable Chat) */}
                                <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-gray-50/30 dark:bg-neutral-950/40 custom-scrollbar">
                                    <div className="text-center my-2">
                                        <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-gray-200/60 dark:bg-neutral-800 text-gray-500 dark:text-neutral-400">
                                            Sohbet Başlangıcı • {activeMessagesSorted.length} Mesaj
                                        </span>
                                    </div>

                                    {activeMessagesSorted.map((msg, idx) => {
                                        const sender = profiles.get(msg.sender_id) || { full_name: 'Kullanıcı' };
                                        const isFirstUser = msg.sender_id === activeConversation.userA.id;

                                        return (
                                            <div
                                                key={msg.id || idx}
                                                className={`flex flex-col ${isFirstUser ? 'items-start' : 'items-end'}`}
                                            >
                                                {/* Sender info */}
                                                <div className="flex items-center gap-1.5 mb-1 px-1 text-[11px] text-gray-500 dark:text-neutral-400">
                                                    <span className="font-bold text-gray-700 dark:text-neutral-300">
                                                        {sender.full_name || 'Kullanıcı'}
                                                    </span>
                                                    {sender.user_number && (
                                                        <span className="text-[10px] text-gray-400">#{sender.user_number}</span>
                                                    )}
                                                    {msg.sender_phone && (
                                                        <span className="text-[10px] text-green-600 font-medium">📞 {msg.sender_phone}</span>
                                                    )}
                                                    <span>•</span>
                                                    <span>{formatDate(msg.created_at)}</span>
                                                </div>

                                                {/* Message bubble */}
                                                <div
                                                    className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-xs text-sm leading-relaxed ${isFirstUser
                                                        ? 'bg-white dark:bg-neutral-800 text-gray-900 dark:text-white rounded-tl-xs border border-gray-100 dark:border-white/5'
                                                        : 'bg-red-600 text-white rounded-tr-xs shadow-red-600/10'
                                                        }`}
                                                >
                                                    <p className="whitespace-pre-wrap break-words">{msg.content}</p>

                                                    <div className={`mt-1.5 text-[10px] flex items-center justify-end gap-1 ${isFirstUser ? 'text-gray-400' : 'text-red-100'}`}>
                                                        <span>{msg.read ? '✓✓ Okundu' : '✓ Gönderildi'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-gray-400">
                                <span className="text-4xl mb-2">💬</span>
                                <p className="text-sm font-medium">Görüntülemek için soldan bir konuşma seçin.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminMessages;

