import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({
    title = 'LokalPazar - Ücretsiz İlanlar',
    description = 'LokalPazar Türkiye\'nin en büyük ilan pazaryeridir. Araba, emlak, elektronik, moda ve çok daha fazlasını keşfedin.',
    keywords = 'ilan, ücretsiz ilan, alım satım, araba, emlak, elektronik, moda, mobilya, iş ilanları, türkiye',
    image = '/logo512.png',
    url = typeof window !== 'undefined' ? window.location.href : '',
    type = 'website',
    children
}) => {
    const siteName = 'LokalPazar';
    const fullTitle = title.includes(siteName) ? title : `${title} | ${siteName}`;

    // Structured Data for Organization
    const organizationSchema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": siteName,
        "url": "https://lokalpazar.com",
        "logo": "https://lokalpazar.com/logo512.png",
        "sameAs": [
            "https://www.facebook.com/lokalpazar",
            "https://www.twitter.com/lokalpazar",
            "https://www.instagram.com/lokalpazar"
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
        <Helmet>
            {/* Basic Meta Tags */}
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />
            <meta name="author" content={siteName} />
            <meta name="robots" content="index, follow" />
            <meta name="googlebot" content="index, follow" />
            <meta name="language" content="Turkish" />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={url} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />
            <meta property="og:site_name" content={siteName} />
            <meta property="og:locale" content="tr_TR" />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content={url} />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />

            {/* Canonical URL */}
            <link rel="canonical" href={url} />

            {/* Structured Data */}
            <script type="application/ld+json">
                {JSON.stringify(organizationSchema)}
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
            "price": String(product.price || '0').replace('₺', '').replace(/\s/g, '').replace(/\./g, '').replace(',', '.'),
            "priceCurrency": "TRY",
            "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            "seller": {
                "@type": "Person",
                "name": product.seller
            }
        },
        "category": product.category
    };

    return (
        <SEO
            title={product.title}
            description={product.description || `${product.title} - ${product.price} - Hemen LokalPazar'da keşfedin!`}
            keywords={`${product.category}, ${product.title}, satın al, ${product.location}, ilan`}
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
        description={`"${query}" için ${resultsCount} sonuç bulundu. LokalPazar'daki en iyi teklifleri keşfedin.`}
        keywords={`${query}, ilanlar, ara, satın al`}
    />
);

// Kategori sayfası için SEO
export const CategorySEO = ({ category, itemCount }) => (
    <SEO
        title={`${category} İlanları`}
        description={`LokalPazar'da ${itemCount} adet ${category} ilanı bulundu. ${category} ürünlerini kolayca ve uygun fiyata alın veya satın.`}
        keywords={`${category}, ilanlar, satın al, satış, uygun fiyat`}
    />
);

export default SEO;
