# PWA (Progressive Web App) Dokümantasyonu

ExVitrin artık tam özellikli bir Progressive Web App (PWA) olarak çalışmaktadır. Bu, kullanıcıların siteyi mobil cihazlarına uygulama gibi yükleyebilmesini ve offline çalışma, push notification gibi özelliklere erişebilmesini sağlar.

## 🚀 Özellikler

### 1. **Ana Ekrana Ekleme**
- Kullanıcılar ExVitrin'i mobil cihazlarının ana ekranına ekleyebilir
- Uygulama simgesi ile hızlı erişim
- Tarayıcı çubuğu olmadan tam ekran deneyim
- Native app görünümü

### 2. **Offline Çalışma**
- Service Worker ile önbellekleme
- İnternet bağlantısı olmadan temel sayfalara erişim
- Otomatik senkronizasyon (internet bağlantısı geldiğinde)
- Hızlı sayfa yüklemeleri

### 3. **Push Notifications**
- Yeni mesaj bildirimleri
- İlan güncellemeleri
- Favori ilanlar için bildirimler
- Tarayıcı kapalıyken bile bildirim alabilme

### 4. **App Shortcuts**
Uygulama simgesine uzun basıldığında hızlı erişim menüsü:
- İlan Ver
- Mesajlar
- Favoriler
- Aramalar

### 5. **Share Target**
- Diğer uygulamalardan ExVitrin'e içerik paylaşma
- Resim paylaşma desteği
- Hızlı ilan oluşturma

## 📱 Kullanım

### Kullanıcı Tarafı

#### Ana Ekrana Ekleme (iOS)
1. Safari'de ExVitrin'i açın
2. Paylaş butonuna tıklayın
3. "Ana Ekrana Ekle" seçeneğini seçin
4. "Ekle" butonuna tıklayın

#### Ana Ekrana Ekleme (Android)
1. Chrome'da ExVitrin'i açın
2. Menü butonuna (⋮) tıklayın
3. "Ana ekrana ekle" seçeneğini seçin
4. "Ekle" butonuna tıklayın

**VEYA**

- ExVitrin'i ziyaret ettiğinizde otomatik olarak çıkan install banner'ından "Yükle" butonuna tıklayın

#### Bildirimleri Etkinleştirme
1. Giriş yapın
2. Tarayıcı bildirim izni istediğinde "İzin Ver" seçeneğini seçin
3. Artık yeni mesajlar ve güncellemeler için bildirim alacaksınız

### Geliştirici Tarafı

#### Service Worker
Service Worker otomatik olarak kayıt edilir ve şu özellikleri sağlar:
- Static asset caching
- Runtime caching
- Offline fallback
- Background sync
- Push notifications

#### PWA Manager Kullanımı

```javascript
import pwaManager from './utils/pwaManager';

// Service Worker'ı başlat
await pwaManager.init();

// Push notification'ları etkinleştir
await pwaManager.subscribeToPushNotifications(userId);

// Install prompt'u göster
await pwaManager.promptInstall();

// Bildirim gönder (test için)
await pwaManager.showNotification('Başlık', {
  body: 'Mesaj içeriği',
  icon: '/logo.png',
  data: { url: '/messages' }
});

// Background sync kaydet
await pwaManager.registerBackgroundSync('sync-messages');

// Periodic sync kaydet (her 15 dakikada)
await pwaManager.registerPeriodicSync('check-new-messages', 15 * 60 * 1000);
```

## 🔧 Teknik Detaylar

### Dosya Yapısı

```
app/frontend/
├── public/
│   ├── service-worker.js          # Service Worker
│   ├── manifest.json               # PWA Manifest
│   └── logo_exvitrin_2026_cropped.png
├── src/
│   ├── utils/
│   │   └── pwaManager.js          # PWA Manager Class
│   ├── components/
│   │   └── PWAInstallBanner.js    # Install Banner Component
│   └── App.js                      # PWA Initialization
```

### Service Worker Stratejileri

**Precaching (Install)**
- index.html
- CSS ve JS dosyaları
- Logo ve manifest

**Runtime Caching (Fetch)**
- Network First stratejisi
- Başarılı response'lar cache'lenir
- Network başarısız olursa cache'den serve edilir

**Background Sync**
- Offline mesaj gönderme
- Otomatik senkronizasyon

**Periodic Sync**
- Yeni mesaj kontrolü (her 15 dakika)
- Arka planda güncelleme

### Push Notification Yapısı

#### Backend (Supabase Edge Function gerekli)

```javascript
// /api/push-subscription endpoint
POST /api/push-subscription
{
  "userId": "user-id",
  "subscription": {
    "endpoint": "...",
    "keys": {
      "p256dh": "...",
      "auth": "..."
    }
  }
}

// Bildirim gönderme
POST /api/send-notification
{
  "userId": "user-id",
  "title": "Yeni Mesaj",
  "body": "Ahmet size mesaj gönderdi",
  "data": {
    "url": "/messages/123"
  }
}
```

#### VAPID Keys

Production için VAPID keys oluşturun:

```bash
npx web-push generate-vapid-keys
```

Oluşturulan public key'i `.env` dosyasına ekleyin:

```env
REACT_APP_VAPID_PUBLIC_KEY=your-public-key-here
```

### Manifest.json Özellikleri

```json
{
  "name": "ExVitrin",
  "short_name": "ExVitrin",
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#EF4444",
  "background_color": "#FFFFFF",
  "icons": [...],
  "shortcuts": [...],
  "share_target": {...}
}
```

## 🎯 Best Practices

### 1. **Performans**
- Service Worker cache stratejileri optimize edilmiş
- Static assets precache edilmiş
- Runtime cache boyutu kontrol altında

### 2. **Güvenlik**
- HTTPS zorunlu (PWA için)
- VAPID keys güvenli saklanmalı
- Subscription endpoint'leri korunmalı

### 3. **Kullanıcı Deneyimi**
- Install banner zamanlaması optimize edilmiş
- Bildirim izni uygun zamanda isteniyor
- Offline fallback sayfası kullanıcı dostu

### 4. **Testing**
```bash
# Lighthouse PWA audit
npm run build
npx serve -s build
# Chrome DevTools > Lighthouse > PWA
```

## 📊 PWA Checklist

- ✅ HTTPS üzerinden servis ediliyor
- ✅ Responsive design
- ✅ Manifest.json mevcut
- ✅ Service Worker kayıtlı
- ✅ Offline çalışma
- ✅ Ana ekrana eklenebilir
- ✅ App icons (192x192, 512x512)
- ✅ Theme color
- ✅ Start URL
- ✅ Display mode: standalone
- ✅ Push notifications
- ✅ Background sync
- ✅ App shortcuts

## 🔄 Güncelleme Stratejisi

Service Worker güncellemeleri:
1. Yeni version deploy edildiğinde
2. Service Worker otomatik güncellenir
3. Kullanıcıya refresh prompt gösterilir
4. Kullanıcı onayladığında sayfa yenilenir

```javascript
// Service Worker update check (her saat)
setInterval(() => {
  registration.update();
}, 60 * 60 * 1000);
```

## 🐛 Troubleshooting

### Service Worker kayıt olmuyor
- HTTPS kontrolü yapın
- Console'da hata mesajlarını kontrol edin
- `/service-worker.js` dosyasının erişilebilir olduğunu kontrol edin

### Push notifications çalışmıyor
- Bildirim izni verildiğini kontrol edin
- VAPID keys doğru mu kontrol edin
- Backend endpoint'leri çalışıyor mu kontrol edin

### Offline çalışmıyor
- Service Worker aktif mi kontrol edin
- Cache stratejisi doğru mu kontrol edin
- Network tab'dan cache'i kontrol edin

## 📚 Kaynaklar

- [MDN PWA Guide](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [Web.dev PWA](https://web.dev/progressive-web-apps/)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Push API](https://developer.mozilla.org/en-US/docs/Web/API/Push_API)
- [Web App Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest)

## 🎉 Sonuç

ExVitrin artık tam özellikli bir PWA! Kullanıcılar:
- ✨ Uygulamayı ana ekrana ekleyebilir
- 📱 Offline kullanabilir
- 🔔 Push notification alabilir
- ⚡ Hızlı ve responsive deneyim yaşar
- 🚀 Native app gibi kullanabilir
