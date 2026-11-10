/**
 * ExVitrin Capacitor Native Bridge
 * Web ve Native Android arasında köprü görevi görür.
 * 
 * Kullanımı:
 *   import { isNative, initPushNotifications, nativeShare } from "./utils/capacitorBridge";
 */

export const isNative = () => {
  return typeof window !== "undefined" && window.Capacitor !== undefined && window.Capacitor.isNativePlatform();
};

export const isAndroid = () => {
  return isNative() && window.Capacitor?.getPlatform() === "android";
};

export const isIOS = () => {
  return isNative() && window.Capacitor?.getPlatform() === "ios";
};

export const getPlatform = () => {
  if (typeof window !== "undefined" && window.Capacitor?.getPlatform) {
    return window.Capacitor.getPlatform();
  }
  return "web";
};

// PUSH BİLDİRİMLER (Google Firebase FCM & Apple APNs)
let PushNotificationsInstance = null;

export const initPushNotifications = async (onToken, onNotification) => {
  if (!isNative()) {
    console.log("[Bridge] Push notifications sadece native iOS/Android ortamında çalışır.");
    return;
  }

  try {
    const { PushNotifications } = await import("@capacitor/push-notifications");
    PushNotificationsInstance = PushNotifications;

    // 1. ÖNCE Dinleyicileri ekle (iOS'ta register çağrılınca listener hazır olmalı!)
    await PushNotifications.removeAllListeners().catch(() => {});

    await PushNotifications.addListener("registration", (token) => {
      console.log("[Bridge] Push token başarıyla alındı:", token.value);
      if (onToken) onToken(token.value);
    });

    await PushNotifications.addListener("registrationError", (err) => {
      console.error("[Bridge] Push registration error:", JSON.stringify(err));
    });

    await PushNotifications.addListener("pushNotificationReceived", (notification) => {
      console.log("[Bridge] Bildirim alındı:", notification);
      if (onNotification) onNotification(notification);
    });

    await PushNotifications.addListener("pushNotificationActionPerformed", (action) => {
      console.log("[Bridge] Bildirime tıklandı:", action.notification);
      if (onNotification) onNotification(action.notification, true);
    });

    // 2. İzinleri kontrol et ve iste
    let permStatus = await PushNotifications.checkPermissions();

    if (permStatus.receive === "prompt") {
      permStatus = await PushNotifications.requestPermissions();
    }

    if (permStatus.receive !== "granted") {
      console.warn("[Bridge] Push bildirim izni verilmedi.");
      return;
    }

    // 3. Apple APNs / Google FCM servisine kaydol
    await PushNotifications.register();
  } catch (error) {
    console.error("[Bridge] Push notifications yüklenemedi:", error);
  }
};

export const removePushListeners = async () => {
  if (PushNotificationsInstance) {
    try {
      await PushNotificationsInstance.removeAllListeners();
    } catch (_) {}
  }
};

// NATIVE PAYLAŞIM
export const nativeShare = async ({ title, text, url }) => {
  if (isNative()) {
    try {
      const { Share } = await import("@capacitor/share");
      await Share.share({ title, text, url, dialogTitle: "ExVitrin\x27de Paylaş" });
      return true;
    } catch (error) {
      if (error && error.message !== "Share canceled") {
        console.error("[Bridge] Native share hatası:", error);
      }
      return false;
    }
  }

  if (typeof navigator !== "undefined" && navigator.share) {
    try {
      await navigator.share({ title, text, url });
      return true;
    } catch {
      return false;
    }
  }

  try {
    await navigator.clipboard.writeText(url);
    return true;
  } catch {
    return false;
  }
};

// APP STATE
let appStateListener = null;

export const listenAppState = async (onChange) => {
  if (!isNative()) return;

  try {
    const { App } = await import("@capacitor/app");
    appStateListener = App.addListener("appStateChange", ({ isActive }) => {
      console.log("[Bridge] App state:", isActive ? "foreground" : "background");
      if (onChange) onChange(isActive);
    });
  } catch (error) {
    console.error("[Bridge] App state listener hatası:", error);
  }
};

export const removeAppStateListener = () => {
  if (appStateListener) {
    appStateListener.remove();
    appStateListener = null;
  }
};

// STATUS BAR
export const setStatusBar = async (backgroundColor = "#EF4444", style = "LIGHT") => {
  if (!isNative()) return;

  try {
    const { StatusBar, Style } = await import("@capacitor/status-bar");
    await StatusBar.setBackgroundColor({ color: backgroundColor });
    await StatusBar.setStyle({ style: Style[style] });
  } catch (error) {
    console.error("[Bridge] StatusBar hatası:", error);
  }
};

// APP ICON BADGE (Uygulama İkonu Rozet Sayısı - iOS, Android & PWA)
let BadgePluginInstance = null;

const getBadgePlugin = async () => {
  if (BadgePluginInstance) return BadgePluginInstance;
  if (isNative()) {
    try {
      const { Badge } = await import("@capawesome/capacitor-badge");
      BadgePluginInstance = Badge;
      return BadgePluginInstance;
    } catch (e) {
      console.warn("[Bridge] Native Badge plugin bulunamadı:", e);
    }
  }
  return null;
};

/**
 * iOS & Android ana ekranındaki ve PWA ikonundaki okunmamış mesaj/bildirim sayısını günceller.
 * @param {number} count - Okunmamış mesaj veya bildirim sayısı
 */
export const setAppBadge = async (count) => {
  const num = Math.max(0, parseInt(count, 10) || 0);

  // 1. Native iOS & Android Badge (@capawesome/capacitor-badge)
  if (isNative()) {
    try {
      if (num === 0) {
        try {
          const { PushNotifications } = await import("@capacitor/push-notifications");
          await PushNotifications.removeAllDeliveredNotifications().catch(() => {});
        } catch (_) {}
      }

      const Badge = await getBadgePlugin();
      if (Badge) {
        if (num === 0) {
          await Badge.clear().catch(() => {});
        } else {
          // iOS için rozet gösterme iznini kontrol et ve gerekirse iste
          try {
            const perm = await Badge.checkPermissions();
            if (perm.display !== 'granted') {
              await Badge.requestPermissions();
            }
          } catch (_) {}

          await Badge.set({ count: num }).catch(() => {});
        }
        return true;
      }
    } catch (e) {
      console.warn("[Bridge] Native Badge güncellenemedi:", e);
    }
  }

  // 2. Standart Web / PWA App Badge API (Android Chrome, Edge, Safari vb.)
  if (typeof navigator !== "undefined") {
    try {
      if (num === 0 && typeof navigator.clearAppBadge === "function") {
        await navigator.clearAppBadge();
        return true;
      } else if (num > 0 && typeof navigator.setAppBadge === "function") {
        await navigator.setAppBadge(num);
        return true;
      }
    } catch (_) {}
  }

  return false;
};

/**
 * Uygulama ikonundaki rozet sayısını temizler.
 */
export const clearAppBadge = async () => {
  return setAppBadge(0);
};
