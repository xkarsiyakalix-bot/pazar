import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { categories as staticCategories } from '../data/categories';
import LoadingSpinner from '../components/LoadingSpinner';

const AdminCategories = () => {
    const [categoriesStatus, setCategoriesStatus] = useState({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(null);
    const [expandedCategories, setExpandedCategories] = useState({});

    useEffect(() => {
        fetchCategorySettings();
    }, []);

    const fetchCategorySettings = async () => {
        try {
            const { data, error } = await supabase
                .from('category_settings')
                .select('*');

            if (error) {
                console.warn('Error fetching category settings:', error);
                setLoading(false);
                return;
            }

            const statusMap = {};
            data.forEach(item => {
                statusMap[item.category_name] = item.is_active;
            });
            setCategoriesStatus(statusMap);
        } catch (err) {
            console.error('Unexpected error fetching categories:', err);
        } finally {
            setLoading(false);
        }
    };

    const toggleCategory = async (categoryName, currentStatus) => {
        const newStatus = !currentStatus;
        setSaving(categoryName);

        setCategoriesStatus(prev => ({
            ...prev,
            [categoryName]: newStatus
        }));

        try {
            const { error } = await supabase
                .from('category_settings')
                .upsert({
                    category_name: categoryName,
                    is_active: newStatus,
                    updated_at: new Date().toISOString()
                }, { onConflict: 'category_name' });

            if (error) throw error;

        } catch (error) {
            console.error('Error updating category status:', error);
            alert(`Kategori güncellenirken hata oluştu: ${error.message || 'Veritabanı hatası'}`);
            setCategoriesStatus(prev => ({
                ...prev,
                [categoryName]: currentStatus
            }));
        } finally {
            setSaving(null);
        }
    };

    const toggleExpand = (categoryName) => {
        setExpandedCategories(prev => ({
            ...prev,
            [categoryName]: !prev[categoryName]
        }));
    };

    if (loading) return <div className="flex justify-center p-12"><LoadingSpinner size="large" /></div>;

    return (
        <div className="max-w-5xl mx-auto p-6 space-y-8 pb-24">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-neutral-900 dark:text-neutral-50 tracking-tight transition-colors duration-300">Kategori Yönetimi</h1>
                    <p className="text-neutral-500 dark:text-neutral-400 mt-2">Ana ve alt kategorilerin görünürlüğünü buradan yönetebilirsiniz.</p>
                </div>
                <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 px-4 py-2 rounded-xl text-sm font-bold border border-red-100 dark:border-red-900/30">
                    Toplam {staticCategories.length} Ana Kategori
                </div>
            </div>

            <div className="bg-white dark:bg-neutral-900 rounded-3xl shadow-sm border border-neutral-100 dark:border-white/5 overflow-hidden transition-colors duration-300">
                <table className="w-full text-left">
                    <thead className="bg-neutral-50 dark:bg-neutral-950 border-b border-neutral-200 dark:border-white/10">
                        <tr>
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-neutral-400 dark:text-neutral-500">Kategori & Detay</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-neutral-400 dark:text-neutral-500 text-right">Durum</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100 dark:divide-white/5">
                        {staticCategories.filter(c => c.name !== 'Tüm Kategoriler').map((cat) => {
                            const isActive = categoriesStatus[cat.name] !== false;
                            const isExpanded = expandedCategories[cat.name];

                            return (
                                <React.Fragment key={cat.name}>
                                    <tr className={`hover:bg-neutral-50/50 dark:hover:bg-neutral-800/50 transition-colors ${!isActive ? 'bg-neutral-50/30 dark:bg-neutral-950/30' : ''}`}>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() => toggleExpand(cat.name)}
                                                    className={`w-8 h-8 flex items-center justify-center rounded-lg border border-neutral-200 dark:border-white/10 hover:bg-white dark:hover:bg-neutral-800 hover:border-red-200 dark:hover:border-red-900/50 transition-all ${isExpanded ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 rotate-180' : 'bg-white dark:bg-neutral-900 text-neutral-400 dark:text-neutral-500'}`}
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                                                </button>
                                                <div>
                                                    <div className={`font-black tracking-tight ${!isActive ? 'text-neutral-400 dark:text-neutral-600 line-through' : 'text-neutral-900 dark:text-neutral-100'}`}>{cat.name}</div>
                                                    <div className="text-[10px] uppercase font-bold text-neutral-400 dark:text-neutral-600 tracking-widest mt-0.5">
                                                        {cat.subcategories ? cat.subcategories.length : 0} Alt Kategori
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-3">
                                                <div className="flex flex-col items-end">
                                                    <span className={`text-[10px] font-black uppercase tracking-widest ${isActive ? 'text-green-600 dark:text-green-400' : 'text-neutral-400 dark:text-neutral-600'}`}>
                                                        {isActive ? 'Aktif' : 'Pasif'}
                                                    </span>
                                                </div>
                                                <button
                                                    onClick={() => toggleCategory(cat.name, isActive)}
                                                    disabled={saving === cat.name}
                                                    className={`
                                                        relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent 
                                                        transition-colors duration-200 ease-in-out focus:outline-none scale-90
                                                        ${isActive ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.3)]' : 'bg-neutral-200 dark:bg-neutral-700'}
                                                        ${saving === cat.name ? 'opacity-50 cursor-wait' : ''}
                                                    `}
                                                >
                                                    <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isActive ? 'translate-x-5' : 'translate-x-0'}`} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>

                                    {/* Subcategories Row */}
                                    {isExpanded && cat.subcategories && (
                                        <tr>
                                            <td colSpan="2" className="px-6 py-4 bg-neutral-50/50 dark:bg-neutral-950/50 transition-colors duration-300">
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                                    {cat.subcategories.map((sub) => {
                                                        const isSubActive = categoriesStatus[sub.name] !== false;
                                                        return (
                                                            <div
                                                                key={sub.name}
                                                                className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${isSubActive ? 'bg-white dark:bg-neutral-800 border-neutral-100 dark:border-white/5 shadow-sm' : 'bg-neutral-100/50 dark:bg-neutral-800/30 border-neutral-200 dark:border-white/5 opacity-60'}`}
                                                            >
                                                                <span className={`text-xs font-bold truncate pr-2 ${isSubActive ? 'text-neutral-700 dark:text-neutral-300' : 'text-neutral-400 dark:text-neutral-600'}`}>
                                                                    {sub.name}
                                                                </span>
                                                                <button
                                                                    onClick={() => toggleCategory(sub.name, isSubActive)}
                                                                    disabled={saving === sub.name}
                                                                    className={`
                                                                        relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent 
                                                                        transition-colors duration-200 ease-in-out focus:outline-none scale-90
                                                                        ${isSubActive ? 'bg-emerald-500' : 'bg-neutral-300 dark:bg-neutral-700'}
                                                                        ${saving === sub.name ? 'opacity-50 cursor-wait' : ''}
                                                                    `}
                                                                >
                                                                    <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isSubActive ? 'translate-x-4' : 'translate-x-0'}`} />
                                                                </button>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminCategories;
