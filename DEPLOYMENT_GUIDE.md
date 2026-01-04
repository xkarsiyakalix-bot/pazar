# Deployment Guide

I have prepared your project for GitHub and Netlify. Follow these steps to complete the process.

## Step 1: Upload to GitHub

1. **Create a new repository** on GitHub (e.g., named `kleinbazaar`).
2. **Copy the remote URL** (it looks like `https://github.com/USERNAME/kleinbazaar.git`).
3. Open your terminal in the project root and run:
   ```bash
   git remote add origin YOUR_REMOTE_URL
   git branch -M main
   git push -u origin main
   ```

## Step 2: Deploy to Netlify

1. Log in to your [Netlify](https://app.netlify.com/) account.
2. Click **"Add new site"** -> **"Import an existing project"**.
3. Select **GitHub** and authorize Netlify to access your repository.
4. Select the `kleinbazaar` repository.
5. Netlify should automatically detect the settings from the `netlify.toml` I created:
   - **Base directory**: `app/frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `build` (relative to base)
6. Click **"Deploy site"**.

## Important Notes

- **Environment Variables**: If you are using Supabase or other API keys, make sure to add them in the Netlify Dashboard under **Site configuration > Environment variables**.
- **Base Directory**: I've configured the root `netlify.toml` to automatically handle the `app/frontend` subdirectory deployment.
