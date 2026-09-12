import React from 'react';
import { Helmet } from 'react-helmet-async';
import { CATEGORY_META } from './config/categoryMeta';

const SITE_URL = 'https://www.exvitrin.com';

/**
 * Enhanced SEO component with Structured Data support
 */
export const SEO = ({ 
  title, 
  description, 
  keywords, 
  image, 
  url, 
  type = 'website',
  schema,
  breadcrumbs = []
}) => {
  const siteName = 'ExVitrin';
  const fullTitle = title ? `${title} | ${siteName}` : `${siteName} | İkinci El, Araba, Emlak ve Ücretsiz İlanlar`;
  const siteUrl = SITE_URL;
  
  // Normalize canonical URL: strip query parameters and hash, remove trailing slashes, enforce clean lowercase
  const rawPath = url || (typeof window !== 'undefined' ? window.location.pathname : '');
  const cleanPath = (rawPath || '')
    .split('?')[0]
    .split('#')[0]
    .replace(/\/+$/, '');
  const normalizedPath = cleanPath ? cleanPath.toLowerCase() : '';
  const canonicalUrl = normalizedPath ? `${siteUrl}${normalizedPath}` : siteUrl;

  // Global Organization Schema
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    'name': siteName,
    'url': siteUrl,
    'logo': `${siteUrl}/logo_exvitrin_2026_cropped.png`,
    'sameAs': [
      'https://facebook.com/exvitrin',
      'https://instagram.com/exvitrin',
      'https://twitter.com/exvitrin'
    ]
  };

  // WebSite Schema for Search Box
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    'url': siteUrl,
    'potentialAction': {
      '@type': 'SearchAction',
      'target': `${siteUrl}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string'
    }
  };

  // Breadcrumb Schema
  let breadcrumbSchema = null;
  if (breadcrumbs && breadcrumbs.length > 0) {
    breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': breadcrumbs
        .filter(crumb => crumb && crumb.name && crumb.url)
        .map((crumb, index) => {
          const absoluteUrl = crumb.url.startsWith('http') ? crumb.url : `${siteUrl}${crumb.url}`;
          return {
            '@type': 'ListItem',
            'position': index + 1,
            'item': {
              '@id': encodeURI(absoluteUrl),
              'name': crumb.name
            }
          };
        })
    };
  }

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      {image && <meta property="og:image" content={image} />}
      <meta property="og:site_name" content={siteName} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(websiteSchema)}
      </script>
      {breadcrumbSchema && (
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      )}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
};

export const CategorySEO = ({ category, subCategory, listingCount = 0 }) => {
  // Use custom SEO data if available
  const metaKey = subCategory ? subCategory : category;
  // Case-insensitive lookup: try exact key, then title-cased, then lowercased
  const customMeta = CATEGORY_META?.[metaKey]
    || CATEGORY_META?.[metaKey?.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('-')]
    || Object.entries(CATEGORY_META || {}).find(([k]) => k.toLowerCase() === (metaKey || '').toLowerCase())?.[1];

  const title = customMeta?.title || (subCategory 
    ? `${subCategory} İlanları - ${category}` 
    : `${category} İlanları - Satılık & Kiralık`);
    
  let description = customMeta?.description || (listingCount > 0
    ? `ExVitrin'de ${category} ${subCategory ? `/ ${subCategory}` : ''} kategorisinde ${listingCount} güncel ilan sizi bekliyor. En iyi fiyatlarla güvenle alışveriş yapın.`
    : `En güncel ${category} ${subCategory ? `(${subCategory})` : ''} ilanları ExVitrin'de. Ücretsiz ilan verin, hızlıca satın veya kiralayın.`);

  const keywords = customMeta?.keywords || `${category}, ${subCategory || ''}, ilanlar, satılık, kiralık, ikinci el, exvitrin`.replace(/, ,/g, ',');

  const cleanCat = (category || '')
    .replace(/&/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();

  const cleanSub = (subCategory || '')
    .replace(/&/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();

  const breadcrumbs = [
    { name: 'Ana Sayfa', url: '/' },
    { name: category, url: `/${cleanCat}` }
  ];
  
  if (subCategory) {
    breadcrumbs.push({ 
      name: subCategory, 
      url: `/${cleanCat}/${cleanSub}` 
    });
  }

  return (
    <SEO 
      title={title}
      description={description}
      keywords={keywords}
      breadcrumbs={breadcrumbs}
      url={`/${cleanCat}${cleanSub ? '/' + cleanSub : ''}`}
    />
  );
};

export const ProductSEO = ({ listing }) => {
  if (!listing) return null;

  const priceText = (listing.price && Number(listing.price) > 0)
    ? `${Number(listing.price).toLocaleString('tr-TR')} TL`
    : (listing.price === 0 || listing.price_type === 'giveaway' ? 'Ücretsiz' : (listing.price_type === 'negotiable' ? 'Pazarlıklı' : ''));

  // High-ranking SEO Title: "Nike Air Max 42 - 850 TL | İzmir (İkinci El)"
  const titleParts = [listing.title];
  if (priceText) titleParts.push(priceText);

  const subInfo = [];
  if (listing.city) subInfo.push(listing.city);
  if (listing.condition) {
    const condTr = listing.condition === 'neu' ? 'Sıfır' : (listing.condition === 'gebraucht' ? 'İkinci El' : (listing.condition === 'defekt' ? 'Arızalı' : listing.condition));
    subInfo.push(condTr);
  }
  const titleWithPrice = titleParts.join(' - ') + (subInfo.length > 0 ? ` | ${subInfo.join(' • ')}` : '');

  // Rich, unique meta description avoiding thin/duplicate content warnings
  const cleanBody = (listing.description || '').replace(/(<([^>]+)>)/gi, "").replace(/\s+/g, ' ').trim();
  const locationPrefix = listing.city ? `${listing.city}'de ` : '';
  const pricePrefix = priceText ? `${priceText} fiyatıyla ` : '';
  const categoryPrefix = listing.category ? `${listing.category} kategorisinde ` : '';
  const descriptionCleaned = `${listing.title} ${locationPrefix}${pricePrefix}ExVitrin'de! ${categoryPrefix}${cleanBody}`.substring(0, 160).trim();

  const firstImage = listing.images?.[0] || listing.image;
  const absoluteImage = firstImage
    ? (firstImage.startsWith('http') ? firstImage : `${SITE_URL}${firstImage}`)
    : `${SITE_URL}/logo_exvitrin_2026.png`;

  const listingUrl = listing.slug ? `/${listing.slug}` : `/product/${listing.id}`;

  const breadcrumbs = [
    { name: 'Ana Sayfa', url: '/' },
    ...(listing.city ? [{ name: listing.city, url: `/sehir/${listing.city.replace(/İ/g, 'i').replace(/I/g, 'i').replace(/ı/g, 'i').toLowerCase().replace(/[^a-z0-9]/g, '-')}` }] : []),
    ...(listing.category ? [{ name: listing.category, url: `/${listing.category.replace(/\s+/g, '-').toLowerCase()}` }] : []),
    { name: listing.title, url: listingUrl }
  ];

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    'name': listing.title,
    'description': descriptionCleaned,
    'image': absoluteImage,
    'sku': listing.id?.toString() || 'unknown',
    'brand': {
      '@type': 'Brand',
      'name': listing.category || 'İkinci El'
    },
    'offers': {
      '@type': 'Offer',
      'price': listing.price ? Number(listing.price).toFixed(2) : "0.00",
      'priceCurrency': 'TRY',
      'availability': 'https://schema.org/InStock',
      'itemCondition': listing.condition === 'neu' ? 'https://schema.org/NewCondition' : 'https://schema.org/UsedCondition',
      ...(listing.city ? { 'areaServed': listing.city } : {}),
      'hasMerchantReturnPolicy': {
        '@type': 'MerchantReturnPolicy',
        'returnPolicyCategory': 'https://schema.org/MerchantReturnNotPermitted',
        'applicableCountry': 'TR'
      },
      'shippingDetails': {
        '@type': 'OfferShippingDetails',
        'shippingRate': {
          '@type': 'MonetaryAmount',
          'value': '0.00',
          'currency': 'TRY'
        },
        'shippingDestination': {
          '@type': 'DefinedRegion',
          'addressCountry': 'TR'
        },
        'deliveryTime': {
          '@type': 'ShippingDeliveryTime',
          'handlingTime': {
            '@type': 'QuantitativeValue',
            'minValue': 0,
            'maxValue': 3,
            'unitCode': 'd'
          },
          'transitTime': {
            '@type': 'QuantitativeValue',
            'minValue': 1,
            'maxValue': 5,
            'unitCode': 'd'
          }
        }
      }
    }
  };

  return (
    <SEO 
      title={titleWithPrice}
      description={descriptionCleaned}
      image={absoluteImage}
      type="product"
      schema={productSchema}
      breadcrumbs={breadcrumbs}
      url={listingUrl}
      price={listing.price}
    />
  );
};

export const SellerSEO = ({ seller, listingCount = 0, averageRating = 0 }) => {
  if (!seller) return null;

  const name = seller.full_name || 'Satıcı';
  const title = `${name} Profili ve İlanları - ExVitrin`;
  const description = `${name} kullanıcısının ExVitrin'deki ${listingCount} güncel ilanını ve ${averageRating > 0 ? `${averageRating}/5 puanlı ` : ''}müşteri yorumlarını inceleyin.`;
  
  const keywords = `${name}, satıcı profili, ilanlar, exvitrin`;

  const breadcrumbs = [
    { name: 'Ana Sayfa', url: '/' },
    { name: 'Satıcılar', url: '/search' },
    { name: name, url: `/seller/${seller.id}` }
  ];

  return (
    <SEO 
      title={title}
      description={description}
      keywords={keywords}
      image={seller.store_logo || seller.avatar_url}
      breadcrumbs={breadcrumbs}
    />
  );
};

export default SEO;
