# Detailing demo template

Every car-detailing demo uses the same page. It was built for Apex Detailing
(demo.morebookednow.com/apex-detailing). Only the business changes; the
layout and sections stay the same:

hero, the strip under it, packages (tiers, single service, bundles, fleet
plan, build your own, add-ons), before and after, ceramic coating, Google
reviews, about and how it works, service area with hours and payment, FAQ,
then quote form and chat. The nav links (Services, Ceramic, Pricing,
Reviews, Areas, About) open the "locked page" pop-up.

- `template.html`: the page. Change the layout here, then rebuild every business.
- `businesses/<slug>.json`: everything about one business, for the page and the chat.
- `../../scripts/build-detailing-demo.mjs`: builds `public/<slug>/index.html` from the two.

## New detailer, step by step

1. **Gather the facts.** Read their website (every page), their Google
   listing (rating, review count, hours, real reviews), and their Instagram,
   TikTok and booking page. Write down only what a source says: never
   invent years in business, insurance, warranties, ratings or prices.
   Never put the owner's personal email anywhere; this repo is public.
2. **Pick a slug**, e.g. `shine-mobile-detailing`. The page will be at
   `demo.morebookednow.com/<slug>`.
3. **Copy the data file**: `cp businesses/apex-detailing.json businesses/<slug>.json`
   and change every value. Values are inserted as HTML, so write `&amp;`
   for `&`. Notes on the fields:
   - `slug` must match the file name.
   - `packages.tiers`: any number. `featured: true` gets the glow and the
     tag. `plus` is the optional "Everything in X, plus" line. `pick` must
     match a `quote.services[].value`.
   - `packages.single`, `bundles`, `fleet`, `custom`, `addons.items`,
     `reviews.topics` and `social` (or `social.tiktok` /
     `social.instagram` on their own): delete the key, or empty the list,
     to hide that block.
   - `hours.rows` are the lines shown. `hours.schedule` gives each row key
     its `[open, close]` hours, 24-hour, or `null` when closed.
     `hours.dayRow` maps Sunday to Saturday to a row key. `timezone` is
     theirs, e.g. `America/Denver`.
   - `area.radar`: one dot and label per town on the 400×400 radar drawing,
     with the van at 200,200. Place them roughly by direction.
   - `quote.services` / `quote.serviceNames`: the options in the quote
     form's dropdown, and how the thank-you message names them.
   - `assistant`: what the chat knows. `knowledge` is one confirmed fact
     per line, covering prices, area, hours, payment, booking and care
     tips.
4. **Images** go in `public/<slug>/`:
   - `icon.png`: 256×256, the tab icon.
   - `icon-96.webp`: the logo in the header.
   - the hero logo: `images.heroLogo`.
   - the about picture: `images.about`.
   - before and after photos: `results.photos`. Each one is a single image,
     before on the left and after on the right; `split` is where the
     halves meet.

   Copy their photos here; never link to their site.
5. **Chat**: in `lib/hand-built.ts`, import the JSON and add it to the
   `detailing` list (one import, one list entry).
6. **Build**: `node scripts/build-detailing-demo.mjs <slug>`. It warns about
   any image that's missing.
7. **Check** it on a phone and on desktop (`npm run dev`, then open
   `/<slug>`), and ask the chat a price question.
8. **Ship**: commit, open a PR, merge. The page address and robots.txt pick
   up the new JSON on their own (`next.config.ts`, `app/robots.ts`).
9. **Admin**: in the morebookednow repo, add a line to `HAND_BUILT` in
   `app/admin/demos/page.tsx` so its visits show on /admin/demos.

## Changing the layout for everyone

Edit `template.html`, then rebuild every business:

```bash
for f in demo-templates/detailing/businesses/*.json; do node scripts/build-detailing-demo.mjs "$(basename "$f" .json)"; done
```

Never edit `public/<slug>/index.html` by hand; the next build overwrites it.

## Template syntax

`{{a.b}}` inserts a value. `{{json a.b}}` inserts JSON, for scripts.
`{{#each list}}…{{/each}}` repeats a block, with `{{this}}` or the item's
own fields inside it. `{{#if x}}…{{else}}…{{/if}}` shows a block only
when `x` is set. A missing value stops the build. The engine is in
`scripts/render-template.mjs`.
