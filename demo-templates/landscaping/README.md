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
- `images.heroLogo` (round, header and footer), `images.hero` (optional `position`), `images.about`, `images.about2`
- `hero { kicker, h1, lead }`, `stats[{ big, acc, label }]` (four; `acc` is the gold part, may be empty)
- `services { eyebrow, h2, intro, items[{ value, icon, title, text, photo, photoAlt }] }`: a card with a `photo` shows it; without one, a cream card with the icon (`leaf`, `sprout`, `scissors`, `tree`, `snow`, `drop`, `fence`, …)
- `steps { eyebrow, h2, intro, items[{ title, text }] }` (four)
- `about { h2, caption, paras[], stats[{ big, acc, label }], areaLine }`
- `gallery` (optional) `{ eyebrow, h2, intro, photos[{ file, caption, alt, width, height }], note }`: first photo big; 5 or 9 fill the grid
- `reviews { h2, intro, items[{ text, name, date, initial }] }`
- `why { h2, intro, left[2], right[2] ({ icon, title, text }), photo { file, alt, width, height } }`
- `band { h2, text, photo }`, `faq { intro, items[{ q, a }] }`
- `area { short, cities[], mapQuery, mapTitle }`, `hours` (as `hoursFrom` in loopfinity's `lib/site-maker-model.ts` builds it)
- `quote { h2, intro, services[{ value, label }], serviceNames }` (values match `services.items[].value`)
- `links { googleReviews, googleWriteReview }` (their listing on Google Maps, by name and place id), `footer { motto, year }`, `chat { greeting, suggestions[{ label, q }] }`
- `assistant { trade, description, serviceAreas, services, knowledge, intake, example, priceDepends }`

Their own photos only, never stock.

First site: Coreas Landscaping Services (`/coreas-landscaping-services`).
