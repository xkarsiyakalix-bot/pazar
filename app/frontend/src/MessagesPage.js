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

    // Mobilde aktif sohbet acikken alt navigasyon cubugunu gizle
    useEffect(() => {
        if (selectedConversation && window.innerWidth < 768) {
            document.body.classList.add('chat-open');
        } else {
            document.body.classList.remove('chat-open');
        }
        return () => {
            document.body.classList.remove('chat-open');
        };
    }, [selectedConversation]);

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
            <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 pt-20 pb-12 flex items-center justify-center px-4">
                <div className="w-full max-w-sm bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-8 text-center">
                    <div className="w-10 h-10 mx-auto mb-4 border border-neutral-200 dark:border-neutral-700 rounded-md flex items-center justify-center text-neutral-500">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                        </svg>
                    </div>
                    <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100 mb-1.5">Giriş yapın</h2>
                    <p className="text-[13px] leading-relaxed text-neutral-500 dark:text-neutral-400 mb-6">
                        Mesajlarınızı görüntülemek ve alıcı veya satıcılarla yazışmak için hesabınıza giriş yapın.
                    </p>
                    <button
                        onClick={() => navigate('/login', { state: { from: '/messages' } })}
                        className="w-full py-2.5 bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-neutral-900 font-medium rounded-md text-sm transition-colors"
                    >
                        Giriş Yap
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen md:min-h-0 bg-neutral-50 dark:bg-neutral-950 md:bg-transparent md:pt-24 md:pb-12">
            <div className="max-w-7xl mx-auto md:px-4">
                <div
                    data-chat-active={Boolean(selectedConversation)}
                    className={`${selectedConversation ? "fixed inset-0 z-[10000] h-[100dvh]" : "fixed inset-0 top-16 bottom-16 h-[calc(100dvh-128px)] z-20"} md:relative md:top-0 md:bottom-auto md:inset-auto md:h-[720px] md:z-20 w-full bg-white dark:bg-neutral-900 md:border md:border-neutral-200 md:dark:border-neutral-800 md:rounded-lg overflow-hidden flex flex-col md:flex-row`}
                >
                    <div className={`w-full md:w-[340px] lg:w-[380px] flex-shrink-0 flex-col border-r border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 h-full overflow-hidden ${selectedConversation ? 'hidden md:flex' : 'flex'}`}>
                        <div className="px-4 pt-4 pb-3 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex-shrink-0">
                            <div className="flex items-baseline justify-between mb-3">
                                <h1 className="text-[15px] font-semibold text-neutral-900 dark:text-neutral-100 tracking-tight">
                                    Mesajlar
                                </h1>
                                <span className="text-[12px] text-neutral-400 tabular-nums">
                                    {conversations.length}
                                </span>
                            </div>
                            <div className="relative">
                                <svg className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input
                                    type="text"
                                    placeholder="Ara"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full h-9 pl-8 pr-3 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 rounded-md text-[13px] border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-500 focus:ring-0 placeholder:text-neutral-400"
                                />
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto overscroll-contain divide-y divide-neutral-100 dark:divide-neutral-800 pb-20 md:pb-0">
                            {filteredConversations.length === 0 ? (
                                <div className="py-16 text-center px-6">
                                    <svg className="w-8 h-8 mx-auto mb-3 text-neutral-300 dark:text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.25">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                    </svg>
                                    <p className="text-[13px] font-medium text-neutral-700 dark:text-neutral-300">Henüz mesajınız yok</p>
                                    <p className="text-[12px] leading-relaxed text-neutral-400 mt-1 max-w-[220px] mx-auto">
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
                                            className={`px-4 py-3 flex gap-3 cursor-pointer transition-colors ${
                                                isSelected
                                                    ? 'bg-neutral-50 dark:bg-neutral-800/70'
                                                    : 'hover:bg-neutral-50 dark:hover:bg-neutral-800/40 bg-white dark:bg-neutral-900'
                                            }`}
                                        >
                                            <div className="relative w-11 h-11 rounded-md overflow-hidden bg-neutral-100 dark:bg-neutral-800 flex-shrink-0 border border-neutral-200 dark:border-neutral-700">
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
                                                    <div className="w-full h-full flex items-center justify-center text-[13px] font-medium text-neutral-500 bg-neutral-100 dark:bg-neutral-800">
                                                        {(conv.user.full_name || 'U').charAt(0).toUpperCase()}
                                                    </div>
                                                )}
                                                {unread && (
                                                    <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-rose-600 rounded-full" />
                                                )}
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-baseline justify-between gap-2 mb-0.5">
                                                    <h3 className={`text-[13px] truncate ${unread ? 'font-semibold text-neutral-900 dark:text-white' : 'font-medium text-neutral-800 dark:text-neutral-200'}`}>
                                                        {conv.user.full_name || 'Kullanıcı'}
                                                    </h3>
                                                    <span className="text-[11px] text-neutral-400 whitespace-nowrap shrink-0">
                                                        {conv.lastMessage?.created_at ? new Date(conv.lastMessage.created_at).toLocaleDateString('tr-TR', { hour: '2-digit', minute: '2-digit' }) : ''}
                                                    </span>
                                                </div>

                                                {conv.listing && (
                                                    <div className="flex items-center gap-1.5 text-[12px] text-neutral-500 dark:text-neutral-400 truncate mb-0.5">
                                                        {isDeleted ? (
                                                            <span className="text-neutral-500 text-[10px] border border-neutral-200 dark:border-neutral-700 px-1 py-px rounded-sm shrink-0">Silindi</span>
                                                        ) : null}
                                                        <span className="truncate">{conv.listing.title}</span>
                                                        {conv.listing.price && (
                                                            <span className="text-neutral-800 dark:text-neutral-200 font-medium shrink-0 tabular-nums">
                                                                {Number(conv.listing.price).toLocaleString('tr-TR')} TL
                                                            </span>
                                                        )}
                                                    </div>
                                                )}

                                                <p className={`text-[12px] truncate ${unread ? 'text-neutral-700 dark:text-neutral-200' : 'text-neutral-400 dark:text-neutral-500'}`}>
                                                    {conv.lastMessage?.sender_id === user?.id && <span>Siz: </span>}
                                                    {conv.lastMessage?.content || 'Konuşma başlatıldı'}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    <div className={`flex-1 flex-col bg-white dark:bg-neutral-900 h-full overflow-hidden ${selectedConversation ? 'flex' : 'hidden md:flex'}`}>
                        {selectedConversation && selectedConversation.user ? (
                            <div className="flex flex-col h-full w-full">
                                <div className="h-14 px-3 sm:px-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between bg-white dark:bg-neutral-900 flex-shrink-0 z-10">
                                    <div className="flex items-center gap-2 min-w-0">
                                        <button
                                            onClick={handleBackToList}
                                            className="md:hidden flex items-center justify-center w-9 h-9 -ml-1 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-md transition-colors shrink-0"
                                            aria-label="Gelen Kutusu"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                                            </svg>
                                        </button>

                                        <div
                                            onClick={() => navigate(getSellerUrl(selectedConversation.user), { state: { seller: selectedConversation.user } })}
                                            className="cursor-pointer flex items-center gap-2.5 min-w-0"
                                        >
                                            <div className="w-8 h-8 rounded-full overflow-hidden bg-neutral-100 dark:bg-neutral-800 flex-shrink-0 border border-neutral-200 dark:border-neutral-700">
                                                <img
                                                    src={selectedConversation.user.store_logo || selectedConversation.user.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedConversation.user.full_name || 'U')}&background=e5e5e5&color=525252`}
                                                    alt=""
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="min-w-0">
                                                <h2 className="text-[13px] font-medium text-neutral-900 dark:text-neutral-100 truncate hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors">
                                                    {selectedConversation.user.full_name || 'Kullanıcı'}
                                                </h2>
                                                <p className="text-[11px] text-neutral-400">
                                                    Profili görüntüle
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-1 relative flex-shrink-0">
                                        {canRateUser && !hasRated && (
                                            <button
                                                onClick={() => setIsRatingModalOpen(true)}
                                                className="hidden sm:flex items-center h-8 px-2.5 text-[12px] font-medium text-neutral-700 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700 rounded-md hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                                            >
                                                Değerlendir
                                            </button>
                                        )}

                                        <button
                                            onClick={() => setMenuOpen(!menuOpen)}
                                            className="w-9 h-9 flex items-center justify-center text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-md transition-colors"
                                            aria-label="Diğer İşlemler"
                                        >
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                                            </svg>
                                        </button>

                                        {menuOpen && (
                                            <div className="absolute right-0 top-full mt-1 w-44 bg-white dark:bg-neutral-900 rounded-md shadow-sm border border-neutral-200 dark:border-neutral-700 py-1 z-50 text-[13px]">
                                                <button
                                                    onClick={() => handleToggleBlockUser(selectedConversation.user.id)}
                                                    className="w-full text-left px-3 py-2 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-200"
                                                >
                                                    {isUserBlocked(selectedConversation.user.id) ? 'Engeli kaldır' : 'Kullanıcıyı engelle'}
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteConversation(selectedConversation)}
                                                    className="w-full text-left px-3 py-2 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-200"
                                                >
                                                    Sohbeti sil
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {selectedConversation.listing && (
                                    <div className="px-3 sm:px-4 py-2 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between gap-3 flex-shrink-0">
                                        <div className="flex items-center gap-2.5 min-w-0">
                                            {selectedConversation.listing.images?.[0] && (
                                                <img
                                                    src={selectedConversation.listing.images[0]}
                                                    alt=""
                                                    className="w-9 h-9 rounded-md object-cover border border-neutral-200 dark:border-neutral-700 flex-shrink-0"
                                                />
                                            )}
                                            <div className="min-w-0">
                                                <h4 className="text-[12px] font-medium text-neutral-900 dark:text-neutral-100 truncate">
                                                    {selectedConversation.listing.title}
                                                </h4>
                                                {selectedConversation.listing.price && (
                                                    <p className="text-[12px] text-neutral-600 dark:text-neutral-300 mt-px tabular-nums">
                                                        {Number(selectedConversation.listing.price).toLocaleString('tr-TR')} TL
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {!selectedConversation.listing.is_deleted && (
                                            <button
                                                onClick={() => navigate(`/${selectedConversation.listing.slug || selectedConversation.listing.id}`)}
                                                className="text-[12px] font-medium text-neutral-700 dark:text-neutral-200 hover:text-neutral-900 dark:hover:text-white shrink-0 underline-offset-2 hover:underline"
                                            >
                                                İlana git
                                            </button>
                                        )}
                                    </div>
                                )}

                                <div className="flex-1 overflow-y-auto overscroll-contain px-3 sm:px-5 py-4 space-y-2.5 bg-neutral-50 dark:bg-neutral-950">
                                    <p className="text-center text-[11px] text-neutral-400 py-1">
                                        Şifrenizi veya hesap bilgilerinizi paylaşmayın.
                                    </p>

                                    {(selectedConversation.messages || []).map((msg) => {
                                        const isMe = msg.sender_id === user?.id || msg.sender === 'me';

                                        return (
                                            <div
                                                key={msg.id}
                                                className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                                            >
                                                <div className={`max-w-[82%] sm:max-w-[68%] rounded-md px-3 py-2 text-sm break-words ${
                                                    isMe
                                                        ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900'
                                                        : 'bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-100 border border-neutral-200 dark:border-neutral-800'
                                                }`}>
                                                    <p className="leading-relaxed whitespace-pre-wrap text-[13px]">{msg.content}</p>
                                                    <div className={`flex items-center justify-end gap-1 mt-1 text-[10px] ${isMe ? 'text-neutral-400 dark:text-neutral-500' : 'text-neutral-400'}`}>
                                                        <span>{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                        {isMe && <span>{msg.read ? '✓✓' : '✓'}</span>}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    <div ref={messagesEndRef} />
                                </div>

                                <div className="px-3 pt-2 pb-1 bg-white dark:bg-neutral-900 flex gap-1.5 overflow-x-auto no-scrollbar flex-shrink-0 border-t border-neutral-200 dark:border-neutral-800">
                                    {quickReplies.map((reply, i) => (
                                        <button
                                            key={i}
                                            onClick={() => handleSendMessage(null, reply)}
                                            className="text-[11px] text-neutral-600 dark:text-neutral-300 px-2.5 py-1 rounded-md whitespace-nowrap transition-colors border border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-800 shrink-0"
                                        >
                                            {reply}
                                        </button>
                                    ))}
                                </div>

                                <div style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom, 12px))" }} className="px-3 py-2.5 bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 flex-shrink-0 z-30">
                                    <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            value={messageText}
                                            onChange={(e) => setMessageText(e.target.value)}
                                            placeholder="Mesaj yazın"
                                            className="flex-1 h-10 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 rounded-md px-3 text-[13px] border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-500 focus:ring-0 placeholder:text-neutral-400"
                                        />
                                        <button
                                            type="submit"
                                            disabled={!messageText.trim()}
                                            className="h-10 px-3.5 rounded-md bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-[13px] font-medium hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors disabled:opacity-35 disabled:pointer-events-none shrink-0"
                                            aria-label="Gönder"
                                        >
                                            Gönder
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
                            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                                <svg className="w-8 h-8 mb-3 text-neutral-300 dark:text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.25">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                </svg>
                                <h3 className="text-[13px] font-medium text-neutral-800 dark:text-neutral-200">Bir sohbet seçin</h3>
                                <p className="text-[12px] leading-relaxed text-neutral-400 mt-1 max-w-[240px]">
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
