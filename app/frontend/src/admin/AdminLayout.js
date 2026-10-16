import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

const NavIcon = ({ name }) => {
    const cls = 'w-4 h-4';
    const icons = {
        dashboard: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
        payments: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z',
        listings: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
        categories: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z',
        users: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
        online: 'M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728M8.464 15.536a5 5 0 010-7.072m7.072 0a5 5 0 010 7.072M12 13a1 1 0 100-2 1 1 0 000 2z',
        messages: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
        admins: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
        store: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z',
        stats: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
        reports: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
        analytics: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6',
        traffic: 'M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9',
        settings: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
    };
    return (
        <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d={icons[name]} />
        </svg>
    );
};

const AdminLayout = () => {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            if (!user) return;
            const { data, error } = await supabase
                .from('profiles')
                .select('admin_role, is_admin, email, user_number')
                .eq('id', user.id)
                .single();

            if (!error && data) {
                setProfile(data);

                const isSuperAdmin = data.admin_role === 'super_admin' || data.user_number === 1001 || data.email === 'kerem_aydin@aol.com';
                const restrictedRoutes = ['/admin/sales-reports', '/admin/admins'];
                if (!isSuperAdmin && restrictedRoutes.includes(location.pathname)) {
                    navigate('/admin');
                    alert('Bu sayfaya erişim yetkiniz bulunmamaktadır.');
                }
            }
        };
        fetchProfile();
    }, [user, location.pathname, navigate]);

    const handleLogout = async () => {
        try {
            await signOut();
            navigate('/login');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    const isSuperAdmin = profile?.admin_role === 'super_admin' || profile?.user_number === 1001 || profile?.email === 'kerem_aydin@aol.com';

    const navigation = [
        { name: 'Kontrol Paneli', href: '/admin', icon: 'dashboard' },
        { name: 'Ödemeler', href: '/admin/promotions', icon: 'payments' },
        { name: 'İlanlar', href: '/admin/listings', icon: 'listings' },
        { name: 'Kategoriler', href: '/admin/categories', icon: 'categories' },
        { name: 'Kullanıcılar', href: '/admin/users', icon: 'users' },
        { name: 'Online Kullanıcılar', href: '/admin/online-users', icon: 'online', live: true },
        { name: 'Mesajlaşmalar', href: '/admin/messages', icon: 'messages' },
        ...(isSuperAdmin ? [{ name: 'Yöneticiler', href: '/admin/admins', icon: 'admins' }] : []),
        { name: 'Kurumsal Satıcılar', href: '/admin/commercial', icon: 'store' },
        ...(isSuperAdmin ? [{ name: 'İstatistikler', href: '/admin/sales-reports', icon: 'stats' }] : []),
        { name: 'Bildirimler', href: '/admin/reports', icon: 'reports' },
        { name: 'İş Analitiği', href: '/admin/stats', icon: 'analytics' },
        { name: 'Site Trafiği', href: '/admin/traffic', icon: 'traffic' },
        { name: 'Ayarlar', href: '/admin/settings', icon: 'settings' },
    ];

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex font-sans">
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-neutral-900/40 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}

            <aside className={`
                fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 transform transition-transform duration-200 ease-out
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                lg:translate-x-0 lg:static lg:inset-0 flex flex-col
            `}>
                <div className="flex items-center h-16 px-5 border-b border-neutral-200 dark:border-neutral-800">
                    <h1 className="text-base font-medium text-neutral-900 dark:text-neutral-100 tracking-tight">
                        ExVitrin <span className="text-neutral-400 font-normal">Admin</span>
                    </h1>
                </div>

                <nav className="flex-1 py-3 px-2 overflow-y-auto custom-scrollbar">
                    {navigation.map((item) => {
                        const isActive = location.pathname === item.href || (item.href !== '/admin' && location.pathname.startsWith(item.href));
                        return (
                            <Link
                                key={item.name}
                                to={item.href}
                                onClick={() => setSidebarOpen(false)}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors duration-200 cursor-pointer ${
                                    isActive
                                        ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 font-medium'
                                        : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800/70 hover:text-neutral-900 dark:hover:text-neutral-200'
                                }`}
                            >
                                <NavIcon name={item.icon} />
                                <span className="flex-1 truncate">{item.name}</span>
                                {item.live && (
                                    <span className="relative flex h-2 w-2" aria-hidden="true">
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-3 border-t border-neutral-200 dark:border-neutral-800">
                    <div className="flex items-center gap-3 mb-3 px-1">
                        <div className="w-8 h-8 rounded-full border border-neutral-200 dark:border-neutral-700 flex items-center justify-center text-xs font-medium text-neutral-600 dark:text-neutral-300">
                            {user?.email?.charAt(0).toUpperCase()}
                        </div>
                        <div className="overflow-hidden min-w-0">
                            <p className="text-sm text-neutral-900 dark:text-neutral-100 truncate">{user?.email}</p>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                {isSuperAdmin ? 'Süper Yönetici' : 'Yönetici'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700 rounded-md transition-colors duration-200 text-sm font-medium cursor-pointer"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                        Oturumu Kapat
                    </button>
                </div>
            </aside>

            <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-neutral-50 dark:bg-neutral-950">
                <header className="sticky top-0 z-30 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
                    <div className="flex items-center justify-between h-14 px-4 sm:px-6">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden p-2 -ml-2 rounded-md text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 focus:outline-none cursor-pointer"
                        >
                            <span className="sr-only">Open sidebar</span>
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>

                        <div className="flex-1 flex justify-between items-center ml-2 lg:ml-0">
                            <div>
                                <h2 className="text-base font-medium text-neutral-900 dark:text-neutral-50">
                                    {navigation.find(item => item.href === location.pathname)?.name || 'Kontrol Paneli'}
                                </h2>
                                <p className="text-xs text-neutral-500 dark:text-neutral-400 hidden sm:block">
                                    ExVitrin Yönetim Paneli
                                </p>
                            </div>

                            <div className="flex items-center gap-2">
                                <Link
                                    to="/"
                                    className="hidden sm:inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-md hover:border-neutral-400 dark:hover:border-neutral-500 transition-colors duration-200"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                    Siteye Dön
                                </Link>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
