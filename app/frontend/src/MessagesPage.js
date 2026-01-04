import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { getConversations, sendMessage, markConversationAsRead } from './api/messages';
import { supabase } from './lib/supabase';

import ProfileLayout from './ProfileLayout';
import TransactionConfirmCard from './components/TransactionConfirmCard';
import RatingModal from './components/RatingModal';

function MessagesPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messageText, setMessageText] = useState('');
    const [loading, setLoading] = useState(true);
    const [userProfile, setUserProfile] = useState(null);
    const [showRatingModal, setShowRatingModal] = useState(false);
    const [ratingTransaction, setRatingTransaction] = useState(null);
    const messagesEndRef = useRef(null);

    // Load user profile for phone number
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


    // Scroll to bottom of chat
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // Removed auto-scroll to bottom - messages now show from top
    // useEffect(() => {
    //     scrollToBottom();
    // }, [selectedConversation?.messages]);

    // Load conversations
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

        // Real-time subscription
        const subscription = supabase
            .channel('public:messages')
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'messages',
                filter: `receiver_id=eq.${user.id}`
            }, (payload) => {
                console.log('New message received:', payload);
                const newMessage = payload.new;

                // Optimistically update the conversations list without a full reload
                setConversations(prev => {
                    const existingIdx = prev.findIndex(c =>
                        (c.user.id === newMessage.sender_id && c.listing?.id === newMessage.listing_id) ||
                        (c.user.id === newMessage.receiver_id && c.listing?.id === newMessage.listing_id)
                    );

                    if (existingIdx > -1) {
                        const updated = [...prev];
                        const conv = { ...updated[existingIdx] };

                        // Add message if it's for the selected conversation or we want it in history
                        if (!conv.messages.find(m => m.id === newMessage.id)) {
                            conv.messages = [...conv.messages, newMessage];
                            conv.lastMessage = newMessage;
                            if (newMessage.receiver_id === user.id && !newMessage.read) {
                                conv.unreadCount++;
                            }
                        }

                        updated[existingIdx] = conv;

                        // Ensure selected conversation also updates if it's the active one
                        setSelectedConversation(current => {
                            if (current &&
                                ((current.user.id === newMessage.sender_id && current.listing?.id === newMessage.listing_id) ||
                                    (current.user.id === newMessage.receiver_id && current.listing?.id === newMessage.listing_id))) {
                                return conv;
                            }
                            return current;
                        });

                        // Move to top
                        return [updated[existingIdx], ...updated.filter((_, i) => i !== existingIdx)];
                    } else {
                        // For completely new conversation, we might still need a partial reload or ignore 
                        // until user refreshes, but ideally we'd fetch the user profile here.
                        // For now, let's trigger a reload only for new conversations to keep it simple.
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

    // Handle initiated chat from location state
    useEffect(() => {
        const handleInitiatedChat = async () => {
            if (!user || loading) return;

            const receiverId = location.state?.receiverId;
            if (!receiverId) return;

            // 1. Check if conversation already exists
            const existingConv = conversations.find(c => c.user.id === receiverId);
            if (existingConv) {
                setSelectedConversation(existingConv);
                // Clear state so it doesn't keep selecting on every re-render
                window.history.replaceState({}, document.title);
                return;
            }

            // 2. If not, fetch user profile and create temp conversation
            try {
                const { fetchUserProfile } = await import('./api/profile');
                const profile = await fetchUserProfile(receiverId);
                if (profile) {
                    const tempConv = {
                        user: {
                            id: profile.id,
                            full_name: profile.full_name,
                            avatar_url: profile.avatar_url
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

            // Clear state
            window.history.replaceState({}, document.title);
        };

        handleInitiatedChat();
    }, [user, loading, conversations, location.state]);

    // Mark as read when selecting conversation
    useEffect(() => {
        if (selectedConversation && user) {
            // Find the partner ID (sender of the messages we are reading)
            const partnerId = selectedConversation.user.id;

            // Optimistically update UI
            setConversations(prev => prev.map(conv => {
                if (conv.user.id === partnerId && conv.listing?.id === selectedConversation.listing?.id) {
                    return { ...conv, unreadCount: 0 };
                }
                return conv;
            }));

            // Call API
            markConversationAsRead(partnerId);
        }
    }, [selectedConversation, user]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!messageText.trim() || !selectedConversation || !user) return;

        const receiverId = selectedConversation.user.id;
        const listingId = selectedConversation.listing?.id;
        const tempId = Date.now();
        const content = messageText;

        // Optimistic update
        const newMessage = {
            id: tempId,
            content: content,
            sender_id: user.id,
            receiver_id: receiverId,
            created_at: new Date().toISOString(),
            read: false,
            sender: 'me' // Helper for UI
        };

        // Update selected conversation messages
        setSelectedConversation(prev => ({
            ...prev,
            messages: [...prev.messages, newMessage]
        }));

        // Update conversations list (move to top)
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
            // Sort by date desc
            return updated.sort((a, b) => new Date(b.lastMessage.created_at) - new Date(a.lastMessage.created_at));
        });

        setMessageText('');

        try {
            await sendMessage(receiverId, content, listingId, userProfile?.phone);
            // In a real app, we might replace the temp ID with real ID here
        } catch (error) {
            console.error('Error sending message:', error);
            alert('Mesaj gönderilirken hata oluştu.');
            // Revert optimistic update if needed
        }
    };

    const handleDeleteConversation = async (conv, e) => {
        e.stopPropagation(); // Prevent selecting the conversation

        if (!window.confirm('Bu konuşmayı silmek istediğinizden emin misiniz?')) {
            return;
        }

        try {
            const { deleteConversation } = await import('./api/messages');
            await deleteConversation(conv.user.id, conv.listing?.id);

            // Remove from local state
            setConversations(prev => prev.filter(c =>
                !(c.user.id === conv.user.id && c.listing?.id === conv.listing?.id)
            ));

            // If this was the selected conversation, clear selection
            if (selectedConversation?.user.id === conv.user.id &&
                selectedConversation?.listing?.id === conv.listing?.id) {
                setSelectedConversation(null);
            }
        } catch (error) {
            console.error('Error deleting conversation:', error);
            alert('Konuşma silinirken hata oluştu.');
        }
    };

    // Handle transaction completion
    const handleTransactionComplete = (transaction) => {
        console.log('Transaction completed:', transaction);
        // Reload conversations to update UI
        loadConversations();
    };

    // Handle rating request
    const handleRatingRequest = (transaction) => {
        setRatingTransaction(transaction);
        setShowRatingModal(true);
    };

    // Handle rating success
    const handleRatingSuccess = () => {
        setShowRatingModal(false);
        setRatingTransaction(null);
        // Reload conversations
        loadConversations();
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 pt-20 flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            </div>
        );
    }

    return (
        <ProfileLayout>
            <div className="max-w-7xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">Mesajlar</h1>
                    <p className="text-gray-600 mt-1">Konuşmalarınızı buradan yönetin</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Conversations List */}
                    <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden h-[calc(100vh-220px)] flex flex-col">
                        <div className="p-5 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                </svg>
                                Konuşmalar
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">{conversations.length} {conversations.length === 1 ? 'Konuşma' : 'Konuşma'}</p>
                        </div>
                        <div className="divide-y divide-gray-100 overflow-y-auto flex-1">
                            {conversations.length === 0 ? (
                                <div className="p-12 text-center">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                        </svg>
                                    </div>
                                    <p className="text-gray-500 font-medium">Mesaj Yok</p>
                                    <p className="text-sm text-gray-400 mt-1">Konuşmalarınız burada görünecek</p>
                                </div>
                            ) : (
                                conversations.map((conv, index) => (
                                    <div
                                        key={`${conv.user.id}-${conv.listing?.id || 'general'}-${index}`}
                                        onClick={() => setSelectedConversation(conv)}
                                        className={`p-4 cursor-pointer transition-all duration-200 ${selectedConversation?.user.id === conv.user.id && selectedConversation?.listing?.id === conv.listing?.id
                                            ? 'bg-gradient-to-r from-red-50 to-rose-50 border-l-4 border-red-600'
                                            : 'hover:bg-gray-50 border-l-4 border-transparent'
                                            }`}
                                    >
                                        <div className="flex gap-3">
                                            <div className="relative flex-shrink-0">
                                                <img
                                                    src={conv.user.avatar_url || 'https://via.placeholder.com/150?text=User'}
                                                    alt={conv.user.full_name}
                                                    className="w-14 h-14 rounded-full object-cover ring-2 ring-white shadow-sm"
                                                />
                                                {conv.unreadCount > 0 && (
                                                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-600 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg">
                                                        {conv.unreadCount}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-start mb-1">
                                                    <h3 className="font-semibold text-gray-900 truncate text-base">
                                                        {conv.user.full_name || 'Bilinmeyen Kullanıcı'}
                                                    </h3>
                                                    <div className="flex items-center gap-2 ml-2">
                                                        <span className="text-xs text-gray-500 whitespace-nowrap">
                                                            {new Date(conv.lastMessage.created_at).toLocaleDateString('tr-TR', { day: '2-digit', month: 'short' })}
                                                        </span>
                                                        <button
                                                            onClick={(e) => handleDeleteConversation(conv, e)}
                                                            className="text-gray-400 hover:text-red-600 transition-colors p-1 hover:bg-red-50 rounded"
                                                            title="Konuşmayı sil"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>
                                                {conv.listing && (
                                                    <p className="text-xs text-red-600 truncate mb-1 font-medium flex items-center gap-1">
                                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                                        </svg>
                                                        {conv.listing.title}
                                                    </p>
                                                )}
                                                <p className={`text-sm truncate ${conv.unreadCount > 0 ? 'font-semibold text-gray-900' : 'text-gray-600'}`}>
                                                    {conv.lastMessage.sender_id === user?.id && (
                                                        <span className="text-gray-500 mr-1">Sen:</span>
                                                    )}
                                                    {conv.lastMessage.content}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Chat Window */}
                    <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-[calc(100vh-220px)]">
                        {selectedConversation ? (
                            <>
                                {/* Chat Header */}
                                <div className="p-5 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="relative">
                                                <img
                                                    src={selectedConversation.user.avatar_url || 'https://via.placeholder.com/150?text=User'}
                                                    alt={selectedConversation.user.full_name}
                                                    className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-sm"
                                                />
                                                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-900 text-lg">
                                                    {selectedConversation.user.full_name || 'Bilinmeyen Kullanıcı'}
                                                </h3>
                                                <p className="text-xs text-gray-500">Çevrimiçi</p>
                                            </div>
                                        </div>
                                        {selectedConversation.listing && (
                                            <button
                                                onClick={() => navigate(`/product/${selectedConversation.listing.id}`)}
                                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-all duration-200 shadow-sm hover:shadow-md"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                </svg>
                                                İlanı Görüntüle
                                            </button>
                                        )}
                                    </div>
                                    {/* Listing Preview */}
                                    {selectedConversation.listing && (
                                        <div className="mt-4 p-3 bg-white rounded-xl flex items-center gap-3 border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate(`/product/${selectedConversation.listing.id}`)}>
                                            <img
                                                src={selectedConversation.listing.images?.[0] || 'https://via.placeholder.com/150?text=No+Image'}
                                                alt={selectedConversation.listing.title}
                                                className="w-16 h-16 rounded-lg object-cover"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-gray-900 truncate text-sm">
                                                    {selectedConversation.listing.title}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-0.5">Bu konuşmanın konusu</p>
                                            </div>
                                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </div>
                                    )}

                                    {/* Transaction Confirmation Card */}
                                    {selectedConversation.listing && (
                                        <div className="mt-4">
                                            <TransactionConfirmCard
                                                listingId={selectedConversation.listing.id}
                                                sellerId={selectedConversation.listing.user_id}
                                                buyerId={user.id}
                                                onTransactionComplete={handleTransactionComplete}
                                                onRatingRequest={handleRatingRequest}
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Messages */}
                                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-gray-50 to-white">
                                    {selectedConversation.messages.map((msg, idx) => {
                                        const isMe = msg.sender_id === user.id;
                                        return (
                                            <div
                                                key={msg.id || idx}
                                                className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-fadeIn`}
                                            >
                                                <div
                                                    className={`max-w-[75%] rounded-2xl px-5 py-3 shadow-sm ${isMe
                                                        ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-br-sm'
                                                        : 'bg-white text-gray-900 rounded-bl-sm border border-gray-200'
                                                        }`}
                                                >
                                                    <p className="text-sm leading-relaxed break-words">{msg.content}</p>
                                                    {!isMe && msg.sender_phone && (
                                                        <p className="text-xs mt-2 pt-2 border-t border-gray-200 flex items-center gap-1">
                                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                            </svg>
                                                            <a href={`tel:${msg.sender_phone}`} className="hover:underline">{msg.sender_phone}</a>
                                                        </p>
                                                    )}
                                                    <p
                                                        className={`text-[10px] mt-1.5 text-right ${isMe ? 'text-red-100' : 'text-gray-400'
                                                            }`}
                                                    >
                                                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    <div ref={messagesEndRef} />
                                </div>

                                {/* Message Input */}
                                <form onSubmit={handleSendMessage} className="p-5 border-t border-gray-200 bg-white">
                                    <div className="flex gap-3">
                                        <input
                                            type="text"
                                            value={messageText}
                                            onChange={(e) => setMessageText(e.target.value)}
                                            placeholder="Mesaj yazın..."
                                            className="flex-1 border-2 border-gray-200 rounded-xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all text-sm"
                                        />
                                        <button
                                            type="submit"
                                            disabled={!messageText.trim()}
                                            className="bg-gradient-to-r from-red-600 to-rose-600 text-white px-8 py-3.5 rounded-xl hover:from-red-700 hover:to-rose-700 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                                        >
                                            <span>Gönder</span>
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                            </svg>
                                        </button>
                                    </div>
                                </form>
                            </>
                        ) : (
                            <div className="flex-1 flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
                                <div className="text-center p-12 max-w-md">
                                    <div className="w-24 h-24 bg-gradient-to-r from-red-100 to-rose-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                                        <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-3">Mesajlarınız</h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        Mesajları okumak veya yazmak için soldaki listeden bir konuşma seçin.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Rating Modal */}
            {showRatingModal && ratingTransaction && (
                <RatingModal
                    isOpen={showRatingModal}
                    onClose={() => setShowRatingModal(false)}
                    transaction={ratingTransaction}
                    sellerName={selectedConversation?.user?.full_name || 'Satıcı'}
                    onSuccess={handleRatingSuccess}
                />
            )}
        </ProfileLayout>
    );
}

export default MessagesPage;
