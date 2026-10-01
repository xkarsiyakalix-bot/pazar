module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { imageBase64 } = req.body || {};

    if (!imageBase64) {
      return res.status(400).json({ error: 'Image is required' });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'OpenAI API key is missing.' });
    }

    const systemPrompt = `
You are an expert AI assistant for a classifieds website (like Kleinanzeigen). 
Your task is to analyze the provided image and determine the most appropriate main category and subcategory from the list below.
Return ONLY a valid JSON object in this exact format, with no markdown, no backticks, and no extra text:
{
  "category": "Main Category Name",
  "subCategory": "Subcategory Name"
}

Available Main Categories and their Subcategories (in Turkish):
1. Emlak: Satılık Daireler, Kiralık Daireler, Satılık Evler, Kiralık Evler, Arsa & Bahçe, Ticari Emlak, Garaj & Otopark, Satılık Yazlık
2. Vasıta (Otomobil, Bisiklet & Tekne): Otomobiller, Bisiklet & Aksesuarlar, Oto Parça & Lastik, Tekne & Tekne Malzemeleri, Motosiklet & Scooter, Karavan & Motokaravan
3. Elektronik: Cep Telefonu & Telefon, Bilgisayarlar, Dizüstü Bilgisayarlar, Tabletler & E-Okuyucular, TV & Video, Fotoğraf & Kamera, Ev Aletleri, Konsollar
4. Ev & Bahçe: Mobilya, Dekorasyon, Bahçe Malzemeleri & Bitkiler, Mutfak & Yemek Odası, Lamba & Aydınlatma, Banyo, Yatak Odası, Oturma Odası
5. Moda & Güzellik: Kadın Giyimi, Erkek Giyimi, Kadın Ayakkabıları, Erkek Ayakkabıları, Çanta & Aksesuarlar, Saat & Takı, Güzellik & Sağlık
6. Evcil Hayvanlar: Köpekler, Kediler, Kuşlar, Balıklar, Küçük Hayvanlar, Aksesuarlar
7. Aile, Çocuk & Bebek: Bebek & Çocuk Giyimi, Oyuncaklar, Bebek Arabaları & Pusetler, Bebek Ekipmanları
8. Eğlence, Hobi & Mahalle: Spor & Kamp, Kitap & Dergi, Müzik Enstrümanları, Sanat & Antikalar, Model Yapımı, Oyunlar

If you are not sure, pick the closest one.
`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { 
            role: 'user', 
            content: [
              { type: 'text', text: 'Bu fotoğraftaki ürün hangi kategoriye ait?' },
              { type: 'image_url', image_url: { url: imageBase64, detail: 'low' } }
            ]
          }
        ],
        temperature: 0.2,
        max_tokens: 150
      })
    });

    const data = await response.json();

    if (data.error) {
      console.error('OpenAI API Error:', data.error);
      return res.status(500).json({ error: data.error.message });
    }

    let resultText = data.choices[0].message.content.trim();
    resultText = resultText.replace(/```json/g, '').replace(/```/g, '');
    const parsedResult = JSON.parse(resultText);

    return res.status(200).json(parsedResult);

  } catch (error) {
    console.error('Detect Category Error:', error);
    return res.status(500).json({ error: 'Görsel analiz edilemedi.' });
  }
};
