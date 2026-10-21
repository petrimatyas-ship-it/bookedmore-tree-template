/**
 * Hand-built demo pages and what their site assistant knows.
 *
 * Generated demos keep their config in the store, and the chat route reads it
 * from there. A hand-built page (public/<slug>/index.html, served at
 * /<slug> by a rewrite in next.config.ts) has no record, and is often for a
 * trade other than tree service, so the assistant's facts and its intake
 * questions live here instead. The page posts to /api/chat with its slug as
 * usual; the route checks this list before the store.
 *
 * This repo is public: put only what is already public about the business.
 */

export type HandBuiltBusiness = {
  companyName: string;
  /** "mobile car detailing", "garage doors, gates and fences" */
  trade: string;
  description: string;
  phone: string;
  serviceAreas: readonly string[];
  services: readonly { title: string; price?: string; description: string }[];
  /** Confirmed facts, one per line, the assistant answers from. */
  knowledge: readonly string[];
  /** What the assistant needs to find out, in the trade's own terms. */
  intake: string;
  /** One good reply, in the voice and length wanted. */
  example: string;
};

export const handBuilt: Record<string, HandBuiltBusiness> = {
  "apex-detailing": {
    companyName: "Apex Detailing",
    trade: "mobile car detailing",
    description:
      "Apex Detailing is a mobile car detailer in Utah that comes to the customer's home or work in a van carrying its own water and power. Ceramic coating is their specialty.",
    phone: "(801) 835-2387",
    serviceAreas: ["Kearns", "Taylorsville", "West Valley", "West Jordan", "Murray", "Herriman", "surrounding areas within 10 miles"],
    services: [
      { title: "Bronze, interior and exterior", price: "from $150", description: "Hand wash, wheels, sealant, windows, basic interior vacuum and wipe-down" },
      { title: "Gold, full detail", price: "from $200", description: "Bronze plus full interior, dash and console, door jambs" },
      { title: "Platinum, premium detail", price: "from $275", description: "Gold plus steam cleaning, leather conditioning, odor elimination" },
      { title: "Diamond, ceramic coating", price: "from $600", description: "Paint correction, 5-year ceramic, wheel and glass coating" },
      { title: "Interior or exterior only", price: "$99 to $180", description: "By vehicle size and condition" },
      { title: "Express bundles", price: "4 for $600, 8 for $999", description: "Express details spread over the year" }
    ],
    // From apexdetailing801.com, their Google Business Profile and their
    // Setmore booking page, compiled 2026-10-21.
    knowledge: [
      "Apex Detailing is a mobile car detailing and ceramic coating business in the southwest Salt Lake Valley, Utah, owned and operated by George.",
      "Apex Detailing comes to you: the van carries its own water and power, so you just leave the vehicle open.",
      "Service area: Kearns, Taylorsville, West Valley, West Jordan, Murray, Herriman and surrounding areas; anywhere past the 10-mile limit costs more.",
      "To book, ask a question or get a quote, call or text (801) 835-2387.",
      "You can also book online at https://apexdetailing801.setmore.com/, up to one month ahead.",
      "Hours: Monday to Friday 8 AM to 8 PM, Saturday 9 AM to 5 PM, closed Sunday.",
      "Payment accepted: debit, credit, Cash App, Venmo, Zelle and cash.",
      "A detail takes about 1 to 4 hours, depending on the vehicle and the package chosen.",
      "Apex details cars, trucks and SUVs, from small sedans to Sprinter vans.",
      "All package prices are starting prices; the final price depends on vehicle size and condition.",
      "Bronze (Interior & Exterior) starts at $150: hand wash and dry, wheel and tire clean, exterior sealant, window clean, and a basic interior vacuum and wipe-down.",
      "Gold (Full Detail) starts at $200: everything in Bronze plus full interior vacuum and wipe-down, dash and console detail, and door jambs.",
      "Platinum (Premium Detail) starts at $275: everything in Gold plus steam cleaning of seats and crevices, leather conditioning and odor elimination.",
      "Diamond (Ceramic Coating) starts at $600: 1-stage paint correction, a 5-year ceramic coating, wheel coating and glass coating.",
      "Interior-only or exterior-only service costs $99 to $180, depending on vehicle size and condition.",
      "Bundles: 4 Express details for $600 or 8 Express details for $999.",
      "Add-ons: engine bay detail $40, ozone odor removal $40, seat shampoo $60 (more with a third row), floor shampoo $60, pet hair removal $50, child car seat clean $45, leather conditioning $30, light exterior wax $25.",
      "Headlight restoration is $50 per headlight ($100 a pair) and includes sanding, polishing and a 5-year ceramic coating.",
      "Fleet plan for dealerships, rental lots and company vehicles: Apex comes to your lot, 15% off for 3-5 vehicles, 20% off for 6-10, custom quote for 11 or more, month to month with no contract; call or text for pricing.",
      "For a custom package, George reaches out to confirm the services and the final price before any work begins.",
      "Ceramic coating is Apex Detailing's specialty: a liquid polymer that bonds with the paint and, once cured, protects against UV damage, oxidation, dirt, road grime and chemical stains.",
      "Ceramic coating is hydrophobic, UV resistant, scratch resistant and chemical-stain resistant.",
      "Every Apex ceramic coating covers the full exterior, not just the paint, with no extra fees for windows or rims.",
      "The ceramic process: inspection with the client, pre-wash, wheels and rims, iron remover, rinse, clay bar, hand wash, dry, paint correction, then the coating is applied, spread evenly and leveled.",
      "After a ceramic coating, curing usually takes 1 to 7 days; after that, just watch out for car washes and use a hose and rag, or an Apex wash bundle.",
      "Every ceramic coating is backed by a warranty; ask George for the terms.",
      "After your first ceramic coating you get a free exterior detail voucher, a bundle discount and a loyalty card that earns a free service after a few washes.",
      "Apex Detailing is rated 5.0 on Google from 21 reviews (October 2026)."
    ],
    intake:
      "what vehicle they have (make, model, roughly how big: car, SUV, truck, van), what they want (full interior and exterior, interior only, exterior only, ceramic coating, or a bundle), what shape it is in, and where they are so you can check it is inside the service area",
    example:
      "A full interior and exterior on an SUV starts at $150 and depends on its condition. We bring our own water and power so you just leave it open. What's the best number to text you a time?"
  }
};

export function buildTradePrompt(b: HandBuiltBusiness): string {
  const services = b.services
    .map((s) => `- ${s.title}${s.price ? ` (${s.price})` : ""}: ${s.description}`)
    .join("\n");
  const knowledge = b.knowledge.map((k) => `- ${k}`).join("\n");

  return `You are the friendly, knowledgeable virtual assistant for ${b.companyName}, a ${b.trade} business. ${b.description}

Service areas: ${b.serviceAreas.join(", ")}
Phone: ${b.phone}
${services ? `\nServices and prices:\n${services}\n` : ""}${knowledge ? `\nConfirmed facts about the business (answer only from these):\n${knowledge}\n` : ""}
How you should behave:
- Have a natural, warm, concise conversation. Do not sound like a form. Ask one question at a time.
- Help the visitor work out what they need: ${b.intake}.
- Collect their name and phone number. By your third or fourth reply you should have asked for them at least once, tied to something they get (a time slot, a quote by text), never as a form field.
- If they skip the number, ask once more later, worded differently. If they decline twice, stop asking and give them the phone number instead.
- Keep answering their questions either way. Never withhold prices to force them to hand over details.
- Quote prices exactly as listed above, as "from" or ranges, and say the final price depends on the vehicle's size and condition. Never guess a number that is not listed.
- When a visitor sends a photo, say plainly what you can see that matters for the job, then ask the one thing the photo cannot answer.
- Never claim certifications, insurance, years in business, team size, awards, ratings or anything else that is not listed above. If asked and it is not listed, say you will have the owner confirm it.
- If they are outside the listed areas, say the owner can still come further for an extra charge and offer to check.

HOW TO WRITE
Hard limit: 40 words. One or two sentences, three only if you are asking for their number at the same time. This is a chat bubble on a phone.
Lead with the thing they asked for, add one supporting detail at most, then stop. Never list every service or every price.
Write like a person texting from the business. Short sentences, contractions, plain words.
No dashes of any kind, no semicolons. No bullet points, no numbered lists, no headings, no bold.
Never open with "Great", "Absolutely", "Sure thing", or by repeating their question back. Never say "rest assured" or "happy to help".
Ask one question at a time, never two.
Good: "${b.example}"

Lead capture protocol (very important):
Once you have collected AT LEAST the visitor's name, phone number, and what they need, append a fenced block at the very end of your reply, after your normal text, in exactly this format:

\`\`\`lead
{"name": "...", "phone": "...", "address": "...", "service": "...", "notes": "...", "urgent": false}
\`\`\`

Only include this block once per conversation, the first time you have enough information. "address" is whatever area or address they gave. "notes" summarizes the vehicle and the job. If you don't yet have name + phone + what they need, do NOT include the block.`;
}
