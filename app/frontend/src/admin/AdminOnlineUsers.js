import React, { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '../lib/supabase';

// ─── Helpers ────────────────────────────────────────────────────────────────

const FLAG_BASE = 'https://flagcdn.com/24x18';

const formatDuration = (seconds) => {
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}dk`;
    return `${Math.floor(seconds / 3600)}sa ${Math.floor((seconds % 3600) / 60)}dk`;
};

const formatPath = (path) => {
    if (!path) return '/';
    if (path === '/') return 'Ana Sayfa';
    const parts = path.replace(/^\//, '').split('/');
    return parts.map(p => decodeURIComponent(p)).join(' › ');
};

const getBrowserIcon = (ua) => {
    if (!ua) return '🌐';
    const u = ua.toLowerCase();
    if (u.includes('chrome') && !u.includes('edg')) return '🔵';
    if (u.includes('firefox')) return '🦊';
    if (u.includes('safari') && !u.includes('chrome')) return '🧭';
    if (u.includes('edg')) return '🔷';
    if (u.includes('opera')) return '🔴';
    return '🌐';
};

const getDeviceIcon = (ua) => {
    if (!ua) return '💻';
    const u = ua.toLowerCase();
    if (u.includes('mobile') || u.includes('android') || u.includes('iphone')) return '📱';
    if (u.includes('tablet') || u.includes('ipad')) return '📟';
    return '💻';
};

const getStatusColor = (joinedAt) => {
    const seconds = Math.floor((Date.now() - new Date(joinedAt).getTime()) / 1000);
    if (seconds < 60) return 'bg-emerald-500';
    if (seconds < 300) return 'bg-yellow-400';
    return 'bg-orange-400';
};

// ─── Main Component ──────────────────────────────────────────────────────────

const AdminOnlineUsers = () => {
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [filter, setFilter] = useState('all'); // all | logged | guest
    const [sortBy, setSortBy] = useState('joined'); // joined | country | page
    const [searchText, setSearchText] = useState('');
    const [ticker, setTicker] = useState(0); // force re-render for duration
    const channelRef = useRef(null);

    // Tick every 5 seconds to refresh durations
    useEffect(() => {
        const interval = setInterval(() => setTicker(t => t + 1), 5000);
        return () => clearInterval(interval);
    }, []);

    const buildUserList = useCallback((state) => {
        const list = [];
        Object.entries(state).forEach(([key, presences]) => {
            if (presences && presences.length > 0) {
                // Take the most recent presence for this key
                const p = presences[presences.length - 1];
                list.push({
                    key,
                    userId: p.userId || null,
                    name: p.name || null,
                    email: p.email || null,
                    ip: p.ip || 'Bilinmiyor',
                    country: p.country || null,
                    countryCode: p.countryCode || null,
                    city: p.city || null,
                    page: p.page || '/',
                    category: p.category || null,
                    listingId: p.listingId || null,
                    listingTitle: p.listingTitle || null,
                    userAgent: p.userAgent || null,
                    joinedAt: p.joinedAt || new Date().toISOString(),
                    isLoggedIn: !!p.userId,
                });
            }
        });
        return list;
    }, []);

    useEffect(() => {
        const channel = supabase.channel('site-presence');
        channelRef.current = channel;

        channel
            .on('presence', { event: 'sync' }, () => {
                const state = channel.presenceState();
                setOnlineUsers(buildUserList(state));
            })
            .on('presence', { event: 'join' }, () => {
                const state = channel.presenceState();
                setOnlineUsers(buildUserList(state));
            })
            .on('presence', { event: 'leave' }, () => {
                const state = channel.presenceState();
                setOnlineUsers(buildUserList(state));
            })
            .subscribe((status) => {
                if (status === 'SUBSCRIBED') {
                    const state = channel.presenceState();
                    setOnlineUsers(buildUserList(state));
                }
            });

        return () => {
            channel.unsubscribe();
        };
    }, [buildUserList]);

    // ── Filter & Sort ─────────────────────────────────────────────────────

    const filtered = onlineUsers
        .filter(u => {
            if (filter === 'logged') return u.isLoggedIn;
            if (filter === 'guest') return !u.isLoggedIn;
            return true;
        })
        .filter(u => {
            if (!searchText) return true;
            const q = searchText.toLowerCase();
            return (
                (u.ip && u.ip.toLowerCase().includes(q)) ||
                (u.country && u.country.toLowerCase().includes(q)) ||
                (u.city && u.city.toLowerCase().includes(q)) ||
                (u.name && u.name.toLowerCase().includes(q)) ||
                (u.email && u.email.toLowerCase().includes(q)) ||
                (u.page && u.page.toLowerCase().includes(q))
            );
        })
        .sort((a, b) => {
            if (sortBy === 'joined') return new Date(b.joinedAt) - new Date(a.joinedAt);
            if (sortBy === 'country') return (a.country || '').localeCompare(b.country || '');
            if (sortBy === 'page') return a.page.localeCompare(b.page);
            return 0;
        });

    const loggedCount = onlineUsers.filter(u => u.isLoggedIn).length;
    const guestCount = onlineUsers.filter(u => !u.isLoggedIn).length;

    // ── Countries breakdown ───────────────────────────────────────────────
    const countryBreakdown = onlineUsers.reduce((acc, u) => {
        const c = u.country || 'Bilinmiyor';
        acc[c] = (acc[c] || 0) + 1;
        return acc;
    }, {});
    const sortedCountries = Object.entries(countryBreakdown)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

    return (
        <div className="space-y-6 animate-fade-in">

            {/* ── Header Stats ─────────────────────────────────────────────── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatBadge
                    label="Toplam Online"
                    value={onlineUsers.length}
                    icon="🟢"
                    color="from-emerald-400 to-green-600"
                    pulse
                />
                <StatBadge
                    label="Üye"
                    value={loggedCount}
                    icon="👤"
                    color="from-blue-500 to-indigo-600"
                />
                <StatBadge
                    label="Misafir"
                    value={guestCount}
                    icon="👻"
                    color="from-slate-400 to-slate-600"
                />
                <StatBadge
                    label="Ülke Sayısı"
                    value={Object.keys(countryBreakdown).length}
                    icon="🌍"
                    color="from-violet-500 to-purple-600"
                />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">

                {/* ── Main Table ──────────────────────────────────────────── */}
                <div className="xl:col-span-3 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-white/5 shadow-sm overflow-hidden">

                    {/* Toolbar */}
                    <div className="p-4 border-b border-neutral-100 dark:border-white/5 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="relative flex items-center">
                                <span className="absolute left-3 text-sm">🔍</span>
                                <input
                                    type="text"
                                    placeholder="IP, ülke, şehir, kullanıcı ara..."
                                    value={searchText}
                                    onChange={e => setSearchText(e.target.value)}
                                    className="pl-9 pr-4 py-2 text-sm rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent w-56"
                                />
                            </div>

                            {/* Filter tabs */}
                            {[
                                { key: 'all', label: 'Tümü', count: onlineUsers.length },
                                { key: 'logged', label: 'Üye', count: loggedCount },
                                { key: 'guest', label: 'Misafir', count: guestCount },
                            ].map(tab => (
                                <button
                                    key={tab.key}
                                    onClick={() => setFilter(tab.key)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                        filter === tab.key
                                            ? 'bg-emerald-500 text-white shadow-sm'
                                            : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                                    }`}
                                >
                                    {tab.label}
                                    <span className={`ml-1.5 px-1.5 py-0.5 rounded text-[10px] ${
                                        filter === tab.key ? 'bg-white/20' : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400'
                                    }`}>{tab.count}</span>
                                </button>
                            ))}
                        </div>

                        {/* Sort */}
                        <select
                            value={sortBy}
                            onChange={e => setSortBy(e.target.value)}
                            className="px-3 py-2 text-xs rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                        >
                            <option value="joined">Son Katılan Önce</option>
                            <option value="country">Ülkeye Göre</option>
                            <option value="page">Sayfaya Göre</option>
                        </select>
                    </div>

                    {/* Table */}
                    {filtered.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-900/10 rounded-full flex items-center justify-center mb-4">
                                <span className="text-3xl">🌐</span>
                            </div>
                            <p className="text-neutral-500 dark:text-neutral-400 font-medium">
                                {onlineUsers.length === 0
                                    ? 'Şu an online kullanıcı yok'
                                    : 'Filtrele eşleşen kullanıcı bulunamadı'}
                            </p>
                            <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">
                                Kullanıcılar siteye bağlandıkça burada görünecek
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="text-[10px] uppercase font-bold text-neutral-400 dark:text-neutral-500 bg-neutral-50/80 dark:bg-neutral-950/50 sticky top-0">
                                    <tr>
                                        <th className="px-4 py-3 tracking-wider">Kullanıcı</th>
                                        <th className="px-4 py-3 tracking-wider">IP Adresi</th>
                                        <th className="px-4 py-3 tracking-wider">Konum</th>
                                        <th className="px-4 py-3 tracking-wider">Sayfa / İlan</th>
                                        <th className="px-4 py-3 tracking-wider">Cihaz</th>
                                        <th className="px-4 py-3 tracking-wider text-right">Süre</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-50 dark:divide-white/5">
                                    {filtered.map(user => {
                                        const seconds = Math.floor((Date.now() - new Date(user.joinedAt).getTime()) / 1000);
                                        return (
                                            <tr
                                                key={user.key}
                                                className="group hover:bg-emerald-50/30 dark:hover:bg-emerald-900/5 transition-colors"
                                            >
                                                {/* User */}
                                                <td className="px-4 py-3.5">
                                                    <div className="flex items-center gap-2.5">
                                                        <div className="relative">
                                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                                                                user.isLoggedIn
                                                                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                                                                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400'
                                                            }`}>
                                                                {user.isLoggedIn
                                                                    ? (user.name?.[0] || user.email?.[0] || '?').toUpperCase()
                                                                    : '?'}
                                                            </div>
                                                            <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-neutral-900 ${getStatusColor(user.joinedAt)}`}></span>
                                                        </div>
                                                        <div>
                                                            {user.isLoggedIn ? (
                                                                <>
                                                                    <div className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                                                                        {user.name || 'Üye'}
                                                                    </div>
                                                                    <div className="text-[10px] text-neutral-400 dark:text-neutral-500 truncate max-w-[100px]">
                                                                        {user.email}
                                                                    </div>
                                                                </>
                                                            ) : (
                                                                <div className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                                                                    Misafir
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* IP */}
                                                <td className="px-4 py-3.5">
                                                    <code className="text-xs font-mono bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 px-2 py-0.5 rounded-md">
                                                        {user.ip}
                                                    </code>
                                                </td>

                                                {/* Location */}
                                                <td className="px-4 py-3.5">
                                                    <div className="flex items-center gap-2">
                                                        {user.countryCode && (
                                                            <img
                                                                src={`${FLAG_BASE}/${user.countryCode.toLowerCase()}.png`}
                                                                alt={user.country}
                                                                className="w-5 h-3.5 rounded-sm object-cover shadow-sm"
                                                                onError={e => { e.target.style.display = 'none'; }}
                                                            />
                                                        )}
                                                        <div>
                                                            <div className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                                                                {user.country || 'Bilinmiyor'}
                                                            </div>
                                                            {user.city && (
                                                                <div className="text-[10px] text-neutral-400 dark:text-neutral-500">
                                                                    {user.city}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Page / Listing */}
                                                <td className="px-4 py-3.5">
                                                    <div className="max-w-[200px]">
                                                        {user.listingTitle ? (
                                                            <>
                                                                <div className="text-xs font-semibold text-violet-600 dark:text-violet-400 truncate" title={user.listingTitle}>
                                                                    📌 {user.listingTitle}
                                                                </div>
                                                                <div className="text-[10px] text-neutral-400 dark:text-neutral-500 truncate">
                                                                    {formatPath(user.page)}
                                                                </div>
                                                            </>
                                                        ) : user.category ? (
                                                            <>
                                                                <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 truncate">
                                                                    📂 {user.category}
                                                                </div>
                                                                <div className="text-[10px] text-neutral-400 dark:text-neutral-500 truncate">
                                                                    {formatPath(user.page)}
                                                                </div>
                                                            </>
                                                        ) : (
                                                            <div className="text-xs text-neutral-600 dark:text-neutral-400 truncate">
                                                                {formatPath(user.page)}
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>

                                                {/* Device */}
                                                <td className="px-4 py-3.5">
                                                    <div className="flex items-center gap-1.5 text-neutral-500 dark:text-neutral-400">
                                                        <span className="text-base">{getDeviceIcon(user.userAgent)}</span>
                                                        <span className="text-base">{getBrowserIcon(user.userAgent)}</span>
                                                    </div>
                                                </td>

                                                {/* Duration */}
                                                <td className="px-4 py-3.5 text-right">
                                                    <span className="text-xs font-mono font-semibold text-neutral-500 dark:text-neutral-400">
                                                        {formatDuration(seconds)}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* ── Sidebar ─────────────────────────────────────────────── */}
                <div className="xl:col-span-1 space-y-4">

                    {/* Country Breakdown */}
                    <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-white/5 shadow-sm p-4">
                        <h3 className="text-sm font-bold text-neutral-800 dark:text-neutral-200 mb-3 flex items-center gap-2">
                            <span>🌍</span> Ülke Dağılımı
                        </h3>
                        {sortedCountries.length === 0 ? (
                            <p className="text-xs text-neutral-400 dark:text-neutral-500 text-center py-4">Veri yok</p>
                        ) : (
                            <div className="space-y-2.5">
                                {sortedCountries.map(([country, count]) => {
                                    const pct = onlineUsers.length > 0 ? Math.round((count / onlineUsers.length) * 100) : 0;
                                    const user = onlineUsers.find(u => u.country === country);
                                    return (
                                        <div key={country}>
                                            <div className="flex items-center justify-between mb-1">
                                                <div className="flex items-center gap-1.5">
                                                    {user?.countryCode && (
                                                        <img
                                                            src={`${FLAG_BASE}/${user.countryCode.toLowerCase()}.png`}
                                                            alt={country}
                                                            className="w-4 h-2.5 rounded-sm object-cover"
                                                            onError={e => { e.target.style.display = 'none'; }}
                                                        />
                                                    )}
                                                    <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300 truncate max-w-[100px]">{country}</span>
                                                </div>
                                                <span className="text-xs font-bold text-neutral-600 dark:text-neutral-400">{count}</span>
                                            </div>
                                            <div className="h-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-emerald-400 to-green-500 rounded-full transition-all duration-500"
                                                    style={{ width: `${pct}%` }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Live Feed */}
                    <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-white/5 shadow-sm p-4">
                        <h3 className="text-sm font-bold text-neutral-800 dark:text-neutral-200 mb-3 flex items-center gap-2">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            Canlı Akış
                        </h3>
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                            {onlineUsers.length === 0 ? (
                                <p className="text-xs text-neutral-400 dark:text-neutral-500 text-center py-4">Bekleniyor...</p>
                            ) : (
                                [...onlineUsers]
                                    .sort((a, b) => new Date(b.joinedAt) - new Date(a.joinedAt))
                                    .slice(0, 10)
                                    .map(u => (
                                        <div key={u.key} className="flex items-start gap-2 text-[11px]">
                                            <span className="mt-0.5 text-base">
                                                {u.isLoggedIn ? '👤' : '👻'}
                                            </span>
                                            <div className="flex-1 min-w-0">
                                                <div className="font-semibold text-neutral-700 dark:text-neutral-300 truncate">
                                                    {u.isLoggedIn ? (u.name || 'Üye') : 'Misafir'}
                                                    {u.city && <span className="font-normal text-neutral-400 dark:text-neutral-500"> · {u.city}</span>}
                                                </div>
                                                <div className="text-neutral-400 dark:text-neutral-500 truncate">
                                                    {formatPath(u.page)}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                            )}
                        </div>
                    </div>

                    {/* Info Card */}
                    <div className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/10 dark:to-green-900/10 rounded-2xl border border-emerald-100 dark:border-emerald-900/20 p-4">
                        <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium leading-relaxed">
                            💡 Bu panel Supabase Realtime Presence kanalını kullanır. Veriler anında güncellenir — sayfa yenilemeye gerek yok.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─── Stat Badge ──────────────────────────────────────────────────────────────

const StatBadge = ({ label, value, icon, color, pulse }) => (
    <div className="relative overflow-hidden bg-white dark:bg-neutral-900 p-5 rounded-2xl border border-neutral-100 dark:border-white/5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group">
        <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${color} opacity-10 dark:opacity-20 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110`} />
        <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl bg-gradient-to-br ${color} shadow-md`}>
                <span>{icon}</span>
            </div>
            <div>
                <p className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-0.5">{label}</p>
                <div className="flex items-center gap-2">
                    <p className="text-2xl font-black text-neutral-900 dark:text-neutral-50">{value}</p>
                    {pulse && value > 0 && (
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                    )}
                </div>
            </div>
        </div>
    </div>
);

export default AdminOnlineUsers;
