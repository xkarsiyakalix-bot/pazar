import React from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useIsMobile } from '../hooks/useIsMobile';
import { t } from '../translations';
import { getListingUrl, getSellerUrl } from '../utils/slug';
import { useTheme } from '../contexts/ThemeContext';
import MobileSearchOverlay from './MobileSearchOverlay';

export const Header = ({ followedSellers = [], setSelectedCategory }) => {
    const isMobile = useIsMobile();
    const navigate = useNavigate();
    const { user, signOut } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
    const [profileMenuOpen, setProfileMenuOpen] = React.useState(false);
    const [unreadCount, setUnreadCount] = React.useState(0);
    const [notificationCount, setNotificationCount] = React.useState(0);
    const [notifications, setNotifications] = React.useState([]);
    const [notificationDropdownOpen, setNotificationDropdownOpen] = React.useState(false);
    const [userProfile, setUserProfile] = React.useState(null);
    const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);
    const settingsDropdownRef = React.useRef(null);
    const notificationDropdownRef = React.useRef(null);
    const location = useLocation();

    // Close settings dropdown when clicking outside
    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (settingsDropdownRef.current && !settingsDropdownRef.current.contains(event.target)) {
                setIsSettingsOpen(false);
            }
            if (notificationDropdownRef.current && !notificationDropdownRef.current.contains(event.target)) {
                setNotificationDropdownOpen(false);
            }
        };

        if (isSettingsOpen || notificationDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isSettingsOpen, notificationDropdownOpen]);

    // Fetch user profile for display name
    React.useEffect(() => {
        const fetchProfile = async () => {
            if (user) {
                try {
                    const { fetchUserProfile } = await import('../api/profile');
                    const profile = await fetchUserProfile(user.id);
                    setUserProfile(profile);
                } catch (error) {
                    console.error('Error fetching user profile:', error);
                }
            }
        };

        fetchProfile();
    }, [user]);

    // Fetch unread message count
    React.useEffect(() => {
        const fetchUnreadCount = async () => {
            if (user) {
                try {
                    const { getUnreadCount } = await import('../api/messages');
                    const count = await getUnreadCount();
                    setUnreadCount(count);
                } catch (error) {
                    console.error('Error fetching unread count:', error);
                }
            }
        };

        if (user) {
            fetchUnreadCount();
            const interval = setInterval(fetchUnreadCount, 30000);
            return () => clearInterval(interval);
        }
    }, [user]);

    // Fetch notifications
    React.useEffect(() => {
        const fetchNotifications = async () => {
            if (user) {
                try {
                    const { getNotificationCount, getUnreadNotifications } = await import('../api/notifications');
                    const count = await getNotificationCount();
                    const notifs = await getUnreadNotifications();
                    setNotificationCount(count);
                    setNotifications(notifs);
                } catch (error) {
                    console.error('Error fetching notifications:', error);
                }
            }
        };

        if (user) {
            fetchNotifications();
            const interval = setInterval(fetchNotifications, 30000);
            return () => clearInterval(interval);
        }
    }, [user]);

    const handleLogout = async () => {
        try {
            await signOut();
            window.location.href = '/';
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const { isDarkMode, toggleDarkMode } = useTheme();
    const currentUser = user;

    return (
        <>
            <header className="glass fixed w-full top-0 z-50 border-b border-neutral-200/50 dark:border-white/10 shadow-lg overflow-visible">
                <div className="max-w-[1400px] mx-auto px-4 h-16 sm:h-20 flex items-center justify-between gap-2 sm:gap-4 overflow-visible">
                    {/* Mobile Back Button */}
                    {/* Mobile Back Button - Hide on Home and Product Detail pages */}
                    {isMobile && location.pathname !== '/' && !location.pathname.startsWith('/product/') && (
                        <button
                            onClick={() => navigate(-1)}
                            className="p-2 -ml-2 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                            aria-label="Geri"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                    )}

                    {!isMobile && (
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="lg:hidden p-2 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                            aria-label="Menu"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {mobileMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    )}

                    <div
                        onClick={() => {
                            if (setSelectedCategory) setSelectedCategory(t.categories.all);
                            navigate('/');
                            setMobileMenuOpen(false);
                        }}
                        className="cursor-pointer flex-shrink-0 px-2 sm:px-4 py-2 rounded-xl flex items-center gap-2 group"
                    >
                        <img
                            src="/logo_exvitrin_2026_small.png"
                            alt="ExVitrin Logo"
                            width="120"
                            height="48"
                            className="h-10 sm:h-12 w-auto object-contain transition-transform group-hover:scale-110 dark:brightness-110"
                            decoding="async"
                        />
                        <span className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent tracking-tight">
                            exvitrin
                        </span>
                    </div>


                    <div className="flex-1 max-w-2xl mx-2 sm:mx-8 hidden lg:block">
                        {/* Search items would go here or be passed as children if needed, but in Header component they are usually integrated */}
                    </div>

                    <div className="flex items-center gap-1 sm:gap-4">
                        {/* Theme Toggle Button */}
                        <button
                            onClick={toggleDarkMode}
                            className="p-2 text-neutral-600 dark:text-neutral-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all duration-300 relative focus:outline-none group"
                            title={isDarkMode ? 'Aydınlık Mod' : 'Karanlık Mod'}
                        >
                            {isDarkMode ? (
                                <svg className="w-6 h-6 transform group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 9H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M16.95 16.95l.707.707M7.05 7.05l.707.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
                                </svg>
                            ) : (
                                <svg className="w-6 h-6 transform group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                </svg>
                            )}
                        </button>

                        {currentUser ? (
                            <div className="flex items-center gap-1 sm:gap-3">
                                {/* Admin Panel Button */}
                                {(userProfile?.user_number === 1001 || user.email === 'kerem_aydin@aol.com' || userProfile?.is_admin) && (
                                    <button
                                        onClick={() => navigate('/admin')}
                                        className="p-2 text-neutral-600 hover:text-pink-600 hover:bg-pink-50 rounded-xl transition-all duration-300 relative focus:outline-none group"
                                        title="Admin Panel"
                                    >
                                        <svg className="w-6 h-6 transform group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-0.133-2.052-0.382-3.016z" />
                                        </svg>
                                    </button>
                                )}

                                {/* Notification Icon */}
                                <div className="relative" ref={notificationDropdownRef}>
                                    <button
                                        onClick={() => setNotificationDropdownOpen(!notificationDropdownOpen)}
                                        className="p-2 text-neutral-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-300 relative focus:outline-none group"
                                        aria-label="Bildirimler"
                                    >
                                        <svg className="w-6 h-6 transform group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-0.214 1.055-0.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                        </svg>
                                        {notificationCount > 0 && (
                                            <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center animate-pulse shadow-sm">
                                                {notificationCount}
                                            </span>
                                        )}
                                    </button>

                                    {notificationDropdownOpen && (
                                        <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-100 dark:border-white/10 py-3 z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
                                            <div className="px-4 pb-2 border-b border-neutral-50 dark:border-white/5 flex items-center justify-between">
                                                <h3 className="font-bold text-neutral-900 dark:text-neutral-100 text-sm">Bildirimler</h3>
                                                {notificationCount > 0 && <span className="text-[10px] text-blue-600 font-medium">{notificationCount} Yeni</span>}
                                            </div>
                                            <div className="max-h-80 overflow-y-auto">
                                                {notifications.length > 0 ? (
                                                    notifications.map(n => (
                                                        <div
                                                            key={n.id || Math.random()}
                                                            className="px-4 py-3 hover:bg-neutral-50 dark:hover:bg-neutral-800 cursor-pointer transition-colors border-b border-neutral-100 dark:border-white/5 last:border-0"
                                                            onClick={async () => {
                                                                const { markNotificationAsRead } = await import('../api/notifications');
                                                                if (n.id) markNotificationAsRead(n.id);

                                                                // Determine target link
                                                                let targetLink = n.link || n.url || n.path;

                                                                // If no explicit link, check for listing_id to construct product link
                                                                if (!targetLink) {
                                                                    const listingId = n.listing_id || n.metadata?.listing_id;
                                                                    if (listingId) {
                                                                        targetLink = getListingUrl({ id: listingId });
                                                                    }
                                                                }

                                                                if (targetLink) navigate(targetLink);
                                                                setNotificationDropdownOpen(false);

                                                                // Refresh counts locally
                                                                setNotificationCount(prev => Math.max(0, prev - 1));
                                                                setNotifications(prev => prev.filter(item => item.id !== n.id));
                                                            }}
                                                        >
                                                            <p className="text-xs text-neutral-800 dark:text-neutral-200 line-clamp-2 font-medium">{n.message || n.content || n.title}</p>
                                                            <span className="text-[10px] text-neutral-400 mt-1 block">
                                                                {n.created_at ? new Date(n.created_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : ''}
                                                            </span>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="py-8 text-center">
                                                        <p className="text-sm text-neutral-400">Henüz bildirim bulunmuyor</p>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="px-4 pt-2 border-t border-neutral-50 dark:border-white/5">
                                                <button
                                                    onClick={() => { navigate('/notifications'); setNotificationDropdownOpen(false); }}
                                                    className="text-[11px] text-blue-600 font-bold hover:text-blue-700 transition-colors w-full text-center py-2"
                                                >
                                                    Tüm Bildirimleri Gör
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Mobile Settings Dropdown (Next to Admin Shield) - Only visible on Profile page */}
                                {isMobile && location.pathname === '/profile' && (
                                    <div className="relative" ref={settingsDropdownRef}>
                                        <button
                                            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                                            className="p-2 text-neutral-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-300 relative focus:outline-none group"
                                        >
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-0.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-0.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-0.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-0.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-0.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-0.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </button>

                                        {isSettingsOpen && (
                                            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-100 dark:border-white/10 py-2 z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
                                                <button
                                                    onClick={() => { navigate(userProfile ? getSellerUrl(userProfile) : '/profile'); setIsSettingsOpen(false); }}
                                                    className="w-full text-left px-4 py-2.5 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 flex items-center gap-3 transition-colors"
                                                >
                                                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                                    Profilim
                                                </button>
                                                <button
                                                    onClick={() => { navigate('/settings'); setIsSettingsOpen(false); }}
                                                    className="w-full text-left px-4 py-2.5 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 flex items-center gap-3 transition-colors"
                                                >
                                                    <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-0.94 3.31.826 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-0.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-0.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-0.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-0.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-0.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                                    Ayarlar
                                                </button>
                                                <button
                                                    onClick={() => { navigate('/packages'); setIsSettingsOpen(false); }}
                                                    className="w-full text-left px-4 py-2.5 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 flex items-center gap-3 transition-colors"
                                                >
                                                    <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
                                                    Kurumsal
                                                </button>
                                                <div className="my-1 border-t border-neutral-50 dark:border-white/5"></div>
                                                <button
                                                    onClick={() => { handleLogout(); setIsSettingsOpen(false); }}
                                                    className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                                                    {t.nav.logout}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className="relative group hidden sm:block">
                                    <button
                                        onClick={() => navigate(userProfile ? getSellerUrl(userProfile) : '/profile')}
                                        className="text-neutral-700 dark:text-neutral-300 font-semibold inline-flex items-center gap-1 hover:text-blue-600 transition-colors py-2"
                                    >
                                        <span className="text-neutral-500 dark:text-neutral-400">Merhaba,</span>{' '}
                                        <span className="bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">{userProfile?.full_name || (user.email ? user.email.split('@')[0] : 'Kullanıcı')}</span>
                                        <svg className="w-4 h-4 text-neutral-400 transform group-hover:rotate-180 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                    </button>
                                    
                                    <div className="absolute right-0 top-full w-48 bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-100 dark:border-white/10 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[100] translate-y-2 group-hover:translate-y-0">
                                        <button
                                            onClick={() => navigate(userProfile ? getSellerUrl(userProfile) : '/profile')}
                                            className="w-full text-left px-4 py-2.5 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 flex items-center gap-3 transition-colors"
                                        >
                                            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                            Profilim
                                        </button>
                                        <button
                                            onClick={() => navigate('/settings')}
                                            className="w-full text-left px-4 py-2.5 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 flex items-center gap-3 transition-colors"
                                        >
                                            <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-0.94 3.31.826 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-0.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-0.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-0.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-0.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-0.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                            Ayarlar
                                        </button>
                                        <div className="my-1 border-t border-neutral-50 dark:border-white/5"></div>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                                            {t.nav.logout}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 sm:gap-4">
                                <button
                                    onClick={() => navigate('/login')}
                                    className="px-3 py-2 sm:px-6 sm:py-3 text-neutral-600 dark:text-neutral-400 font-bold hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-2xl transition-all text-sm"
                                >
                                    {t.nav.login}
                                </button>
                                <button
                                    onClick={() => navigate('/register')}
                                    className="bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 px-3 py-2 sm:px-6 sm:py-3 rounded-2xl font-bold shadow-lg shadow-neutral-900/10 hover:shadow-neutral-900/20 active:scale-95 transition-all text-sm"
                                >
                                    {t.nav.register}
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <>
                        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden" onClick={() => setMobileMenuOpen(false)}></div>
                        <div className="absolute top-full left-0 right-0 bg-white dark:bg-neutral-900 border-b border-neutral-100 dark:border-white/10 shadow-xl z-50 lg:hidden animate-in slide-in-from-top duration-300">
                            <div className="max-w-[1400px] mx-auto px-4 py-6">
                                <nav className="space-y-1">
                                    <button
                                        onClick={() => {
                                            if (setSelectedCategory) setSelectedCategory(t.categories.all);
                                            navigate('/');
                                            setMobileMenuOpen(false);
                                        }}
                                        className="w-full text-left px-4 py-3 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg font-medium flex items-center gap-3"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                        </svg>
                                        {t.categories.all}
                                    </button>

                                    <button
                                        onClick={() => {
                                            navigate('/packages');
                                            setMobileMenuOpen(false);
                                        }}
                                        className="w-full text-left px-4 py-3 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg font-medium flex items-center gap-3"
                                    >
                                        <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                        </svg>
                                        Abonelik Paketleri
                                    </button>

                                    <button
                                        onClick={() => {
                                            navigate('/messages');
                                            setMobileMenuOpen(false);
                                        }}
                                        className="w-full text-left px-4 py-3 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg font-medium flex items-center gap-3"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h0.01M12 12h0.01M16 12h0.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-0.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                        </svg>
                                        {t.nav.messages}
                                    </button>

                                    <button
                                        onClick={() => {
                                            navigate('/favorites');
                                            setMobileMenuOpen(false);
                                        }}
                                        className="w-full text-left px-4 py-3 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg font-medium flex items-center gap-3"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                        </svg>
                                        {t.nav.favorites}
                                    </button>

                                    {currentUser && (
                                        <button
                                            onClick={() => {
                                                navigate('/settings');
                                                setMobileMenuOpen(false);
                                            }}
                                            className="w-full text-left px-4 py-3 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg font-medium flex items-center gap-3"
                                        >
                                            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-0.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-0.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-0.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-0.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-0.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-0.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            Ayarlar
                                        </button>
                                    )}

                                    {currentUser && (
                                        <button
                                            onClick={() => {
                                                handleLogout();
                                                setMobileMenuOpen(false);
                                            }}
                                            className="w-full text-left px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg font-medium flex items-center gap-3 mt-4"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                            </svg>
                                            {t.nav.logout}
                                        </button>
                                    )}
                                </nav>
                            </div>
                        </div>
                    </>
                )}

            </header >
            <div className="h-16 sm:h-20 no-print"></div>
        </>
    );
};

export default Header;
