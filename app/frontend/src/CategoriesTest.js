import React, { useState, useEffect } from 'react';
import { fetchCategories } from './api/categories';

const CategoriesTest = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const data = await fetchCategories();
                console.log('Categories loaded from Supabase:', data);
                setCategories(data);
            } catch (error) {
                console.error('Error loading categories:', error);
            } finally {
                setLoading(false);
            }
        };

        loadCategories();
    }, []);

    if (loading) {
        return <div className="p-8">Loading categories...</div>;
    }

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Categories from Supabase</h1>
            <div className="space-y-4">
                {categories.map((category) => (
                    <div key={category.id} className="border p-4 rounded">
                        <h2 className="text-xl font-semibold">{category.name}</h2>
                        <p className="text-sm text-gray-500">Slug: {category.slug}</p>
                        <div className="mt-2 ml-4">
                            <h3 className="font-medium">Subcategories ({category.subcategories.length}):</h3>
                            <ul className="list-disc ml-6">
                                {category.subcategories.map((sub) => (
                                    <li key={sub.id}>{sub.name} ({sub.slug})</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CategoriesTest;
