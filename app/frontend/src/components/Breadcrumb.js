import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

/**
 * Breadcrumb Navigation Component
 * Provides hierarchical navigation and SEO-friendly structured data
 * 
 * @param {Array} items - Array of breadcrumb items: [{ label, path, isActive }]
 * @example
 * <Breadcrumb items={[
 *   { label: 'Ana Sayfa', path: '/' },
 *   { label: 'Elektronik', path: '/category/elektronik' },
 *   { label: 'Laptoplar', path: '/category/laptoplar', isActive: true }
 * ]} />
 */
export const Breadcrumb = ({ items = [] }) => {
    const navigate = useNavigate();

    if (!items || items.length === 0) return null;

    // Generate JSON-LD structured data for SEO
    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": items.map((item, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": item.label,
            "item": item.path ? `https://exvitrin.com${item.path}` : undefined
        }))
    };

    return (
        <>
            {/* SEO Structured Data */}
            <Helmet>
                <script type="application/ld+json">
                    {JSON.stringify(breadcrumbSchema)}
                </script>
            </Helmet>

            {/* Breadcrumb UI */}
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm mb-4 flex-wrap">
                {items.map((item, index) => (
                    <React.Fragment key={index}>
                        {index > 0 && (
                            <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        )}
                        {item.isActive || !item.path ? (
                            <span className="text-gray-900 font-medium truncate max-w-xs" title={item.label}>
                                {item.label}
                            </span>
                        ) : (
                            <button
                                onClick={() => navigate(item.path)}
                                className="text-red-500 hover:text-red-600 hover:underline transition-colors truncate max-w-xs"
                                title={item.label}
                            >
                                {item.label}
                            </button>
                        )}
                    </React.Fragment>
                ))}
            </nav>
        </>
    );
};

export default Breadcrumb;
