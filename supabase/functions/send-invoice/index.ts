import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

    if (!RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not set')
      return new Response(JSON.stringify({ error: 'RESEND_API_KEY missing in Secrets' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const payload = await req.json()
    console.log('Invoice payload received:', JSON.stringify(payload, null, 2))

    const { email, customerName, invoiceNumber, amount, packageType, listingTitle, invoiceUrl } = payload

    if (!email || !customerName || !invoiceNumber) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    console.log(`Sending invoice ${invoiceNumber} to ${email}`)

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'ExVitrin <onboarding@resend.dev>',
        to: [email],
        subject: `Faturanız Hazır - ExVitrin (${invoiceNumber})`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #111827; }
              .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
              .header { border-bottom: 2px solid #F3F4F6; padding-bottom: 20px; margin-bottom: 30px; }
              .logo { font-size: 24px; font-weight: 900; color: #EF4444; letter-spacing: -0.05em; font-style: italic; }
              .content { background: #FFFFFF; }
              .invoice-card { background: #F9FAFB; border-radius: 12px; padding: 24px; margin: 20px 0; border: 1px solid #F3F4F6; }
              .invoice-id { font-family: monospace; font-weight: bold; color: #6B7280; font-size: 14px; }
              .amount { font-size: 32px; font-weight: 900; color: #EF4444; margin: 10px 0; }
              .button { background: #111827; color: white !important; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; font-size: 14px; }
              .footer { margin-top: 40px; border-top: 1px solid #F3F4F6; padding-top: 20px; color: #9CA3AF; font-size: 12px; text-align: center; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <div class="logo">EXVITRIN</div>
              </div>
              <div class="content">
                <h1>Faturanız Hazır</h1>
                <p>Merhaba ${customerName},</p>
                <p>ExVitrin'den aldığınız promosyon paketi için faturanız hazırlandı. Detayları aşağıda bulabilirsiniz:</p>
                
                <div class="invoice-card">
                  <div class="invoice-id">${invoiceNumber}</div>
                  <div class="amount">${amount} ₺</div>
                  <p><strong>Paket:</strong> ${packageType}</p>
                  <p><strong>İlan:</strong> ${listingTitle || 'Abonelik Paketi'}</p>
                </div>
                
                <p style="margin-top: 30px;">
                  <a href="${invoiceUrl || '#'}" class="button">Faturayı Görüntüle</a>
                </p>
              </div>
              <div class="footer">
                <p>© 2025 ExVitrin | Berlin, Almanya</p>
                <p>Bu e-postayı portalımızdan ücretli bir hizmet aldığınız için almaktasınız.</p>
              </div>
            </div>
          </body>
          </html>
        `,
      }),
    })

    const result = await res.json()
    console.log('Resend response:', JSON.stringify(result, null, 2))

    if (!res.ok) {
      console.error('Resend API error:', result)

      // Handle the specific Resend Sandbox restriction error (403 validation_error)
      if (res.status === 403 && result.name === 'validation_error' && result.message.includes('testing emails')) {
        return new Response(JSON.stringify({
          error: 'Resend Sandbox Sınırı',
          message: 'Sadece hesabın sahibi olan kerem_aydin@aol.com adresine e-posta gönderilebilir. Lütfen domaininizi resend.com üzerinde doğrulayın.',
          details: result.message
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 403
        })
      }

      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: res.status
      })
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200
    })

  } catch (error) {
    console.error('Edge Function internal error:', error.message)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500
    })
  }
})
