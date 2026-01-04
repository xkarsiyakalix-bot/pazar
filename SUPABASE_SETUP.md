# Supabase Database Kurulum Talimatları

## Adım 1: SQL Şemasını Çalıştırın

1. Supabase Dashboard'a gidin: https://supabase.com/dashboard
2. Projenizi seçin (kleinanzeigen)
3. Sol menüden **SQL Editor**'ü açın
4. "New query" butonuna tıklayın
5. `supabase-schema.sql` dosyasının içeriğini kopyalayıp yapıştırın
6. "Run" butonuna tıklayın

## Adım 2: Storage Bucket'ı Oluşturun

1. Sol menüden **Storage** bölümüne gidin
2. "Create a new bucket" butonuna tıklayın
3. Bucket adı: `listing-images`
4. **Public bucket** seçeneğini işaretleyin
5. "Create bucket" tıklayın

## Adım 3: Doğrulama

SQL Editor'de aşağıdaki sorguyu çalıştırarak tabloların oluşturulduğunu doğrulayın:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';
```

Şu tabloları görmelisiniz:
- profiles
- categories
- listings
- favorites
- messages

## Sonraki Adımlar

Database kurulumu tamamlandıktan sonra:
1. Frontend sunucusunu yeniden başlatın (`.env` değişiklikleri için)
2. Login/Register sayfaları Supabase Auth ile çalışacak
3. İlanlar Supabase database'den gelecek
