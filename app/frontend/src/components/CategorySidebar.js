import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { categories } from '../data/categories';

export const getCategoryPath = (categoryName, subcategoryName = null) => {
    if (categoryName === 'Tüm Kategoriler') return '/Butun-Kategoriler';
    if (subcategoryName) return `/search?category=${encodeURIComponent(categoryName)}&subcategory=${encodeURIComponent(subcategoryName)}`;
    return `/search?category=${encodeURIComponent(categoryName)}`;
};

export const CategorySidebar = ({ selectedCategory, setSelectedCategory }) => {
    const [expandedCategories, setExpandedCategories] = useState([]);
    const [categoriesWithCounts, setCategoriesWithCounts] = useState(categories);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategoryCounts = async () => {
            try {
                const { fetchCategoryCounts: fetchCounts } = await import('../api/listings');
                const allListings = await fetchCounts();
                const counts = {};

                allListings.forEach(listing => {
                    let cat = listing.category;
                    const subCat = listing.sub_category;

                    if (cat === 'Musik, Film & Bücher' || cat === 'Musik, Filme & Bücher') {
                        cat = 'Müzik, Film & Kitap';
                    }
                    if (cat === 'Immobilien') {
                        cat = 'Emlak';
                    }

                    counts[cat] = (counts[cat] || 0) + 1;
                    if (subCat) {
                        const key = `${cat}:${subCat}`;
                        counts[key] = (counts[key] || 0) + 1;
                    }
                });

                const updatedCategories = categories.map(category => {
                    if (category.name === 'Tüm Kategoriler') {
                        return { ...category, count: allListings.length };
                    }

                    const mainCount = counts[category.name] || 0;
                    const updatedSubcategories = category.subcategories?.map(sub => ({
                        ...sub,
                        count: counts[`${category.name}:${sub.name}`] || 0
                    }));

                    return {
                        ...category,
                        count: mainCount,
                        subcategories: updatedSubcategories || category.subcategories
                    };
                });

                setCategoriesWithCounts(updatedCategories);
            } catch (error) {
                console.error('Error fetching category counts:', error);
            }
        };

        fetchCategoryCounts();
    }, []);

    const toggleCategory = (categoryName) => {
        setExpandedCategories(prev =>
            prev.includes(categoryName)
                ? prev.filter(c => c !== categoryName)
                : [...prev, categoryName]
        );
    };

    return (
        <aside className="w-96 flex-shrink-0 bg-white rounded-2xl shadow-lg p-6 h-fit border border-gray-100 hidden lg:block">
            <h3 className="font-bold text-gray-900 mb-5 text-lg">Kategoriler</h3>
            <div className="space-y-1.5">
                {categoriesWithCounts.map((category) => (
                    <div key={category.name}>
                        <button
                            onClick={() => {
                                if (category.subcategories) {
                                    toggleCategory(category.name);
                                } else {
                                    const url = getCategoryPath(category.name);
                                    navigate(url);
                                    setSelectedCategory(category.name);
                                }
                            }}
                            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 text-left ${selectedCategory === category.name
                                ? 'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-md'
                                : 'hover:bg-gray-50 text-gray-700 hover:shadow-sm'
                                }`}
                        >
                            <span className="font-semibold text-sm flex-grow">{category.name}</span>
                            <div className="flex items-center gap-2">
                                {category.count > 0 && (
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${selectedCategory === category.name ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'}`}>
                                        {category.count.toLocaleString('tr-TR')}
                                    </span>
                                )}
                                {category.subcategories && (
                                    <div className={`p-1 rounded-lg transition-colors ${selectedCategory === category.name ? 'hover:bg-white/10' : 'hover:bg-gray-200'}`}>
                                        <svg
                                            className={`w-4 h-4 transition-transform duration-200 ${expandedCategories.includes(category.name) ? 'rotate-180' : ''} ${selectedCategory === category.name ? 'text-white' : 'text-gray-400'}`}
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                        </button>
                        {category.subcategories && expandedCategories.includes(category.name) && (
                            <div className="mt-1 ml-4 space-y-1 border-l-2 border-gray-100 px-2 animate-in slide-in-from-top-1 duration-200">
                                {category.subcategories.map((sub) => (
                                    <button
                                        key={sub.name}
                                        onClick={() => {
                                            const url = getCategoryPath(category.name, sub.name);
                                            navigate(url);
                                            setSelectedCategory(sub.name);
                                        }}
                                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all ${selectedCategory === sub.name
                                            ? 'bg-red-50 text-red-600 font-bold'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                            }`}
                                    >
                                        <span>{sub.name}</span>
                                        {sub.count > 0 && (
                                            <span className="text-[10px] text-gray-400 font-medium">
                                                {sub.count.toLocaleString('tr-TR')}
                                            </span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </aside>
    );
};
