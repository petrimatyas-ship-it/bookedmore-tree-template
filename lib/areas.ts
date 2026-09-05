import { business } from "@/lib/business";

// Programmatic SEO: every area below gets its own landing page at
// /tree-service/[slug]. Swap this list per customer — the copy on each
// page is generated deterministically from the pools further down, so
// no two areas read identically.

export type Area = { name: string; zip?: string };

export const allAreas: Area[] = [
  // Inside the Loop / central
  { name: "The Heights", zip: "77008" },
  { name: "Montrose", zip: "77006" },
  { name: "River Oaks", zip: "77019" },
  { name: "Midtown", zip: "77002" },
  { name: "Downtown Houston", zip: "77002" },
  { name: "EaDo", zip: "77003" },
  { name: "Museum District", zip: "77004" },
  { name: "Rice Village", zip: "77005" },
  { name: "West University", zip: "77005" },
  { name: "Upper Kirby", zip: "77098" },
  { name: "Greenway Plaza", zip: "77046" },
  { name: "Third Ward", zip: "77004" },
  { name: "Second Ward", zip: "77011" },
  { name: "East End", zip: "77023" },
  { name: "Northside", zip: "77009" },
  { name: "Independence Heights", zip: "77018" },
  { name: "Garden Oaks", zip: "77018" },
  { name: "Oak Forest", zip: "77018" },
  { name: "Timbergrove", zip: "77008" },
  { name: "Rice Military", zip: "77007" },
  { name: "Washington Corridor", zip: "77007" },
  // West / southwest
  { name: "Memorial", zip: "77024" },
  { name: "Memorial City", zip: "77024" },
  { name: "Energy Corridor", zip: "77079" },
  { name: "Westchase", zip: "77042" },
  { name: "Galleria / Uptown", zip: "77056" },
  { name: "Tanglewood", zip: "77056" },
  { name: "Briargrove", zip: "77057" },
  { name: "Spring Branch", zip: "77080" },
  { name: "Hedwig Village", zip: "77024" },
  { name: "Bunker Hill Village", zip: "77024" },
  { name: "Piney Point Village", zip: "77063" },
  { name: "Hunters Creek Village", zip: "77024" },
  { name: "Bellaire", zip: "77401" },
  { name: "Meyerland", zip: "77096" },
  { name: "Braeswood", zip: "77025" },
  { name: "Westbury", zip: "77035" },
  { name: "Sharpstown", zip: "77036" },
  { name: "Alief", zip: "77072" },
  { name: "Mission Bend", zip: "77083" },
  // North
  { name: "Spring", zip: "77379" },
  { name: "Klein", zip: "77379" },
  { name: "Champions", zip: "77069" },
  { name: "Willowbrook", zip: "77070" },
  { name: "Cypress", zip: "77433" },
  { name: "Copperfield", zip: "77095" },
  { name: "Jersey Village", zip: "77040" },
  { name: "Tomball", zip: "77375" },
  { name: "The Woodlands", zip: "77381" },
  { name: "Conroe", zip: "77301" },
  { name: "Humble", zip: "77338" },
  { name: "Atascocita", zip: "77346" },
  { name: "Kingwood", zip: "77339" },
  { name: "Aldine", zip: "77039" },
  { name: "Greenspoint", zip: "77060" },
  // East / southeast
  { name: "Pasadena", zip: "77502" },
  { name: "Deer Park", zip: "77536" },
  { name: "La Porte", zip: "77571" },
  { name: "Baytown", zip: "77520" },
  { name: "Channelview", zip: "77530" },
  { name: "Clear Lake", zip: "77058" },
  { name: "Webster", zip: "77598" },
  { name: "League City", zip: "77573" },
  { name: "Friendswood", zip: "77546" },
  // South / southwest suburbs
  { name: "Pearland", zip: "77584" },
  { name: "Missouri City", zip: "77489" },
  { name: "Stafford", zip: "77477" },
  { name: "Sugar Land", zip: "77479" },
  { name: "Richmond", zip: "77406" },
  { name: "Rosenberg", zip: "77471" },
  { name: "Katy", zip: "77494" },
  { name: "Bear Creek", zip: "77084" }
];

export function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/\//g, " ")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export function findArea(slug: string): Area | undefined {
  return allAreas.find((a) => slugify(a.name) === slug);
}

// --- Deterministic copy generation -----------------------------------------

const treePools = [
  "mature live oaks and pecans",
  "tall loblolly pines",
  "water oaks and elms",
  "post oaks and sweetgums",
  "crepe myrtles and young shade trees",
  "sycamores and older hardwoods"
];

const housingPools = [
  "historic bungalows on narrow lots",
  "established ranch homes with big yards",
  "newer master-planned subdivisions",
  "large wooded properties",
  "townhomes and patio homes with tight access",
  "estate properties with formal landscaping"
];

const issuePools = [
  "storm-damaged limbs after Gulf storms roll through",
  "roots lifting driveways and sidewalks",
  "canopies crowding rooflines and gutters",
  "deadwood hanging over patios and play areas",
  "drought-stressed pines that turn hazardous fast",
  "overgrown fence lines and easements"
];

const openerPools = [
  (n: string) => `${n} is one of the areas our crews work most weeks of the year.`,
  (n: string) => `We've been taking care of trees in ${n} for years, and it shows in how often our trucks are in the neighborhood.`,
  (n: string) => `Ask around ${n} and there's a good chance a neighbor has already used us.`,
  (n: string) => `${n} sits well inside our core coverage area, so scheduling is fast and travel is always included.`
];

function hash(text: string) {
  let h = 0;
  for (let i = 0; i < text.length; i++) h = (h * 31 + text.charCodeAt(i)) % 100000;
  return h;
}

export function getAreaContent(area: Area) {
  const h = hash(area.name);
  const trees = treePools[h % treePools.length];
  const housing = housingPools[(h >> 2) % housingPools.length];
  const issue = issuePools[(h >> 4) % issuePools.length];
  const opener = openerPools[(h >> 6) % openerPools.length](area.name);

  const paragraphs = [
    `${opener} The area is known for ${housing}, and the trees that come with them, mostly ${trees}. The most common calls we get here are for ${issue}.`,
    `Every ${area.name} job runs the same way: a free written estimate up front, proof of insurance before work starts, and a full cleanup before we leave. Branches get chipped, debris gets hauled, and the driveway gets blown off. Whether it's a full removal, structural pruning, stump grinding, or emergency storm work, the crew that quotes your job is the crew that shows up to do it.`,
    `Need help today? Emergency calls in ${area.name} are dispatched same-day, 24/7. For everything else, we typically have an estimator in the area within 48 hours.`
  ];

  const popularServices = [
    business.serviceCards[h % business.serviceCards.length].title,
    business.serviceCards[(h + 2) % business.serviceCards.length].title,
    business.serviceCards[(h + 4) % business.serviceCards.length].title
  ].filter((v, i, arr) => arr.indexOf(v) === i);

  return { paragraphs, popularServices };
}

export function nearbyAreas(area: Area, count = 10): Area[] {
  const index = allAreas.findIndex((a) => a.name === area.name);
  const result: Area[] = [];
  for (let offset = 1; result.length < count && offset < allAreas.length; offset++) {
    const next = allAreas[(index + offset) % allAreas.length];
    if (next.name !== area.name) result.push(next);
  }
  return result;
}
