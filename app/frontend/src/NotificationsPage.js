import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import {
    getAllNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
    subscribeToNotifications
} from './api/notifications';
import { getListingUrl } from './utils/slug';
import ProfileLayout from './ProfileLayout';
import SEO from './SEO';

const NotificationsPage = () => {
    const { user, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // 'all' or 'unread'
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        window.scrollTo(0, 0);
        if (authLoading) return;
        if (!user) {
            navigate('/login');
            return;
        }
        loadNotifications();
    }, [user, authLoading, page]);

    // Realtime listener
    useEffect(() => {
        if (!user) return;
        const unsubscribe = subscribeToNotifications(user.id, (newNotif) => {
            setNotifications(prev => [newNotif, ...prev]);
            setTotal(prev => prev + 1);
        });
        return () => unsubscribe();
    }, [user]);

    const loadNotifications = async () => {
        try {
            setLoading(true);
            const { notifications: data, total: count } = await getAllNotifications(page, 30);
            setNotifications(data);
            setTotal(count);
        } catch (error) {
            console.error('Error loading notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAllRead = async () => {
        const success = await markAllNotificationsAsRead();
        if (success) {
            setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
        }
    };

    const handleClickNotification = async (notification) => {
        if (!notification.is_read) {
            await markNotificationAsRead(notification.id);
            setNotifications(prev =>
                prev.map(n => (n.id === notification.id ? { ...n, is_read: true } : n))
            );
        }

        if (notification.listing_id) {
            navigate(getListingUrl({ id: notification.listing_id }));
        }
    };

    const handleDelete = async (e, id) => {
        e.stopPropagation();
        const success = await deleteNotification(id);
        if (success) {
            setNotifications(prev => prev.filter(n => n.id !== id));
            setTotal(prev => Math.max(0, prev - 1));
        }
    };

    const filteredNotifications = notifications.filter(n => {
        if (filter === 'unread') return !n.is_read;
        return true;
    });

    const unreadCount = notifications.filter(n => !n.is_read).length;

    const formatTime = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const now = new Date();
        const diffMinutes = Math.floor((now - date) / 60000);
        const diffHours = Math.floor(diffMinutes / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMinutes < 1) return 'Az önce';
        if (diffMinutes < 60) return `${diffMinutes} dakika önce`;
        if (diffHours < 24) return `${diffHours} saat önce`;
        if (diffDays < 7) return `${diffDays} gün önce`;
        return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
    };

    const getIcon = (type) => {
        switch (type) {
            case 'favorite':
                return (
                    <div className="w-10 h-10 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-500 flex items-center justify-center flex-shrink-0 shadow-sm border border-rose-100 dark:border-rose-900/30">
                        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                    </div>
                );
            case 'price_drop':
                return (
                    <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0 shadow-sm border border-emerald-100 dark:border-emerald-900/30">
                        <span className="text-lg">💸</span>
                    </div>
                );
            default:
                return (
                    <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0 shadow-sm border border-blue-100 dark:border-blue-900/30">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-0.214 1.055-0.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                    </div>
                );
        }
    };

    return (
        <ProfileLayout>
            <SEO title="Bildirimler | ExVitrin" description="ExVitrin bildirimleriniz" />

            <div className="max-w-3xl mx-auto py-4 sm:py-8 px-4 sm:px-0">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight flex items-center gap-3">
                            Bildirimler
                            {unreadCount > 0 && (
                                <span className="bg-rose-500 text-white text-xs px-2.5 py-1 rounded-full font-bold">
                                    {unreadCount} Yeni
                                </span>
                            )}
                        </h1>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                            İlanlarınızın favorilere eklenmesi ve güncellemeler hakkında anlık bildirimler
                        </p>
                    </div>

                    {notifications.length > 0 && (
                        <button
                            onClick={handleMarkAllRead}
                            className="text-xs sm:text-sm font-semibold text-rose-600 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300 transition-colors self-start sm:self-auto"
                        >
                            Tümünü Okundu İşaretle
                        </button>
                    )}
                </div>

                {/* Filter Tabs */}
                <div className="flex items-center gap-2 mb-6 border-b border-neutral-200 dark:border-white/10 pb-3">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                            filter === 'all'
                                ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shadow-sm'
                                : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                        }`}
                    >
                        Tümü ({notifications.length})
                    </button>
                    <button
                        onClick={() => setFilter('unread')}
                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                            filter === 'unread'
                                ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shadow-sm'
                                : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                        }`}
                    >
                        Okunmamış ({unreadCount})
                    </button>
                </div>

                {/* Notifications List */}
                {loading ? (
                    <div className="space-y-3">
                        {[1, 2, 3, 4].map(i => (
                            <div
                                key={i}
                                className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-white/5 animate-pulse flex items-center gap-4"
                            >
                                <div className="w-10 h-10 rounded-full bg-neutral-200 dark:bg-neutral-800" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-1/3" />
                                    <div className="h-3 bg-neutral-200 dark:bg-neutral-800 rounded w-2/3" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filteredNotifications.length === 0 ? (
                    <div className="bg-white dark:bg-neutral-900 rounded-3xl p-12 text-center border border-neutral-100 dark:border-white/5 shadow-sm">
                        <div className="w-16 h-16 rounded-full bg-rose-50 dark:bg-rose-950/30 text-rose-500 mx-auto flex items-center justify-center mb-4">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-0.214 1.055-0.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-1">
                            {filter === 'unread' ? 'Okunmamış bildiriminiz yok' : 'Henüz bildiriminiz yok'}
                        </h3>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-sm mx-auto">
                            Biri ilanınızı favorilere eklediğinde veya ilgilendiğiniz ilanların fiyatı düştüğünde burada göreceksiniz.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filteredNotifications.map(notification => (
                            <div
                                key={notification.id}
                                onClick={() => handleClickNotification(notification)}
                                className={`group relative p-4 rounded-2xl transition-all duration-200 cursor-pointer flex items-start gap-4 border ${
                                    !notification.is_read
                                        ? 'bg-rose-50/40 dark:bg-rose-950/10 border-rose-200/80 dark:border-rose-900/40 shadow-sm'
                                        : 'bg-white dark:bg-neutral-900 border-neutral-100 dark:border-white/5 hover:border-neutral-200 dark:hover:border-white/10 hover:shadow-sm'
                                }`}
                            >
                                {/* Left icon */}
                                {getIcon(notification.type)}

                                {/* Content */}
                                <div className="flex-1 min-w-0 pr-6">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h4 className={`text-sm font-bold truncate ${
                                            !notification.is_read
                                                ? 'text-neutral-900 dark:text-white'
                                                : 'text-neutral-700 dark:text-neutral-300'
                                        }`}>
                                            {notification.title || 'Bildirim'}
                                        </h4>
                                        {!notification.is_read && (
                                            <span className="w-2 h-2 rounded-full bg-rose-500 flex-shrink-0 animate-pulse" />
                                        )}
                                    </div>
                                    <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2 leading-relaxed">
                                        {notification.message}
                                    </p>
                                    <span className="text-[11px] text-neutral-400 dark:text-neutral-500 mt-2 block">
                                        {formatTime(notification.created_at)}
                                    </span>
                                </div>

                                {/* Delete button */}
                                <button
                                    onClick={(e) => handleDelete(e, notification.id)}
                                    title="Bildirimi Sil"
                                    className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-neutral-400 hover:text-red-500 dark:hover:text-red-400"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </ProfileLayout>
    );
};

export default NotificationsPage;
