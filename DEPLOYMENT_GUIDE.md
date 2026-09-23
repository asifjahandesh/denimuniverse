# Denim Universe — Supabase & Vercel Deployment Guide

Follow this simple 3-step guide to connect your Supabase database and take **Denim Universe** live online for global users.

---

## Step 1: Run the Database Schema in Supabase (1 Minute)

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard) and open your project.
2. In the left sidebar, click on **SQL Editor** (the `>_` icon).
3. Click **New query** (or the green button).
4. Run both SQL setup scripts in your project root:
   - First, run [`supabase-schema.sql`](./supabase-schema.sql) (creates base tables `troubles`, `fashion`, `dictionary`, `gallery`, `site_config`, and the `denim-media` storage bucket).
   - Second, run [`supabase-resources-and-members.sql`](./supabase-resources-and-members.sql) (creates `resources`, `members`, and `payments` tables with public multi-device read/write policies).
5. Click **Run** for each script. You will see `Success. No rows returned`. All tables are now ready for multi-device sync!

---

## Step 2: Get Your Supabase API Keys

1. In your Supabase Dashboard, click on **Project Settings** (gear icon at the bottom of the left sidebar).
2. Click on **API** in the settings menu.
3. You will see:
   - **Project URL** (e.g. `https://xyzcompany.supabase.co`)
   - **Project API keys** → `anon` `public` (a long string starting with `eyJhbGci...`)

---

## Step 3: Configure Local Environment (Optional for local testing)

If you want to test the cloud connection locally on your computer:
1. Create a file named `.env` in the root of your project:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-actual-anon-key
```
2. Double-click **`install-supabase.bat`** (or run `npm install`) to ensure `@supabase/supabase-js` is installed.
3. Start your dev server (`npm run dev`).
4. Log in to the Admin Panel (`0707`) and click **Test Supabase Connection** in the Dashboard tab. You will see:
   `🟢 Successfully connected to Supabase database!`

---

## Step 4: Deploy to Vercel (Make Website Online for Users)

Vercel provides free, high-performance hosting with global CDN and automatic SSL for Vite + React apps directly from GitHub.

1. Go to [Vercel](https://vercel.com) and sign in with your GitHub account.
2. On your Vercel dashboard, click **Add New...** → **Project**.
3. Under **Import Git Repository**, find and select **`asifjahandesh/denimuniverse`** and click **Import**.
4. In the configuration screen:
   - **Framework Preset**: `Vite` (automatically detected).
   - **Root Directory**: `./` (leave default).
5. Expand the **Environment Variables** section and add:
   - `VITE_SUPABASE_URL` = `https://your-project-id.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = `your-actual-anon-key`
6. Click **Deploy**.
7. In ~30 seconds, your site is live! You will receive a production URL like:
   `https://denimuniverse.vercel.app`

---

## Step 5: Email OTP Verification (Powered by Brevo)

Denim Universe includes a dedicated serverless OTP dispatcher (`/api/send-otp`) that emails 6-digit confirmation codes directly from **`asif.hdlplan@gmail.com`** using Brevo (no Supabase custom SMTP or domain verification required!).

1. In your **Vercel Project Dashboard** -> **Settings** -> **Environment Variables**, ensure you have:
   - `BREVO_API_KEY` = your Brevo API key (starts with `xkeysib-...`)
   - `BREVO_SENDER_EMAIL` = `asif.hdlplan@gmail.com`
   - `BREVO_SENDER_NAME` = `Denim Universe`
2. That's it! When any visitor signs up, Denim Universe generates a secure 6-digit PIN and emails it to them automatically.
3. In local offline development, you can test with demo code **`123456`**.

---

## Automatic Updates

Whenever you make updates in the future:
1. Double-click **`push-updates.bat`**.
2. Vercel automatically detects the new commits on GitHub and updates your live website in seconds!
