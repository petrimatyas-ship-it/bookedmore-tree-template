# Contractor template

A clean, trustworthy local-contractor page in the style of Bert Roofing
(the owner's pick): white and a pale tint, deep dark sections, one strong
button colour, a yellow highlight on dark, small corners and a geometric
sans (Urbanist). Colours come from `colors`; the first site, Tree Top
Techs, is dark green.

Top to bottom: a dark strip ("Need tree removal ASAP? Call now"); a white
header (logo, eyebrow, name, "Call today", Free quote) with a nav row; a
split hero (words left, their photo right) on a soft tint; trust badges;
the quote: the tree-service demo's two-tab panel (Ask a question with the
assistant in it, and Free quote with photos) beside a dark "What you get
on every job" panel with a review; about beside a photo; dark "Numbers,
not adjectives"; white service cards with the photo on top (Learn more,
Free quote); dark four-step process; their work; reviews and the review
box; FAQ; service area with map and hours; a dark call strip and the
footer. Menu, footer services and each card's Learn more open the full
site's other pages as locked.

Stored sites use it with `template: "contractor"`.

Data, every value already HTML-escaped:

- `slug`, `name`, `seo { title, description }`, `icons`, `phone { display, tel }`, `timezone`
- `colors { dk, dk2, acc, accD, pale, pale2, hi }` (optional): dark sections, the cards on dark, buttons and links, their hover, the tint, the lighter tint, the highlight on dark
- `strip { hi, text }`, `brand { eyebrow, line, sub }`
- `images.heroLogo`, `images.hero { …, position, ratio }` (ratio as `w/h`), `images.about`
- `rating { score, count }` (optional), `hero { crumb, kicker, h1, lead }`
- `badges { line, items[{ title, sub }] }` (four)
- `quote { h2, intro, top { h2, intro, photos }, placeholder, services[{ value, label }], serviceNames }` (`quote.h2`/`intro` head the service-area section)
- `promise { h3, items[], review? { text, name } }`
- `about { eyebrow, h2, paras[] }`, `numbers { eyebrow, h2, items[{ big, label }] }` (four)
- `services { eyebrow, h2, intro, items[{ value, icon, title, text, photo, photoAlt }] }` (no photo: the icon on a tint)
- `steps { eyebrow, h2, intro, items[{ title, text }] }` (four)
- `gallery` (optional) `{ eyebrow, h2, intro, photos[{ file, caption, alt, width, height }], note }`: 5 or 9 fill the grid
- `reviews { h2, items[{ text, name, date }], ask }`, `faq { intro, items[{ q, a }] }`
- `area { short, cities[], mapQuery, mapTitle }`, `hours` (as loopfinity's `hoursFrom` builds it)
- `links { googleReviews, googleWriteReview }`, `fband { eyebrow, text }`, `footer { about, year }`, `chat`, `assistant` (as the other templates)

Their own photos only, never stock.
