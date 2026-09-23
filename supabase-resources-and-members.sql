-- ==============================================================================
-- Denim Universe — Resources, Members & Payments Cloud Tables
-- ==============================================================================
-- Run this script in your Supabase Dashboard:
-- 1. Go to https://supabase.com/dashboard and open your project.
-- 2. Click "SQL Editor" in the left sidebar (the >_ icon).
-- 3. Click "New query", paste this entire script, and click "Run" (bottom right).
-- ==============================================================================

-- 1. RESOURCES TABLE (Technical SOPs, Guides & PDFs)
CREATE TABLE IF NOT EXISTS public.resources (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT,
  category TEXT NOT NULL,
  description TEXT,
  content TEXT,
  author TEXT,
  read_time TEXT,
  published_at TEXT,
  image TEXT,
  is_premium BOOLEAN DEFAULT true,
  access_tier TEXT DEFAULT 'premium',
  single_price TEXT DEFAULT '49 BDT',
  price_badge TEXT,
  pdf_title TEXT,
  pdf_url TEXT,
  pdf_size TEXT,
  pdf_pages INTEGER DEFAULT 20,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Enable RLS and public policies for resources
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read resources" ON public.resources;
CREATE POLICY "Public read resources" ON public.resources FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public mutate resources" ON public.resources;
CREATE POLICY "Public mutate resources" ON public.resources FOR ALL USING (true) WITH CHECK (true);

-- 2. MEMBERS TABLE (Registered Accounts)
CREATE TABLE IF NOT EXISTS public.members (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  status TEXT DEFAULT 'active',
  plan TEXT DEFAULT 'free',
  access_all BOOLEAN DEFAULT false,
  allowed_resource_ids JSONB DEFAULT '[]'::jsonb,
  email_verified BOOLEAN DEFAULT true,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Enable RLS and public policies for members
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read members" ON public.members;
CREATE POLICY "Public read members" ON public.members FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public mutate members" ON public.members;
CREATE POLICY "Public mutate members" ON public.members FOR ALL USING (true) WITH CHECK (true);

-- 3. PAYMENTS TABLE (Subscription & PDF Purchases)
CREATE TABLE IF NOT EXISTS public.payments (
  id TEXT PRIMARY KEY,
  member_id TEXT,
  member_name TEXT,
  member_email TEXT NOT NULL,
  payment_type TEXT NOT NULL,
  plan_id TEXT,
  plan_name TEXT,
  resource_id TEXT,
  resource_title TEXT,
  amount TEXT NOT NULL,
  method TEXT NOT NULL,
  sender_number TEXT,
  trx_id TEXT NOT NULL,
  screenshot_url TEXT,
  status TEXT DEFAULT 'pending',
  admin_notes TEXT,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Enable RLS and public policies for payments
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read payments" ON public.payments;
CREATE POLICY "Public read payments" ON public.payments FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public mutate payments" ON public.payments;
CREATE POLICY "Public mutate payments" ON public.payments FOR ALL USING (true) WITH CHECK (true);

-- ==============================================================================
-- SUCCESS MESSAGE
-- ==============================================================================
SELECT 'Resources, Members, and Payments tables created successfully with public access policies!' as status;
