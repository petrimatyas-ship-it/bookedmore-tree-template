import type { DemoRecord } from "@/lib/db";

/**
 * A hand-written demo record, used to exercise the read path without running
 * the marketing site's generator. Deliberately conservative: no rating, no
 * reviews, no insurance or certification claims, no prices — exactly what a
 * form-only demo is allowed to say about a business we have not verified.
 *
 * Seed it in development with GET /api/demo/dev-seed.
 */
export function demoFixture(): DemoRecord {
  const now = new Date();
  const expires = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  return {
    slug: "cedar-ridge-tree-care-asheville",
    leadId: "fixture-lead",
    createdAt: now.toISOString(),
    expiresAt: expires.toISOString(),
    enrichment: null,
    framing: "no_site",
    config: {
      companyName: "Cedar Ridge Tree Care",
      tagline: "Tree removal, trimming and stump grinding in Asheville.",
      description:
        "Tree removal, tree trimming and stump grinding for homeowners in Asheville and the surrounding area. Free estimates, cleanup included.",
      city: "Asheville",
      stateAbbr: "NC",
      phone: "(828) 555-0142",
      email: "hello@morebookednow.com",
      logoText: "Cedar Ridge Tree Care",
      heroImage: "/images/oakline-hero.webp",
      aboutImage: "/images/oakline-about-crew.webp",

      heroHeadline: "Tree work in Asheville, done carefully and cleaned up.",
      heroSubline:
        "Right now someone searching for tree work in Asheville cannot find you. This is what they would find instead.",
      heroTrustItems: ["Free Estimates", "Cleanup Included", "Local Crew"],

      aboutTitle: "A local crew for safer, cleaner properties.",
      aboutParagraphs: [
        "Cedar Ridge Tree Care works across Asheville and the surrounding area, handling removals, trimming and stump grinding for homeowners who want the job done carefully.",
        "Every job starts with a free estimate and ends with the yard cleaned up. Branches chipped, debris hauled, driveway cleared before the crew leaves."
      ],
      aboutTrustPoints: ["Free Estimates", "Cleanup Included", "Local Crew"],
      aboutFactStrip: ["Local Crew", "Free Estimates", "Cleanup Included"],

      trustBadges: [
        { label: "Free Estimates", icon: "check" },
        { label: "Local Crew", icon: "home" },
        { label: "Cleanup Included", icon: "truck" },
        { label: "Serving Asheville", icon: "leaf" }
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
          title: "Tree Trimming",
          price: "Free estimate",
          description: "Careful pruning to keep your trees safer, healthier, and looking their best.",
          image: "/images/services/tree-trimming-pruning.webp",
          signs: [
            "Branches touching the roof, gutters, or power service line",
            "Deadwood visible in the canopy",
            "Dense growth that shades out the lawn completely",
            "No structural pruning in the last 3 to 5 years"
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
          price: "Free estimate",
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
        }
      ],

      services: [
        { title: "Tree Removal", description: "Safe removals for hazardous, dead, leaning, or overgrown trees." },
        { title: "Tree Trimming", description: "Pruning that improves clearance, health, and storm resilience." },
        { title: "Stump Grinding", description: "Clean stump removal and site leveling, ready for sod or mulch." }
      ],

      projects: [
        {
          title: "Canopy raise for roof clearance",
          image: "/images/services/tree-trimming-pruning.webp",
          beforeImage: "/images/projects/oak-clearance-before.webp",
          afterImage: "/images/projects/oak-clearance-after.webp",
          before: "Low limbs over the roofline and patio",
          after: "Balanced canopy with safer roof clearance"
        },
        {
          title: "Storm-damaged tree removal",
          image: "/images/services/tree-removal.webp",
          beforeImage: "/images/projects/maple-removal-before.webp",
          afterImage: "/images/projects/maple-removal-after.webp",
          before: "Split trunk leaning toward the driveway",
          after: "Controlled removal, chipped brush, clean lawn"
        }
      ],

      /* No pulled reviews: the section shows its placeholder instead. */
      reviews: [],
      reviewSummary: null,

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
        "Asheville",
        "Black Mountain",
        "Weaverville",
        "Arden",
        "Fletcher",
        "Candler",
        "Fairview",
        "Swannanoa"
      ],
      responseNote: "Serving Asheville and the surrounding area.",

      faqs: [
        {
          question: "Do you charge for estimates?",
          answer: "No. Estimates are free. Send a few details or photos and we will come out and look at the job."
        },
        {
          question: "Will you haul away the branches and logs?",
          answer:
            "Yes. Cleanup and haul-away are included unless you want to keep the firewood or the chips. Just tell us before we start."
        },
        {
          question: "How soon can you come out?",
          answer:
            "Most estimate visits happen within a few days. If a tree is on a structure or blocking access, call and we will treat it as urgent."
        },
        {
          question: "Do you work in my area?",
          answer: "We cover Asheville and the surrounding towns. Call and we will confirm before scheduling."
        }
      ]
    }
  };
}
