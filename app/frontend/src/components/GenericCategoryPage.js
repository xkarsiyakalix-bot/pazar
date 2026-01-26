import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { CategoryGallery, HorizontalListingCard, getCategoryPath } from '../components.js';
import LoadingSpinner from '../components/LoadingSpinner';
import { LazyImage } from '../LazyLoad';
import { CategorySEO } from '../SEO';
import { fetchCategoryStats } from '../api/listings';
import { useListings } from '../hooks/useListings';
import { t, getCategoryTranslation, getGenericTranslation } from '../translations';
import { checkIfSearchIsSaved, createSavedSearch, deleteSavedSearchByUrl } from '../api/savedSearches';

const formatPriceDisplay = (val) => {
    if (!val) return '';
    const numeric = val.toString().replace(/\D/g, '');
    return numeric.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

const GenericCategoryPage = ({
    category,
    subCategory,
    pageTitle,
    bannerConfig = {},
    filterConfig = {},
    toggleFavorite,
    isFavorite,
    subCategories = [],
    categories = [], // Optional categories prop if needed
    showDescription = true,
    layoutVariant = 'standard', // 'standard' | 'compact'
    hidePrice = false,
    renderCustomFields
}) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();
    const [statsListings, setStatsListings] = useState([]);
    const [isSaved, setIsSaved] = useState(false);
    const [savedSearchId, setSavedSearchId] = useState(null);
    const [savingSearch, setSavingSearch] = useState(false);

    // 1. Derive active filters directly from URL
    const getActiveFiltersFromURL = () => {
        const currentFilters = {};
        console.log('DEBUG: Parsing URL Params', searchParams.toString());
        console.log('DEBUG: Available FilterConfig Keys:', Object.keys(filterConfig));

        for (const [key, value] of searchParams.entries()) {
            const config = filterConfig[key];
            const type = config?.type;
            console.log(`DEBUG: checking key [${key}]. Config found? ${!!config}. Type: ${type}`);

            if (type === 'multiselect') {
                currentFilters[key] = value.split(',');
                console.log(`DEBUG: Parsed multiselect [${key}]:`, currentFilters[key]);
            } else if (type === 'checkbox') {
                currentFilters[key] = value === 'true';
            } else if (key.endsWith('From') || key.endsWith('To')) {
                currentFilters[key] = value;
            } else {
                currentFilters[key] = value;
            }
        }
        return currentFilters;
    };

    const activeFilters = getActiveFiltersFromURL();

    // 2. Local state for range inputs (to allow typing without URL spam)
    const [localFilters, setLocalFilters] = useState(activeFilters);

    // Sync local state when URL changes (e.g. Back button)
    useEffect(() => {
        setLocalFilters(getActiveFiltersFromURL());
    }, [searchParams]);

    // Construct server-side filters
    const serverFilters = {};

    // 1. Process standard filters that might not be in filterConfig but are common
    if (activeFilters.priceFrom) serverFilters.min_price = activeFilters.priceFrom;
    if (activeFilters.priceTo) serverFilters.max_price = activeFilters.priceTo;

    // 2. Map filters from filterConfig
    Object.keys(filterConfig).forEach(key => {
        const config = filterConfig[key];
        const apiField = config.field || key;
        const value = activeFilters[key];

        if (config.type === 'range') {
            const from = activeFilters[`${key}From`];
            const to = activeFilters[`${key}To`];

            if (apiField === 'price') {
                if (from) serverFilters.min_price = from;
                if (to) serverFilters.max_price = to;
            } else if (apiField === 'hourly_wage') {
                if (from) serverFilters.hourly_wage_min = from;
                if (to) serverFilters.hourly_wage_max = to;
            } else {
                if (from) serverFilters[`${apiField}_min`] = from;
                if (to) serverFilters[`${apiField}_max`] = to;
            }
        } else if (value) {
            // Handle multiselect vs single value
            const apiValue = Array.isArray(value) ? value.join(',') : value;
            serverFilters[apiField] = apiValue;
        }
    });

    const { listings, loading, hasMore, loadMore } = useListings(category, subCategory, 1, 20, serverFilters);

    useEffect(() => {
        console.log(`[DEBUG] GenericCategoryPage (${category}${subCategory ? ` > ${subCategory}` : ''}):`, {
            listingsCount: listings.length,
            activeFilters,
            searchParams: Object.fromEntries(searchParams.entries())
        });
    }, [listings, activeFilters, category, subCategory, searchParams]);

    // Load stats for sidebar counts
    useEffect(() => {
        const loadStats = async () => {
            if (category) {
                console.log('Fetching stats for category:', category, 'subCategory:', subCategory);
                const data = await fetchCategoryStats(category, subCategory);
                console.log('Fetched stats data:', data);
                if (data.length > 0) {
                    console.log('Sample listing sub_category:', data[0].sub_category);
                }
                setStatsListings(data);
            }
        };
        loadStats();
    }, [category, subCategory]);

    // Check if current search is saved
    useEffect(() => {
        const checkSavedStatus = async () => {
            try {
                const currentUrl = location.pathname + location.search;
                const savedSearch = await checkIfSearchIsSaved(currentUrl);
                if (savedSearch) {
                    setIsSaved(true);
                    setSavedSearchId(savedSearch.id);
                } else {
                    setIsSaved(false);
                    setSavedSearchId(null);
                }
            } catch (error) {
                console.error('Error checking saved search:', error);
            }
        };
        checkSavedStatus();
    }, [location.pathname, location.search]);

    // Helper to update URL params
    const updateURL = (newParams) => {
        const nextParams = new URLSearchParams(searchParams);

        Object.entries(newParams).forEach(([key, value]) => {
            if (value === null || value === undefined || value === '' || value === false || (Array.isArray(value) && value.length === 0)) {
                nextParams.delete(key);
            } else if (Array.isArray(value)) {
                // Filter out empty values and join
                const validValues = value.filter(Boolean);
                if (validValues.length > 0) {
                    nextParams.set(key, validValues.join(','));
                } else {
                    nextParams.delete(key);
                }
            } else {
                nextParams.set(key, value);
            }
        });

        setSearchParams(nextParams, { replace: false }); // Push to history
    };

    // Handler for immediate updates (Checkboxes, Selects, Radio)
    const handleFilterChange = (key, value) => {
        const config = filterConfig[key];

        if (config?.type === 'multiselect') {
            // Use activeFilters which is already parsed from URL
            const current = activeFilters[key] || [];
            // Ensure we have an array
            let currentArray = [];
            if (Array.isArray(current)) {
                currentArray = [...current];
            } else if (typeof current === 'string') {
                currentArray = current.includes(',') ? current.split(',') : (current ? [current] : []);
            }

            // Toggle logic
            const newValue = currentArray.includes(value)
                ? currentArray.filter(v => v !== value)
                : [...currentArray, value];

            console.log(`DEBUG: handleFilterChange multiselect [${key}]. Current:`, currentArray, 'New:', newValue);
            updateURL({ [key]: newValue });
        } else {
            // For single select, allow deselecting by clicking again
            if (activeFilters[key] === value) {
                updateURL({ [key]: '' });
            } else {
                updateURL({ [key]: value });
            }
        }
    };

    // Handler for local input changes (Ranges)
    const handleRangeChange = (key, value) => {
        setLocalFilters(prev => ({ ...prev, [key]: value }));
    };

    // Handler to commit local changes to URL (onBlur)
    const commitRange = (key, value) => {
        updateURL({ [key]: value });
    };

    const resetFilters = () => {
        setSearchParams(new URLSearchParams()); // Clear all params
    };

    const clearFilter = (key) => {
        const config = filterConfig[key];
        if (config.type === 'range') {
            updateURL({ [`${key}From`]: '', [`${key}To`]: '' });
        } else {
            updateURL({ [key]: '' });
        }
    };

    // Helper to get field name from config or common mappings
    const getListingField = (key) => {
        const config = filterConfig[key] || {};
        if (config.field) return config.field;

        const mappings = {
            'location': 'federal_state',
            'federalState': 'federal_state',
            'providerType': 'seller_type',
            'sellerType': 'seller_type',
            'zustand': 'condition',
            'condition': 'condition',
            'offerType': 'offer_type',
            'offer_type': 'offer_type',
            'price': 'price'
        };
        return mappings[key] || key;
    };

    // Helper to safely get value from listing with support for both snake_case and camelCase
    const getListingValue = (listing, field) => {
        if (!listing) return null;

        // Try direct field name
        let val = listing[field];

        // If not found, try normalized check (case-insensitive, skip underscores)
        if (val === undefined) {
            const normalizedField = field.toLowerCase().replace(/_/g, '');
            const actualKey = Object.keys(listing).find(k => {
                const normalizedK = k.toLowerCase().replace(/_/g, '');
                return normalizedK === normalizedField;
            });
            if (actualKey) val = listing[actualKey];
        }

        // Special mappings
        if (val === undefined && field === 'area') {
            val = listing.living_space || listing.plot_area || listing.total_area;
        }

        return typeof val === 'string' ? val.trim() : val;
    };

    // Helper to check if a listing matches a specific filter
    const matchesFilterValue = (listing, key, filterValue) => {
        const config = filterConfig[key];
        if (!config) return true;

        const field = config.field || getListingField(key);
        const listingValue = getListingValue(listing, field);

        // Robust string normalization helper
        const normalize = (val) => {
            if (val === null || val === undefined) return '';
            return String(val)
                .toLowerCase()
                .trim()
                .replace(/\s+/g, ' ')           // Collapse multiple spaces
                .replace(/\s*&\s*/g, ' & ')     // Normalize ampersand spacing
                .replace(/\s*-\s*/g, '-')       // Normalize hyphen spacing
                .replace(/&amp;/g, '&');        // Handle HTML entities if any
        };

        if (config.type === 'range') {
            const from = activeFilters[`${key}From`];
            const to = activeFilters[`${key}To`];
            const fromVal = from ? parseFloat(from.toString().replace(',', '.')) : null;
            const toVal = to ? parseFloat(to.toString().replace(',', '.')) : null;
            if (fromVal !== null && !isNaN(fromVal) && (listingValue === null || parseFloat(listingValue) < fromVal)) return false;
            if (toVal !== null && !isNaN(toVal) && (listingValue === null || parseFloat(listingValue) > toVal)) return false;
            return true;
        }

        // For non-range filters, filterValue is what we are checking against
        // If filterValue is not provided, we check against activeFilters[key]
        const targetValues = filterValue !== undefined
            ? (Array.isArray(filterValue) ? filterValue : [filterValue])
            : (activeFilters[key] ? (Array.isArray(activeFilters[key]) ? activeFilters[key] : [activeFilters[key]]) : []);

        if (targetValues.length === 0) return true;

        return targetValues.some(val => {
            const targetVal = normalize(val);

            // Support for array-based fields (e.g., amenities, features)
            if (Array.isArray(listingValue)) {
                return listingValue.some(lv => lv && normalize(lv) === targetVal);
            }

            // Fallback for stringified arrays "[item1, item2]"
            if (typeof listingValue === 'string' && listingValue.startsWith('[') && listingValue.endsWith(']')) {
                try {
                    const parsed = JSON.parse(listingValue);
                    if (Array.isArray(parsed)) {
                        return parsed.some(lv => normalize(lv) === targetVal);
                    }
                } catch (e) { /* ignore */ }
            }

            const listingValStr = normalize(listingValue);

            // 1. Direct match (Normalized)
            if (listingValStr === targetVal) return true;

            // 2. Fallback for comma-separated strings (only if direct match failed)
            if (typeof listingValue === 'string' && listingValue.includes(',') && !config.type?.includes('range')) {
                const parts = listingValue.split(',').map(p => normalize(p));
                if (parts.includes(targetVal)) return true;
            }

            // Privat synonym
            if (targetVal === 'privat' || targetVal === 'privatnutzer') {
                return listingValStr === 'privat' || listingValStr === 'privatnutzer';
            }
            // Gewerblich synonym
            if (targetVal === 'gewerblich' || targetVal === 'gewerblicher nutzer') {
                return listingValStr === 'gewerblich' || listingValStr === 'gewerblicher nutzer';
            }
            // Versand logic
            if (key === 'versand') {
                if (targetVal === 'versand möglich' || targetVal === 'kargo mümkün') {
                    return listingValStr === 'true' || listingValStr === 'versand möglich' || listingValStr === 'kargo mümkün';
                }
                if (targetVal === 'nur abholung' || targetVal === 'sadece elden teslim') {
                    return !listingValStr || listingValStr === 'false' || listingValStr === 'nur abholung' || listingValStr === 'sadece elden teslim';
                }
            }

            // Month matching (YYYY-MM)
            if (config.type === 'month' && targetVal && listingValStr) {
                return listingValStr.startsWith(targetVal);
            }

            // Default match
            return listingValStr === targetVal;
        });
    };

    // Helper to check if subcategories are equivalent (Bilingual Support)
    const areSubCategoriesEquivalent = (sub1, sub2) => {
        if (!sub1 || !sub2) return sub1 === sub2;

        const normalize = s => String(s).toLowerCase().trim();
        const n1 = normalize(sub1);
        const n2 = normalize(sub2);

        if (n1 === n2) return true;

        // Bilingual Mappings (Manual for now to ensure visibility)
        const mappings = [
            ['bilgisayar kursları', 'computerkurse'],
            ['ezoterizm & spiritüalizm', 'esoterik & spirituelles'],
            ['yemek & pastacılık', 'yemek & pastacılık kursları', 'kochen & backen'],
            ['sanat & tasarım', 'sanat & tasarım kursları', 'kunst & gestaltung'],
            ['müzik & şan', 'müzik & şan dersleri', 'musik & gesang'],
            ['özel ders', 'nachhilfe'],
            ['spor kursları', 'sportkurse'],
            ['dil kursları', 'sprachkursları'],
            ['dans kursları', 'tanzkurse'],
            ['güzellik & sağlık', 'kosmetik & pflege', 'beauty & gesundheit', 'kişisel bakım & sağlık'],
            ['kıyafetler', 'kleidung'],
            ['damenbekleidung', 'damenmode', 'kadın giyimi', 'kadın giyim'],
            ['herrenbekleidung', 'herrenmode', 'erkek giyimi', 'erkek giyim'],
            ['ayakkabılar', 'schuhe'],
            ['damenschuhe', 'kadın ayakkabıları', 'kadın ayakkabı'],
            ['herrenschuhe', 'erkek ayakkabıları', 'erkek ayakkabı'],
            ['taschen & accessoires', 'çanta & aksesuarlar', 'çanta & aksesuar'],
            ['uhren & schmuck', 'saat & takı'],
            ['diğer moda & güzellik', 'weiteres moda & beauty', 'sonstige mode & beauty', 'diğer'],
            ['sürekli eğitim', 'weiterbildung'],
            ['diğer eğitim & kurslar', 'diğer dersler & kurslar', 'weitere unterricht & kurse'],
            ['oyuncaklar', 'oyuncak', 'spielzeug'],
            // Pet mappings
            ['balıklar', 'balık', 'fische'],
            ['köpekler', 'köpek', 'hunde'],
            ['kediler', 'kedi', 'katzen'],
            ['küçük hayvanlar', 'küçükbaş hayvanlar', 'kleintiere'],
            ['çiftlik hayvanlar', 'kümes hayvanları', 'nutztiere'],
            ['atlar', 'at', 'pferde'],
            ['kuşlar', 'kuş', 'vögel'],
            ['aksesuarlar', 'hayvan aksesuarları', 'zubehör'],
            // Real Estate mappings
            ['kiralık daireler', 'mietwohnungen'],
            ['satılık daireler', 'eigentumswohnungen'],
            ['kiralık evler', 'häuser zur miete'],
            ['satılık evler', 'häuser zum kauf'],
            // Service mappings
            ['otomobil, bisiklet & tekne', 'otomobil, bisiklet & tekne servisi', 'oto, bisiklet & tekne servisi', 'auto, rad & boot'],
            ['yaşlı bakımı', 'seniorenbetreuung'],
            ['bebek bakıcısı & kreş', 'babysitter & çocuk bakımı', 'babysitter/-in & kinderbetreuung'],
            ['elektronik', 'elektronik servisler', 'elektronik hizmetler', 'dienstleistungen elektronik'],
            ['cep telefonu & aksesuar', 'cep telefonu & telefon', 'handy & telefon'],
            ['beyaz eşya & ev aletleri', 'ev aletleri', 'haushaltsgeräte'],
            ['oyun konsolları', 'konsollar', 'konsolen'],
            ['dizüstü bilgisayarlar', 'dizüstü bilgisayar', 'notebooks'],
            ['bilgisayar aksesuar & yazılım', 'bilgisayar aksesuarları & yazılım', 'pc-zubehör & software'],
            ['bilgisayarlar', 'masaüstü bilgisayar', 'pcs'],
            ['tabletler & e-okuyucular', 'tablet & e-okuyucu', 'tablets & reader'],
            ['ev & bahçe', 'ev & bahçe hizmetleri', 'haus & garten', 'ev hizmetleri'],
            ['sanatçılar & müzisyenler', 'sanatçı & müzisyen', 'künstler & musiker'],
            ['seyahat & etkinlik', 'seyahat & etkinlik hizmetleri', 'reise & veranstaltungen'],
            ['hayvan bakımı & eğitimi', 'tierbetreuung & training'],
            ['taşımacılık & nakliye', 'umzug & transport'],
            ['taşımacılık & nakliye', 'umzug & transport'],
            ['diğer hizmetler', 'weitere dienstleistungen'],
            ['ticari emlak', 'gewerbeimmobilien', 'ticari mülk', 'gewerbe']
        ];

        return mappings.some(group => group.includes(n1) && group.includes(n2));
    };

    // Calculate dynamic counts for sidebar options
    const getFilterCount = (key, optionValue) => {
        const sourceListings = statsListings.length > 0 ? statsListings : listings;
        // const subCatNormal = String(subCategory || '').trim().toLowerCase(); // REMOVED strict check

        return sourceListings.filter(listing => {
            // 1. Basic category/subcategory context
            const listingSubCat = getListingValue(listing, 'sub_category');
            if (subCategory && !areSubCategoriesEquivalent(listingSubCat, subCategory)) return false;

            // 2. Cross-filtering logic:
            // Match the specific option being counted
            if (!matchesFilterValue(listing, key, optionValue)) return false;

            // 3. Match all OTHER active filters
            for (const otherKey of Object.keys(filterConfig)) {
                if (otherKey === key) continue; // Skip current filter group
                if (!matchesFilterValue(listing, otherKey)) return false;
            }

            return true;
        }).length;
    };

    // Filter listings for the main panel
    const filteredListings = listings.filter(listing => {
        const listingSubCat = getListingValue(listing, 'sub_category');
        if (subCategory && !areSubCategoriesEquivalent(listingSubCat, subCategory)) return false;

        for (const key of Object.keys(filterConfig)) {
            if (!matchesFilterValue(listing, key)) return false;
        }
        return true;
    });

    // Sort listings: Premium (z_premium) first, then z_multi_bump, then is_top, then highlighted, then newest
    // Explicit sorting logic fixed to ensure initialization order
    const sortedListings = [...filteredListings].sort((a, b) => {
        // Priority: z_premium > z_multi_bump > other is_top > highlighted > basic
        const getPriority = (l) => {
            const type = l.package_type?.toLowerCase();
            if (type === 'z_premium' || type === 'premium') return 100;
            if (type === 'z_multi_bump' || type === 'multi-bump') return 80;
            if (l.is_top) return 50;
            if (l.is_highlighted || type === 'highlight' || type === 'budget') return 10;
            return 0;
        };

        const prioA = getPriority(a);
        const prioB = getPriority(b);

        if (prioA !== prioB) return prioB - prioA;
        return new Date(b.created_at) - new Date(a.created_at);
    });

    // Subcategory Count Helper
    const getSubcategoryCount = (subName) => {
        const source = statsListings.length > 0 ? statsListings : listings;
        if (subName === 'Alle' || subName === 'Tümü') return source.length;
        return source.filter(l => areSubCategoriesEquivalent(getListingValue(l, 'sub_category'), subName)).length;
    };

    // Total Count Helper (Factor in all filters)
    const getTotalCount = () => {
        const source = statsListings.length > 0 ? statsListings : listings;
        return source.filter(listing => {
            // Priority 1: Category/Subcategory context
            const listingSubCat = getListingValue(listing, 'sub_category');
            if (subCategory && !areSubCategoriesEquivalent(listingSubCat, subCategory)) return false;

            // Priority 2: Active Filters
            for (const key of Object.keys(filterConfig)) {
                if (!matchesFilterValue(listing, key)) return false;
            }
            return true;
        }).length;
    };

    // New helper for static total count (shown in sidebar)
    const getStaticTotalCount = () => {
        const source = statsListings.length > 0 ? statsListings : listings;

        return source.filter(listing => {
            const listingSubCat = getListingValue(listing, 'sub_category');
            if (subCategory && !areSubCategoriesEquivalent(listingSubCat, subCategory)) return false;
            return true;
        }).length;
    };

    const getActiveFilterCount = () => {
        let count = 0;
        Object.keys(filterConfig).forEach(key => {
            const config = filterConfig[key];
            if (config.type === 'range') {
                if (activeFilters[`${key}From`] || activeFilters[`${key}To`]) count++;
            } else if (config.type === 'checkbox') {
                if (activeFilters[key]) count++;
            } else if (config.type === 'multiselect') {
                if (activeFilters[key] && activeFilters[key].length > 0) count++;
            } else {
                if (activeFilters[key]) count++;
            }
        });
        return count;
    };

    // ...

    // Get active filter labels for display
    const getActiveFilters = () => {
        const active = [];
        Object.keys(filterConfig).forEach(key => {
            const config = filterConfig[key];
            if (config.type === 'range') {
                const from = activeFilters[`${key}From`];
                const to = activeFilters[`${key}To`];
                if (from || to) {
                    active.push({
                        key,
                        label: getGenericTranslation(config.label),
                        value: `${from || '0'} - ${to || '∞'}`
                    });
                }
            } else if (config.type === 'checkbox') {
                if (activeFilters[key]) {
                    active.push({
                        key,
                        label: getGenericTranslation(config.label),
                        value: 'Aktif'
                    });
                }
            } else if (config.type === 'multiselect') {
                if (activeFilters[key] && activeFilters[key].length > 0) {
                    // For display, just show count or "Multiple"
                    const displayValue = activeFilters[key].map(v => {
                        const option = config.options?.find(opt => (typeof opt === 'string' ? opt : opt.value) === v);
                        const optLabel = typeof option === 'string' ? option : option?.label || v;
                        return (typeof option === 'object' && option?.displayLabel) || getGenericTranslation(optLabel);
                    }).join(', ');

                    active.push({
                        key,
                        label: getGenericTranslation(config.label),
                        value: displayValue
                    });
                }
            } else {
                if (activeFilters[key]) {
                    const option = config.options?.find(opt =>
                        (typeof opt === 'string' ? opt : opt.value) === activeFilters[key]
                    );
                    const displayValue = (typeof option === 'object' && option?.displayLabel) || getGenericTranslation(typeof option === 'string' ? option : option?.label || activeFilters[key]);
                    active.push({
                        key,
                        label: getGenericTranslation(config.label),
                        value: displayValue
                    });
                }
            }
        });
        return active;
    };





    return (
        <div className="min-h-screen bg-gray-50">
            {/* Debug Probe - Only visible if ?debug=true is in URL */}
            {searchParams.get('debug') === 'true' && (
                <div className="fixed top-0 left-0 w-full h-full bg-white z-[9999] overflow-auto p-10 font-mono text-xs border-4 border-red-500">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold text-red-600">DEBUG MODE</h1>
                        <button
                            onClick={() => {
                                const newParams = new URLSearchParams(searchParams);
                                newParams.delete('debug');
                                setSearchParams(newParams);
                            }}
                            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                        >
                            Close Debug
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-6 mb-6">
                        <div className="bg-blue-50 p-4 rounded border border-blue-200">
                            <h3 className="font-bold text-lg mb-2">Current Context</h3>
                            <div><strong>Category Prop:</strong> {category}</div>
                            <div><strong>SubCategory Prop:</strong> {subCategory || 'NULL'}</div>
                            <div><strong>Page Title:</strong> {pageTitle}</div>
                            <div><strong>Active Filters:</strong> {JSON.stringify(activeFilters)}</div>
                        </div>
                        <div className="bg-green-50 p-4 rounded border border-green-200">
                            <h3 className="font-bold text-lg mb-2">Data Stats</h3>
                            <div><strong>Listings Count (Main):</strong> {listings.length}</div>
                            <div><strong>Stats Listings Count:</strong> {statsListings.length}</div>
                            <div><strong>Filtered Listings Count:</strong> {filteredListings.length}</div>
                            <div><strong>Loading:</strong> {loading ? 'YES' : 'NO'}</div>
                        </div>
                    </div>

                    <div className="mb-6">
                        <h2 className="text-xl font-bold mb-2">Distinct Categories Found (in this view):</h2>
                        <pre className="bg-gray-100 p-4 rounded overflow-auto">
                            {JSON.stringify([...new Set(listings.map(l => l.category))], null, 2)}
                        </pre>
                    </div>

                    <div className="mb-6">
                        <h2 className="text-xl font-bold mb-2">Distinct Subcategories Found (in this view):</h2>
                        <pre className="bg-gray-100 p-4 rounded overflow-auto">
                            {JSON.stringify([...new Set(listings.map(l => l.sub_category))], null, 2)}
                        </pre>
                    </div>

                    <div>
                        <h2 className="text-xl font-bold mb-2">First 5 Listings (Raw Data):</h2>
                        <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-[500px]">
                            {JSON.stringify(listings.slice(0, 5), null, 2)}
                        </pre>
                    </div>
                </div>
            )}

            <CategorySEO category={category} subCategory={subCategory} itemCount={listings.length} />
            <div className="max-w-[1400px] mx-auto px-4 py-6">
                <div className="flex gap-6">
                    {/* Left Sidebar - Filter Panel */}
                    <aside className="w-96 flex-shrink-0 bg-white rounded-2xl shadow-lg p-6 h-fit sticky top-6">
                        {/* Category Navigation */}
                        <div className="mb-6 pb-6 border-b border-gray-200">
                            <h3 className="font-bold bg-gradient-to-r from-pink-600 to-red-600 bg-clip-text text-transparent mb-3 text-base">{t.filters.categories}</h3>
                            <button
                                onClick={() => navigate('/Butun-Kategoriler')}
                                className="w-full text-left px-3 py-2 rounded-lg text-sm transition-all bg-gray-100 text-gray-700 hover:bg-gray-200 flex items-center justify-between group"
                            >
                                <span>{t.filters.allCategories}</span>
                                <svg className="w-4 h-4 text-gray-400 group-hover:text-red-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>

                            <div className="space-y-2 mt-3">
                                <button
                                    onClick={() => {
                                        navigate(getCategoryPath(category));
                                    }}
                                    className={`text-left px-3 py-2 rounded-lg text-sm transition-all flex items-center justify-between ml-4 ${subCategory ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : 'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-md'}`}
                                    style={{ width: 'calc(100% - 1rem)' }}
                                >
                                    <span>{getCategoryTranslation(category)}</span>
                                    <svg className="w-4 h-4 text-gray-400 group-hover:text-red-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                                {subCategory && (
                                    <div
                                        className="text-left px-3 py-2 rounded-lg text-sm transition-all bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-md flex items-center justify-between ml-8"
                                        style={{ width: 'calc(100% - 2rem)' }}
                                    >
                                        <span>{getCategoryTranslation(subCategory)}</span>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                // Navigate back to main category
                                                navigate(getCategoryPath(category));
                                            }}
                                            className="text-white hover:text-pink-200 transition-colors"
                                            title={t.common.close || "Kategoriyi Kapat"}
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                )}
                                {!subCategory && subCategories && subCategories.length > 0 && (
                                    <div className="space-y-1 pt-3 border-t border-gray-200 mt-3">
                                        {subCategories.map(sub => {
                                            const count = getSubcategoryCount(sub.name);

                                            return (
                                                <button
                                                    key={sub.name}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        navigate(sub.route);
                                                    }}
                                                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all flex items-center justify-between group ${sub.name === 'Alle'
                                                        ? 'bg-gray-200 text-gray-900 font-medium'
                                                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:text-red-600'
                                                        }`}
                                                >
                                                    <span>{getCategoryTranslation(sub.name)}</span>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs text-gray-400">({count.toLocaleString('tr-TR')})</span>
                                                        <svg className="w-4 h-4 text-gray-400 group-hover:text-red-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                        </svg>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center justify-between mb-5 pb-4 border-b border-gray-200">
                            <h3 className="font-bold text-gray-900 text-lg">{getCategoryTranslation(pageTitle || subCategory || category)}</h3>
                            <span className="text-gray-500 font-medium">{getStaticTotalCount()} {t.filters.ads}</span>
                        </div>

                        {/* Active Filters Display */}



                        {Object.entries(filterConfig).map(([key, config]) => (
                            <div key={key} className="mb-6 pb-6 border-b border-gray-200 last:border-0">
                                <div className="flex items-center justify-between mb-3">
                                    <h4 className="font-bold text-gray-900 text-base">{getGenericTranslation(config.label)}</h4>
                                    {((config.type === 'multiselect' && activeFilters[key]?.length > 0) ||
                                        (config.type === 'range' && (activeFilters[`${key}From`] || activeFilters[`${key}To`])) ||
                                        (config.type !== 'multiselect' && config.type !== 'range' && activeFilters[key])) && (
                                            <button
                                                onClick={() => clearFilter(key)}
                                                className="text-xs text-red-600 hover:text-red-700 font-medium"
                                            >
                                                {t.common.delete}
                                            </button>
                                        )}
                                </div>

                                {config.type === 'select' || config.type === 'radio' ? (
                                    <div className="space-y-2 pr-2">
                                        {config.options.map((option) => {
                                            const optionValue = typeof option === 'string' ? option : option.value;
                                            const optionLabel = typeof option === 'string' ? option : option.label;
                                            const count = getFilterCount(key, optionValue);
                                            const isChecked = activeFilters[key] === optionValue;

                                            return (
                                                <label key={optionValue} className="flex items-center justify-between cursor-pointer group">
                                                    <div className="flex items-center gap-2">
                                                        <input
                                                            type="radio"
                                                            name={key}
                                                            value={optionValue}
                                                            checked={isChecked}
                                                            onChange={() => handleFilterChange(key, isChecked ? '' : optionValue)}
                                                            className="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500"
                                                        />
                                                        <span className="text-sm text-gray-700 group-hover:text-red-600">{option.displayLabel || getGenericTranslation(optionLabel)}</span>
                                                    </div>
                                                    <span className="text-xs text-gray-400">({count.toLocaleString('tr-TR')})</span>
                                                </label>
                                            );
                                        })}

                                    </div>
                                ) : config.type === 'multiselect' ? (
                                    <div className="space-y-2 pr-2">
                                        {config.options.map((option) => {
                                            const optionValue = typeof option === 'string' ? option : option.value;
                                            const optionLabel = typeof option === 'string' ? option : option.label;
                                            const count = getFilterCount(key, optionValue);
                                            const isSelected = activeFilters[key] && activeFilters[key].includes(optionValue);

                                            return (
                                                <label key={optionValue} className="flex items-center justify-between cursor-pointer group">
                                                    <div className="flex items-center gap-2">
                                                        <input
                                                            type="checkbox"
                                                            name={key}
                                                            value={optionValue}
                                                            checked={isSelected}
                                                            onChange={() => handleFilterChange(key, optionValue)}
                                                            className="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500"
                                                        />
                                                        <span className={`text-sm group-hover:text-red-600 transition-colors ${isSelected ? 'text-gray-900 font-medium' : 'text-gray-700'}`}>
                                                            {option.displayLabel || getGenericTranslation(optionLabel)}
                                                        </span>
                                                    </div>
                                                    <span className="text-xs text-gray-400">({count.toLocaleString('tr-TR')})</span>
                                                </label>
                                            );
                                        })}
                                    </div>
                                ) : config.type === 'range' ? (
                                    <div className="flex items-end gap-2">
                                        <div className="grid grid-cols-2 gap-2 flex-1">
                                            <div>
                                                <input
                                                    type="text"
                                                    value={key === 'price' || key === 'warm_rent' || key === 'hourly_wage' ? formatPriceDisplay(localFilters[`${key}From`]) : (localFilters[`${key}From`] || '')}
                                                    onChange={(e) => {
                                                        const isP = key === 'price' || key === 'warm_rent' || key === 'hourly_wage';
                                                        handleRangeChange(`${key}From`, isP ? e.target.value.replace(/\D/g, '') : e.target.value);
                                                    }}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                            const from = localFilters[`${key}From`];
                                                            const to = localFilters[`${key}To`];
                                                            updateURL({
                                                                [`${key}From`]: from ? from.toString().replace(/\./g, '') : '',
                                                                [`${key}To`]: to ? to.toString().replace(/\./g, '') : ''
                                                            });
                                                        }
                                                    }}
                                                    placeholder={t.filters.from}
                                                    className="w-full border border-gray-300 rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
                                                />
                                            </div>
                                            <div>
                                                <input
                                                    type="text"
                                                    value={key === 'price' || key === 'warm_rent' || key === 'hourly_wage' ? formatPriceDisplay(localFilters[`${key}To`]) : (localFilters[`${key}To`] || '')}
                                                    onChange={(e) => {
                                                        const isP = key === 'price' || key === 'warm_rent' || key === 'hourly_wage';
                                                        handleRangeChange(`${key}To`, isP ? e.target.value.replace(/\D/g, '') : e.target.value);
                                                    }}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                            const from = localFilters[`${key}From`];
                                                            const to = localFilters[`${key}To`];
                                                            updateURL({
                                                                [`${key}From`]: from ? from.toString().replace(/\./g, '') : '',
                                                                [`${key}To`]: to ? to.toString().replace(/\./g, '') : ''
                                                            });
                                                        }
                                                    }}
                                                    placeholder={t.filters.to}
                                                    className="w-full border border-gray-300 rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
                                                />
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => {
                                                const from = localFilters[`${key}From`];
                                                const to = localFilters[`${key}To`];
                                                updateURL({
                                                    [`${key}From`]: from ? from.toString().replace(/\./g, '') : '',
                                                    [`${key}To`]: to ? to.toString().replace(/\./g, '') : ''
                                                });
                                            }}
                                            className="bg-gray-100 hover:bg-red-50 text-gray-600 hover:text-red-600 p-2 rounded-lg transition-colors h-[38px] w-[38px] flex items-center justify-center border border-gray-200"
                                            title={t.filters.apply || "Uygula"}
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                            </svg>
                                        </button>
                                    </div>
                                ) : config.type === 'checkbox' ? (
                                    <label className="flex items-center justify-between cursor-pointer group">
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={activeFilters[key]}
                                                onChange={(e) => handleFilterChange(key, e.target.checked)}
                                                className="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500"
                                            />
                                            <span className="text-sm text-gray-700 group-hover:text-red-600 font-medium">Aktif</span>
                                        </div>
                                        <span className="text-xs text-gray-400">
                                            ({getFilterCount(key, true).toLocaleString('tr-TR')})
                                        </span>
                                    </label>
                                ) : config.type === 'month' ? (() => {
                                    const fullValue = activeFilters[key] || '';
                                    const [currYear, currMonth] = fullValue.split('-');
                                    const months = [
                                        { v: '01', l: t.filters?.months?.['01'] || 'Ocak' }, { v: '02', l: t.filters?.months?.['02'] || 'Şubat' }, { v: '03', l: t.filters?.months?.['03'] || 'Mart' },
                                        { v: '04', l: t.filters?.months?.['04'] || 'Nisan' }, { v: '05', l: t.filters?.months?.['05'] || 'Mayıs' }, { v: '06', l: t.filters?.months?.['06'] || 'Haziran' },
                                        { v: '07', l: t.filters?.months?.['07'] || 'Temmuz' }, { v: '08', l: t.filters?.months?.['08'] || 'Ağustos' }, { v: '09', l: t.filters?.months?.['09'] || 'Eylül' },
                                        { v: '10', l: t.filters?.months?.['10'] || 'Ekim' }, { v: '11', l: t.filters?.months?.['11'] || 'Kasım' }, { v: '12', l: t.filters?.months?.['12'] || 'Aralık' }
                                    ];
                                    const currentYear = new Date().getFullYear();
                                    const years = Array.from({ length: 11 }, (_, i) => currentYear + i);

                                    return (
                                        <div className="flex gap-2">
                                            <select
                                                value={currMonth || ''}
                                                onChange={(e) => {
                                                    const newMonth = e.target.value;
                                                    const year = currYear || currentYear;
                                                    updateURL({ [key]: newMonth ? `${year}-${newMonth}` : year });
                                                }}
                                                className="flex-1 border border-gray-300 rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300 bg-white"
                                            >
                                                <option value="">{t.filters.month || 'Ay'}</option>
                                                {months.map(m => (
                                                    <option key={m.v} value={m.v}>{m.l}</option>
                                                ))}
                                            </select>
                                            <select
                                                value={currYear || ''}
                                                onChange={(e) => {
                                                    const newYear = e.target.value;
                                                    if (!newYear) {
                                                        updateURL({ [key]: '' });
                                                    } else {
                                                        updateURL({ [key]: currMonth ? `${newYear}-${currMonth}` : newYear });
                                                    }
                                                }}
                                                className="flex-1 border border-gray-300 rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300 bg-white"
                                            >
                                                <option value="">{t.filters.year || 'Yıl'}</option>
                                                {years.map(y => (
                                                    <option key={y} value={y}>{y}</option>
                                                ))}
                                            </select>
                                        </div>
                                    );
                                })() : null}
                            </div>
                        ))}
                    </aside>

                    {/* Right Side - Banner + Listings */}
                    <div className="flex-1">
                        {/* Banner */}
                        <div className={`rounded-2xl shadow-xl p-8 mb-6 relative overflow-hidden ${!bannerConfig.bgImage ? (bannerConfig.bgColor || 'bg-gradient-to-r from-red-500 to-rose-600') : ''}`}>
                            {bannerConfig.bgImage && (
                                <>
                                    <div
                                        className="absolute inset-0 z-0"
                                        style={{
                                            backgroundImage: `url(${bannerConfig.bgImage})`,
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                        }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 to-gray-900/40 z-0" />
                                </>
                            )}
                            <div className="absolute inset-0 opacity-10 z-0">
                                <div
                                    className="absolute top-0 left-0 w-full h-full"
                                    style={{
                                        backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.1) 35px, rgba(255,255,255,.1) 70px)'
                                    }}
                                ></div>
                            </div>
                            <div className="relative z-10">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                                            <span className="text-5xl">{bannerConfig.icon || '📦'}</span>
                                        </div>
                                        <div>
                                            <h1 className="text-4xl font-bold text-white mb-1">{pageTitle || subCategory || category}</h1>
                                            <p className="text-white text-lg opacity-90">
                                                {bannerConfig.description || `${subCategory || category} kategorisini keşfedin`}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="hidden lg:flex items-center gap-6 text-white">
                                        <div className="text-center">
                                            <div className="text-3xl font-bold">{getStaticTotalCount()}</div>
                                            <div className="text-sm opacity-80">{t.common?.listingsCount || 'İlan'}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div style={{ maxWidth: '960px' }}>
                            <CategoryGallery
                                listings={filteredListings.filter(l =>
                                    l.is_gallery || ['galerie', 'gallery', 'galeri', 'vitrin'].includes(l.package_type?.toLowerCase())
                                )}
                                toggleFavorite={toggleFavorite}
                                isFavorite={isFavorite}
                                hidePrice={hidePrice}
                            />
                        </div>

                        {/* Listings */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-2xl font-bold text-gray-900">
                                    {getTotalCount()} {t.common?.listingsCount || 'İlan'}
                                </h2>
                                <button
                                    onClick={async () => {
                                        if (savingSearch) return;

                                        setSavingSearch(true);
                                        try {
                                            if (isSaved) {
                                                // Unsave
                                                await deleteSavedSearchByUrl(location.pathname + location.search);
                                                setIsSaved(false);
                                                setSavedSearchId(null);
                                            } else {
                                                // Save
                                                const searchData = {
                                                    searchName: `${category}${subCategory ? ' - ' + subCategory : ''}`,
                                                    category: category,
                                                    subcategory: subCategory || null,
                                                    filters: getActiveFiltersFromURL(),
                                                    searchUrl: location.pathname + location.search
                                                };
                                                const result = await createSavedSearch(searchData);
                                                setIsSaved(true);
                                                setSavedSearchId(result.id);
                                            }
                                        } catch (error) {
                                            console.error('Error saving/unsaving search:', error);
                                            alert('Arama kaydedilirken bir hata oluştu.');
                                        } finally {
                                            setSavingSearch(false);
                                        }
                                    }}
                                    disabled={savingSearch}
                                    className={`group flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all ${isSaved
                                        ? 'border-yellow-400 bg-yellow-50 text-yellow-700'
                                        : 'border-gray-200 hover:border-yellow-400 hover:bg-yellow-50 text-gray-500 hover:text-yellow-700'
                                        }`}
                                    title={isSaved ? 'Arama Kaydedildi' : 'Aramayı Kaydet'}
                                >
                                    <span className="text-sm font-medium">
                                        {isSaved ? 'Kaydedildi' : 'Aramayı Kaydet'}
                                    </span>
                                    <svg
                                        className={`w-5 h-5 transition-colors ${isSaved ? 'text-yellow-400 fill-current' : 'text-gray-400 group-hover:text-yellow-400'}`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                                        />
                                    </svg>
                                </button>
                            </div>

                            {loading ? (
                                <div className="flex justify-center items-center py-12">
                                    <LoadingSpinner size="medium" />
                                </div>
                            ) : filteredListings.length === 0 ? (
                                <div className="text-center py-12">
                                    <p className="text-gray-500 text-lg">{t.common?.noListings || 'İlan bulunamadı'}</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {sortedListings.map((listing) => (
                                        <HorizontalListingCard
                                            key={listing.id}
                                            listing={listing}
                                            toggleFavorite={toggleFavorite}
                                            isFavorite={isFavorite}
                                            compact={layoutVariant === 'compact'}
                                            hidePrice={hidePrice}
                                            renderCustomFields={renderCustomFields}
                                        />
                                    ))}
                                </div>
                            )}

                            {/* Load More Button */}
                            {hasMore && !loading && filteredListings.length > 0 && (
                                <div className="mt-8 flex justify-center">
                                    <button
                                        onClick={loadMore}
                                        className="bg-white border border-gray-300 text-gray-700 font-medium py-2 px-6 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
                                    >
                                        {t.common?.loadMore || 'Dahasını yükle'}
                                    </button>
                                </div>
                            )}
                            {loading && listings.length > 0 && (
                                <div className="mt-8 flex justify-center">
                                    <LoadingSpinner size="small" />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default GenericCategoryPage;
