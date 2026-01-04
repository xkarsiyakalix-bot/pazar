// Reservation API Service - Supabase Implementation
// Handles all reservation-related operations using Supabase

import { supabase } from '../lib/supabase';

/**
 * Create a new reservation for a listing
 * Note: In current implementation, reservations are stored directly on listings table
 * as reserved_by and reserved_until fields
 * @param {string} listingId - The listing to reserve
 * @param {string} buyerId - The user making the reservation
 * @param {number} durationHours - Reservation duration (default: 24)
 * @returns {Promise<Object>} The created reservation
 */
export const createReservation = async (listingId, buyerId, durationHours = 24) => {
    try {
        const expiryDate = new Date();
        expiryDate.setHours(expiryDate.getHours() + durationHours);

        const { data, error } = await supabase
            .from('listings')
            .update({
                reserved_by: buyerId,
                reserved_until: expiryDate.toISOString()
            })
            .eq('id', listingId)
            .select();

        if (error) throw error;

        return { success: true, data: data[0] };
    } catch (error) {
        console.error('Error creating reservation:', error);
        throw error;
    }
};

/**
 * Get all reservations for a user (listings they've reserved)
 * @param {string} userId - The user ID
 * @param {string} status - Filter by status ('active' or 'all')
 * @returns {Promise<Array>} List of reserved listings
 */
export const getUserReservations = async (userId, status = 'active') => {
    try {
        let query = supabase
            .from('listings')
            .select('*')
            .eq('reserved_by', userId);

        // Filter by active reservations only
        if (status === 'active') {
            const now = new Date().toISOString();
            query = query.gt('reserved_until', now);
        }

        const { data, error } = await query;

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error fetching user reservations:', error);
        return [];
    }
};

/**
 * Cancel a reservation
 * @param {string} listingId - The listing ID (used as reservation ID in this implementation)
 * @param {string} userId - The user cancelling (buyer or seller)
 * @returns {Promise<Object>} Cancellation result
 */
export const cancelReservation = async (listingId, userId) => {
    try {
        const { data, error } = await supabase
            .from('listings')
            .update({
                reserved_by: null,
                reserved_until: null
            })
            .eq('id', listingId)
            .select();

        if (error) throw error;

        return { success: true, data: data[0] };
    } catch (error) {
        console.error('Error cancelling reservation:', error);
        throw error;
    }
};

/**
 * Confirm a reservation (seller action)
 * Note: In current implementation, confirmation is automatic upon creation
 * This function is kept for API compatibility
 * @param {string} listingId - The listing ID
 * @returns {Promise<Object>} Confirmation result
 */
export const confirmReservation = async (listingId) => {
    try {
        const { data, error } = await supabase
            .from('listings')
            .select('*')
            .eq('id', listingId)
            .single();

        if (error) throw error;

        return { success: true, data };
    } catch (error) {
        console.error('Error confirming reservation:', error);
        throw error;
    }
};

/**
 * Get active reservation for a specific listing
 * @param {string} listingId - The listing ID
 * @returns {Promise<Object|null>} The active reservation or null
 */
export const getListingReservation = async (listingId) => {
    try {
        const { data, error } = await supabase
            .from('listings')
            .select('reserved_by, reserved_until')
            .eq('id', listingId)
            .single();

        if (error) throw error;

        // Check if reservation is still active
        if (data.reserved_by && data.reserved_until) {
            const now = new Date();
            const expiry = new Date(data.reserved_until);

            if (expiry > now) {
                return data;
            }
        }

        return null;
    } catch (error) {
        console.error('Error fetching listing reservation:', error);
        return null;
    }
};

/**
 * Calculate time remaining for a reservation
 * @param {string} expiryDate - ISO date string
 * @returns {Object} Time remaining {hours, minutes, expired}
 */
export const calculateTimeRemaining = (expiryDate) => {
    const now = new Date();
    const expiry = new Date(expiryDate);
    const diff = expiry - now;

    if (diff <= 0) {
        return { hours: 0, minutes: 0, expired: true };
    }

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return { hours, minutes, expired: false };
};

/**
 * Format time remaining as string
 * @param {string} expiryDate - ISO date string
 * @returns {string} Formatted time string
 */
export const formatTimeRemaining = (expiryDate) => {
    const { hours, minutes, expired } = calculateTimeRemaining(expiryDate);

    if (expired) {
        return 'Abgelaufen';
    }

    if (hours > 0) {
        return `${hours}h ${minutes}m`;
    }

    return `${minutes}m`;
};
