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

## What the owner wants (learned on Apex, October 2026)

Liked, keep doing:
- This layout, with its sections and the sub-page nav (Services, Ceramic,
  Pricing, Reviews, Areas, About opening the locked-page pop-up). It should
  feel like a full website with sub-sections, not a single landing page.
- The dark, glossy automotive look in the business's own colors and logo.
- Their own wording (slogans, FAQ answers, package names) and their real
  photos and logo. Real prices, packages and add-ons.
- A real chat that knows everything public about the business: website,
  Google listing and reviews, socials, booking page.
- Facts only from sources. The location from the business's own site and
  Google, not from our lead list (Apex was filed under Lehi but serves
  Kearns and the southwest Salt Lake Valley).

Did not like, avoid:
- The tree-service template's look carried over to another trade.
- A one-page landing-page rebuild with no sub-sections (tried on Apex,
  rolled back the same day).
- Our price ("$149 a month") anywhere on a demo.
- The "draft" bar and MoreBookedNow pitch blocks on a prospect who has
  already said yes (see `hideDemoBar` on generated demos).
- AI-made photos when the business has real ones, and stock photos.
- Slow multi-agent runs: build the page directly, at normal effort.

From the owner's first review of Apex (October 2026), now in the template:
- Hero: a real car photo (`images.hero`), shown first on phones. No fact
  row under the headline, no "proof" bubbles under the hero.
- Packages: the tiers swipe sideways on phones. Single service, bundles
  and fleet are one compact price list, not separate cards.
- Before and after: a drag slider on each photo, not a static split.
- Their TikTok videos on the page (`social.tiktok.embed`), not just a link.
- Ceramic steps: titles only, as a short numbered journey. Aftercare is one
  line. No rewards block.
- Area: no "vehicles we detail" card. Payment stands out, with a link only
  where a real one exists.
- FAQ's second button calls; the owner prefers calls to texts there.

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
   - the hero car photo: `images.hero` (file, alt, width, height). Without
     it the hero shows the logo.
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

## Owner review notes

Any demo page (detailing, Angel Pro, generated `/demo/` and `/modern/`)
has a review mode: open it with `?review=<key>` (the owner has the key;
only its SHA-256 is in `lib/review.ts`). A toolbar appears with 👍 Like,
👎 Don't like and ✏️ Change. Tap part of the page, write a note, save, and
a numbered pin stays on that spot. The notes are stored under
`feedback:<slug>` via `/api/demo/feedback`.

To read them: `GET /api/demo/feedback?slug=<slug>&key=<key>`. After fixing
one, mark it done:
`POST /api/demo/feedback {slug, key, action: "status", id, status: "done"}`.
The pin then shows ✓.

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
