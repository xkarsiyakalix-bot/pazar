import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// ==========================================
// 1. FIREBASE CLOUD MESSAGING (FCM) HELPER
// ==========================================
function pemToBinary(pem: string): ArrayBuffer {
    const b64 = pem
        .replace(/-----BEGIN PRIVATE KEY-----/, "")
        .replace(/-----END PRIVATE KEY-----/, "")
        .replace(/[\r\n\s]/g, "");
    const raw = atob(b64);
    const arr = new Uint8Array(raw.length);
    for (let i = 0; i < raw.length; i++) {
        arr[i] = raw.charCodeAt(i);
    }
    return arr.buffer;
}

function base64UrlEncode(str: string): string {
    return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function createJwt(serviceAccount: any): Promise<string> {
    const now = Math.floor(Date.now() / 1000);
    const header = { alg: "RS256", typ: "JWT" };
    const claimSet = {
        iss: serviceAccount.client_email,
        scope: "https://www.googleapis.com/auth/firebase.messaging",
        aud: "https://oauth2.googleapis.com/token",
        exp: now + 3600,
        iat: now,
    };

    const encHeader = base64UrlEncode(JSON.stringify(header));
    const encClaims = base64UrlEncode(JSON.stringify(claimSet));
    const message = `${encHeader}.${encClaims}`;

    const key = await crypto.subtle.importKey(
        "pkcs8",
        pemToBinary(serviceAccount.private_key),
        { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
        false,
        ["sign"]
    );

    const encoder = new TextEncoder();
    const signature = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", key, encoder.encode(message));
    const encSignature = base64UrlEncode(String.fromCharCode(...new Uint8Array(signature)));

    return `${message}.${encSignature}`;
}

async function getFcmAccessToken(serviceAccount: any): Promise<string | null> {
    try {
        const jwt = await createJwt(serviceAccount);
        const res = await fetch("https://oauth2.googleapis.com/token", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
        });
        const data = await res.json();
        return data.access_token || null;
    } catch (e) {
        console.error("[FCM] Access token alma hatası:", e);
        return null;
    }
}

async function sendFcmPushNotification({
    serviceAccount,
    token,
    title,
    body,
    badgeCount,
    data = {}
}: {
    serviceAccount: any;
    token: string;
    title: string;
    body: string;
    badgeCount?: number;
    data?: Record<string, string>;
}) {
    try {
        const accessToken = await getFcmAccessToken(serviceAccount);
        if (!accessToken) {
            console.error("[FCM] Access token alınamadı.");
            return false;
        }

        const projectId = serviceAccount.project_id;
        const payload: any = {
            message: {
                token: token,
                notification: {
                    title: title,
                    body: body,
                },
                data: data,
                android: {
                    priority: "high",
                    notification: {
                        channel_id: "default",
                        sound: "default",
                        notification_count: badgeCount ?? 1,
                    },
                },
                apns: {
                    headers: {
                        "apns-priority": "10",
                    },
                    payload: {
                        aps: {
                            alert: {
                                title: title,
                                body: body,
                            },
                            badge: badgeCount ?? 1,
                            sound: "default",
                        },
                    },
                },
            },
        };

        const res = await fetch(`https://fcm.googleapis.com/v1/projects/${projectId}/messages:send`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        const resData = await res.json();
        if (!res.ok) {
            console.error("[FCM] Push gönderim hatası:", resData);
            return false;
        }

        console.log("[FCM] Push başarıyla iletildi:", resData.name);
        return true;
    } catch (e) {
        console.error("[FCM] Push gönderme exception:", e);
        return false;
    }
}

// ==========================================
// 2. MAIN EDGE FUNCTION HANDLER
// ==========================================
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
            if (RESEND_API_KEY) {
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
            }
        } catch (mailErr) {
            console.warn('Resend email error:', mailErr)
        }

        // 4. Send Android Push Notification (FCM) & App Icon Badge Count
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

            console.log(`[Push] Alıcı için bulunan cihaz token sayısı: ${allTokens.size}`)

            if (allTokens.size > 0) {
                // Calculate unread message count for badge (exact unread messages)
                const { count: unreadCount } = await supabaseAdmin
                    .from('messages')
                    .select('*', { count: 'exact', head: true })
                    .eq('receiver_id', record.receiver_id)
                    .eq('read', false)
                    .eq('deleted_by_receiver', false)

                const badgeNumber = Math.max(1, unreadCount || 1)

                const serviceAccountRaw = Deno.env.get('FIREBASE_SERVICE_ACCOUNT')
                let serviceAccount = null
                if (serviceAccountRaw) {
                    try {
                        serviceAccount = JSON.parse(serviceAccountRaw)
                    } catch (pErr) {
                        console.error('[FCM] FIREBASE_SERVICE_ACCOUNT JSON parse hatası:', pErr)
                    }
                } else {
                    console.warn('[FCM] FIREBASE_SERVICE_ACCOUNT secret tanımlı değil!')
                }

                if (serviceAccount) {
                    for (const fcmToken of allTokens) {
                        await sendFcmPushNotification({
                            serviceAccount,
                            token: fcmToken,
                            title: `ExVitrin: ${senderName}`,
                            body: record.content,
                            badgeCount: badgeNumber,
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

    } catch (error: any) {
        console.error('Edge Function error:', error?.message || error)
        return new Response(JSON.stringify({ error: error?.message || error }), {
            headers: { "Content-Type": "application/json" },
            status: 500
        })
    }
})
