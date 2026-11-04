/**
 * The pages of a full stored site, for the landscaping template.
 *
 * A site whose data sets `pages: true` is a whole site, not one page: the
 * menu, the footer and every "Learn more" open real pages under its address
 * instead of the locked previews.
 *
 *   /<slug>                     home
 *   /<slug>/about               about, why us, reviews
 *   /<slug>/services            every service, how it works, FAQ
 *   /<slug>/services/<value>    one service (services.items[].page), its photos, the quote form
 *   /<slug>/gallery             every work photo (gallery.photos, then gallery.more)
 *   /<slug>/reviews             every review, why us
 *   /<slug>/service-areas       the towns (area.groups or area.cities), map and hours
 *   /<slug>/faq                 the FAQ
 *   /<slug>/contact             the quote form, map, hours and phones
 *
 * `withView(data, path)` returns the data the template renders for that path,
 * with `view` (which sections show, the page's heading, where quote links
 * go) and `pages` (the links), or null when the site has no such page.
 * A site without `pages: true` only has its home page, rendered as before.
 */

const HEADS = {
  about: ["About us", (d) => d.about?.paras?.[0] ?? ""],
  services: ["Our services", (d) => d.services?.intro ?? ""],
  gallery: ["Our work", (d) => d.gallery?.intro ?? ""],
  reviews: ["Reviews", (d) => d.reviews?.intro ?? ""],
  "service-areas": ["Service areas", (d) => d.area?.text ?? d.quote?.intro ?? ""],
  faq: ["Frequently asked questions", (d) => d.faq?.intro ?? ""],
  contact: ["Contact us", (d) => d.quote?.intro ?? ""]
};

export function withView(data, path = "") {
  const p = String(path ?? "").replace(/^\/+|\/+$/g, "");
  const d = { ...data };
  const home = { home: true, qtop: Boolean(d.quote?.top), services: true, how: true, about: true, work: true, reviews: true, why: true, band: true, faq: true, contact: true, q: "#quote" };
  if (!data.pages) {
    if (p) return null;
    delete d.pages;
    d.view = home;
    return d;
  }
  const base = `/${d.slug}`;
  const pages = { home: base, about: `${base}/about`, services: `${base}/services`, gallery: `${base}/gallery`, reviews: `${base}/reviews`, areas: `${base}/service-areas`, faq: `${base}/faq`, contact: `${base}/contact` };
  d.pages = pages;
  if (!p) {
    d.view = home;
    return d;
  }
  const heads = d.pageHeads ?? {};
  const head = (key, title, lead) => ({
    key,
    title: heads[key]?.title ?? title,
    lead: heads[key]?.lead ?? lead,
    photo: heads[key]?.photo ?? d.images?.hero,
    crumb: heads[key]?.crumb ?? title
  });
  const [first, second, ...rest] = p.split("/");
  if (rest.length) return null;
  if (first === "services" && second) {
    const item = (d.services?.items ?? []).find((s) => s.value === second);
    if (!item) return null;
    const pg = item.page ?? {};
    const service = {
      ...item,
      h2: pg.h2 ?? item.title,
      paras: pg.paras?.length ? pg.paras : [item.text],
      points: pg.points ?? [],
      photos: pg.photos ?? [],
      photo: pg.photo ?? (item.photo ? { file: item.photo, alt: item.photoAlt, width: "1200", height: "900" } : null)
    };
    const h = { key: "service", title: item.title, lead: pg.lead ?? item.text, photo: pg.hero ?? service.photo ?? d.images?.hero, crumb: item.title };
    d.view = { page: h, parent: { title: "Services", href: pages.services }, service, qtop: true, services: true, grid: true, others: true, faq: true, q: "#quote" };
    return d;
  }
  if (second !== undefined) return null;
  const known = HEADS[first];
  if (!known) return null;
  const page = head(first, known[0], known[1](d));
  const views = {
    about: { about: true, why: true, reviews: true, band: true },
    services: { services: true, grid: true, how: true, band: true, faq: true },
    gallery: { work: true, all: true, band: true },
    reviews: { reviews: true, all: true, why: true, band: true },
    "service-areas": { areas: true, contact: true },
    faq: { faq: true, band: true },
    contact: { qtop: true, contact: true }
  };
  const q = first === "contact" ? "#quote" : pages.contact;
  d.view = { page, ...views[first], q };
  return d;
}

/** Every path a site has, for checking that each one renders before it is stored. */
export function sitePaths(data) {
  if (!data?.pages) return [""];
  return ["", ...Object.keys(HEADS), ...(data.services?.items ?? []).map((s) => `services/${s.value}`)];
}
