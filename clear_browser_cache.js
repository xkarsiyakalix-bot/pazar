// Clear cache utility - run this in browser console
// This will force fresh data fetch

// Method 1: Clear localStorage cache
Object.keys(localStorage).forEach(key => {
    if (key.startsWith('cache_')) {
        localStorage.removeItem(key);
    }
});

// Method 2: Clear all localStorage (more aggressive)
// localStorage.clear();

console.log('Cache cleared! Now refresh the page with Cmd+Shift+R');

// You can also check what's in the cache:
// Object.keys(localStorage).filter(k => k.startsWith('cache_')).forEach(k => {
//     console.log(k, JSON.parse(localStorage.getItem(k)));
// });
