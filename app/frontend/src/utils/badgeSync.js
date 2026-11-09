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

        // Kleinanzeigen gibi ana simge sayacı okunmamış mesaj sayısıdır.
        // Bildirimler tablosundaki eski birikmelerin mesaj sayısını bozmasını önlüyoruz.
        const total = Math.max(0, unreadMessages || 0);
        lastUnreadTotal = total;

        // Kullanıcı tercihi doğrultusunda ana ekran uygulama ikonu (app logosu)
        // üzerinde sayı rozeti çıkmaması için rozeti her zaman temizliyoruz.
        await clearAppBadge();
        return Math.max(0, unreadMessages || 0);
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

    // 3. Uygulama durumu değiştiğinde (ön plan veya arka plan) anında güncelle
    listenAppState((_isActive) => {
        syncAppBadge(user.id);
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

