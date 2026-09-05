import type { SiteConfig } from "@/lib/site-config";

export const business = {
  companyName: "Oakline Tree Services",
  tagline: "Premium tree care rooted in safety, precision, and clean finishes.",
  description:
    "Professional tree removal, structural pruning, storm cleanup, and stump grinding for homeowners who want careful work, clear communication, and a property left spotless.",
  city: "Houston",
  stateAbbr: "TX",
  phone: "(555) 238-0197",
  email: "quotes@oaklinetrees.com",
  logoText: "Oakline Tree Services",
  logoImage: "/images/oakline-logo.webp",
  primaryColor: "green",
  ctaColor: "orange",
  heroImage: "/images/oakline-hero.webp",
  heroBadgeText: "4.9/5 from 104 Google reviews",
  aboutImage: "/images/oakline-about-crew.webp",
  founded: "2009",
  aboutTrustPoints: [
    "Fully Insured",
    "Local Crew",
    "Cleanup Included",
    "Free Estimates"
  ],
  story: [
    "Oakline started in 2009 with one truck, one chipper, and a simple frustration: too many homeowners told us the last tree company never called back, showed up late, or left the yard buried in brush.",
    "Seventeen years later we run three full crews across Houston, but the standard hasn't moved: answer the phone, quote honestly, do careful work, and leave the property cleaner than we found it.",
    "Most of our work still comes from referrals and repeat customers. We like it that way."
  ],
  credentials: [
    { title: "ISA Certified Arborist on staff", text: "Pruning and removal decisions reviewed by a certified arborist, not guesswork." },
    { title: "$2M liability + workers' comp", text: "Proof of insurance sent with every estimate, before any work is booked." },
    { title: "TCIA member company", text: "We follow industry safety standards for rigging, felling, and aerial work." },
    { title: "Drug-tested, uniformed crews", text: "The same trained crew that quotes your job shows up to do it." }
  ],
  reviewSummary: {
    rating: "4.9",
    count: "280+",
    source: "Google Reviews"
  },
  stats: [
    { value: "24/7", label: "Emergency response" },
    { value: "4.9", label: "Average rating" },
    { value: "15+", label: "Years experience" }
  ],
  trustBadges: [
    { label: "Licensed", icon: "license" },
    { label: "Insured", icon: "shield" },
    { label: "Locally Owned", icon: "home" },
    { label: "Emergency Service", icon: "bolt" }
  ],
  serviceCards: [
    {
      title: "Tree Removal",
      price: "Free estimate",
      description: "Safe, complete removal for dead, leaning, hazardous, or unwanted trees.",
      image: "/images/services/tree-removal.webp",
      signs: [
        "No leaves in season, or large dead limbs dropping",
        "A lean that appeared or worsened after a storm",
        "Mushrooms or soft, decayed wood at the base",
        "Roots lifting the driveway, patio, or foundation line"
      ],
      included: [
        "Tree sections lowered safely",
        "Branches and limbs removed",
        "Debris hauled from the property",
        "Free on-site estimate"
      ]
    },
    {
      title: "Tree Trimming & Pruning",
      price: "From $250",
      description: "Careful pruning to keep your trees safer, healthier, and looking their best.",
      image: "/images/services/tree-trimming-pruning.webp",
      signs: [
        "Branches touching the roof, gutters, or power service line",
        "Deadwood visible in the canopy",
        "Dense growth that shades out the lawn completely",
        "No structural pruning in the last 3–5 years"
      ],
      included: [
        "Dead or crossing branch removal",
        "Canopy shaping and thinning",
        "Clearance around roof and driveway",
        "All clippings cleaned up"
      ]
    },
    {
      title: "Stump Grinding",
      price: "From $150",
      description: "Stumps ground below grade so the yard is usable again without the eyesore.",
      image: "/images/services/stump-grinding.webp",
      signs: [
        "Mowing around a stump every single week",
        "Sucker shoots regrowing from the old trunk",
        "Ants or termites moving into the dead wood",
        "Planning new sod, beds, or a fence line"
      ],
      included: [
        "Grinding below ground level",
        "Surface area leveled",
        "Wood chips managed on request",
        "Care around nearby lawn and beds"
      ]
    },
    {
      title: "Emergency Tree Service",
      price: "Free estimate",
      description: "Fast help for storm damage, fallen trees, and dangerous hanging limbs.",
      image: "/images/services/emergency-tree-service.webp",
      signs: [
        "A tree or limb resting on the house, garage, or fence",
        "A cracked limb hanging over where people walk or park",
        "A blocked driveway or street access",
        "A new lean toward the house after wind or saturated soil"
      ],
      included: [
        "Urgent hazard review",
        "Fallen limbs cleared",
        "Driveway and access cleanup",
        "Safe removal plan"
      ]
    },
    {
      title: "Hedge & Shrub Trimming",
      price: "From $95",
      description: "Clean shaping for overgrown hedges and shrubs with debris cleanup included.",
      image: "/images/services/hedge-shrub-trimming.webp",
      signs: [
        "Hedges blocking windows or walkways",
        "Bare, woody centers from years without shaping",
        "Uneven height across a hedge line",
        "HOA notice about overgrowth"
      ],
      included: [
        "Clean shaping and trimming",
        "Height and edge control",
        "Walkways and windows cleared",
        "Trimmings removed"
      ]
    },
    {
      title: "Land & Lot Clearing",
      price: "Free estimate",
      description: "Brush, small trees, and overgrowth cleared for property cleanup or new work.",
      image: "/images/services/land-lot-clearing.webp",
      signs: [
        "An overgrown lot you're preparing to sell or build on",
        "Brush crowding a fence line or drainage easement",
        "Volunteer trees taking over a side yard",
        "City or HOA cleanup notice"
      ],
      included: [
        "Brush and vegetation cleared",
        "Small trees removed",
        "Debris staged or hauled",
        "Site left ready for next steps"
      ]
    }
  ],
  services: [
    {
      title: "Tree Removal",
      description: "Safe removals for hazardous, dead, leaning, or overgrown trees near homes and utilities."
    },
    {
      title: "Tree Trimming",
      description: "Structure-focused pruning that improves clearance, health, curb appeal, and storm resilience."
    },
    {
      title: "Emergency Storm Cleanup",
      description: "Rapid response for fallen limbs, blocked driveways, damaged canopies, and urgent hazards."
    },
    {
      title: "Stump Grinding",
      description: "Clean stump removal and site leveling so the yard is ready for sod, mulch, or new planting."
    }
  ],
  priceGuide: [
    {
      service: "Tree Removal",
      note: "Height sets the base price. What pushes a job toward the top of the range is what's underneath: a tree over the house, a fence, or power lines takes rigging and time that an open-yard drop doesn't. Haul-away is included either way.",
      rows: [
        { size: "Small tree (under 30 ft)", range: "$400 – $800" },
        { size: "Medium tree (30–60 ft)", range: "$800 – $1,800" },
        { size: "Large tree (60 ft and up)", range: "$1,800 – $4,500+" }
      ]
    },
    {
      service: "Tree Trimming & Pruning",
      note: "Priced by how much canopy we touch. Clearing one limb off the roof sits at the low end. A full structural prune of a mature oak, with deadwood out and the canopy raised and thinned, is the high end. A tree that hasn't been pruned in 5+ years usually needs the fuller job once, then cheap upkeep after.",
      rows: [
        { size: "Small tree or single-limb work", range: "$250 – $450" },
        { size: "Medium canopy, full prune", range: "$450 – $900" },
        { size: "Large canopy or multiple trees", range: "$900 – $1,800" }
      ]
    },
    {
      service: "Stump Grinding",
      note: "Measured across the widest point at ground level, surface roots included. We grind 6 to 8 inches below grade, deeper if you're replanting. Second and third stumps on the same visit cost less because the machine is already there.",
      rows: [
        { size: "Under 15 in. diameter", range: "$150 – $250" },
        { size: "15–30 in. diameter", range: "$250 – $400" },
        { size: "Over 30 in. or multiple stumps", range: "$400+ (multi-stump discount)" }
      ]
    },
    {
      service: "Hedge & Shrub Trimming",
      note: "Priced by hedge length and height. A yearly-maintained hedge trims fast. One that's gone woody and needs a hard reset takes longer the first visit, then drops to the low end on repeat visits. Debris removal is always included.",
      rows: [
        { size: "Up to 25 ft of hedge line", range: "$95 – $180" },
        { size: "25–75 ft of hedge line", range: "$180 – $320" },
        { size: "Full-property shrub program", range: "$320 – $600" }
      ]
    },
    {
      service: "Land & Lot Clearing",
      note: "Depends on how thick the growth is and whether debris gets chipped on site or hauled out. Light brush runs cheaper per foot than a lot with volunteer trees that need cutting. We quote by the project after walking it, not by the hour.",
      rows: [
        { size: "Side yard or fence line", range: "$500 – $1,200" },
        { size: "Quarter-acre lot", range: "$1,200 – $2,800" },
        { size: "Half acre and up", range: "Quoted after walk-through" }
      ]
    },
    {
      service: "Emergency Tree Service",
      note: "Emergency work costs more than planned work because we drop other jobs and bring extra equipment. If a tree hit a structure, your homeowner's insurance likely covers it. We photograph everything and write invoices adjusters accept.",
      rows: [
        { size: "Hanging limb secured or removed", range: "$300 – $700" },
        { size: "Tree off structure, no crane", range: "$800 – $2,500" },
        { size: "Crane-assisted removal", range: "$2,500 – $6,000+" }
      ]
    }
  ],
  savingsTips: [
    {
      title: "Bundle trees together",
      text: "The crew and equipment are already in your yard, so tree number two and three cost less than the first. Neighbors splitting a visit works the same way."
    },
    {
      title: "Keep the wood",
      text: "If you want firewood or free mulch chips, tell us. Skipping the haul-away knocks a real chunk off the price."
    },
    {
      title: "Be flexible on timing",
      text: "If the job isn't urgent, let us slot it into a light week. Winter is usually the cheapest season for big removals."
    },
    {
      title: "Don't wait on a sick tree",
      text: "A standing dead tree gets more dangerous and more expensive every month. Removing it early is the cheaper version of the same job."
    }
  ],
  pricingFaqs: [
    {
      question: "Do you charge for estimates?",
      answer: "No. Every estimate is free, written, and good for 30 days."
    },
    {
      question: "Do you require a deposit?",
      answer: "Not on standard residential jobs. You pay when the work is done and you've walked the yard with the crew lead."
    },
    {
      question: "Does insurance cover storm damage?",
      answer: "Often, yes. If a tree hits a structure, most homeowner policies cover removal. We document the damage, photograph everything, and give you an itemized invoice your adjuster can work with."
    },
    {
      question: "Will you match a lower bid?",
      answer: "Ask us. If another insured company quotes the same scope for less, we'll usually meet it or tell you honestly why their number worries us."
    }
  ],
  exampleJobs: [
    {
      title: "Storm-split water oak over the driveway",
      location: "Memorial",
      image: "/images/jobs/storm-oak-crane.webp",
      price: "$2,150",
      detail: "Crane-assisted removal of a 65-ft oak split in a June storm, resting over the driveway. Removed, chipped, and hauled in one day."
    },
    {
      title: "Canopy raise on twin live oaks",
      location: "The Heights",
      image: "/images/jobs/live-oak-pruning.webp",
      price: "$780",
      detail: "Two mature live oaks pruned for roof and sidewalk clearance on a narrow historic lot. No lawn damage, all clippings hauled."
    },
    {
      title: "Backyard pine removal plus stump",
      location: "Katy",
      image: "/images/jobs/pine-removal-katy.webp",
      price: "$1,320",
      detail: "50-ft pine between fence lines, dropped in sections, stump ground 8 inches below grade and backfilled with chips."
    },
    {
      title: "90-ft hedge line reset",
      location: "Sugar Land",
      image: "/images/jobs/hedge-reset-sugarland.webp",
      price: "$340",
      detail: "Overgrown ligustrum hedge brought back to 6 ft with clean faces and edges ahead of an HOA review. Debris removed same day."
    }
  ],
  projects: [
    {
      title: "Backyard oak clearance",
      location: "The Heights",
      image: "/images/services/tree-trimming-pruning.webp",
      beforeImage: "/images/projects/oak-clearance-before.webp",
      afterImage: "/images/projects/oak-clearance-after.webp",
      before: "Low limbs over the roofline and patio",
      after: "Balanced canopy with safer roof clearance"
    },
    {
      title: "Storm-damaged maple removal",
      location: "Sugar Land",
      image: "/images/services/tree-removal.webp",
      beforeImage: "/images/projects/maple-removal-before.webp",
      afterImage: "/images/projects/maple-removal-after.webp",
      before: "Split trunk leaning toward the driveway",
      after: "Controlled removal, chipped brush, clean lawn"
    },
    {
      title: "Triple stump grind after pine loss",
      location: "Kingwood",
      image: "/images/services/stump-grinding.webp",
      beforeImage: "/images/projects/stump-grind-before.webp",
      afterImage: "/images/projects/stump-grind-after.webp",
      before: "Three beetle-killed pine stumps across the front yard",
      after: "Ground below grade, leveled, and ready for sod"
    },
    {
      title: "Overgrown side lot cleared for sale",
      location: "Bellaire",
      image: "/images/services/land-lot-clearing.webp",
      beforeImage: "/images/projects/lot-clearing-before.webp",
      afterImage: "/images/projects/lot-clearing-after.webp",
      before: "A decade of brush and volunteer trees hiding the fence",
      after: "Open, mowable lot that photographed well for listing"
    }
  ],
  reviews: [
    {
      name: "Melissa R.",
      area: "The Heights",
      service: "Tree Trimming",
      date: "July 2026",
      text: "The crew protected our lawn, explained every step, and left the property cleaner than they found it.",
      rating: 5
    },
    {
      name: "Derek S.",
      area: "Memorial",
      service: "Tree Removal",
      date: "June 2026",
      text: "Fast estimate, careful removal beside the garage, and no pressure. Easily the most professional tree company we called.",
      rating: 5
    },
    {
      name: "Anika P.",
      area: "River Oaks",
      service: "Tree Trimming",
      date: "May 2026",
      text: "They trimmed two large trees without butchering the shape. The yard looks brighter and still natural.",
      rating: 5
    },
    {
      name: "Carlos M.",
      area: "Katy",
      service: "Emergency Tree Service",
      date: "June 2026",
      text: "Half our pine came down in the storm at 10 PM. They had the driveway clear by morning and the rest of the tree down safely two days later.",
      rating: 5
    },
    {
      name: "Janet W.",
      area: "Spring",
      service: "Stump Grinding",
      date: "April 2026",
      text: "Three stumps gone in under two hours, ground deeper than the last company quoted, and they raked the chips into my beds like I asked.",
      rating: 5
    },
    {
      name: "Tom H.",
      area: "Sugar Land",
      service: "Tree Removal",
      date: "March 2026",
      text: "Quote was $200 under the other bids and they still did more. Hauled the logs and blew off the whole driveway too. Would use again.",
      rating: 5
    },
    {
      name: "Priya K.",
      area: "Memorial",
      service: "Tree Trimming",
      date: "February 2026",
      text: "Scheduling took a few days longer than promised during storm season, but the work itself was excellent and the cleanup was spotless.",
      rating: 4
    },
    {
      name: "Greg B.",
      area: "The Heights",
      service: "Hedge & Shrub Trimming",
      date: "May 2026",
      text: "They reset a hedge my landscaper had given up on. Straight lines, even height, and they hauled every clipping.",
      rating: 5
    },
    {
      name: "Dana F.",
      area: "Katy",
      service: "Land & Lot Clearing",
      date: "January 2026",
      text: "Cleared the overgrown side lot before we listed the house. Our realtor said it added more value than anything else we did.",
      rating: 5
    }
  ],
  process: [
    {
      title: "Tell us what is going on",
      text: "Send the address, a few details, and photos if you have them. We will let you know the safest next step."
    },
    {
      title: "Get a clear estimate",
      text: "We review the tree, access, cleanup, and haul-away needs before giving you straightforward pricing."
    },
    {
      title: "Schedule the crew",
      text: "Pick a time that works. We show up prepared with the right equipment for the job."
    },
    {
      title: "We finish clean",
      text: "Branches, chips, and debris are handled before we leave, so the yard feels usable again."
    }
  ],
  serviceAreas: [
    "The Heights",
    "Memorial",
    "River Oaks",
    "Katy",
    "Sugar Land",
    "Spring",
    "Cypress",
    "The Woodlands",
    "Bellaire",
    "West University",
    "Pearland",
    "Kingwood"
  ],
  areaDetails: [
    {
      name: "The Heights",
      zips: ["77007", "77008", "77009"],
      note: "Historic bungalows with mature live oaks and pecans close to rooflines. Lots are narrow here, so we rope every section down instead of dropping anything.",
      popular: ["Tree Trimming & Pruning", "Tree Removal"]
    },
    {
      name: "Memorial",
      zips: ["77024", "77079"],
      note: "Tall pines on large wooded lots. Storm-leaning pines near the house are our most common call here, especially after June storms.",
      popular: ["Emergency Tree Service", "Tree Removal"]
    },
    {
      name: "River Oaks",
      zips: ["77019", "77027"],
      note: "Formal canopies and estate properties. Fine structural pruning, discreet crews, and full protection for lawns and beds.",
      popular: ["Tree Trimming & Pruning", "Hedge & Shrub Trimming"]
    },
    {
      name: "Katy",
      zips: ["77449", "77450", "77494"],
      note: "Newer subdivisions with young trees that benefit from early structure pruning. We also clear a lot of lots on the fast-growing western edge.",
      popular: ["Tree Trimming & Pruning", "Land & Lot Clearing"]
    },
    {
      name: "Sugar Land",
      zips: ["77478", "77479", "77498"],
      note: "HOA standards matter here. Hedge programs, stump grinding after builder-planted trees fail, and paperwork-ready proof of insurance.",
      popular: ["Hedge & Shrub Trimming", "Stump Grinding"]
    },
    {
      name: "Spring",
      zips: ["77373", "77379", "77388"],
      note: "Heavily wooded lots along the creeks. Oak wilt and pine beetle removals, plus brush clearing to open up usable yard space.",
      popular: ["Tree Removal", "Land & Lot Clearing"]
    },
    {
      name: "Cypress",
      zips: ["77429", "77433"],
      note: "Fast-growing master-planned communities. Builder trees are hitting their awkward teenage years. Pruning them now saves a removal bill later.",
      popular: ["Tree Trimming & Pruning", "Stump Grinding"]
    },
    {
      name: "The Woodlands",
      zips: ["77380", "77381", "77382"],
      note: "Strict community tree standards and dense pine canopy. We know the local guidelines and handle the paperwork when a removal needs approval.",
      popular: ["Tree Removal", "Emergency Tree Service"]
    },
    {
      name: "Bellaire",
      zips: ["77401"],
      note: "Teardown-rebuild lots where mature trees meet new construction. Root-zone protection and selective clearing without losing the canopy.",
      popular: ["Tree Removal", "Land & Lot Clearing"]
    },
    {
      name: "West University",
      zips: ["77005"],
      note: "Small lots, big oaks, and tight access. Climbing crews instead of bucket trucks, and every branch roped down. Nothing gets dropped.",
      popular: ["Tree Trimming & Pruning", "Tree Removal"]
    },
    {
      name: "Pearland",
      zips: ["77581", "77584"],
      note: "Storm drainage easements and fence-line overgrowth are the common calls, plus post-storm cleanup runs every summer.",
      popular: ["Emergency Tree Service", "Hedge & Shrub Trimming"]
    },
    {
      name: "Kingwood",
      zips: ["77339", "77345"],
      note: "They call it the Livable Forest, which in practice means big pines over every roof. Preventive removals of beetle-killed pines keep insurance claims away.",
      popular: ["Tree Removal", "Stump Grinding"]
    }
  ],
  responseNote:
    "Crews are based inside the Loop and in Katy. Typical estimate visit within 48 hours, same day for emergencies.",
  faqs: [
    {
      question: "Do you offer emergency tree removal?",
      answer: "Yes. Emergency requests are prioritized when a tree or limb is threatening a home, driveway, road, or utility line."
    },
    {
      question: "Will you haul away branches and logs?",
      answer: "Yes. Standard jobs include brush chipping and jobsite cleanup unless a customer asks to keep firewood or chips."
    },
    {
      question: "Can I send photos for a faster estimate?",
      answer: "Yes. The quote form includes an optional photo upload field so the team can understand access, size, and risk before visiting."
    },
    {
      question: "Are you insured, and can I see proof?",
      answer: "Yes. We carry $2M general liability plus workers' comp. A current certificate of insurance is sent with every written estimate."
    },
    {
      question: "Do I need to be home during the work?",
      answer: "Only for the walkthrough at the start. Most customers head to work and come home to a finished, cleaned-up yard."
    },
    {
      question: "Do I need a permit to remove a tree in Houston?",
      answer: "Usually not on private residential property, but protected trees and right-of-way trees are exceptions. We flag it during the estimate if your job needs one."
    },
    {
      question: "How long does a typical job take?",
      answer: "Most trims and stump jobs are done in a morning. Full removals typically take half a day to a full day depending on size and access."
    },
    {
      question: "How can I pay?",
      answer: "Card, check, or bank transfer after the work is done and you've walked the yard. No deposits on standard residential jobs."
    }
  ]
} as const satisfies SiteConfig;

export type Business = typeof business;
