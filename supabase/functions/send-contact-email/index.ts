import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

serve(async (req) => {
    try {
        const payload = await req.json()
        console.log('Webhook payload received:', JSON.stringify(payload, null, 2))

        const { record } = payload

        if (!record) {
            console.error('No record found in payload')
            return new Response(JSON.stringify({ error: 'No record found' }), { status: 400 })
        }

        console.log('Sending email for subject:', record.subject)

        // Send email using Resend
        const res = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${RESEND_API_KEY}`,
            },
            body: JSON.stringify({
                from: 'ExVitrin <onboarding@resend.dev>',
                to: ['kerem_aydin@aol.com'],
                subject: `Yeni İletişim Mesajı: ${record.subject}`,
                html: `
          <h3>Yeni bir iletişim formu mesajınız var</h3>
          <p><strong>Gönderen:</strong> ${record.name} (${record.email})</p>
          <p><strong>Konu:</strong> ${record.subject}</p>
          <p><strong>Mesaj:</strong></p>
          <p>${record.message}</p>
        `,
            }),
        })

        const result = await res.json()
        console.log('Resend API response:', JSON.stringify(result, null, 2))

        if (!res.ok) {
            console.error('Resend API error:', result)

            // Handle the specific Resend Sandbox restriction error (403 validation_error)
            if (res.status === 403 && result.name === 'validation_error' && result.message.includes('testing emails')) {
                return new Response(JSON.stringify({
                    error: 'Resend Sandbox Sınırı',
                    message: 'Sadece hesabın sahibi olan kerem_aydin@aol.com adresine e-posta gönderilebilir. Lütfen domaininizi resend.com üzerinde doğrulayın.',
                    details: result.message
                }), {
                    headers: { "Content-Type": "application/json" },
                    status: 403
                })
            }

            return new Response(JSON.stringify(result), {
                headers: { "Content-Type": "application/json" },
                status: res.status
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
Kullanım Talimatı:
1. Supabase Dashboard -> Edge Functions -> New Function
2. Adını 'send-contact-email' yapın.
3. Bu kodu 'index.ts' olarak yapıştırın.
4. Settings -> Secrets kısmına 'RESEND_API_KEY' ekleyin.
5. Database -> Triggers kısmından 'contact_messages' tablosu için 'INSERT' sonrası bu fonksiyonu tetikleyin.
*/
