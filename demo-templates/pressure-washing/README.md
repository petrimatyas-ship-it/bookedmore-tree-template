# Pressure washing template

A plain local-contractor page for pressure washing and soft washing
businesses: white, blue and navy, a red button for the free estimate, small
corners and tight spacing. Modelled on the kind of site owners in the trade
already like (Southern Shine Soft Washing): a photo hero under a blue wash,
a quick estimate bar, an intro with a checklist, service cards, one blue
band, three steps, their own photos, Google reviews, the service area with a
map and hours, FAQ, the estimate form and a navy footer. The chat bubble
answers from the site's `assistant` block, like the detailing pages.

Stored sites use it with `template: "pressure-washing"` (`POST /api/sites`,
rendered by `lib/detailing-page.ts`). Pictures sit in the same fields as the
detailing data (`images.heroLogo`, `images.hero`, `images.about`,
`gallery.photos`, `icons`), so `scripts/detailing-assets.mjs` resolves both.

Data, every value already HTML-escaped:

- `slug`, `name`, `tagline`, `seo { title, description }`, `icons`, `phone { display, tel }`, `timezone`
- `images.heroLogo` (their logo, header and footer), `images.hero` (behind the hero text; optional `position`), `images.about` (intro photo)
- `rating { score, count }` (optional), `hero { kicker, h1a, h1b, lead }`, `quick { title }`
- `intro { eyebrow, h2a, h2b, paras[], checks[], review? { text, name } }`
- `services { eyebrow, h2a, h2b, intro, items[{ value, icon, title, text, points[] }] }`; icons: `drop`, `roof`, `house`, `gutter`, `target`, or any other in the sprite
- `band { title, text }`, `steps { eyebrow, h2a, h2b, items[{ title, text }] }`
- `gallery` (optional) `{ eyebrow, h2a, h2b, intro, photos[{ file, caption, alt, width, height }], note }`: first photo big, best with 3
- `reviews { eyebrow, h2a, h2b, items[{ text, name, date, initial }] }`
- `area { eyebrow, h2a, h2b, text, cities[], mapQuery, mapTitle }`, `hours` (as `hoursFrom` in loopfinity's `lib/site-maker-model.ts` builds it)
- `faq { eyebrow, h2a, h2b, items[{ q, a }] }`
- `quote { eyebrow, h2a, h2b, intro, services[{ value, label }], serviceNames }` (values match `services.items[].value`)
- `links { googleReviews, googleWriteReview }`, `footer { about, year, copyNote }`, `chat { greeting, suggestions[{ label, q }] }`
- `assistant { trade, description, serviceAreas, services, knowledge, intake, example, priceDepends }`

Their own photos only, never stock. Many of these businesses' own sites
carry stock photos from their site builder; leave those out.

First site: East Cobb Softwash (`/east-cobb-softwash`).
