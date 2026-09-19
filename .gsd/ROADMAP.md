# Roadmap: Supabase Integration & Online Deployment

## Phase 1: Dependency, Environment & Client Layer
- Add `@supabase/supabase-js` dependency.
- Create `.env.example` and update `.gitignore` to prevent secret leaks.
- Implement `src/lib/supabase.ts` with connection verification, client initialization, and storage helpers.

## Phase 2: Database Schema & Migration Script
- Author `supabase-schema.sql` containing:
  - Table definitions (`troubles`, `fashion`, `dictionary`, `gallery`, `site_config`).
  - Row Level Security (RLS) policies allowing public read and authenticated/anon write.
  - Storage bucket initialization (`denim-media`) with public access policies.
  - Complete pre-seeded initial data matching all default cases, articles, dictionary words, and gallery photos.

## Phase 3: DataContext Cloud Sync & Storage Integration
- Wire `src/context/DataContext.tsx` to read from Supabase on initial load when configured.
- Wire all CRUD mutations (`addTrouble`, `updateTrouble`, `deleteTrouble`, `addFashion`, etc.) to sync to Supabase.
- Add image upload helper uploading directly to Supabase Storage `denim-media` bucket and returning public URL.
- Update `AdminOverview.tsx` to display real-time connection status (🟢 Connected vs 🟡 Local Storage Mode) and a "Test Supabase Connection" diagnostic button.

## Phase 4: Production Deployment & Verification
- Add `vercel.json` for optimal Vite client-side routing, asset caching, and security headers.
- Update `push-updates.bat` and author clear deployment instructions for Vercel / Netlify.
- Verify production build compatibility and zero regression.