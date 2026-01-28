import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useIsMobile } from '../hooks/useIsMobile';
import { t } from '../translations';

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
    const location = useLocation();

    // Close settings dropdown when clicking outside
    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (settingsDropdownRef.current && !settingsDropdownRef.current.contains(event.target)) {
                setIsSettingsOpen(false);
            }
        };

        if (isSettingsOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isSettingsOpen]);

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
            navigate('/');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const currentUser = user;

    return (
        <>
            <header className="glass fixed w-full top-0 z-50 border-b border-neutral-200/50 shadow-lg overflow-visible">
                <div className="max-w-[1400px] mx-auto px-4 h-16 sm:h-20 flex items-center justify-between gap-2 sm:gap-4 overflow-visible">
                    {!isMobile && (
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="lg:hidden p-2 text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"
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
                            src="/logo_exvitrin_2026.png"
                            alt="ExVitrin Logo"
                            width="120"
                            height="48"
                            className="h-10 sm:h-12 w-auto object-contain transition-transform group-hover:scale-110"
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
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                        </svg>
                                    </button>
                                )}

                                {/* Mobile Settings Dropdown (Next to Admin Shield) - Only visible on Profile page */}
                                {isMobile && location.pathname === '/profile' && (
                                    <div className="relative" ref={settingsDropdownRef}>
                                        <button
                                            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                                            className="p-2 text-neutral-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-300 relative focus:outline-none group"
                                        >
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </button>

                                        {isSettingsOpen && (
                                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-neutral-100 py-2 z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
                                                <button
                                                    onClick={() => { navigate('/settings'); setIsSettingsOpen(false); }}
                                                    className="w-full text-left px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 flex items-center gap-3 transition-colors"
                                                >
                                                    <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                                    Ayarlar
                                                </button>
                                                <div className="my-1 border-t border-neutral-50"></div>
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

                                <span className="text-neutral-700 font-semibold hidden sm:inline-block">
                                    <span className="text-neutral-500">Merhaba,</span>{' '}
                                    <span className="bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">{userProfile?.full_name || user.email?.split('@')[0]}</span>
                                </span>

                                <button
                                    onClick={handleLogout}
                                    className="hidden sm:block px-4 py-2 border border-neutral-200 rounded-xl text-neutral-600 hover:bg-neutral-50 transition-all text-sm font-bold ml-2"
                                >
                                    {t.nav.logout}
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 sm:gap-4">
                                <button
                                    onClick={() => navigate('/login')}
                                    className="px-3 py-2 sm:px-6 sm:py-3 text-neutral-600 font-bold hover:bg-neutral-100 rounded-2xl transition-all text-sm"
                                >
                                    {t.nav.login}
                                </button>
                                <button
                                    onClick={() => navigate('/register')}
                                    className="bg-neutral-900 text-white px-3 py-2 sm:px-6 sm:py-3 rounded-2xl font-bold shadow-lg shadow-neutral-900/10 hover:shadow-neutral-900/20 active:scale-95 transition-all text-sm"
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
                        <div className="absolute top-full left-0 right-0 bg-white border-b border-neutral-100 shadow-xl z-50 lg:hidden animate-in slide-in-from-top duration-300">
                            <div className="max-w-[1400px] mx-auto px-4 py-6">
                                <nav className="space-y-1">
                                    <button
                                        onClick={() => {
                                            if (setSelectedCategory) setSelectedCategory(t.categories.all);
                                            navigate('/');
                                            setMobileMenuOpen(false);
                                        }}
                                        className="w-full text-left px-4 py-3 text-neutral-700 hover:bg-neutral-100 rounded-lg font-medium flex items-center gap-3"
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
                                        className="w-full text-left px-4 py-3 text-neutral-700 hover:bg-neutral-100 rounded-lg font-medium flex items-center gap-3"
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
                                        className="w-full text-left px-4 py-3 text-neutral-700 hover:bg-neutral-100 rounded-lg font-medium flex items-center gap-3"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                        </svg>
                                        {t.nav.messages}
                                    </button>

                                    <button
                                        onClick={() => {
                                            navigate('/favorites');
                                            setMobileMenuOpen(false);
                                        }}
                                        className="w-full text-left px-4 py-3 text-neutral-700 hover:bg-neutral-100 rounded-lg font-medium flex items-center gap-3"
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
                                            className="w-full text-left px-4 py-3 text-neutral-700 hover:bg-neutral-100 rounded-lg font-medium flex items-center gap-3"
                                        >
                                            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
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
                                            className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg font-medium flex items-center gap-3 mt-4"
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
            <div className="h-16 sm:h-20"></div>
        </>
    );
};
