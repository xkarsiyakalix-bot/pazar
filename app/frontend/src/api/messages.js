import { supabase } from '../lib/supabase';

/**
 * Send a message to another user
 * @param {string} receiverId - Receiver user ID
 * @param {string} content - Message content
 * @param {string} listingId - Optional listing ID
 * @returns {Promise<Object>} Sent message
 */
export const sendMessage = async (receiverId, content, listingId = null, senderPhone = null) => {
    console.log('=== SENDING MESSAGE ===');
    console.log('Receiver ID:', receiverId);
    console.log('Content:', content);
    console.log('Listing ID:', listingId);
    console.log('Sender Phone:', senderPhone);

    const { data: { user } } = await supabase.auth.getUser();
    console.log('Current user:', user?.id);

    if (!user) {
        console.error('Not authenticated');
        throw new Error('Not authenticated');
    }

    const messageData = {
        sender_id: user.id,
        receiver_id: receiverId,
        content,
        listing_id: listingId,
        sender_phone: senderPhone,
        read: false
    };

    console.log('Message data to insert:', messageData);

    const { data, error } = await supabase
        .from('messages')
        .insert(messageData)
        .select()
        .single();

    if (error) {
        console.error('Error sending message:', error);
        throw error;
    }

    console.log('Message sent successfully:', data);
    return data;
};

/**
 * Get all conversations for current user
 * @returns {Promise<Array>} List of conversations with last message
 */
export const getConversations = async () => {
    console.log('=== GET CONVERSATIONS ===');
    const { data: { user } } = await supabase.auth.getUser();
    console.log('Current user:', user?.id);

    if (!user) {
        console.log('No user logged in');
        return [];
    }

    // Get all messages where user is sender or receiver
    const { data: messages, error } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: false })
        .limit(500); // Limit to last 500 messages for speed

    // Filter out deleted messages
    const activeMessages = messages?.filter(msg => {
        if (msg.sender_id === user.id && msg.deleted_by_sender) return false;
        if (msg.receiver_id === user.id && msg.deleted_by_receiver) return false;
        return true;
    }) || [];

    console.log('Messages query result:', { data: activeMessages, error });

    if (error) {
        console.error('Error fetching conversations:', error);
        console.error('Error details:', JSON.stringify(error, null, 2));
        return [];
    }

    console.log(`Found ${activeMessages?.length || 0} messages`);

    if (!activeMessages || activeMessages.length === 0) {
        return [];
    }

    // Get unique user IDs
    const userIds = new Set();
    activeMessages.forEach(msg => {
        if (msg.sender_id !== user.id) userIds.add(msg.sender_id);
        if (msg.receiver_id !== user.id) userIds.add(msg.receiver_id);
    });

    // Fetch profiles for all users
    const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url')
        .in('id', Array.from(userIds));

    // Create a map of profiles
    const profileMap = new Map();
    profiles?.forEach(profile => {
        profileMap.set(profile.id, profile);
    });

    // Get unique listing IDs
    const listingIds = new Set();
    activeMessages.forEach(msg => {
        if (msg.listing_id) listingIds.add(msg.listing_id);
    });

    // Fetch listings if there are any
    let listingMap = new Map();
    if (listingIds.size > 0) {
        const { data: listings } = await supabase
            .from('listings')
            .select('id, title, images')
            .in('id', Array.from(listingIds));

        listings?.forEach(listing => {
            listingMap.set(listing.id, listing);
        });
    }

    // Group messages by conversation partner AND listing
    const conversationsMap = new Map();

    activeMessages.forEach(message => {
        // Determine the other user (conversation partner)
        const otherUserId = message.sender_id === user.id ? message.receiver_id : message.sender_id;
        const otherUser = profileMap.get(otherUserId);

        if (!otherUser) return; // Skip if profile not found

        // Add profile info to message
        message.sender = profileMap.get(message.sender_id);
        message.receiver = profileMap.get(message.receiver_id);

        // Add listing info if available
        if (message.listing_id) {
            message.listing = listingMap.get(message.listing_id);
        }

        // Create unique key: user_id + listing_id (or "general" if no listing)
        const conversationKey = `${otherUserId}_${message.listing_id || 'general'}`;

        if (!conversationsMap.has(conversationKey)) {
            conversationsMap.set(conversationKey, {
                user: otherUser,
                listing: message.listing || null,
                lastMessage: message,
                unreadCount: 0,
                messages: []
            });
        }

        const conversation = conversationsMap.get(conversationKey);
        conversation.messages.push(message);

        // Count unread messages (messages sent to current user that are unread)
        if (message.receiver_id === user.id && !message.read) {
            conversation.unreadCount++;
        }
    });

    const conversations = Array.from(conversationsMap.values())
        .sort((a, b) => new Date(b.lastMessage.created_at) - new Date(a.lastMessage.created_at));

    console.log(`Returning ${conversations.length} conversations`);
    return conversations;
};

/**
 * Get conversation with specific user
 * @param {string} userId - Other user's ID
 * @returns {Promise<Array>} Messages in conversation
 */
export const getConversation = async (userId) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data: messages, error } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${userId}),and(sender_id.eq.${userId},receiver_id.eq.${user.id})`)
        .order('created_at', { ascending: false }); // Newest first

    // Filter out deleted messages
    const activeMessages = messages?.filter(msg => {
        if (msg.sender_id === user.id && msg.deleted_by_sender) return false;
        if (msg.receiver_id === user.id && msg.deleted_by_receiver) return false;
        return true;
    }) || [];

    if (error) {
        console.error('Error fetching conversation:', error);
        return [];
    }

    if (!messages || messages.length === 0) {
        return [];
    }

    // Fetch profiles for both users
    const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url')
        .in('id', [user.id, userId]);

    // Create profile map
    const profileMap = new Map();
    profiles?.forEach(profile => {
        profileMap.set(profile.id, profile);
    });

    // Add profile info to messages
    activeMessages.forEach(message => {
        message.sender = profileMap.get(message.sender_id);
        message.receiver = profileMap.get(message.receiver_id);
    });

    return activeMessages;
};

/**
 * Mark message as read
 * @param {string} messageId - Message ID
 * @returns {Promise<boolean>} Success status
 */
export const markAsRead = async (messageId) => {
    const { error } = await supabase
        .from('messages')
        .update({ read: true })
        .eq('id', messageId);

    if (error) {
        console.error('Error marking message as read:', error);
        return false;
    }

    return true;
};

/**
 * Mark all messages in a conversation as read
 * @param {string} senderId - Sender user ID
 * @returns {Promise<boolean>} Success status
 */
export const markConversationAsRead = async (senderId) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { error } = await supabase
        .from('messages')
        .update({ read: true })
        .eq('sender_id', senderId)
        .eq('receiver_id', user.id)
        .eq('read', false);

    if (error) {
        console.error('Error marking conversation as read:', error);
        return false;
    }

    return true;
};

/**
 * Get unread message count
 * @returns {Promise<number>} Unread count
 */
export const getUnreadCount = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return 0;

    const { count, error } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('receiver_id', user.id)
        .eq('read', false)
        .eq('deleted_by_receiver', false);

    if (error) {
        console.error('Error getting unread count:', error);
        return 0;
    }

    return count || 0;
};

/**
 * Delete a conversation (soft delete for current user)
 * @param {string} otherUserId - The other user's ID
 * @param {string} listingId - The listing ID (optional)
 * @returns {Promise<boolean>} Success status
 */
export const deleteConversation = async (otherUserId, listingId = null) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    console.log('Deleting conversation with:', otherUserId, 'listing:', listingId);

    // 1. Mark messages sent by current user as deleted_by_sender
    let query1 = supabase
        .from('messages')
        .update({ deleted_by_sender: true })
        .eq('sender_id', user.id)
        .eq('receiver_id', otherUserId);

    if (listingId) {
        query1 = query1.eq('listing_id', listingId);
    } else {
        query1 = query1.is('listing_id', null);
    }

    const { error: error1 } = await query1;

    if (error1) {
        console.error('Error deleting sent messages:', error1);
        return false;
    }

    // 2. Mark messages received by current user as deleted_by_receiver
    let query2 = supabase
        .from('messages')
        .update({ deleted_by_receiver: true })
        .eq('receiver_id', user.id)
        .eq('sender_id', otherUserId);

    if (listingId) {
        query2 = query2.eq('listing_id', listingId);
    } else {
        query2 = query2.is('listing_id', null);
    }

    const { error: error2 } = await query2;

    if (error2) {
        console.error('Error deleting received messages:', error2);
        return false;
    }

    return true;
};
