# STATE.md — Project State & Memory

## Current Position
- **Feature**: Supabase Cloud Integration & Production Web Deployment
- **Status**: LIVE & DEPLOYED
- **Phase**: Production Active
- **PIN Password**: `0707` (Admin Portal)
- **GA4 Measurement ID**: `G-XEYN7P0ZQM` (Embedded in HTML & Config)

## What Has Been Completed & Configured

1. **Environment & Security**:
   - `.env.example`: Created with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
   - `.gitignore`: Configured to ignore `.env`, `.env.local`, and `.env.*.local` preventing any credential leak to GitHub.
   - `package.json`: Added `@supabase/supabase-js` (`^2.49.1`) and `@vercel/analytics` (`^1.5.0`).
   - `install-supabase.bat`: Helper batch script for one-click dependency installation on Windows.
   - **Strict PIN Security**: Removed all storage persistence (`sessionStorage`/`localStorage`) for authentication. Exiting the panel or re-entering always prompts for the PIN with zero auto-login.

2. **Cloud Database Schema & Seed (`supabase-schema.sql`)**:
   - Executed in user's Supabase project.
   - Tables: `public.troubles`, `public.fashion`, `public.dictionary`, `public.gallery`, `public.site_config`.
   - Row Level Security (RLS): Enabled on all tables with public `SELECT` and app `ALL` (insert/update/delete) policies.
   - Cloud Storage: Configured `denim-media` public bucket with public read and insert policies for user-uploaded images.
   - Pre-seeded Data: All 12 troubleshooting cases, 8 fashion articles, 15 dictionary terms, 12 gallery photos, and site configuration active in the cloud database.

3. **Supabase Client & Service Layer (`src/lib/supabase.ts`)**:
   - `supabase` client with safe initialization and fallback check `isSupabaseConfigured()`.
   - `uploadImageToSupabase(file)` for uploading image assets directly to the `denim-media` bucket.
   - `testSupabaseConnection()` diagnostic function reporting real-time database connectivity and table row count.
   - Asynchronous remote sync functions for all 5 entities (`syncRemoteTrouble`, `deleteRemoteTrouble`, etc.).

4. **Dual-Mode Reactive Data Store (`src/context/DataContext.tsx`)**:
   - Queries cloud tables on mount, caches in `localStorage`, and streams mutations to Supabase in the background.
   - Seamlessly falls back to `localStorage` and default data if offline.
   - Exposes `isCloudConnected` and `cloudHost` across the app.

5. **Admin Panel Cloud Status & Diagnostics (`AdminOverview.tsx`)**:
   - Live status indicator: `🟢 Cloud: [host]` vs `🟡 Storage: Local Fallback Mode`.
   - Interactive **"Test Supabase Connection"** button with real-time error/success banner.
   - Enhanced `FashionManager.tsx` and `GalleryManager.tsx` with cloud image upload and loading spinners.

6. **PC & Mobile Browse-Friendly UI Optimization**:
   - `src/index.css`: Added `touch-action: manipulation` across interactive elements, eliminated tap highlight flashes with `-webkit-tap-highlight-color: transparent`, prevented iOS Safari auto-zoom on inputs with `@media (max-width: 640px) { input, select, textarea { font-size: 16px !important; } }`, added `.touch-scroll` and `.pb-safe`.
   - `src/components/common.tsx`: Upgraded `Modal` to mobile bottom sheet on small screens with `max-h-[90dvh]`, drag pill indicator, accessible sticky 44px close button, and smooth momentum scrolling.
   - `src/components/Navbar.tsx`: Added responsive logo scaling for narrow phone screens (320-360px), 44px+ touch targets on all drawer links and buttons, and `.pb-safe` to prevent mobile home bar overlap.
   - `src/components/Hero.tsx`: Scaled headline font sizing preventing overflow, full-width CTA buttons on mobile with 50px min height, and adaptive padding on stats grid.
   - `src/components/Knowledge.tsx`: 9-step process pills upgraded with horizontal snap scrolling (`snap-x snap-mandatory`), touch momentum, and spacious step indicator dots; responsive grid columns (`md:grid-cols-3 lg:grid-cols-5`) for sustainability topics.
   - `src/components/Content.tsx`: Fixed horizontal pill container `justify-center` left-clipping bug on mobile with `justify-start sm:justify-center`, enhanced Gallery cards to show captions and expand affordance on touchscreens without needing hover, and upgraded Lightbox with touch-friendly 44px controls.
   - `src/components/Closing.tsx`: Contact form inputs styled for iOS and desktop, full-width touch submit button, and touch-spaced footer link navigation.
   - `src/components/admin/AdminPanel.tsx`: Mobile header displays active tab name; mobile drawer supports touch-friendly section switching with auto-close; content container has adaptive padding and `.pb-safe`.
   - `src/components/admin/AdminLoginModal.tsx`: Keypad buttons upgraded to 50px min touch height with active haptic-like scaling.
   - Admin Managers (`TroubleManager`, `FashionManager`, `GalleryManager`, `DictionaryManager`, `ContactManager`): Edit/Delete action buttons visible and easily tappable on mobile without requiring mouse hover; modal forms support scrollable mobile sheet layout with stacked full-width touch action buttons.
   - `push-updates.bat`: One-click git push updated with default commit message `feat: add fashion article detail pages and admin editorial preview`.

7. **Interactive Fashion Article Detail Pages & Editorial Reader**:
   - `src/types/content.ts`: Extended `FashionCard` with optional `content`, `author`, `readTime`, and `publishedAt`.
   - `src/data/fashionStories.ts`: Authored comprehensive editorial stories, technical specifications, styling notes, and key takeaways for all 8 default fashion cards.
   - `src/components/FashionDetailPage.tsx`: Dedicated responsive full-page article reader featuring sticky header, reading progress bar, breadcrumbs, executive lead summary, technical specs box, key takeaways checklist, next/previous story navigation, related stories carousel, and Web Share / clipboard sharing.
   - `src/components/Knowledge.tsx`: Upgraded `FashionSection` cards with interactive click/touch handlers, hover elevation, and "Read Story" affordance.
   - `src/App.tsx`: Implemented hash routing (`#fashion/:id` and `#fashion/:slug`) with browser `popstate`/`hashchange` support and smooth scroll restoration.
   - `src/components/admin/FashionManager.tsx`: Added "Preview Story" (Eye icon) button on each card to test the article preview instantly, plus Author, Read Time, and multi-paragraph Full Article Content fields.
   - `src/lib/supabase.ts` & `supabase-schema.sql`: Added columns `content`, `author`, `read_time`, `published_at` to schema and Supabase sync layer.

8. **In-App Visitor Analytics & Real-Time Traffic Engine**:
   - `src/types/analytics.ts`: Data types for `VisitorStats` and `ActivityEvent`.
   - `src/lib/analyticsTracker.ts`: Lightweight privacy-respecting client analytics engine tracking unique visitors (anonymous device tokens), pageviews, today's views, device breakdowns (Mobile vs Desktop vs Tablet), and top visited content.
   - `src/components/admin/VisitorAnalytics.tsx`: Comprehensive dashboard tab inside Admin Panel with 4 KPI cards, popular content progress bars, device & platform distribution, and a live timestamped activity stream.
   - `src/components/admin/AdminOverview.tsx`: Added "Live Visitor Traffic Pulse" card block to the main Admin Dashboard overview.
   - `src/components/admin/AdminPanel.tsx`: Added "Visitor Analytics" tab with `BarChart3` icon.
   - `src/components/admin/ContactManager.tsx`: Pre-filled `G-XEYN7P0ZQM` with green "Connected & Active" status badge and direct link to GA4 Console.
   - `src/components/Analytics.tsx`: Wrote hooks to automatically log pageviews and section hash changes to the analytics engine.

9. **Newsletter Subscription & Subscriber Management**:
   - `src/components/Closing.tsx`: Replaced non-functional placeholder `onSubmit={(e) => e.preventDefault()}` with reactive `handleSubscribe` workflow, validation, loading spinner (`Loader2`), and green checkmark confirmation banner (`You're subscribed! Welcome to Denim Universe.`).
   - Dual-Layer Persistence: Subscribing immediately writes to `localStorage` (`du_subscribers_v1`), logs an event in visitor analytics (`trackVisit("#newsletter", ...)`), and asynchronously pushes to Supabase (`public.subscribers`).
   - Contact Inquiries: Contact form in `#contact` similarly saves to `localStorage` (`du_messages_v1`) and Supabase (`public.messages`).
   - `src/lib/supabase.ts` & `supabase-schema.sql`: Added `public.subscribers` (`email UNIQUE`) and `public.messages` tables with RLS; created `addRemoteSubscriber`, `addRemoteMessage`, `fetchRemoteSubscribers`, and `fetchRemoteMessages`.
   - `src/components/admin/ContactManager.tsx`: Added sub-tabs ("Site & Brand Settings", "Newsletter Subscribers", "Contact Inquiries") with real-time subscriber count, search filter, manual subscriber adder, "Copy All (BCC)" for batch emailing, "Export CSV", and inquiry reply links.
   - `src/components/admin/AdminPanel.tsx`: Added subscriber count badge to the Contact tab in navigation.
   - `push-updates.bat`: Updated default commit message to `feat: add automated welcome email serverless function via Resend`.

10. **Automated Welcome Email Engine (Vercel Serverless + Resend)**:
    - `api/subscribe.ts`: Implemented secure Vercel Serverless Function supporting `POST` (dispatches branded HTML welcome email via Resend API) and `GET` (diagnostics checking `RESEND_API_KEY` configuration).
    - `vercel.json`: Added rewrite `{ "source": "/api/(.*)", "destination": "/api/$1" }` to ensure serverless API routes are preserved without falling back to `index.html`.
    - `src/components/Closing.tsx`: Updated `handleSubscribe` to asynchronously call `/api/subscribe` immediately upon user subscription.
    - `src/components/admin/ContactManager.tsx`: Added "Send Welcome" button next to every subscriber in the list to test or re-send welcome emails on demand; added status notifications; added Resend connection instructions card in Settings.
    - `.env.example`: Documented `RESEND_API_KEY` and optional `RESEND_FROM_EMAIL`.

