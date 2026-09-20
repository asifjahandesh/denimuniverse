import { ResourceItem, MemberAccount, MembershipSettings } from "../types/content";

export const DEFAULT_RESOURCES: ResourceItem[] = [
  {
    id: "res-1",
    title: "Industrial Denim Finishing & Laser Recipe Guide",
    slug: "industrial-denim-finishing-laser-recipe-guide",
    category: "Finishing & Recipes",
    desc: "Complete factory handbook on laser power curves, potassium permanganate replacement, 3D whisker resin curing, and neutral cellulase wash cycles.",
    author: "Engr. Asif Jahan · Senior Wet Process Specialist",
    readTime: "9 min read",
    publishedAt: "September 2026",
    image: "https://images.pexels.com/photos/1082529/pexels-photo-1082529.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    isPremium: true,
    accessTier: "premium",
    priceBadge: "499 BDT · Premium SOP",
    singlePrice: "49 BDT",
    pdfTitle: "Denim_Finishing_and_Laser_Recipes_Standard.pdf",
    pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    pdfSize: "5.4 MB",
    pdfPages: 36,
    content: `### 1. Introduction: The Modern Denim Laundry Revolution
Traditional denim washing relied on aggressive scraping, stones, and caustic permanganate sprays that degraded fabric tensile strength and exposed workers to airborne hazards. Over the past five years, high-speed industrial CO₂ lasers paired with ozone reactors and nebulizing wash drums have set a new benchmark for sustainable mill production.

To achieve clean, natural vintage wear without fabric fiber degradation, the wet process engineer must balance pixel density, focal spot velocity, and subsequent wash chemistry.

---

### 2. Laser Marking Parameter Calibration
When burning whiskering, chevrons, or thigh abrasions onto rigid 100% cotton or cotton-elastane blends, the power curve must be adjusted according to indigo dye penetration:

- **Ring-Dyed Indigo (High Ring Factor):** Use **35–42% tube power** with a marking speed of **2,400 mm/s**. Because only the outer fiber sheath contains indigo, moderate energy cleanly vaporizes the color without charring the un-dyed core.
- **Deeply Penetrated / Sulphur Bottom Denims:** Increase dwell time with a power setting of **45–50%** and speed reduced to **1,800 mm/s**. Use an assist air knife (filtered dry air at 4.5 bar) to blow away sublimation smoke instantly, preventing grey recast halos.
- **Bi-Stretch & DualFX Fabrics:** Never exceed **34% power**. Polybutylene terephthalate (PBT) and elastane filaments melt at 220°C. High laser energy will cause micro-ruptures that appear as pucker defects or recovery loss after garment washing.

---

### 3. Eco-Friendly Permanganate Replacement Recipe
Potassium permanganate (PP) spray has been banned by major international brands. To replicate brilliant high-contrast local abrasions, use an organic activator bath with local brushing:

1. **Pre-Wash:** 40°C warm rinse for 5 minutes (liquor ratio 1:6) to remove sizing starch.
2. **Local Bleaching Compound:** Apply eco-bleach activator paste (glucose-based reducing agent + bio-surfactant) via airbrush or hand sponge.
3. **Steam Activation:** Hang garments in an oven steam chamber at 105°C for 8 minutes to activate the bio-oxidizer.
4. **Neutralization:** Cold water overflow rinse followed by 1.5 g/L sodium metabisulfite at 45°C for 10 minutes (pH 5.5).

---

### 4. 3D Whisker & Honeycomb Resin Baking
To achieve permanent, dimensional crease patterns on garment laps and knees:
- **Resin Formulation:** Low-formaldehyde DMDHEU resin at 60–80 g/L combined with 15 g/L magnesium chloride catalyst and 10 g/L polyethylene softener for tear strength preservation.
- **Curing Protocol:** Mount garments on 3D inflatable silicone dummies, apply creases by hand tool, and cure in an indirect hot-air conveyor oven at **150°C for exactly 15 minutes**.
- **Quality Standard:** Post-cure tensile loss must remain below **12%** compared to untreated control garments.

---

### 5. Download the Full 36-Page Factory Manual
The complete PDF manual includes:
- Exact recipe sheets for Stone Wash, Bleach Wash, Tinting, and Ozone Cycles.
- Laser raster calibration curves for Jeanologia and Tonello machines.
- Tensile & tear retention safety charts across 10 common denim constructions.
- Troubleshooting matrix for yellowing, tear failures, and irregular whisker sharpness.`,
  },
  {
    id: "res-2",
    title: "Rope Dyeing & Indigo Oxidation Chemistry Manual",
    slug: "rope-dyeing-indigo-oxidation-chemistry-manual",
    category: "Dyeing Chemistry",
    desc: "Technical parameters for hydrosulfite reduction, continuous pH & redox potential monitoring, skying time, and ring-dye penetration control.",
    author: "Denim Universe Technical Board",
    readTime: "8 min read",
    publishedAt: "August 2026",
    image: "https://images.pexels.com/photos/3738088/pexels-photo-3738088.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    isPremium: true,
    accessTier: "premium",
    priceBadge: "499 BDT · Premium SOP",
    singlePrice: "49 BDT",
    pdfTitle: "Indigo_Rope_Dyeing_Chemical_Parameters.pdf",
    pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    pdfSize: "4.1 MB",
    pdfPages: 28,
    content: `### 1. Fundamentals of Leuco-Indigo Chemistry
Synthetic indigo is insoluble in water. To dye cotton yarns, the dye molecule must be chemically reduced to its water-soluble salt form, **Leuco-Indigo** (Indigo White), using sodium dithionite (hydrosulfite) and sodium hydroxide (caustic soda).

Upon immersion in the dye vat, leuco-indigo penetrates the cotton fibers. As the yarn exits into open air (the skying zone), atmospheric oxygen rapidly oxidizes the leuco-indigo back into its insoluble blue pigment, trapping it mechanically inside the fiber matrix.

---

### 2. Critical Bath Parameters
Maintaining stable chemistry across an 8-box rope dye range requires strict chemical equilibrium:

- **Redox Potential (ORP):** Must be maintained between **-760 mV and -790 mV**.
  - If ORP rises above -740 mV, premature oxidation occurs inside the bath, creating insoluble indigo scum and dull, rubbed-off color.
  - If ORP drops below -820 mV, the bath is over-reduced, leading to excessive dye penetration into the core and poor laser wash-down behavior.
- **Bath pH:** Ideal range is **11.8 to 12.2**. At pH 12, mono-phenolate leuco-indigo dominates, yielding optimal ring dyeing with bright indigo cast.
- **Liquor Temperature:** Strictly kept at **22°C – 26°C**. Temperatures above 30°C cause the dye to penetrate deeply into the yarn center, ruining wash-down contrast.

---

### 3. Skying (Air Oxidation) Timing
The skying passage between dye boxes must allow complete oxidation before re-immersion:
- **Minimum Skying Time:** **120 seconds** per box at range running speed of 28–32 m/min.
- **Oxygen Circulation:** Forced ventilation fans with ambient humidity at 60–65% ensure fast conversion from yellow-green leuco to deep navy indigo.

---

### 4. What's Inside the Attached 28-Page Manual
- Daily chemical titration procedures for Caustic, Hydrosulfite, and Indigo stock feeds.
- Automated dosing pump set-point calculations based on yarn linear density (Ne count).
- Color shading management: Preventing tailing (dark-to-light lot deviation) from the start to the end of a 20,000-meter beam set.
- Beam washing and re-beaming tension control guidelines.`,
  },
  {
    id: "res-3",
    title: "Shuttle Loom Weaving & Selvedge Construction Standards",
    slug: "shuttle-loom-weaving-selvedge-construction-standards",
    category: "Weaving Standards",
    desc: "Operational blueprint for vintage Toyoda & Draper shuttle looms: warp tension calibration, reed density formulas, and redline selvedge binding.",
    author: "Mill Operations Team",
    readTime: "7 min read",
    publishedAt: "July 2026",
    image: "https://images.pexels.com/photos/4622224/pexels-photo-4622224.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    isPremium: true,
    accessTier: "basic",
    priceBadge: "199 BDT · Basic Manual",
    singlePrice: "49 BDT",
    pdfTitle: "Shuttle_Loom_Weaving_Master_Standard.pdf",
    pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    pdfSize: "3.8 MB",
    pdfPages: 22,
    content: `### 1. The Heritage Charm of Shuttle Looms
Modern air-jet and rapier looms weave denim at 800–1,200 picks per minute (ppm) by cutting each weft yarn at the edge, resulting in fringed selvedges that must be serged during garment making.

In contrast, traditional shuttle looms (such as the Japanese Toyoda G9 and American Draper X-3) operate at a deliberate **160–190 ppm**. A wooden shuttle carries a continuous weft bobbin back and forth across the shed, turning cleanly around the outer warp ends to create a smooth, self-bound **selvedge edge** (self-edge).

---

### 2. Loom Tension & Natural Slub Character
The slower speed and mechanical let-off motion of shuttle looms impart a distinct low-tension weave:
- **Warp Tension:** Kept intentionally relaxed (18–22 cN/end) compared to modern projectile looms (35 cN/end). This lets ring-spun slub yarns settle naturally into the 3/1 twill weave, creating authentic vertical fading streaks (tate-ochi) upon aging.
- **Weft Insertion:** The wooden shuttle must be checked daily for smooth box entry. Any chip on the shuttle nose causes broken picks or distorted selvedge tension.

---

### 3. Redline ID Yarn Insertion
The classic red-and-white selvedge ID requires dedicated edge beams or bobbin creels:
- Thread 4 ends of 2/20s bleached cotton + 2 ends of 2/20s bright red reactive-dyed yarn on each selvedge side through separate doup heddles.
- Use a 2-ply crossing weave to lock the edges firmly so they do not curl outward during sanforization or garment laundering.

---

### 4. What's Inside the Attached 22-Page Manual
- Daily shuttle loom preventive maintenance schedule (picking cam timing, leather buffer lubrication).
- Calculation sheets for fabric width shrinkage (loom state 31" to finished 29" selvedge).
- Loom stop diagnosis: Warp stops, shuttle flying defects, and weft loop tension errors.`,
  },
  {
    id: "res-4",
    title: "Sustainable Ozone & Nanobubble Waterless Wash Handbook",
    slug: "sustainable-ozone-nanobubble-waterless-wash-handbook",
    category: "Green Technology",
    desc: "EIM green score optimization manual: dry ozone bleaching, e-flow nebulization recipes, and zero-discharge water reclamation benchmarks.",
    author: "Sustainable Innovation Group",
    readTime: "6 min read",
    publishedAt: "June 2026",
    image: "https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    isPremium: true,
    accessTier: "basic",
    priceBadge: "199 BDT · Basic Manual",
    singlePrice: "49 BDT",
    pdfTitle: "Ozone_and_Nanobubble_Waterless_Handbook.pdf",
    pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    pdfSize: "4.9 MB",
    pdfPages: 30,
    content: `### 1. The Zero-Water Denim Washing Paradigm
Traditional denim wet processing consumed between 70 to 120 liters of fresh water per pair of jeans. By combining **Dry Ozone Gas Chambers** with **Nanobubble Nebulization** technologies (such as Tonello CORE and Jeanologia e-Flow), modern industrial laundries can produce bleached, vintage garments using less than **10 liters of water per jean**.

---

### 2. Dry Ozone Bleaching Mechanics
Ozone ($O_3$) is a powerful eco-friendly oxidizer created by passing pure oxygen through an electrical corona discharge field:
- **Direct Reaction:** $O_3$ gas reacts rapidly with the carbon-carbon double bonds in indigo dye molecules, breaking them down into small, colorless isatin fragments without damaging the cellulose cotton backbone.
- **Moisture Control:** Fabric moisture content is the critical catalyst. Keep garment humidity between **30% and 40%**.
  - If garments are bone-dry (<15% humidity), ozone cannot react effectively, yielding patchy results.
  - If garments are wet (>60% humidity), water blocks ozone penetration into the fibers.
- **Cycle Duration:** 15–20 minutes in a sealed rotating drum at an ozone concentration of **60–80 g/m³**.
- **Destruction & Safety:** At cycle completion, an active carbon thermal ozone destructor converts all residual $O_3$ back into harmless oxygen ($O_2$) before the drum door unlocks.

---

### 3. Nanobubble (Micro-Mist) Softening
Instead of filling the wash drum with 300 liters of water to soften 50 pairs of jeans, nanobubble generators aerosolize a micro-emulsion of silicone softener and water into millions of sub-micron droplets:
- Water consumption drops by **95%**.
- Softener pickup is 100% uniform across both inner and outer garment faces with zero chemical bath dumping into wastewater drains.

---

### 4. What's Inside the Attached 30-Page Handbook
- Jeanologia EIM (Environmental Impact Measuring) green-score certification checklist.
- Step-by-step retrofitting guide for existing washing machines with ozone injectors.
- Wastewater treatment (ETP) chemical load reductions and payback ROI calculators for mill owners.`,
  },
];

export const DEFAULT_MEMBERSHIP_SETTINGS: MembershipSettings = {
  basicPlan: {
    id: "basic",
    name: "Basic Technical Plan",
    price: "199 BDT",
    period: "Lifetime Access",
    badge: "Recommended for Technicians",
    description: "Ideal for students, junior technicians, and mill lab supervisors seeking standard factory SOPs and weaving/washing manuals.",
    features: [
      "Access to all Basic Level technical PDF manuals",
      "Weaving & Shuttle Loom Construction standards",
      "Sustainable Ozone & Nanobubble washing guides",
      "Defect troubleshooting guides & lab calculation sheets",
      "Lifetime updates to existing Basic manuals",
    ],
  },
  premiumPlan: {
    id: "premium",
    name: "Premium Master SOP Plan",
    price: "499 BDT",
    period: "Lifetime VIP Access",
    badge: "Full Access — Everything Unlocked",
    description: "Complete professional access for wet process specialists, mill directors, R&D managers, and chemical engineers.",
    features: [
      "UNLIMITED access to ALL Technical PDF Manuals (Basic + Premium)",
      "High-speed industrial CO₂ Laser calibration power curves",
      "Rope Dyeing ORP chemistry & continuous titration protocols",
      "Eco-friendly potassium permanganate replacement recipes",
      "Exclusive access to all future industrial manual releases",
      "Direct priority technical inquiry assistance",
    ],
  },
  paymentMethods: {
    bkash: "017XXXXXXXX (Personal / Send Money)",
    nagad: "017XXXXXXXX (Personal / Send Money)",
    bank: "Eastern Bank Ltd, Account: Denim Universe Ltd, A/C: 104XXXXXXXX",
    whatsapp: "+8801700000000",
    notice: "After completing Send Money via bKash or Nagad (in BDT), enter your Transaction ID (TrxID) in checkout for instant unlock, or contact us for assistance.",
  },
};

export const DEFAULT_MEMBERS: MemberAccount[] = [
  {
    id: "mem-basic",
    email: "basic@denimuniverse.com",
    password: "denim2026",
    name: "Tariqul (Basic Member)",
    status: "active",
    plan: "basic",
    accessAll: false,
    allowedResourceIds: [],
    notes: "Demo Basic Account — Can access Shuttle Loom & Sustainable Wash PDFs",
    createdAt: "2026-09-20T00:00:00.000Z",
  },
  {
    id: "mem-demo",
    email: "demo@denimuniverse.com",
    password: "denim2026",
    name: "Engr. Asif (Premium VIP)",
    status: "active",
    plan: "premium",
    accessAll: true,
    allowedResourceIds: [],
    notes: "Demo Premium Account — Full access to ALL technical PDF manuals",
    createdAt: "2026-09-20T00:00:00.000Z",
  },
];
