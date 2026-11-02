import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { sendFcmPushNotification } from './fcm.ts'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

serve(async (req) => {
    try {
        const payload = await req.json()
        console.log('Webhook payload received for new message:', JSON.stringify(payload, null, 2))

        const { record } = payload
        if (!record || !record.receiver_id || !record.sender_id) {
            console.error('No valid message record found in payload')
            return new Response(JSON.stringify({ error: 'No valid record found' }), { status: 400 })
        }

        // Initialize Supabase Admin Client
        const supabaseAdmin = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!)

        // 1. Fetch receiver's email
        const { data: { user: receiver }, error: receiverError } = await supabaseAdmin.auth.admin.getUserById(record.receiver_id)
        if (receiverError || !receiver || !receiver.email) {
            console.error('Could not find receiver email for ID:', record.receiver_id)
            return new Response(JSON.stringify({ error: 'Receiver email not found' }), { status: 404 })
        }
        const receiverEmail = receiver.email
        const receiverName = receiver.user_metadata?.full_name || 'Kullanıcı'

        // 2. Fetch sender's name
        const { data: senderProfile } = await supabaseAdmin
            .from('profiles')
            .select('full_name')
            .eq('id', record.sender_id)
            .single()
        const senderName = senderProfile?.full_name || 'Bir kullanıcı'

        // 3. Fetch listing title if applicable
        let listingTitle = ''
        if (record.listing_id) {
            const { data: listingData } = await supabaseAdmin
                .from('listings')
                .select('title')
                .eq('id', record.listing_id)
                .single()
            if (listingData) {
                listingTitle = listingData.title
            }
        }

        console.log(`Sending new message email to: ${receiverEmail}`)

        // Prepare email content
        const subject = listingTitle 
            ? `ExVitrin: "${listingTitle}" ilanınız için yeni bir mesajınız var`
            : `ExVitrin: Yeni bir mesajınız var`
            
        const html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
            <h2 style="color: #ef4444;">Merhaba ${receiverName},</h2>
            <p><strong>${senderName}</strong> size yeni bir mesaj gönderdi:</p>
            ${listingTitle ? `<p><em>İlan: ${listingTitle}</em></p>` : ''}
            
            <div style="background-color: #f3f4f6; padding: 16px; border-radius: 8px; margin: 20px 0; font-style: italic;">
              "${record.content}"
            </div>
            
            <p>Mesaja cevap vermek için ExVitrin hesabınıza giriş yapabilirsiniz.</p>
            <br/>
            <p>İyi günler dileriz,</p>
            <p><strong>ExVitrin Ekibi</strong></p>
          </div>
        `

        // Send email using Resend
        let emailResult = null
        try {
            const res = await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${RESEND_API_KEY}`,
                },
                body: JSON.stringify({
                    from: 'ExVitrin <info@exvitrin.com>',
                    to: [receiverEmail],
                    subject: subject,
                    html: html,
                }),
            })
            emailResult = await res.json()
            if (!res.ok) {
                console.warn('Resend email failed:', emailResult)
            }
        } catch (mailErr) {
            console.warn('Resend email error:', mailErr)
        }

        // 4. Send Android Push Notification (FCM) & Badge Count
        try {
            const { data: pushTokens } = await supabaseAdmin
                .from('user_push_tokens')
                .select('token')
                .eq('user_id', record.receiver_id)

            const { data: receiverProf } = await supabaseAdmin
                .from('profiles')
                .select('fcm_token')
                .eq('id', record.receiver_id)
                .single()

            const allTokens = new Set<string>()
            if (receiverProf?.fcm_token) allTokens.add(receiverProf.fcm_token)
            if (pushTokens) {
                pushTokens.forEach((pt: any) => {
                    if (pt?.token) allTokens.add(pt.token)
                })
            }

            if (allTokens.size > 0) {
                const { count: unreadCount } = await supabaseAdmin
                    .from('messages')
                    .select('*', { count: 'exact', head: true })
                    .eq('receiver_id', record.receiver_id)
                    .eq('read', false)

                const serviceAccountRaw = Deno.env.get('FIREBASE_SERVICE_ACCOUNT')
                let serviceAccount = null
                if (serviceAccountRaw) {
                    try {
                        serviceAccount = JSON.parse(serviceAccountRaw)
                    } catch (_) {}
                }

                if (serviceAccount) {
                    for (const fcmToken of allTokens) {
                        await sendFcmPushNotification({
                            serviceAccount,
                            token: fcmToken,
                            title: `ExVitrin: ${senderName}`,
                            body: record.content,
                            badgeCount: (unreadCount || 0) + 1,
                            data: {
                                type: 'new_message',
                                sender_id: record.sender_id,
                                conversation_id: record.conversation_id || ''
                            }
                        })
                    }
                }
            }
        } catch (fcmErr) {
            console.error('FCM Push notification error:', fcmErr)
        }

        return new Response(JSON.stringify({ success: true, email: emailResult }), {
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
2. Adını "notify-new-message" yapın ve bu kodu yapıştırın.
3. Database -> Webhooks kısmından "Create Webhook" seçin.
4. Name: "Send Message Email", Table: "messages", Events: "Insert"
5. Type: "Supabase Edge Function", Function: "notify-new-message", Method: "POST"
*/
