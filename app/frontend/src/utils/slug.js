export const createSlug = (title) => {
    if (!title) return "";

    const trMap = {
        'ç': 'c', 'Ç': 'c', 'ğ': 'g', 'Ğ': 'g', 'ı': 'i', 'İ': 'i',
        'ö': 'o', 'Ö': 'o', 'ş': 's', 'Ş': 's', 'ü': 'u', 'Ü': 'u'
    };

    let slug = title.toLowerCase();

    // Replace Turkish characters
    Object.keys(trMap).forEach(key => {
        slug = slug.replaceAll(key, trMap[key]);
    });

    return slug
        .replace(/[^a-z0-9]/g, '-') // Replace non-alphanumeric with hyphen
        .replace(/-+/g, '-')        // Replace multiple hyphens with single one
        .trim('-')                  // Trim leading/trailing hyphens
        .replace(/^-+|-+$/g, '');   // Regex cleanup for leading/trailing hyphens
};

export const getListingUrl = (listing) => {
    if (!listing) return "/";
    if (listing.slug) return `/${listing.slug}`;
    const slug = createSlug(listing.title || listing.id || "ilan");
    return `/${slug}`;
};

/**
 * Get seller profile URL based on subscription status
 * @param {Object} profile - User profile object
 * @returns {string} URL to store or seller page
 */
export const getSellerUrl = (profile) => {
    if (!profile) return "/";

    // In this project, is_pro or subscription_tier indicates a corporate/pro account
    const hasCorporateTier = profile.is_pro || profile.is_commercial || (profile.subscription_tier && profile.subscription_tier !== 'free');

    // Check if subscription is still valid
    const now = new Date();
    const expiry = profile.subscription_expiry ? new Date(profile.subscription_expiry) : null;
    const isSubscriptionActive = expiry ? expiry > now : false;

    // Special cases for admin or specific users could be added here if needed
    // But per user request: if no active payment/package, go to normal seller page
    if (hasCorporateTier && isSubscriptionActive) {
        return profile.store_slug ? `/${profile.store_slug}` : `/store/${profile.id}`;
    }

    // Default to normal seller page
    return `/seller/${profile.user_number || profile.id}`;
};
