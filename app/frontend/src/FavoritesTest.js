import React, { useState, useEffect } from 'react';
import favoritesApi from './api/favorites';

function FavoritesTest() {
    const [favorites, setFavorites] = useState([]);
    const [testListingId] = useState('1b246e01-abaa-4b99-9726-22ef5f986d35'); // First listing from Supabase
    const [favoriteCount, setFavoriteCount] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadFavorites();
        loadFavoriteCount();
    }, []);

    const loadFavorites = async () => {
        const favs = await favoritesApi.getFavorites();
        setFavorites(favs);
        console.log('Loaded favorites:', favs);
    };

    const loadFavoriteCount = async () => {
        const count = await favoritesApi.getFavoriteCount(testListingId);
        setFavoriteCount(count);
    };

    const handleToggleFavorite = async () => {
        setLoading(true);
        await favoritesApi.toggleFavorite(testListingId);
        await loadFavorites();
        await loadFavoriteCount();
        setLoading(false);
    };

    const isFavorited = favorites.some(fav => fav.listing_id === testListingId);

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
            <h1>Favorites System Test</h1>

            <div style={{ marginTop: '20px', padding: '15px', border: '1px solid #ccc', borderRadius: '8px' }}>
                <h3>Test Listing: {testListingId.substring(0, 8)}...</h3>
                <p><strong>Favorite Count:</strong> {favoriteCount} people</p>
                <p><strong>Your Status:</strong> {isFavorited ? '❤️ Favorited' : '🤍 Not favorited'}</p>

                <button
                    onClick={handleToggleFavorite}
                    disabled={loading}
                    style={{
                        padding: '10px 20px',
                        fontSize: '16px',
                        backgroundColor: isFavorited ? '#ef4444' : '#10b981',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        marginTop: '10px'
                    }}
                >
                    {loading ? 'Loading...' : isFavorited ? 'Remove from Favorites' : 'Add to Favorites'}
                </button>
            </div>

            <div style={{ marginTop: '20px', padding: '15px', border: '1px solid #ccc', borderRadius: '8px' }}>
                <h3>Your Favorites ({favorites.length})</h3>
                {favorites.length === 0 ? (
                    <p>No favorites yet</p>
                ) : (
                    <ul>
                        {favorites.map(fav => (
                            <li key={fav.id}>
                                Listing: {fav.listing_id.substring(0, 8)}...
                                <small> (added {new Date(fav.created_at).toLocaleString()})</small>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

export default FavoritesTest;
