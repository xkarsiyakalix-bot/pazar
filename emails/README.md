# ExVitrin E-posta Şablonları 📧

Bu klasör, ExVitrin için hazırlanmış profesyonel e-posta şablonlarını içerir.

## 📋 Hazır Şablonlar

### 1. **welcome.tsx** - Hoş Geldiniz E-postası
- Yeni kullanıcı kaydında gönderilir
- ExVitrin özelliklerini tanıtır
- İlk ilan verme CTA'sı içerir

### 2. **listing-published.tsx** - İlan Yayınlandı
- İlan başarıyla yayınlandığında gönderilir
- İlan önizlemesi gösterir
- Premium paket önerileri içerir

### 3. **password-reset.tsx** - Şifre Sıfırlama
- Şifre sıfırlama talebinde gönderilir
- Güvenlik uyarıları içerir
- 1 saatlik geçerlilik süresi

## 🚀 Kurulum

```bash
cd emails
npm install
```

## 🎨 Geliştirme

E-posta şablonlarını önizlemek için:

```bash
npm run dev
```

Bu komut `http://localhost:3000` adresinde bir önizleme sunucusu başlatır.

## 📤 Resend ile Kullanım

### 1. Resend API Key Alın
1. [resend.com](https://resend.com) hesabı oluşturun
2. API Keys bölümünden yeni bir key oluşturun
3. `.env` dosyanıza ekleyin:

```env
RESEND_API_KEY=re_xxxxxxxxxxxxx
```

### 2. Domain Doğrulama
1. Resend Dashboard > Domains
2. Domain ekleyin (örn: exvitrin.com)
3. DNS kayıtlarını ekleyin (SPF, DKIM, DMARC)
4. Doğrulamayı bekleyin (~24 saat)

### 3. Backend Entegrasyonu

```javascript
// app/backend/email-service.js
const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

// Hoş geldiniz e-postası gönder
async function sendWelcomeEmail(userEmail, username) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'ExVitrin <noreply@exvitrin.com>',
      to: [userEmail],
      subject: 'ExVitrin\'e Hoş Geldiniz! 🎉',
      react: WelcomeEmail({ username, userEmail }),
    });

    if (error) {
      console.error('Email error:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Email send failed:', error);
    return { success: false, error };
  }
}

// İlan yayınlandı e-postası
async function sendListingPublishedEmail(userEmail, listingData) {
  const { data, error } = await resend.emails.send({
    from: 'ExVitrin <noreply@exvitrin.com>',
    to: [userEmail],
    subject: 'İlanınız Yayında! 🎉',
    react: ListingPublishedEmail({
      username: listingData.username,
      listingTitle: listingData.title,
      listingUrl: `https://exvitrin.com/product/${listingData.id}`,
      listingImage: listingData.images[0],
      price: listingData.price,
      category: listingData.category,
    }),
  });

  return { data, error };
}

// Şifre sıfırlama e-postası
async function sendPasswordResetEmail(userEmail, username, resetToken) {
  const resetUrl = `https://exvitrin.com/reset-password?token=${resetToken}`;
  
  const { data, error } = await resend.emails.send({
    from: 'ExVitrin <noreply@exvitrin.com>',
    to: [userEmail],
    subject: 'Şifre Sıfırlama Talebi',
    react: PasswordResetEmail({ username, resetUrl }),
  });

  return { data, error };
}

module.exports = {
  sendWelcomeEmail,
  sendListingPublishedEmail,
  sendPasswordResetEmail,
};
```

## 🎨 Tasarım Özellikleri

✅ **Responsive Design** - Tüm cihazlarda mükemmel görünüm
✅ **Dark Mode Uyumlu** - Otomatik tema desteği
✅ **Marka Renkleri** - ExVitrin kırmızısı (#dc2626)
✅ **Modern Tipografi** - System font stack
✅ **Emoji Desteği** - Görsel zenginlik
✅ **CTA Butonları** - Yüksek dönüşüm odaklı
✅ **Footer Links** - Yasal ve yardım linkleri

## 📊 E-posta Metrikleri

Resend Dashboard'dan takip edebileceğiniz metrikler:
- ✉️ Gönderim sayısı
- ✅ Teslim oranı
- 📖 Açılma oranı
- 🖱️ Tıklama oranı
- ⚠️ Bounce oranı
- 🚫 Spam şikayetleri

## 🔧 Özelleştirme

Her şablon için props'ları düzenleyerek içeriği özelleştirebilirsiniz:

```typescript
// welcome.tsx
interface WelcomeEmailProps {
  username?: string;
  userEmail?: string;
}

// listing-published.tsx
interface ListingPublishedEmailProps {
  username?: string;
  listingTitle?: string;
  listingUrl?: string;
  listingImage?: string;
  price?: string;
  category?: string;
}

// password-reset.tsx
interface PasswordResetEmailProps {
  username?: string;
  resetUrl?: string;
}
```

## 🌐 Logo ve Görseller

Logo dosyanızı `app/frontend/public/logo.png` konumuna yerleştirin.

Önerilen boyutlar:
- **Logo:** 300x100px (PNG, şeffaf arka plan)
- **İlan Görselleri:** 600x400px minimum
- **Dosya Boyutu:** Max 1MB

## 📝 Ek Şablonlar (Gelecek)

- [ ] Mesaj bildirimi
- [ ] Favori ilan güncellendi
- [ ] Ödeme onayı
- [ ] Premium paket aktivasyonu
- [ ] İlan süresi dolmak üzere
- [ ] Haftalık özet

## 🆘 Sorun Giderme

### E-postalar spam'e düşüyor
- SPF, DKIM, DMARC kayıtlarını kontrol edin
- Domain doğrulamasının tamamlandığından emin olun
- "From" adresinin doğrulanmış domain'den olduğunu kontrol edin

### Görseller görünmüyor
- Görsellerin public URL'lerini kullanın
- HTTPS kullanın
- Görsel boyutlarını optimize edin

### Stil sorunları
- Inline CSS kullanın (React Email otomatik yapar)
- E-posta istemcileri CSS desteği sınırlıdır
- Test için [Litmus](https://litmus.com) veya [Email on Acid](https://www.emailonacid.com) kullanın

## 📞 Destek

Sorularınız için:
- 📧 Email: support@exvitrin.com
- 📚 Resend Docs: https://resend.com/docs
- 🎨 React Email: https://react.email

---

**© 2026 ExVitrin - Tüm hakları saklıdır**
