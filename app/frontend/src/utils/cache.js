const cache = new Map();
const DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

export const setCache = (key, value, ttl = DEFAULT_TTL) => {
    const expiry = Date.now() + ttl;
    cache.set(key, { value, expiry });
};

export const getCache = (key) => {
    const item = cache.get(key);
    if (!item) return null;

    if (Date.now() > item.expiry) {
        cache.delete(key);
        return null;
    }

    return item.value;
};

export const clearCache = () => {
    cache.clear();
};
