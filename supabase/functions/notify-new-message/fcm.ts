// Firebase Cloud Messaging (FCM HTTP v1) Helper for Supabase Edge Functions

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

export async function getFcmAccessToken(serviceAccount: any): Promise<string | null> {
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

export async function sendFcmPushNotification({
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

