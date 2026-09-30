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
| Desktop hero falls back to `gallery[0]`, a hotlinked photo | Set `heroImageWide` to a hosted copy of their best landscape photo | Covered by copying photos to blob storage; pick the widest landscape photo |

## Log

### ducks-tree-and-stump-service-aurora (2026-09-30)

Carlos Garcia, jcgm@duckstree.com, said yes to a demo. Their site is
duckstree.com, Aurora IL.

- Logo: their wide wordmark from
  `duckstree.com/wp-content/uploads/2023/03/Ducks-Tree-Stump-Service-Logo-2_395x75.png`,
  hosted as `logo.png`, `logoWide: true`.
- Desktop hero: their photo `2019/09/Limb-less-Tree.jpg` (climber on a
  limbed trunk), hosted as `hero-wide.webp`.
- Phone hero: the generated one, re-hosted smaller as `hero.webp` (the
  original was a 2.5 MB PNG).
- Still to check with the owner before sending: "Licensed & insured",
  "24/7 emergency service", "11+ years in business" and the "Land & Lot
  Clearing" card are not confirmed from their site.
