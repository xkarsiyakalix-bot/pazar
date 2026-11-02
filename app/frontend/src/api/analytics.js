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

// Helper to get or create a session ID (persisted in localStorage so it survives tab closes)
const getSessionId = () => {
    let sessionId = localStorage.getItem('analytics_session_id');
    if (!sessionId) {
        sessionId = crypto.randomUUID?.() || Math.random().toString(36).substring(2) + Date.now().toString(36);
        localStorage.setItem('analytics_session_id', sessionId);
    }
    return sessionId;
};

export const trackVisit = async (pagePath) => {
    try {
        // Do not record visits from search engines, crawlers or automated bots
        if (isBotUserAgent()) {
            return;
        }

        // Fast & reliable: read session from localStorage first, fallback to getUser
        let userId = null;
        try {
            const { data: { session } } = await supabase.auth.getSession();
            userId = session?.user?.id || null;
            if (!userId) {
                const { data } = await supabase.auth.getUser();
                userId = data?.user?.id || null;
            }
        } catch (_) {
            // Ignore auth lookup errors
        }

        const sessionId = getSessionId();

        await supabase.from('page_visits').insert({
            page_path: pagePath || window.location.pathname,
            user_id: userId,
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
        const startOfTodayIso = today.toISOString();

        // Query both page_visits AND profiles with last_seen today (ground truth for registered users)
        const [visitsRes, activeProfilesRes] = await Promise.all([
            supabase
                .from('page_visits')
                .select('user_id, session_id, user_agent')
                .gte('created_at', startOfTodayIso),
            supabase
                .from('profiles')
                .select('id')
                .gte('last_seen', startOfTodayIso)
        ]);

        if (visitsRes.error) throw visitsRes.error;

        const data = visitsRes.data || [];

        // Filter out bot visits (both historical and any uncaught)
        const humanVisits = data.filter(v => !isBotUserAgent(v.user_agent));

        // Registered users: combine user_ids recorded in page_visits and profiles active today (last_seen)
        const loggedInUserSet = new Set([
            ...humanVisits.filter(v => v.user_id).map(v => v.user_id),
            ...(activeProfilesRes.data || []).map(p => p.id)
        ]);

        // Guest visitors counted by unique session_id (no user_id)
        const guestSessions = humanVisits.filter(v => !v.user_id);
        const uniqueGuestSessions = new Set(guestSessions.map(v => v.session_id));

        const loggedInUsersToday = loggedInUserSet.size;
        const guestsToday = uniqueGuestSessions.size;
        const totalVisitorsToday = loggedInUsersToday + guestsToday;

        return {
            totalVisitorsToday,
            loggedInUsersToday,
            guestsToday
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
