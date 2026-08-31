/**
 * IndexNow API integration for instant indexing on Bing, Yandex, Seznam, and Naver
 * Protocol documentation: https://www.indexnow.org/
 */

const INDEXNOW_HOST = 'www.exvitrin.com';
const INDEXNOW_KEY = 'e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3'; // Unique 32-char hex key

/**
 * Notify IndexNow protocol about a new or updated URL
 * @param {string|string[]} urls - Single URL or array of URLs to index
 */
export const notifyIndexNow = async (urls) => {
    try {
        const urlArray = Array.isArray(urls) ? urls : [urls];
        
        // Ensure absolute URLs
        const absoluteUrls = urlArray.map(url => {
            if (url.startsWith('http')) return url;
            return `https://${INDEXNOW_HOST}${url.startsWith('/') ? '' : '/'}${url}`;
        });

        const payload = {
            host: INDEXNOW_HOST,
            key: INDEXNOW_KEY,
            keyLocation: `https://${INDEXNOW_HOST}/${INDEXNOW_KEY}.txt`,
            urlList: absoluteUrls
        };

        // Submit to IndexNow master endpoint (distributes to Bing, Yandex, etc.)
        const response = await fetch('https://api.indexnow.org/indexnow', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify(payload)
        });

        if (response.ok || response.status === 202) {
            console.log('✅ IndexNow: URL notification sent successfully:', absoluteUrls);
            return true;
        } else {
            console.warn('⚠️ IndexNow: Response status:', response.status);
            return false;
        }
    } catch (error) {
        console.error('❌ IndexNow submission error:', error);
        return false;
    }
};
