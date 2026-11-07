# cleaning

An exterior-cleaning page (pressure washing, soft washing, window cleaning): deep navy and aqua,
Sora headings over Plus Jakarta Sans, dark and light bands taking turns.

It reads the same data as `pressure-washing` (a site can switch templates without new data), plus two
optional lists:

- `stats[]` `{ n, l }`: the band under the hero, four facts (rating, review count, free estimates, hours).
  Only their own facts.
- `ticker[]`: short phrases in the running strip under it (their services, "Free estimates", the area).

The logo sits on the white header and, without a box, on the dark footer: give it a transparent
PNG (`scripts/site-kit` users: cut the white away first; a logo on white shows as a white block there).

Sections, in order: hero (their photo behind, Google rating pill), stats, ticker, services (icon cards),
about (their photo, a review card), how it works (three equal steps in a row, stacked on phones), their work (gallery, tap to enlarge),
Google reviews, quote form with hours, FAQ, service area with map, a closing band, footer. On phones a
Call / Free quote bar stays at the bottom. The chat bubble, the locked pages, the quote form's sending
(`leadsTo`) and visit tracking are the pressure-washing template's, unchanged.

The home page is the only real page. The menu, the footer, "All services", each service's "Learn more",
"See all photos", "See all reviews", "More about us", "All questions" and "Every town we serve" open the
locked preview of that page (what it will hold once the site goes live), as on the pressure-washing
template. `pages: true` is not read yet.
