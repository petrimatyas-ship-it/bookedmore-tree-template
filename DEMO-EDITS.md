# Hand-editing a generated demo

A log of what we change by hand on generated demos, so the common fixes can
move into the generator (`morebookednow` repo, `lib/enrich/*`) and stop
needing a person.

## How an edit works

1. The demo is generated on morebookednow.com/demo and saved as `demo:<slug>`
   in Upstash (30-day TTL). Nothing in this repo can write to it.
2. Edits go in `lib/demo-overrides.ts`, keyed by slug. Each field replaces the
   generated one whole. `getDemo` applies them, so every page sees them.
3. Images we need to control are copied into
   `public/images/demos/<slug>/` and referenced by path.
4. Branch, PR to `main`, merge. Vercel deploys.

Once the record expires from Upstash the override has nothing to apply to.

## Recurring fixes (automate these)

| Problem | Hand fix | Automate by |
| --- | --- | --- |
| Logo and photos hotlinked from the prospect's own site show broken in some browsers, though the URLs load from a server | Copy them into `public/images/demos/<slug>/` | Have the generator copy every pulled logo and photo into our blob storage (as it already does for the generated hero) and save those URLs, never the prospect's |
| A wide wordmark logo (e.g. 395×75) is shrunk into the 48px square mark, and the name is typed again beside it | `logoWide: true` in the override: shows it at its own shape, hides the typed name | Set `logoWide` in the generator when the logo's width is more than about 2× its height |
| Gallery ("Photos from our Google listing") hotlinked from the prospect's site, broken; also those photos came from their website, not Google | Host copies, set `gallery`, `galleryTotal`, and `galleryCaption: "Photos from our website"` | Same copying; label the gallery by where the photos really came from |
| Generated copy is generic when their site has a clear "about" and a service list | Put their own wording in `tagline`, `description`, `heroSubline`, `aboutParagraphs`, `services` | The enricher deliberately stopped copying site text (see morebookednow HANDOFF). Decide whether a clearly factual service list and about text are worth taking back |
| The trust bar claims "Licensed & insured" and "24/7 emergency service" for every business | `trustBarClaims` with what their site actually says | Build these two rows from facts the enricher found, and leave a row out when nothing backs it |
| The site assistant only knows the service cards and FAQs | Put hours, towns, insurance, owner's name, disposal policy and so on in `knowledge` (one fact per line); the chat route adds them to its prompt | Have the enricher fill `knowledge` from their website pages (home, about, services, contact), Google listing (address, hours, rating) and directory profiles (Houzz and similar) |
| Desktop hero falls back to `gallery[0]`, a hotlinked photo | Set `heroImageWide` to a hosted copy of their best landscape photo | Covered by copying photos to blob storage; pick the widest landscape photo |

## Log

### ducks-tree-and-stump-service-aurora (2026-09-30)

The owner said yes to a demo by email. Their site is
duckstree.com, Aurora IL.

- Logo: their wide wordmark from
  `duckstree.com/wp-content/uploads/2023/03/Ducks-Tree-Stump-Service-Logo-2_395x75.png`,
  hosted as `logo.png`, `logoWide: true`.
- Desktop hero: their photo `2019/09/Limb-less-Tree.jpg` (climber on a
  limbed trunk), hosted as `hero-wide.webp`.
- Phone hero: the generated one, re-hosted smaller as `hero.webp` (the
  original was a 2.5 MB PNG).
- Gallery: five photos from duckstree.com (`home_image`, `1_middle`,
  `Cutting-Up-Stump-Parts`, `Operating-Stump-Grinder`, `1_before`) hosted as
  `work-1..5.webp`, `galleryTotal: 10` (photos on their site), caption
  "Photos from our website".
- Wording from their home page: tagline, description, hero subline, about
  paragraphs, and their nine services (Overhanging Limbs, Plant Trees, Storm
  Damage, Stump Grinding, Tree Pruning, Tree Trimming, Tree Removal, Tree
  Shaping, Lot Clearing). This confirms Lot Clearing and emergency storm
  work.
- `hideDemoBar: true`: the owner already said yes, so the "This is a draft
  of your site / I want this site / morebookednow.com" bar is gone.
- From every page of duckstree.com (home, about-us, services, our-work,
  contact-us), their Google listing and their Houzz profile: 14 service
  towns, hours (Mon to Sat 7 to 7, Sunday closed), insured (liability and
  workers compensation), over 20 years in the tree business (`founded:
  "2006"`, so the stat reads 20+), year-round emergency work, free waste
  disposal, owner Carlos, 1041 Cochran St. All in `knowledge` for the chat,
  plus `serviceAreas`, `responseNote` and `trustBarClaims`.
- Houzz says "Bonded & Insured" and 17 years; their own site says insured
  and 20+. We went with their site.
- Chat: the assistant on every demo (and on morebookednow.com, which
  falls back to canned answers) was failing at OpenAI. The chat route now
  returns OpenAI's status and error code as `upstream` in its 502 response,
  readable in the browser's network tab.
