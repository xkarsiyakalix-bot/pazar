import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, keywords, image, url, type = 'website', children }) => {
    const siteTitle = 'ExVitrin';
    const titleTemplate = `%s | ${siteTitle}`;
    const defaultTitle = `${siteTitle} - Ücretsiz İlanlar`;
    const defaultDescription = "Türkiye'nin en büyük ilan pazaryeri ExVitrin. İkinci el ve sıfır araba, emlak, elektronik, moda, mobilya ve çocuk eşyalarını güvenle alın ve satın.";
    const defaultKeywords = "ilan, ücretsiz ilan, ikinci el, sıfır, yeni, sahibinden, alım satım, araba, emlak, elektronik, moda, mobilya, çocuk eşyası, iş ilanları, türkiye, güvenli alışveriş";

    const metaDescription = description || defaultDescription;
    const metaKeywords = keywords || defaultKeywords;
    const currentUrl = typeof window !== 'undefined' ? window.location.origin + window.location.pathname + window.location.search : 'https://exvitrin.com/';
    const metaUrl = url || currentUrl;

    const siteName = 'ExVitrin';

    // Structured Data for Organization
    const metaImage = image || '/logo_exvitrin_2026.png';

    const schemaData = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "ExVitrin",
        "url": "https://exvitrin.com",
        "logo": "https://exvitrin.com/logo_exvitrin_2026.png",
        "sameAs": [
            "https://www.facebook.com/exvitrin",
            "https://www.twitter.com/exvitrin",
            "https://www.instagram.com/exvitrin"
        ],
        "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+90-212-1234567",
            "contactType": "customer service",
            "areaServed": "TR",
            "availableLanguage": "Turkish"
        }
    };

    return (
        <Helmet
            title={title}
            titleTemplate={titleTemplate}
            defaultTitle={defaultTitle}
        >
            <link rel="canonical" href={metaUrl} />
            <meta name="description" content={metaDescription} />
            <meta name="keywords" content={metaKeywords} />
            <meta property="og:type" content={type} />
            <meta property="og:url" content={metaUrl} />
            <meta property="og:title" content={title ? `${title} | ${siteTitle}` : defaultTitle} />
            <meta property="og:description" content={metaDescription} />
            <meta property="og:image" content={metaImage} />
            <meta property="og:site_name" content={siteName} />

            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:creator" content="@ExVitrin" />
            <meta name="twitter:title" content={title ? `${title} | ${siteTitle}` : defaultTitle} />
            <meta name="twitter:description" content={metaDescription} />
            <meta name="twitter:image" content={metaImage} />

            <script type="application/ld+json">
                {JSON.stringify(schemaData)}
            </script>

            {children}
        </Helmet>
    );
};

// Ürün detay sayfası için özel SEO
export const ProductSEO = ({ product }) => {
    if (!product) return <SEO />;

    const productSchema = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": product.title,
        "image": product.image,
        "description": product.description,
        "offers": {
            "@type": "Offer",
            "price": String(product.price || '0').replace(' TL', '').replace(/\s/g, '').replace(/\./g, '').replace(',', '.'),
            "priceCurrency": "TRY",
            "itemCondition": product.condition === 'Yeni' ? "https://schema.org/NewCondition" : "https://schema.org/UsedCondition",
            "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            "seller": {
                "@type": "Person",
                "name": product.seller
            }
        },
        "category": product.category
    };

    // Use only product title for SEO
    const pageTitle = product.title;

    return (
        <SEO
            title={pageTitle}
            description={`${product.title} - ${product.price} - Hemen ExVitrin'de keşfedin! ${product.description ? product.description.substring(0, 100) : ''}...`}
            keywords={`${product.category}, ${product.title}, ikinci el, sıfır, satın al, ${product.location}, ilan`}
            image={product.image}
            type="product"
        >
            <script type="application/ld+json">
                {JSON.stringify(productSchema)}
            </script>
        </SEO>
    );
};

// Arama sonuçları için SEO
export const SearchSEO = ({ query, resultsCount }) => (
    <SEO
        title={`"${query}" için arama sonuçları`}
        description={`"${query}" için ${resultsCount} sonuç bulundu. ExVitrin'deki en iyi teklifleri keşfedin.`}
        keywords={`${query}, ilanlar, ara, satın al`}
    />
);

// Kategori sayfası için SEO
export const CategorySEO = ({ category, subCategory, itemCount }) => {
    const displayCategory = subCategory ? `${category} > ${subCategory}` : category;
    const keywords = subCategory
        ? `${subCategory}, ${category}, ilanlar, satın al, satış, uygun fiyat`
        : `${category}, ilanlar, satın al, satış, uygun fiyat`;

    return (
        <SEO
            title={`${displayCategory} İlanları`}
            description={`ExVitrin'de ${itemCount} adet ${displayCategory} ilanı bulundu. ${displayCategory} ürünlerini kolayca ve uygun fiyata alın veya satın.`}
            keywords={keywords}
        />
    );
};

export default SEO;
