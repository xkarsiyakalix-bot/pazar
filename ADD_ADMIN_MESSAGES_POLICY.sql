-- ============================================================
-- ExVitrin Admin: Kullanıcılar Arası Mesajları Görüntüleme Politikası
-- ============================================================
-- Bu SQL scripti, ExVitrin yöneticilerinin (Admin / Super Admin / User 1001)
-- tüm kullanıcıların birbiriyle yaptığı mesajlaşmaları görebilmesini sağlar.

-- 1. Mevcut eski kısıtlayıcı SELECT politikalarını kaldır
DROP POLICY IF EXISTS "Users can view their own messages" ON public.messages;
DROP POLICY IF EXISTS "Admins can view all messages" ON public.messages;

-- 2. Yeni kapsayıcı SELECT politikasını oluştur:
-- Normal kullanıcılar sadece kendi mesajlarını görebilirken,
-- Admin kullanıcıları platformdaki tüm mesajları ve konuşmaları görüntüleyebilir.
CREATE POLICY "Admins can view all messages"
ON public.messages FOR SELECT
USING (
  auth.uid() = sender_id 
  OR auth.uid() = receiver_id
  OR EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND (
      profiles.user_number = 1001
      OR profiles.is_admin = true
      OR profiles.admin_role IN ('admin', 'super_admin')
      OR profiles.email = 'kerem_aydin@aol.com'
    )
  )
);

-- 3. PostgREST şema önbelleğini yenile
NOTIFY pgrst, 'reload schema';

