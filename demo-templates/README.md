# Demo templates

One folder per template (`detailing`, `pressure-washing`, `cleaning`, `landscaping`, `contractor`), each with its
`template.html` and a README listing its data. Stored sites render from them at request time (`lib/detailing-page.ts`).

## The preview's offer (every template)

Every stored site is a preview for the business that replied, and carries the same offer for its owner
(`lib/offer.ts`):

- The banner: "Preview website made for <Business> by MoreBookedNow" (to `/about-us`, who we are) and a green
  **Make it live · $99/mo** button (to `/<slug>/live`, the offer page).
- The locked pages' "See what's included" and the chat's "Get it running on my site" open the same offer page.
- The estimate form on a preview answers the owner: "This is how your customers' requests will reach you,
  straight to your phone."
- Taps on Make it live, Start now and Ask me a question go into the site's visit log (`cta:make-live`,
  `cta:start-now`, `cta:ask`), with the scrolls and estimate taps.

On the home page the gallery (with any `gallery.pairs`, before / after) and the reviews come right after the
hero, inside the first phone screens. On phones the chat bubble is smaller and tucked into the corner.

After payment (`/welcome`): the site goes live within 48 hours on `<slug without dashes>.morebookednow.com` (add it to
`own-domains.json` and the Vercel project's domains, as for domingotreeservice). The form asks whether they have a domain
and where it is registered (GoDaddy, Namecheap, Squarespace, Wix, other, don't know), then shows that registrar's one
step (delegate or shared access, inviting `DELEGATE_EMAIL`, else `OWNER_EMAIL`; never a password) and emails it to them.

Vercel variables: `STRIPE_PAYMENT_LINK` (the $99/month Payment Link; the slug goes with it as
`client_reference_id`; its "after payment" URL should be `https://demo.morebookednow.com/welcome?session_id={CHECKOUT_SESSION_ID}`; the welcome page knows the site from the Start now tap in the same browser, and the session id ties the answers to the payment), and the lead
email ones (`RESEND_API_KEY`, `LEADS_FROM`, `OWNER_EMAIL`) for the question and new-customer forms.
