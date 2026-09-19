export interface FashionStorySection {
  heading: string;
  body: string;
}

export interface FashionStoryDetail {
  slug: string;
  title: string;
  subtitle: string;
  tag: string;
  stat: string;
  author: string;
  authorRole: string;
  readTime: string;
  publishedAt: string;
  image: string;
  imageCaption: string;
  leadSummary: string;
  sections: FashionStorySection[];
  keyTakeaways: string[];
  specs: {
    idealWeight: string;
    twillType: string;
    washMethod: string;
    targetFit: string;
  };
}

export const FASHION_STORIES: Record<string, FashionStoryDetail> = {
  "fash-1": {
    slug: "denim-trends-2026",
    title: "Denim Trends 2026: The Architectural Shift Toward Relaxed Silhouettes",
    subtitle: "Wide-leg, baggy, barrel fits and dark-rinse minimalism dominate runways and global streetwear.",
    tag: "Trends",
    stat: "68% buyers prefer relaxed fits",
    author: "Denim Universe Editorial",
    authorRole: "Fashion & Fabric Intelligence",
    readTime: "5 min read",
    publishedAt: "Autumn/Winter 2026 Collection",
    image: "https://images.pexels.com/photos/19224972/pexels-photo-19224972.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    imageCaption: "Architectural volume: the 2026 wide-leg silhouette cut from heavyweight rigid indigo.",
    leadSummary: "The skinny jean era has officially yielded to architectural volume. For 2026, designers and fashion houses have redefined denim through structural drape, floor-grazing puddle hems, and a return to purist dark-rinse raw indigo.",
    sections: [
      {
        heading: "1. The Barrel and Horseshoe Surge",
        body: "Leading global fashion weeks showed a shared fascination with contoured leg geometry. The barrel leg (sometimes called the horseshoe silhouette) curves dramatically outwards at the outer seam before gently tapering inwards right at the ankle. This creates sculptural drama while still allowing tailored footwear to anchor the hem."
      },
      {
        heading: "2. Dark-Rinse & Raw Minimalism",
        body: "While heavy distress had its moment, 2026 is defined by the clean luxury of unwashed or single-rinse deep indigo. High-end mills are delivering 13 to 14 oz rigid fabrics with zero synthetic resin, allowing the pure natural drape of high-twist cotton yarns to hold structural silhouettes without collapsing."
      },
      {
        heading: "3. Puddle Hems & 90s Nostalgia",
        body: "Streetwear brands are pushing lengths 2–3 inches longer than standard inseams, creating deliberate fabric stacking over chunky loafers, retro runners, and point-toe boots. The pooling hem nods to late 90s skate and grunge cultures, but rendered in immaculate Japanese selvedge."
      },
      {
        heading: "4. Mill & Production Guidance",
        body: "Brands adopting these fits should specify fabrics with minimal elastane. The structural volume relies on the natural stiffness of 100% cotton or high-cotton hemp blends. Light weights (<10 oz) will droop and lose the horseshoe curve, while 12.5–14.0 oz achieves the authentic architectural drape."
      }
    ],
    keyTakeaways: [
      "Barrel and curved horseshoe cuts represent the fastest growing premium retail category.",
      "Dark-rinse raw denim commands higher margins due to reduced wet-processing chemical steps.",
      "Target fabric weight should remain between 12.5 oz and 14 oz for proper structural rigidity.",
      "Pair with cropped knitwear or tailored blazers to balance the lower-body volume."
    ],
    specs: {
      idealWeight: "12.5 – 14.0 oz (Heavyweight Rigid)",
      twillType: "3x1 Right Hand Twill or Broken Twill",
      washMethod: "One-dip raw rinse or light resin rinse",
      targetFit: "Curved Barrel, Baggy Wide-Leg, Puddle Hem"
    }
  },

  "fash-2": {
    slug: "denim-garments-beyond-5-pocket",
    title: "Denim Garments: The Total-Look Revolution Beyond the 5-Pocket",
    subtitle: "Trucker jackets, chore overshirts, corsets, maxi skirts, and complete matching sets.",
    tag: "Garments",
    stat: "40+ garment categories",
    author: "Denim Universe Editorial",
    authorRole: "Product Innovation Desk",
    readTime: "4 min read",
    publishedAt: "Autumn/Winter 2026 Collection",
    image: "https://images.pexels.com/photos/4109797/pexels-photo-4109797.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    imageCaption: "The Canadian Tuxedo elevated: tonal matching sets in chore jacket and carpenter trouser forms.",
    leadSummary: "Denim is no longer confined to the bottom half of the body. The 'head-to-toe denim' movement has expanded into high-fashion tailoring, feminine corset structuring, and utilitarian outer layers.",
    sections: [
      {
        heading: "1. The Re-Invented Trucker & Chore Coat",
        body: "The classic Type III trucker jacket has evolved. In 2026, we see boxy, dropped-shoulder workwear chore coats, chore overshirts, and oversized blazers tailored in lightweight 8–10 oz twills with notch lapels and real horn buttons."
      },
      {
        heading: "2. The Column Maxi Skirt Phenomenon",
        body: "Floor-sweeping denim maxi skirts with deep front or back walking slits have become wardrobe staples. Cut straight or slightly A-line from upcycled jeans or vintage-wash yardage, they offer the versatility of trousers with high editorial flair."
      },
      {
        heading: "3. Structural Corsets & Fitted Waistcoats",
        body: "At the opposite end of the oversized spectrum are boned denim corsets and vests. Using stretch-comfort denim (1.5% Lycra) lined with soft cotton poplin, these garments mold to the torso, creating striking textural contrast when paired with baggy jeans."
      },
      {
        heading: "4. Weave & Hand-Feel Considerations",
        body: "Garments worn close to the skin require softer warp and weft spun yarns. Left-hand twill (LHT) is especially recommended for denim tops and shirts because the directional yarn twist softens significantly during initial washing, yielding a plush, buttery hand."
      }
    ],
    keyTakeaways: [
      "Total denim matching sets ('double denim') grew by 42% in designer retail collections.",
      "Tops and corsetry perform best with 7.5–9.5 oz soft-touch left-hand twills or tencel blends.",
      "Maxi skirts require reinforced bar-tacking at the top of walking slits to prevent seam rupture.",
      "Layering contrasting indigo shades creates depth and breaks up monochrome monotony."
    ],
    specs: {
      idealWeight: "7.5 – 10.5 oz (Shirting & Lightweight Twill)",
      twillType: "2x1 or 3x1 Left Hand Twill (Softer Hand-Feel)",
      washMethod: "Enzyme stone-free wash + silicone softening",
      targetFit: "Tailored Chore Jacket, Maxi Column Skirt, Corset"
    }
  },

  "fash-3": {
    slug: "new-washes-and-eco-chemistry",
    title: "New Washes: The High-Tech Science of Waterless Fading",
    subtitle: "Ice-wash, dirty-wash, fog-grey and vintage sun-fade achieved with minimal water chemistry.",
    tag: "Washes",
    stat: "0 pumice · laser-first",
    author: "Denim Universe Editorial",
    authorRole: "Wet Processing & Sustainability",
    readTime: "6 min read",
    publishedAt: "Autumn/Winter 2026 Collection",
    image: "https://images.pexels.com/photos/7444977/pexels-photo-7444977.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    imageCaption: "Cloud and fog-grey fades engineered using dry laser sublimation and closed-loop ozone gas.",
    leadSummary: "The days of mining tons of volcanic pumice stone and dumping toxic potassium permanganate runoff are drawing to a close. A revolution in dry laser marking, ozone gas fading, and nanobubble nebulization has made striking wash effects possible with almost zero water.",
    sections: [
      {
        heading: "1. The 90s Ice-Wash Re-Engineered",
        body: "Classic 80s and 90s acid/ice washes originally required chlorine-soaked pumice stones that destroyed fabric tensile strength. Today's eco-ice wash is achieved through ozone gas tumbling and targeted laser bleaching, producing bright chalky highlights without fiber damage."
      },
      {
        heading: "2. The 'Dirty Tint' and Earthcast Revival",
        body: "Post-dye spray over-tinting in earth tones—mustard yellow, clay brown, and olive green—gives washed indigo a sun-baked, desert-patina effect. Mills achieve this using mineral earth pigments and bio-based dye extracts fixed with steam rather than caustic chemical baths."
      },
      {
        heading: "3. Fog Grey & Shadow Black",
        body: "Sulfur-dyed black denims are treated with selective micro-ozone bleaching to strip outer sulfur dye layers while retaining core black intensity, creating a soft smoky 'fog-grey' aesthetic favored in Scandinavian and Japanese minimalism."
      },
      {
        heading: "4. Environmental & Cost Impact",
        body: "By replacing 4 bath rinses with a single nanobubble steam application, garment laundries reduce per-garment water consumption from 70 liters down to under 15 liters, all while lowering drying cycle energy by 35%."
      }
    ],
    keyTakeaways: [
      "Modern ice and acid washes use ozone gas rather than potassium permanganate or chlorine.",
      "Dirty-tint finishes utilize non-toxic mineral oxides and vegetable tannins.",
      "Water consumption per pair is slashed from 70L to under 15L with EIM scores < 20.",
      "Zero pumice stone dust preserves machine longevity and worker respiratory safety."
    ],
    specs: {
      idealWeight: "11.0 – 13.5 oz",
      twillType: "3x1 Right Hand Twill with Ring Indigo Warp",
      washMethod: "Laser marking + Ozone gas bleaching + Nanobubble rinse",
      targetFit: "Vintage Straight, Relaxed Carpenter, Oversized Trucker"
    }
  },

  "fash-4": {
    slug: "finishing-effects-and-laser-craft",
    title: "Finishing Effects: Engineered Character & Hand-Crafted Artistry",
    subtitle: "Whiskers, honeycombs, 3D crinkles, grinding and darning — engineered character, not accidents.",
    tag: "Finishing",
    stat: "Laser precision ±0.5mm",
    author: "Denim Universe Editorial",
    authorRole: "Technical Denim Laundry",
    readTime: "5 min read",
    publishedAt: "Autumn/Winter 2026 Collection",
    image: "https://images.pexels.com/photos/4109758/pexels-photo-4109758.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    imageCaption: "Sub-millimeter laser whiskers aligned organically with anatomical body crease lines.",
    leadSummary: "Authentic wear patterns on raw jeans take years of daily physical friction to emerge. Modern finishing technology bridges this gap, engineering decades of heritage character in minutes with pinpoint digital laser vectors.",
    sections: [
      {
        heading: "1. Anatomical Whisker Mapping",
        body: "Whiskers (the horizontal fade lines across the front lap) are now laser-designed based on 3D motion-capture body models. Instead of symmetrical straight stripes, contemporary vector templates simulate natural sitting and walking creases for uncanny authenticity."
      },
      {
        heading: "2. Honeycombs & Knee Stacks",
        body: "The diamond and geometric fade marks behind the knees (honeycombs) occur when stiff fabric accordion-folds during movement. Lasers etch graduated micro-burns along these fold ridges, leaving deep indigo valleys in between."
      },
      {
        heading: "3. 3D Resin Crinkles & Permanent Creases",
        body: "To create three-dimensional crease memory that survives repeated home washing, garments are clamped in custom accordion molds, treated with eco-certified cross-linking resins, and oven-cured at 150°C for 20 minutes."
      },
      {
        heading: "4. Micro-Grinding & Sashiko Darning",
        body: "Pocket scoops, hems, and waistband edges are selectively distressed with rotary micro-abrasion tools to simulate fraying, followed by Japanese-inspired Sashiko chain-stitch darning for a premium artisanal, repaired aesthetic."
      }
    ],
    keyTakeaways: [
      "Digital laser vector files reproduce natural anatomical creases with ±0.5mm accuracy.",
      "3D resin memory baking ensures fold depth endures beyond 50 household wash cycles.",
      "Sashiko darning and micro-grinding elevate basic denim into collectible luxury art.",
      "Eliminates harmful manual sandblasting completely, safeguarding artisan health."
    ],
    specs: {
      idealWeight: "12.0 – 14.5 oz",
      twillType: "3x1 Right Hand Twill with High Ring-Spun Texture",
      washMethod: "Vector Laser + Eco 3D Resin Mold + Hem Micro-Grinding",
      targetFit: "Authentic Vintage 5-Pocket, Heritage Workwear"
    }
  },

  "fash-5": {
    slug: "denim-styles-and-rise-mechanics",
    title: "Denim Styles & Silhouettes: Decoding Rises, Twills, and Modern Fits",
    subtitle: "From rigid selvedge to coated black — low-rise returns, high-rise stays, utility rules.",
    tag: "Styles",
    stat: "Selvedge revival +214%",
    author: "Denim Universe Editorial",
    authorRole: "Fashion Trend Analyst",
    readTime: "4 min read",
    publishedAt: "Autumn/Winter 2026 Collection",
    image: "https://images.pexels.com/photos/24287028/pexels-photo-24287028.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    imageCaption: "A juxtaposition of clean raw selvedge turn-ups and utilitarian cargo detailing.",
    leadSummary: "The denim market has matured into a multi-silhouette landscape. Instead of one single 'it-fit' commanding the market, consumer wardrobes now balance three distinct pillars: heritage raw selvedge, utility workwear, and sleek coated minimalism.",
    sections: [
      {
        heading: "1. The Return of the Low-Slung Rise",
        body: "While high-rise mom jeans remain an evergreen staple for comfort and waist cinching, Y2K-inspired low-slung rises (8.5 to 9.5 inch front rise) have gained massive traction with younger demographics, particularly when cut with an easy relaxed leg."
      },
      {
        heading: "2. Carpenter & Workwear Utility",
        body: "Hammer loops, double-knee reinforcement patches, and slanted utility pockets have crossed over from construction job sites to high-end boutique runways. Built in sturdy 11–13 oz broken twill, these functional details provide rugged visual substance."
      },
      {
        heading: "3. Coated & Waxed Denim",
        body: "For evening and streetwear crossovers, black and deep indigo denims coated in matte polyurethane or natural wax blends deliver a sleek, leather-like sheen with the breathability and comfort of cotton twill."
      },
      {
        heading: "4. The Selvedge Turn-Up Statement",
        body: "Selvedge denim—woven on narrow shuttle looms with a clean, unfrayed self-edge—has seen a 214% revival. Wearers proudly cuff their hems 2 to 3 inches to display the red or green ID ticker tape along the outseam."
      }
    ],
    keyTakeaways: [
      "Consumers maintain multiple rises simultaneously: high for tailored work, low for casual street.",
      "Carpenter utility details (double knees, side pockets) offer high visual shelf appeal.",
      "Selvedge production commands a $20–$50 price premium per garment at retail.",
      "Coated denims provide an ethical, breathable vegan alternative to leather trousers."
    ],
    specs: {
      idealWeight: "13.0 – 15.0 oz (Selvedge) or 10.5 – 12.0 oz (Utility)",
      twillType: "Broken Twill or Shuttle Loom Narrow Selvedge",
      washMethod: "Raw Unwashed or Single Cold Water Dip",
      targetFit: "Carpenter Utility, Relaxed Straight, Cuffed Selvedge"
    }
  },

  "fash-6": {
    slug: "vintage-denim-heritage-collector-culture",
    title: "Vintage Denim: Heritage Selvedge, Redline Archeology & Collector Culture",
    subtitle: "Deadstock Levi's, hidden rivets and chain-stitched hems — history you can wear.",
    tag: "Vintage",
    stat: "Vintage market $2.1B",
    author: "Denim Universe Editorial",
    authorRole: "Heritage Denim Historian",
    readTime: "6 min read",
    publishedAt: "Autumn/Winter 2026 Collection",
    image: "https://images.pexels.com/photos/10133274/pexels-photo-10133274.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    imageCaption: "Historic shuttle-loom selvedge: genuine copper rivets, chain-stitched rope hem, and natural fade.",
    leadSummary: "Vintage denim is one of the few fashion categories that appreciates in value with age and wear. Enthusiasts, archivists, and collectors trade original mid-century workwear pieces like fine art, driving a $2.1 billion global vintage resale market.",
    sections: [
      {
        heading: "1. The Anatomy of a Grail Piece",
        body: "What makes a vintage pair valuable? True collectors inspect the hidden details: concealed copper rivets on back pockets (phased out in 1966), capital 'E' on the red tab (pre-1971), single-stitched back pocket hems, and selvedge outseams woven on historic Draper looms at Cone Mills White Oak."
      },
      {
        heading: "2. The Magic of Shrink-to-Fit (STF)",
        body: "Before modern sanforization (mechanical pre-shrinking), raw denim shrank 8–10% on first soak. Wearers would sit in a warm bathtub wearing their jeans, allowing the cotton fibers to shrink directly to their exact body shape, creating a custom personalized second skin."
      },
      {
        heading: "3. The Union Special 43200G Chainstitch",
        body: "Authentic vintage hems cannot be replicated on a standard modern sewing machine. The legendary Union Special 43200G chainstitch machine pulls the fabric slightly off-grain as it sews, causing the hem to puck into a wave pattern known as 'roping' during subsequent washes."
      },
      {
        heading: "4. Preserving & Restoring Heritage Pieces",
        body: "Collectors avoid detergents with optical brighteners, washing only when necessary in cold water with pH-neutral soap. Professional denim restorers use antique darning machines to reconstruct blown-out crotches and knees while preserving original warp yarns."
      }
    ],
    keyTakeaways: [
      "Concealed rivets, Big 'E' red tabs, and selvedge tickers define high-value collectible pieces.",
      "The vintage denim resale and deadstock market is projected to reach $2.1 billion worldwide.",
      "Union Special 43200G chain-stitching produces the coveted authentic hem 'roping' effect.",
      "Vintage wear patterns serve as primary reference archives for modern laser washing designers."
    ],
    specs: {
      idealWeight: "13.75 – 14.5 oz (Unsanforized Loom-State)",
      twillType: "3x1 Right Hand Twill on Narrow Shuttle Looms",
      washMethod: "Loom-State Raw (Tub Soak) or Decades of Natural Wear",
      targetFit: "1947–1955 Straight Leg 5-Pocket"
    }
  },

  "fash-7": {
    slug: "stretch-denim-engineering-recovery",
    title: "Stretch Denim Engineering: High-Recovery Weaves Without the Sag",
    subtitle: "Comfort-stretch 1–2% elastane and power-stretch for jeggings — recovery is everything.",
    tag: "Stretch",
    stat: "Recovery > 92% target",
    author: "Denim Universe Editorial",
    authorRole: "Textile Science & Fiber Lab",
    readTime: "4 min read",
    publishedAt: "Autumn/Winter 2026 Collection",
    image: "https://images.pexels.com/photos/34470862/pexels-photo-34470862.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    imageCaption: "Dual-core spinning: micro-elastane core wrapped in natural combed cotton fibers.",
    leadSummary: "Early stretch jeans had a fatal flaw: after 3 hours of sitting, the knees and seat would sag and bag out permanently until the next wash. Advanced fiber engineering has resolved this, delivering 360-degree freedom of movement with remarkable 92%+ elastic recovery.",
    sections: [
      {
        heading: "1. The Mechanics of Dual-Core Yarn",
        body: "Modern premium stretch denim uses a patented 'dual-core' yarn structure. The core contains two filaments: elastane (Lycra) for initial stretch elasticity, and polyester (T400 or elasterell-p) for rapid spring-back recovery. This synthetic core is completely spun-wrapped in 100% natural cotton fibers."
      },
      {
        heading: "2. Comfort-Stretch vs Power-Stretch",
        body: "Comfort-stretch (10–20% elasticity, 1–1.5% elastane) is preferred for men's denim and straight-leg cuts, offering freedom of movement while retaining the authentic dry, slubby appearance of traditional raw denim. Power-stretch (35–60% elasticity) is reserved for body-con skinny fits and leggings."
      },
      {
        heading: "3. The 30-Minute Growth Test",
        body: "Quality control labs measure recovery using standardized tensile testing (ASTM D3107). Fabric is stretched to a specified load for 30 minutes, then allowed to relax. Premium mills mandate less than 3% residual growth (over 92% elastic recovery)."
      },
      {
        heading: "4. Laundry & Heat Sensitivity",
        body: "Because elastane and T400 polymers degrade when exposed to extreme temperatures, garment laundries must calibrate drying tumblers below 70°C. Home consumers should wash in cold water and air-dry to preserve stretch longevity for years."
      }
    ],
    keyTakeaways: [
      "Dual-core spinning combines elastane (stretch) with T400 polyester (spring recovery).",
      "Comfort-stretch (1–1.5% Lycra) delivers freedom of movement with 100% rigid visual look.",
      "High recovery (>92%) prevents knee bagging and waistband slippage throughout the day.",
      "Air drying stretch jeans extends the functional life of synthetic elastomeric cores by 300%."
    ],
    specs: {
      idealWeight: "9.5 – 11.5 oz",
      twillType: "3x1 Right Hand Twill with Dual-Core Weft",
      washMethod: "Low-Temperature Enzyme Wash + Mild Softener (<70°C)",
      targetFit: "Slim Straight, Athletic Taper, Everyday Comfort Jean"
    }
  },

  "fash-8": {
    slug: "sustainable-fashion-circular-denim",
    title: "Sustainable Fashion & Circular Denim: Designing for Infinite Lifecycles",
    subtitle: "Capsule wardrobes, repair culture and resale — buy once, wear 10 years, re-sell.",
    tag: "Eco Style",
    stat: "-70% CO₂ with resale",
    author: "Denim Universe Editorial",
    authorRole: "Circular Economy Lead",
    readTime: "5 min read",
    publishedAt: "Autumn/Winter 2026 Collection",
    image: "https://images.pexels.com/photos/4546763/pexels-photo-4546763.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    imageCaption: "Circular economy: 100% mono-material cotton construction with screw-off detachable hardware.",
    leadSummary: "The most sustainable pair of jeans is the pair already in your closet. Leading denim innovators are rethinking the entire lifecycle of a garment—from regenerative farming and mono-material tailoring to free lifetime repair workshops and closed-loop recycling.",
    sections: [
      {
        heading: "1. Mono-Material Construction for Recycling",
        body: "Conventional jeans cannot be easily recycled mechanically because they combine cotton fabric, polyester sewing thread, elastane stretch cores, and riveted metal hardware. Circular denim utilizes 100% organic cotton fabric, 100% cotton sewing thread, and screw-off detachable hardware so the entire garment can be shredded into fresh yarn at end-of-life."
      },
      {
        heading: "2. Regenerative Cotton Agriculture",
        body: "Brands are transitioning beyond standard organic cotton into regenerative agriculture. By planting cover crops, practicing no-till farming, and integrating biodiversity, regenerative denim farms sequester more carbon into the soil than they emit during cultivation."
      },
      {
        heading: "3. The Rise of Brand-Run Repair Workshops",
        body: "Pioneering brands now offer free lifetime repairs at their flagship stores. Boro stitching, sashiko patches, and chain-stitch re-hemming transform damaged jeans into unique personalized collector garments, keeping hundreds of tons of textiles out of landfills."
      },
      {
        heading: "4. Resale Platforms & Digital Product Passports (DPP)",
        body: "Beginning in 2026, progressive denim brands are embedding QR-code Digital Product Passports in pocket bags. Scanning the tag displays the farm of origin, carbon footprint, wash recipe, and authenticates the garment for instant verified resale on secondhand platforms."
      }
    ],
    keyTakeaways: [
      "Mono-material design (cotton fabric, thread, pocketing) makes mechanical recycling possible.",
      "Regenerative agriculture actively pulls carbon from the atmosphere into farmland soil.",
      "Reselling or repairing a pair of jeans reduces its total carbon and water footprint by 70%.",
      "Digital Product Passports (DPP) provide transparency from seed to retail and resale."
    ],
    specs: {
      idealWeight: "12.0 – 13.5 oz",
      twillType: "3x1 Right Hand Twill with 100% Regenerative Organic Cotton",
      washMethod: "Laser + Ozone + Non-toxic Plant Starch Sizing",
      targetFit: "Timeless Straight Leg, Circular Chore Jacket"
    }
  }
};

/**
 * Helper to get a rich story by fashion item ID or slug or fallback
 */
export function getFashionStory(itemOrId: { id?: string; title?: string; desc?: string; tag?: string; image?: string; stat?: string } | string): FashionStoryDetail {
  const id = typeof itemOrId === "string" ? itemOrId : itemOrId.id || "";
  
  // 1. Direct ID match (e.g. "fash-1")
  if (id && FASHION_STORIES[id]) {
    return FASHION_STORIES[id];
  }

  // 2. Slug / title match
  if (typeof itemOrId !== "string" && itemOrId.title) {
    const titleLower = itemOrId.title.toLowerCase();
    for (const key of Object.keys(FASHION_STORIES)) {
      const story = FASHION_STORIES[key];
      if (story.title.toLowerCase().includes(titleLower) || titleLower.includes(story.tag.toLowerCase())) {
        return {
          ...story,
          title: itemOrId.title,
          subtitle: itemOrId.desc || story.subtitle,
          image: itemOrId.image || story.image,
          tag: itemOrId.tag || story.tag,
          stat: itemOrId.stat || story.stat,
        };
      }
    }
  }

  // 3. Fallback dynamically generated editorial story
  const title = typeof itemOrId === "string" ? "Denim Universe Editorial" : itemOrId.title || "Denim Universe Editorial";
  const desc = typeof itemOrId === "string" ? "Comprehensive guide to denim fashion and trends." : itemOrId.desc || "Comprehensive guide to denim fashion and trends.";
  const tag = typeof itemOrId === "string" ? "Trends" : itemOrId.tag || "Trends";
  const image = typeof itemOrId === "string" ? "https://images.pexels.com/photos/19224972/pexels-photo-19224972.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940" : itemOrId.image || "https://images.pexels.com/photos/19224972/pexels-photo-19224972.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940";
  const stat = typeof itemOrId === "string" ? "Denim Universe Exclusive" : itemOrId.stat || "Denim Universe Exclusive";

  return {
    slug: id || "denim-editorial",
    title,
    subtitle: desc,
    tag,
    stat,
    author: "Denim Universe Editorial",
    authorRole: "Fashion & Fabric Intelligence",
    readTime: "4 min read",
    publishedAt: "Denim Universe Collection",
    image,
    imageCaption: `${title} — Editorial study by Denim Universe.`,
    leadSummary: desc,
    sections: [
      {
        heading: "1. Silhouette & Fashion Direction",
        body: `${title} represents an influential direction in global denim styling. From runway presentations to city street style, this movement combines traditional twill craftsmanship with contemporary tailoring concepts.`
      },
      {
        heading: "2. Fabric Construction & Character",
        body: `Achieving the proper drape for ${title} requires careful yarn selection, balanced warp-to-weft density, and disciplined loom tension. Ringspun indigo yarns allow natural surface character to develop with every wear.`
      },
      {
        heading: "3. Washing & Finishing Technology",
        body: `Modern finishing allows these visual attributes to be realized with sustainable chemistry, laser etching, and ozone air fading, minimizing environmental impact while ensuring high color fastness and structural longevity.`
      },
      {
        heading: "4. Practical Styling & Wearability",
        body: `Versatility is at the heart of this look. Pair with contrasting textures like brushed knitwear, crisp poplin shirts, or minimalist leather accessories for a refined, modern aesthetic.`
      }
    ],
    keyTakeaways: [
      `${title} bridges heritage fabric craftsmanship with contemporary fit aesthetics.`,
      "High ring-spun yarn quality ensures authentic drape and fading character.",
      "Sustainable wet processing achieves vintage tones with minimal environmental footprint.",
      "Effortlessly styled across casual everyday wear and elevated streetwear."
    ],
    specs: {
      idealWeight: "11.5 – 13.5 oz",
      twillType: "3x1 Right Hand Twill",
      washMethod: "Eco-Enzyme Wash + Ozone Fading",
      targetFit: "Contemporary Relaxed / Tailored Fit"
    }
  };
}
