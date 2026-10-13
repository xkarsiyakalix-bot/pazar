const { S3Client, DeleteObjectCommand } = require('@aws-sdk/client-s3');

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID || '8ad856a8c5b38a3ac67330a05af72c46';
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID || '8762488223e0275cb40adece723fd082';
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY || '18f93fe64ed2dd7ea5e2e4b9f3d4a7c1e03d3bd8d137f974581ef4f1f79b8b35';
const R2_BUCKET = process.env.R2_BUCKET || 'exvitrin-images';

const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { url, key } = req.body || {};
    let objectKey = key;
    if (!objectKey && url) {
      if (url.includes('images.exvitrin.com/')) {
        objectKey = url.split('images.exvitrin.com/')[1];
      }
    }

    if (!objectKey) {
      return res.status(400).json({ error: 'url or key is required' });
    }

    await s3Client.send(new DeleteObjectCommand({
      Bucket: R2_BUCKET,
      Key: objectKey,
    }));

    return res.status(200).json({ success: true, key: objectKey });
  } catch (error) {
    console.error('R2 delete error:', error);
    return res.status(500).json({ error: error.message || 'Delete failed' });
  }
};

