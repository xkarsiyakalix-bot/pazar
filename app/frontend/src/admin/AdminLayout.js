import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

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

                // Extra safety: Check if current route is restricted
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
        { name: 'Kontrol Paneli', href: '/admin', icon: '📊' },
        { name: 'Ödemeler', href: '/admin/promotions', icon: '💰' },
        { name: 'İlanlar', href: '/admin/listings', icon: '📝' },
        { name: 'Kategoriler', href: '/admin/categories', icon: '📂' },
        { name: 'Kullanıcılar', href: '/admin/users', icon: '👥' },
        ...(isSuperAdmin ? [{ name: 'Yöneticiler', href: '/admin/admins', icon: '🛡️' }] : []),
        { name: 'Kurumsal Satıcılar', href: '/admin/commercial', icon: '🏪' },
        ...(isSuperAdmin ? [{ name: 'İstatistikler', href: '/admin/sales-reports', icon: '📊' }] : []),
        { name: 'Bildirimler', href: '/admin/reports', icon: '⚠️' },
        { name: 'İş Analitiği', href: '/admin/stats', icon: '📈' },
        { name: 'Ayarlar', href: '/admin/settings', icon: '⚙️' },
    ];

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex font-sans transition-colors duration-300">
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-neutral-900/50 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}

            {/* Sidebar */}
            <aside className={`
                fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-neutral-900 border-r border-neutral-100 dark:border-white/5 shadow-2xl lg:shadow-none transform transition-all duration-300 ease-in-out
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                lg:translate-x-0 lg:static lg:inset-0 flex flex-col
            `}>
                <div className="flex items-center justify-center h-20 border-b border-neutral-100/80 dark:border-white/5">
                    <h1 className="text-2xl font-display font-bold bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent tracking-tight">
                        ExVitrin<span className="text-neutral-400 font-light text-base ml-1">Admin</span>
                    </h1>
                </div>

                <nav className="flex-1 mt-6 px-4 space-y-1.5 overflow-y-auto custom-scrollbar">
                    {navigation.map((item) => {
                        const isActive = location.pathname === item.href || (item.href !== '/admin' && location.pathname.startsWith(item.href));
                        return (
                            <Link
                                key={item.name}
                                to={item.href}
                                onClick={() => setSidebarOpen(false)}
                                className={`group flex items-center px-4 py-3.5 rounded-xl transition-all duration-200 ${isActive
                                    ? 'bg-red-50 dark:bg-red-900/10 text-red-600 shadow-sm ring-1 ring-red-100 dark:ring-red-900/20'
                                    : 'text-neutral-500 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 hover:text-neutral-900 dark:hover:text-neutral-50'
                                    }`}
                            >
                                <span className={`mr-4 text-xl transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                                    {item.icon}
                                </span>
                                <span className="font-medium text-sm tracking-wide">{item.name}</span>
                                {isActive && (
                                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]"></div>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-neutral-100 dark:border-white/5 bg-neutral-50/50 dark:bg-neutral-950/20">
                    <div className="flex items-center gap-3 mb-4 p-2 rounded-lg bg-white dark:bg-neutral-800 border border-neutral-100 dark:border-white/5 shadow-sm">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-700 dark:to-neutral-800 flex items-center justify-center text-lg font-bold text-neutral-600 dark:text-neutral-300 shadow-inner">
                            {user?.email?.charAt(0).toUpperCase()}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-bold text-neutral-900 dark:text-neutral-50 truncate">{user?.email}</p>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                                {isSuperAdmin ? 'Süper Yönetici' : 'Yönetici'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white dark:bg-neutral-800 hover:bg-red-50 dark:hover:bg-red-900/10 text-neutral-600 dark:text-neutral-400 hover:text-red-600 dark:hover:text-red-500 border border-neutral-200 dark:border-white/5 hover:border-red-100 dark:hover:border-red-900/20 rounded-xl transition-all duration-200 text-sm font-bold shadow-sm hover:shadow"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                        Oturumu Kapat
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-neutral-50/30 dark:bg-neutral-950/30">
                {/* Header */}
                <header className="sticky top-0 z-30 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border-b border-neutral-100 dark:border-white/5 shadow-sm supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-neutral-900/60">
                    <div className="flex items-center justify-between h-20 px-4 sm:px-8">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden p-2 -ml-2 rounded-xl text-neutral-500 hover:bg-neutral-100 focus:outline-none"
                        >
                            <span className="sr-only">Open sidebar</span>
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>

                        <div className="flex-1 flex justify-between items-center ml-4 lg:ml-0">
                            <div>
                                <h2 className="text-2xl font-display font-bold text-neutral-900 dark:text-neutral-50 tracking-tight">
                                    {navigation.find(item => item.href === location.pathname)?.name || 'Kontrol Paneli'}
                                </h2>
                                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 hidden sm:block">
                                    ExVitrin Yönetim Paneli
                                </p>
                            </div>

                            <div className="flex items-center gap-4">
                                <Link
                                    to="/"
                                    className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-medium text-neutral-600 dark:text-neutral-400 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-white/5 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-700 hover:text-red-600 dark:hover:text-red-500 hover:border-red-100 dark:hover:border-red-900/20 transition-all shadow-sm"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                    Siteye Dön
                                </Link>
                                <button className="p-2 text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors relative">
                                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-neutral-900"></span>
                                    <span className="text-xl">🔔</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-4 sm:p-8 custom-scrollbar">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
