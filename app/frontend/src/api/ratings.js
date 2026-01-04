import { supabase } from '../lib/supabase';

/**
 * Ratings API
 * Puanlama işlemleri için fonksiyonlar
 */

/**
 * Puanlama gönder
 * @param {object} ratingData - Puanlama verisi
 */
export const submitRating = async (ratingData) => {
    const {
        transactionId,
        sellerId,
        buyerId,
        listingId,
        communicationRating,
        descriptionRating,
        deliveryRating,
        overallRating,
        reviewText
    } = ratingData;

    try {
        // Puanlamayı ekle
        const { data, error } = await supabase
            .from('seller_ratings')
            .insert({
                transaction_id: transactionId,
                seller_id: sellerId,
                buyer_id: buyerId,
                listing_id: listingId,
                communication_rating: communicationRating,
                description_rating: descriptionRating,
                delivery_rating: deliveryRating,
                overall_rating: overallRating,
                review_text: reviewText
            })
            .select()
            .single();

        if (error) throw error;

        // Transaction'ı güncelle (buyer_rated = true)
        await supabase
            .from('transactions')
            .update({ buyer_rated: true })
            .eq('id', transactionId);

        // Satıcının ortalama puanlarını güncelle
        await updateSellerAverages(sellerId);

        return data;
    } catch (error) {
        console.error('Error submitting rating:', error);
        throw error;
    }
};

/**
 * Satıcının ortalama puanlarını güncelle
 * @param {string} sellerId - Satıcı ID
 */
export const updateSellerAverages = async (sellerId) => {
    try {
        // Satıcının tüm puanlarını al
        const { data: ratings, error } = await supabase
            .from('seller_ratings')
            .select('*')
            .eq('seller_id', sellerId);

        if (error) throw error;

        if (ratings.length === 0) return;

        // Ortalamaları hesapla
        const totalRatings = ratings.length;
        const communicationAvg = ratings.reduce((sum, r) => sum + r.communication_rating, 0) / totalRatings;
        const descriptionAvg = ratings.reduce((sum, r) => sum + r.description_rating, 0) / totalRatings;
        const deliveryAvg = ratings.reduce((sum, r) => sum + r.delivery_rating, 0) / totalRatings;
        const overallAvg = ratings.reduce((sum, r) => sum + r.overall_rating, 0) / totalRatings;

        // user_ratings tablosunu güncelle veya oluştur
        const { data: existing } = await supabase
            .from('user_ratings')
            .select('*')
            .eq('user_id', sellerId)
            .single();

        if (existing) {
            // Güncelle
            await supabase
                .from('user_ratings')
                .update({
                    total_ratings: totalRatings,
                    communication_avg: communicationAvg.toFixed(2),
                    description_avg: descriptionAvg.toFixed(2),
                    delivery_avg: deliveryAvg.toFixed(2),
                    average_rating: overallAvg.toFixed(2),
                    updated_at: new Date().toISOString()
                })
                .eq('user_id', sellerId);
        } else {
            // Oluştur
            await supabase
                .from('user_ratings')
                .insert({
                    user_id: sellerId,
                    total_ratings: totalRatings,
                    communication_avg: communicationAvg.toFixed(2),
                    description_avg: descriptionAvg.toFixed(2),
                    delivery_avg: deliveryAvg.toFixed(2),
                    average_rating: overallAvg.toFixed(2)
                });
        }

        return {
            totalRatings,
            communicationAvg,
            descriptionAvg,
            deliveryAvg,
            averageRating: overallAvg
        };
    } catch (error) {
        console.error('Error updating seller averages:', error);
        throw error;
    }
};

/**
 * Satıcının puanlarını al
 * @param {string} sellerId - Satıcı ID
 * @param {number} limit - Maksimum sonuç sayısı
 */
export const getSellerRatings = async (sellerId, limit = 50) => {
    try {
        const { data, error } = await supabase
            .from('seller_ratings')
            .select('*')
            .eq('seller_id', sellerId)
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error fetching seller ratings:', error);
        throw error;
    }
};

/**
 * Kullanıcının puanlama bilgilerini al
 * @param {string} userId - Kullanıcı ID
 */
export const getUserRating = async (userId) => {
    try {
        const { data, error } = await supabase
            .from('user_ratings')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (error && error.code !== 'PGRST116') throw error;

        // Eğer kayıt yoksa default değerler döndür
        if (!data) {
            return {
                user_id: userId,
                average_rating: 0,
                total_ratings: 0,
                communication_avg: 0,
                description_avg: 0,
                delivery_avg: 0
            };
        }

        return data;
    } catch (error) {
        console.error('Error fetching user rating:', error);
        throw error;
    }
};

/**
 * Kullanıcının yaptığı puanlamaları al
 * @param {string} buyerId - Alıcı ID
 */
export const getUserGivenRatings = async (buyerId) => {
    try {
        const { data, error } = await supabase
            .from('seller_ratings')
            .select('*')
            .eq('buyer_id', buyerId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error fetching user given ratings:', error);
        throw error;
    }
};

/**
 * Belirli bir işlem için puanlama var mı kontrol et
 * @param {string} transactionId - İşlem ID
 */
export const hasRating = async (transactionId) => {
    try {
        const { data, error } = await supabase
            .from('seller_ratings')
            .select('id')
            .eq('transaction_id', transactionId)
            .single();

        if (error && error.code !== 'PGRST116') throw error;
        return !!data;
    } catch (error) {
        console.error('Error checking rating:', error);
        throw error;
    }
};

export default {
    submitRating,
    updateSellerAverages,
    getSellerRatings,
    getUserRating,
    getUserGivenRatings,
    hasRating
};
