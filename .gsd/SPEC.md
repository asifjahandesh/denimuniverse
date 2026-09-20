# Specification: Tiered Membership (Basic vs Premium) & In-Built Sign-Up System

## Metadata
- **Project**: Denim Universe
- **Feature**: User Self-Registration (Sign-Up / Sign-In) & Tiered Packages (Basic vs Premium) for Technical PDF Manuals
- **Status**: FINALIZED
- **Admin PIN**: `0707`

---

## 1. Overview & Business Requirements

### A. User Self-Registration (Sign-Up & Sign-In)
- Currently, only an admin-seeded login exists.
- Visitors must be able to **Sign Up** directly from the website:
  - Form fields: Full Name, Email Address, Password.
  - Instant account creation in local persistence (`du_members_v1`) and cloud database (`public.members`).
  - Seamless toggle between "Sign In" and "Create Account (Sign Up)" within the modal.
  - After registration, automatically signs the user in and saves the session.

### B. Tiered Packages (Basic vs Premium Plans)
1. **Basic Plan**:
   - Access to standard/foundational technical PDFs designated as **Basic**.
   - Ideal for students, junior technicians, and factory trainees.
2. **Premium Plan**:
   - Full, unrestricted access to **ALL** technical PDF manuals (both Basic and Premium SOPs).
   - Ideal for mill managers, wet processing heads, R&D directors, and international buyers.
3. **Free / Registered Account**:
   - Visitors who sign up without payment immediately get free access to all educational writings, glossary terms, and any "Free" PDF resources.
   - When attempting to download a Basic or Premium PDF, they see an upgrade card with plan comparison and checkout instructions.

### C. Full Admin Panel Management
1. **Plan & Pricing Settings**:
   - Admin can view and edit:
     - Basic Plan: Title, Price (e.g., "$9 · Starter Access" or "999 BDT"), Description, Features.
     - Premium Plan: Title, Price (e.g., "$19 · Complete SOP Access" or "1,999 BDT"), Description, Features.
     - Payment & Purchase Instructions: bKash number, Nagad number, Bank details, WhatsApp direct confirmation link, and special instructions.
2. **Resource Article Tier Assignment**:
   - In `ResourceManager.tsx`, when uploading or editing an article:
     - Access Tier selector: `Basic` (Basic + Premium access) vs `Premium` (Premium only) vs `Free` (Public download).
     - Price badge field auto-syncs or can be customized.
3. **Member Account Management**:
   - Admin can filter and search members by plan (`free`, `basic`, `premium`).
   - Admin can change any member's plan instantly (e.g., upgrading a member from `free` to `basic` or `premium` after confirming their payment).
   - Admin can record payment notes (bKash TrxID, invoice #, bank wire details).
   - Admin can activate or suspend member accounts.

---

## 2. Data Schema & Contracts

### 1. `MemberAccount`
```typescript
export interface MemberAccount {
  id: string;
  email: string;
  password: string;
  name: string;
  status: "active" | "suspended";
  plan: "free" | "basic" | "premium"; // Tier level
  accessAll: boolean;                // true for premium
  allowedResourceIds: string[];      // specific overrides if needed
  notes?: string;                    // bKash TrxID, payment reference
  createdAt: string;
}
```

### 2. `ResourceItem`
```typescript
export interface ResourceItem {
  id: string;
  title: string;
  slug?: string;
  category: string;
  desc: string;
  content: string;
  author: string;
  readTime: string;
  publishedAt: string;
  image: string;
  isPremium: boolean;
  accessTier: "free" | "basic" | "premium"; // Tier required to download PDF
  priceBadge: string;
  pdfTitle: string;
  pdfUrl: string;
  pdfSize: string;
  pdfPages?: number;
}
```

### 3. `MembershipPlanConfig` (Managed via Admin Panel & DataContext)
```typescript
export interface PlanTierConfig {
  id: "basic" | "premium";
  name: string;
  price: string;
  period: string;
  badge: string;
  description: string;
  features: string[];
}

export interface MembershipSettings {
  basicPlan: PlanTierConfig;
  premiumPlan: PlanTierConfig;
  paymentMethods: {
    bkash?: string;
    nagad?: string;
    bank?: string;
    whatsapp?: string;
    instructions?: string;
  };
}
```

---

## 3. Access Verification Logic
In `hasResourceAccess(resourceId: string)`:
- If `resource.accessTier === "free"` or `!resource.isPremium`: **Granted to all**.
- If visitor is NOT logged in: **Locked** (Prompt Sign In / Sign Up).
- If member status is `"suspended"`: **Locked** (Display suspension notice).
- If member `plan === "premium"` or member `accessAll === true`: **Granted for all PDFs**.
- If member `plan === "basic"`:
  - **Granted** if `resource.accessTier === "basic"` or `resource.accessTier === "free"`.
  - **Locked (Upgrade required)** if `resource.accessTier === "premium"`.
- If member has `resourceId` in `allowedResourceIds`: **Granted**.
- If member `plan === "free"`: **Locked (Upgrade required)**.

---

## 4. Verification Criteria
1. Member modal allows toggling between **Sign In** and **Sign Up**.
2. New visitors can register an account with Name, Email, Password, and immediately log in.
3. Pricing & Plan comparison card appears when user views locked PDF or clicks "View Packages".
4. Admin Panel allows editing Basic and Premium plan prices, features, and payment methods.
5. Admin Panel allows assigning `accessTier` (`free`, `basic`, `premium`) to any resource during creation/editing.
6. Admin Panel allows changing any member's plan tier and recording their payment reference.
7. Access rules correctly allow Basic members to download Basic PDFs, and Premium members to download all PDFs.