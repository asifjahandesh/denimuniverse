# Roadmap: Denim Technical Resources & Paid PDF Access System

## Phase 1: Data Models & Default Technical Seed Data
- Define `ResourceItem` and `MemberAccount` interfaces in `src/types/content.ts`.
- Create `src/data/resources.ts` with 4 comprehensive default technical resources and a test member account (`demo@denimuniverse.com` / `denim2026`).
- Update `NAV_LINKS` in `src/data/content.ts` to include `{ label: "Resources", href: "#resources" }` between Fabric Process and Troubleshooting.

## Phase 2: State Store, Auth Logic & Cloud Sync
- Extend `DataContext.tsx` to manage `resources`, `members`, and active visitor session `currentMember`.
- Implement `memberLogin(email, password)`, `memberLogout()`, and `hasResourceAccess(resourceId)`.
- Implement Resource and Member CRUD methods (`addResource`, `updateResource`, `deleteResource`, `addMember`, etc.).
- Update `src/lib/supabase.ts` and `supabase-schema.sql` with tables `public.resources` and `public.members`.

## Phase 3: User-Facing Technical Library & Reader
- Build `ResourcesSection.tsx` and place between `ProcessSection` and `TroubleshootingSection` in `src/App.tsx`.
- Build `ResourceDetailPage.tsx` full-page reader with article text and protected PDF download box.
- Build `MemberLoginModal.tsx` for email/password authentication and access request instructions.
- Connect `#resources/:id` routing with smooth browser history.

## Phase 4: Admin Panel Resource & Member Management
- Build `ResourceManager.tsx` inside the Admin Panel with tabs for:
  1. Article authoring, cover images, and PDF attachment upload.
  2. Paid member account creation, password management, and resource access assignment.
- Add "Resources & Members" tab to `AdminPanel.tsx` with live counter badge.

## Phase 5: Verification & Push Script
- Verify article reading, member login, and PDF download permissions.
- Test Admin Panel CRUD operations for both articles and member accounts.
- Update `push-updates.bat`, `.gsd/STATE.md`, and `walkthrough.md`.