const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID || '8ad856a8c5b38a3ac67330a05af72c46';
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID || '8762488223e0275cb40adece723fd082';
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY || '18f93fe64ed2dd7ea5e2e4b9f3d4a7c1e03d3bd8d137f974581ef4f1f79b8b35';
const R2_BUCKET = process.env.R2_BUCKET || 'exvitrin-images';
const R2_PUBLIC_DOMAIN = (process.env.R2_PUBLIC_DOMAIN || 'https://images.exvitrin.com').replace(/\/$/, '');

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
    const { fileName, base64, contentType = 'image/webp' } = req.body || {};

    if (!fileName || !base64) {
      return res.status(400).json({ error: 'fileName and base64 are required' });
    }

    // Clean base64 string
    const base64Data = base64.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    const cleanFileName = fileName.replace(/[^a-zA-Z0-9_\-\.\/]/g, '');

    await s3Client.send(new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: cleanFileName,
      Body: buffer,
      ContentType: contentType,
      CacheControl: 'public, max-age=31536000, immutable',
    }));

    const publicUrl = `${R2_PUBLIC_DOMAIN}/${cleanFileName}`;

    return res.status(200).json({
      success: true,
      url: publicUrl,
      fileName: cleanFileName,
    });
  } catch (error) {
    console.error('R2 upload error:', error);
    return res.status(500).json({ error: error.message || 'Upload to R2 failed' });
  }
};

