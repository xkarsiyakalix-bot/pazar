import { supabase } from '../lib/supabase';

/**
 * Increment view count for a listing
 * Only increments if IP hasn't viewed in last 24 hours
 * @param {string} listingId - UUID of the listing
 * @returns {Promise<boolean>} - True if view was incremented, false otherwise
 */
export const incrementListingView = async (listingId) => {
    try {
        // Get user's IP address
        const ipAddress = await getUserIP();

        if (!ipAddress) {
            console.warn('Could not get IP address');
            return false;
        }

        // Check if this IP has viewed this listing in last 24 hours
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

        const { data: existingView, error: checkError } = await supabase
            .from('listing_views')
            .select('*')
            .eq('listing_id', listingId)
            .eq('ip_address', ipAddress)
            .gte('viewed_at', twentyFourHoursAgo)
            .maybeSingle();

        if (checkError && checkError.code !== 'PGRST116') {
            console.error('Error checking existing view:', checkError);
            return false;
        }

        if (existingView) {
            console.log('IP already viewed this listing in last 24 hours');
            return false;
        }

        // Insert new view record (or update if exists)
        const { error: insertError } = await supabase
            .from('listing_views')
            .upsert({
                listing_id: listingId,
                ip_address: ipAddress,
                user_agent: navigator.userAgent,
                viewed_at: new Date().toISOString()
            }, {
                onConflict: 'listing_id,ip_address'
            });

        if (insertError) {
            console.error('Error inserting view record:', insertError);
            return false;
        }

        // Increment view count in listings table using RPC
        const { error: rpcError } = await supabase.rpc('increment_listing_views', {
            listing_id: listingId
        });

        if (rpcError) {
            console.error('Error incrementing view count:', rpcError);
            return false;
        }

        console.log('View count incremented successfully');
        return true;
    } catch (error) {
        console.error('Error in incrementListingView:', error);
        return false;
    }
};

/**
 * Get user's IP address using ipify API
 * Falls back to a hash if API fails
 * @returns {Promise<string>} - IP address or fallback identifier
 */
const getUserIP = async () => {
    try {
        const response = await fetch('https://api.ipify.org?format=json', {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('IP API request failed');
        }

        const data = await response.json();
        return data.ip;
    } catch (error) {
        console.warn('Error getting IP from API, using fallback:', error);

        // Fallback: Create a semi-unique identifier from user agent and screen resolution
        const fallbackId = `fallback-${hashString(
            navigator.userAgent +
            screen.width +
            screen.height +
            navigator.language
        )}`;

        return fallbackId;
    }
};

/**
 * Simple hash function for creating fallback IDs
 * @param {string} str - String to hash
 * @returns {string} - Hashed string
 */
const hashString = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(36).substring(0, 12);
};

/**
 * Get view count for a listing
 * @param {string} listingId - UUID of the listing
 * @returns {Promise<number>} - View count
 */
export const getListingViews = async (listingId) => {
    try {
        const { data, error } = await supabase
            .from('listings')
            .select('views')
            .eq('id', listingId)
            .single();

        if (error) {
            console.error('Error getting view count:', error);
            return 0;
        }

        return data?.views || 0;
    } catch (error) {
        console.error('Error in getListingViews:', error);
        return 0;
    }
};
