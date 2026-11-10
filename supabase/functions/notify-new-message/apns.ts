// Apple Push Notification Service (APNs) HTTP/2 Direct Sender
// iOS için Firebase bypass - doğrudan APNs'e gönderir

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

export async function sendApnsNotification({
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
        // Tokenin APNs hex token mu yoksa FCM token mu olduğunu kontrol et
        // APNs hex token: 64 karakter, sadece hexadecimal, : içermiyor
        const isApnsHexToken = /^[0-9a-fA-F]{64}$/.test(deviceToken);
        if (!isApnsHexToken) {
            console.log("[APNs] Bu bir APNs hex token değil, FCM token olabilir. Atlanıyor.");
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

        // Önce production APNs dene, başarısız olursa sandbox dene
        for (const useSandbox of [false, true]) {
            const apnsHost = useSandbox
                ? "api.sandbox.push.apple.com"
                : "api.push.apple.com";
            const url = `https://${apnsHost}/3/device/${deviceToken.toLowerCase()}`;

            console.log(`[APNs] ${useSandbox ? "Sandbox" : "Production"} APNs'e gönderiliyor: ${url}`);

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
            console.log(`[APNs] Response status: ${response.status}, body: ${responseText}`);

            if (response.status === 200) {
                console.log(`[APNs] ✅ Push başarıyla gönderildi (${useSandbox ? "Sandbox" : "Production"})`);
                return { success: true };
            } else if (response.status === 400 && responseText.includes("BadDeviceToken")) {
                console.warn(`[APNs] BadDeviceToken (${useSandbox ? "Sandbox" : "Production"}), diğer ortam deneniyor...`);
                // Diğer ortamı dene
                continue;
            } else if (response.status === 403) {
                console.error(`[APNs] 403 Forbidden - APNs key/Team ID yanlış olabilir: ${responseText}`);
                return { success: false, error: `APNs 403: ${responseText}` };
            } else {
                console.error(`[APNs] Hata (${response.status}): ${responseText}`);
                // Diğer ortamı dene
                continue;
            }
        }

        return { success: false, error: "Her iki APNs ortamında da başarısız" };
    } catch (e: any) {
        console.error("[APNs] Exception:", e);
        return { success: false, error: e?.message || String(e) };
    }
}
