import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { getConversations, sendMessage, markConversationAsRead } from './api/messages';
import { supabase } from './lib/supabase';
import { checkRatingEligibility, hasUserRated } from './api/ratings';
import RatingModal from './components/RatingModal';
import LoadingSpinner from './components/LoadingSpinner';
import { getSellerUrl } from './utils/slug';

function MessagesPage() {
    const { user, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Cache'deki eski bozuk verileri filtrele
    const [conversations, setConversations] = useState(() => {
        try {
            const saved = sessionStorage.getItem('conversations');
            if (!saved) return [];
            const parsed = JSON.parse(saved);
            if (!Array.isArray(parsed)) return [];
            return parsed.filter(c => c && c.user && c.user.id);
        } catch (e) {
            return [];
        }
    });

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedConversation, setSelectedConversation] = useState(() => {
        try {
            const saved = sessionStorage.getItem('selectedConversation');
            if (!saved) return null;
            const parsed = JSON.parse(saved);
            return (parsed && parsed.user && parsed.user.id) ? parsed : null;
        } catch (e) {
            return null;
        }
    });

    const [messageText, setMessageText] = useState('');
    const [loading, setLoading] = useState(() => {
        try {
            const saved = sessionStorage.getItem('conversations');
            return !saved || saved === '[]';
        } catch (e) {
            return true;
        }
    });

    const [userProfile, setUserProfile] = useState(null);
    const [canRateUser, setCanRateUser] = useState(false);
    const [hasRated, setHasRated] = useState(false);
    const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    const [blockedUsers, setBlockedUsers] = useState(() => {
        try {
            const saved = localStorage.getItem('blocked_users');
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            return [];
        }
    });

    // Mobilde dis sayfanin kaymasini engelle (Kleinanzeigen sabit ekran deneyimi)
    useEffect(() => {
        const originalOverflow = document.body.style.overflow;
        const originalOverscroll = document.body.style.overscrollBehavior;
        
        if (window.innerWidth < 768) {
            document.body.style.overflow = 'hidden';
            document.body.style.overscrollBehavior = 'none';
        }
        
        return () => {
            document.body.style.overflow = originalOverflow;
            document.body.style.overscrollBehavior = originalOverscroll;
        };
    }, []);

    // Mobilde tarayici / telefon geri tusuna basinca sohbetti kapatip listeye don
    useEffect(() => {
        const handlePopState = () => {
            setSelectedConversation(null);
        };
        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    const handleSelectConversation = (conv) => {
        setSelectedConversation(conv);
        if (window.innerWidth < 768) {
            window.history.pushState({ chatOpen: true }, '');
        }
    };

    const handleBackToList = () => {
        setSelectedConversation(null);
        if (window.history.state?.chatOpen) {
            window.history.back();
        }
    };

    const isUserBlocked = (userId) => {
        if (!userId) return false;
        return blockedUsers.includes(userId);
    };

    const handleToggleBlockUser = (userId) => {
        if (!userId) return;
        const currentlyBlocked = isUserBlocked(userId);
        let updated;
        if (currentlyBlocked) {
            updated = blockedUsers.filter(id => id !== userId);
            alert('Kullanıcı engeli kaldırıldı.');
        } else {
            if (!window.confirm('Bu kullanıcıyı engellemek istediğinizden emin misiniz? Engellenen kullanıcılardan mesaj almayacaksınız.')) return;
            updated = [...blockedUsers, userId];
            alert('Kullanıcı engellendi.');
        }
        setBlockedUsers(updated);
        try {
            localStorage.setItem('blocked_users', JSON.stringify(updated));
        } catch (e) {
            console.error('Error saving blocked users:', e);
        }
        setMenuOpen(false);
    };

    const messagesEndRef = useRef(null);

    // Scroll to bottom
    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [selectedConversation?.messages]);

    // Load user profile
    useEffect(() => {
        const loadUserProfile = async () => {
            if (user?.id) {
                try {
                    const { fetchUserProfile } = await import('./api/profile');
                    const profile = await fetchUserProfile(user.id);
                    setUserProfile(profile);
                } catch (error) {
                    console.error('Error loading user profile:', error);
                }
            }
        };
        loadUserProfile();
    }, [user?.id]);

    // Load conversations & Real-time subscription
    useEffect(() => {
        if (!user?.id) return;

        let isMounted = true;

        const loadConversations = async () => {
            try {
                const data = await getConversations();
                if (isMounted) {
                    const validData = (data || []).filter(c => c && c.user && c.user.id);
                    setConversations(validData);
                }
            } catch (error) {
                console.error('Error loading conversations:', error);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        loadConversations();

        const subscription = supabase
            .channel('public:messages')
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'messages',
                filter: `receiver_id=eq.${user.id}`
            }, (payload) => {
                const newMessage = payload.new;
                if (!newMessage) return;

                setConversations(prev => {
                    const existingIdx = prev.findIndex(c =>
                        c?.user?.id && (
                            (c.user.id === newMessage.sender_id && c.listing?.id === newMessage.listing_id) ||
                            (c.user.id === newMessage.receiver_id && c.listing?.id === newMessage.listing_id)
                        )
                    );

                    if (existingIdx > -1) {
                        const updated = [...prev];
                        const conv = { ...updated[existingIdx] };
                        const existingMessages = conv.messages || [];

                        if (!existingMessages.find(m => m.id === newMessage.id)) {
                            conv.messages = [...existingMessages, newMessage];
                            conv.lastMessage = newMessage;
                            if (newMessage.receiver_id === user.id && !newMessage.read) {
                                conv.unreadCount = (conv.unreadCount || 0) + 1;
                            }
                        }

                        updated[existingIdx] = conv;

                        setSelectedConversation(current => {
                            if (current?.user?.id &&
                                ((current.user.id === newMessage.sender_id && current.listing?.id === newMessage.listing_id) ||
                                    (current.user.id === newMessage.receiver_id && current.listing?.id === newMessage.listing_id))) {
                                return conv;
                            }
                            return current;
                        });

                        return [updated[existingIdx], ...updated.filter((_, i) => i !== existingIdx)];
                    } else {
                        loadConversations();
                        return prev;
                    }
                });
            })
            .subscribe();

        return () => {
            isMounted = false;
            supabase.removeChannel(subscription);
        };
    }, [user?.id]);

    // Handle initiated chat from listing detail
    useEffect(() => {
        const handleInitiatedChat = async () => {
            if (!user?.id || loading) return;

            const receiverId = location.state?.receiverId;
            if (!receiverId) return;

            const existingConv = conversations.find(c => c?.user?.id === receiverId);
            if (existingConv) {
                setSelectedConversation(existingConv);
                window.history.replaceState({}, document.title);
                return;
            }

            try {
                const { fetchUserProfile } = await import('./api/profile');
                const profile = await fetchUserProfile(receiverId);
                if (profile) {
                    const tempConv = {
                        user: {
                            id: profile.id,
                            full_name: profile.full_name,
                            avatar_url: profile.avatar_url,
                            store_logo: profile.store_logo
                        },
                        messages: [],
                        lastMessage: { content: '', created_at: new Date().toISOString() },
                        unreadCount: 0
                    };
                    setSelectedConversation(tempConv);
                }
            } catch (error) {
                console.error('Error initiating chat:', error);
            }
            window.history.replaceState({}, document.title);
        };
        handleInitiatedChat();
    }, [user?.id, loading, conversations, location.state]);

    // Mark as read
    useEffect(() => {
        if (selectedConversation?.user?.id && user?.id) {
            const partnerId = selectedConversation.user.id;
            setConversations(prev => prev.map(conv => {
                if (conv?.user?.id === partnerId && conv?.listing?.id === selectedConversation.listing?.id) {
                    return { ...conv, unreadCount: 0 };
                }
                return conv;
            }));
            markConversationAsRead(partnerId);
        }
    }, [selectedConversation?.user?.id, user?.id]);

    // Cache to sessionStorage
    useEffect(() => {
        if (selectedConversation?.user?.id) {
            try {
                sessionStorage.setItem('selectedConversation', JSON.stringify(selectedConversation));
            } catch (e) {}
        } else {
            sessionStorage.removeItem('selectedConversation');
        }
    }, [selectedConversation]);

    useEffect(() => {
        if (conversations.length > 0) {
            try {
                sessionStorage.setItem('conversations', JSON.stringify(conversations));
            } catch (e) {}
        }
    }, [conversations]);

    // Check rating eligibility
    useEffect(() => {
        const checkEligibility = async () => {
            if (selectedConversation?.user?.id && user?.id) {
                try {
                    const [eligible, rated] = await Promise.all([
                        checkRatingEligibility(selectedConversation.user.id),
                        hasUserRated(selectedConversation.user.id)
                    ]);
                    setCanRateUser(Boolean(eligible) && (selectedConversation.messages?.length || 0) >= 5);
                    setHasRated(Boolean(rated));
                } catch (e) {
                    setCanRateUser(false);
                    setHasRated(false);
                }
            } else {
                setCanRateUser(false);
                setHasRated(false);
            }
        };
        checkEligibility();
    }, [selectedConversation?.user?.id, user?.id]);

    const handleSendMessage = async (e, customText = null) => {
        if (e) e.preventDefault();
        const textToSend = customText || messageText;
        if (!textToSend.trim() || !selectedConversation?.user?.id || !user?.id) return;

        const receiverId = selectedConversation.user.id;
        const listingId = selectedConversation.listing?.id;
        const tempId = Date.now();
        const content = textToSend.trim();

        const newMessage = {
            id: tempId,
            content: content,
            sender_id: user.id,
            receiver_id: receiverId,
            created_at: new Date().toISOString(),
            read: false,
            sender: 'me'
        };

        setSelectedConversation(prev => ({
            ...prev,
            messages: [...(prev?.messages || []), newMessage]
        }));

        setConversations(prev => {
            const updated = prev.map(conv => {
                if (conv?.user?.id === receiverId && conv?.listing?.id === listingId) {
                    return {
                        ...conv,
                        lastMessage: newMessage,
                        messages: [...(conv.messages || []), newMessage]
                    };
                }
                return conv;
            });
            return updated.sort((a, b) => new Date(b.lastMessage?.created_at || 0) - new Date(a.lastMessage?.created_at || 0));
        });

        if (!customText) setMessageText('');

        try {
            await sendMessage(receiverId, content, listingId, userProfile?.phone);
        } catch (error) {
            console.error('Error sending message:', error);
            alert('Mesaj gönderilirken hata oluştu.');
        }
    };

    const handleDeleteConversation = async (conv, e) => {
        if (e) e.stopPropagation();
        if (!conv?.user?.id) return;
        if (!window.confirm('Bu konuşmayı silmek istediğinizden emin misiniz?')) return;

        try {
            const { deleteConversation } = await import('./api/messages');
            await deleteConversation(conv.user.id, conv.listing?.id);

            setConversations(prev => prev.filter(c =>
                !(c?.user?.id === conv.user.id && c?.listing?.id === conv.listing?.id)
            ));

            if (selectedConversation?.user.id === conv.user.id &&
                selectedConversation?.listing?.id === conv.listing?.id) {
                setSelectedConversation(null);
            }
            setMenuOpen(false);
        } catch (error) {
            console.error('Error deleting conversation:', error);
        }
    };

    // Filter conversations
    const filteredConversations = conversations.filter(conv => {
        if (!conv || !conv.user) return false;
        const userName = conv.user.full_name || '';
        const listingTitle = conv.listing?.title || '';
        const search = searchTerm.toLowerCase();
        return userName.toLowerCase().includes(search) || listingTitle.toLowerCase().includes(search);
    });

    const quickReplies = [
        'Merhaba, ürün hala satılık mı?',
        'Fiyatta pazarlık payı var mı?',
        'Ne zaman teslim alabilirim?',
        'Kargo ile gönderim yapıyor musunuz?'
    ];

    if (authLoading || loading) return <LoadingSpinner size="large" fullScreen />;

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-neutral-900 pt-20 pb-12 flex items-center justify-center px-4">
                <div className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 rounded-3xl p-10 text-center max-w-md shadow-sm">
                    <div className="w-16 h-16 bg-rose-50 dark:bg-rose-950/40 text-rose-600 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
                        🔒
                    </div>
                    <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">Giriş Yapmalısınız</h2>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-6">
                        Mesajlarınızı görüntülemek ve alıcı/satıcılarla konuşabilmek için lütfen hesabınıza giriş yapın.
                    </p>
                    <button
                        onClick={() => navigate('/login', { state: { from: '/messages' } })}
                        className="w-full py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-sm transition-all shadow-md active:scale-95"
                    >
                        Giriş Yap
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen md:min-h-0 bg-neutral-100 dark:bg-neutral-950 md:bg-transparent md:pt-24 md:pb-12">
            <div className="max-w-7xl mx-auto md:px-4">
                
                {/* Kleinanzeigen Mobil ve Masaüstü Sabit Çerçeve */}
                <div className="fixed inset-0 top-[56px] md:relative md:top-0 md:inset-auto w-full bg-white dark:bg-neutral-900 md:border md:border-neutral-200 md:dark:border-white/10 md:rounded-3xl shadow-none md:shadow-sm overflow-hidden flex flex-col md:flex-row h-[calc(100dvh-56px)] md:h-[750px] z-20">
                    
                    {/* SOL SÜTUN / GELEN MESAJLAR LİSTESİ (Sadece liste yukarı-aşağı kayar, sayfa sabit) */}
                    <div className={`w-full md:w-[380px] lg:w-[420px] flex-shrink-0 flex-col border-r border-neutral-200 dark:border-white/10 bg-neutral-50/70 dark:bg-neutral-900/70 h-full overflow-hidden ${selectedConversation ? 'hidden md:flex' : 'flex'}`}>
                        
                        {/* Sabit Liste Başlığı */}
                        <div className="p-3.5 sm:p-4 border-b border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900 flex-shrink-0">
                            <div className="flex items-center justify-between mb-2.5">
                                <h1 className="text-lg sm:text-xl font-black text-neutral-900 dark:text-white tracking-tight flex items-center gap-2">
                                    <span>Nachrichten</span>
                                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400">
                                        {conversations.length}
                                    </span>
                                </h1>
                            </div>

                            {/* Arama Kutusu */}
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Sohbetlerde veya ilanlarda ara..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2 bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white rounded-xl text-xs sm:text-sm border-none focus:ring-2 focus:ring-rose-500 transition-all placeholder:text-neutral-400"
                                />
                                <svg className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>

                        {/* SADECE AŞAĞI-YUKARI KAYAN LİSTE ALANI */}
                        <div className="flex-1 overflow-y-auto overscroll-contain divide-y divide-neutral-100 dark:divide-white/5 pb-20 md:pb-4">
                            {filteredConversations.length === 0 ? (
                                <div className="py-20 text-center text-neutral-400 px-4">
                                    <p className="text-4xl mb-2">💬</p>
                                    <p className="font-bold text-sm text-neutral-700 dark:text-neutral-300">Henüz mesajınız yok</p>
                                    <p className="text-xs text-neutral-400 mt-1 max-w-xs mx-auto">
                                        İlanlara mesaj gönderdiğinizde veya mesaj aldığınızda burada listelenir.
                                    </p>
                                </div>
                            ) : (
                                filteredConversations.map((conv) => {
                                    if (!conv || !conv.user) return null;
                                    const isSelected = selectedConversation?.user?.id === conv.user?.id && selectedConversation?.listing?.id === conv.listing?.id;
                                    const isDeleted = conv.listing?.is_deleted;
                                    const unread = (conv.unreadCount || 0) > 0;

                                    return (
                                        <div
                                            key={`${conv.user.id}-${conv.listing?.id || 'general'}`}
                                            onClick={() => handleSelectConversation(conv)}
                                            className={`p-3.5 sm:p-4 flex gap-3 cursor-pointer transition-colors relative active:bg-neutral-100 dark:active:bg-neutral-800/80 ${
                                                isSelected
                                                    ? 'bg-rose-50/80 dark:bg-rose-950/20'
                                                    : 'hover:bg-white dark:hover:bg-neutral-800/60 bg-transparent'
                                            }`}
                                        >
                                            {/* İlan Fotoğrafı veya Avatar */}
                                            <div className="relative w-13 h-13 sm:w-14 sm:h-14 rounded-xl overflow-hidden bg-neutral-200 dark:bg-neutral-800 flex-shrink-0 border border-neutral-200/60 dark:border-white/5">
                                                {conv.listing?.images?.[0] ? (
                                                    <img
                                                        src={conv.listing.images[0]}
                                                        alt=""
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : conv.user.avatar_url || conv.user.store_logo ? (
                                                    <img
                                                        src={conv.user.store_logo || conv.user.avatar_url}
                                                        alt=""
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center font-black text-rose-500 bg-rose-50 dark:bg-rose-950/30 text-lg">
                                                        {(conv.user.full_name || 'U').charAt(0).toUpperCase()}
                                                    </div>
                                                )}

                                                {unread && (
                                                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-600 rounded-full ring-2 ring-white dark:ring-neutral-900 animate-pulse" />
                                                )}
                                            </div>

                                            {/* Konuşma Bilgisi */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between mb-0.5">
                                                    <h3 className={`text-sm truncate pr-2 ${unread ? 'font-black text-neutral-900 dark:text-white' : 'font-bold text-neutral-800 dark:text-neutral-200'}`}>
                                                        {conv.user.full_name || 'Kullanıcı'}
                                                    </h3>
                                                    <span className="text-[11px] text-neutral-400 whitespace-nowrap">
                                                        {conv.lastMessage?.created_at ? new Date(conv.lastMessage.created_at).toLocaleDateString('tr-TR', { hour: '2-digit', minute: '2-digit' }) : ''}
                                                    </span>
                                                </div>

                                                {conv.listing && (
                                                    <div className="flex items-center gap-1.5 text-xs text-neutral-600 dark:text-neutral-300 font-semibold truncate mb-1">
                                                        {isDeleted ? (
                                                            <span className="text-red-500 text-[10px] bg-red-50 dark:bg-red-950/30 px-1 rounded font-bold">Silindi</span>
                                                        ) : null}
                                                        <span className="truncate">{conv.listing.title}</span>
                                                        {conv.listing.price && (
                                                            <span className="text-rose-600 dark:text-rose-400 font-bold shrink-0">
                                                                {Number(conv.listing.price).toLocaleString('tr-TR')} TL
                                                            </span>
                                                        )}
                                                    </div>
                                                )}

                                                <p className={`text-xs truncate ${unread ? 'font-bold text-neutral-900 dark:text-white' : 'text-neutral-400 dark:text-neutral-500'}`}>
                                                    {conv.lastMessage?.sender_id === user?.id && <span className="text-neutral-500">Siz: </span>}
                                                    {conv.lastMessage?.content || 'Konuşma başlatıldı'}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    {/* SAĞ SÜTUN / SOHBET DETAYI (Mesaj yazma alani daima sabit ve gorunur) */}
                    <div className={`flex-1 flex-col bg-white dark:bg-neutral-900 h-full overflow-hidden ${selectedConversation ? 'flex' : 'hidden md:flex'}`}>
                        {selectedConversation && selectedConversation.user ? (
                            <div className="flex flex-col h-full w-full">
                                
                                {/* 1. SABİT CHAT HEADER */}
                                <div className="p-3 sm:p-4 border-b border-neutral-200 dark:border-white/10 flex items-center justify-between bg-white dark:bg-neutral-900 flex-shrink-0 z-10 shadow-sm">
                                    <div className="flex items-center gap-2.5 min-w-0">
                                        <button
                                            onClick={handleBackToList}
                                            className="md:hidden flex items-center gap-1 px-2.5 py-1.5 text-rose-600 hover:text-rose-700 bg-rose-50 dark:bg-rose-950/40 rounded-xl active:scale-95 transition-all font-bold text-xs shrink-0"
                                            aria-label="Gelen Kutusu"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                                            </svg>
                                            <span>Gelenler</span>
                                        </button>

                                        <div
                                            onClick={() => navigate(getSellerUrl(selectedConversation.user), { state: { seller: selectedConversation.user } })}
                                            className="cursor-pointer flex items-center gap-2.5 min-w-0"
                                        >
                                            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden bg-neutral-200 dark:bg-neutral-800 flex-shrink-0">
                                                <img
                                                    src={selectedConversation.user.store_logo || selectedConversation.user.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedConversation.user.full_name || 'U')}&background=e11d48&color=fff`}
                                                    alt=""
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="min-w-0">
                                                <h2 className="text-sm sm:text-base font-bold text-neutral-900 dark:text-white truncate hover:text-rose-600 transition-colors">
                                                    {selectedConversation.user.full_name || 'Kullanıcı'}
                                                </h2>
                                                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                                                    ● Çevrimiçi
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Menü */}
                                    <div className="flex items-center gap-2 relative flex-shrink-0">
                                        {canRateUser && !hasRated && (
                                            <button
                                                onClick={() => setIsRatingModalOpen(true)}
                                                className="hidden sm:flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/40 rounded-full hover:bg-amber-100 transition-colors"
                                            >
                                                <span>⭐</span>
                                                <span>Değerlendir</span>
                                            </button>
                                        )}

                                        <button
                                            onClick={() => setMenuOpen(!menuOpen)}
                                            className="p-2 text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl transition-colors"
                                            aria-label="Diğer İşlemler"
                                        >
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                                            </svg>
                                        </button>

                                        {menuOpen && (
                                            <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-neutral-800 rounded-2xl shadow-xl border border-neutral-100 dark:border-white/10 py-1.5 z-50 text-xs font-semibold animate-fadeIn">
                                                <button
                                                    onClick={() => handleToggleBlockUser(selectedConversation.user.id)}
                                                    className="w-full text-left px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-700/50 flex items-center gap-2 text-neutral-700 dark:text-neutral-200"
                                                >
                                                    <span>🚫</span>
                                                    <span>{isUserBlocked(selectedConversation.user.id) ? 'Engeli Kaldır' : 'Kullanıcıyı Engelle'}</span>
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteConversation(selectedConversation)}
                                                    className="w-full text-left px-4 py-2 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center gap-2 text-red-600 dark:text-red-400"
                                                >
                                                    <span>🗑️</span>
                                                    <span>Sohbeti Sil</span>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* 2. SABİT İLAN KARTI */}
                                {selectedConversation.listing && (
                                    <div className="p-2.5 sm:p-3 bg-neutral-50 dark:bg-neutral-800/60 border-b border-neutral-200/70 dark:border-white/5 flex items-center justify-between gap-3 flex-shrink-0">
                                        <div className="flex items-center gap-2.5 min-w-0">
                                            {selectedConversation.listing.images?.[0] && (
                                                <img
                                                    src={selectedConversation.listing.images[0]}
                                                    alt=""
                                                    className="w-11 h-11 rounded-lg object-cover border border-neutral-200 dark:border-white/10 flex-shrink-0"
                                                />
                                            )}
                                            <div className="min-w-0">
                                                <h4 className="text-xs sm:text-sm font-bold text-neutral-900 dark:text-white truncate">
                                                    {selectedConversation.listing.title}
                                                </h4>
                                                {selectedConversation.listing.price && (
                                                    <p className="text-xs sm:text-sm font-black text-rose-600 dark:text-rose-400 mt-0.5">
                                                        {Number(selectedConversation.listing.price).toLocaleString('tr-TR')} TL
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {!selectedConversation.listing.is_deleted && (
                                            <button
                                                onClick={() => navigate(`/${selectedConversation.listing.slug || selectedConversation.listing.id}`)}
                                                className="px-3 py-1.5 bg-white dark:bg-neutral-700 border border-neutral-200 dark:border-white/10 rounded-xl text-xs font-bold text-neutral-800 dark:text-neutral-100 hover:bg-neutral-100 transition-colors shrink-0 shadow-sm"
                                            >
                                                İlana Git →
                                            </button>
                                        )}
                                    </div>
                                )}

                                {/* 3. SADECE MESAJLARIN KAYDIĞI İÇ ALAN */}
                                <div className="flex-1 overflow-y-auto overscroll-contain p-3 sm:p-4 space-y-3 bg-[#f8fafc] dark:bg-[#0b0f17]">
                                    <div className="text-center my-1">
                                        <span className="text-[10px] sm:text-[11px] font-semibold text-neutral-400 bg-white/80 dark:bg-neutral-800/80 px-3 py-1 rounded-full border border-neutral-200/50 dark:border-white/5">
                                            Güvenlik Uyarısı: Şifrenizi veya hesap bilgilerinizi paylaşmayın.
                                        </span>
                                    </div>

                                    {(selectedConversation.messages || []).map((msg) => {
                                        const isMe = msg.sender_id === user?.id || msg.sender === 'me';

                                        return (
                                            <div
                                                key={msg.id}
                                                className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                                            >
                                                <div className={`max-w-[82%] sm:max-w-[70%] rounded-2xl px-3.5 py-2 sm:px-4 sm:py-2.5 shadow-sm text-sm break-words ${
                                                    isMe
                                                        ? 'bg-rose-600 text-white rounded-br-sm'
                                                        : 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white rounded-bl-sm border border-neutral-200/60 dark:border-white/5'
                                                }`}>
                                                    <p className="leading-relaxed whitespace-pre-wrap text-[13px] sm:text-sm">{msg.content}</p>
                                                    <div className={`flex items-center justify-end gap-1 mt-1 text-[10px] ${isMe ? 'text-rose-100' : 'text-neutral-400'}`}>
                                                        <span>{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                        {isMe && <span>{msg.read ? '✓✓' : '✓'}</span>}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    <div ref={messagesEndRef} />
                                </div>

                                {/* 4. HIZLI CEVAP BUTONLARI */}
                                <div className="px-3 pt-2 bg-white dark:bg-neutral-900 flex gap-2 overflow-x-auto no-scrollbar flex-shrink-0 border-t border-neutral-100 dark:border-white/5">
                                    {quickReplies.map((reply, i) => (
                                        <button
                                            key={i}
                                            onClick={() => handleSendMessage(null, reply)}
                                            className="text-[11px] font-medium bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 px-3 py-1.5 rounded-full whitespace-nowrap transition-colors border border-neutral-200/50 dark:border-white/5 shrink-0"
                                        >
                                            {reply}
                                        </button>
                                    ))}
                                </div>

                                {/* 5. SABİT VE DAİMA GÖRÜNÜR MESAJ YAZMA ALANI */}
                                <div className="p-2.5 sm:p-3 bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-white/10 flex-shrink-0 z-20 pb-safe">
                                    <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            value={messageText}
                                            onChange={(e) => setMessageText(e.target.value)}
                                            placeholder="Mesajınızı yazın..."
                                            className="flex-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white rounded-full px-4 py-2.5 text-sm border-none focus:ring-2 focus:ring-rose-500 placeholder:text-neutral-400"
                                        />
                                        <button
                                            type="submit"
                                            disabled={!messageText.trim()}
                                            className="w-10 h-10 rounded-full bg-rose-600 text-white flex items-center justify-center hover:bg-rose-500 active:scale-95 transition-all disabled:opacity-40 disabled:scale-100 shadow-md shadow-rose-600/20 shrink-0"
                                            aria-label="Gönder"
                                        >
                                            <svg className="w-5 h-5 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                            </svg>
                                        </button>
                                    </form>
                                </div>

                                {isRatingModalOpen && (
                                    <RatingModal
                                        isOpen={isRatingModalOpen}
                                        onClose={() => setIsRatingModalOpen(false)}
                                        ratedUserId={selectedConversation.user.id}
                                        onSuccess={() => {
                                            alert('Değerlendirmeniz başarıyla gönderildi!');
                                            setCanRateUser(false);
                                            setHasRated(true);
                                        }}
                                    />
                                )}
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-neutral-400">
                                <div className="w-16 h-16 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-3xl mb-3">
                                    💬
                                </div>
                                <h3 className="font-bold text-base text-neutral-800 dark:text-neutral-200">Bir sohbet seçin</h3>
                                <p className="text-xs text-neutral-400 mt-1 max-w-xs">
                                    Mesajlaşmaya başlamak için soldaki listeden bir konuşmaya tıklayın.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MessagesPage;
