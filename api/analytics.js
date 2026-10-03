// v2 - GA4 Analytics API for ExVitrin admin
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

// HTTPS POST helper for form data
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
      res.on('end', () => {
        try {
          resolve(JSON.parse(raw));
        } catch (e) {
          resolve({ error: raw });
        }
      });
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

// HTTPS POST helper for JSON
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
      res.on('end', () => {
        try {
          resolve(JSON.parse(raw));
        } catch (e) {
          resolve({ error: raw });
        }
      });
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
        hasClientEmail: Boolean(clientEmail),
        hasPrivateKey: Boolean(privateKey),
        hasPropertyId: Boolean(propertyId)
      });
    }

    // Fix escaped newlines if passed as single-line string
    if (privateKey.includes('\\n')) {
      privateKey = privateKey.replace(/\\n/g, '\n');
    }
    // Remove quotes if wrapped in quotes
    if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
      privateKey = privateKey.slice(1, -1);
    }

    // 1) Get OAuth2 access token
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

    // 2) Run reports in parallel
    const [todayReport, weekReport, monthReport, topPagesReport, sourcesReport] = await Promise.all([
      // Today
      gaPost(basePath, token, {
        dateRanges: [{ startDate: 'today', endDate: 'today' }],
        metrics: [{ name: 'sessions' }, { name: 'screenPageViews' }, { name: 'activeUsers' }]
      }),
      // Last 7 days
      gaPost(basePath, token, {
        dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
        metrics: [{ name: 'sessions' }, { name: 'screenPageViews' }, { name: 'activeUsers' }]
      }),
      // Last 30 days
      gaPost(basePath, token, {
        dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
        metrics: [{ name: 'sessions' }, { name: 'screenPageViews' }, { name: 'activeUsers' }]
      }),
      // Top 5 pages (last 7 days)
      gaPost(basePath, token, {
        dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
        dimensions: [{ name: 'pagePath' }],
        metrics: [{ name: 'screenPageViews' }],
        orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
        limit: 5
      }),
      // Traffic sources (last 7 days)
      gaPost(basePath, token, {
        dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
        dimensions: [{ name: 'sessionDefaultChannelGroup' }],
        metrics: [{ name: 'sessions' }],
        orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
        limit: 6
      }),
    ]);

    const getVal = (report, row = 0, col = 0) =>
      parseInt(report && report.rows && report.rows[row] && report.rows[row].metricValues && report.rows[row].metricValues[col] && report.rows[row].metricValues[col].value || '0', 10);

    return res.status(200).json({
      today: {
        sessions: getVal(todayReport, 0, 0),
        pageviews: getVal(todayReport, 0, 1),
        users: getVal(todayReport, 0, 2),
      },
      week: {
        sessions: getVal(weekReport, 0, 0),
        pageviews: getVal(weekReport, 0, 1),
        users: getVal(weekReport, 0, 2),
      },
      month: {
        sessions: getVal(monthReport, 0, 0),
        pageviews: getVal(monthReport, 0, 1),
        users: getVal(monthReport, 0, 2),
      },
      topPages: ((topPagesReport && topPagesReport.rows) || []).map(r => ({
        path: (r.dimensionValues && r.dimensionValues[0] && r.dimensionValues[0].value) || '/',
        views: parseInt((r.metricValues && r.metricValues[0] && r.metricValues[0].value) || '0', 10),
      })),
      sources: ((sourcesReport && sourcesReport.rows) || []).map(r => ({
        channel: (r.dimensionValues && r.dimensionValues[0] && r.dimensionValues[0].value) || 'Direct',
        sessions: parseInt((r.metricValues && r.metricValues[0] && r.metricValues[0].value) || '0', 10),
      })),
    });

  } catch (err) {
    console.error('Analytics API error:', err);
    return res.status(500).json({ error: err.message, stack: err.stack });
  }
};
