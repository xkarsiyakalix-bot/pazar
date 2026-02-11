import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { fetchUserListings } from './api/listings';
import { HorizontalListingCard, ListingCard } from './components';
import LoadingSpinner from './components/LoadingSpinner';

import ProfileLayout from './ProfileLayout';

const MyListingsPage = () => {
    const { user, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [listings, setListings] = useState(() => {
        const saved = sessionStorage.getItem('myListings');
        return saved ? JSON.parse(saved) : [];
    });
    const [loading, setLoading] = useState(() => {
        const saved = sessionStorage.getItem('myListings');
        // If we have any saved data (even empty array), don't show loading
        return saved === null;
    });
    const [searchParams] = useSearchParams();

    // Save listings to cache changes
    useEffect(() => {
        if (listings.length > 0) {
            try {
                sessionStorage.setItem('myListings', JSON.stringify(listings));
            } catch (e) {
                console.warn('Could not save myListings to cache:', e);
            }
        }
    }, [listings]);

    useEffect(() => {
        if (authLoading) return;
        if (!user) {
            navigate('/login');
            return;
        }
        loadListings();
    }, [user, authLoading, navigate]);

    const loadListings = async () => {
        try {
            // Only show loading if no cached data
            if (listings.length === 0) {
                setLoading(true);
            }
            const data = await fetchUserListings(user.id);
            setListings(data);
        } catch (error) {
            console.error('Error loading listings:', error);
        } finally {
            setLoading(false);
        }
    };



    if (loading || authLoading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-neutral-900 flex items-center justify-center transition-colors">
                <LoadingSpinner size="large" />
            </div>
        );
    }

    return (
        <ProfileLayout>
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 px-2 md:px-0">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-neutral-100 flex items-center gap-3">
                    İlanlarım
                    <span className="text-lg font-medium text-gray-400 dark:text-neutral-500 bg-gray-100 dark:bg-neutral-800 px-3 py-1 rounded-full">
                        {listings.length}
                    </span>
                </h1>
                <div className="flex gap-3">
                    <button
                        onClick={() => navigate('/add-listing')}
                        className="bg-red-600 dark:bg-rose-600 text-white px-6 py-3 rounded-xl hover:bg-red-700 dark:hover:bg-rose-700 transition-colors font-semibold shadow-md flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Yeni İlan Ver
                    </button>
                </div>
            </div>

            {/* Listings Grid */}
            <div className="px-1 md:px-0">
                {listings.length === 0 ? (
                    <div className="text-center py-20 bg-white dark:bg-neutral-800 rounded-3xl shadow-sm border border-gray-200 dark:border-white/5">
                        <div className="w-20 h-20 bg-gray-50 dark:bg-neutral-900 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10 text-gray-400 dark:text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                        </div>
                        <p className="text-gray-900 dark:text-neutral-100 text-xl font-bold mb-2">Henüz ilanınız yok</p>
                        <p className="text-gray-500 dark:text-neutral-400 mb-8 max-w-sm mx-auto">Satmaya başlamak için hemen ilk ilaninizi oluşturun.</p>
                        <button
                            onClick={() => navigate('/add-listing')}
                            className="bg-red-600 dark:bg-rose-600 text-white px-8 py-3 rounded-xl hover:bg-red-700 dark:hover:bg-rose-700 transition-all font-bold shadow-lg shadow-red-200 dark:shadow-rose-900/20 active:scale-95"
                        >
                            İlan Ver
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {/* Desktop View */}
                        <div className="hidden sm:block space-y-4">
                            {listings.map(listing => (
                                <HorizontalListingCard
                                    key={listing.id}
                                    listing={listing}
                                    toggleFavorite={() => { }}
                                    isFavorite={() => false}
                                    isOwnListing={true}
                                />
                            ))}
                        </div>

                        {/* Mobile Grid View */}
                        <div className="grid grid-cols-2 gap-2 sm:hidden">
                            {listings.map(listing => (
                                <ListingCard
                                    key={listing.id}
                                    listing={listing}
                                    toggleFavorite={() => { }}
                                    isFavorite={() => false}
                                    isOwnListing={true}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </ProfileLayout>
    );
};

export default MyListingsPage;
