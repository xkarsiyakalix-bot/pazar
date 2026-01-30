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

function MessagesPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // State
    const [conversations, setConversations] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messageText, setMessageText] = useState('');
    const [loading, setLoading] = useState(true);
    const [userProfile, setUserProfile] = useState(null);
    const [canRateUser, setCanRateUser] = useState(false);
    const [hasRated, setHasRated] = useState(false);
    const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);

    // Refs & Hooks
    const messagesEndRef = useRef(null);
    const isMobile = useIsMobile();

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
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [selectedConversation?.messages]);

    // Load conversations & Real-time subscription
    useEffect(() => {
        if (!user) return;

        const loadConversations = async () => {
            try {
                setLoading(true);
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
            <div className="h-[calc(100vh-80px)] md:h-[calc(100vh-100px)] -mx-4 sm:-mx-6 -mt-8 sm:-mt-12 bg-white flex flex-col md:flex-row overflow-hidden">

                {/* SIDEBAR */}
                <div className={`w-full md:w-96 bg-neutral-50 flex flex-col border-r border-neutral-100 ${isMobile && selectedConversation ? 'hidden' : 'flex'}`}>
                    {/* Sidebar Header */}
                    <div className="p-6 bg-white border-b border-neutral-100">
                        <h2 className="text-2xl font-display font-bold text-neutral-900 mb-4">Mesajlar</h2>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="w-5 h-5 text-neutral-400 group-hover:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                            </div>
                            <input
                                type="text"
                                placeholder="Sohbetlerde ara..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="block w-full pl-10 pr-4 py-3 bg-neutral-100 border-none rounded-2xl text-sm font-medium placeholder-neutral-500 focus:ring-2 focus:ring-red-500/20 focus:bg-white transition-all"
                            />
                        </div>
                    </div>

                    {/* Conversations List */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
                        {filteredConversations.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-neutral-400 text-sm font-medium">Sohbet bulunamadı.</p>
                            </div>
                        ) : (
                            filteredConversations.map((conv, idx) => {
                                const isSelected = selectedConversation?.user.id === conv.user.id && selectedConversation?.listing?.id === conv.listing?.id;
                                return (
                                    <div
                                        key={idx}
                                        onClick={() => setSelectedConversation(conv)}
                                        className={`group relative p-4 rounded-2xl cursor-pointer transition-all duration-200 ${isSelected
                                            ? 'bg-white shadow-lg shadow-neutral-100 ring-1 ring-neutral-100'
                                            : 'hover:bg-white hover:shadow-md hover:shadow-neutral-50'
                                            }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="relative flex-shrink-0">
                                                <div className="w-14 h-14 rounded-full overflow-hidden bg-neutral-100 ring-2 ring-white flex items-center justify-center">
                                                    {conv.listing?.images?.[0] ? (
                                                        <img
                                                            src={conv.listing.images[0]}
                                                            alt=""
                                                            className={`w-full h-full object-cover ${conv.listing?.is_deleted ? 'brightness-[0.4] grayscale-[0.5]' : ''}`}
                                                        />
                                                    ) : (
                                                        <svg className={`w-6 h-6 ${conv.listing?.is_deleted ? 'text-neutral-300 opacity-20' : 'text-neutral-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                    )}
                                                </div>
                                                {conv.listing?.is_deleted && (
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-0.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </div>
                                                )}
                                                {conv.unreadCount > 0 && (
                                                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 border-2 border-white text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                                        {conv.unreadCount}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-start">
                                                    <h3 className={`font-bold text-sm truncate ${isSelected ? 'text-neutral-900' : 'text-neutral-700'}`}>
                                                        {conv.user.full_name || 'Kullanıcı'}
                                                    </h3>
                                                    <span className="text-[10px] font-medium text-neutral-400 whitespace-nowrap ml-2">
                                                        {new Date(conv.lastMessage.created_at).toLocaleDateString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>

                                                {conv.listing && (
                                                    <p className="text-[13px] font-medium truncate mt-0.5 text-neutral-800">
                                                        {conv.listing.is_deleted ? (
                                                            <span className="text-red-600 font-bold">Silindi • </span>
                                                        ) : (
                                                            <span className="text-red-600 font-bold mr-1">İlan: </span>
                                                        )}
                                                        {conv.listing.title}
                                                    </p>
                                                )}

                                                <p className={`text-sm truncate mt-0.5 ${conv.unreadCount > 0 ? 'font-bold text-neutral-900' : 'text-neutral-500'}`}>
                                                    {conv.lastMessage.sender_id === user?.id && <span className="text-neutral-400 font-medium">Siz: </span>}
                                                    {conv.lastMessage.content}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* CHAT AREA */}
                <div className={`flex-1 bg-white flex flex-col relative ${isMobile && !selectedConversation ? 'hidden' : 'flex'}`}>
                    {selectedConversation ? (
                        <>
                            {/* Chat Header */}
                            <div className="h-20 border-b border-neutral-100 flex items-center justify-between px-6 bg-white/80 backdrop-blur-md sticky top-0 z-10">
                                <div className="flex items-center gap-4">
                                    {isMobile && (
                                        <button onClick={() => setSelectedConversation(null)} className="p-2 -ml-2 text-neutral-500 hover:bg-neutral-50 rounded-xl">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                                        </button>
                                    )}
                                    <div className="relative">
                                        <img
                                            src={selectedConversation.user.store_logo || selectedConversation.user.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedConversation.user.full_name || 'U')}&background=ef4444&color=fff`}
                                            alt=""
                                            className="w-10 h-10 rounded-full object-cover ring-2 ring-neutral-50"
                                        />
                                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-neutral-900">{selectedConversation.user.full_name}</h3>
                                        <div className="flex items-center gap-2 text-xs text-neutral-500">
                                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                                            Çevrimiçi
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    {canRateUser && !hasRated && (
                                        <button
                                            onClick={() => setIsRatingModalOpen(true)}
                                            className="hidden sm:flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-600 rounded-xl font-bold text-sm hover:bg-amber-100 transition-colors"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-0.921 1.603-0.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-0.363 1.118l1.518 4.674c.3.922-0.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-0.783.57-1.838-0.197-1.538-1.118l1.518-4.674a1 1 0 00-0.363-1.118l-3.976-2.888c-0.784-0.57-0.38-1.81.588-1.81h4.914a1 1 0 00.951-0.69l1.519-4.674z"></path></svg>
                                            Puanla
                                        </button>
                                    )}
                                    {selectedConversation.listing && (
                                        <button
                                            onClick={() => navigate(`/product/${selectedConversation.listing.id}`)}
                                            className="px-4 py-2 bg-neutral-900 text-white rounded-xl font-bold text-sm hover:bg-black transition-all shadow-lg shadow-neutral-200"
                                        >
                                            İlanı Gör
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Listing Context Bar (if exists) */}
                            {selectedConversation.listing && (
                                <div className={`px-6 py-3 border-b border-neutral-100 flex items-center justify-between ${selectedConversation.listing.is_deleted ? 'bg-neutral-100/50' : 'bg-neutral-50/50'}`}>
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <div className="relative flex-shrink-0 w-10 h-10 rounded-lg overflow-hidden border border-neutral-200">
                                            <img
                                                src={selectedConversation.listing.images?.[0] || "https://premium.exvitrin.com/storage/v1/object/public/listing-images/placeholder_listing.png"}
                                                className={`w-full h-full object-cover ${selectedConversation.listing.is_deleted ? 'grayscale opacity-40' : ''}`}
                                                alt=""
                                            />
                                            {selectedConversation.listing.is_deleted && (
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <svg className="w-6 h-6 text-red-600 drop-shadow-md" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-0.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>
                                        <div className="min-w-0">
                                            <p className={`text-sm font-bold truncate ${selectedConversation.listing.is_deleted ? 'text-neutral-500 italic' : 'text-neutral-900'}`}>
                                                {selectedConversation.listing.is_deleted ? 'Bu ilan silinmiş' : selectedConversation.listing.title}
                                            </p>
                                            <p className="text-xs text-neutral-500">
                                                {selectedConversation.listing.is_deleted ? 'Artık görüntülenemez' : `İlan No: #${selectedConversation.listing.listing_number || selectedConversation.listing.id.slice(0, 8)}`}
                                            </p>
                                        </div>
                                    </div>
                                    {!selectedConversation.listing.is_deleted && (
                                        <button
                                            onClick={() => navigate(`/product/${selectedConversation.listing.id}`)}
                                            className="text-xs font-bold text-red-600 hover:underline"
                                        >
                                            İlanı Gör
                                        </button>
                                    )}
                                </div>
                            )}

                            {/* Messages List */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#f8f9fa] custom-scrollbar">
                                {selectedConversation.messages.map((msg, idx) => {
                                    const isMe = msg.sender_id === user.id;
                                    return (
                                        <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'} group`}>
                                            <div className={`max-w-[75%] md:max-w-[60%] space-y-1 ${isMe ? 'items-end flex flex-col' : 'items-start flex flex-col'}`}>
                                                <div className={`
                                                    p-4 rounded-2xl text-sm leading-relaxed shadow-sm relative
                                                    ${isMe
                                                        ? 'bg-red-600 text-white rounded-br-none'
                                                        : 'bg-white text-neutral-700 rounded-bl-none border border-neutral-100'
                                                    }
                                                `}>
                                                    {msg.content}
                                                </div>
                                                <span className="text-[10px] text-neutral-400 font-medium px-1">
                                                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    {isMe && (
                                                        <span className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            {msg.read ? '✓✓' : '✓'}
                                                        </span>
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input Area */}
                            <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-neutral-100">
                                <div className="flex items-end gap-3 max-w-4xl mx-auto">
                                    <div className="flex-1 bg-neutral-50 rounded-3xl border border-neutral-200 focus-within:ring-2 focus-within:ring-red-500/20 focus-within:border-red-500 transition-all flex items-center">
                                        <input
                                            type="text"
                                            value={messageText}
                                            onChange={(e) => setMessageText(e.target.value)}
                                            placeholder="Bir mesaj yazın..."
                                            className="w-full bg-transparent border-none px-6 py-4 focus:ring-0 text-neutral-900 placeholder-neutral-400"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={!messageText.trim()}
                                        className="p-4 bg-red-600 text-white rounded-full hover:bg-red-700 transition-all shadow-lg shadow-red-200 active:scale-95 disabled:opacity-50 disabled:scale-100"
                                    >
                                        <svg className="w-6 h-6 transform rotate-90" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path></svg>
                                    </button>
                                </div>
                            </form>

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
                        <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-neutral-50/30">
                            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg shadow-neutral-100 mb-6 border border-neutral-100">
                                <span className="text-4xl">💭</span>
                            </div>
                            <h3 className="text-2xl font-display font-bold text-neutral-900 mb-2">Sohbet Başlatın</h3>
                            <p className="text-neutral-500 max-w-sm">
                                Mesajlaşmak için sol taraftaki listeden bir konuşma seçin veya yeni bir ilana mesaj gönderin.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </ProfileLayout>
    );
}

export default MessagesPage;
