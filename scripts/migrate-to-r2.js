const fs = require('fs');
const path = require('path');
const { S3Client, PutObjectCommand, ListObjectsV2Command } = require('@aws-sdk/client-s3');

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://wwzeqleaekdugsnknbbl.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY || 'sb_publishable_avKaoUyb0XpR3LmblSCq1w_z3VsQgOJ';

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

const SUPA_PREFIX = `${SUPABASE_URL}/storage/v1/object/public/listing-images/`;

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function fetchAllExistingR2Keys() {
  console.log('Fetching list of already existing objects in Cloudflare R2...');
  const keys = new Set();
  let continuationToken = undefined;

  do {
    const res = await s3Client.send(new ListObjectsV2Command({
      Bucket: R2_BUCKET,
      ContinuationToken: continuationToken,
      MaxKeys: 1000
    }));

    if (res.Contents) {
      for (const obj of res.Contents) {
        if (obj.Key) keys.add(obj.Key);
      }
    }
    continuationToken = res.NextContinuationToken;
  } while (continuationToken);

  console.log(`Found ${keys.size} existing files already in Cloudflare R2.`);
  return keys;
}

async function fetchSupabaseListings() {
  console.log('Fetching listings from Supabase...');
  const res = await fetch(`${SUPABASE_URL}/rest/v1/listings?select=id,images`, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`
    }
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch listings: ${res.statusText}`);
  }

  const listings = await res.json();
  console.log(`Fetched ${listings.length} listings from database.`);
  return listings;
}

async function fetchSupabaseProfiles() {
  console.log('Fetching profiles from Supabase...');
  const res = await fetch(`${SUPABASE_URL}/rest/v1/profiles?select=id,avatar_url,store_banner,store_logo`, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`
    }
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch profiles: ${res.statusText}`);
  }

  const profiles = await res.json();
  return profiles;
}

async function downloadWithRetry(url, maxRetries = 4) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const res = await fetch(url);
      if (res.status === 429) {
        const waitTime = attempt * 1500;
        console.warn(`[429 Rate Limit] Backing off for ${waitTime}ms on ${url.slice(-30)}...`);
        await sleep(waitTime);
        continue;
      }
      if (!res.ok) {
        throw new Error(`Download HTTP ${res.status}`);
      }
      const contentType = res.headers.get('content-type') || 'image/webp';
      const arrayBuffer = await res.arrayBuffer();
      return { buffer: Buffer.from(arrayBuffer), contentType };
    } catch (err) {
      if (attempt === maxRetries) throw err;
      await sleep(attempt * 1000);
    }
  }
  throw new Error(`Failed after ${maxRetries} retries`);
}

async function downloadAndUpload(url, key) {
  const { buffer, contentType } = await downloadWithRetry(url);

  // Upload to R2
  await s3Client.send(new PutObjectCommand({
    Bucket: R2_BUCKET,
    Key: key,
    Body: buffer,
    ContentType: contentType,
    CacheControl: 'public, max-age=31536000, immutable'
  }));
}

async function main() {
  console.log('=== EXVITRIN: CLOUDFLARE R2 IMAGE MIGRATION ===\n');

  // 1. Get existing R2 files
  const existingR2Keys = await fetchAllExistingR2Keys();

  // 2. Collect image URLs from Listings and Profiles
  const listings = await fetchSupabaseListings();
  const profiles = await fetchSupabaseProfiles();

  const toMigrateMap = new Map(); // key -> supabaseUrl

  for (const item of listings) {
    if (item.images && Array.isArray(item.images)) {
      for (const img of item.images) {
        if (typeof img === 'string' && img.startsWith(SUPA_PREFIX)) {
          const key = img.replace(SUPA_PREFIX, '').split('?')[0];
          toMigrateMap.set(key, img);
        }
      }
    }
  }

  for (const prof of profiles) {
    for (const field of ['avatar_url', 'store_banner', 'store_logo']) {
      const val = prof[field];
      if (typeof val === 'string' && val.startsWith(SUPA_PREFIX)) {
        const key = val.replace(SUPA_PREFIX, '').split('?')[0];
        toMigrateMap.set(key, val);
      }
    }
  }

  console.log(`\nTotal unique Supabase images identified: ${toMigrateMap.size}`);

  const pendingKeys = [];
  let alreadyUploadedCount = 0;

  for (const [key, url] of toMigrateMap.entries()) {
    if (existingR2Keys.has(key)) {
      alreadyUploadedCount++;
    } else {
      pendingKeys.push({ key, url });
    }
  }

  console.log(`Already in Cloudflare R2: ${alreadyUploadedCount}`);
  console.log(`Pending upload to Cloudflare R2: ${pendingKeys.length}\n`);

  if (pendingKeys.length > 0) {
    const CONCURRENCY = 4;
    console.log(`Starting migration with ${CONCURRENCY} workers + rate limit backoff...`);
    let completed = 0;
    let failed = 0;
    let index = 0;

    async function worker() {
      while (index < pendingKeys.length) {
        const current = pendingKeys[index++];
        try {
          await downloadAndUpload(current.url, current.key);
          completed++;
          if (completed % 25 === 0 || completed === pendingKeys.length) {
            const pct = (((alreadyUploadedCount + completed) / toMigrateMap.size) * 100).toFixed(1);
            console.log(`Progress: ${alreadyUploadedCount + completed}/${toMigrateMap.size} (${pct}%)`);
          }
          await sleep(100); // 100ms throttle to prevent Supabase 429
        } catch (err) {
          failed++;
          console.error(`Failed: ${current.key}: ${err.message}`);
        }
      }
    }

    const workers = Array.from({ length: CONCURRENCY }, () => worker());
    await Promise.all(workers);

    console.log(`\nMigration completed! Successfully migrated in this run: ${completed}, Failed: ${failed}`);
  } else {
    console.log('All images are already present in Cloudflare R2!');
  }

  // 3. Generate SQL script for database update
  const sqlContent = `-- ExVitrin: Update all image URLs from Supabase Storage to Cloudflare R2 CDN
-- Run this in your Supabase Dashboard -> SQL Editor

BEGIN;

-- 1. Update listings images array
UPDATE public.listings
SET images = array(
    SELECT replace(img, '${SUPA_PREFIX}', '${R2_PUBLIC_DOMAIN}/')
    FROM unnest(images) AS img
)
WHERE images IS NOT NULL
  AND array_to_string(images, ',') LIKE '%supabase.co/storage/v1/object/public/listing-images/%';

-- 2. Update profiles avatar, store_banner and store_logo
UPDATE public.profiles
SET avatar_url = replace(avatar_url, '${SUPA_PREFIX}', '${R2_PUBLIC_DOMAIN}/')
WHERE avatar_url LIKE '%supabase.co/storage/v1/object/public/listing-images/%';

UPDATE public.profiles
SET store_banner = replace(store_banner, '${SUPA_PREFIX}', '${R2_PUBLIC_DOMAIN}/')
WHERE store_banner LIKE '%supabase.co/storage/v1/object/public/listing-images/%';

UPDATE public.profiles
SET store_logo = replace(store_logo, '${SUPA_PREFIX}', '${R2_PUBLIC_DOMAIN}/')
WHERE store_logo LIKE '%supabase.co/storage/v1/object/public/listing-images/%';

COMMIT;

-- Verify updated count:
SELECT COUNT(*) AS total_updated_listings FROM public.listings 
WHERE array_to_string(images, ',') LIKE '%images.exvitrin.com%';
`;

  const sqlPath = path.join(__dirname, 'update_database_images_to_r2.sql');
  fs.writeFileSync(sqlPath, sqlContent, 'utf-8');
  console.log(`\nGenerated SQL script saved to: ${sqlPath}`);
}

main().catch(console.error);
