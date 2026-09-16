import {
  IconArrowUpRight,
  IconCheck,
  IconChevronDown,
  IconClock,
  IconExternalLink,
  IconLock,
  IconMapPin,
  IconPhone,
  IconShieldCheck
} from "@tabler/icons-react";
import { Avatar, GoogleG, GoogleStars } from "@/components/GoogleReview";
import { HeroPanel } from "@/components/HeroPanel";
import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";
import { demoCopy, marketingUrl } from "@/lib/demo-copy";
import { reviewsHref, type SiteConfig } from "@/lib/site-config";

/*
 * The second design: editorial rather than brochure.
 *
 * Large type, a lot of air, photographs in rounded frames instead of full
 * bleeds with text over them, hairlines instead of card borders, numbered
 * sections. It renders from the same SiteConfig as the first template, so a
 * demo built for one can be shown in the other without regenerating
 * anything. Only the home page exists here; every link is an anchor.
 */

type Props = { config: SiteConfig };

const wrap = "mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-10";

/** "01 — Services": the running number that ties the sections together. */
function Eyebrow({ n, children }: { n: string; children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.22em] text-moss">
      <span className="tabular-nums text-ink/40">{n}</span>
      <span className="h-px w-6 bg-ink/20" aria-hidden="true" />
      {children}
    </p>
  );
}

function Heading({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <h2
      className={`mt-4 font-display text-[34px] font-semibold leading-[1.05] tracking-[-0.03em] text-ink sm:text-[44px] lg:text-[56px] ${className}`}
    >
      {children}
    </h2>
  );
}

/* ------------------------------------------------------------------ */
/* Hero                                                                  */
/* ------------------------------------------------------------------ */

export function ModernHero({ config }: Props) {
  const summary = config.reviewSummary;
  const headline = config.heroHeadline ?? `${config.city} tree removal and trimming, done right and cleaned up.`;
  const subline =
    config.heroSubline ??
    "Removal, pruning, trimming, and stump grinding handled by a local crew that cleans up when the work is done.";
  const trust = config.heroTrustItems ?? ["Free estimates", "Cleanup included", "Local crew"];
  const allDay = /24/.test(config.responseNote ?? "");

  // Same rule as the first design: the generated hero is portrait and made
  // for a phone. A laptop gets a landscape photo instead.
  const wide = config.heroImageWide || config.gallery?.[0] || config.aboutImage || config.heroImage;
  const place = [config.city, config.stateAbbr].filter(Boolean).join(", ");

  return (
    <section className="bg-bone pb-10 pt-8 sm:pb-16 sm:pt-12 lg:pb-24 lg:pt-16">
      <div className={`${wrap} grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-14`}>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            {summary && (
              <span className="inline-flex h-9 items-center gap-2 rounded-full bg-white pl-2.5 pr-3.5 text-[13px] font-semibold text-ink ring-1 ring-ink/10">
                <GoogleG size={15} />
                <span className="tabular-nums">{summary.rating}</span>
                <GoogleStars rating={Number(summary.rating)} size={12} />
                <span className="text-ink/55">{summary.count} reviews</span>
              </span>
            )}
            <span className="inline-flex h-9 items-center gap-1.5 rounded-full bg-ink/[0.06] px-3.5 text-[13px] font-semibold text-ink/75">
              <IconMapPin size={14} stroke={2.2} aria-hidden="true" />
              {place}
            </span>
            {allDay && (
              <span className="inline-flex h-9 items-center gap-1.5 rounded-full bg-ink/[0.06] px-3.5 text-[13px] font-semibold text-ink/75">
                <IconClock size={14} stroke={2.2} aria-hidden="true" />
                Open 24/7
              </span>
            )}
          </div>

          <h1 className="mt-6 font-display text-[42px] font-semibold leading-[1.0] tracking-[-0.035em] text-ink sm:text-[60px] lg:text-[72px] xl:text-[82px]">
            {headline}
          </h1>
          <p className="mt-6 max-w-xl text-[17px] leading-7 text-slate sm:text-lg sm:leading-8">{subline}</p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href="#quote"
              data-demo-cta="hero-quote"
              className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-signal px-7 text-base font-bold text-ink transition hover:bg-signal-2"
            >
              Get a free estimate
              <IconArrowUpRight size={19} stroke={2.4} aria-hidden="true" />
            </a>
            {config.phone && (
              <a
                href={`tel:${config.phone}`}
                className="inline-flex h-14 items-center justify-center gap-2 rounded-full border border-ink/15 px-7 text-base font-bold text-ink transition hover:border-ink/40"
              >
                <IconPhone size={19} stroke={2.2} aria-hidden="true" />
                {config.phone}
              </a>
            )}
          </div>

          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2.5 text-[14.5px] font-semibold text-ink/75">
            {trust.map((item) => (
              <li key={item} className="flex items-center gap-2">
                <IconCheck size={16} stroke={2.8} className="text-moss" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative">
          {/* Portrait on a phone, where the generated photo was made for; landscape on a laptop. */}
          <div className="overflow-hidden rounded-[28px] bg-bone-2 shadow-[0_30px_80px_rgba(20,23,26,0.18)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={config.heroImage}
              alt={`${config.companyName} crew at work`}
              className="aspect-[4/5] w-full object-cover sm:aspect-[4/3] lg:hidden"
              referrerPolicy="no-referrer"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={wide}
              alt={`${config.companyName} crew at work`}
              className="hidden aspect-[4/5] w-full object-cover lg:block xl:aspect-[5/6]"
              referrerPolicy="no-referrer"
            />
          </div>

          {summary && (
            <div className="absolute -bottom-5 left-4 flex items-center gap-4 rounded-2xl bg-white p-4 pr-5 shadow-[0_18px_40px_rgba(20,23,26,0.16)] ring-1 ring-ink/8 sm:-bottom-6 sm:left-6">
              <span className="font-display text-4xl font-semibold leading-none tracking-[-0.03em] text-ink">{summary.rating}</span>
              <span className="grid gap-1">
                <GoogleStars rating={Number(summary.rating)} size={15} />
                <span className="flex items-center gap-1.5 text-[13px] font-semibold text-ink/60">
                  <GoogleG size={13} />
                  {summary.count} Google reviews
                </span>
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Numbers                                                               */
/* ------------------------------------------------------------------ */

/**
 * Four figures, only ever real ones. A rating we pulled, a count we pulled,
 * hours from the listing, the number of places they work — never a "500+
 * happy customers" nobody counted.
 */
export function ModernNumbers({ config }: Props) {
  const items: { value: string; label: string }[] = [];
  const summary = config.reviewSummary;
  if (summary) items.push({ value: summary.rating, label: "Google rating" });
  if (summary) items.push({ value: summary.count, label: "Google reviews" });
  if (/24/.test(config.responseNote ?? "")) items.push({ value: "24/7", label: "Emergency response" });
  if (config.founded) items.push({ value: `${Math.max(1, new Date().getFullYear() - Number(config.founded))}+`, label: "Years in the trade" });
  items.push({ value: "Free", label: "Written estimates" });
  if (config.serviceAreas.length > 2) items.push({ value: `${config.serviceAreas.length}`, label: "Areas served" });

  const shown = items.slice(0, 4);
  if (shown.length < 2) return null;

  return (
    <section className="bg-bone pb-10 sm:pb-14 lg:pb-20">
      <div className={wrap}>
        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl bg-ink/10 ring-1 ring-ink/10 lg:grid-cols-4">
          {shown.map((item) => (
            <div key={item.label} className="bg-bone px-6 py-6 sm:px-8 sm:py-8">
              <dd className="font-display text-[40px] font-semibold leading-none tracking-[-0.035em] text-ink sm:text-5xl">
                {item.value}
              </dd>
              <dt className="mt-2.5 text-[13px] font-semibold uppercase tracking-[0.14em] text-slate">{item.label}</dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Services                                                              */
/* ------------------------------------------------------------------ */

/**
 * Three services sit as three equal columns. From four up, the first card
 * runs wide and the last stretches to close whatever gap the count leaves,
 * so the grid always ends on a full row instead of a hole.
 */
function spanFor(i: number, n: number): string {
  if (n <= 3) return "";
  if (i === 0) return "lg:col-span-2";
  if (i === n - 1) {
    const leftover = (n - 2) % 3;
    if (leftover === 1) return "lg:col-span-3";
    if (leftover === 2) return "lg:col-span-2";
  }
  return "";
}

export function ModernServices({ config }: Props) {
  const cards = config.serviceCards;
  if (cards.length === 0) return null;

  return (
    <section id="services" className="scroll-mt-32 bg-bone py-14 sm:py-20 lg:py-24">
      <div className={wrap}>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Eyebrow n="01">Services</Eyebrow>
            <Heading>What we do.</Heading>
          </div>
          <p className="max-w-md text-[15px] leading-7 text-slate lg:pb-2">
            Every job is quoted in writing before we start, and the yard is cleaned before we leave.
          </p>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-3 lg:gap-5">
          {cards.map((card, i) => {
            const wideCard = spanFor(i, cards.length) !== "";
            return (
              <a
                key={card.title}
                href="#quote"
                className={`group flex flex-col overflow-hidden rounded-3xl bg-white ring-1 ring-ink/10 transition hover:-translate-y-0.5 hover:shadow-[0_24px_60px_rgba(20,23,26,0.12)] ${spanFor(i, cards.length)} ${
                  wideCard ? "lg:flex-row" : ""
                }`}
              >
                <div className={`relative overflow-hidden bg-bone-2 ${wideCard ? "aspect-[16/10] lg:aspect-auto lg:w-1/2" : "aspect-[16/10]"}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={card.image}
                    alt={card.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className={`flex flex-1 flex-col p-6 sm:p-7 ${wideCard ? "lg:p-9" : ""}`}>
                  <div className="flex items-start justify-between gap-4">
                    <h3
                      className={`font-display font-semibold leading-[1.1] tracking-[-0.02em] text-ink ${
                        wideCard ? "text-2xl sm:text-3xl" : "text-xl sm:text-2xl"
                      }`}
                    >
                      {card.title}
                    </h3>
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink/[0.06] text-ink transition group-hover:bg-signal">
                      <IconArrowUpRight size={17} stroke={2.4} aria-hidden="true" />
                    </span>
                  </div>
                  <p className="mt-3 text-[15px] leading-7 text-slate">{card.description}</p>
                  {card.included.length > 0 && (
                    <ul className="mt-5 grid gap-2 border-t border-ink/10 pt-5 text-[14px] text-ink/75">
                      {card.included.slice(0, wideCard ? 4 : 3).map((item) => (
                        <li key={item} className="flex items-start gap-2.5">
                          <IconCheck size={15} stroke={2.8} className="mt-1 shrink-0 text-moss" aria-hidden="true" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                  <p className="mt-auto pt-5 text-[13px] font-bold uppercase tracking-[0.14em] text-ink/45">{card.price}</p>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Owner pitch (demo only)                                               */
/* ------------------------------------------------------------------ */

export function ModernOwnerPitch({ config, href }: Props & { href: string }) {
  if (!config.isDemo) return null;
  const c = demoCopy.afterServices;
  return (
    <section className="bg-bone pb-14 sm:pb-20 lg:pb-24">
      <div className={wrap}>
        <div className="grid gap-8 overflow-hidden rounded-3xl bg-ink px-6 py-8 text-bone sm:px-10 sm:py-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-14 lg:px-14 lg:py-16">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-signal">{c.eyebrow}</p>
            <h2 className="mt-4 font-display text-[30px] font-semibold leading-[1.08] tracking-[-0.03em] sm:text-4xl lg:text-[44px]">
              {c.title}
            </h2>
            <p className="mt-5 max-w-xl text-[15px] leading-7 text-bone/65 sm:text-base sm:leading-8">{c.body}</p>
          </div>
          <div>
            <ul className="grid gap-3">
              {c.points.map((point) => (
                <li key={point} className="flex items-start gap-3 rounded-2xl bg-ink-2 px-4 py-3.5 text-[15px] leading-6 text-bone/90">
                  <IconCheck size={17} stroke={2.6} className="mt-0.5 shrink-0 text-signal" aria-hidden="true" />
                  {point}
                </li>
              ))}
            </ul>
            <a
              href={href}
              data-demo-cta="after-services"
              className="mt-5 inline-flex h-14 w-full items-center justify-center gap-2 rounded-full bg-signal text-base font-bold text-ink transition hover:bg-signal-2"
            >
              {c.cta}
              <IconArrowUpRight size={19} stroke={2.4} aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Process                                                               */
/* ------------------------------------------------------------------ */

const DEFAULT_PROCESS = [
  { title: "Tell us what is going on", text: "Send the address, a few details and photos if you have them. We will tell you the safest next step." },
  { title: "Get a written price", text: "We come out, look at the tree and the access, and put the number in writing. No surprises on the day." },
  { title: "The crew does the work", text: "Sections lowered safely, limbs chipped, debris hauled. The driveway is blown off before we leave." }
];

export function ModernProcess({ config }: Props) {
  const steps = config.process?.length ? config.process : DEFAULT_PROCESS;
  return (
    <section className="border-y border-ink/10 bg-bone-2 py-14 sm:py-20 lg:py-24">
      <div className={wrap}>
        <Eyebrow n="02">How it works</Eyebrow>
        <Heading>From the first call to a clean yard.</Heading>
        <ol className="mt-10 grid gap-px overflow-hidden rounded-3xl bg-ink/10 ring-1 ring-ink/10 md:grid-cols-2 lg:grid-cols-4">
          {steps.slice(0, 4).map((step, i) => (
            <li key={step.title} className="bg-bone p-6 sm:p-8">
              <span className="font-display text-5xl font-semibold leading-none tracking-[-0.04em] text-ink/15">0{i + 1}</span>
              <h3 className="mt-6 font-display text-xl font-semibold leading-tight tracking-[-0.02em] text-ink">{step.title}</h3>
              <p className="mt-3 text-[15px] leading-7 text-slate">{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Work                                                                  */
/* ------------------------------------------------------------------ */

/**
 * Their own photos when we have them, otherwise the before-and-after pairs.
 * The same rule as the first design: no captions on pulled photos, because
 * we do not know what is in them.
 */
export function ModernWork({ config, lockHref }: Props & { lockHref: string }) {
  const photos = (config.gallery ?? []).slice(0, 5);
  const projects = config.projects ?? [];
  const hasGallery = photos.length >= 3;
  if (!hasGallery && projects.length === 0) return null;

  const shown = config.isDemo ? photos.slice(0, 4) : photos;
  const lockedTile = config.isDemo ? photos[4] ?? photos[0] : undefined;
  const more = Math.max(0, (config.galleryTotal ?? photos.length) - shown.length);

  return (
    <section id="work" className="scroll-mt-32 bg-bone py-14 sm:py-20 lg:py-24">
      <div className={wrap}>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Eyebrow n="03">Our work</Eyebrow>
            <Heading>{hasGallery ? "Real jobs, real yards." : "Before and after."}</Heading>
          </div>
          {hasGallery && config.listingUrl ? (
            <a
              href={config.listingUrl}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="inline-flex items-center gap-2 text-[15px] font-bold text-ink transition hover:text-moss lg:pb-2"
            >
              <GoogleG size={16} />
              More photos on Google
              <IconExternalLink size={16} stroke={2.2} aria-hidden="true" />
            </a>
          ) : (
            !hasGallery && <p className="max-w-md text-[15px] leading-7 text-slate lg:pb-2">{demoCopy.projects.sub}</p>
          )}
        </div>

        {hasGallery ? (
          <div className="mt-10 grid auto-rows-[160px] grid-cols-2 gap-3 sm:auto-rows-[200px] lg:grid-cols-4 lg:auto-rows-[230px] lg:gap-4">
            {shown.map((photo, i) => (
              <figure
                key={photo}
                className={`overflow-hidden rounded-2xl bg-bone-2 lg:rounded-3xl ${i === 0 ? "col-span-2 row-span-2" : ""}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo}
                  alt={`${config.companyName} tree work`}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover"
                />
              </figure>
            ))}
            {config.isDemo && lockedTile && (
              <a
                href={lockHref}
                data-demo-cta="gallery-lock"
                className="relative block overflow-hidden rounded-2xl bg-bone-2 lg:rounded-3xl"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={lockedTile}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="h-full w-full scale-105 object-cover blur-[6px]"
                />
                <span className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-ink/60 px-4 text-center">
                  <IconLock size={20} stroke={2} className="text-bone" aria-hidden="true" />
                  <span className="text-[13px] font-bold leading-5 text-bone">{demoCopy.galleryLock(more)}</span>
                </span>
              </a>
            )}
          </div>
        ) : (
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {projects.slice(0, 2).map((project) => (
              <figure key={project.title} className="overflow-hidden rounded-3xl bg-white ring-1 ring-ink/10">
                <div className="aspect-[4/3]">
                  <BeforeAfterSlider
                    beforeImage={project.beforeImage}
                    afterImage={project.afterImage}
                    alt={project.title}
                  />
                </div>
                <figcaption className="p-6">
                  <h3 className="font-display text-xl font-semibold tracking-[-0.02em] text-ink">{project.title}</h3>
                  <p className="mt-2 text-[15px] leading-7 text-slate">{project.after}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        )}

        {config.isDemo && hasGallery && (
          <p className="mt-6 text-sm leading-6 text-slate">{demoCopy.notes.gallery}</p>
        )}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Reviews                                                               */
/* ------------------------------------------------------------------ */

/** Past this a card becomes a column of text nobody reads. */
const MAX_REVIEW_CHARS = 420;

export function ModernReviews({ config }: Props) {
  const all = config.reviews ?? [];
  const short = all.filter((r) => (r.text ?? "").length <= MAX_REVIEW_CHARS);
  const reviews = (short.length > 0 ? short : [...all].sort((a, b) => a.text.length - b.text.length)).slice(0, 6);
  const summary = config.reviewSummary;
  const fromGoogle = Boolean(config.reviewsUrl);
  const href = reviewsHref(config);
  const hasReviews = reviews.length > 0;

  return (
    <section id="reviews" className="scroll-mt-32 bg-ink py-14 text-bone sm:py-20 lg:py-24">
      <div className={wrap}>
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <p className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.22em] text-signal">
              <span className="tabular-nums text-bone/40">04</span>
              <span className="h-px w-6 bg-bone/20" aria-hidden="true" />
              Reviews
            </p>
            <h2 className="mt-4 font-display text-[34px] font-semibold leading-[1.05] tracking-[-0.03em] sm:text-[44px] lg:text-[56px]">
              {hasReviews ? `What ${config.city} homeowners say.` : demoCopy.reviews.emptyTitle}
            </h2>
          </div>
          {summary && fromGoogle ? (
            <div className="flex flex-wrap items-center gap-5 lg:justify-end">
              <span className="font-display text-6xl font-semibold leading-none tracking-[-0.04em]">{summary.rating}</span>
              <span className="grid gap-1.5">
                <GoogleStars rating={Number(summary.rating)} size={18} />
                <span className="flex items-center gap-2 text-sm text-bone/65">
                  <GoogleG size={15} />
                  {summary.count} Google reviews
                </span>
                {href && (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="inline-flex items-center gap-1.5 text-sm font-bold text-bone transition hover:text-signal"
                  >
                    Read them all on Google
                    <IconExternalLink size={15} stroke={2.2} aria-hidden="true" />
                  </a>
                )}
              </span>
            </div>
          ) : (
            !hasReviews && <p className="max-w-md text-[15px] leading-7 text-bone/60">{demoCopy.reviews.emptyBody}</p>
          )}
        </div>

        {hasReviews && (
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-5">
            {reviews.map((review, i) => (
              <article
                key={`${review.name}-${i}`}
                className={`flex flex-col rounded-3xl bg-white p-6 text-ink ${i >= 3 ? "hidden lg:flex" : ""}`}
              >
                <div className="flex items-center gap-3">
                  <Avatar name={review.name} src={review.avatar} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[15px] font-bold leading-tight">{review.name}</p>
                    <div className="mt-1 flex items-center gap-2">
                      <GoogleStars rating={review.rating} size={13} />
                      {review.date && <span className="text-xs text-ink/50">{review.date}</span>}
                    </div>
                  </div>
                  {fromGoogle && <GoogleG size={18} className="shrink-0" />}
                </div>
                <p className="mt-4 flex-1 text-[15px] leading-7 text-ink/80">{review.text}</p>
                {(review.photos?.length ?? 0) > 0 && (
                  <div className="mt-4 flex gap-2">
                    {review.photos!.slice(0, 3).map((photo) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img key={photo} src={photo} alt="" loading="lazy" referrerPolicy="no-referrer" className="h-16 w-16 rounded-xl object-cover" />
                    ))}
                  </div>
                )}
              </article>
            ))}
          </div>
        )}

        {config.isDemo && fromGoogle && hasReviews && (
          <p className="mt-6 text-sm leading-6 text-bone/50">{demoCopy.notes.reviews}</p>
        )}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Areas                                                                 */
/* ------------------------------------------------------------------ */

export function ModernAreas({ config }: Props) {
  const place = [config.city, config.stateAbbr].filter(Boolean).join(", ");
  return (
    <section id="areas" className="scroll-mt-32 bg-bone py-14 sm:py-20 lg:py-24">
      <div className={`${wrap} grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-14`}>
        <div className="overflow-hidden rounded-3xl bg-bone-2 ring-1 ring-ink/10">
          <iframe
            title={`Map of ${place} service area`}
            src={`https://maps.google.com/maps?q=${encodeURIComponent(place)}&z=11&output=embed`}
            className="aspect-[4/3] w-full grayscale-[35%] lg:aspect-[5/4]"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
        <div>
          <Eyebrow n="05">Service area</Eyebrow>
          <Heading>Serving {config.city} and the surrounding area.</Heading>
          <p className="mt-5 max-w-lg text-[15px] leading-7 text-slate sm:text-base sm:leading-8">
            Where our crews work most weeks. Outside these? Call and we will confirm availability before booking an estimate.
          </p>
          <ul className="mt-7 flex flex-wrap gap-2">
            {config.serviceAreas.map((area) => (
              <li
                key={area}
                className="inline-flex h-10 items-center gap-1.5 rounded-full bg-white px-4 text-[14px] font-semibold text-ink ring-1 ring-ink/10"
              >
                <IconMapPin size={14} stroke={2.2} className="text-moss" aria-hidden="true" />
                {area}
              </li>
            ))}
          </ul>
          {config.phone && (
            <a
              href={`tel:${config.phone}`}
              className="mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-ink px-6 text-[15px] font-bold text-bone transition hover:bg-ink-2"
            >
              <IconPhone size={17} stroke={2.2} aria-hidden="true" />
              Call {config.phone}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* FAQ                                                                   */
/* ------------------------------------------------------------------ */

export function ModernFaq({ config }: Props) {
  const faqs = config.faqs ?? [];
  if (faqs.length === 0) return null;
  return (
    <section id="faq" className="scroll-mt-32 border-t border-ink/10 bg-bone py-14 sm:py-20 lg:py-24">
      <div className={`${wrap} grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14`}>
        <div>
          <Eyebrow n="06">FAQ</Eyebrow>
          <Heading>Questions homeowners ask.</Heading>
        </div>
        <div className="divide-y divide-ink/10 border-y border-ink/10">
          {faqs.map((faq, i) => (
            <details key={faq.question} open={i === 0} className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 font-display text-lg font-semibold tracking-[-0.01em] text-ink sm:text-xl">
                {faq.question}
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink/[0.06] transition group-open:bg-signal">
                  <IconChevronDown size={18} stroke={2.4} className="chev transition-transform" aria-hidden="true" />
                </span>
              </summary>
              <p className="pb-6 pr-12 text-[15px] leading-7 text-slate">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Quote                                                                 */
/* ------------------------------------------------------------------ */

export function ModernQuote({ config, slug, lockHref }: Props & { slug: string; lockHref: string }) {
  return (
    <section id="quote" className="scroll-mt-32 bg-bone-2 py-14 sm:py-20 lg:py-24">
      <div className={`${wrap} grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-16`}>
        <div>
          <Eyebrow n="07">Free estimate</Eyebrow>
          <Heading>Tell us about the tree. We&apos;ll tell you the price.</Heading>
          <p className="mt-5 max-w-md text-[15px] leading-7 text-slate sm:text-base sm:leading-8">
            Ask a question or send a few details. A real person from {config.companyName} replies the same day.
          </p>
          <ul className="mt-7 grid gap-3 text-[15px] font-semibold text-ink/80">
            {[
              { icon: IconShieldCheck, text: "Written price before any work starts" },
              { icon: IconClock, text: "Same-day reply, most days within the hour" },
              { icon: IconCheck, text: "No pressure, no obligation" }
            ].map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white ring-1 ring-ink/10">
                  <Icon size={16} stroke={2.4} className="text-moss" aria-hidden="true" />
                </span>
                {text}
              </li>
            ))}
          </ul>
          {config.phone && (
            <a
              href={`tel:${config.phone}`}
              className="mt-8 inline-flex items-center gap-3 font-display text-3xl font-semibold tracking-[-0.03em] text-ink transition hover:text-moss sm:text-4xl"
            >
              <IconPhone size={28} stroke={2.2} aria-hidden="true" />
              {config.phone}
            </a>
          )}
        </div>
        {/* Tall enough for the whole form: a form that scrolls inside a page
            that also scrolls is two thumbs fighting, and the button that
            matters was the part below the inner fold. */}
        <div className="h-[780px] overflow-hidden rounded-3xl shadow-[0_30px_80px_rgba(20,23,26,0.16)] sm:h-[700px]">
          <HeroPanel config={config} slug={slug} lockHref={lockHref} initialTab="form" />
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Footer                                                                */
/* ------------------------------------------------------------------ */

export function ModernFooter({ config }: Props) {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-ink/10 bg-bone py-10 sm:py-12">
      <div className={`${wrap} flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between`}>
        <div className="max-w-sm">
          <p className="font-display text-xl font-bold tracking-[-0.02em] text-ink">{config.companyName}</p>
          <p className="mt-2 text-[15px] leading-7 text-slate">{config.tagline}</p>
          <div className="mt-4 flex flex-col gap-1 text-[15px] font-semibold text-ink">
            {config.phone && <a href={`tel:${config.phone}`} className="hover:text-moss">{config.phone}</a>}
            {config.email && <a href={`mailto:${config.email}`} className="hover:text-moss">{config.email}</a>}
          </div>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:gap-14">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-ink/45">Sections</p>
            <ul className="mt-3 grid gap-1.5 text-[15px] font-semibold text-ink/75">
              {["Services", "Work", "Reviews", "Areas", "FAQ"].map((label) => (
                <li key={label}>
                  <a href={`#${label.toLowerCase()}`} className="hover:text-ink">{label}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-ink/45">Areas</p>
            <p className="mt-3 max-w-xs text-[15px] leading-7 text-ink/75">{config.serviceAreas.join(" · ")}</p>
          </div>
        </div>
      </div>
      <div className={`${wrap} mt-10 flex flex-col gap-2 border-t border-ink/10 pt-6 text-[13px] text-slate sm:flex-row sm:items-center sm:justify-between`}>
        <p>© {year} {config.companyName}. All rights reserved.</p>
        <a href={marketingUrl} className="font-semibold text-ink/60 transition hover:text-ink">Website by MoreBookedNow</a>
      </div>
    </footer>
  );
}
