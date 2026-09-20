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

11. **Technical Resources Library & Member-Protected Paid PDF System**:
    - **User Requirement Fulfilled**: Positioned "Resources" directly between Fabric Process and Troubleshooting. Articles feature free educational writing for all readers, with attached detailed technical PDF manuals protected by email/password member authentication (paying service). Manageable from the Admin Panel.
    - `src/types/content.ts`: Defined `ResourceItem` (title, category, desc, content, author, readTime, publishedAt, image, isPremium, priceBadge, pdfTitle, pdfUrl, pdfSize, pdfPages) and `MemberAccount` (id, email, password, name, status, accessAll, allowedResourceIds, notes, createdAt).
    - `src/data/resources.ts`: Authored 4 comprehensive industrial manuals and default demo member (`demo@denimuniverse.com` / `denim2026`).
    - `src/data/content.ts` & `src/components/Closing.tsx`: Placed "Resources" (`#resources`) between Fabric Process and Troubleshooting in navigation and footer.
    - `src/components/ResourcesSection.tsx`: Responsive technical resource library section with search, category filtering, locked/unlocked indicator badges, and price pill.
    - `src/components/MemberLoginModal.tsx`: Email and password authentication dialog with error/success feedback, one-click demo credentials auto-filler, and direct WhatsApp/Email purchase inquiry links.
    - `src/components/ResourceDetailPage.tsx`: Long-form article reader with reading progress bar, rich typography parsing (`###`, bullets, tips), breadcrumbs, share options, and protected PDF download card that checks access status.
    - `src/components/admin/ResourceManager.tsx`: Complete CMS module with two sub-tabs:
      - **Resource Articles & Attached PDFs**: Add/edit articles with image and PDF file uploads to Supabase storage `denim-media`, auto file-size calculation, price badges, markdown writing/preview tab, and delete safeguards.
      - **Paid Member Accounts**: Register and manage member accounts (Email, Password, Name, Status toggle, Full Access vs individual allowed manuals, payment notes like bKash TrxID).
    - `src/components/admin/AdminPanel.tsx` & `src/components/admin/AdminOverview.tsx`: Integrated "Resources & Members" tab with live count badge and overview dashboard metrics.
    - `src/components/Navbar.tsx`: Added Member Login / Member status button to utility bar, desktop navbar, and mobile drawer.
    - `src/App.tsx`: Mounted `<ResourcesSection />` between `<ProcessSection />` and `<TroubleshootingSection />`, integrated `#resources/:id` routing, and mounted `<MemberLoginModal />`.
    - `supabase-schema.sql`: Added `public.resources` and `public.members` with public read/write RLS policies and demo member seed.
    - `src/lib/supabase.ts`: Added cloud synchronization functions (`syncRemoteResource`, `deleteRemoteResource`, `syncRemoteMember`, `deleteRemoteMember`, and `fetchRemoteData` mapping).
    - `src/context/DataContext.tsx`: Dual-mode store for `resources`, `members`, and `currentMember` session; implemented `memberLogin(email, pass)`, `memberLogout()`, and `hasResourceAccess(resourceId)`.
    - `push-updates.bat`: Updated default commit message to `feat: add in-built sign-up, basic vs premium tiered packages, and admin plan management`.

12. **In-Built Sign-Up, Tiered Packages (Basic vs Premium VIP), and Admin Plan Management**:
    - **In-Built Member Sign-Up**: Visitors can register directly in the modal (`memberSignUp({ name, email, password, plan })`) with validation, duplicate email detection, auto-login, and cloud synchronization.
    - **Tiered Packages Architecture**:
      - `basic` ($9): Unlocks all technical manuals flagged as "Basic".
      - `premium` ($19): Unlocks ALL technical PDF manuals across the library (Basic, Premium VIP, and future releases).
      - `free`: Readers can view all educational articles, while technical PDF manual downloads require upgrade.
    - **Interactive Member Modal (`MemberLoginModal.tsx`)**:
      - 3 integrated tabs: **Sign In**, **Sign Up (Create Account)**, and **Packages & Pricing**.
      - Packages view displays comparative cards with prices, period, badges, feature checklists, one-click copyable bKash/Nagad accounts, and pre-formatted WhatsApp activation links.
      - Includes instant one-click demo credentials for Basic and Premium VIP accounts (`password: denim2026`).
    - **Public Library & Reader Experience**:
      - `ResourcesSection.tsx`: Shows Member Status Bar with active plan badge, "View Packages" button, and "Sign In / Sign Up" button. Resource cards display tier badges (`VIP MANUAL`, `BASIC PDF`, `FREE PDF`) and real-time locked/unlocked state.
      - `ResourceDetailPage.tsx`: Header displays active tier badge; protected PDF download box checks member tier, displays specific upgrade prompts if a Basic member attempts to download a Premium manual, and links directly to Packages or WhatsApp help.
    - **Admin Panel Plan Engine (`ResourceManager.tsx`)**:
      - **Sub-Tab 3: Membership Plans & Pricing**: Live editor for Basic Plan (Price, Name, Badge, Period, Description, Features list) and Premium VIP Plan (Price, Name, Badge, Period, Description, Features list), plus payment accounts (bKash, Nagad, WhatsApp, Bank, and TrxID instructions).
      - **Sub-Tab 1: Resource Articles**: Upgraded restriction setting from a binary toggle to a 3-tier selector (`Basic Plan`, `Premium VIP`, `Free Download`).
      - **Sub-Tab 2: Member Management**: Member table displays plan badge; Member Add/Edit modal features one-click tier selection (`Premium VIP`, `Basic Plan`, `Free Account`) plus custom resource overrides and payment notes (bKash TrxID).

13. **Member Profile Modal, Single PDF Pay-per-Document Option, In-App TrxID Checkout, and Admin Activation Queue**:
    - **Member Profile Modal (`src/components/MemberProfileModal.tsx`)**:
      - Replaced redundant login prompt when clicking `Member: [Name]` with a dedicated profile modal.
      - Profile Header: Displays avatar initial, Member Name, Email, Registration Date, active Plan Badge (`PREMIUM VIP`, `BASIC MEMBER`, `FREE ACCOUNT`), "Upgrade to VIP" button, and "Sign Out" button.
      - Tab 1 ("My Unlocked PDFs"): Lists all PDF manuals the user has access to with category, page count, file size, access reason badge, direct "Download PDF" button, and "View Article" link.
      - Tab 2 ("Payment History"): Lists all submitted payments (item name, amount, method, TrxID with 1-click copy, and status badges: Emerald `Active / Verified`, Amber `Pending Admin Review`, Rose `Rejected`).
    - **Single PDF Pay-Per-Document Option**:
      - Users without a Basic or Premium plan can pay for a single individual PDF (e.g. $4 / 390 BDT) without being forced into a recurring plan.
      - `src/types/content.ts` & `supabase-schema.sql`: Added `single_price` to `resources`.
      - Admin CMS (`ResourceManager.tsx`): Supports configuring individual single PDF prices during article creation or editing.
    - **In-App Payment / Checkout Page (`src/components/CheckoutModal.tsx`)**:
      - Zero external webpage redirects: clicking purchase opens an in-app payment modal.
      - Step 1: Shows payable amount and receiver accounts for bKash (Personal), Nagad (Personal), and Bank Transfer with 1-click Copy buttons.
      - Step 2: Form with Email, Name, Payment Method selector (`bKash`, `Nagad`, `Bank`), Sender Phone number, mandatory **Transaction ID (TrxID)**, and optional **Payment Proof Screenshot** upload.
    - **Instant Auto-Unlock for Single PDFs**:
      - When a user submits their TrxID for an individual PDF, that document is **immediately unlocked** for their account and downloadable instantly, with a direct download button on the confirmation screen.
    - **Admin Approval Queue for Basic & Premium Plans (`ResourceManager.tsx`)**:
      - Sub-Tab 4 ("Payment Submissions"): Displays queue of all submitted payments with badge counter for pending reviews.
      - Filter by status (`all`, `pending`, `approved`, `rejected`) and type (`plan`, `single_pdf`).
      - Copyable TrxID, proof screenshot viewer modal, and one-click **"Approve & Activate"** button (which immediately upgrades the target member's account to Basic or Premium VIP and syncs with Supabase) and **"Reject"** button.
    - `push-updates.bat`: Configured default commit message to `feat: add member profile modal, single PDF checkout, and admin TrxID activation queue`.



