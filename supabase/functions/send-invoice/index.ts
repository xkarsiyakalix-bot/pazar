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

    const price = Number(amount)
    const netAmount = (price / 1.18).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    const vatAmount = (price - (price / 1.18)).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    const totalAmount = price.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

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
              .row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px; }
              .label { color: #6B7280; font-weight: bold; }
              .value { font-weight: bold; color: #111827; }
              .divider { border-top: 1px solid #E5E7EB; margin: 10px 0; }
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
                <p>ExVitrin'den aldığınız promosyon paketi için faturanız aşağıdadır:</p>
                
                <div class="invoice-card">
                  <div class="invoice-id">FATURA NO: ${invoiceNumber}</div>
                  
                  <div style="margin: 20px 0;">
                    <div class="row">
                       <span class="label">Paket:</span>
                       <span class="value">${packageType}</span>
                    </div>
                    <div class="row">
                       <span class="label">İlan:</span>
                       <span class="value">${listingTitle || 'Abonelik Paketi'}</span>
                    </div>
                  </div>

                  <div class="divider"></div>

                  <div class="row">
                    <span class="label">Ara Toplam (KDV Hariç):</span>
                    <span class="value">${netAmount} TL</span>
                  </div>
                  <div class="row">
                    <span class="label">KDV (%18):</span>
                    <span class="value">${vatAmount} TL</span>
                  </div>
                  
                  <div class="divider"></div>

                  <div class="amount" style="text-align: right;">${totalAmount} TL</div>
                  
                  <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #E5E7EB; display: flex; justify-content: space-between; font-size: 11px; color: #6B7280;">
                    <div>
                      <div style="font-weight: bold; color: #111827; margin-bottom: 5px;">ExVitrin Bilişim Hizmetleri</div>
                      <div>Teknoloji Mah. İnovasyon Cad. No: 1</div>
                      <div>34000 İstanbul, Türkiye</div>
                      <div style="margin-top: 5px;">VD: Beşiktaş | VN: 1234567890</div>
                      <div>Mersis: 012345678900001</div>
                    </div>
                    <div style="text-align: right;">
                      <div style="font-weight: bold; color: #111827; margin-bottom: 5px;">İletişim</div>
                      <div>info@exvitrin.com</div>
                      <div>+90 (212) 123 45 67</div>
                      <div style="margin-top: 5px;"><a href="https://exvitrin.com" style="color: #6B7280; text-decoration: none;">www.exvitrin.com</a></div>
                    </div>
                  </div>
                </div>
                
                <p style="margin-top: 30px;">
                  <a href="${invoiceUrl || '#'}" class="button">Faturayı Görüntüle</a>
                </p>
              </div>
              <div class="footer">
                <p>© 2025 ExVitrin</p>
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
