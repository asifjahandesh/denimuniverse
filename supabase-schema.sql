-- ==============================================================================
-- Denim Universe — Supabase Database Schema & Seed Script
-- Run this complete script in your Supabase SQL Editor:
-- Supabase Dashboard -> SQL Editor -> New Query -> Paste & Click Run
-- ==============================================================================

-- 1. TROUBLESHOOTING TABLE
CREATE TABLE IF NOT EXISTS public.troubles (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  tag TEXT NOT NULL,
  problem TEXT NOT NULL,
  causes JSONB NOT NULL DEFAULT '[]'::jsonb,
  solutions JSONB NOT NULL DEFAULT '[]'::jsonb,
  severity TEXT NOT NULL CHECK (severity IN ('High', 'Medium', 'Low')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. FASHION & TRENDS TABLE
CREATE TABLE IF NOT EXISTS public.fashion (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  "desc" TEXT NOT NULL,
  tag TEXT NOT NULL,
  image TEXT NOT NULL,
  stat TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. DICTIONARY TABLE
CREATE TABLE IF NOT EXISTS public.dictionary (
  id TEXT PRIMARY KEY,
  term TEXT NOT NULL,
  short TEXT NOT NULL,
  detail TEXT NOT NULL,
  cat TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. MEDIA GALLERY TABLE
CREATE TABLE IF NOT EXISTS public.gallery (
  id TEXT PRIMARY KEY,
  src TEXT NOT NULL,
  title TEXT NOT NULL,
  cat TEXT NOT NULL,
  tall BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. SITE CONFIGURATION TABLE
CREATE TABLE IF NOT EXISTS public.site_config (
  id TEXT PRIMARY KEY DEFAULT 'main',
  brand TEXT NOT NULL,
  tagline TEXT NOT NULL,
  facebook_url TEXT NOT NULL,
  email TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  location TEXT NOT NULL,
  logo TEXT,
  svg_icon TEXT,
  ga_id TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.site_config ADD COLUMN IF NOT EXISTS ga_id TEXT;
ALTER TABLE public.fashion ADD COLUMN IF NOT EXISTS content TEXT;
ALTER TABLE public.fashion ADD COLUMN IF NOT EXISTS author TEXT;
ALTER TABLE public.fashion ADD COLUMN IF NOT EXISTS read_time TEXT;
ALTER TABLE public.fashion ADD COLUMN IF NOT EXISTS published_at TEXT;

-- 6. NEWSLETTER SUBSCRIBERS TABLE
CREATE TABLE IF NOT EXISTS public.subscribers (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 7. INBOUND CONTACT MESSAGES TABLE
CREATE TABLE IF NOT EXISTS public.messages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  topic TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Anyone can read (SELECT), and app users/admin can modify (ALL)
-- ==============================================================================

ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public insert subscribers" ON public.subscribers;
CREATE POLICY "Public insert subscribers" ON public.subscribers FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Public read subscribers" ON public.subscribers;
CREATE POLICY "Public read subscribers" ON public.subscribers FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public insert messages" ON public.messages;
CREATE POLICY "Public insert messages" ON public.messages FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Public read messages" ON public.messages;
CREATE POLICY "Public read messages" ON public.messages FOR SELECT USING (true);

ALTER TABLE public.troubles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fashion ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dictionary ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_config ENABLE ROW LEVEL SECURITY;

-- Troubles policies
DROP POLICY IF EXISTS "Public read troubles" ON public.troubles;
CREATE POLICY "Public read troubles" ON public.troubles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public mutate troubles" ON public.troubles;
CREATE POLICY "Public mutate troubles" ON public.troubles FOR ALL USING (true) WITH CHECK (true);

-- Fashion policies
DROP POLICY IF EXISTS "Public read fashion" ON public.fashion;
CREATE POLICY "Public read fashion" ON public.fashion FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public mutate fashion" ON public.fashion;
CREATE POLICY "Public mutate fashion" ON public.fashion FOR ALL USING (true) WITH CHECK (true);

-- Dictionary policies
DROP POLICY IF EXISTS "Public read dictionary" ON public.dictionary;
CREATE POLICY "Public read dictionary" ON public.dictionary FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public mutate dictionary" ON public.dictionary;
CREATE POLICY "Public mutate dictionary" ON public.dictionary FOR ALL USING (true) WITH CHECK (true);

-- Gallery policies
DROP POLICY IF EXISTS "Public read gallery" ON public.gallery;
CREATE POLICY "Public read gallery" ON public.gallery FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public mutate gallery" ON public.gallery;
CREATE POLICY "Public mutate gallery" ON public.gallery FOR ALL USING (true) WITH CHECK (true);

-- Site Config policies
DROP POLICY IF EXISTS "Public read site_config" ON public.site_config;
CREATE POLICY "Public read site_config" ON public.site_config FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public mutate site_config" ON public.site_config;
CREATE POLICY "Public mutate site_config" ON public.site_config FOR ALL USING (true) WITH CHECK (true);

-- ==============================================================================
-- STORAGE BUCKET CONFIGURATION (denim-media)
-- ==============================================================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('denim-media', 'denim-media', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage policies for denim-media
DROP POLICY IF EXISTS "Public read denim-media" ON storage.objects;
CREATE POLICY "Public read denim-media" ON storage.objects FOR SELECT USING (bucket_id = 'denim-media');

DROP POLICY IF EXISTS "Public upload denim-media" ON storage.objects;
CREATE POLICY "Public upload denim-media" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'denim-media');

DROP POLICY IF EXISTS "Public update denim-media" ON storage.objects;
CREATE POLICY "Public update denim-media" ON storage.objects FOR UPDATE USING (bucket_id = 'denim-media');

DROP POLICY IF EXISTS "Public delete denim-media" ON storage.objects;
CREATE POLICY "Public delete denim-media" ON storage.objects FOR DELETE USING (bucket_id = 'denim-media');

-- ==============================================================================
-- PRE-SEED INITIAL DATA
-- ==============================================================================

-- Seed Site Config
INSERT INTO public.site_config (id, brand, tagline, facebook_url, email, whatsapp, location, logo, svg_icon)
VALUES (
  'main',
  'Denim Universe',
  'Explore the World of Denim',
  'https://www.facebook.com/share/1EGKnnQXrP/?mibextid=wwXIfr',
  'hello@denimuniverse.com',
  'https://wa.me/8801000000000',
  'Dhaka · Bangladesh — serving the global denim community',
  '/logo.png',
  '/favicon.svg'
) ON CONFLICT (id) DO UPDATE SET
  brand = EXCLUDED.brand,
  facebook_url = EXCLUDED.facebook_url,
  tagline = EXCLUDED.tagline;

-- Seed Troubleshooting Cases
INSERT INTO public.troubles (id, title, tag, problem, causes, solutions, severity)
VALUES
('tr-1', 'Shade Variation', 'Dyeing', 'Roll-to-roll or edge-to-center shade difference across fabric width or length.', '["pH fluctuation in dye bath", "Uneven oxidation during skying", "Tension variation across warp sheet"]'::jsonb, '["Maintain pH 11.5–12.0 constantly", "Equalize skying air circulation", "Calibrate tension sensors before every run"]'::jsonb, 'High'),
('tr-2', 'Barre Effect', 'Weaving', 'Horizontal bands or stripes across fabric width appearing after weaving or washing.', '["Uneven weft tension or mixed weft lots", "Faulty pick spacing / take-up motion", "Yarn count variation in filling"]'::jsonb, '["Use same weft lot per roll; check tensioners", "Calibrate take-up and temple settings", "Inspect loom timing every shift"]'::jsonb, 'Medium'),
('tr-3', 'Skewness', 'Finishing', 'Twisted legs after washing — twill line spirals away from the side seam of jeans.', '["Unbalanced twill torque + no skew correction", "Overfeeding on sanforizer", "High washing agitation on raw fabric"]'::jsonb, '["Skew-correct on stenter: 4–8% compensation", "Keep residual skew < 3% (ASTM D3882)", "Use broken twill / crosshatch for critical styles"]'::jsonb, 'High'),
('tr-4', 'Uneven Dyeing', 'Dyeing', 'Patchy or cloudy indigo coverage, light center or dark edges on warp sheet.', '["Poor rope opening / dead ropes", "Low liquor circulation, blocked nozzles", "Incorrect squeeze roller pressure"]'::jsonb, '["Open ropes fully with spreader combs", "Clean vats, equalize nip pressure", "Maintain uniform immersion + oxidation"]'::jsonb, 'High'),
('tr-5', 'Slubs (Unwanted)', 'Spinning', 'Random thick places beyond design — breaking surface uniformity in fine denims.', '["Faulty drafting rollers, worn aprons", "Fluff accumulation in drafting zone", "Wrong slub parameters at spinning"]'::jsonb, '["Overhaul drafting system; replace cots", "Clean with suction + auto-doffing", "Validate slub length / amplitude settings"]'::jsonb, 'Medium'),
('tr-6', 'Streaks', 'Weaving', 'Fine lengthwise lines running down the warp direction of the fabric.', '["Dead or tight ends, reed marks", "Sizing variation across beam", "Damaged drop wires / heald eyes"]'::jsonb, '["Polish / replace reed; check dents", "Level size pick-up across width", "Replace rough healds and drop pins"]'::jsonb, 'Medium'),
('tr-7', 'Shrinkage Problems', 'Finishing', 'Excessive length or width shrinkage after home laundering — garments go out of spec.', '["Under-sanforizing / low compaction", "High weft crimp, loose construction", "No pre-shrinking before cutting"]'::jsonb, '["Sanforize to <2% warp & weft", "Control overfeed 12–18% on compactor", "Pre-wash test per AATCC 135"]'::jsonb, 'High'),
('tr-8', 'GSM Variation', 'Quality', 'Fabric weight drifts high or low across length — affecting cost, hand-feel and cutting.', '["Count variation, loom tension drift", "Uneven stretch / overfeed in finishing", "Moisture content fluctuation"]'::jsonb, '["Condition fabric 4 hrs before GSM test", "Lock EPI/PPI + tension on loom", "Auto GSM control on stenter"]'::jsonb, 'Medium'),
('tr-9', 'Bowing', 'Finishing', 'Weft bows like a smile across the width — pattern pieces distort and stripes misalign.', '["Uneven stenter pin / clip tension", "Off-center spreading before drying", "Unequal overfeed left-right"]'::jsonb, '["Center fabric; balance clip pressure", "Straighten with bow rollers / weft straightener", "Keep bow < 2% (AATCC 20-pt check)"]'::jsonb, 'Medium'),
('tr-10', 'Crease Marks', 'Dyeing', 'Permanent lengthwise creases — white or dark lines that survive washing.', '["Rope folding in dye bath", "High squeeze pressure on creased rope", "Poor opening after dyeing"]'::jsonb, '["Use crease-free rope guides + spreaders", "Reduce nip pressure; open immediately", "Steam + stretch before drying"]'::jsonb, 'Low'),
('tr-11', 'Color Fastness Issues', 'Washing', 'Excess crocking, bleeding and fading — indigo rubs off on skin, bags and upholstery.', '["Surface dye only (no fixation)", "Over-washing without cationic fix", "Low-quality indigo / poor rinsing"]'::jsonb, '["Apply fixing agent; optimize rinsing", "Test crocking ISO 105-X12 (dry ≥4)", "Educate: wash inside-out, cold, less often"]'::jsonb, 'High'),
('tr-12', 'Washing Defects', 'Washing', 'Back-pocket imprint, pinholes, over-bleaching and yellowish cast after garment wash.', '["Excess pumice / aggressive enzyme", "High temperature + long cycle", "Poor neutralization after bleach"]'::jsonb, '["Switch to enzyme + laser + ozone", "Neutralize with anti-back-staining", "Pilot-wash every new shade first"]'::jsonb, 'High')
ON CONFLICT (id) DO NOTHING;

-- Seed Fashion Cards
INSERT INTO public.fashion (id, title, "desc", tag, image, stat)
VALUES
('fash-1', 'Denim Trends 2026', 'Wide-leg, baggy, barrel fits and dark-rinse minimalism dominate runways and streetwear.', 'Trends', 'https://images.pexels.com/photos/19224972/pexels-photo-19224972.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', '68% buyers prefer relaxed fits'),
('fash-2', 'Denim Garments', 'Trucker jackets, overshirts, corsets, skirts and double-denim sets beyond the classic 5-pocket.', 'Garments', 'https://images.pexels.com/photos/4109797/pexels-photo-4109797.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', '40+ garment categories'),
('fash-3', 'New Washes', 'Ice-wash, dirty-wash, fog-grey and vintage sun-fade achieved with minimal water chemistry.', 'Washes', 'https://images.pexels.com/photos/7444977/pexels-photo-7444977.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', '0 pumice · laser-first'),
('fash-4', 'Finishing Effects', 'Whiskers, honeycombs, 3D crinkles, grinding and darning — engineered character, not accidents.', 'Finishing', 'https://images.pexels.com/photos/4109758/pexels-photo-4109758.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', 'Laser precision ±0.5mm'),
('fash-5', 'Denim Styles', 'From rigid selvedge to coated black — low-rise returns, high-rise stays, utility rules.', 'Styles', 'https://images.pexels.com/photos/24287028/pexels-photo-24287028.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', 'Selvedge revival +214%'),
('fash-6', 'Vintage Denim', 'Deadstock Levi''s, hidden rivets and chain-stitched hems — history you can wear.', 'Vintage', 'https://images.pexels.com/photos/10133274/pexels-photo-10133274.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', 'Vintage market $2.1B'),
('fash-7', 'Stretch Denim', 'Comfort-stretch 1–2% elastane and power-stretch for jeggings — recovery is everything.', 'Stretch', 'https://images.pexels.com/photos/34470862/pexels-photo-34470862.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', 'Recovery > 92% target'),
('fash-8', 'Sustainable Fashion', 'Capsule wardrobes, repair culture and resale — buy once, wear 10 years, re-sell.', 'Eco Style', 'https://images.pexels.com/photos/4546763/pexels-photo-4546763.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', '-70% CO₂ with resale')
ON CONFLICT (id) DO NOTHING;

-- Seed Dictionary
INSERT INTO public.dictionary (id, term, short, detail, cat)
VALUES
('dict-1', 'GSM', 'Grams per Square Meter — fabric weight.', 'Weight of one square meter of fabric. Denim ranges 150–500 GSM (4.5–15 oz). Measured with a 100 cm² cutter after conditioning.', 'Fabric'),
('dict-2', 'Slub', 'Intentional thick-thin places in yarn.', 'Created by varying draft during spinning. Gives crosshatch texture and vintage character. Measured by length, thickness and frequency.', 'Yarn'),
('dict-3', 'Skew', 'Spirality / twisting of weft after wash.', 'Twill torque drags seams off-grain. Tested per ASTM D3882 after 3 washes. Premium limit < 3%. Corrected on stenter.', 'Finishing'),
('dict-4', 'Bow', 'Weft curvature across fabric width.', 'Bow looks like a smile; skew looks like a diagonal. Caused by uneven stenter tension. Limit < 2% of width.', 'Finishing'),
('dict-5', 'Rope Dyeing', 'Warp dyed as twisted ropes, then opened.', '300–400 ends per rope, 6–12 dips. Gives ring dyeing (white core) and high-contrast fading. Best for vintage denim.', 'Dyeing'),
('dict-6', 'Slasher Dyeing', 'Full warp sheet dyed + sized in one line.', 'Faster, more level, deeper penetration than rope. Ideal for basics and large shade-consistent programs.', 'Dyeing'),
('dict-7', 'Sanforizing', 'Mechanical pre-shrinking process.', 'Fabric is steamed, stretched and compacted between blanket and drum. Brings shrinkage under 2% warp/weft.', 'Finishing'),
('dict-8', 'Ring Spinning', 'Classic spinning for premium yarn.', 'Traveller twists drafted fibres into strong, hairy yarn with character. Slower but superior hand and fading.', 'Yarn'),
('dict-9', 'Open-End (OE)', 'Rotor spinning — fast and economical.', 'Fibres collected in a rotor and twisted open-end. Cleaner, bulkier yarn for value denim. Less strength than ring.', 'Yarn'),
('dict-10', 'EPI', 'Ends Per Inch — warp density.', 'Number of warp threads per inch. Denim typically 60–90 EPI. Higher EPI = denser, stronger, heavier fabric.', 'Weaving'),
('dict-11', 'PPI', 'Picks Per Inch — weft density.', 'Weft insertions per inch. Denim typically 40–60 PPI. Controls weight, cover and cost directly.', 'Weaving'),
('dict-12', 'Shrinkage', 'Dimensional change after washing.', 'Tested per AATCC 135. Sanforized denim < 2%; loom-state can shrink 8–12%. Always pre-test before cutting.', 'Quality'),
('dict-13', 'Crocking', 'Color rubbing off onto other surfaces.', 'Indigo rubs because it sits on yarn surface. Tested dry/wet per ISO 105-X12. Fix with rinsing + fixing agents.', 'Quality'),
('dict-14', 'Selvedge', 'Self-finished woven edge.', 'Made on shuttle looms; white edge with colored ticker line. Narrow (75–80 cm), premium, fades with character.', 'Fabric'),
('dict-15', 'Indigo', 'The blue dye of denim.', 'Vat dye, insoluble until reduced (leuco form). Surface-dyes cotton; white core enables fading. Now also bio & pre-reduced forms.', 'Dyeing')
ON CONFLICT (id) DO NOTHING;

-- Seed Gallery
INSERT INTO public.gallery (id, src, title, cat, tall)
VALUES
('gal-1', 'https://images.pexels.com/photos/4109758/pexels-photo-4109758.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', 'Indigo twill macro', 'Fabric', false),
('gal-2', 'https://images.pexels.com/photos/16472144/pexels-photo-16472144.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', 'Heritage loom hall', 'Weaving', true),
('gal-3', 'https://images.pexels.com/photos/35105782/pexels-photo-35105782.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', 'Indigo dye vats', 'Dyeing', false),
('gal-4', 'https://images.pexels.com/photos/19224972/pexels-photo-19224972.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', 'Trucker styling', 'Fashion', true),
('gal-5', 'https://images.pexels.com/photos/4109759/pexels-photo-4109759.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', 'Folded rigid stack', 'Garments', false),
('gal-6', 'https://images.pexels.com/photos/27893078/pexels-photo-27893078.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', 'Color vats aerial', 'Dyeing', false),
('gal-7', 'https://images.pexels.com/photos/32834844/pexels-photo-32834844.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', 'Chain-stitch detail', 'Manufacturing', true),
('gal-8', 'https://images.pexels.com/photos/10133275/pexels-photo-10133275.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200', 'Shade library', 'Fabric', false),
('gal-9', 'https://images.pexels.com/photos/24287028/pexels-photo-24287028.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', 'Street denim', 'Fashion', false),
('gal-10', 'https://images.pexels.com/photos/6717035/pexels-photo-6717035.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', 'Yarn creel', 'Manufacturing', true),
('gal-11', 'https://images.pexels.com/photos/1482180/pexels-photo-1482180.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200', 'Copper rivet macro', 'Garments', false),
('gal-12', 'https://images.pexels.com/photos/13924870/pexels-photo-13924870.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', 'Cotton origin', 'Sustainability', false)
ON CONFLICT (id) DO NOTHING;
