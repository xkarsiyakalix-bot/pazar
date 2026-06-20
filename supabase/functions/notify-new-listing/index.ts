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
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
            <h2 style="color: #ef4444;">Tebrikler ${userName}!</h2>
            <p><strong>"${record.title}"</strong> başlıklı ilanınız başarıyla ExVitrin'de yayına alınmıştır.</p>
            <p>İlanınızı görüntülemek, düzenlemek veya istatistiklerini takip etmek için hesabınıza giriş yapabilirsiniz.</p>
            <br/>
            <p>Bol kazançlar dileriz,</p>
            <p><strong>ExVitrin Ekibi</strong></p>
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
