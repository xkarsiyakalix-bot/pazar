#!/usr/bin/env python3
import os
import sys
import time
from io import BytesIO
from concurrent.futures import ThreadPoolExecutor, as_completed
import boto3
from botocore.config import Config
from PIL import Image

R2_ACCOUNT_ID = '8ad856a8c5b38a3ac67330a05af72c46'
R2_ACCESS_KEY_ID = '8762488223e0275cb40adece723fd082'
R2_SECRET_ACCESS_KEY = '18f93fe64ed2dd7ea5e2e4b9f3d4a7c1e03d3bd8d137f974581ef4f1f79b8b35'
R2_BUCKET = 'exvitrin-images'

MAX_DIMENSION = 800
WEBP_QUALITY = 75
SKIP_SIZE_THRESHOLD = 50 * 1024  # Skip if already under 50KB

def get_s3_client():
    return boto3.client(
        's3',
        endpoint_url=f'https://{R2_ACCOUNT_ID}.r2.cloudflarestorage.com',
        aws_access_key_id=R2_ACCESS_KEY_ID,
        aws_secret_access_key=R2_SECRET_ACCESS_KEY,
        region_name='auto',
        config=Config(signature_version='s3v4', max_pool_connections=20)
    )

def list_all_objects(s3):
    print("Listing all images in Cloudflare R2 bucket...")
    objects = []
    continuation_token = None

    while True:
        kwargs = {'Bucket': R2_BUCKET, 'MaxKeys': 1000}
        if continuation_token:
            kwargs['ContinuationToken'] = continuation_token
        res = s3.list_objects_v2(**kwargs)
        if 'Contents' in res:
            objects.extend(res['Contents'])
        continuation_token = res.get('NextContinuationToken')
        if not continuation_token:
            break

    print(f"Total objects found in R2: {len(objects)}")
    return objects

def optimize_single_image(s3, obj):
    key = obj['Key']
    orig_size = obj['Size']

    # Skip if already small
    if orig_size <= SKIP_SIZE_THRESHOLD:
        return {'key': key, 'status': 'skipped', 'orig_size': orig_size, 'new_size': orig_size}

    try:
        # Download
        res = s3.get_object(Bucket=R2_BUCKET, Key=key)
        raw_bytes = res['Body'].read()

        # Open and resize
        img = Image.open(BytesIO(raw_bytes))
        
        # Convert RGBA/P to RGB if needed, or keep alpha for WebP
        if img.mode not in ('RGB', 'RGBA'):
            img = img.convert('RGBA' if 'A' in img.mode else 'RGB')

        # Resize if dimensions exceed 800px
        width, height = img.size
        if width > MAX_DIMENSION or height > MAX_DIMENSION:
            img.thumbnail((MAX_DIMENSION, MAX_DIMENSION), Image.Resampling.LANCZOS)

        # Save to WebP
        out_buf = BytesIO()
        img.save(out_buf, format='WEBP', quality=WEBP_QUALITY, method=6)
        opt_bytes = out_buf.getvalue()

        # Only overwrite if we actually made it smaller
        if len(opt_bytes) < len(raw_bytes):
            s3.put_object(
                Bucket=R2_BUCKET,
                Key=key,
                Body=opt_bytes,
                ContentType='image/webp',
                CacheControl='public, max-age=31536000, immutable'
            )
            return {
                'key': key,
                'status': 'optimized',
                'orig_size': len(raw_bytes),
                'new_size': len(opt_bytes),
                'saved': len(raw_bytes) - len(opt_bytes)
            }
        else:
            return {'key': key, 'status': 'unchanged', 'orig_size': orig_size, 'new_size': orig_size}

    except Exception as e:
        return {'key': key, 'status': 'error', 'error': str(e), 'orig_size': orig_size}

def main():
    print("=== EXVITRIN: R2 IMAGE LOSSLESS/HIGH-EFFICIENCY OPTIMIZER ===")
    s3 = get_s3_client()
    all_objects = list_all_objects(s3)

    to_process = [obj for obj in all_objects if obj['Size'] > SKIP_SIZE_THRESHOLD]
    print(f"Images to optimize (>50KB): {len(to_process)}")
    print(f"Already optimized (<=50KB): {len(all_objects) - len(to_process)}")

    if not to_process:
        print("All images are already perfectly optimized!")
        return

    print("\nStarting optimization with 8 threads...")
    total_saved = 0
    optimized_count = 0
    error_count = 0
    start_time = time.time()

    # Worker function creates its own client or shares connection pool
    def worker(obj):
        client = get_s3_client()
        return optimize_single_image(client, obj)

    with ThreadPoolExecutor(max_workers=8) as executor:
        futures = {executor.submit(worker, obj): obj for obj in to_process}
        done_count = 0

        for future in as_completed(futures):
            done_count += 1
            result = future.result()

            if result['status'] == 'optimized':
                optimized_count += 1
                total_saved += result.get('saved', 0)
            elif result['status'] == 'error':
                error_count += 1
                print(f"Error on {result['key']}: {result.get('error')}")

            if done_count % 50 == 0 or done_count == len(to_process):
                pct = (done_count / len(to_process)) * 100
                mb_saved = total_saved / (1024 * 1024)
                print(f"Progress: {done_count}/{len(to_process)} ({pct:.1f}%) | Optimized: {optimized_count} | Saved so far: {mb_saved:.1f} MB")

    elapsed = time.time() - start_time
    total_mb_saved = total_saved / (1024 * 1024)
    print("\n=== OPTIMIZATION COMPLETED ===")
    print(f"Time taken: {elapsed:.1f} seconds")
    print(f"Images optimized: {optimized_count}")
    print(f"Errors: {error_count}")
    print(f"Total bandwidth saved: {total_mb_saved:.1f} MB")

if __name__ == '__main__':
    main()

