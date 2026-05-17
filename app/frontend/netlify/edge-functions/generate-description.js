export default async (request, context) => {
  // Only allow POST requests
  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const { title, category, subcategory } = await request.json();

    if (!title) {
      return new Response(JSON.stringify({ error: "Title is required" }), { 
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const apiKey = Netlify.env.get("OPENAI_API_KEY");
    
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "OpenAI API key is missing from environment variables." }), { 
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }

    const prompt = `Lütfen aşağıdaki özelliklere sahip bir ürün/hizmet için profesyonel, dikkat çekici, samimi ve SEO uyumlu bir ilan açıklaması yazın. Açıklama çok uzun olmasın (ortalama 3-4 paragraf) ve okuyucuyu satın almaya veya iletişime geçmeye teşvik etsin. Satıcının güvenilir olduğunu hissettirsin. Madde işaretleri kullanabilirsiniz.

Ürün Başlığı/Özeti: ${title}
Kategori: ${category || 'Genel'}
Alt Kategori: ${subcategory || 'Genel'}

Açıklama metni:`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "Sen profesyonel bir metin yazarı ve satış danışmanısın. İkinci el e-ticaret siteleri için çok etkili ve güven veren ilan açıklamaları yazarsın." },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    });

    const data = await response.json();

    if (data.error) {
      console.error("OpenAI API Error:", data.error);
      return new Response(JSON.stringify({ error: data.error.message }), { 
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }

    const description = data.choices[0].message.content.trim();

    return new Response(JSON.stringify({ description }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error("Function error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
