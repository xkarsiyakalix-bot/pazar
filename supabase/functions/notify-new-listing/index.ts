import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

serve(async (req) => {
    try {
        const payload = await req.json()
        console.log('Webhook payload received for new listing:', JSON.stringify(payload, null, 2))

        const { record } = payload
        if (!record || !record.user_id) {
            console.error('No valid listing record found in payload')
            return new Response(JSON.stringify({ error: 'No valid record found' }), { status: 400 })
        }

        // Initialize Supabase Admin Client
        const supabaseAdmin = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!)

        // Fetch user's email from Auth
        const { data: { user }, error: userError } = await supabaseAdmin.auth.admin.getUserById(record.user_id)
        if (userError || !user || !user.email) {
            console.error('Could not find user email for ID:', record.user_id)
            return new Response(JSON.stringify({ error: 'User email not found' }), { status: 404 })
        }

        const userEmail = user.email
        const userName = record.contact_name || user.user_metadata?.full_name || 'Kullanıcı'

        let imageUrl = '';
        if (record.images && Array.isArray(record.images) && record.images.length > 0) {
            imageUrl = record.images[0];
        } else if (record.images && typeof record.images === 'string') {
            try {
                const parsed = JSON.parse(record.images);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    imageUrl = parsed[0];
                }
            } catch (e) {
                if (record.images.startsWith('http')) {
                    imageUrl = record.images;
                }
            }
        }

        const currentYear = new Date().getFullYear();

        console.log(`Sending new listing confirmation email to: ${userEmail}`)

        // Send email using Resend
        const res = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${RESEND_API_KEY}`,
            },
            body: JSON.stringify({
                from: 'ExVitrin <onboarding@resend.dev>',
                to: [userEmail],
                subject: `İlanınız Yayında: ${record.title}`,
                html: `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); border: 1px solid #eaeaea;">
  
  <!-- Header -->
  <div style="background-color: #dc2626; padding: 30px 20px; text-align: center;">
    <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: 0.5px;">ExVitrin</h1>
    <p style="color: #fee2e2; margin: 10px 0 0 0; font-size: 15px;">İlanınız Başarıyla Yayında!</p>
  </div>

  <!-- Body -->
  <div style="padding: 40px 30px; color: #374151;">
    <h2 style="margin: 0 0 20px 0; color: #111827; font-size: 20px;">Tebrikler ${userName},</h2>
    <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #4b5563;">
      Harika bir haberimiz var! <strong>"${record.title}"</strong> başlıklı ilanınız onaylandı ve ExVitrin'de yayına alındı. Artık binlerce alıcı ilanınızı görebilir.
    </p>

    <!-- Listing Card -->
    <div style="background-color: #f9fafb; border: 1px solid #f3f4f6; border-radius: 10px; padding: 20px; text-align: center; margin-bottom: 30px;">
      ${imageUrl ? `<img src="${imageUrl}" alt="İlan Resmi" style="max-width: 100%; height: auto; border-radius: 8px; margin-bottom: 15px; max-height: 250px; object-fit: cover;" />` : ''}
      <h3 style="margin: 0 0 10px 0; color: #1f2937; font-size: 18px;">${record.title}</h3>
      ${record.price ? `<p style="margin: 0; font-weight: 700; color: #dc2626; font-size: 20px;">${record.price} TL</p>` : ''}
    </div>

    <!-- Call to Action -->
    <div style="text-align: center; margin: 30px 0;">
      <a href="https://www.exvitrin.com/product/${record.id}" style="background-color: #dc2626; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; display: inline-block;">İlanı Görüntüle</a>
    </div>

    <p style="margin: 0 0 10px 0; font-size: 15px; color: #6b7280; text-align: center;">
      İlanınızı düzenlemek veya istatistiklerini takip etmek için hesabınıza giriş yapabilirsiniz.
    </p>
  </div>

  <!-- Footer -->
  <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #f3f4f6;">
    <p style="margin: 0; font-size: 13px; color: #9ca3af;">
      &copy; ${currentYear} ExVitrin. Tüm hakları saklıdır.
    </p>
    <p style="margin: 5px 0 0 0; font-size: 12px; color: #9ca3af;">
      Bu e-posta size ExVitrin üzerinden otomatik olarak gönderilmiştir.
    </p>
  </div>
</div>
                `,
            }),
        })

        const result = await res.json()
        
        if (!res.ok) {
            console.error('Resend API error:', result)
            // Handle Sandbox restriction gracefully so it doesn't crash the DB webhook
            if (res.status === 403 && result.name === 'validation_error') {
                console.warn('Sandbox restriction hit. Email not sent, but proceeding.', result)
            }
            return new Response(JSON.stringify(result), {
                headers: { "Content-Type": "application/json" },
                status: res.status === 403 ? 200 : res.status // return 200 for sandbox to not fail webhook
            })
        }

        return new Response(JSON.stringify(result), {
            headers: { "Content-Type": "application/json" },
            status: 200
        })

    } catch (error) {
        console.error('Edge Function error:', error.message)
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { "Content-Type": "application/json" },
            status: 500
        })
    }
})

/*
KULLANIM TALİMATI (Supabase Dashboard üzerinden):
1. Edge Functions -> New Function oluşturun.
2. Adını "notify-new-listing" yapın ve bu kodu yapıştırın.
3. Database -> Webhooks kısmından "Create Webhook" seçin.
4. Name: "Send Listing Email", Table: "listings", Events: "Insert"
5. Type: "Supabase Edge Function", Function: "notify-new-listing", Method: "POST"
*/
