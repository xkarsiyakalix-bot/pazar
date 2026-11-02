import { supabase } from '../lib/supabase';

/**
 * Checks whether a user agent or browser environment belongs to a search engine crawler or bot.
 * @param {string} [ua] Optional user agent string. Defaults to navigator.userAgent.
 * @returns {boolean}
 */
export const isBotUserAgent = (ua) => {
    // If ua is explicitly passed, use it; otherwise fallback to navigator.userAgent
    const userAgent = ua !== undefined ? ua : (typeof navigator !== 'undefined' ? navigator.userAgent : '');

    // Check navigator.webdriver (common in automated headless browsers / crawlers)
    if (ua === undefined && typeof navigator !== 'undefined' && navigator.webdriver) {
        return true;
    }

    if (!userAgent || typeof userAgent !== 'string') {
        return false;
    }

    const botRegex = /(googlebot|bingbot|yandex|baiduspider|duckduckbot|slurp|sogou|exabot|teoma|qwantify|semrush|ahrefs|dotbot|rogerbot|petalbot|bytespider|mj12bot|blexbot|seekport|gptbot|chatgpt|anthropic|claude|turnitin|ccbot|perplexity|cohere|facebookexternalhit|whatsapp|twitterbot|telegrambot|linkedinbot|pinterest|slackbot|discordbot|skypeuripreview|headlesschrome|phantomjs|selenium|puppeteer|playwright|lighthouse|screaming frog|pingdom|uptimerobot|\bbot\b|\bcrawler\b|\bspider\b|\brobot\b)/i;

    return botRegex.test(userAgent);
};

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
        // Do not record visits from search engines, crawlers or automated bots
        if (isBotUserAgent()) {
            return;
        }

        const { data: { user } } = await supabase.auth.getUser();
        const sessionId = getSessionId();

        await supabase.from('page_visits').insert({
            page_path: pagePath || window.location.pathname,
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
            .select('user_id, session_id, user_agent')
            .gte('created_at', today.toISOString());

        if (error) throw error;

        // Filter out bot visits (both historical and any uncaught)
        const humanVisits = (data || []).filter(v => !isBotUserAgent(v.user_agent));

        // Calculate unique guest sessions and logged-in users from real human visits
        const uniqueSessions = new Set(humanVisits.map(v => v.session_id));
        const loggedInUsers = new Set(humanVisits.filter(v => v.user_id).map(v => v.user_id));
        const guestSessions = humanVisits.filter(v => !v.user_id);
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
