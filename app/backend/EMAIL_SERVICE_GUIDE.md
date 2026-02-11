# ExVitrin Email Service - Kullanım Kılavuzu

## 🚀 Hızlı Başlangıç

### 1. Resend API Key'inizi Ekleyin

`.env` dosyasını düzenleyin:

```bash
RESEND_API_KEY=re_your_actual_api_key_here
FRONTEND_URL=http://localhost:3000  # Production'da: https://exvitrin.com
```

### 2. Resend'de Domain Doğrulama

1. [Resend Dashboard](https://resend.com/domains) > Domains
2. "Add Domain" tıklayın
3. Domain'inizi ekleyin (örn: `exvitrin.com`)
4. DNS kayıtlarını ekleyin:

```
# SPF Record
Type: TXT
Name: @
Value: v=spf1 include:_spf.resend.com ~all

# DKIM Record (Resend'den alacaksınız)
Type: TXT
Name: resend._domainkey
Value: (Resend'den kopyalayın)

# DMARC Record
Type: TXT
Name: _dmarc
Value: v=DMARC1; p=none; rua=mailto:dmarc@exvitrin.com
```

5. Doğrulamayı bekleyin (~1-24 saat)

### 3. From Email Adresini Güncelleyin

`email_service.py` dosyasında:

```python
self.from_email = 'ExVitrin <noreply@exvitrin.com>'  # Domain'inizi kullanın
```

## 📧 Kullanım Örnekleri

### Hoş Geldiniz E-postası

```python
from email_service import email_service

# Yeni kullanıcı kaydında
result = email_service.send_welcome_email(
    user_email="user@example.com",
    username="Ahmet Yılmaz"
)

if result['success']:
    print("Email sent successfully!")
else:
    print(f"Email failed: {result['error']}")
```

### İlan Yayınlandı E-postası

```python
# İlan oluşturulduktan sonra
result = email_service.send_listing_published_email(
    user_email="user@example.com",
    username="Ahmet Yılmaz",
    listing_title="2018 BMW 3 Serisi",
    listing_url="https://exvitrin.com/product/123",
    listing_image="https://exvitrin.com/images/listing-123.jpg",
    price="450.000",
    category="Otomobiller"
)
```

### Şifre Sıfırlama E-postası

```python
# Şifre sıfırlama talebinde
import secrets

reset_token = secrets.token_urlsafe(32)

result = email_service.send_password_reset_email(
    user_email="user@example.com",
    username="Ahmet Yılmaz",
    reset_token=reset_token
)

# Token'ı veritabanına kaydedin (1 saat geçerli)
```

### Mesaj Bildirimi E-postası

```python
# Yeni mesaj geldiğinde
result = email_service.send_message_notification_email(
    user_email="user@example.com",
    username="Ahmet Yılmaz",
    sender_name="Mehmet Demir",
    message_preview="Merhaba, ürününüz hala satılık mı?",
    conversation_url="https://exvitrin.com/messages/456"
)
```

## 🔧 Backend Entegrasyonu

### Supabase Server'a Ekleme

`supabase_server.py` dosyanıza ekleyin:

```python
from email_service import email_service

# Kullanıcı kaydı endpoint'inde
@app.route('/api/auth/register', methods=['POST'])
def register():
    # ... kullanıcı oluşturma kodu ...
    
    # Hoş geldiniz e-postası gönder
    email_service.send_welcome_email(
        user_email=user_data['email'],
        username=user_data['full_name']
    )
    
    return jsonify({'success': True})

# İlan oluşturma endpoint'inde
@app.route('/api/listings', methods=['POST'])
def create_listing():
    # ... ilan oluşturma kodu ...
    
    # İlan yayınlandı e-postası gönder
    email_service.send_listing_published_email(
        user_email=user['email'],
        username=user['full_name'],
        listing_title=listing['title'],
        listing_url=f"{os.getenv('FRONTEND_URL')}/product/{listing['id']}",
        listing_image=listing['images'][0] if listing.get('images') else None,
        price=str(listing['price']),
        category=listing['category']
    )
    
    return jsonify({'success': True})
```

## 📊 E-posta Metrikleri

Resend Dashboard'dan takip edin:
- ✉️ Gönderim sayısı
- ✅ Teslim oranı
- 📖 Açılma oranı
- 🖱️ Tıklama oranı
- ⚠️ Bounce oranı

## 🧪 Test Etme

### 1. Test E-postası Gönder

```python
# Test script oluşturun: test_email.py
from email_service import email_service

result = email_service.send_welcome_email(
    user_email="your-email@gmail.com",
    username="Test User"
)

print(result)
```

```bash
cd app/backend
source venv/bin/activate
python test_email.py
```

### 2. Resend Dashboard'da Kontrol

1. [Resend Dashboard](https://resend.com/emails)
2. "Emails" sekmesinde gönderilen e-postaları görün
3. Detayları ve metrikleri inceleyin

## ⚠️ Önemli Notlar

1. **API Limitleri:**
   - Free Plan: 3,000 email/ay, 100 email/gün
   - Pro Plan: 50,000 email/ay, sınırsız günlük

2. **Domain Doğrulama:**
   - Domain doğrulanmadan önce sadece kendi e-postanıza gönderebilirsiniz
   - Production'da mutlaka domain doğrulayın

3. **Spam Önleme:**
   - SPF, DKIM, DMARC kayıtlarını ekleyin
   - "From" adresini doğrulanmış domain'den kullanın
   - Unsubscribe linki ekleyin (ileride)

4. **Hata Yönetimi:**
   - Her email gönderiminde result'ı kontrol edin
   - Hataları loglayın
   - Kullanıcıya bilgi verin

## 🔐 Güvenlik

- `.env` dosyasını `.gitignore`'a ekleyin
- API key'i asla commit etmeyin
- Production'da environment variables kullanın

## 📞 Destek

- Resend Docs: https://resend.com/docs
- ExVitrin Support: support@exvitrin.com

---

**Hazır! 🎉 Artık profesyonel e-postalar gönderebilirsiniz.**
