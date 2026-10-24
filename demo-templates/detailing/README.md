# Detailing demo template

Every car-detailing demo uses the same page. It was built for Apex Detailing
(demo.morebookednow.com/apex-detailing). Only the business changes; the
layout and sections stay the same:

hero, packages (tiers, compare table, single service, bundles, fleet
plan, build your own, add-ons), before and after with their videos, Google
reviews, ceramic coating, about and how it works, service area with hours
and payment, FAQ, then the quote form; the chat is a bubble in the corner. The nav links (Services, Ceramic, Pricing,
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

From the second review (October 2026):
- One background for the whole page. No section gets its own background
  or a dividing line; the page should read as one surface.
- Hero: only two buttons, "Book online" and "Call us".
- Before and after: small cards (two across on phones). Business photos
  are often low resolution, and big ones look bad.
- Their videos shown as tiles in the page's own style, with the social
  profiles in the same panel. TikTok's own white embed looked out of place.
- Ceramic steps as a small route map: tap a step and the route lights up
  to it.

From the third review (October 2026):
- Hero picture behind the text, not a separate box above it, with a slow
  drift and light sweep. `images.hero` should be a wide car shot.
- Less space between sections on phones.
- Video tiles fairly large on phones (about 60% of the width).
- Their own package-card look: each tier card shows a car photo between
  the name and the list, and a "Starting at" price box above the button
  (`packages.tiers[].image`, 728×320 transparent cut-outs of each car,
  set near the bottom of the frame; Apex's came from a sheet the owner
  sent, since the first crops from his site graphics looked dim). Plus a "Compare packages" table (`packages.compare.rows`,
  each with `has`, one true/false per tier; `packages.tiers[].short` is
  the label under each name).
- Hero background: plain. The page's dark background with one soft blue
  glow, text only, starting near the top. Tried and turned down on Apex:
  a car photo, a cut-out car, an animated paint-and-droplets graphic and a
  drawn animated supercar. `images.hero` still adds a picture if an owner
  wants one (`photo: true` for a full photo).
- The hero stays plain on every screen. `hero.side.car` can put a package
  car and a specialty card on the right (from 760px wide), but the owner
  tried it on Apex and dropped it.
- Sections sit close together: 44px padding on phones, 64px on desktop.
- The tier cards' "Book" buttons go straight to their booking page
  (`links.booking`).
- No price boxes in the hero (`hero.facts` left out). Package car pictures
  bright and full card width, not faded. The ceramic "No half jobs" points
  show only their titles until tapped. The step map starts at step 1,
  any part of a step (number included) selects it, and the steps passed
  fill in blue. No "Owner-operated" tag.
- No sticky bottom bar on phones (Call / Text / Ask / Quote). The assistant
  is a small chat bubble in the corner that opens a chat panel; the quote
  card is the form only. Google reviews come right after before and after,
  ahead of ceramic. Every ceramic step has a short sentence.
- On phones, outside links (Instagram, TikTok, Google, booking) open in the
  same tab. The owner opens demos from apps, and those in-app browsers
  ignore new-tab links, so the buttons seemed dead.
  `images.hero` still works if an owner wants a photo (`photo: true` for a
  full photo).

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
   - the hero photo: `images.hero` (file, alt, width, height, and
     `photo: true` for a full photo). Without it the hero shows the logo.
   - one car picture per tier: `packages.tiers[].image`.
   - the about picture: `images.about`.
   - before and after photos: `results.photos`. Each has a `before` and an
     `after` file of the same size (2:3, e.g. 468×702), lined up so the
     slider compares like with like. If the business only has side-by-side
     composites, cut them into halves, and check the proportions: Apex's
     were squeezed sideways in their own graphic.
   - TikTok: `social.tiktok.videos` is a list of `{id, file, title}`. The
     ids and covers come from TikTok's creator embed page
     (`tiktok.com/embed/@<user>`); save each cover as `tiktok-<id>.webp`
     (360×640). TikTok's player loads only when a video is tapped.

   Copy their photos here; never link to their site.
   Picture fields are file names in `public/<slug>/`, or full addresses;
   `assets` changes the folder (see `scripts/detailing-assets.mjs`).
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

## Sites the Replymint site maker builds

Replymint (the loopfinity repo, `lib/site-maker.ts`) builds a detailing
site on its own when a prospect replies that they're interested. It sends
the same data as `businesses/<slug>.json` to this app:

- `POST /api/sites` `{ slug, template: "detailing", data }` stores it in
  Upstash as `site:<slug>` (no expiry). `GET /api/sites?slug=` returns it
  and its visits; `DELETE /api/sites?slug=` takes it down. Every call needs
  `Authorization: Bearer <SITE_MAKER_KEY>`, a secret set both here on
  Vercel and on the loopfinity Worker.
- The data is rendered once before it is stored, so a site with a missing
  value is refused with the field's name, never shown with a gap.
- `app/[slug]/route.ts` serves it at `demo.morebookednow.com/<slug>`,
  rendered per request from `template.html`. The chat finds its facts in
  the stored `assistant` block (`app/api/chat`); review mode and visit
  tracking work as on any page.
- Its pictures live in Replymint's file store: `data.assets` is that
  folder's address, and each picture field is a file name in it
  (`scripts/detailing-assets.mjs`). A field can also hold a full address.

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
