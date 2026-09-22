import sanforizingImg from "../assets/sanforizing-machine.jpg";
import inspectionImg from "../assets/denim-inspection-machine.jpg";

export const SITE_CONFIG = {
  brand: "Denim Universe",
  tagline: "Explore the World of Denim",
  facebookUrl: "https://www.facebook.com/share/1EGKnnQXrP/?mibextid=wwXIfr",
  email: "hello@denimuniverse.com",
  whatsapp: "https://wa.me/8801000000000",
  location: "Dhaka · Bangladesh — serving the global denim community",
  logo: "/logo.png",
  svgIcon: "/favicon.svg",
  gaId: "G-XEYN7P0ZQM",
};

export const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "Resources", href: "#resources" },
  { label: "Troubleshooting", href: "#troubleshooting" },
  { label: "Fashion", href: "#fashion" },
  { label: "Sustainability", href: "#sustainability" },
  { label: "Contact", href: "#contact" },
];

export const HERO_IMG =
  "https://images.pexels.com/photos/10133275/pexels-photo-10133275.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200";

export interface ProcessStep {
  no: string;
  title: string;
  aka: string;
  desc: string;
  points: string[];
  image: string;
}

export const PROCESS_STEPS: ProcessStep[] = [
  {
    no: "01",
    title: "Cotton",
    aka: "Fibre Selection",
    desc: "It all starts in the field. Long, clean, mature cotton with good micronaire and strength forms the soul of premium denim.",
    points: ["Upland, organic & recycled blends", "Trash < 2.5% · Strength 28+ g/tex", "Moisture 7–8% for spinning"],
    image: "https://images.pexels.com/photos/13924870/pexels-photo-13924870.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  },
  {
    no: "02",
    title: "Spinning",
    aka: "Yarn Formation",
    desc: "Cotton is blown, carded, drawn and spun into coarse, hairy yarns. Ring spinning gives character; open-end gives economy.",
    points: ["Ring / OE / Vortex spinning", "Typical 6–16 Ne warp yarn", "Slub & compact variants"],
    image: "https://images.pexels.com/photos/6717035/pexels-photo-6717035.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  },
  {
    no: "03",
    title: "Yarn Preparation",
    aka: "Winding & Ball Warping",
    desc: "Yarns are cleared, waxed and wound onto balls or beams — thousands of ends perfectly tensioned for dyeing.",
    points: ["Ball warping for rope dyeing", "Direct beams for slasher", "Tension CV% < 2"],
    image: "https://images.pexels.com/photos/8246486/pexels-photo-8246486.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  },
  {
    no: "04",
    title: "Indigo Dyeing",
    aka: "Rope · Slasher · Loop",
    desc: "The heart of denim. Warp yarns dip in indigo vats and oxidize from yellow-green to deep blue — layer by layer, dip by dip.",
    points: ["Rope dyeing: ring effect", "Slasher: continuous, level", "6–12 dips · pH 11–12"],
    image: "https://images.pexels.com/photos/35105782/pexels-photo-35105782.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  },
  {
    no: "05",
    title: "Warping",
    aka: "Re-beaming & Long Chain",
    desc: "Dyed ropes are opened, tensioned and wound onto weaver's beams — 4,000–6,000 ends aligned with zero crossing.",
    points: ["Long-chain beamer", "End-to-end tension control", "Shade grouping by beam"],
    image: "https://images.pexels.com/photos/16472162/pexels-photo-16472162.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  },
  {
    no: "06",
    title: "Sizing",
    aka: "Slashing Protection",
    desc: "A thin film of starch/PVA coats the warp so it survives 200+ picks per minute on the loom without breakage.",
    points: ["Size add-on 8–12%", "Moisture 6–8%", "Soft + low hairiness"],
    image: "https://images.pexels.com/photos/31212936/pexels-photo-31212936.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  },
  {
    no: "07",
    title: "Weaving",
    aka: "3/1 Right-Hand Twill",
    desc: "Indigo warp meets white weft in a 3/1 twill. Projectile, rapier and air-jet looms turn yarn into raw denim at scale.",
    points: ["EPI 60–90 · PPI 40–60", "Selvedge vs. shuttleless", "Speed 450–700 PPM"],
    image: "https://images.pexels.com/photos/16472144/pexels-photo-16472144.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  },
  {
    no: "08",
    title: "Finishing",
    aka: "Sanforizing & More",
    desc: "Singing, mercerizing, sanforizing and skew control stabilize the fabric — locking in hand-feel, width and shrinkage.",
    points: ["Sanforized < 2% shrinkage", "Skew < 3% · Bow < 2%", "Soft / peach / coated finishes"],
    image: sanforizingImg,
  },
  {
    no: "09",
    title: "Inspection",
    aka: "4-Point Quality Gate",
    desc: "Every meter is scanned under light for defects and graded on the 4-point system before rolling, packing and dispatch.",
    points: ["4-point system < 28 pts", "Shade, GSM, width check", "AQL garment audit"],
    image: inspectionImg,
  },
];

export interface TroubleItem {
  title: string;
  tag: string;
  problem: string;
  causes: string[];
  solutions: string[];
  severity: "High" | "Medium" | "Low";
}

export const TROUBLES: TroubleItem[] = [
  {
    title: "Shade Variation",
    tag: "Dyeing",
    problem: "Visible shade difference between rolls, beams, or selvedge-to-center in the same lot.",
    causes: ["Indigo concentration / pH fluctuation", "Uneven squeezing or oxidation time", "Mixing beams from different dye lots"],
    solutions: ["Control pH 11–12, monitor hydrosulphite dosing", "Group beams lot-wise; cut panel-wise (one-way)", "Standardize dip + airing time per shade"],
    severity: "High",
  },
  {
    title: "Barre Effect",
    tag: "Weaving",
    problem: "Horizontal bands or stripes across fabric width appearing after weaving or washing.",
    causes: ["Uneven weft tension or mixed weft lots", "Faulty pick spacing / take-up motion", "Yarn count variation in filling"],
    solutions: ["Use same weft lot per roll; check tensioners", "Calibrate take-up and temple settings", "Inspect loom timing every shift"],
    severity: "Medium",
  },
  {
    title: "Skewness",
    tag: "Finishing",
    problem: "Twisted legs after washing — twill line spirals away from the side seam of jeans.",
    causes: ["Unbalanced twill torque + no skew correction", "Overfeeding on sanforizer", "High washing agitation on raw fabric"],
    solutions: ["Skew-correct on stenter: 4–8% compensation", "Keep residual skew < 3% (ASTM D3882)", "Use broken twill / crosshatch for critical styles"],
    severity: "High",
  },
  {
    title: "Uneven Dyeing",
    tag: "Dyeing",
    problem: "Patchy or cloudy indigo coverage, light center or dark edges on warp sheet.",
    causes: ["Poor rope opening / dead ropes", "Low liquor circulation, blocked nozzles", "Incorrect squeeze roller pressure"],
    solutions: ["Open ropes fully with spreader combs", "Clean vats, equalize nip pressure", "Maintain uniform immersion + oxidation"],
    severity: "High",
  },
  {
    title: "Slubs (Unwanted)",
    tag: "Spinning",
    problem: "Random thick places beyond design — breaking surface uniformity in fine denims.",
    causes: ["Faulty drafting rollers, worn aprons", "Fluff accumulation in drafting zone", "Wrong slub parameters at spinning"],
    solutions: ["Overhaul drafting system; replace cots", "Clean with suction + auto-doffing", "Validate slub length / amplitude settings"],
    severity: "Medium",
  },
  {
    title: "Streaks",
    tag: "Weaving",
    problem: "Fine lengthwise lines running down the warp direction of the fabric.",
    causes: ["Dead or tight ends, reed marks", "Sizing variation across beam", "Damaged drop wires / heald eyes"],
    solutions: ["Polish / replace reed; check dents", "Level size pick-up across width", "Replace rough healds and drop pins"],
    severity: "Medium",
  },
  {
    title: "Shrinkage Problems",
    tag: "Finishing",
    problem: "Excessive length or width shrinkage after home laundering — garments go out of spec.",
    causes: ["Under-sanforizing / low compaction", "High weft crimp, loose construction", "No pre-shrinking before cutting"],
    solutions: ["Sanforize to <2% warp & weft", "Control overfeed 12–18% on compactor", "Pre-wash test per AATCC 135"],
    severity: "High",
  },
  {
    title: "GSM Variation",
    tag: "Quality",
    problem: "Fabric weight drifts high or low across length — affecting cost, hand-feel and cutting.",
    causes: ["Count variation, loom tension drift", "Uneven stretch / overfeed in finishing", "Moisture content fluctuation"],
    solutions: ["Condition fabric 4 hrs before GSM test", "Lock EPI/PPI + tension on loom", "Auto GSM control on stenter"],
    severity: "Medium",
  },
  {
    title: "Bowing",
    tag: "Finishing",
    problem: "Weft bows like a smile across the width — pattern pieces distort and stripes misalign.",
    causes: ["Uneven stenter pin / clip tension", "Off-center spreading before drying", "Unequal overfeed left-right"],
    solutions: ["Center fabric; balance clip pressure", "Straighten with bow rollers / weft straightener", "Keep bow < 2% (AATCC 20-pt check)"],
    severity: "Medium",
  },
  {
    title: "Crease Marks",
    tag: "Dyeing",
    problem: "Permanent lengthwise creases — white or dark lines that survive washing.",
    causes: ["Rope folding in dye bath", "High squeeze pressure on creased rope", "Poor opening after dyeing"],
    solutions: ["Use crease-free rope guides + spreaders", "Reduce nip pressure; open immediately", "Steam + stretch before drying"],
    severity: "Low",
  },
  {
    title: "Color Fastness Issues",
    tag: "Washing",
    problem: "Excess crocking, bleeding and fading — indigo rubs off on skin, bags and upholstery.",
    causes: ["Surface dye only (no fixation)", "Over-washing without cationic fix", "Low-quality indigo / poor rinsing"],
    solutions: ["Apply fixing agent; optimize rinsing", "Test crocking ISO 105-X12 (dry ≥4)", "Educate: wash inside-out, cold, less often"],
    severity: "High",
  },
  {
    title: "Washing Defects",
    tag: "Washing",
    problem: "Back-pocket imprint, pinholes, over-bleaching and yellowish cast after garment wash.",
    causes: ["Excess pumice / aggressive enzyme", "High temperature + long cycle", "Poor neutralization after bleach"],
    solutions: ["Switch to enzyme + laser + ozone", "Neutralize with anti-back-staining", "Pilot-wash every new shade first"],
    severity: "High",
  },
];

export interface FashionCard {
  title: string;
  desc: string;
  tag: string;
  image: string;
  stat: string;
}

export const FASHION_CARDS: FashionCard[] = [
  {
    title: "Denim Trends 2026",
    desc: "Wide-leg, baggy, barrel fits and dark-rinse minimalism dominate runways and streetwear.",
    tag: "Trends",
    image: "https://images.pexels.com/photos/19224972/pexels-photo-19224972.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    stat: "68% buyers prefer relaxed fits",
  },
  {
    title: "Denim Garments",
    desc: "Trucker jackets, overshirts, corsets, skirts and double-denim sets beyond the classic 5-pocket.",
    tag: "Garments",
    image: "https://images.pexels.com/photos/4109797/pexels-photo-4109797.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    stat: "40+ garment categories",
  },
  {
    title: "New Washes",
    desc: "Ice-wash, dirty-wash, fog-grey and vintage sun-fade achieved with minimal water chemistry.",
    tag: "Washes",
    image: "https://images.pexels.com/photos/7444977/pexels-photo-7444977.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    stat: "0 pumice · laser-first",
  },
  {
    title: "Finishing Effects",
    desc: "Whiskers, honeycombs, 3D crinkles, grinding and darning — engineered character, not accidents.",
    tag: "Finishing",
    image: "https://images.pexels.com/photos/4109758/pexels-photo-4109758.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    stat: "Laser precision ±0.5mm",
  },
  {
    title: "Denim Styles",
    desc: "From rigid selvedge to coated black — low-rise returns, high-rise stays, utility rules.",
    tag: "Styles",
    image: "https://images.pexels.com/photos/24287028/pexels-photo-24287028.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    stat: "Selvedge revival +214%",
  },
  {
    title: "Vintage Denim",
    desc: "Deadstock Levi's, hidden rivets and chain-stitched hems — history you can wear.",
    tag: "Vintage",
    image: "https://images.pexels.com/photos/10133274/pexels-photo-10133274.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    stat: "Vintage market $2.1B",
  },
  {
    title: "Stretch Denim",
    desc: "Comfort-stretch 1–2% elastane and power-stretch for jeggings — recovery is everything.",
    tag: "Stretch",
    image: "https://images.pexels.com/photos/34470862/pexels-photo-34470862.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    stat: "Recovery > 92% target",
  },
  {
    title: "Sustainable Fashion",
    desc: "Capsule wardrobes, repair culture and resale — buy once, wear 10 years, re-sell.",
    tag: "Eco Style",
    image: "https://images.pexels.com/photos/4546763/pexels-photo-4546763.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    stat: "-70% CO₂ with resale",
  },
];

export const SUST_STATS = [
  { value: 7500, suffix: "", label: "Litres water per jean (conventional)", note: "Target < 25L with new tech", invert: true },
  { value: 92, suffix: "%", label: "Water saved by laser + ozone washing", note: "vs. pumice stone wash" },
  { value: 33, suffix: "%", label: "Of denim now uses recycled cotton", note: "Up from 9% in 2018" },
  { value: 65, suffix: "%", label: "Less chemicals with foam dyeing", note: "Indigo foam, no vats" },
];

export const SUST_TOPICS = [
  { title: "Organic Cotton", desc: "Grown without synthetic pesticides — GOTS certified, healthier soil, 91% less blue water.", icon: "leaf" },
  { title: "Recycled Cotton", desc: "Pre/post-consumer waste re-spun — saves water, cuts landfill, GRS traceable.", icon: "recycle" },
  { title: "Water-Saving Processes", desc: "Foam dyeing, low-liquor washing and E-flow cut water from 70L to under 10L per jean.", icon: "droplet" },
  { title: "Sustainable Dyeing", desc: "Pre-reduced indigo, electrochemical dyeing and natural indigo lower hydrosulphite load.", icon: "flask" },
  { title: "Ozone Washing", desc: "O3 gas bleaches without water or pumice — vintage fades with near-zero effluent.", icon: "cloud" },
  { title: "Laser Technology", desc: "Pixel-perfect whiskers and fades in 90 seconds — no sandblasting, no silica risk.", icon: "zap" },
  { title: "Chemical Reduction", desc: "ZDHC MRSL chemistry, aniline-free indigo and bio-enzymes replace harsh oxidants.", icon: "shield" },
  { title: "Energy Efficiency", desc: "Heat recovery, solar steam and LED curing cut mill energy 25–40%.", icon: "battery" },
  { title: "Circular Denim", desc: "Design for disassembly — mono-materials, removable rivets, take-back into new yarn.", icon: "refresh" },
  { title: "Sustainable Finishing", desc: "E-flow nanobubbles, spray application and waterless softeners finish clean.", icon: "sparkles" },
];

export interface Category {
  name: string;
  desc: string;
  count: string;
  icon: string;
  topics: string[];
  color: string;
}

export const CATEGORIES: Category[] = [
  { name: "Fabric", desc: "Constructions, GSM, width, stretch & selvedge decoded.", count: "24 guides", icon: "layers", topics: ["3/1 vs 2/1 twill", "GSM calculation", "Selvedge vs shuttleless", "Stretch recovery"], color: "from-blue-600 to-indigo-800" },
  { name: "Yarn", desc: "Ring, OE, slub and core-spun yarn engineering.", count: "18 guides", icon: "spool", topics: ["Ring vs OE", "Ne count system", "Slub design", "Core-spun elastane"], color: "from-indigo-600 to-violet-700" },
  { name: "Dyeing", desc: "Rope, slasher & loop dyeing chemistry and control.", count: "21 guides", icon: "droplet", topics: ["Rope vs slasher", "Indigo redox", "pH & hydros control", "Bottoming & topping"], color: "from-cyan-600 to-blue-800" },
  { name: "Weaving", desc: "Looms, twills, EPI/PPI and loom-state faults.", count: "16 guides", icon: "grid", topics: ["Air-jet vs rapier", "Twill lines", "EPI/PPI math", "Loom efficiency"], color: "from-slate-600 to-navy-900" },
  { name: "Finishing", desc: "Sanforizing, skew, singeing and softening.", count: "15 guides", icon: "sparkles", topics: ["Sanforizing", "Skew correction", "Singeing", "Resin finishing"], color: "from-teal-600 to-emerald-800" },
  { name: "Washing", desc: "Enzyme, stone, acid, laser and ozone washes.", count: "19 guides", icon: "waves", topics: ["Enzyme wash", "Laser finishing", "Ozone bleach", "PP spray safety"], color: "from-sky-500 to-indigo-700" },
  { name: "Quality", desc: "4-point system, AQL, testing and lab methods.", count: "22 guides", icon: "badge", topics: ["4-point system", "AATCC tests", "Shade band", "GSM control"], color: "from-amber-500 to-orange-700" },
  { name: "Troubleshooting", desc: "Problem → Cause → Solution for every defect.", count: "30+ cases", icon: "wrench", topics: ["Shade variation", "Skew & bow", "Barre & streaks", "Crocking"], color: "from-rose-500 to-red-700" },
  { name: "Fashion", desc: "Trends, fits, washes and styling intelligence.", count: "17 stories", icon: "shirt", topics: ["Fit guide", "Wash library", "Vintage", "Runway trends"], color: "from-fuchsia-500 to-purple-700" },
  { name: "Sustainability", desc: "Organic, recycled, waterless and circular denim.", count: "20 guides", icon: "leaf", topics: ["Higg Index", "ZDHC", "Water footprint", "Circularity"], color: "from-green-600 to-emerald-800" },
  { name: "Technology", desc: "Automation, AI inspection, digital twins & ERP.", count: "14 guides", icon: "cpu", topics: ["AI fabric inspection", "Digital sampling", "Smart looms", "ERP"], color: "from-violet-600 to-indigo-800" },
  { name: "Industry Trends", desc: "Markets, sourcing shifts, prices & trade.", count: "12 reports", icon: "trend", topics: ["Bangladesh vs Turkey", "Cotton prices", "Nearshoring", "Denim fairs"], color: "from-orange-500 to-amber-700" },
];

export interface Article {
  id: number;
  category: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  image: string;
  featured?: boolean;
  body: string[];
}

export const ARTICLES: Article[] = [
  {
    id: 1,
    category: "Fabric",
    title: "How Denim Fabric Is Made — The Complete Journey",
    excerpt: "From cotton boll to folded roll: follow all nine stages of denim manufacturing with real mill parameters.",
    date: "Sep 08, 2026",
    readTime: "9 min read",
    image: "https://images.pexels.com/photos/4109758/pexels-photo-4109758.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    featured: true,
    body: [
      "Denim looks simple — blue face, white back — but it is one of the most engineered fabrics in textiles. The warp is dyed, the weft stays white, and a 3/1 twill buries the weft so the surface reads deep indigo.",
      "It begins with fibre selection. Mills blend Upland cotton (28–32mm staple) with recycled or organic content to balance cost, strength and sustainability. Trash content under 2.5% and micronaire 3.8–4.5 keeps spinning breaks low.",
      "Spinning decides character. Ring-spun yarns (7–12 Ne) are hairy and irregular — perfect for authentic vintage looks. Open-end yarns are cleaner and cheaper for value denim. Slub attachments intentionally thicken the yarn every few meters for crosshatch texture.",
      "Indigo dyeing is pure redox chemistry. Yarn dips into a yellow-green leuco-indigo vat at pH 11–12, then emerges into air where oxygen turns it blue. Six to twelve dips build shade depth — but only the yarn surface dyes, leaving a white core that fades beautifully.",
      "After dyeing comes sizing, weaving on air-jet or rapier looms (EPI 60–90, PPI 40–60), sanforizing to under 2% shrinkage, and 4-point inspection. A premium mill produces 40,000–80,000 meters per day at 92%+ efficiency.",
    ],
  },
  {
    id: 2,
    category: "Dyeing",
    title: "Rope Dyeing vs Slasher Dyeing — Which Wins?",
    excerpt: "Ring effect vs levelness, flexibility vs speed. A mill manager's honest comparison with cost math.",
    date: "Aug 28, 2026",
    readTime: "7 min read",
    image: "https://images.pexels.com/photos/31666019/pexels-photo-31666019.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    body: [
      "Rope dyeing twists 300–400 ends into a rope, dyes it in vats, then opens it back into a sheet. Because dye liquor penetrates poorly into the rope core, a white center remains — the famous ring dyeing that gives high-contrast fading.",
      "Slasher (sheet) dyeing dyes the full warp sheet directly in one continuous line with sizing attached. Penetration is deeper and more level, shade repeatability is better, but fading is flatter and less vintage.",
      "Choose rope for fashion denim, vintage washes and premium selvedge where character matters. Choose slasher for core basics, black and sulfur bottoms, and programs demanding tight shade bands across 100,000 meters.",
      "Cost-wise, slasher is 12–18% cheaper per meter (no re-beaming), while rope commands a $0.30–0.60/m premium. Most large mills run both — rope for fashion, slasher for volume.",
    ],
  },
  {
    id: 3,
    category: "Troubleshooting",
    title: "Common Denim Fabric Defects & Solutions",
    excerpt: "The 12 defects that cause 90% of claims — with root causes and mill-proven fixes in one cheat-sheet.",
    date: "Aug 15, 2026",
    readTime: "11 min read",
    image: "https://images.pexels.com/photos/1482180/pexels-photo-1482180.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    body: [
      "Shade variation tops every claim list. Root causes are almost always pH drift, indigo dosing error, or mixing dye lots in one cutting lay. Fix: lock dye parameters, shade-band every roll, and cut one-way.",
      "Skew and bow twist garments after one wash. Measure per ASTM D3882; correct on the stenter with 4–8% over-skew and keep residual skew under 3%. Broken twill constructions resist torque naturally.",
      "Barre and streaks come from the loom — mixed weft lots, worn reeds, uneven tension. One weft lot per roll and weekly reed inspection eliminate most cases.",
      "Document everything with photos under D65 light, keep retain samples for six months, and share this guide with your finishing and cutting teams. Prevention is ten times cheaper than re-cutting.",
    ],
  },
  {
    id: 4,
    category: "Quality",
    title: "Understanding Denim GSM — Weight That Matters",
    excerpt: "Why 8oz feels like summer and 14oz feels like armor — plus how to measure GSM without mistakes.",
    date: "Jul 30, 2026",
    readTime: "6 min read",
    image: "https://images.pexels.com/photos/36195132/pexels-photo-36195132.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    body: [
      "GSM (grams per square meter) is denim's weight language. Lightweight 5–9 oz suits shirts and summer jeans; midweight 10–12.5 oz is the everyday jean; heavyweight 13+ oz is rigid, selvedge, fade-chaser territory. (1 oz/yd² = 33.9 GSM.)",
      "Measure correctly: condition fabric 4 hours at 65% RH, cut 100 cm² with a GSM cutter from 5 places (avoid 15 cm from selvedge), and average. Never test sized loom-state fabric against finished specs.",
      "GSM drifts when yarn count, EPI/PPI or finishing stretch changes. A 5% drop in picks or 3% extra stenter stretch can move GSM a full ounce — and cost thousands in giveaway or rejection.",
    ],
  },
  {
    id: 5,
    category: "Finishing",
    title: "Why Denim Skew Happens — And How Mills Fix It",
    excerpt: "Twill torque explained in plain English, with stenter settings that actually hold after 3 washes.",
    date: "Jul 12, 2026",
    readTime: "8 min read",
    image: "https://images.pexels.com/photos/16472162/pexels-photo-16472162.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    body: [
      "Every 3/1 twill wants to twist. The diagonal structure stores torque that releases in the wash, dragging side seams forward. Left-hand twill skews left, right-hand skews right.",
      "Mills counter it by skewing fabric in the opposite direction on the stenter — typically 5–10% over-correction — then locking it with sanforizing compaction and resin where needed.",
      "Test per AATCC 179 / ASTM D3882: wash 3 cycles, measure seam displacement. Pass is under 3% for premium, 4% for value. If you fail, check stenter chain symmetry before blaming the loom.",
    ],
  },
  {
    id: 6,
    category: "Sustainability",
    title: "Modern Sustainable Denim Technologies",
    excerpt: "Laser, ozone, foam dyeing, E-flow: the tech stack cutting water 92% and chemicals 65%.",
    date: "Jun 25, 2026",
    readTime: "10 min read",
    image: "https://images.pexels.com/photos/27893078/pexels-photo-27893078.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    featured: true,
    body: [
      "A conventional jean drinks ~7,500 litres of water. A best-practice sustainable jean uses under 30 — same look, radically different footprint. Four technologies do the heavy lifting.",
      "Laser finishing replaces sandblasting and hand-scraping: a CO₂ laser burns whiskers and fades in 90 seconds with zero water and pixel precision. Ozone (O3) gas then bleaches back the cast without a drop of rinse water.",
      "Upstream, foam and spray dyeing apply indigo as foam instead of vats — 65% less water, 40% less energy, near-zero salt. Pre-reduced indigo and electrochemical reduction cut hydrosulphite use by half.",
      "The business case is real: water and energy savings pay back laser + ozone lines in 18–30 months, while Higg and ZDHC compliance unlocks premium buyers. Sustainability is now margin, not charity.",
    ],
  },
  {
    id: 7,
    category: "Fashion",
    title: "Latest Denim Fashion Trends — 2026 Edition",
    excerpt: "Baggy takes the crown, dark rinse returns, double-denim goes luxe. What to design, buy and stock.",
    date: "Jun 02, 2026",
    readTime: "5 min read",
    image: "https://images.pexels.com/photos/24287019/pexels-photo-24287019.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    body: [
      "Silhouettes keep relaxing: baggy, barrel and wide-leg now outsell skinny 3-to-1 in most Western markets, while Asia holds onto straight and tapered. Low-rise is back for womenswear; men stay mid-rise.",
      "Washes split two ways — super-dark rinse-on-rinse for minimalists, and heavily abraded vintage sun-fades for statement pieces. Grey-cast and ecru (un-dyed) denim are the quiet luxury picks.",
      "Details that sell: hidden selvedge coins, chain-stitched hems, tonal stitching, cropped truckers and denim maxi skirts. Pair with the repair-and-resale story — Gen Z pays more for jeans with a past and a future.",
    ],
  },
];

export interface DictTerm {
  term: string;
  short: string;
  detail: string;
  cat: string;
}

export const DICTIONARY: DictTerm[] = [
  { term: "GSM", short: "Grams per Square Meter — fabric weight.", detail: "Weight of one square meter of fabric. Denim ranges 150–500 GSM (4.5–15 oz). Measured with a 100 cm² cutter after conditioning.", cat: "Fabric" },
  { term: "Slub", short: "Intentional thick-thin places in yarn.", detail: "Created by varying draft during spinning. Gives crosshatch texture and vintage character. Measured by length, thickness and frequency.", cat: "Yarn" },
  { term: "Skew", short: "Spirality / twisting of weft after wash.", detail: "Twill torque drags seams off-grain. Tested per ASTM D3882 after 3 washes. Premium limit < 3%. Corrected on stenter.", cat: "Finishing" },
  { term: "Bow", short: "Weft curvature across fabric width.", detail: "Bow looks like a smile; skew looks like a diagonal. Caused by uneven stenter tension. Limit < 2% of width.", cat: "Finishing" },
  { term: "Rope Dyeing", short: "Warp dyed as twisted ropes, then opened.", detail: "300–400 ends per rope, 6–12 dips. Gives ring dyeing (white core) and high-contrast fading. Best for vintage denim.", cat: "Dyeing" },
  { term: "Slasher Dyeing", short: "Full warp sheet dyed + sized in one line.", detail: "Faster, more level, deeper penetration than rope. Ideal for basics and large shade-consistent programs.", cat: "Dyeing" },
  { term: "Sanforizing", short: "Mechanical pre-shrinking process.", detail: "Fabric is steamed, stretched and compacted between blanket and drum. Brings shrinkage under 2% warp/weft.", cat: "Finishing" },
  { term: "Ring Spinning", short: "Classic spinning for premium yarn.", detail: "Traveller twists drafted fibres into strong, hairy yarn with character. Slower but superior hand and fading.", cat: "Yarn" },
  { term: "Open-End (OE)", short: "Rotor spinning — fast and economical.", detail: "Fibres collected in a rotor and twisted open-end. Cleaner, bulkier yarn for value denim. Less strength than ring.", cat: "Yarn" },
  { term: "EPI", short: "Ends Per Inch — warp density.", detail: "Number of warp threads per inch. Denim typically 60–90 EPI. Higher EPI = denser, stronger, heavier fabric.", cat: "Weaving" },
  { term: "PPI", short: "Picks Per Inch — weft density.", detail: "Weft insertions per inch. Denim typically 40–60 PPI. Controls weight, cover and cost directly.", cat: "Weaving" },
  { term: "Shrinkage", short: "Dimensional change after washing.", detail: "Tested per AATCC 135. Sanforized denim < 2%; loom-state can shrink 8–12%. Always pre-test before cutting.", cat: "Quality" },
  { term: "Crocking", short: "Color rubbing off onto other surfaces.", detail: "Indigo rubs because it sits on yarn surface. Tested dry/wet per ISO 105-X12. Fix with rinsing + fixing agents.", cat: "Quality" },
  { term: "Selvedge", short: "Self-finished woven edge.", detail: "Made on shuttle looms; white edge with colored ticker line. Narrow (75–80 cm), premium, fades with character.", cat: "Fabric" },
  { term: "Indigo", short: "The blue dye of denim.", detail: "Vat dye, insoluble until reduced (leuco form). Surface-dyes cotton; white core enables fading. Now also bio & pre-reduced forms.", cat: "Dyeing" },
  { term: "Sizing", short: "Protective coating on warp yarn.", detail: "Starch/PVA film protects warp during weaving. Add-on 8–12%. Desized later in washing for soft hand.", cat: "Weaving" },
  { term: "Mercerizing", short: "Caustic treatment for luster & strength.", detail: "Cotton treated under tension with NaOH: +20% strength, better dye uptake, silk-like luster.", cat: "Finishing" },
  { term: "Stone Wash", short: "Pumice abrasion for faded look.", detail: "Classic wash using pumice stones. Being replaced by enzyme + laser for sustainability and consistency.", cat: "Washing" },
  { term: "Enzyme Wash", short: "Bio-polishing with cellulase.", detail: "Cellulase enzymes eat surface fibres for soft, faded denim without stones. Controlled by pH, temp and time.", cat: "Washing" },
  { term: "Twill", short: "Diagonal weave structure (3/1).", detail: "Warp floats over 3, under 1 weft. Right-hand, left-hand and broken variants change skew and fading.", cat: "Weaving" },
];

export interface GalleryItem {
  src: string;
  title: string;
  cat: string;
  tall?: boolean;
}

export const GALLERY: GalleryItem[] = [
  { src: "https://images.pexels.com/photos/4109758/pexels-photo-4109758.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", title: "Indigo twill macro", cat: "Fabric" },
  { src: "https://images.pexels.com/photos/16472144/pexels-photo-16472144.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", title: "Heritage loom hall", cat: "Weaving", tall: true },
  { src: "https://images.pexels.com/photos/35105782/pexels-photo-35105782.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", title: "Indigo dye vats", cat: "Dyeing" },
  { src: "https://images.pexels.com/photos/19224972/pexels-photo-19224972.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", title: "Trucker styling", cat: "Fashion", tall: true },
  { src: "https://images.pexels.com/photos/4109759/pexels-photo-4109759.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", title: "Folded rigid stack", cat: "Garments" },
  { src: "https://images.pexels.com/photos/27893078/pexels-photo-27893078.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", title: "Color vats aerial", cat: "Dyeing" },
  { src: "https://images.pexels.com/photos/32834844/pexels-photo-32834844.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", title: "Chain-stitch detail", cat: "Manufacturing", tall: true },
  { src: "https://images.pexels.com/photos/10133275/pexels-photo-10133275.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200", title: "Shade library", cat: "Fabric" },
  { src: "https://images.pexels.com/photos/24287028/pexels-photo-24287028.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", title: "Street denim", cat: "Fashion" },
  { src: "https://images.pexels.com/photos/6717035/pexels-photo-6717035.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", title: "Yarn creel", cat: "Manufacturing", tall: true },
  { src: "https://images.pexels.com/photos/1482180/pexels-photo-1482180.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200", title: "Copper rivet macro", cat: "Garments" },
  { src: "https://images.pexels.com/photos/13924870/pexels-photo-13924870.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", title: "Cotton origin", cat: "Sustainability" },
];

export const GALLERY_CATS = ["All", "Fabric", "Manufacturing", "Dyeing", "Weaving", "Garments", "Fashion", "Sustainability"];
