import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { t, getCategoryTranslation } from '../translations';
import LoadingSpinner from './LoadingSpinner';
import CategoryGallery from './CategoryGallery';
import { getCategoryPath } from '../utils/slug';

export const AllCategories = ({ setSelectedCategory }) => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState([]);

  const toggleCategory = (name) => {
    setExpandedCategories(prev =>
      prev.includes(name) ? prev.filter(c => c !== name) : [...prev, name]
    );
  };

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        const { fetchCategoriesWithCounts } = await import('../api/categories');
        const data = await fetchCategoriesWithCounts();
        setCategories(data);
      } catch (error) {
        console.error('Error loading categories:', error);
      } finally {
        setLoading(false);
      }
    };
    loadCategories();
  }, []);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-neutral-950 py-8 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="medium" className="mb-4" />
          <p className="text-gray-600 dark:text-neutral-400">Kategoriler yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-950 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-6">
          <button
            onClick={() => navigate('/')}
            className="text-red-500 hover:text-red-600 flex items-center gap-2 mb-4 group transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-red-50 dark:bg-red-500/10 flex items-center justify-center group-hover:bg-red-100 dark:group-hover:bg-red-500/20 transition-colors">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
               </svg>
            </div>
            <span className="font-semibold">{t.common.backToHome}</span>
          </button>
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-neutral-100 tracking-tight">{t.filters.allCategories}</h1>
        </div>

        <CategoryGallery
          toggleFavorite={() => { }}
          isFavorite={() => false}
        />

        <div className="mt-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.filter(c => c.name !== 'Tüm Kategoriler').map((category) => (
              <div key={category.name} className="space-y-4 bg-white dark:bg-neutral-900 p-6 rounded-3xl border border-gray-100 dark:border-white/5 hover:shadow-2xl dark:hover:shadow-red-500/10 transition-all duration-500 group/card">
                <h2
                  onClick={() => toggleCategory(category.name)}
                  className="text-xl font-bold text-gray-900 dark:text-neutral-100 flex items-center justify-between border-b border-gray-50 dark:border-white/5 pb-4 cursor-pointer hover:text-red-500 dark:hover:text-red-400 transition-colors group"
                >
                  <span className="flex-1">{getCategoryTranslation(category.name)}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold px-2 py-1 bg-gray-50 dark:bg-white/5 rounded-lg text-gray-400 dark:text-neutral-500 group-hover:bg-red-50 dark:group-hover:bg-red-500/10 group-hover:text-red-500 transition-colors">
                       {category.count}
                    </span>
                    <svg className={`w-5 h-5 transition-transform duration-300 ${expandedCategories.includes(category.name) ? 'rotate-180 text-red-500' : 'text-gray-300 dark:text-neutral-600 group-hover:text-red-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </h2>
                
                <ul className={`space-y-1 transition-all duration-300 ${expandedCategories.includes(category.name) ? 'opacity-100 max-h-[1000px]' : 'opacity-100 max-h-[1000px]'}`}>
                  {[...(category.subcategories || [])]
                    .sort((a, b) => (b.count || 0) - (a.count || 0))
                    .map((sub) => (
                      <li key={sub.name}>
                        <button
                          onClick={() => navigate(getCategoryPath(category.name, sub.name))}
                          className="text-gray-600 dark:text-neutral-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-gray-50 dark:hover:bg-white/5 text-sm flex items-center justify-between w-full text-left py-2 px-3 rounded-xl transition-all group/sub"
                        >
                          <span className="flex items-center gap-3">
                            <span className="w-1.5 h-1.5 rounded-full bg-gray-200 dark:bg-neutral-700 group-hover/sub:bg-red-500 group-hover/sub:scale-125 transition-all"></span>
                            {getCategoryTranslation(sub.name)}
                          </span>
                          <span className="text-gray-400 dark:text-neutral-600 text-xs font-semibold">{sub.count}</span>
                        </button>
                      </li>
                    ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllCategories;
