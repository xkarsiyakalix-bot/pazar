import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

// Fetch geo info once per session and cache it
let cachedGeoInfo = null;
const fetchGeoInfo = async () => {
    if (cachedGeoInfo) return cachedGeoInfo;
    try {
        const res = await fetch('https://get.geojs.io/v1/ip/geo.json');
        if (!res.ok) throw new Error('geo fetch failed');
        const data = await res.json();
        
        cachedGeoInfo = {
            ip: data.ip || 'Bilinmiyor',
            country: data.country || null,
            countryCode: data.country_code || null,
            city: data.city || null,
        };
    } catch (e) {
        console.error("Geo fetch error:", e);
        cachedGeoInfo = { ip: 'Bilinmiyor', country: null, countryCode: null, city: null };
    }
    return cachedGeoInfo;
};

// Parse listing info from URL
const parsePageInfo = (pathname) => {
    // Try to detect if on a listing detail page (UUIDs in path)
    const uuidRegex = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;
    const listingMatch = pathname.match(uuidRegex);
    return {
        page: pathname,
        listingId: listingMatch ? listingMatch[0] : null,
    };
};

// Parse category from URL path
const parseCategoryFromPath = (pathname) => {
    const categoryMappings = [
        { path: '/Otomobil-Bisiklet-Tekne', name: 'Otomobil, Bisiklet & Tekne' },
        { path: '/Emlak', name: 'Emlak' },
        { path: '/Ev-Bahce', name: 'Ev & Bahçe' },
        { path: '/Moda-Guzellik', name: 'Moda & Güzellik' },
        { path: '/Elektronik', name: 'Elektronik' },
        { path: '/Evcil-Hayvanlar', name: 'Evcil Hayvanlar' },
        { path: '/Aile-Cocuk-Bebek', name: 'Aile, Çocuk & Bebek' },
        { path: '/Is-Ilanlari', name: 'İş İlanları' },
        { path: '/Eglence-Hobi-Mahalle', name: 'Eğlence, Hobi & Mahalle' },
        { path: '/Muzik-Film-Kitap', name: 'Müzik, Film & Kitap' },
        { path: '/Biletler', name: 'Biletler' },
        { path: '/Hizmetler', name: 'Hizmetler' },
        { path: '/Ucretsiz-Takas', name: 'Ücretsiz & Takas' },
        { path: '/Egitim-Kurslar', name: 'Eğitim & Kurslar' },
        { path: '/Komsu-Yardimi', name: 'Komşu Yardımı' },
    ];
    const matched = categoryMappings.find(m => pathname.startsWith(m.path));
    return matched ? matched.name : null;
};

export const PresenceTracker = () => {
    const { user } = useAuth();
    const { pathname } = useLocation();
    const channelRef = useRef(null);
    const geoRef = useRef(null);
    const profileRef = useRef(null);
    const intervalRef = useRef(null);

    // Fetch user profile once when user logs in
    useEffect(() => {
        if (!user) {
            profileRef.current = null;
            return;
        }
        const fetchProfile = async () => {
            const { data } = await supabase
                .from('profiles')
                .select('full_name, email')
                .eq('id', user.id)
                .single();
            profileRef.current = data;
        };
        fetchProfile();
    }, [user]);

    useEffect(() => {
        const sessionId = localStorage.getItem('presence_session_id') || Math.random().toString(36).substr(2, 9);
        localStorage.setItem('presence_session_id', sessionId);

        const presenceKey = user?.id || `guest-${sessionId}`;

        const channel = supabase.channel('site-presence', {
            config: {
                presence: { key: presenceKey },
            },
        });
        channelRef.current = channel;

        const track = async () => {
            if (!channelRef.current || channelRef.current.state !== 'joined') return;

            // Get geo info (cached after first call)
            if (!geoRef.current) {
                geoRef.current = await fetchGeoInfo();
            }
            const geo = geoRef.current || {};

            const { page, listingId } = parsePageInfo(pathname);
            const category = parseCategoryFromPath(pathname);
            const profile = profileRef.current;

            await channelRef.current.track({
                userId: user?.id || null,
                name: profile?.full_name || null,
                email: user?.email || profile?.email || null,
                ip: geo.ip,
                country: geo.country,
                countryCode: geo.countryCode,
                city: geo.city,
                page,
                category,
                listingId,
                listingTitle: null, // Can be enriched if needed
                userAgent: navigator.userAgent,
                joinedAt: new Date().toISOString(),
            });
        };

        channel
            .on('presence', { event: 'sync' }, () => { /* sync */ })
            .subscribe(async (status) => {
                if (status === 'SUBSCRIBED') {
                    await track();
                    // Heartbeat every 60 seconds
                    intervalRef.current = setInterval(track, 60000);
                }
            });

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
            channel.unsubscribe();
        };
    // Re-subscribe when user changes (login/logout)
    }, [user]); // eslint-disable-line

    // Re-track when pathname changes (without re-subscribing)
    useEffect(() => {
        const retrack = async () => {
            if (!channelRef.current || channelRef.current.state !== 'joined') return;

            if (!geoRef.current) {
                geoRef.current = await fetchGeoInfo();
            }
            const geo = geoRef.current || {};

            const { page, listingId } = parsePageInfo(pathname);
            const category = parseCategoryFromPath(pathname);
            const profile = profileRef.current;

            await channelRef.current.track({
                userId: user?.id || null,
                name: profile?.full_name || null,
                email: user?.email || profile?.email || null,
                ip: geo.ip,
                country: geo.country,
                countryCode: geo.countryCode,
                city: geo.city,
                page,
                category,
                listingId,
                listingTitle: null,
                userAgent: navigator.userAgent,
                joinedAt: channelRef.current._presences?.[0]?.joinedAt || new Date().toISOString(),
            });
        };
        retrack();
    }, [pathname]); // eslint-disable-line

    return null;
};

export default PresenceTracker;
