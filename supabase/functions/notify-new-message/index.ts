import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// =========================================================================
// 1. APPLE PUSH NOTIFICATION SERVICE (APNs) DIRECT HTTP/2 SENDER (iOS)
// =========================================================================
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

function base64UrlEncode(input: string | Uint8Array): string {
    let str: string;
    if (typeof input === "string") {
        str = btoa(input);
    } else {
        str = btoa(String.fromCharCode(...input));
    }
    return str.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function createApnsJwt(keyId: string, teamId: string, p8Key: string): Promise<string> {
    const now = Math.floor(Date.now() / 1000);
    const header = { alg: "ES256", kid: keyId };
    const claims = { iss: teamId, iat: now };

    const encHeader = base64UrlEncode(JSON.stringify(header));
    const encClaims = base64UrlEncode(JSON.stringify(claims));
    const message = `${encHeader}.${encClaims}`;

    const keyData = pemToBinary(p8Key);
    const key = await crypto.subtle.importKey(
        "pkcs8",
        keyData,
        { name: "ECDSA", namedCurve: "P-256" },
        false,
        ["sign"]
    );

    const encoder = new TextEncoder();
    const signatureBuffer = await crypto.subtle.sign(
        { name: "ECDSA", hash: "SHA-256" },
        key,
        encoder.encode(message)
    );

    const encSignature = base64UrlEncode(new Uint8Array(signatureBuffer));
    return `${message}.${encSignature}`;
}

async function sendApnsNotification({
    deviceToken,
    bundleId,
    keyId,
    teamId,
    p8Key,
    title,
    body,
    badgeCount,
    data = {},
}: {
    deviceToken: string;
    bundleId: string;
    keyId: string;
    teamId: string;
    p8Key: string;
    title: string;
    body: string;
    badgeCount?: number;
    data?: Record<string, string>;
}): Promise<{ success: boolean; error?: string }> {
    try {
        const isApnsHexToken = /^[0-9a-fA-F]{64}$/.test(deviceToken);
        if (!isApnsHexToken) {
            return { success: false, error: "Not an APNs hex token" };
        }

        const jwt = await createApnsJwt(keyId, teamId, p8Key);

        const payload: any = {
            aps: {
                alert: {
                    title: title,
                    body: body,
                },
                badge: badgeCount ?? 1,
                sound: "default",
                "content-available": 1,
            },
            ...data,
        };

        // Önce production sonra sandbox dene (TestFlight apps genelde sandbox veya production olabilir)
        for (const useSandbox of [false, true]) {
            const apnsHost = useSandbox
                ? "api.sandbox.push.apple.com"
                : "api.push.apple.com";
            const url = `https://${apnsHost}/3/device/${deviceToken.toLowerCase()}`;

            console.log(`[APNs] ${useSandbox ? "Sandbox" : "Production"} APNs deneniyor...`);

            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${jwt}`,
                    "Content-Type": "application/json",
                    "apns-topic": bundleId,
                    "apns-priority": "10",
                    "apns-push-type": "alert",
                    "apns-expiration": "0",
                },
                body: JSON.stringify(payload),
            });

            const responseText = await response.text();
            console.log(`[APNs] Status: ${response.status}, Cevap: ${responseText}`);

            if (response.status === 200) {
                console.log(`[APNs] ✅ Push başarıyla teslim edildi! (${useSandbox ? "Sandbox" : "Production"})`);
                return { success: true };
            } else if (response.status === 400 && responseText.includes("BadDeviceToken")) {
                console.warn(`[APNs] BadDeviceToken (${useSandbox ? "Sandbox" : "Production"}), diğeri deneniyor...`);
                continue;
            } else if (response.status === 403) {
                console.error(`[APNs] 403 Forbidden: ${responseText}`);
                return { success: false, error: `APNs 403: ${responseText}` };
            }
        }

        return { success: false, error: "APNs teslim edilemedi" };
    } catch (e: any) {
        console.error("[APNs] Exception:", e);
        return { success: false, error: e?.message || String(e) };
    }
}

// =========================================================================
// 2. FIREBASE CLOUD MESSAGING (FCM) HELPER (Sadece Android İçin)
// =========================================================================
async function createFcmJwt(serviceAccount: any): Promise<string> {
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
    const encSignature = base64UrlEncode(new Uint8Array(signature));

    return `${message}.${encSignature}`;
}

async function getFcmAccessToken(serviceAccount: any): Promise<string | null> {
    try {
        const jwt = await createFcmJwt(serviceAccount);
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

function isApnsHexToken(token: string): boolean {
    return /^[0-9a-fA-F]{64}$/.test(token);
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
            console.error("[FCM] Push hatası:", resData);
            return false;
        }

        console.log("[FCM] Android push başarıyla iletildi:", resData.name);
        return true;
    } catch (e) {
        console.error("[FCM] Push exception:", e);
        return false;
    }
}

// =========================================================================
// 3. MAIN EDGE FUNCTION HANDLER
// =========================================================================
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

// APNs Parametreleri
const APNS_KEY_ID = Deno.env.get('APNS_KEY_ID') || '2YR4C9MR9P'
const APNS_TEAM_ID = Deno.env.get('APNS_TEAM_ID') || 'SD3U69B447'
const APNS_BUNDLE_ID = Deno.env.get('APNS_BUNDLE_ID') || 'com.exvitrin.app'
const APNS_P8_KEY = Deno.env.get('APNS_P8_KEY') || ''

serve(async (req) => {
    try {
        const payload = await req.json()
        console.log('Webhook payload received for new message:', JSON.stringify(payload, null, 2))

        const { record } = payload
        if (!record || !record.receiver_id || !record.sender_id) {
            return new Response(JSON.stringify({ error: 'No valid record found' }), { status: 400 })
        }

        const supabaseAdmin = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!)

        // 1. Alıcının e-postasını al
        const { data: { user: receiver }, error: receiverError } = await supabaseAdmin.auth.admin.getUserById(record.receiver_id)
        if (receiverError || !receiver || !receiver.email) {
            return new Response(JSON.stringify({ error: 'Receiver email not found' }), { status: 404 })
        }
        const receiverEmail = receiver.email
        const receiverName = receiver.user_metadata?.full_name || 'Kullanıcı'

        // 2. Gönderenin adını al
        const { data: senderProfile } = await supabaseAdmin
            .from('profiles')
            .select('full_name')
            .eq('id', record.sender_id)
            .single()
        const senderName = senderProfile?.full_name || 'Bir kullanıcı'

        // 3. İlan başlığını al
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

        // 4. E-posta Gönder (Resend)
        let emailResult = null
        try {
            if (RESEND_API_KEY) {
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
                    <p>Mesaja cevap vermek için ExVitrin uygulamasını açabilirsiniz.</p>
                    <br/>
                    <p>İyi günler dileriz,<br/><strong>ExVitrin Ekibi</strong></p>
                  </div>
                `
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
            }
        } catch (mailErr) {
            console.warn('Email gönderim hatası:', mailErr)
        }

        // 5. Push Bildirimi & Rozet Gönder (iOS: Doğrudan APNs, Android: FCM)
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
                // Okunmamış mesaj sayısını hesapla (App Rozeti için)
                const { count: unreadCount } = await supabaseAdmin
                    .from('messages')
                    .select('*', { count: 'exact', head: true })
                    .eq('receiver_id', record.receiver_id)
                    .eq('read', false)
                    .eq('deleted_by_receiver', false)

                const badgeNumber = Math.max(1, unreadCount || 1)

                // Android FCM için service account
                const serviceAccountRaw = Deno.env.get('FIREBASE_SERVICE_ACCOUNT')
                let serviceAccount = null
                if (serviceAccountRaw) {
                    try {
                        serviceAccount = JSON.parse(serviceAccountRaw)
                    } catch (e) {
                        console.error('[FCM] JSON parse hatası:', e)
                    }
                }

                for (const token of allTokens) {
                    if (isApnsHexToken(token)) {
                        // 🍎 iOS: Doğrudan Apple APNs HTTP/2
                        console.log(`[Push] iOS APNs Token tespit edildi: ${token.substring(0, 16)}...`)
                        if (!APNS_P8_KEY) {
                            console.error('[APNs] ❌ APNS_P8_KEY secret tanımlı değil! Supabase Dashboard > Settings > Vault üzerinden eklenmeli.')
                            continue
                        }

                        const result = await sendApnsNotification({
                            deviceToken: token,
                            bundleId: APNS_BUNDLE_ID,
                            keyId: APNS_KEY_ID,
                            teamId: APNS_TEAM_ID,
                            p8Key: APNS_P8_KEY,
                            title: senderName,
                            body: record.content,
                            badgeCount: badgeNumber,
                            data: {
                                type: 'new_message',
                                sender_id: record.sender_id,
                                conversation_id: record.conversation_id || '',
                            },
                        })
                        console.log('[APNs] Sonuç:', result)
                    } else {
                        // 🤖 Android: Firebase FCM
                        console.log(`[Push] Android FCM Token tespit edildi: ${token.substring(0, 16)}...`)
                        if (serviceAccount) {
                            await sendFcmPushNotification({
                                serviceAccount,
                                token: token,
                                title: senderName,
                                body: record.content,
                                badgeCount: badgeNumber,
                                data: {
                                    type: 'new_message',
                                    sender_id: record.sender_id,
                                    conversation_id: record.conversation_id || '',
                                },
                            })
                        }
                    }
                }
            }
        } catch (pushErr) {
            console.error('Push error:', pushErr)
        }

        return new Response(JSON.stringify({ success: true, email: emailResult }), {
            headers: { "Content-Type": "application/json" },
            status: 200
        })

    } catch (error: any) {
        console.error('Function error:', error?.message || error)
        return new Response(JSON.stringify({ error: error?.message || error }), {
            headers: { "Content-Type": "application/json" },
            status: 500
        })
    }
})
