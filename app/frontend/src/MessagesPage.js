import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { getConversations, sendMessage, markConversationAsRead } from './api/messages';
import { supabase } from './lib/supabase';
import { checkRatingEligibility, hasUserRated } from './api/ratings';
import RatingModal from './components/RatingModal';
import LoadingSpinner from './components/LoadingSpinner';
import { useIsMobile } from './hooks/useIsMobile';
import ProfileLayout from './ProfileLayout';
import { getSellerUrl } from './utils/slug';
import { generateListingNumber } from './components';


function MessagesPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // State
    const [conversations, setConversations] = useState(() => {
        // Restore from sessionStorage on mount
        const saved = sessionStorage.getItem('conversations');
        return saved ? JSON.parse(saved) : [];
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedConversation, setSelectedConversation] = useState(() => {
        // Restore from sessionStorage on mount
        const saved = sessionStorage.getItem('selectedConversation');
        return saved ? JSON.parse(saved) : null;
    });
    const [messageText, setMessageText] = useState('');
    const [loading, setLoading] = useState(() => {
        // If we have cached conversations, don't show loading
        const saved = sessionStorage.getItem('conversations');
        return !saved || saved === '[]';
    });
    const [userProfile, setUserProfile] = useState(null);
    const [canRateUser, setCanRateUser] = useState(false);
    const [hasRated, setHasRated] = useState(false);
    const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);

    const [swipedConvId, setSwipedConvId] = useState(null);
    const touchStartX = useRef(0);

    const handleTouchStart = (e) => {
        touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchMove = (e, id) => {
        if (!isMobile) return;
        const touchX = e.touches[0].clientX;
        const diff = touchStartX.current - touchX;

        if (diff > 50) {
            setSwipedConvId(id);
        } else if (diff < -30) {
            setSwipedConvId(null);
        }
    };

    // Refs & Hooks
    const messagesEndRef = useRef(null);
    const isMobile = useIsMobile();

    // Prevent body scrolling while on MessagesPage (ONLY ON MOBILE)
    useEffect(() => {
        if (!isMobile) return;
        
        const originalStyle = window.getComputedStyle(document.body).overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = originalStyle;
        };
    }, [isMobile]);

    // Load user profile
    useEffect(() => {
        const loadUserProfile = async () => {
            if (user) {
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
    }, [user]);

    // Scroll to bottom
    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            const container = messagesEndRef.current.closest('.custom-scrollbar');
            if (container) {
                // Sadece mesaj kutusunun içini kaydır, tüm sayfayı kaydırma
                container.scrollTop = container.scrollHeight;
            } else {
                messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [selectedConversation?.messages]);

    // Load conversations & Real-time subscription
    useEffect(() => {
        if (!user) return;

        const loadConversations = async () => {
            try {
                // Only show loading if we don't have cached data
                const hasCachedData = conversations.length > 0;
                if (!hasCachedData) {
                    setLoading(true);
                }

                const data = await getConversations();
                setConversations(data);
            } catch (error) {
                console.error('Error loading conversations:', error);
            } finally {
                setLoading(false);
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

                setConversations(prev => {
                    const existingIdx = prev.findIndex(c =>
                        (c.user.id === newMessage.sender_id && c.listing?.id === newMessage.listing_id) ||
                        (c.user.id === newMessage.receiver_id && c.listing?.id === newMessage.listing_id)
                    );

                    if (existingIdx > -1) {
                        const updated = [...prev];
                        const conv = { ...updated[existingIdx] };

                        if (!conv.messages.find(m => m.id === newMessage.id)) {
                            conv.messages = [...conv.messages, newMessage];
                            conv.lastMessage = newMessage;
                            if (newMessage.receiver_id === user.id && !newMessage.read) {
                                conv.unreadCount++;
                            }
                        }

                        updated[existingIdx] = conv;

                        setSelectedConversation(current => {
                            if (current &&
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
            supabase.removeChannel(subscription);
        };
    }, [user]);

    // Handle initiated chat
    useEffect(() => {
        const handleInitiatedChat = async () => {
            if (!user || loading) return;

            const receiverId = location.state?.receiverId;
            if (!receiverId) return;

            const existingConv = conversations.find(c => c.user.id === receiverId);
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
    }, [user, loading, conversations, location.state]);

    // Mark as read
    useEffect(() => {
        if (selectedConversation && user) {
            const partnerId = selectedConversation.user.id;
            setConversations(prev => prev.map(conv => {
                if (conv.user.id === partnerId && conv.listing?.id === selectedConversation.listing?.id) {
                    return { ...conv, unreadCount: 0 };
                }
                return conv;
            }));
            markConversationAsRead(partnerId);
        }
    }, [selectedConversation, user]);

    // Save selectedConversation to sessionStorage whenever it changes
    useEffect(() => {
        if (selectedConversation) {
            try {
                sessionStorage.setItem('selectedConversation', JSON.stringify(selectedConversation));
            } catch (e) {
                console.warn('Could not save selected conversation to cache:', e);
            }
        } else {
            sessionStorage.removeItem('selectedConversation');
        }
    }, [selectedConversation]);

    // Save conversations to sessionStorage whenever they change
    useEffect(() => {
        if (conversations.length > 0) {
            try {
                sessionStorage.setItem('conversations', JSON.stringify(conversations));
            } catch (e) {
                console.warn('Could not save conversations to cache:', e);
            }
        }
    }, [conversations]);

    // Check rating eligibility
    useEffect(() => {
        const checkEligibility = async () => {
            if (selectedConversation && user) {
                const [eligible, rated] = await Promise.all([
                    checkRatingEligibility(selectedConversation.user.id),
                    hasUserRated(selectedConversation.user.id)
                ]);
                setCanRateUser(eligible && selectedConversation.messages.length >= 5);
                setHasRated(rated);
            } else {
                setCanRateUser(false);
                setHasRated(false);
            }
        };
        checkEligibility();
    }, [selectedConversation, user]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!messageText.trim() || !selectedConversation || !user) return;

        const receiverId = selectedConversation.user.id;
        const listingId = selectedConversation.listing?.id;
        const tempId = Date.now();
        const content = messageText;

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
            messages: [...prev.messages, newMessage]
        }));

        setConversations(prev => {
            const updated = prev.map(conv => {
                if (conv.user.id === receiverId && conv.listing?.id === listingId) {
                    return {
                        ...conv,
                        lastMessage: newMessage,
                        messages: [...conv.messages, newMessage]
                    };
                }
                return conv;
            });
            return updated.sort((a, b) => new Date(b.lastMessage.created_at) - new Date(a.lastMessage.created_at));
        });

        setMessageText('');

        try {
            await sendMessage(receiverId, content, listingId, userProfile?.phone);
        } catch (error) {
            console.error('Error sending message:', error);
            alert('Mesaj gönderilirken hata oluştu.');
        }
    };

    const handleDeleteConversation = async (conv, e) => {
        e.stopPropagation();
        if (!window.confirm('Bu konuşmayı silmek istediğinizden emin misiniz?')) return;

        try {
            const { deleteConversation } = await import('./api/messages');
            await deleteConversation(conv.user.id, conv.listing?.id);

            setConversations(prev => prev.filter(c =>
                !(c.user.id === conv.user.id && c.listing?.id === conv.listing?.id)
            ));

            if (selectedConversation?.user.id === conv.user.id &&
                selectedConversation?.listing?.id === conv.listing?.id) {
                setSelectedConversation(null);
            }
        } catch (error) {
            console.error('Error deleting conversation:', error);
        }
    };

    // Filter conversations
    const filteredConversations = conversations.filter(conv =>
        conv.user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        conv.listing?.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <LoadingSpinner size="large" fullScreen />;

    return (
        <ProfileLayout>
            <div className={`
                z-30 flex flex-col md:flex-row bg-white dark:bg-neutral-900 overflow-hidden shadow-2xl md:shadow-sm
                ${isMobile 
                    ? 'fixed top-[64px] bottom-[64px] left-0 right-0 border-none rounded-none' 
                    : 'relative w-full h-[calc(100vh-160px)] min-h-[500px] border border-neutral-200 dark:border-white/10 rounded-3xl mt-0 mb-8'}
            `}>
                
                {/* SIDEBAR */}
                <div className={`w-full md:w-[380px] flex flex-col min-h-0 bg-neutral-50/50 dark:bg-neutral-900/50 border-r border-neutral-100 dark:border-white/5 ${isMobile && selectedConversation ? 'hidden' : 'flex'}`}>
                    {/* Sidebar Header */}
                    <div className="p-5 border-b border-neutral-200/60 dark:border-white/10 bg-white dark:bg-neutral-900">
                        <h2 className="text-xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
                            Mesajlar
                        </h2>
                    </div>

                    {/* Conversations List */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar divide-y divide-neutral-100 dark:divide-white/5 bg-white dark:bg-neutral-900">
                        {filteredConversations.length === 0 ? (
                            <div className="text-center py-16 px-6">
                                <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-2xl">💬</span>
                                </div>
                                <h3 className="font-bold text-neutral-900 dark:text-white mb-1">Mesaj Kutusu Boş</h3>
                                <p className="text-neutral-500 dark:text-neutral-400 text-sm">Sohbetleriniz burada listelenecek.</p>
                            </div>
                        ) : (
                            filteredConversations.map((conv, idx) => {
                                const isSelected = selectedConversation?.user.id === conv.user.id && selectedConversation?.listing?.id === conv.listing?.id;
                                const convId = `${conv.user.id}-${conv.listing?.id || 'no-listing'}`;
                                const isSwiped = swipedConvId === convId;

                                return (
                                    <div key={idx} className="relative overflow-hidden group/item">
                                        {/* Swipe Delete Action */}
                                        <div
                                            onClick={(e) => handleDeleteConversation(conv, e)}
                                            className="absolute inset-0 bg-red-600 flex justify-end items-center pr-6 z-0 active:bg-red-700 transition-colors cursor-pointer"
                                        >
                                            <div className="flex flex-col items-center gap-1 text-white">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-0.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                                <span className="text-[10px] font-bold uppercase tracking-wider">Sil</span>
                                            </div>
                                        </div>

                                        <div
                                            onClick={() => {
                                                if (isSwiped) {
                                                    setSwipedConvId(null);
                                                } else {
                                                    setSelectedConversation(conv);
                                                }
                                            }}
                                            onTouchStart={handleTouchStart}
                                            onTouchMove={(e) => handleTouchMove(e, convId)}
                                            style={{ transform: isSwiped ? 'translateX(-80px)' : 'translateX(0)' }}
                                            className={`group relative p-4 cursor-pointer transition-all duration-300 z-10 ${isSelected
                                                ? 'bg-blue-50/50 dark:bg-blue-900/10'
                                                : 'bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                                                }`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="relative flex-shrink-0">
                                                    <div className="w-14 h-14 rounded-full overflow-hidden bg-neutral-100 dark:bg-neutral-800 border-2 border-white dark:border-neutral-900 shadow-sm flex items-center justify-center">
                                                        {conv.listing?.images?.[0] ? (
                                                            <img
                                                                src={conv.listing.images[0]}
                                                                alt=""
                                                                className={`w-full h-full object-cover ${conv.listing?.is_deleted ? 'brightness-50 grayscale' : ''}`}
                                                            />
                                                        ) : (
                                                            <svg className={`w-6 h-6 ${conv.listing?.is_deleted ? 'text-neutral-300 opacity-20' : 'text-neutral-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                            </svg>
                                                        )}
                                                    </div>
                                                    {conv.listing?.is_deleted && (
                                                        <div className="absolute inset-0 flex items-center justify-center">
                                                            <svg className="w-6 h-6 text-white drop-shadow-md" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-0.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                        </div>
                                                    )}
                                                    {conv.unreadCount > 0 && (
                                                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 border-2 border-white dark:border-neutral-900 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
                                                            {conv.unreadCount}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex justify-between items-start mb-0.5">
                                                        <h3 className={`font-bold text-[15px] truncate pr-2 ${isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-neutral-900 dark:text-white'}`}>
                                                            {conv.user.full_name || 'Kullanıcı'}
                                                        </h3>
                                                        <span className="text-[11px] font-medium text-neutral-400 dark:text-neutral-500 whitespace-nowrap mt-0.5">
                                                            {new Date(conv.lastMessage.created_at).toLocaleDateString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                    </div>

                                                    {conv.listing && (
                                                        <p className={`text-[13px] font-medium truncate mb-1 ${conv.listing.is_deleted ? 'text-neutral-400 dark:text-neutral-500' : 'text-neutral-700 dark:text-neutral-300'}`}>
                                                            {conv.listing.is_deleted && <span className="text-red-600 dark:text-red-500 font-bold mr-1">Silindi</span>}
                                                            {conv.listing.title}
                                                        </p>
                                                    )}

                                                    <p className={`text-[13px] truncate ${conv.unreadCount > 0 ? 'font-bold text-neutral-900 dark:text-white' : 'text-neutral-500 dark:text-neutral-400'}`}>
                                                        {conv.lastMessage.sender_id === user?.id && <span className="text-blue-600 dark:text-blue-400 font-medium">Siz: </span>}
                                                        {conv.lastMessage.content}
                                                    </p>
                                                </div>
                                            </div>
                                            {isSelected && (
                                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 dark:bg-blue-500 rounded-r-full" />
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* CHAT AREA */}
                <div className={`flex-1 flex flex-col min-h-0 bg-white dark:bg-neutral-900 relative ${isMobile && !selectedConversation ? 'hidden' : 'flex'}`}>
                    {selectedConversation ? (
                        <>
                            {/* Chat Header */}
                            <div className="h-[72px] border-b border-neutral-200/60 dark:border-white/10 flex items-center justify-between px-4 sm:px-6 bg-white dark:bg-neutral-900 z-10 flex-shrink-0">
                                <div className="flex items-center gap-3">
                                    {isMobile && (
                                        <button onClick={() => setSelectedConversation(null)} className="p-2 -ml-2 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl transition-colors">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                                        </button>
                                    )}
                                    <div
                                        className="relative cursor-pointer"
                                        onClick={() => navigate(getSellerUrl(selectedConversation.user))}
                                    >
                                        <img
                                            src={selectedConversation.user.store_logo || selectedConversation.user.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedConversation.user.full_name || 'U')}&background=ef4444&color=fff`}
                                            alt=""
                                            className="w-10 h-10 rounded-full object-cover shadow-sm border border-neutral-100 dark:border-neutral-800"
                                        />
                                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white dark:border-neutral-900 rounded-full"></span>
                                    </div>
                                    <div
                                        className="cursor-pointer"
                                        onClick={() => navigate(getSellerUrl(selectedConversation.user))}
                                    >
                                        <h3 className="font-bold text-[15px] text-neutral-900 dark:text-white hover:text-blue-600 transition-colors leading-tight">
                                            {selectedConversation.user.full_name}
                                        </h3>
                                        <p className="text-xs text-green-600 dark:text-green-400 font-medium mt-0.5">Çevrimiçi</p>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    {canRateUser && !hasRated && (
                                        <button
                                            onClick={() => setIsRatingModalOpen(true)}
                                            className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-500 rounded-xl font-bold text-xs hover:bg-yellow-100 dark:hover:bg-yellow-900/40 transition-colors"
                                        >
                                            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                            <span className="hidden sm:inline">Puanla</span>
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Listing Context Bar */}
                            {selectedConversation.listing && (
                                <div className={`px-4 sm:px-6 py-2 border-b border-neutral-100 dark:border-white/5 flex items-center justify-between ${selectedConversation.listing.is_deleted ? 'bg-neutral-50 dark:bg-neutral-800/50' : 'bg-blue-50/30 dark:bg-blue-900/10'}`}>
                                    <div className="flex items-center gap-3 overflow-hidden cursor-pointer" onClick={() => !selectedConversation.listing.is_deleted && navigate(`/product/${selectedConversation.listing.id}`)}>
                                        <div className="relative flex-shrink-0 w-9 h-9 rounded-md overflow-hidden border border-neutral-200 dark:border-white/10 shadow-sm">
                                            <img
                                                src={selectedConversation.listing.images?.[0] || "https://premium.exvitrin.com/storage/v1/object/public/listing-images/placeholder_listing.png"}
                                                className={`w-full h-full object-cover ${selectedConversation.listing.is_deleted ? 'grayscale opacity-50' : ''}`}
                                                alt=""
                                            />
                                            {selectedConversation.listing.is_deleted && (
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                                                    <svg className="w-4 h-4 text-red-600 drop-shadow-md" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-0.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>
                                        <div className="min-w-0">
                                            <p className={`text-[13px] font-bold truncate ${selectedConversation.listing.is_deleted ? 'text-neutral-500 dark:text-neutral-400 italic' : 'text-neutral-900 dark:text-white hover:text-blue-600 transition-colors'}`}>
                                                {selectedConversation.listing.is_deleted ? 'Bu ilan silinmiş' : selectedConversation.listing.title}
                                            </p>
                                            <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                                                {selectedConversation.listing.is_deleted ? 'Artık görüntülenemez' : `İlan No: #${generateListingNumber(selectedConversation.listing)}`}
                                            </p>
                                        </div>
                                    </div>
                                    {!selectedConversation.listing.is_deleted && (
                                        <button
                                            onClick={() => navigate(`/product/${selectedConversation.listing.id}`)}
                                            className="hidden sm:block text-[11px] font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ml-4"
                                        >
                                            İlanı Gör
                                        </button>
                                    )}
                                </div>
                            )}

                            {/* Messages List */}
                            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-[#F8F9FA] dark:bg-[#0A0A0A] custom-scrollbar">
                                <div className="text-center pb-4">
                                    <span className="text-[11px] font-medium text-neutral-400 dark:text-neutral-500 bg-neutral-100 dark:bg-neutral-800/50 px-3 py-1 rounded-full">
                                        Sohbet Başlangıcı
                                    </span>
                                </div>
                                {selectedConversation.messages.map((msg, idx) => {
                                    const isMe = msg.sender_id === user.id;
                                    const showAvatar = !isMe && (idx === 0 || selectedConversation.messages[idx - 1].sender_id === user.id);
                                    
                                    return (
                                        <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'} group`}>
                                            {!isMe && (
                                                <div className="w-8 flex-shrink-0 mr-2 flex flex-col justify-end">
                                                    {showAvatar ? (
                                                        <img
                                                            src={selectedConversation.user.store_logo || selectedConversation.user.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedConversation.user.full_name || 'U')}&background=ef4444&color=fff`}
                                                            alt=""
                                                            className="w-8 h-8 rounded-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-8 h-8" /> // Spacer
                                                    )}
                                                </div>
                                            )}
                                            
                                            <div className={`max-w-[75%] sm:max-w-[65%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                                <div className={`
                                                        px-4 py-2.5 text-[14px] leading-relaxed shadow-sm relative break-words
                                                        ${isMe
                                                        ? 'bg-gradient-to-br from-blue-600 to-blue-500 text-white rounded-2xl rounded-br-sm'
                                                        : 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white rounded-2xl rounded-bl-sm border border-neutral-100 dark:border-white/5'
                                                    }
                                                    `}>
                                                    {msg.content}
                                                </div>
                                                <div className={`flex items-center gap-1 mt-1 ${isMe ? 'mr-1' : 'ml-1'}`}>
                                                    <span className="text-[10px] text-neutral-400 dark:text-neutral-500 font-medium">
                                                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                    {isMe && (
                                                        <span className={`text-[11px] ${msg.read ? 'text-blue-500' : 'text-neutral-400'}`}>
                                                            {msg.read ? '✓✓' : '✓'}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                                <div ref={messagesEndRef} className="h-2" />
                            </div>

                            {/* Input Area */}
                            <div className="p-3 sm:p-4 bg-white dark:bg-neutral-900 border-t border-neutral-200/60 dark:border-white/10 flex-shrink-0">
                                <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto flex items-end gap-2 sm:gap-3">
                                    <div className="flex-1 bg-neutral-100/80 dark:bg-neutral-800/80 rounded-2xl border border-transparent focus-within:border-blue-500 focus-within:bg-white dark:focus-within:bg-neutral-900 transition-all flex items-end min-h-[44px]">
                                        <textarea
                                            value={messageText}
                                            onChange={(e) => setMessageText(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' && !e.shiftKey) {
                                                    e.preventDefault();
                                                    handleSendMessage(e);
                                                }
                                            }}
                                            placeholder="Mesaj yazın..."
                                            className="w-full bg-transparent border-none px-4 py-3 focus:ring-0 text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 resize-none max-h-32 text-[15px] custom-scrollbar"
                                            rows="1"
                                            style={{ minHeight: '44px' }}
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={!messageText.trim()}
                                        className="h-11 w-11 flex-shrink-0 flex items-center justify-center bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all shadow-md shadow-blue-600/20 active:scale-95 disabled:opacity-50 disabled:scale-100 disabled:shadow-none"
                                    >
                                        <svg className="w-5 h-5 ml-0.5 transform rotate-90" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path></svg>
                                    </button>
                                </form>
                            </div>

                            {/* Rating Modal */}
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
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-[#F8F9FA] dark:bg-[#0A0A0A]">
                            <div className="w-20 h-20 bg-white dark:bg-neutral-800 rounded-full flex items-center justify-center shadow-sm border border-neutral-100 dark:border-white/5 mb-5">
                                <svg className="w-10 h-10 text-neutral-300 dark:text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">Mesajlarınız</h3>
                            <p className="text-neutral-500 dark:text-neutral-400 max-w-[280px] text-[15px]">
                                Sol taraftaki listeden bir sohbet seçerek mesajlaşmaya başlayabilirsiniz.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </ProfileLayout>
    );
}

export default MessagesPage;
