import { supabase } from '../lib/supabase';

// Helper to get or create a session ID
const getSessionId = () => {
    let sessionId = sessionStorage.getItem('analytics_session_id');
    if (!sessionId) {
        sessionId = crypto.randomUUID?.() || Math.random().toString(36).substring(2) + Date.now().toString(36);
        sessionStorage.setItem('analytics_session_id', sessionId);
    }
    return sessionId;
};

export const trackVisit = async (pagePath) => {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        const sessionId = getSessionId();

        await supabase.from('page_visits').insert({
            page_path: pagePath,
            user_id: user?.id || null,
            session_id: sessionId,
            user_agent: navigator.userAgent
        });
    } catch (error) {
        // Silent error to not disrupt user experience
        console.error('Analytics error:', error);
    }
};

export const getVisitStats = async () => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const { data, error } = await supabase
            .from('page_visits')
            .select('user_id, session_id')
            .gte('created_at', today.toISOString());

        if (error) throw error;

        // Calculate unique guest sessions and logged-in users
        const uniqueSessions = new Set(data.map(v => v.session_id));
        const loggedInUsers = new Set(data.filter(v => v.user_id).map(v => v.user_id));
        const guestSessions = data.filter(v => !v.user_id);
        const uniqueGuestSessions = new Set(guestSessions.map(v => v.session_id));

        return {
            totalVisitorsToday: uniqueSessions.size,
            loggedInUsersToday: loggedInUsers.size,
            guestsToday: uniqueGuestSessions.size
        };
    } catch (error) {
        console.error('Error fetching visit stats:', error);
        return {
            totalVisitorsToday: 0,
            loggedInUsersToday: 0,
            guestsToday: 0
        };
    }
};
