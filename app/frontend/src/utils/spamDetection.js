/**
 * Spam Detection Utility
 * Automatically detects and scores spam/fake listings
 */

// Spam keywords in Turkish
const SPAM_KEYWORDS = [
    'garanti', 'kesin kazanç', 'bedava', 'ücretsiz kredi',
    'hemen zengin', 'acil', 'kaçırma', 'son şans',
    'tıkla kazan', 'para kazan', 'inanılmaz fırsat',
    'sınırlı sayıda', 'bugün son gün', 'hemen ara'
];

// Suspicious patterns
const PATTERNS = {
    excessiveCaps: /[A-ZÇĞİÖŞÜ]{10,}/g,           // 10+ consecutive uppercase
    excessiveExclamation: /!{3,}/g,                // 3+ exclamation marks
    phoneInDescription: /\b0\d{10}\b/g,            // Phone number in text
    emailInDescription: /\S+@\S+\.\S+/g,           // Email in text
    externalLinks: /(whatsapp|telegram|bit\.ly|tinyurl)/gi,
    repeatingChars: /(.)\1{5,}/g,                  // Same character 6+ times
    fakePhone: /^(0{10,}|1{10,}|2{10,}|9{10,})$/   // Fake phone patterns
};

/**
 * Calculate spam score for a listing (0-100)
 * @param {Object} listing - The listing object
 * @returns {Object} { score, flags, isSpam }
 */
export const calculateSpamScore = (listing) => {
    let score = 0;
    const flags = [];

    const title = listing.title || '';
    const description = listing.description || '';
    const price = listing.price || 0;
    const phone = listing.contact_phone || '';

    // 1. Check for excessive uppercase (20 points)
    const capsMatches = (title + description).match(PATTERNS.excessiveCaps);
    if (capsMatches && capsMatches.length > 0) {
        score += 20;
        flags.push('excessive_caps');
    }

    // 2. Check for excessive exclamation marks (15 points)
    const exclamationMatches = (title + description).match(PATTERNS.excessiveExclamation);
    if (exclamationMatches && exclamationMatches.length > 0) {
        score += 15;
        flags.push('excessive_exclamation');
    }

    // 3. Check for spam keywords (10 points per keyword, max 30)
    let keywordCount = 0;
    const textLower = (title + ' ' + description).toLowerCase();
    SPAM_KEYWORDS.forEach(keyword => {
        if (textLower.includes(keyword)) {
            keywordCount++;
        }
    });
    if (keywordCount > 0) {
        score += Math.min(keywordCount * 10, 30);
        flags.push('spam_keywords');
    }

    // 4. Check for phone number in description (15 points)
    if (PATTERNS.phoneInDescription.test(description)) {
        score += 15;
        flags.push('phone_in_description');
    }

    // 5. Check for email in description (15 points)
    if (PATTERNS.emailInDescription.test(description)) {
        score += 15;
        flags.push('email_in_description');
    }

    // 6. Check for external links (25 points)
    if (PATTERNS.externalLinks.test(description)) {
        score += 25;
        flags.push('external_links');
    }

    // 7. Check for fake phone number (20 points)
    if (phone && PATTERNS.fakePhone.test(phone.replace(/\s/g, ''))) {
        score += 20;
        flags.push('fake_phone');
    }

    // 8. Check for very short description (10 points)
    if (description.length < 20 && description.length > 0) {
        score += 10;
        flags.push('short_description');
    }

    // 9. Check for missing price (5 points)
    if (!price || price === 0) {
        score += 5;
        flags.push('no_price');
    }

    // 10. Check for repeating characters (10 points)
    if (PATTERNS.repeatingChars.test(title + description)) {
        score += 10;
        flags.push('repeating_chars');
    }

    // 11. Check for very long title (10 points)
    if (title.length > 100) {
        score += 10;
        flags.push('long_title');
    }

    // Cap score at 100
    score = Math.min(score, 100);

    return {
        score,
        flags,
        isSpam: score >= 61,
        isS uspicious: score >= 31 && score < 61,
        needsReview: score >= 31
    };
};

/**
 * Check if listing is duplicate
 * @param {string} userId - User ID
 * @param {string} title - Listing title
 * @param {Array} existingListings - User's existing listings
 * @returns {boolean}
 */
export const checkDuplicateListing = (userId, title, existingListings = []) => {
    if (!existingListings || existingListings.length === 0) return false;

    const normalizedTitle = title.toLowerCase().trim();

    // Check for exact or very similar titles from same user
    return existingListings.some(listing => {
        if (listing.user_id !== userId) return false;

        const existingTitle = (listing.title || '').toLowerCase().trim();

        // Exact match
        if (existingTitle === normalizedTitle) return true;

        // Very similar (>90% similarity)
        const similarity = calculateSimilarity(normalizedTitle, existingTitle);
        return similarity > 0.9;
    });
};

/**
 * Calculate text similarity (simple Levenshtein-based)
 * @param {string} str1 
 * @param {string} str2 
 * @returns {number} Similarity score 0-1
 */
const calculateSimilarity = (str1, str2) => {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;

    if (longer.length === 0) return 1.0;

    const editDistance = levenshteinDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
};

/**
 * Levenshtein distance algorithm
 */
const levenshteinDistance = (str1, str2) => {
    const matrix = [];

    for (let i = 0; i <= str2.length; i++) {
        matrix[i] = [i];
    }

    for (let j = 0; j <= str1.length; j++) {
        matrix[0][j] = j;
    }

    for (let i = 1; i <= str2.length; i++) {
        for (let j = 1; j <= str1.length; j++) {
            if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j] + 1
                );
            }
        }
    }

    return matrix[str2.length][str1.length];
};

/**
 * Validate phone number
 * @param {string} phone 
 * @returns {boolean}
 */
export const validatePhoneNumber = (phone) => {
    if (!phone) return true; // Optional field

    const cleaned = phone.replace(/\s/g, '');

    // Check for fake patterns
    if (PATTERNS.fakePhone.test(cleaned)) return false;

    // Turkish phone format: 05XX XXX XX XX or +90 5XX XXX XX XX
    const turkishPhone = /^(\+90|0)?5\d{9}$/;
    return turkishPhone.test(cleaned);
};

/**
 * Get spam risk level
 * @param {number} score 
 * @returns {string}
 */
export const getSpamRiskLevel = (score) => {
    if (score >= 61) return 'high';
    if (score >= 31) return 'medium';
    return 'low';
};

/**
 * Get spam risk color
 * @param {number} score 
 * @returns {string}
 */
export const getSpamRiskColor = (score) => {
    if (score >= 61) return 'red';
    if (score >= 31) return 'orange';
    return 'green';
};

export default {
    calculateSpamScore,
    checkDuplicateListing,
    validatePhoneNumber,
    getSpamRiskLevel,
    getSpamRiskColor
};
