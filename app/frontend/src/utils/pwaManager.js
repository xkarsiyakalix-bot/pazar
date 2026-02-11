/**
 * PWA Service Worker Registration and Push Notification Manager
 */

class PWAManager {
    constructor() {
        this.registration = null;
        this.subscription = null;
    }

    /**
     * Initialize PWA features
     */
    async init() {
        if (!('serviceWorker' in navigator)) {
            console.warn('Service Workers not supported');
            return false;
        }

        try {
            // Register service worker
            this.registration = await navigator.serviceWorker.register('/service-worker.js', {
                scope: '/'
            });

            console.log('✅ Service Worker registered:', this.registration);

            // Handle updates
            this.registration.addEventListener('updatefound', () => {
                const newWorker = this.registration.installing;
                console.log('🔄 New Service Worker installing...');

                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        // New service worker available, prompt user to refresh
                        this.showUpdateNotification();
                    }
                });
            });

            // Check for updates periodically
            setInterval(() => {
                this.registration.update();
            }, 60 * 60 * 1000); // Check every hour

            return true;
        } catch (error) {
            console.error('❌ Service Worker registration failed:', error);
            return false;
        }
    }

    /**
     * Show update notification
     */
    /**
     * Show update notification
     */
    showUpdateNotification() {
        // Silent update - let the user refresh naturally
        console.log('🔄 New content is available; please refresh.');

        // Optionally dispatch an event if you want to show a non-blocking toast UI
        // window.dispatchEvent(new CustomEvent('pwa-update-available'));
    }

    /**
     * Request notification permission
     */
    async requestNotificationPermission() {
        if (!('Notification' in window)) {
            console.warn('Notifications not supported');
            return false;
        }

        if (Notification.permission === 'granted') {
            return true;
        }

        if (Notification.permission === 'denied') {
            console.warn('Notification permission denied');
            return false;
        }

        const permission = await Notification.requestPermission();
        return permission === 'granted';
    }

    /**
     * Subscribe to push notifications
     */
    async subscribeToPushNotifications(userId) {
        if (!this.registration) {
            console.error('Service Worker not registered');
            return null;
        }

        try {
            // Request permission first
            const hasPermission = await this.requestNotificationPermission();
            if (!hasPermission) {
                console.warn('Notification permission not granted');
                return null;
            }

            // Check if already subscribed
            let subscription = await this.registration.pushManager.getSubscription();

            if (!subscription) {
                // Subscribe to push notifications
                // You'll need to generate VAPID keys for production
                // Use: npx web-push generate-vapid-keys
                const vapidPublicKey = process.env.REACT_APP_VAPID_PUBLIC_KEY ||
                    'BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U';

                subscription = await this.registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: this.urlBase64ToUint8Array(vapidPublicKey)
                });

                console.log('✅ Push subscription created:', subscription);
            }

            // Save subscription to backend
            await this.saveSubscription(subscription, userId);
            this.subscription = subscription;

            return subscription;
        } catch (error) {
            console.error('❌ Push subscription failed:', error);
            return null;
        }
    }

    /**
     * Unsubscribe from push notifications
     */
    async unsubscribeFromPushNotifications(userId) {
        if (!this.subscription) {
            const subscription = await this.registration?.pushManager.getSubscription();
            if (!subscription) return true;
            this.subscription = subscription;
        }

        try {
            await this.deleteSubscription(userId);
            await this.subscription.unsubscribe();
            this.subscription = null;
            console.log('✅ Unsubscribed from push notifications');
            return true;
        } catch (error) {
            console.error('❌ Unsubscribe failed:', error);
            return false;
        }
    }

    /**
     * Save subscription to backend
     */
    async saveSubscription(subscription, userId) {
        try {
            const response = await fetch('/api/push-subscription', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId,
                    subscription: subscription.toJSON()
                })
            });

            if (!response.ok) {
                throw new Error('Failed to save subscription');
            }

            console.log('✅ Subscription saved to backend');
        } catch (error) {
            console.error('❌ Failed to save subscription:', error);
        }
    }

    /**
     * Delete subscription from backend
     */
    async deleteSubscription(userId) {
        try {
            const response = await fetch(`/api/push-subscription/${userId}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Failed to delete subscription');
            }

            console.log('✅ Subscription deleted from backend');
        } catch (error) {
            console.error('❌ Failed to delete subscription:', error);
        }
    }

    /**
     * Show local notification (for testing)
     */
    async showNotification(title, options = {}) {
        if (!this.registration) {
            console.error('Service Worker not registered');
            return;
        }

        const hasPermission = await this.requestNotificationPermission();
        if (!hasPermission) return;

        const defaultOptions = {
            body: 'ExVitrin bildirimi',
            icon: '/logo_exvitrin_2026_cropped.png',
            badge: '/logo_exvitrin_2026_cropped.png',
            vibrate: [200, 100, 200],
            tag: 'exvitrin-notification',
            requireInteraction: false,
            ...options
        };

        await this.registration.showNotification(title, defaultOptions);
    }

    /**
     * Check if app is installed (PWA)
     */
    isInstalled() {
        return window.matchMedia('(display-mode: standalone)').matches ||
            window.navigator.standalone === true;
    }

    /**
     * Prompt to install PWA
     */
    async promptInstall() {
        if (this.deferredPrompt) {
            this.deferredPrompt.prompt();
            const { outcome } = await this.deferredPrompt.userChoice;
            console.log(`User response to install prompt: ${outcome}`);
            this.deferredPrompt = null;
            return outcome === 'accepted';
        }
        return false;
    }

    /**
     * Listen for install prompt
     */
    listenForInstallPrompt() {
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.deferredPrompt = e;
            console.log('💾 Install prompt available');

            // Show custom install button/banner
            this.showInstallBanner();
        });

        window.addEventListener('appinstalled', () => {
            console.log('✅ PWA installed');
            this.deferredPrompt = null;
            this.hideInstallBanner();
        });
    }

    /**
     * Show install banner
     */
    showInstallBanner() {
        const event = new CustomEvent('pwa-install-available');
        window.dispatchEvent(event);
    }

    /**
     * Hide install banner
     */
    hideInstallBanner() {
        const event = new CustomEvent('pwa-install-completed');
        window.dispatchEvent(event);
    }

    /**
     * Convert VAPID key
     */
    urlBase64ToUint8Array(base64String) {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
            .replace(/\-/g, '+')
            .replace(/_/g, '/');

        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);

        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }

    /**
     * Register background sync
     */
    async registerBackgroundSync(tag) {
        if (!this.registration) return false;

        if ('sync' in this.registration) {
            try {
                await this.registration.sync.register(tag);
                console.log(`✅ Background sync registered: ${tag}`);
                return true;
            } catch (error) {
                console.error('❌ Background sync registration failed:', error);
                return false;
            }
        }
        return false;
    }

    /**
     * Register periodic background sync
     */
    async registerPeriodicSync(tag, minInterval = 24 * 60 * 60 * 1000) {
        if (!this.registration) return false;

        if ('periodicSync' in this.registration) {
            try {
                const status = await navigator.permissions.query({
                    name: 'periodic-background-sync'
                });

                if (status.state === 'granted') {
                    await this.registration.periodicSync.register(tag, {
                        minInterval
                    });
                    console.log(`✅ Periodic sync registered: ${tag}`);
                    return true;
                }
            } catch (error) {
                console.error('❌ Periodic sync registration failed:', error);
                return false;
            }
        }
        return false;
    }
}

// Create singleton instance
const pwaManager = new PWAManager();

export default pwaManager;
