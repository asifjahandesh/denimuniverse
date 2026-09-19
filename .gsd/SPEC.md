# Specification: Denim Universe — Supabase Integration & Production Deployment

## Metadata
- **Project**: Denim Universe
- **Feature**: Cloud Database (Supabase) Integration & Production Web Deployment
- **Status**: FINALIZED
- **Auth Key**: `0707` (Admin Portal)

---

## 1. Overview & Objectives
Transition Denim Universe from local-only storage to a cloud-backed architecture powered by **Supabase** and deploy the web application live online for global users.

Key Objectives:
1. **Supabase Client & Service Layer**:
   - Install and configure `@supabase/supabase-js`.
   - Implement safe environment variable loading (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`).
   - Create resilient dual-mode architecture (cloud database when configured, seamless fallback to localStorage if unconfigured or offline).
2. **Cloud Database Schema & Seed**:
   - `troubles`: Defect cases (problem, causes, solutions, severity, tag).
   - `fashion`: Articles & trends (title, desc, tag, image, stat).
   - `dictionary`: Glossary terms (term, short, detail, cat).
   - `gallery`: Photos (src, title, cat, tall).
   - `site_config`: Brand metadata, contact details, social links.
   - Storage Bucket `denim-media` for uploaded images.
   - Ready-to-execute `supabase-schema.sql` with full seed data and RLS policies.
3. **Admin Panel Cloud Integration**:
   - Asynchronous synchronization of all CRUD actions to Supabase tables.
   - Direct image upload to Supabase Storage bucket with public CDN URLs.
   - Live Supabase connection indicator (🟢 Connected / 🟡 Local Mode) and test tool.
4. **Production Deployment**:
   - Configure `vercel.json` for single-page routing and caching.
   - Provide step-by-step instructions and automated helper scripts for Vercel deployment.
   - Update `.gitignore` to protect `.env` secrets from leaking to GitHub.

---

## 2. Technical Requirements

### Environment Variables
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Fallback Guarantee
If environment variables are absent, the application must **never** crash or show blank pages. It must automatically fall back to existing default content and `localStorage`.

### Security & Access
- RLS enabled on all tables.
- Public read access for visitors.
- Admin updates handled with anon key validated through the existing `0707` PIN portal.
- `.env` must be explicitly listed in `.gitignore`.

---

## 3. Verification Criteria
1. Clean TypeScript build (`npm run build`) without errors.
2. `supabase-schema.sql` successfully runs in Supabase SQL editor without syntax errors.
3. Live data read & write verified when credentials are provided.
4. Smooth fallback verified when credentials are not yet set.
5. Vercel deployment succeeds and website is reachable over HTTPS.