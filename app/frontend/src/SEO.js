import React from 'react';
import { Helmet } from 'react-helmet-async';

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
  const fullTitle = title ? `${title} | ${siteName}` : `${siteName} - Ücretsiz İlanlar`;
  const siteUrl = 'https://exvitrin.com';
  
  // Use window.location.pathname as a reliable fallback for canonical URL
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
  const finalUrl = url || currentPath;
  const canonicalUrl = `${siteUrl}${finalUrl}`;

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
      'itemListElement': breadcrumbs.map((crumb, index) => ({
        '@type': 'ListItem',
        'position': index + 1,
        'item': {
          '@id': crumb.url.startsWith('http') ? crumb.url : `${siteUrl}${crumb.url}`,
          'name': crumb.name
        }
      }))
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
  const title = subCategory 
    ? `${subCategory} İlanları - ${category}` 
    : `${category} İlanları - Satılık & Kiralık`;
    
  const description = listingCount > 0
    ? `ExVitrin'de ${category} ${subCategory ? `/ ${subCategory}` : ''} kategorisinde ${listingCount} güncel ilan sizi bekliyor. En iyi fiyatlarla güvenle alışveriş yapın.`
    : `En güncel ${category} ${subCategory ? `(${subCategory})` : ''} ilanları ExVitrin'de. Ücretsiz ilan verin, hızlıca satın veya kiralayın.`;

  const keywords = `${category}, ${subCategory || ''}, ilanlar, satılık, kiralık, ikinci el, exvitrin`.replace(/, ,/g, ',');

  const breadcrumbs = [
    { name: 'Ana Sayfa', url: '/' },
    { name: category, url: `/${category?.replace(/\s+/g, '-').toLowerCase()}` }
  ];
  
  if (subCategory) {
    breadcrumbs.push({ 
      name: subCategory, 
      url: `/${category?.replace(/\s+/g, '-').toLowerCase()}/${subCategory?.replace(/\s+/g, '-').toLowerCase()}` 
    });
  }

  return (
    <SEO 
      title={title}
      description={description}
      keywords={keywords}
      breadcrumbs={breadcrumbs}
      url={`/${category?.replace(/\s+/g, '-').toLowerCase()}${subCategory ? '/' + subCategory?.replace(/\s+/g, '-').toLowerCase() : ''}`}
    />
  );
};

export const ProductSEO = ({ listing }) => {
  if (!listing) return null;

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    'name': listing.title,
    'description': listing.description?.substring(0, 300) || '',
    'image': listing.images?.[0] || 'https://exvitrin.com/logo_exvitrin_2026.png',
    'offers': {
      '@type': 'Offer',
      'price': listing.price,
      'priceCurrency': 'TRY',
      'availability': 'https://schema.org/InStock'
    }
  };

  const breadcrumbs = [
    { name: 'Ana Sayfa', url: '/' },
    { name: listing.category, url: `/${listing.category?.replace(/\s+/g, '-').toLowerCase()}` },
    { name: listing.title, url: `/listing/${listing.id}` }
  ];

  const descriptionCleaned = (listing.description || '').replace(/(<([^>]+)>)/gi, "").substring(0, 160);

  return (
    <SEO 
      title={listing.title}
      description={descriptionCleaned}
      image={listing.images?.[0]}
      type="article"
      schema={productSchema}
      breadcrumbs={breadcrumbs}
      url={`/product/${listing.id}`}
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
