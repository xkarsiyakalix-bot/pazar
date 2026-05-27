export default async (request, context) => {
  const url = new URL(request.url);
  const path = url.pathname;

  // UUID regex pattern
  const uuidPattern = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  const match = path.match(uuidPattern);

  // If it's not a listing page (doesn't end with UUID) or it's an API/static asset, skip
  if (!match || path.includes('/static/') || path.includes('.')) {
    return context.next();
  }

  const id = match[0];
  
  // Get Supabase credentials from Netlify Environment Variables
  const supabaseUrl = Netlify.env.get("REACT_APP_SUPABASE_URL");
  const supabaseKey = Netlify.env.get("REACT_APP_SUPABASE_ANON_KEY");

  // Get the original HTML response
  const response = await context.next();
  if (response.headers.get("content-type") !== "text/html" && response.headers.get("content-type") !== "text/html; charset=UTF-8") {
    return response;
  }

  let text = await response.text();

  if (supabaseUrl && supabaseKey) {
    try {
      let ogTags = "";

      if (path.includes('/seller/')) {
        // Fetch seller profile
        const res = await fetch(`${supabaseUrl}/rest/v1/profiles?id=eq.${id}&select=full_name,store_logo,avatar_url,bio`, {
          headers: { "apikey": supabaseKey, "Authorization": `Bearer ${supabaseKey}` }
        });
        const data = await res.json();
        
        if (data && data.length > 0) {
          const profile = data[0];
          const name = profile.full_name || "Satıcı";
          const title = `${name} Profili ve İlanları | ExVitrin`;
          const description = profile.bio ? profile.bio.substring(0, 160) : `${name} kullanıcısının ExVitrin'deki güncel ilanlarını inceleyin.`;
          const image = profile.store_logo || profile.avatar_url || "https://exvitrin.com/logo_exvitrin_2026_cropped.png";

          ogTags = `
            <meta property="og:title" content="${title.replace(/"/g, '&quot;')}" />
            <meta property="og:description" content="${description.replace(/"/g, '&quot;')}" />
            <meta property="og:image" content="${image}" />
            <meta property="og:url" content="${url.href}" />
            <meta property="og:type" content="profile" />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content="${title.replace(/"/g, '&quot;')}" />
            <meta name="twitter:description" content="${description.replace(/"/g, '&quot;')}" />
            <meta name="twitter:image" content="${image}" />
          `;
        }
      } else {
        // Fetch the listing
        const res = await fetch(`${supabaseUrl}/rest/v1/listings?id=eq.${id}&select=title,description,images,price`, {
          headers: { "apikey": supabaseKey, "Authorization": `Bearer ${supabaseKey}` }
        });
        const data = await res.json();
        
        if (data && data.length > 0) {
          const listing = data[0];
          let priceText = "";
          if (listing.price) {
            priceText = " - " + new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(listing.price);
          }
          
          const title = listing.title + priceText + " | ExVitrin";
          const cleanDescription = listing.description ? listing.description.replace(/(<([^>]+)>)/gi, "") : "";
          const description = cleanDescription ? cleanDescription.substring(0, 160) : "ExVitrin'de ilan detayları.";
          const image = (listing.images && listing.images.length > 0) ? listing.images[0] : "https://exvitrin.com/logo_exvitrin_2026_cropped.png";

          ogTags = `
            <meta property="og:title" content="${title.replace(/"/g, '&quot;')}" />
            <meta property="og:description" content="${description.replace(/"/g, '&quot;')}" />
            <meta property="og:image" content="${image}" />
            <meta property="og:url" content="${url.href}" />
            <meta property="og:type" content="article" />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content="${title.replace(/"/g, '&quot;')}" />
            <meta name="twitter:description" content="${description.replace(/"/g, '&quot;')}" />
            <meta name="twitter:image" content="${image}" />
          `;
        }
      }

      if (ogTags) {
        text = text.replace(/<meta property="og:[^>]+>/gs, '');
        text = text.replace(/<meta name="twitter:[^>]+>/gs, '');
        text = text.replace("</head>", `${ogTags}</head>`);
      }
    } catch (err) {
      console.error("Error fetching data for OG tags:", err);
    }
  }

  return new Response(text, {
    status: 200,
    headers: {
      "Content-Type": "text/html",
      // Important: Add cache headers so Netlify/CDN caches the injected response for some time
      "Cache-Control": "public, max-age=300"
    }
  });
};
