import { supabase } from '../lib/supabase';

/**
 * Transaction API
 * İşlem takibi için fonksiyonlar
 */

/**
 * Yeni işlem oluştur
 * @param {string} listingId - İlan ID
 * @param {string} sellerId - Satıcı ID
 * @param {string} buyerId - Alıcı ID
 */
export const createTransaction = async (listingId, sellerId, buyerId) => {
    try {
        const { data, error } = await supabase
            .from('transactions')
            .insert({
                listing_id: listingId,
                seller_id: sellerId,
                buyer_id: buyerId,
                status: 'pending'
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error creating transaction:', error);
        throw error;
    }
};

/**
 * İşlemi onayla (alıcı veya satıcı)
 * @param {string} transactionId - İşlem ID
 * @param {string} userId - Kullanıcı ID
 * @param {boolean} confirmed - Onay durumu
 */
export const confirmTransaction = async (transactionId, userId, confirmed) => {
    try {
        // Önce işlemi al
        const { data: transaction, error: fetchError } = await supabase
            .from('transactions')
            .select('*')
            .eq('id', transactionId)
            .single();

        if (fetchError) throw fetchError;

        // Kullanıcının rolünü belirle
        const isSeller = transaction.seller_id === userId;
        const isBuyer = transaction.buyer_id === userId;

        if (!isSeller && !isBuyer) {
            throw new Error('Unauthorized: User is not part of this transaction');
        }

        // Güncelleme objesi
        const updates = {};

        if (isSeller) {
            updates.seller_confirmed = confirmed;
            updates.seller_confirmed_at = confirmed ? new Date().toISOString() : null;
        } else {
            updates.buyer_confirmed = confirmed;
            updates.buyer_confirmed_at = confirmed ? new Date().toISOString() : null;
        }

        // İptal durumu
        if (!confirmed) {
            updates.status = 'cancelled';
        }

        // Güncelle
        const { data, error } = await supabase
            .from('transactions')
            .update(updates)
            .eq('id', transactionId)
            .select()
            .single();

        if (error) throw error;

        // Her iki taraf da onayladıysa durumu güncelle
        if (data.seller_confirmed && data.buyer_confirmed) {
            const { data: completedData, error: completeError } = await supabase
                .from('transactions')
                .update({
                    status: 'completed',
                    completed_at: new Date().toISOString()
                })
                .eq('id', transactionId)
                .select()
                .single();

            if (completeError) throw completeError;
            return completedData;
        }

        return data;
    } catch (error) {
        console.error('Error confirming transaction:', error);
        throw error;
    }
};

/**
 * İşlem bilgisini al
 * @param {string} transactionId - İşlem ID
 */
export const getTransaction = async (transactionId) => {
    try {
        const { data, error } = await supabase
            .from('transactions')
            .select('*')
            .eq('id', transactionId)
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error fetching transaction:', error);
        throw error;
    }
};

/**
 * Kullanıcının tüm işlemlerini al
 * @param {string} userId - Kullanıcı ID
 */
export const getUserTransactions = async (userId) => {
    try {
        const { data, error } = await supabase
            .from('transactions')
            .select('*')
            .or(`seller_id.eq.${userId},buyer_id.eq.${userId}`)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error fetching user transactions:', error);
        throw error;
    }
};

/**
 * İlan için işlem al veya oluştur
 * @param {string} listingId - İlan ID
 * @param {string} sellerId - Satıcı ID
 * @param {string} buyerId - Alıcı ID
 */
export const getOrCreateTransaction = async (listingId, sellerId, buyerId) => {
    try {
        // Önce mevcut işlem var mı kontrol et
        const { data: existing, error: fetchError } = await supabase
            .from('transactions')
            .select('*')
            .eq('listing_id', listingId)
            .eq('seller_id', sellerId)
            .eq('buyer_id', buyerId)
            .single();

        // Mevcut işlem varsa döndür
        if (existing) {
            return existing;
        }

        // Yoksa yeni oluştur
        return await createTransaction(listingId, sellerId, buyerId);
    } catch (error) {
        // Eğer bulunamadı hatası ise yeni oluştur
        if (error.code === 'PGRST116') {
            return await createTransaction(listingId, sellerId, buyerId);
        }
        console.error('Error in getOrCreateTransaction:', error);
        throw error;
    }
};

/**
 * Kullanıcı puanlama yapabilir mi kontrol et
 * @param {string} transactionId - İşlem ID
 * @param {string} userId - Kullanıcı ID
 */
export const canUserRate = async (transactionId, userId) => {
    try {
        const { data, error } = await supabase
            .from('transactions')
            .select('*')
            .eq('id', transactionId)
            .single();

        if (error) throw error;

        // İşlem tamamlanmış mı?
        if (data.status !== 'completed') {
            return { canRate: false, reason: 'Transaction not completed' };
        }

        // Kullanıcı alıcı mı?
        const isBuyer = data.buyer_id === userId;
        if (!isBuyer) {
            return { canRate: false, reason: 'Only buyers can rate sellers' };
        }

        // Zaten puanlama yapılmış mı?
        if (data.buyer_rated) {
            return { canRate: false, reason: 'Already rated' };
        }

        // İşlem 90 gün içinde mi?
        const completedDate = new Date(data.completed_at);
        const now = new Date();
        const daysDiff = (now - completedDate) / (1000 * 60 * 60 * 24);

        if (daysDiff > 90) {
            return { canRate: false, reason: 'Rating period expired (90 days)' };
        }

        return { canRate: true, transaction: data };
    } catch (error) {
        console.error('Error checking if user can rate:', error);
        throw error;
    }
};

export default {
    createTransaction,
    confirmTransaction,
    getTransaction,
    getUserTransactions,
    getOrCreateTransaction,
    canUserRate
};
