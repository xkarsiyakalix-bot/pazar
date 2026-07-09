const { createClient } = require('@supabase/supabase-js');

const SITE_URL = 'https://www.exvitrin.com';
const LOGO_URL = `${SITE_URL}/logo_exvitrin_2026_small.png`;

// ============================
// KATEGORI AÇIKLAMALARI
// ============================
const CATEGORY_META = {
  // Ana Kategoriler
  'Emlak': {
    title: 'Emlak İlanları - Satılık & Kiralık Daire, Ev, Arsa | ExVitrin',
    description: 'ExVitrin\'de en güncel emlak ilanları! Satılık ve kiralık daire, ev, arsa, ticari gayrimenkul ve daha fazlası. Türkiye\'nin her şehrinden güvenilir emlak ilanları.',
    keywords: 'emlak ilanları, satılık daire, kiralık daire, satılık ev, kiralık ev, arsa, ticari gayrimenkul, exvitrin'
  },
  'Elektronik': {
    title: 'Elektronik İlanları - Telefon, Bilgisayar, TV ve Daha Fazlası | ExVitrin',
    description: 'ExVitrin\'de ikinci el ve sıfır elektronik ürünleri keşfedin! Cep telefonu, bilgisayar, tablet, TV, fotoğraf makinesi ve daha fazlası uygun fiyatlarla.',
    keywords: 'elektronik ilanları, cep telefonu, bilgisayar, tablet, TV, ikinci el elektronik, exvitrin'
  },
  'Ev-Bahce': {
    title: 'Ev & Bahçe İlanları - Mobilya, Dekorasyon, Beyaz Eşya | ExVitrin',
    description: 'ExVitrin\'de ev ve bahçe için ihtiyacınız olan her şey! Mobilya, dekorasyon, beyaz eşya, bahçe malzemeleri uygun fiyatlarla satılık ve kiralık ilanlar.',
    keywords: 'ev bahçe ilanları, mobilya, dekorasyon, beyaz eşya, bahçe malzemeleri, ikinci el mobilya, exvitrin'
  },
  'Moda-Guzellik': {
    title: 'Moda & Güzellik İlanları - Giyim, Ayakkabı, Aksesuar | ExVitrin',
    description: 'ExVitrin\'de moda ve güzellik dünyasını keşfedin! Kadın, erkek ve çocuk giyim, ayakkabı, çanta, saat, takı ve güzellik ürünleri uygun fiyatlarla.',
    keywords: 'giyim ilanları, moda, ayakkabı, çanta, aksesuar, ikinci el giyim, güzellik ürünleri, exvitrin'
  },
  'Evcil-Hayvanlar': {
    title: 'Evcil Hayvan İlanları - Köpek, Kedi, Kuş ve Aksesuar | ExVitrin',
    description: 'ExVitrin\'de evcil hayvan ilanlarına göz atın! Köpek, kedi, kuş, balık ilanları; hayvan bakımı, eğitimi ve aksesuar ilanları tek platformda.',
    keywords: 'evcil hayvan ilanları, köpek satılık, kedi satılık, kuş ilanları, hayvan aksesuarları, exvitrin'
  },
  'Aile-Cocuk-Bebek': {
    title: 'Aile, Çocuk & Bebek İlanları - Oyuncak, Bebek Arabası | ExVitrin',
    description: 'ExVitrin\'de çocuğunuz için en uygun fiyatlı ürünleri bulun! Bebek arabası, oyuncak, çocuk giyimi, oto koltuğu, mobilya ve daha fazlası.',
    keywords: 'bebek ilanları, çocuk oyuncak, bebek arabası, çocuk giyimi, çocuk mobilyası, exvitrin'
  },
  'Is-Ilanlari': {
    title: 'İş İlanları - Tam Zamanlı, Yarı Zamanlı, Freelance | ExVitrin',
    description: 'ExVitrin\'de binlerce iş ilanına göz atın! Tam zamanlı, yarı zamanlı, serbest çalışma ve ek iş fırsatları tüm sektörlerden iş ilanları.',
    keywords: 'iş ilanları, part time iş, tam zamanlı iş, freelance, kariyer, exvitrin'
  },
  'Eglence-Hobi-Mahalle': {
    title: 'Eğlence, Hobi & Mahalle İlanları | ExVitrin',
    description: 'ExVitrin\'de eğlence ve hobi dünyasını keşfedin! Spor malzemeleri, müzik aletleri, kitaplar, koleksiyon ürünleri ve mahalle ilanları.',
    keywords: 'hobi ilanları, spor malzemeleri, müzik aletleri, koleksiyon, eğlence, exvitrin'
  },
  'Muzik-Film-Kitap': {
    title: 'Müzik, Film & Kitap İlanları | ExVitrin',
    description: 'ExVitrin\'de ikinci el müzik, film ve kitap ilanları! CD, DVD, vinyl plak, roman, ders kitabı, müzik aleti ilanları uygun fiyatlarla.',
    keywords: 'kitap ilanları, müzik ilanları, film ilanları, ikinci el kitap, CD, DVD, exvitrin'
  },
  'Biletler': {
    title: 'Bilet & Etkinlik İlanları - Konser, Spor, Tiyatro | ExVitrin',
    description: 'ExVitrin\'de konser, spor müsabakası, tiyatro ve etkinlik biletleri! Satılık ve aranan bilet ilanları güvenle.',
    keywords: 'bilet ilanları, konser bileti, spor bileti, tiyatro bileti, etkinlik bileti, exvitrin'
  },
  'Hizmetler': {
    title: 'Hizmet İlanları - Temizlik, Tamir, Nakliye ve Daha Fazlası | ExVitrin',
    description: 'ExVitrin\'de profesyonel hizmet ilanlarına göz atın! Ev temizliği, tamir, nakliye, ders, tasarım ve daha birçok alanda hizmet veren kişi ve firmalar.',
    keywords: 'hizmet ilanları, temizlik hizmeti, tamir hizmeti, nakliye, exvitrin'
  },
  'Ucretsiz-Takas': {
    title: 'Ücretsiz & Takas İlanları - Armağan ve Takas Fırsatları | ExVitrin',
    description: 'ExVitrin\'de ücretsiz ürünleri alın ya da eşyalarınızı takas edin! Bedava eşya, bağış ve takas ilanları tek platformda.',
    keywords: 'ücretsiz ilan, takas ilanları, armağan, hediye, bağış, takas, exvitrin'
  },
  'Egitim-Kurslar': {
    title: 'Eğitim & Kurs İlanları - Özel Ders, Dil Kursu, Spor | ExVitrin',
    description: 'ExVitrin\'de eğitim ve kurs ilanlarını keşfedin! Özel ders, dil kursu, spor dersleri, müzik dersleri, yemek kursu ve daha fazlası.',
    keywords: 'özel ders ilanları, dil kursu, eğitim ilanları, kurs ilanları, spor dersi, exvitrin'
  },
  'Otomobil-Bisiklet-Tekne': {
    title: 'Araç İlanları - Otomobil, Motosiklet, Bisiklet, Tekne | ExVitrin',
    description: 'ExVitrin\'de otomobil, motosiklet, bisiklet, tekne ve diğer araç ilanları! Satılık ve kiralık araçlar uygun fiyatlarla, güvenli alım satım.',
    keywords: 'araba ilanları, satılık otomobil, motosiklet ilanları, bisiklet ilanları, tekne ilanları, exvitrin'
  },
  'Komsu-Yardimi': {
    title: 'Komşu Yardımı İlanları - Mahalle Dayanışması | ExVitrin',
    description: 'ExVitrin Komşu Yardımı ile mahalle dayanışması! Komşularınızdan yardım isteyin veya yardım teklif edin. Birlikte daha güçlüyüz.',
    keywords: 'komşu yardımı, mahalle ilanları, yardımlaşma, dayanışma, exvitrin'
  },
  // Alt Kategoriler - Emlak
  'Kiralik-Daireler': {
    title: 'Kiralık Daire İlanları | ExVitrin',
    description: 'ExVitrin\'de kiralık daire ilanlarını inceleyin! 1+1, 2+1, 3+1 ve daha büyük daireler, Türkiye\'nin her şehrinde uygun kira fiyatları.'
  },
  'Satilik-Daireler': {
    title: 'Satılık Daire İlanları | ExVitrin',
    description: 'ExVitrin\'de satılık daire ilanlarına göz atın! Sahibinden satılık daireler, uygun fiyatlı konutlar, tüm şehirlerden seçenekler.'
  },
  'Satilik-Evler': {
    title: 'Satılık Ev İlanları | ExVitrin',
    description: 'ExVitrin\'de satılık ev ilanları! Müstakil ev, villa, bağımsız ev seçenekleriyle hayalinizdeki evi bulun.'
  },
  'Kiralik-Evler': {
    title: 'Kiralık Ev İlanları | ExVitrin',
    description: 'ExVitrin\'de kiralık ev ilanları! Müstakil ev, villa, aylık kiralık ev seçenekleri uygun fiyatlarla.'
  },
  'Ticari-Emlak': {
    title: 'Ticari Gayrimenkul İlanları - Ofis, Dükkan, Depo | ExVitrin',
    description: 'ExVitrin\'de ticari gayrimenkul ilanları! Satılık ve kiralık ofis, dükkan, depo, fabrika ve işyerleri.'
  },
  'Arsa-Bahce': {
    title: 'Arsa & Bahçe İlanları | ExVitrin',
    description: 'ExVitrin\'de satılık arsa ve bahçe ilanları! İmarlı arsa, tarla, bahçeli ev arsaları uygun fiyatlarla.'
  },
  // Alt Kategoriler - Elektronik
  'Cep-Telefonu-Telefon': {
    title: 'İkinci El & Sıfır Cep Telefonu İlanları | ExVitrin',
    description: 'ExVitrin\'de uygun fiyatlı cep telefonu ilanları! iPhone, Samsung, Xiaomi ve daha fazla marka, ikinci el ve sıfır telefon seçenekleri.'
  },
  'Bilgisayarlar': {
    title: 'İkinci El & Sıfır Bilgisayar İlanları | ExVitrin',
    description: 'ExVitrin\'de satılık bilgisayar ilanları! Masaüstü ve dizüstü bilgisayarlar, oyun PC\'leri, all-in-one modeller uygun fiyatlarla.'
  },
  'Tabletler-E-Okuyucular': {
    title: 'Tablet & E-Okuyucu İlanları | ExVitrin',
    description: 'ExVitrin\'de ikinci el ve sıfır tablet ilanları! iPad, Samsung, Huawei ve daha fazla marka tablet seçenekleri.'
  },
  'TV-Video': {
    title: 'Televizyon & Video İlanları | ExVitrin',
    description: 'ExVitrin\'de satılık TV ve video ilanları! Smart TV, OLED, LED, 4K televizyonlar uygun fiyatlarla.'
  },
  // Alt Kategoriler - Araç
  'Otomobiller': {
    title: 'Satılık & Kiralık Otomobil İlanları | ExVitrin',
    description: 'ExVitrin\'de binlerce otomobil ilanı! Sahibinden satılık araba, sıfır ve ikinci el otomobil ilanları tüm markalar.'
  },
  'Motosiklet-Scooter': {
    title: 'Satılık Motosiklet & Scooter İlanları | ExVitrin',
    description: 'ExVitrin\'de motosiklet ve scooter ilanları! İkinci el ve sıfır motosiklet, enduro, trail ve scooter seçenekleri.'
  },
  'Bisiklet-Aksesuarlar': {
    title: 'Satılık Bisiklet & Aksesuar İlanları | ExVitrin',
    description: 'ExVitrin\'de bisiklet ilanları! Dağ bisikleti, şehir bisikleti, elektrikli bisiklet ve bisiklet aksesuarları.'
  },
  // Alt Kategoriler - Evcil Hayvan
  'Kopekler': {
    title: 'Satılık & Sahiplendirme Köpek İlanları | ExVitrin',
    description: 'ExVitrin\'de köpek ilanları! Satılık ve sahiplendirme köpekler, ırk köpekler, karma irkler güvenli ilanlar.'
  },
  'Kedi': {
    title: 'Satılık & Sahiplendirme Kedi İlanları | ExVitrin',
    description: 'ExVitrin\'de kedi ilanları! Satılık ve sahiplendirme kediler, ırk kediler ve karma irkler.'
  },
  // Alt Kategoriler - Moda
  'Damenbekleidung': {
    title: 'Kadın Giyim İlanları - İkinci El & Sıfır | ExVitrin',
    description: 'ExVitrin\'de kadın giyim ilanları! İkinci el ve sıfır elbise, bluz, pantolon, ceket ve daha fazlası uygun fiyatlarla.'
  },
  'Herrenbekleidung': {
    title: 'Erkek Giyim İlanları - İkinci El & Sıfır | ExVitrin',
    description: 'ExVitrin\'de erkek giyim ilanları! İkinci el ve sıfır takım, gömlek, pantolon, ceket ve daha fazlası.'
  }
};

function getCategoryMeta(path) {
  // path örneği: /Emlak/Kiralik-Daireler ya da /Elektronik
  const parts = (path || '').replace(/^\//, '').split('/');
  const mainCat = parts[0] || '';
  const subCat = parts[1] || '';

  // Alt kategori varsa önce ona bak
  if (subCat && CATEGORY_META[subCat]) {
    return CATEGORY_META[subCat];
  }

  // Ana kategoriye bak
  if (mainCat && CATEGORY_META[mainCat]) {
    return CATEGORY_META[mainCat];
  }

  return null;
}

module.exports = async (req, res) => {
  const { id, type, path } = req.query;

  const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
  const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

  const SITE_URL = 'https://www.exvitrin.com';
  const LOGO_URL = `${SITE_URL}/logo_exvitrin_2026_small.png`;

  // Defaults (homepage-style)
  let title = 'ExVitrin - Ücretsiz İlanlar';
  let description = "Türkiye'nin en büyük ilan pazaryeri. Araba, emlak, elektronik, moda ve daha fazlasını alın ve satın.";
  let image = LOGO_URL;
  let imageWidth = '1200';
  let imageHeight = '630';
  let ogType = 'website';
  let pageUrl = SITE_URL;
  let keywords = 'ilan, ücretsiz ilan, ikinci el, satılık, kiralık, exvitrin';

  // --- KATEGORİ SAYFASI ---
  if (type === 'category' && path) {
    const meta = getCategoryMeta(path);
    if (meta) {
      title = meta.title;
      description = meta.description;
      keywords = meta.keywords || keywords;
    } else {
      // Generic fallback with path name
      const parts = path.replace(/^\//, '').split('/');
      const catName = parts[parts.length - 1].replace(/-/g, ' ');
      title = `${catName} İlanları - Satılık & Kiralık | ExVitrin`;
      description = `ExVitrin'de en güncel ${catName} ilanları! Uygun fiyatlarla satılık ve kiralık ${catName.toLowerCase()} ilanları.`;
    }
    pageUrl = `${SITE_URL}${path}`;
    image = LOGO_URL;

  // --- İLAN DETAY SAYFASI ---
  } else if (type === 'listing' && id) {
    if (!supabaseUrl || !supabaseKey) {
      return res.status(500).send('Server configuration error');
    }
    const supabase = createClient(supabaseUrl, supabaseKey);

    try {
      const { data, error } = await supabase
        .from('listings')
        .select('title, description, images, price, category, sub_category, condition, city')
        .eq('id', id)
        .single();

      if (!error && data) {
        let priceText = '';
        if (data.price && data.price > 0) {
          priceText = ' - ' + new Intl.NumberFormat('tr-TR', {
            style: 'currency',
            currency: 'TRY',
            maximumFractionDigits: 0
          }).format(data.price);
        } else if (data.price === 0) {
          priceText = ' - Ücretsiz';
        }

        title = `${data.title}${priceText} | ExVitrin`;

        const cleanDesc = data.description
          ? data.description.replace(/<[^>]+>/g, '').trim()
          : '';

        const parts = [];
        if (data.category) parts.push(data.category);
        if (data.condition) parts.push(data.condition);
        if (data.city) parts.push(data.city);

        const metaPrefix = parts.length > 0 ? parts.join(' • ') + ' | ' : '';
        const descBody = cleanDesc || "ExVitrin'de ilanı inceleyin.";
        description = (metaPrefix + descBody).substring(0, 160);
        image = (data.images && data.images.length > 0) ? data.images[0] : LOGO_URL;
        imageWidth = '1200';
        imageHeight = '630';
        ogType = 'product';
        pageUrl = `${SITE_URL}/product/${id}`;
      }
    } catch (err) {
      console.error('Error fetching listing data:', err);
    }

  // --- SATICI PROFİL SAYFASI ---
  } else if (type === 'seller' && id) {
    if (!supabaseUrl || !supabaseKey) {
      return res.status(500).send('Server configuration error');
    }
    const supabase = createClient(supabaseUrl, supabaseKey);

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, store_logo, avatar_url, bio, user_number')
        .eq('id', id)
        .single();

      if (!error && data) {
        const name = data.full_name || 'Satıcı';
        title = `${name} | ExVitrin`;
        const cleanBio = data.bio ? data.bio.replace(/<[^>]+>/g, '') : '';
        description = cleanBio
          ? cleanBio.substring(0, 160)
          : `${name} kullanıcısının ExVitrin'deki güncel ilanlarını inceleyin.`;
        image = data.store_logo || data.avatar_url || LOGO_URL;
        imageWidth = '400';
        imageHeight = '400';
        ogType = 'profile';
        pageUrl = `${SITE_URL}/seller/${data.user_number || id}`;
      }
    } catch (err) {
      console.error('Error fetching seller data:', err);
    }
  }

  const esc = (str) => String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  const html = `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}" />
  ${keywords ? `<meta name="keywords" content="${esc(keywords)}" />` : ''}

  <!-- Open Graph (Facebook, WhatsApp, LinkedIn, Telegram) -->
  <meta property="og:type" content="${esc(ogType)}" />
  <meta property="og:site_name" content="ExVitrin" />
  <meta property="og:url" content="${esc(pageUrl)}" />
  <meta property="og:title" content="${esc(title)}" />
  <meta property="og:description" content="${esc(description)}" />
  <meta property="og:image" content="${esc(image)}" />
  <meta property="og:image:width" content="${imageWidth}" />
  <meta property="og:image:height" content="${imageHeight}" />
  <meta property="og:locale" content="tr_TR" />

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="@exvitrin" />
  <meta name="twitter:url" content="${esc(pageUrl)}" />
  <meta name="twitter:title" content="${esc(title)}" />
  <meta name="twitter:description" content="${esc(description)}" />
  <meta name="twitter:image" content="${esc(image)}" />

  <meta http-equiv="refresh" content="0; url=${esc(pageUrl)}" />
  <link rel="canonical" href="${esc(pageUrl)}" />
</head>
<body>
  <p>${esc(description)}</p>
  <a href="${esc(pageUrl)}">Sayfaya Git</a>
</body>
</html>`;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=604800');
  res.status(200).send(html);
};
