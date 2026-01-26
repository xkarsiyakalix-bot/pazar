/*
ADMIN FATURA GÖNDERİMİ - SUPABASE KURULUM TALİMATLARI

Fatura gönderme işleminin çalışması için Supabase Dashboard üzerinden şu adımları yapmalısınız:

1. Adım: Fonksiyonu Oluşturma
---------------------------
1. Supabase Dashboard -> Edge Functions -> "Create a new function" butonuna tıklayın.
2. Adını tam olarak şu yapın: `send-invoice`
3. Bilgisayarınızdaki `supabase/functions/send-invoice/index.ts` dosyasının içeriğini kopyalayıp oradaki editöre yapıştırın ve "Save" deyin.

2. Adım: API Key Kontrolü (Zaten yaptıysanız atlayın)
--------------------------------------------------
1. Eğer iletişim formu için yaptıysanız bu adım zaten tamamlanmıştır.
2. Değilse: Edge Functions -> `send-invoice` -> Settings -> Secrets kısmına gidin.
3. `RESEND_API_KEY` adında, Resend'den aldığınız anahtarı (re_...) ekleyin.

3. Adım: Test Etme
------------------
1. http://localhost:3000/admin/promotions sayfasını yenileyin.
2. Bir ödemenin yanındaki "Zarf" (✉️) simgesine tıklayın.
3. Eğer her şey doğruysa, satıcının e-posta adresine şık tasarımlı bir fatura maili gidecektir.

ÖNEMLİ: Resend ücretsiz hesap kullandığınız için, e-postalar ŞİMDİLİK sadece Resend'e kayıt olduğunuz kendi mail adresinize (kerem_aydin@aol.com) gidebilir. Gerçek müşterilere gitmesi için Resend üzerinden domain doğrulaması yapmanız gerekir.
*/
