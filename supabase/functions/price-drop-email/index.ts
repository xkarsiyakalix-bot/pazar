import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!)

serve(async (req) => {
    try {
        const payload = await req.json()
        const { record } = payload

        // Only process price_drop notifications
        if (!record || record.type !== 'price_drop') {
            return new Response(JSON.stringify({ message: 'Ignored: Not a price_drop notification' }), { status: 200 })
        }

        // Fetch user email
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('email, full_name')
            .eq('id', record.user_id)
            .single()

        if (profileError || !profile?.email) {
            console.error('Error fetching profile:', profileError)
            return new Response(JSON.stringify({ error: 'Profile not found' }), { status: 400 })
        }

        console.log(`Sending price drop email to: ${profile.email} for listing: ${record.listing_id}`)

        // Send email using Resend
        const res = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${RESEND_API_KEY}`,
            },
            body: JSON.stringify({
                from: 'ExVitrin <notifications@resend.dev>',
                to: [profile.email],
                subject: `Fiyat Düştü! ${record.title}`,
                html: `
                    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                        <h2 style="color: #e53e3e;">Favori İlanınızda Fiyat Düştü!</h2>
                        <p>Merhaba ${profile.full_name || 'Kullanıcı'},</p>
                        <p>Takip ettiğiniz <strong>"${record.title}"</strong> başlıklı ilanın fiyatı düştü.</p>
                        <div style="background-color: #f7fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
                            <p style="margin: 0; font-size: 18px;">${record.message}</p>
                        </div>
                        <p>İlanı hemen incelemek için aşağıdaki butona tıklayabilirsiniz:</p>
                        <a href="https://exvitrin.netlify.app/listing/${record.listing_id}" 
                           style="display: inline-block; background-color: #e53e3e; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                           İlanı Görüntüle
                        </a>
                        <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;">
                        <p style="font-size: 12px; color: #718096;">
                            Bu e-posta favori ilanlarınızdaki değişiklikleri bildirmek amacıyla gönderilmiştir. 
                            Bildirim ayarlarınızı profil sayfanızdan düzenleyebilirsiniz.
                        </p>
                    </div>
                `,
            }),
        })

        const result = await res.json()
        if (!res.ok) {
            console.error('Resend API error:', result)
            return new Response(JSON.stringify(result), { status: res.status })
        }

        return new Response(JSON.stringify({ success: true, messageId: result.id }), { status: 200 })

    } catch (error) {
        console.error('Edge Function error:', error.message)
        return new Response(JSON.stringify({ error: error.message }), { status: 500 })
    }
})
