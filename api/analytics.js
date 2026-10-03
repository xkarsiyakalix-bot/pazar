const crypto = require('crypto');
const https = require('https');

// Helper to base64url encode
function base64url(buf) {
  return Buffer.isBuffer(buf) ? buf.toString('base64url') : Buffer.from(buf).toString('base64url');
}

// Create signed JWT for Google Service Account
function makeJwt(clientEmail, privateKey) {
  const now = Math.floor(Date.now() / 1000);
  const header = base64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const payload = base64url(JSON.stringify({
    iss: clientEmail,
    scope: 'https://www.googleapis.com/auth/analytics.readonly',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
  }));
  const sign = crypto.createSign('RSA-SHA256');
  sign.update(header + '.' + payload);
  const sig = sign.sign(privateKey, 'base64url');
  return header + '.' + payload + '.' + sig;
}

// HTTPS POST helper
function post(url, body) {
  return new Promise((resolve, reject) => {
    const data = Buffer.from(body);
    const u = new URL(url);
    const req = https.request({
      hostname: u.hostname,
      path: u.pathname + u.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': data.length
      }
    }, res => {
      let raw = '';
      res.on('data', c => raw += c);
      res.on('end', () => { try { resolve(JSON.parse(raw)); } catch (e) { resolve({ error: raw }); } });
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

// HTTPS POST helper for GA JSON
function gaPost(path, token, body) {
  return new Promise((resolve, reject) => {
    const data = Buffer.from(JSON.stringify(body));
    const req = https.request({
      hostname: 'analyticsdata.googleapis.com',
      path,
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    }, res => {
      let raw = '';
      res.on('data', c => raw += c);
      res.on('end', () => { try { resolve(JSON.parse(raw)); } catch (e) { resolve({ error: raw }); } });
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const clientEmail = process.env.GA_CLIENT_EMAIL;
    let privateKey = process.env.GA_PRIVATE_KEY || '';
    const propertyId = process.env.GA_PROPERTY_ID;

    if (!clientEmail || !privateKey || !propertyId) {
      return res.status(500).json({
        error: 'GA environment variables missing',
        hasEmail: Boolean(clientEmail),
        hasKey: Boolean(privateKey),
        hasProp: Boolean(propertyId)
      });
    }

    // Fix private key: split on literal backslash-n, join with actual newline
    privateKey = privateKey.split(String.fromCharCode(92) + 'n').join(String.fromCharCode(10));
    // Remove surrounding quotes if present
    if (privateKey.charAt(0) === '"' || privateKey.charAt(0) === "'") {
      privateKey = privateKey.slice(1, -1);
    }
    // Remove any carriage returns
    privateKey = privateKey.replace(/\r/g, '');

    // 1) Get OAuth2 access token via JWT
    const jwt = makeJwt(clientEmail, privateKey);
    const tokenRes = await post(
      'https://oauth2.googleapis.com/token',
      'grant_type=' + encodeURIComponent('urn:ietf:params:oauth:grant-type:jwt-bearer') + '&assertion=' + encodeURIComponent(jwt)
    );

    const token = tokenRes.access_token;
    if (!token) {
      return res.status(500).json({ error: 'Token alınamadı', detail: tokenRes });
    }

    const basePath = '/v1beta/properties/' + propertyId + ':runReport';

    const [todayR, weekR, monthR, pagesR, srcR] = await Promise.all([
      gaPost(basePath, token, {
        dateRanges: [{ startDate: 'today', endDate: 'today' }],
        metrics: [{ name: 'sessions' }, { name: 'screenPageViews' }, { name: 'activeUsers' }]
      }),
      gaPost(basePath, token, {
        dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
        metrics: [{ name: 'sessions' }, { name: 'screenPageViews' }, { name: 'activeUsers' }]
      }),
      gaPost(basePath, token, {
        dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
        metrics: [{ name: 'sessions' }, { name: 'screenPageViews' }, { name: 'activeUsers' }]
      }),
      gaPost(basePath, token, {
        dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
        dimensions: [{ name: 'pagePath' }],
        metrics: [{ name: 'screenPageViews' }],
        orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
        limit: 5
      }),
      gaPost(basePath, token, {
        dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
        dimensions: [{ name: 'sessionDefaultChannelGroup' }],
        metrics: [{ name: 'sessions' }],
        orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
        limit: 6
      }),
    ]);

    const v = (r, row = 0, col = 0) =>
      parseInt((r && r.rows && r.rows[row] && r.rows[row].metricValues && r.rows[row].metricValues[col] && r.rows[row].metricValues[col].value) || '0', 10);

    return res.status(200).json({
      today:  { sessions: v(todayR,0,0), pageviews: v(todayR,0,1), users: v(todayR,0,2) },
      week:   { sessions: v(weekR,0,0),  pageviews: v(weekR,0,1),  users: v(weekR,0,2)  },
      month:  { sessions: v(monthR,0,0), pageviews: v(monthR,0,1), users: v(monthR,0,2) },
      topPages: ((pagesR && pagesR.rows) || []).map(r => ({
        path:  (r.dimensionValues && r.dimensionValues[0] && r.dimensionValues[0].value) || '/',
        views: parseInt((r.metricValues && r.metricValues[0] && r.metricValues[0].value) || '0', 10),
      })),
      sources: ((srcR && srcR.rows) || []).map(r => ({
        channel:  (r.dimensionValues && r.dimensionValues[0] && r.dimensionValues[0].value) || 'Direct',
        sessions: parseInt((r.metricValues && r.metricValues[0] && r.metricValues[0].value) || '0', 10),
      })),
    });

  } catch (err) {
    console.error('Analytics API error:', err);
    return res.status(500).json({ error: err.message });
  }
};
