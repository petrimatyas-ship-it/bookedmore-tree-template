# Landscaping template

A calm, upscale page for landscaping and lawn care businesses, modelled on
the kind of site owners in the trade like (Prestige Landscape & Design):
warm gold on cream and white, serif headings, rounded pill buttons, and
photo-led cards.

Top to bottom: a gold top bar (area and phone); a header laid over the hero
photo with a glass pill menu; a centred serif headline; a white stat bar
over the hero's bottom edge; service photo cards in a row that scrolls
sideways (Learn more and Free quote on each); a four-step process on cream;
About with three figures and a second photo; "Proud of our work"; Google
reviews in a sideways row and the "Happy with your yard? Review us on
Google" box; Why trust us (four reasons round one photo); a photo band
with a framed call to action; FAQ; contact with map, towns and hours beside
a gold estimate form; a charcoal footer. The menu, footer menu and each
card's Learn more open the full site's other pages as locked, with what
each will hold once the site goes live. The chat bubble answers from the
site's `assistant` block, like the other templates.

Stored sites use it with `template: "landscaping"` (`POST /api/sites`,
rendered by `lib/detailing-page.ts`). `scripts/detailing-assets.mjs`
resolves every picture field below.

Data, every value already HTML-escaped:

- `slug`, `name`, `tagline`, `seo { title, description }`, `icons`, `phone { display, tel }`, optional `phone2`, `timezone`
- optional `style: "direct"`: for trades that should read plain and practical (a tree service): square corners everywhere, and blunt contractor type in place of the serif: heavy condensed capitals (Barlow Condensed) for headings, buttons, labels and the menu, and a firm Barlow body
- optional `colors { acc, accD, accL, cream }`: their brand colour in place of the gold (accent, its dark shade, a light tint, the section background), e.g. a tree service's forest green
- `images.heroLogo` (round, header and footer), `images.hero` (optional `position`), `images.heroMobile` (optional: a different photo for the hero on phones, up to 700px wide, usually an upright one; optional `position`), `images.about`, `images.about2`
- `hero { kicker, h1, lead }`, `stats[{ big, acc, label }]` (four; `acc` is the gold part, may be empty)
- `services { eyebrow, h2, intro, items[{ value, icon, title, text, photo, photoAlt }] }`: a card with a `photo` shows it; without one, a cream card with the icon (`leaf`, `sprout`, `scissors`, `tree`, `snow`, `drop`, `fence`, …)
- `steps { eyebrow, h2, intro, items[{ title, text }] }` (four)
- `about { h2, caption, paras[], stats[{ big, acc, label }], areaLine }`
- `gallery` (optional) `{ eyebrow, h2, intro, photos[{ file, caption, alt, width, height }], note }`: first photo big; 5 or 9 fill the grid
- `reviews { h2, intro, items[{ text, name, date, initial }], ask? }` (`ask`: the review box's question, "Happy with your yard?" when not given)
- `why { h2, intro, left[2], right[2] ({ icon, title, text }), photo { file, alt, width, height } }`
- `band { h2, text, photo }`, `faq { intro, items[{ q, a }] }`
- `area { short, cities[], mapQuery, mapTitle }`, `hours` (as `hoursFrom` in loopfinity's `lib/site-maker-model.ts` builds it)
- `quote { h2, intro, services[{ value, label }], serviceNames, placeholder? }` (`placeholder`: the form's message box hint)
- optional `quote.top { h2?, intro?, photos? }`: the tree-service demo's quote straight after the hero, a promise beside the free quote form (without `h2`, the form on its own) (name, phone, email, address, service, description, photos); on phones the form comes first. The chat stays in its bubble. The closing section then keeps map and hours with a call card, and is `#contact`; `quote.h2` and `quote.intro` head it. (values match `services.items[].value`)
- `links { googleReviews, googleWriteReview }` (their listing on Google Maps, by name and place id), `footer { motto, year }`, `chat { greeting, suggestions[{ label, q }] }`
- `assistant { trade, description, serviceAreas, services, knowledge, intake, example, priceDepends }`

Optional, a whole site instead of one page (`scripts/site-pages.mjs`):

- `pages: true`: the menu, the footer and each card's Learn more open real pages instead of the locked previews: `/<slug>/about`, `/services`, `/services/<value>` (one per service), `/gallery`, `/reviews`, `/service-areas`, `/faq` and `/contact`, each with a photo heading and breadcrumb, the sections that belong there, and the quote form on the contact and service pages. `app/[slug]/[...rest]/route.ts` serves them; `POST /api/sites` renders every one before storing.
- `services.items[].page { lead?, h2?, paras[], points[], photos[{ file, alt, caption, width, height }], photo?, hero? }`: the service's own page (without it, the card's text)
- `gallery.more[]`: more work photos, on the gallery page only
- `pageHeads.<about|services|gallery|reviews|service-areas|faq|contact> { title, lead, photo, crumb? }`: each page's heading
- `area { h2?, text?, groups[{ name, text?, towns[] }] }`: the service areas page (else `area.cities`)
- `phone2 { display, tel }`: a second number, in the footer and the call card

Their own photos only, never stock.

First site: Coreas Landscaping Services (`/coreas-landscaping-services`).

Also optional, on any stored site of this template:

- `area.pages[{ slug, name, title?, lead?, photo, sections[] }]` (whole sites): a page per service area at `/<slug>/service-areas/<area>` (its sections, as `extraPages`, then the services, the quote form and contact), linked from the service areas page; for the searches people make in each place. Only facts that hold there: no "local experts in X" claims.
- `leadsTo[]`: email addresses the site's quote requests and chat leads go to, as well as the demo site's owner inbox (`OWNER_EMAIL`), through Resend (`RESEND_API_KEY`, `LEADS_FROM` on Vercel). Never shown on the page. Without it the quote form only says that this is a preview.
- `logoWide: true`: a wide logo that already says the name, shown alone in the header.
- `area.map` (from `scripts/site-kit/area-map.mjs`): a real map of the service area, OpenStreetMap streets toned down, with rings out from their base and their towns pinned; on an area page that town's pin stands out. In place of the embedded Google map.
- `schema`: schema.org structured data (e.g. a `RoofingContractor`), put in the page head as JSON-LD for Google. Both templates.
- `extraPages` (as on the pressure-washing page) are linked in the menus: those with `nav` in the header, all of them in the phone menu and the footer.
- optional `hero.short` (phones: a shorter hero, both buttons side by side) and `quote.top.short` (the quote after the hero is one "Get my free quote" button until tapped, then the full form; links to #quote open it too; the contact page always shows the form).
