import { ResourceItem, MemberAccount, MembershipSettings } from "../types/content";

export const RESOURCE_CATEGORIES = [
  "Fiber",
  "Spinning",
  "Yarn",
  "Warping",
  "Dyeing",
  "Sizing",
  "Weaving",
  "Finishing",
  "Fabric",
  "Quality Assurance",
  "Physical Lab",
  "Chemical Lab",
  "Washing",
  "R&D",
  "Fashion Trends",
] as const;

export function normalizeCategory(cat?: string): string {
  if (!cat) return "Finishing";
  const trimmed = cat.trim();
  const lower = trimmed.toLowerCase();

  // Explicit removals: Map 4 legacy categories to the modern 15 disciplines
  if (lower === "finishing & recipes" || lower === "finishing and recipes" || lower.includes("recipe")) {
    return "Finishing";
  }
  if (lower === "dyeing chemistry" || lower === "dyeing & chemistry" || (lower.includes("dye") && lower.includes("chem"))) {
    return "Dyeing";
  }
  if (lower === "weaving standards" || lower === "weaving & yarn" || (lower.includes("weav") && lower.includes("standard"))) {
    return "Weaving";
  }
  if (lower === "green technology" || lower === "green tech" || lower === "sustainable tech" || lower.includes("green tech")) {
    return "Washing";
  }
  if (lower.includes("assuarance")) {
    return "Quality Assurance";
  }

  // Exact match against the 15 disciplines
  const matched = RESOURCE_CATEGORIES.find((c) => c.toLowerCase() === lower);
  if (matched) return matched;

  // Keyword match to standard disciplines
  if (lower.includes("fiber")) return "Fiber";
  if (lower.includes("spin")) return "Spinning";
  if (lower.includes("yarn")) return "Yarn";
  if (lower.includes("warp")) return "Warping";
  if (lower.includes("size") || lower.includes("sizing")) return "Sizing";
  if (lower.includes("dye")) return "Dyeing";
  if (lower.includes("weav")) return "Weaving";
  if (lower.includes("finish")) return "Finishing";
  if (lower.includes("fabric")) return "Fabric";
  if (lower.includes("physical")) return "Physical Lab";
  if (lower.includes("chemical") || lower.includes("chem lab")) return "Chemical Lab";
  if (lower.includes("wash") || lower.includes("ozone")) return "Washing";
  if (lower.includes("r&d") || lower.includes("research")) return "R&D";
  if (lower.includes("trend") || lower.includes("fashion")) return "Fashion Trends";

  return trimmed;
}

export const DEFAULT_RESOURCES: ResourceItem[] = [
  {
    id: "res-1",
    title: "Industrial Denim Finishing & Laser Recipe Guide",
    slug: "industrial-denim-finishing-laser-recipe-guide",
    category: "Finishing",
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
    category: "Dyeing",
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
    category: "Weaving",
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
    category: "Washing",
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
  {
    id: "res-fiber",
    title: "Cotton Fiber Selection, Micronaire & Staple Length Standards",
    slug: "cotton-fiber-selection-micronaire-staple-length-standards",
    category: "Fiber",
    desc: "Global cotton grade benchmarking for denim mills: HVI testing parameters, micronaire optimization, short fiber index (SFI), and maturity ratio control.",
    author: "Denim Raw Material & Fiber Technology Lab",
    readTime: "7 min read",
    publishedAt: "September 2026",
    image: "https://images.pexels.com/photos/4622224/pexels-photo-4622224.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    isPremium: true,
    accessTier: "basic",
    priceBadge: "199 BDT · Basic Manual",
    singlePrice: "49 BDT",
    pdfTitle: "Cotton_Fiber_Selection_and_Micronaire_Control.pdf",
    pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    pdfSize: "3.9 MB",
    pdfPages: 24,
    content: `### 1. Raw Cotton Sourcing Benchmarks for Indigo Denim
The characteristic durability and vintage fading of authentic denim starts with raw cotton fiber selection. High-speed open-end rotor and ring frames require specific fiber length uniformity and tensile strength to withstand tension in rope dyeing:

- **Fiber Length (UHML):** Standard warp denim demands **28–30 mm** staple length. Shorter fibers increase hairiness and generate lint deposits in dyeing boxes.
- **Micronaire (Linear Density & Maturity):** Optimal range is **3.8 to 4.5**.
  - Micronaire <3.5 indicates immature fibers prone to dye resist neps (white specks on dark indigo).
  - Micronaire >4.8 indicates coarse fibers that feel harsh and reduce spinning limit.
- **Short Fiber Index (SFI):** Must remain below **8.5%** to prevent excessive fly in the weaving shed.

---

### 2. High Volume Instrument (HVI) Testing Matrix
Every incoming cotton bale lot must undergo 100% testing on calibrated Uster HVI lines:
- **Tensile Strength:** Minimum **29.5–31.0 g/tex** for heavy-weight warp yarns.
- **Elongation at Break:** 6.0% to 7.2% to ensure adequate elasticity during rope slub tensioning.
- **Trash & Color Grade:** Strict adherence to USDA White Strict Middling (SM) or Middling (M) with leaf grade 2–3.

---

### 3. What's Inside the Attached 24-Page Manual
- Bale laydown blending algorithm for maintaining uniform dye affinity across month-long runs.
- Contamination prevention checklist: Polypropylene (PP), jute, and synthetic foil detection.
- Cotton origin comparison table: US Upland, Australian Premium, Giza, and Indian Shankar-6.`,
  },
  {
    id: "res-spinning",
    title: "Ring & Open-End Rotor Spinning Slub Profiles for Vintage Denim",
    slug: "ring-open-end-rotor-spinning-slub-profiles-vintage-denim",
    category: "Spinning",
    desc: "Engineering warp & weft slub effects: drafting ratio calibration, optical sensor slub injection, twist multipliers, and hairiness reduction.",
    author: "Yarn Spinning Systems Division",
    readTime: "8 min read",
    publishedAt: "September 2026",
    image: "https://images.pexels.com/photos/3738088/pexels-photo-3738088.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    isPremium: true,
    accessTier: "basic",
    priceBadge: "199 BDT · Basic Manual",
    singlePrice: "49 BDT",
    pdfTitle: "Denim_Yarn_Spinning_and_Slub_Design_Manual.pdf",
    pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    pdfSize: "4.3 MB",
    pdfPages: 26,
    content: `### 1. Vintage Ring Spun vs Open-End (OE) Dynamics
Traditional 1950s denim relied exclusively on ring-spun yarns with natural irregularities. Modern denim mills utilize computer-controlled servo draft rollers (Amsler, Caipo) to create deliberate slub patterns:

- **Ring-Spun Slubs:** Produce authentic longitudinal vertical fading (*tate-ochi*). Ring yarns have parallel fiber alignment with high core-to-surface indigo contrast.
- **Open-End (OE) Rotor Yarns:** Exhibit wrapper fibers with isotropic twist. They absorb indigo deeper into the cross-section, yielding a flatter, salt-and-pepper washdown popular in 1970s aesthetics.

---

### 2. Slub Design Parameters
When programming slub repeat files:
- **Thickness Multiple:** Base yarn count x 1.4 to 2.2 maximum. Exceeding 2.3x results in weft insertion stoppages on air-jet looms.
- **Slub Length:** 40 mm to 180 mm with randomized pauses to prevent moiré patterning.
- **Twist Multiplier (TM):** Standard warp twist factor is **4.2 to 4.6** for crisp hand feel and high tear resistance.

---

### 3. What's Inside the Attached 26-Page Manual
- Amsler & Pinter slub file programming templates with randomized pause algorithms.
- Traveler selection matrix for 6s, 8s, 10s, and 12s Ne coarse indigo warp counts.
- Ring spinning spindle speed curves vs end-down rate per 1,000 spindle hours (EDSH).`,
  },
  {
    id: "res-yarn",
    title: "Dual-Core & Stretch Elastane Yarn Dynamics in Denim Weaving",
    slug: "dual-core-stretch-elastane-yarn-dynamics-denim-weaving",
    category: "Yarn",
    desc: "T400 and Lycra DualFX filament insertion: core sheath integrity, draft ratio, thermal resistance, and bagging/knee-recovery prevention.",
    author: "Denim Core-Spun Engineering Group",
    readTime: "8 min read",
    publishedAt: "August 2026",
    image: "https://images.pexels.com/photos/10133275/pexels-photo-10133275.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    isPremium: true,
    accessTier: "premium",
    priceBadge: "499 BDT · Premium SOP",
    singlePrice: "49 BDT",
    pdfTitle: "Dual_Core_Elastane_Yarn_Dynamics_Standards.pdf",
    pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    pdfSize: "5.1 MB",
    pdfPages: 32,
    content: `### 1. Overcoming Stretch Bagging & Knee Growth
Traditional single-core elastane (Spandex/Lycra) denims offer high stretch (35–50%) but suffer from irreversible knee and seat bagging after repeated wearing. Dual-core yarn combines two distinct filaments inside a cotton sheath:

1. **Elastane Filament (40–70 Denier):** Delivers rapid initial power stretch.
2. **Elasterell-p / T400 / PBT (50–75 Denier):** A bi-component helical polyester filament providing high spring-back recovery and thermal dimensional stability.

---

### 2. Core-Spinning Machine Calibration
- **Drafting Tension:** Set elastane draft between **3.2 and 3.6**; T400 draft between **1.08 and 1.15**.
- **Centering Guide Alignment:** Filaments must enter exactly at the nip of the front drafting rollers. Misalignment causes exposed core filaments that burn out during laser finishing.
- **Roving Cover Factor:** Maintain cotton sheath percentage above **68%** by weight to guarantee authentic cotton hand feel and full indigo dye uptake.

---

### 3. What's Inside the Attached 32-Page Manual
- ASTM D3107 fabric growth and elastic recovery testing protocols.
- Heat-setting stenter temperature curves (185°C–195°C) to prevent elastane degradation.
- Troubleshooting broken cores, grin-through defects, and elastane heat shock in laundry dryers.`,
  },
  {
    id: "res-warping",
    title: "Direct & Ball Warping Tension Uniformity and Creel Alignment SOP",
    slug: "direct-ball-warping-tension-uniformity-creel-alignment-sop",
    category: "Warping",
    desc: "Eliminating center-to-selvedge tension variation: accumulator pneumatic damping, lease comb precision, and end-break detection protocols.",
    author: "Warp Preparation Technical Bureau",
    readTime: "6 min read",
    publishedAt: "August 2026",
    image: "https://images.pexels.com/photos/1082529/pexels-photo-1082529.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    isPremium: true,
    accessTier: "basic",
    priceBadge: "199 BDT · Basic Manual",
    singlePrice: "49 BDT",
    pdfTitle: "Warping_Tension_Uniformity_and_Creel_SOP.pdf",
    pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    pdfSize: "3.6 MB",
    pdfPages: 20,
    content: `### 1. Ball Warping for Continuous Indigo Rope Ranges
In rope dyeing, between 350 and 450 warp ends are gathered together into a single flexible cable (rope) and wound onto a large wooden or metal log (ball warp):
- **Creel Capacity:** Typically 400–500 packages per creel with optical yarn tensioners.
- **Tension Equalization:** Center-to-outer package distance difference must be compensated with disc weights or automated electromagnetic tension brakes.
- **Lease Strings:** Inserted every 1,000 meters to maintain yarn order during downstream re-beaming (long chain beamer / LCB).

---

### 2. Direct Warping for Slasher Dyeing
For slasher (sheet) dyeing lines, yarns are wound directly onto wide flanged beams:
- **Speed & Density:** 600–800 m/min with hydraulic beam press roll keeping density at **0.48–0.52 g/cm³**.
- **Expanding Comb Pitch:** Must match dye vat roller width precisely to eliminate yarn overlapping or crossing during wet box immersion.

---

### 3. What's Inside the Attached 20-Page Manual
- Daily creel tension audit sheets with electronic tensiometer calibration steps.
- Ball warp circumference measurement methods to ensure identical rope lengths across sets.
- Stop-motion sensor sensitivity tuning to catch single yarn breaks within 0.15 seconds.`,
  },
  {
    id: "res-sizing",
    title: "Denim Warp Sizing Chemistry, Starch Formulations & Size Add-On %",
    slug: "denim-warp-sizing-chemistry-starch-pva-size-add-on",
    category: "Sizing",
    desc: "Optimizing warp yarn weavability: modified maize starch recipes, synthetic binder dosage, squeeze roll pressure, and moisture regain control.",
    author: "Chemical Sizing Operations Directorate",
    readTime: "9 min read",
    publishedAt: "July 2026",
    image: "https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    isPremium: true,
    accessTier: "premium",
    priceBadge: "499 BDT · Premium SOP",
    singlePrice: "49 BDT",
    pdfTitle: "Denim_Warp_Sizing_and_Add_On_Standard.pdf",
    pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    pdfSize: "5.2 MB",
    pdfPages: 34,
    content: `### 1. Sizing Chemistry for Coarse Indigo Warp Yarns
Sizing coats warp yarns with a protective film to endure intense abrasion from loom reeds, drop wires, and heddles:
- **Film Properties:** The size film must be elastic and flexible. A brittle starch film fractures during shedding, causing severe fuzz balls and loom stops.
- **Indigo Protection:** Sizing must coat the ring-dyed indigo layer without bleeding or stripping dye into the size cooking box.

---

### 2. Standard Sizing Formulation
For a 1,000-liter cooking kettle (10s Ne 100% cotton warp):
1. **Thin-Boiling Modified Maize Starch:** 85 kg
2. **PVA (Low Hydrolysis / Fully Biodegradable):** 15 kg
3. **Acrylic Lubricating Binder:** 6 kg
4. **Hydrogenated Vegetable Wax Softener:** 3.5 kg
- **Refractometer Brix:** 8.5% – 9.5% at size box running temperature (85°C).
- **Size Add-on Target:** **9.5% to 11.0%** dry add-on on yarn weight.

---

### 3. What's Inside the Attached 34-Page Manual
- Squeeze roll pneumatic pressure charts (15–40 kN) vs yarn speed curves.
- Moisture regain measurement (optimal 6.5–7.5% exit moisture to prevent mildew or brittleness).
- De-sizing washdown recipes and enzyme compatibility tests for laundry wet-processors.`,
  },
  {
    id: "res-fabric",
    title: "Denim Fabric Engineering: 3/1 RHT, Broken Twill & Density Calculations",
    slug: "denim-fabric-engineering-3-1-rht-broken-twill-density",
    category: "Fabric",
    desc: "Structural design formulas for indigo denim: cover factor, warp/weft crimp balance, skew angle prediction, and ounce-weight yield optimization.",
    author: "Fabric Design & Textile Mathematics Board",
    readTime: "8 min read",
    publishedAt: "July 2026",
    image: "https://images.pexels.com/photos/10133275/pexels-photo-10133275.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    isPremium: true,
    accessTier: "basic",
    priceBadge: "199 BDT · Basic Manual",
    singlePrice: "49 BDT",
    pdfTitle: "Denim_Fabric_Construction_and_Formulas.pdf",
    pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    pdfSize: "4.0 MB",
    pdfPages: 26,
    content: `### 1. Classical Denim Twill Geometry
Denim is fundamentally a warp-face twill where warp yarns float over multiple wefts before stepping diagonally:
- **3/1 Right-Hand Twill (RHT):** The universal Levi's standard. Diagonals run from bottom-left to top-right (Z-direction). Yields a firm, durable surface with pronounced twill lines.
- **3/1 Left-Hand Twill (LHT):** Lee heritage style. Diagonals run bottom-right to top-left (S-direction). Produces a softer hand feel because Z-twist warp yarns untwist slightly during wear.
- **Broken Twill (Herringbone):** Inverts direction every two ends (Wrangler 1964 innovation). Neutralizes directional torque, completely preventing leg twist after laundering.

---

### 2. Ounce Weight (oz/yd²) Calculation Formula
To calculate finished fabric square yard weight accurately:
$$\text{Weight (oz/yd}^2) = \frac{(\text{EPI} \times 1.08) + (\text{PPI} \times 1.05)}{\text{Yarn Count (Ne)} \times 28.5}$$
Where EPI = Ends Per Inch, PPI = Picks Per Inch, and multipliers account for warp/weft crimp and sizing add-on.

---

### 3. What's Inside the Attached 26-Page Manual
- Full technical spec cards for 10 iconic fabric constructions (from 9.5 oz summer stretch to 16.5 oz heavy selvedge).
- Skew calculation formulas and Sanforizer skew roll angle setup.
- Weave draft and lifting plans for Staubli cam and dobby motions.`,
  },
  {
    id: "res-qa",
    title: "Denim Mill Quality Assurance (QA) & 4-Point Fabric Inspection Standard",
    slug: "denim-mill-quality-assurance-qa-4-point-fabric-inspection",
    category: "Quality Assurance",
    desc: "ASTM D5430 inspection protocols: defect point assignment, continuous roll grading, listing shade variation, and mill penalty deduction matrix.",
    author: "Denim QA & Factory Audit Commission",
    readTime: "9 min read",
    publishedAt: "June 2026",
    image: "https://images.pexels.com/photos/3738088/pexels-photo-3738088.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    isPremium: true,
    accessTier: "premium",
    priceBadge: "499 BDT · Premium SOP",
    singlePrice: "49 BDT",
    pdfTitle: "Denim_Mill_QA_4_Point_Inspection_Standard.pdf",
    pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    pdfSize: "5.6 MB",
    pdfPages: 38,
    content: `### 1. The ASTM D5430 4-Point Inspection System
The international standard for denim grading assigns defect penalty points based on physical length:
- Defect length up to 3 inches: **1 point**
- Defect length between 3 and 6 inches: **2 points**
- Defect length between 6 and 9 inches: **3 points**
- Defect length over 9 inches or hole/tear: **4 points**

Maximum allowable points for First Quality export denim is **28 points per 100 square yards**.

---

### 2. Critical Denim Mill Defect Categories
1. **Listing / Shading:** Side-to-center or side-to-side delta E color deviation (>0.8 DE CMC is rejected).
2. **Weft Bars / Starting Marks:** Density variation caused by loom stoppages.
3. **Slub Irregularity:** Double slubs or missing slubs breaking visual repeat harmony.
4. **Sanforizer Uneven Pre-Shrinkage:** Lengthwise shrinkage variation exceeding ±1.5% within the same roll.

---

### 3. What's Inside the Attached 38-Page Manual
- Complete 4-Point penalty point calculation spreadsheet with automated roll pass/fail formulas.
- Digital inspection camera calibration guide for automated fabric scanning frames.
- Factory claim settlement guidelines: Shortage allowance, splice penalties, and shade sorting protocols.`,
  },
  {
    id: "res-physlab",
    title: "Physical Testing Manual: Tensile, Tear, Crocking & Elastic Recovery",
    slug: "physical-testing-manual-tensile-tear-crocking-elastic-recovery",
    category: "Physical Lab",
    desc: "Comprehensive lab test methods: ASTM D5034 Grab, ASTM D1424 Elmendorf, ASTM D3107 stretch & growth, and Martindale abrasion test cycles.",
    author: "Central Physical Textile Testing Laboratory",
    readTime: "8 min read",
    publishedAt: "June 2026",
    image: "https://images.pexels.com/photos/1082529/pexels-photo-1082529.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    isPremium: true,
    accessTier: "premium",
    priceBadge: "499 BDT · Premium SOP",
    singlePrice: "49 BDT",
    pdfTitle: "Denim_Physical_Testing_Procedures_ASTM_ISO.pdf",
    pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    pdfSize: "4.8 MB",
    pdfPages: 30,
    content: `### 1. Essential Physical Test Standards for Denim
Denim fabrics endure severe washing enzymes, stone abrasion, and customer wear. Physical test results must be verified prior to garment shipment:

- **Tensile Strength (ASTM D5034 Grab Method):**
  - Warp: Minimum **65–80 kgf** (depending on weight)
  - Weft: Minimum **35–50 kgf**
- **Tear Strength (ASTM D1424 Elmendorf Pendulum):**
  - Rigid Denim: Warp >2,800 gf, Weft >2,200 gf
  - Post-Wash / Destroyed Look: Minimum **1,600 gf** to avoid customer rip claims.
- **Crocking Fastness (AATCC 8 / ISO 105-X12):**
  - Dry Crocking: Grade 3.0–3.5
  - Wet Crocking: Grade 1.5–2.0 (inherent to indigo ring-dyed chemistry).

---

### 2. Conditioning Room Standards
All physical testing must occur in an accredited atmosphere:
- **Temperature:** 21°C ± 1°C
- **Relative Humidity (RH):** 65% ± 2%
- **Pre-conditioning:** Minimum **4 hours** exposure on open mesh racks before testing.

---

### 3. What's Inside the Attached 30-Page Manual
- Daily calibration certificates and maintenance logs for Instron/Titan tensile testing machines.
- Martindale abrasion endpoint assessment photographic standards (thread break vs fuzzing).
- Full laboratory report template ready for brand accreditation submissions.`,
  },
  {
    id: "res-chemlab",
    title: "Chemical Laboratory Standards: Formaldehyde, pH & Dyestuff Analysis",
    slug: "chemical-laboratory-standards-formaldehyde-ph-dyestuff-analysis",
    category: "Chemical Lab",
    desc: "Eco-compliance & OEKO-TEX testing: spectrophotometric hydrosulfite titration, free formaldehyde HPLC detection, and wastewater COD/BOD analysis.",
    author: "Environmental Chemical Compliance Bureau",
    readTime: "8 min read",
    publishedAt: "May 2026",
    image: "https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    isPremium: true,
    accessTier: "premium",
    priceBadge: "499 BDT · Premium SOP",
    singlePrice: "49 BDT",
    pdfTitle: "Denim_Chemical_Laboratory_Analysis_Handbook.pdf",
    pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    pdfSize: "4.7 MB",
    pdfPages: 28,
    content: `### 1. Chemical Safety & MRSL Compliance in Denim Mills
Modern international brands enforce strict Zero Discharge of Hazardous Chemicals (ZDHC) standards across denim manufacturing:
- **pH Value (ISO 3071):** Finished denim extract must stay strictly within **5.5 to 7.5**. Alkaline residues irritate consumer skin and accelerate atmospheric yellowing.
- **Free Formaldehyde (ISO 14184-1):** DMDHEU 3D whisker resin must not emit more than **16 ppm** (babywear) or **75 ppm** (direct skin contact).
- **Heavy Metals & Azo Amines:** Zero detectable banned aromatic amines cleaved from azo colorants.

---

### 2. Indigo Dyestuff Purity & Redox Titration
Continuous titration of chemical stock feeds:
- **Hydrosulfite Titration:** Using potassium ferricyanide with methylene blue indicator to measure active reducing capacity.
- **Caustic Soda Content:** Acid-base titration with 1N HCl and phenolphthalein.

---

### 3. What's Inside the Attached 28-Page Manual
- Standard chemical laboratory setup equipment list (UV-Vis spectrophotometer, pH meter, Soxhlet extractor).
- Effluent treatment plant (ETP) testing procedures: Chemical Oxygen Demand (COD) and Biological Oxygen Demand (BOD₅).
- Restricted Substances List (RSL) testing schedule and chemical supplier audit checklist.`,
  },
  {
    id: "res-rd",
    title: "Next-Generation Denim R&D: Circular Recycling & Bio-Indigo Innovation",
    slug: "next-generation-denim-rd-circular-recycling-bio-indigo-innovation",
    category: "R&D",
    desc: "Advanced mill research: post-consumer recycled (PCR) cotton spinning, biosynthetic bacterial indigo, and enzyme-assisted decorticated bast fibers.",
    author: "Denim Future Materials & R&D Institute",
    readTime: "9 min read",
    publishedAt: "May 2026",
    image: "https://images.pexels.com/photos/4622224/pexels-photo-4622224.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    isPremium: true,
    accessTier: "premium",
    priceBadge: "499 BDT · Premium SOP",
    singlePrice: "49 BDT",
    pdfTitle: "Circular_Denim_RD_and_Material_Innovations.pdf",
    pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    pdfSize: "5.4 MB",
    pdfPages: 34,
    content: `### 1. Circular Economy & Fiber-to-Fiber Recycling
Mechanical tearing of post-consumer denim garments degrades staple length to under 18 mm. Advanced R&D blending allows up to 35% PCR cotton without sacrificing warp strength:
- **Optimized Fiber Architecture:** Blend 30% recycled cotton with 70% virgin long-staple cotton (31 mm) to offset short fiber weakness.
- **Chemical De-Colorization:** Enzyme-assisted indigo stripping allows clean reprocessing without toxic chlorinated bleaching agents.

---

### 2. Biosynthetic & Plant-Based Indigoid Research
- **Fermented Bio-Indigo:** Utilizing engineered *E. coli* or yeast strains to produce indican precursors that oxidize into pure indigo without petroleum aniline.
- **Hemp & Flax Bast Fiber Decortication:** Softened industrial hemp blends offer 4x tensile strength of cotton and consume 75% less agricultural water.

---

### 3. What's Inside the Attached 34-Page Manual
- PCR cotton blending trials and carding nep count optimization records.
- Life Cycle Assessment (LCA) data comparing conventional vs circular denim formulations.
- Intellectual property and patent filing guide for textile engineering R&D departments.`,
  },
  {
    id: "res-trends",
    title: "Denim Fashion & Trend Forecasting: Silhouettes, Washes & Market Analytics",
    slug: "denim-fashion-trend-forecasting-silhouettes-washes-market-analytics",
    category: "Fashion Trends",
    desc: "Global denim trend forecasting: vintage wide-leg proportions, heritage selvedge workwear, tinting palettes, and consumer retail intelligence.",
    author: "Denim Universe Trend & Creative Studio",
    readTime: "7 min read",
    publishedAt: "April 2026",
    image: "https://images.pexels.com/photos/10133275/pexels-photo-10133275.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    isPremium: true,
    accessTier: "basic",
    priceBadge: "199 BDT · Basic Manual",
    singlePrice: "49 BDT",
    pdfTitle: "Global_Denim_Runway_and_Wash_Forecast_2026.pdf",
    pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    pdfSize: "4.4 MB",
    pdfPages: 24,
    content: `### 1. Global Denim Macro Trend Shifts
The denim market has shifted decisively from skinny stretch denim toward authentic, architectural rigid and low-stretch heritage silhouettes:
- **Wide-Leg & Barrel Cut Proportions:** Demands 12.5–14.5 oz structured denim with high drape stiffness and authentic twill clarity.
- **Workwear & Utility Details:** Reinforced carpenter panels, triple-needle chain stitching, and hammer loops driving heavier 3/1 RHT constructions.
- **Clean Raw Selvedge Revival:** Consumer desire for personal fading journeys without factory distress wash chemicals.

---

### 2. Wash & Color Forecast
- **Dirty & Mud Tinting:** Overdyeing faded indigo with direct or sulphur dyes in beige, tea-leaf green, and khaki grey tones.
- **Pure 1990s Mid-Stone:** Uniform grey-blue casts achieved through gentle cellulase enzyme tumbling without local laser abrasions.
- **Salt-and-Pepper Marble:** High contrast washdowns on coarse open-end denim weaves.

---

### 3. What's Inside the Attached 24-Page Manual
- Global retail pricing breakdown: Budget, premium, and luxury denim market share forecasts.
- Palette color swatch codes (Pantone TCX matching for indigo overdyeing).
- Fit specification sheets with waist-to-hem rise and sweep measurements across sizes.`,
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
