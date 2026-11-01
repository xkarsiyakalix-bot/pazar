import { setAppBadge, clearAppBadge, isNative, listenAppState } from './capacitorBridge';
import { supabase } from '../lib/supabase';

let activeSubscription = null;
let lastUnreadTotal = 0;

/**
 * Kullanıcının okunmamış mesaj ve bildirim toplamını hesaplayıp
 * Android uygulama ikonundaki ve PWA'daki rozet sayısını günceller.
 */
export const syncAppBadge = async (userId) => {
    if (!userId) {
        lastUnreadTotal = 0;
        await clearAppBadge();
        return 0;
    }

    try {
        // 1. Okunmamış mesaj sayısını sorgula
        const { count: unreadMessages, error: msgErr } = await supabase
            .from('messages')
            .select('*', { count: 'exact', head: true })
            .eq('receiver_id', userId)
            .eq('read', false)
            .eq('deleted_by_receiver', false);

        if (msgErr) console.warn('[BadgeSync] Mesaj sayısı hatası:', msgErr.message);

        // 2. Okunmamış bildirim sayısını sorgula
        let unreadNotifs = 0;
        try {
            const { count: notifCount, error: notifErr } = await supabase
                .from('notifications')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', userId)
                .eq('read', false);

            if (!notifErr && typeof notifCount === 'number') {
                unreadNotifs = notifCount;
            }
        } catch (_) {}

        const total = (unreadMessages || 0) + (unreadNotifs || 0);
        lastUnreadTotal = total;

        await setAppBadge(total);
        return total;
    } catch (error) {
        console.warn('[BadgeSync] Senkronizasyon hatası:', error);
        return lastUnreadTotal;
    }
};

/**
 * Kullanıcı oturum açtığında gerçek zamanlı (Realtime) rozet dinleyicisini başlatır.
 * Yeni bir mesaj veya bildirim geldiğinde Android uygulama ikonu anında güncellenir.
 */
export const startBadgeRealtimeSync = (user) => {
    if (!user || !user.id) {
        stopBadgeRealtimeSync();
        return;
    }

    // İlk senkronizasyon
    syncAppBadge(user.id);

    // Varsa eski aboneliği temizle
    stopBadgeRealtimeSync();

    // 1. Supabase Realtime - Mesajlar ve Bildirimler Dinleyicisi
    activeSubscription = supabase
        .channel(`badge-sync-${user.id}`)
        .on(
            'postgres_changes',
            {
                event: '*',
                schema: 'public',
                table: 'messages',
                filter: `receiver_id=eq.${user.id}`
            },
            () => {
                syncAppBadge(user.id);
            }
        )
        .on(
            'postgres_changes',
            {
                event: '*',
                schema: 'public',
                table: 'notifications',
                filter: `user_id=eq.${user.id}`
            },
            () => {
                syncAppBadge(user.id);
            }
        )
        .subscribe();

    // 2. Periyodik kontrol (her 60 saniyede bir)
    const intervalId = setInterval(() => {
        syncAppBadge(user.id);
    }, 60000);

    // 3. Uygulama arka plandan ön plana geldiğinde anında güncelle
    listenAppState((isActive) => {
        if (isActive) {
            syncAppBadge(user.id);
        }
    });

    return () => {
        clearInterval(intervalId);
        stopBadgeRealtimeSync();
    };
};

export const stopBadgeRealtimeSync = () => {
    if (activeSubscription) {
        supabase.removeChannel(activeSubscription);
        activeSubscription = null;
    }
};

