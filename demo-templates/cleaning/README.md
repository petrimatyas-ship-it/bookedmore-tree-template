# cleaning

An exterior-cleaning page (pressure washing, soft washing, window cleaning): deep navy and aqua,
Sora headings over Plus Jakarta Sans, dark and light bands taking turns.

It reads the same data as `pressure-washing` (a site can switch templates without new data), plus two
optional lists:

- `stats[]` `{ n, l }`: the band under the hero, four facts (rating, review count, free estimates, hours).
  Only their own facts.
- `ticker[]`: short phrases in the running strip under it (their services, "Free estimates", the area).

Sections, in order: hero (their photo behind, Google rating pill), stats, ticker, services (icon cards),
about (their photo, a review card), how it works (numbered steps), their work (gallery, tap to enlarge),
Google reviews, quote form with hours, FAQ, service area with map, a closing band, footer. On phones a
Call / Free quote bar stays at the bottom. The chat bubble, the locked pages, the quote form's sending
(`leadsTo`) and visit tracking are the pressure-washing template's, unchanged.

Home page only for now: `pages: true` is not read.
