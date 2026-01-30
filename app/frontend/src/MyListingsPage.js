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
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();
    const filter = searchParams.get('filter') || 'all';

    const setFilter = (newFilter) => {
        setSearchParams({ filter: newFilter });
    };

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
            setLoading(true);
            const data = await fetchUserListings(user.id);
            setListings(data);
        } catch (error) {
            console.error('Error loading listings:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredListings = listings.filter(listing => {
        if (filter === 'all') return true;
        if (filter === 'active') return listing.status === 'active';
        if (filter === 'sold') return listing.status === 'sold';
        return true;
    });

    if (loading || authLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <LoadingSpinner size="large" />
            </div>
        );
    }

    return (
        <ProfileLayout>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-gray-900">İlanlarım</h1>
                <div className="flex gap-3">
                    <button
                        onClick={() => navigate('/my-invoices')}
                        className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-200 transition-colors font-semibold shadow-sm flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Faturalar
                    </button>
                    <button
                        onClick={() => navigate('/add-listing')}
                        className="bg-red-600 text-white px-6 py-3 rounded-xl hover:bg-red-700 transition-colors font-semibold shadow-md flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Yeni İlan Ver
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
                {/* Filter Tabs */}
                <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${filter === 'all' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                        Tümü ({listings.length})
                    </button>
                    <button
                        onClick={() => setFilter('active')}
                        className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${filter === 'active' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                        Aktif ({listings.filter(l => l.status === 'active').length})
                    </button>
                    <button
                        onClick={() => setFilter('sold')}
                        className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${filter === 'sold' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                        Satıldı ({listings.filter(l => l.status === 'sold').length})
                    </button>
                </div>

                {/* Listings Grid */}
                {filteredListings.length === 0 ? (
                    <div className="text-center py-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                        </div>
                        <p className="text-gray-500 text-lg font-medium mb-2">İlan bulunamadı</p>
                        <p className="text-gray-400 mb-6">İlk ilanınızı oluşturun ve başarıyla satış yapmaya başlayın.</p>
                        <button
                            onClick={() => navigate('/add-listing')}
                            className="text-red-600 hover:text-red-700 font-semibold hover:underline"
                        >
                            Şimdi ilan ver
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {/* Desktop View */}
                        <div className="hidden sm:block space-y-4">
                            {filteredListings.map(listing => (
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
                        <div className="grid grid-cols-2 gap-2 sm:hidden px-0">
                            {filteredListings.map(listing => (
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
