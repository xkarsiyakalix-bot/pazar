module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { title, category, subcategory } = req.body || {};

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'OpenAI API key is missing from environment variables.' });
    }

    const prompt = `Lütfen aşağıdaki özelliklere sahip bir ürün/hizmet için profesyonel, dikkat çekici, samimi ve SEO uyumlu bir ilan açıklaması yazın. Açıklama çok uzun olmasın (ortalama 3-4 paragraf) ve okuyucuyu satın almaya veya iletişime geçmeye teşvik etsin. Satıcının güvenilir olduğunu hissettirsin. Madde işaretleri kullanabilirsiniz.

Ürün Başlığı/Özeti: ${title}
Kategori: ${category || 'Genel'}
Alt Kategori: ${subcategory || 'Genel'}

Açıklama metni:`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'Sen profesyonel bir metin yazarı ve satış danışmanısın. İkinci el e-ticaret siteleri için çok etkili ve güven veren ilan açıklamaları yazarsın.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    });

    const data = await response.json();

    if (data.error) {
      console.error('OpenAI API Error:', data.error);
      return res.status(500).json({ error: data.error.message });
    }

    const description = data.choices[0].message.content.trim();
    return res.status(200).json({ description });

  } catch (error) {
    console.error('Function error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
