import Image from "next/image";
import { business } from "@/lib/business";
import { Reveal } from "@/components/Reveal";
import { GoogleG, GoogleRatingSummary, GoogleReviewCard, GoogleStars } from "@/components/GoogleReview";
import { OwnerNote } from "@/components/OwnerNote";
import {
  IconAlertTriangle,
  IconChevronDown,
  IconClock,
  IconStar,
  IconCircleCheckFilled,
  IconCheck,
  IconPhoneCall,
  IconClipboardCheck,
  IconCalendarCheck,
  IconSparkles,
  IconArrowRight,
  IconStarFilled,
  IconMapPin,
  IconUsers,
  IconShieldCheck,
  IconHome,
  IconMail
} from "@tabler/icons-react";
import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";
import { QuoteForm } from "@/components/QuoteForm";
import { HeroPanel } from "@/components/HeroPanel";
import { OpenPanelButton } from "@/components/OpenPanelButton";
import { defaultLinks, initials, type SiteConfig, type SiteLinks } from "@/lib/site-config";
import { findArea, slugify } from "@/lib/areas";
import { demoCopy } from "@/lib/demo-copy";

type SectionProps = { config?: SiteConfig; links?: SiteLinks };

export function TreeCareServices({
  config = business,
  links = defaultLinks,
  compact = false
}: SectionProps & { compact?: boolean }) {
  return (
    <section id="services" className="scroll-mt-20 bg-tint px-3 py-5 sm:px-10 sm:pb-12 sm:pt-10 lg:px-16">
      <div className="mx-auto max-w-6xl text-center">
        <div className="mx-auto max-w-2xl">
          <Pill>Our Services</Pill>
          <h2 className="mt-5 text-[28px] font-bold leading-tight text-cream sm:text-4xl lg:text-[42px]">
            Tree services for {config.city} homes and properties.
          </h2>
        </div>
        <div className="mx-auto mt-4 max-w-xl">
          <p className="text-base leading-6 text-cream/65 sm:text-lg sm:leading-8">
            From routine trimming to emergency storm work, handled with the right equipment and the right crew.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {["Free estimates", "Cleanup included", "Local crew"].map((chip) => (
              <span
                key={chip}
                className="inline-flex items-center gap-1.5 rounded-full border border-forest-900/10 bg-night-2 px-3 py-1 text-[13px] font-semibold text-cream"
              >
                <IconCircleCheckFilled size={16} className="text-lime" aria-hidden="true" />
                {chip}
              </span>
            ))}
          </div>
        </div>
      </div>
      {/*
        Wrapped flex rather than a grid, so a partial last row centres itself.
        The form allows one to five services, and four cards in a three-column
        grid left the fourth stranded in the left column with two empty cells
        beside it — a hole big enough that the section below looked detached.
        The widths below reproduce the 2- and 3-column grid exactly (gap-5 is
        1.25rem), so a full row is pixel-identical to what it replaces.
      */}
      <Reveal className="mx-auto mt-8 flex max-w-6xl flex-wrap justify-center gap-5">
        {config.serviceCards.map((service) => (
          <article
            key={service.title}
            className="group flex w-full flex-col overflow-hidden rounded-[12px] border border-forest-900/10 bg-night-2 shadow-soft transition duration-300 hover:-translate-y-1 hover:border-lime/40 hover:shadow-[0_18px_44px_rgba(18,49,25,0.22)] md:w-[calc((100%-1.25rem)/2)] lg:w-[calc((100%-2.5rem)/3)]"
          >
            <div className="relative h-52 overflow-hidden bg-forest-900/8 sm:h-56">
              <div
                className="absolute inset-0 bg-cover bg-center transition duration-500 group-hover:scale-105"
                style={{ backgroundImage: `url(${service.image}), url(${config.heroImage})` }}
                aria-hidden="true"
              />
              <span className="absolute right-4 top-4 rounded-full bg-lime px-3.5 py-1.5 text-sm font-bold text-white shadow-md">
                {service.price}
              </span>
            </div>
            <div className={`flex flex-1 flex-col ${compact ? "p-5" : "p-6"}`}>
              <h3 className="flex items-center gap-2.5 text-[21px] font-bold leading-tight text-cream">
                <IconCircleCheckFilled size={20} className="shrink-0 text-lime" aria-hidden="true" />
                {service.title}
              </h3>
              <p className="mt-2.5 text-[15px] leading-7 text-cream/65">{service.description}</p>
              <div className={`mt-5 grid gap-2 ${compact ? "hidden" : ""}`}>
                {service.included.map((item) => (
                  <span key={item} className="flex items-start gap-2.5 text-sm leading-6 text-cream/65">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-forest-900/5 text-lime">
                      <IconCheck size={13} stroke={3} aria-hidden="true" />
                    </span>
                    <span>{item}</span>
                  </span>
                ))}
              </div>
              <div className={`mt-auto flex items-center justify-between border-t border-forest-900/8 ${compact ? "mt-4 pt-4" : "pt-5"}`}>
                <a
                  href={links.services}
                  className="mt-1 text-sm font-bold text-lime transition group-hover:text-cream"
                >
                  <span className="inline-flex items-center gap-1">
                    Learn more
                    <IconArrowRight
                      size={15}
                      stroke={2.5}
                      className="transition group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </span>
                </a>
                <a
                  href={links.quote}
                  className="mt-1 rounded-full bg-ember-500/10 px-3.5 py-1.5 text-sm font-bold text-ember-600 transition hover:bg-ember-500 hover:text-white"
                >
                  Get a quote
                </a>
              </div>
            </div>
          </article>
        ))}
      </Reveal>
    </section>
  );
}

const defaultWhyPoints = [
  { title: "Straight quotes, no surprises", text: "You get a clear price before any work starts, and that is the price you pay." },
  { title: "A crew that treats it like their own yard", text: "Careful around roofs, fences and power lines. Nothing rushed, nothing dropped where it should not be." },
  { title: "Cleaned up before we leave", text: "Branches chipped, logs hauled, lawn raked. You should not be able to tell we were there, except the tree is gone." }
];

/** Four proof points right under the hero: plain rows with a green icon tile, no cards. */
export function TrustBar({ config = business }: SectionProps) {
  const count = config.reviewSummary?.count;
  const items = [
    { icon: IconShieldCheck, label: "Licensed & insured" },
    { icon: IconClock, label: "24/7 emergency service" },
    count ? { icon: IconStar, label: `${count} Google reviews` } : { icon: IconStar, label: "Free estimates" },
    { icon: IconMapPin, label: `Local ${config.city} crew` }
  ];
  return (
    <section className="bg-night px-3 pb-1 pt-4 sm:px-10 sm:pb-2 lg:px-16">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-4">
        {items.map(({ icon: Icon, label }) => (
          <div
            key={label}
            className="flex items-center gap-3 overflow-hidden rounded-[10px] border border-forest-900/10 bg-night-2 py-3.5 pr-3 shadow-soft"
          >
            {/* A green rule down the left edge gives each row a spine, so four
                identical tiles do not read as a plain list. */}
            <span className="h-11 w-[3px] shrink-0 rounded-r bg-lime" aria-hidden="true" />
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-forest-50 text-forest-600">
              <Icon size={21} stroke={1.9} aria-hidden="true" />
            </span>
            <span className="text-[14px] font-bold leading-snug text-forest-900">{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export function AboutUs({ config = business }: SectionProps) {
  const summary = config.reviewSummary;
  const years = config.founded ? Math.max(1, new Date().getFullYear() - Number(config.founded)) : null;
  const stats: { value: string; label: string }[] = [
    ...(summary ? [{ value: `${summary.rating}★`, label: `${summary.count} ${summary.source}` }] : []),
    ...(years ? [{ value: `${years}+`, label: "Years in business" }] : []),
    { value: "Free", label: "Written estimates" },
    { value: "100%", label: "Cleanup on every job" }
  ].slice(0, 4);

  return (
    <section id="about" className="scroll-mt-20 bg-night px-3 py-5 sm:px-10 sm:py-10 lg:px-16">
      <div className="mx-auto mb-8 max-w-2xl text-center">
        <Pill>Why Us</Pill>
        <h2 className="mt-5 text-[26px] font-bold leading-tight text-cream sm:text-4xl lg:text-[42px]">
          Why {config.city} homeowners call {config.companyName}.
        </h2>
      </div>
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:gap-12">
        <div>
          <div className="grid gap-4">
            {defaultWhyPoints.map((point) => (
              <div key={point.title} className="flex gap-3.5">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-forest-900 text-white">
                  <IconCheck size={16} stroke={3} aria-hidden="true" />
                </span>
                <div>
                  <h3 className="text-base font-bold leading-snug text-cream">{point.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-cream/65">{point.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div
            className="h-[260px] rounded-[12px] bg-cover bg-center shadow-soft sm:h-[380px]"
            style={{ backgroundImage: `url(${config.aboutImage})` }}
            role="img"
            aria-label={`${config.companyName} crew at work`}
          />
          <div className="mt-4 grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-[10px] border border-forest-900/10 bg-night-2 px-3 py-3 text-center shadow-soft">
                <div className="text-xl font-extrabold leading-none text-cream sm:text-2xl">{stat.value}</div>
                <div className="mt-1.5 text-[12px] font-semibold leading-tight text-cream/55">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/** One icon per process step, in order: call → estimate → schedule → cleanup. */
const STEP_ICONS = [IconPhoneCall, IconClipboardCheck, IconCalendarCheck, IconSparkles];

export function HowItWorks({ config = business }: SectionProps) {
  const steps = config.process ?? [];
  if (steps.length === 0) return null;

  return (
    <section id="process" className="scroll-mt-20 bg-tint px-3 py-5 sm:px-10 sm:py-10 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <Pill>How It Works</Pill>
          <h2 className="mt-5 text-[26px] font-bold leading-tight text-cream sm:text-4xl lg:text-[42px]">
            From first call to clean yard.
          </h2>
          <p className="mt-4 text-base leading-6 text-cream/65 sm:text-lg sm:leading-8">
            A simple, no-pressure process so you know what is happening before any work starts.
          </p>
        </div>
      </div>
      <div className="mx-auto mt-8 grid max-w-6xl gap-4 md:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, index) => (
          <article
            key={step.title}
            className="group relative overflow-hidden rounded-[12px] border border-forest-900/10 bg-night-2 p-5 shadow-soft transition duration-300 hover:-translate-y-1 sm:p-6 hover:border-lime/40"
          >
            <div className="absolute right-5 top-5 text-4xl font-bold leading-none text-cream/[0.06]">
              0{index + 1}
            </div>
            <div className="flex items-center gap-2.5">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-forest-900 text-white">
                {(() => {
                  const StepIcon = STEP_ICONS[index % STEP_ICONS.length];
                  return <StepIcon size={21} stroke={1.9} aria-hidden="true" />;
                })()}
              </span>
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-forest-900/5 text-xs font-bold text-lime">
                {index + 1}
              </span>
            </div>
            <h3 className="mt-6 text-lg font-bold leading-snug text-cream">{step.title}</h3>
            <p className="mt-3 text-sm leading-7 text-cream/65">{step.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function Reviews({ config = business }: SectionProps) {
  const reviews = config.reviews ?? [];
  const summary = config.reviewSummary;
  const hasReviews = reviews.length > 0;
  // Only reviews actually pulled from a listing carry a link back to it, so
  // this is the one safe signal that Google's branding may be shown.
  const fromGoogle = Boolean(config.reviewsUrl);

  return (
    <section id="reviews" className="scroll-mt-20 bg-tint px-3 py-5 sm:px-10 sm:py-10 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <Pill>Reviews</Pill>
          <h2 className="mt-5 text-[26px] font-bold leading-tight text-cream sm:text-4xl lg:text-[42px]">
            {hasReviews ? `What ${config.city} homeowners say.` : demoCopy.reviews.emptyTitle}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-6 text-cream/65 sm:text-lg sm:leading-8">
            {hasReviews
              ? "Good tree work is not just the cut. It is clear communication, careful equipment, and a yard left in order."
              : demoCopy.reviews.emptyBody}
          </p>

          {summary &&
            (fromGoogle ? (
              <GoogleRatingSummary summary={summary} reviewsUrl={config.reviewsUrl} className="mt-7 text-left" />
            ) : (
              <div className="mt-7 flex items-center gap-4 rounded-[12px] border border-forest-900/10 bg-night p-5">
                <div className="text-3xl font-bold text-cream">{summary.rating}</div>
                <div>
                  <div className="flex gap-0.5 text-ember-500" aria-hidden="true">
                    {Array.from({ length: 5 }, (_, i) => (
                      <IconStarFilled key={i} size={14} />
                    ))}
                  </div>
                  <div className="mt-1 text-sm font-semibold text-cream/65">
                    {summary.count} verified {summary.source}
                  </div>
                </div>
              </div>
            ))}

          {hasReviews ? (
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {reviews.slice(0, 3).map((review, index) =>
                fromGoogle ? (
                  <GoogleReviewCard key={`${review.name}-${index}`} review={review} />
                ) : (
                  <article
                    key={`${review.name}-${index}`}
                    className="rounded-[12px] border border-forest-900/10 bg-night-2 p-5 shadow-soft"
                  >
                    <div className="flex gap-0.5 text-ember-500" aria-hidden="true">
                      {Array.from({ length: Math.max(1, Math.min(5, review.rating)) }, (_, i) => (
                        <IconStarFilled key={i} size={13} />
                      ))}
                    </div>
                    <p className="mt-3 text-sm leading-7 text-cream/65">&quot;{review.text}&quot;</p>
                    <p className="mt-4 text-sm font-bold text-cream">{review.name}</p>
                  </article>
                )
              )}
              {fromGoogle && config.reviewsUrl && (
                <a
                  href={config.reviewsUrl}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1a73e8] transition hover:underline"
                >
                  Read all {config.reviewSummary?.count ?? ""} reviews on Google
                  <span aria-hidden="true">↗</span>
                </a>
              )}
              {config.isDemo && fromGoogle && <OwnerNote className="mt-1">{demoCopy.notes.reviews}</OwnerNote>}
            </div>
          ) : (
            <div className="mt-7 rounded-[12px] border border-dashed border-forest-900/20 bg-night p-6">
              <div className="text-sm font-bold tracking-[0.18em] text-cream/20" aria-hidden="true">
                ★★★★★
              </div>
              <div className="mt-4 grid gap-2.5" aria-hidden="true">
                <span className="block h-3 w-4/5 rounded-full bg-forest-900/8" />
                <span className="block h-3 w-full rounded-full bg-forest-900/8" />
                <span className="block h-3 w-2/3 rounded-full bg-forest-900/8" />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export function ServiceAreaMap({ config = business }: SectionProps) {
  const place = [config.city, config.stateAbbr].filter(Boolean).join(", ");
  return (
    <section className="bg-night px-3 py-5 sm:px-10 sm:py-10 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <div
          id="areas"
          className="scroll-mt-20 overflow-hidden rounded-[10px] lg:grid lg:grid-cols-[1.1fr_0.9fr] border border-forest-900/10 bg-forest-900 text-white shadow-soft"
        >
          <div className="relative h-[240px] w-full lg:h-full lg:min-h-[420px]">
            <iframe
              title={`Map of ${place} service area`}
              src={`https://maps.google.com/maps?q=${encodeURIComponent(place)}&z=11&output=embed`}
              className="absolute inset-0 h-full w-full grayscale-[15%]"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <div className="p-6">
            <Pill>Service Area</Pill>
            <h3 className="mt-5 text-[26px] font-bold leading-tight text-white sm:text-3xl">
              Serving {config.city} and nearby neighborhoods.
            </h3>
            <p className="mt-4 max-w-md text-sm leading-7 text-white/70">
              Here&apos;s where our crews work most often. Outside these areas? Call and we&apos;ll confirm availability.
            </p>
            <div className="mt-6 flex flex-wrap gap-2 sm:grid sm:grid-cols-2 sm:gap-3">
              {config.serviceAreas.slice(0, 6).map((area) => (
                <div
                  key={area}
                  className="flex items-center gap-1.5 rounded-full border border-white/12 bg-white/95 px-4 py-3 text-sm font-semibold text-forest-900 shadow-sm"
                >
                  <IconMapPin size={15} stroke={2} className="shrink-0 text-ember-600" aria-hidden="true" />
                  {area}
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-[12px] bg-white/95 p-5 text-forest-900 shadow-sm">
              <div className="text-sm font-bold">Need help outside this area?</div>
              <p className="mt-2 text-sm leading-7 text-cream/65">
                {config.phone
                  ? "Call and we will confirm availability before scheduling an estimate."
                  : "Send a request and we will confirm availability before scheduling an estimate."}
              </p>
              {config.phone && (
                <a
                  href={`tel:${config.phone}`}
                  className="call-ring mt-4 hidden h-12 sm:inline-flex items-center gap-2 rounded-2xl bg-forest-700 px-6 text-base font-bold text-white shadow-lg shadow-forest-900/20 transition hover:bg-forest-900"
                >
                  <IconPhoneCall size={19} stroke={2.2} aria-hidden="true" />
                  Call {config.phone}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Kept for pages that still render reviews and the map side by side. */
export function ReviewsMap({ config = business }: SectionProps) {
  return (
    <>
      <Reviews config={config} />
      <ServiceAreaMap config={config} />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Sections the one-page demo adds on top of the home page             */
/* ------------------------------------------------------------------ */

export function TrustBadges({ config = business }: SectionProps) {
  const badges = config.trustBadges ?? [];
  if (badges.length === 0) return null;

  return (
    <section className="border-b border-forest-900/8 bg-night px-3 py-4 sm:px-10 lg:px-16">
      <div className="mx-auto grid max-w-6xl gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {badges.map((badge) => (
          <div
            key={badge.label}
            className="flex items-center justify-center gap-2.5 rounded-[10px] border border-forest-900/10 bg-night-2 px-4 py-3.5 text-sm font-bold text-cream shadow-sm"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-forest-900/5">
              <BadgeIcon name={badge.icon} />
            </span>
            <span>{badge.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export function RecentProjects({ config = business }: SectionProps) {
  const projects = config.projects ?? [];
  if (projects.length === 0) return null;

  return (
    <section id="projects" className="scroll-mt-20 bg-night px-3 py-5 sm:px-10 sm:py-10 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <Pill>{demoCopy.projects.eyebrow}</Pill>
          <h2 className="mt-5 text-[26px] font-bold leading-tight text-cream sm:text-4xl lg:text-[42px]">
            {demoCopy.projects.heading}
          </h2>
          <p className="mt-4 text-base leading-6 text-cream/65 sm:text-lg sm:leading-8">{demoCopy.projects.sub}</p>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {projects.slice(0, 4).map((project, index) => (
            <Reveal key={project.title} delay={(index % 2) * 100} className="h-full">
              <article className="flex h-full flex-col rounded-[12px] border border-forest-900/10 bg-night-2 p-6 shadow-soft">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="text-base font-bold text-cream">{project.title}</h3>
                  {project.location && (
                    <span className="shrink-0 rounded-full bg-forest-900/5 px-3 py-1 text-xs font-bold text-lime">
                      {project.location}
                    </span>
                  )}
                </div>
                <div className="mt-4">
                  <BeforeAfterSlider
                    beforeImage={project.beforeImage}
                    afterImage={project.afterImage}
                    alt={project.title}
                  />
                  <p className="mt-2 text-center text-xs font-semibold text-cream/45">Drag the handle to compare</p>
                </div>
                <div className="mt-3 grid flex-1 gap-3 sm:grid-cols-2">
                  <div className="rounded-[10px] bg-night-3 p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-cream/55">Before</p>
                    <p className="mt-2 text-sm leading-6 text-cream/65">{project.before}</p>
                  </div>
                  <div className="rounded-[10px] bg-forest-900/5 p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-lime">After</p>
                    <p className="mt-2 text-sm leading-6 text-cream/65">{project.after}</p>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FaqSection({ config = business }: SectionProps) {
  const faqs = config.faqs ?? [];
  if (faqs.length === 0) return null;

  return (
    <section id="faq" className="scroll-mt-20 bg-tint px-3 py-4 sm:px-10 sm:py-11 lg:px-16">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <Pill>{demoCopy.faq.eyebrow}</Pill>
          <h2 className="mt-5 text-[28px] font-bold leading-tight text-cream sm:text-4xl lg:text-[42px]">
            {demoCopy.faq.heading}
          </h2>
        </div>
        <div className="mt-8 grid gap-3">
          {faqs.map((faq, i) => (
            <details
              key={faq.question}
              open={i === 0}
              className="group rounded-[12px] border border-forest-900/10 bg-night-2 px-5 transition open:border-lime/30"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-[16px] font-bold leading-snug text-cream">
                {faq.question}
                <IconChevronDown size={20} className="chev shrink-0 text-lime transition-transform" aria-hidden="true" />
              </summary>
              <p className="pb-5 text-[15px] leading-7 text-cream/65">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Four reasons to pick up the phone. Ours, not theirs: every business gets the same list. */
const defaultSigns = [
  "Branches touching the roof, gutters or power lines",
  "A tree leaning more than it used to, or lifting the ground at its base",
  "Dead limbs, bare patches or fungus on the trunk",
  "A stump in the way of mowing, parking or a new fence"
];

export function WarningSigns({ config = business, links = defaultLinks }: SectionProps) {
  return (
    <section className="bg-night px-3 py-4 sm:px-10 sm:py-11 lg:px-16">
      <div className="mx-auto max-w-3xl text-center">
        <Pill>Not sure yet?</Pill>
        <h2 className="mt-5 text-[28px] font-bold leading-tight text-cream sm:text-4xl lg:text-[42px]">
          Signs it&apos;s time to call about a tree.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-[15px] leading-7 text-cream/65 sm:text-lg">
          Any one of these is worth a free look. Catching it early is cheaper than the storm that finds it first.
        </p>
        <div className="mt-8 grid gap-3 text-left">
          {defaultSigns.map((sign) => (
            <div key={sign} className="flex items-start gap-3.5 rounded-[10px] border border-forest-900/10 bg-night px-4 py-4">
              <IconAlertTriangle size={22} className="mt-0.5 shrink-0 text-ember-400" aria-hidden="true" />
              <p className="text-[15px] leading-6 text-cream">{sign}</p>
            </div>
          ))}
        </div>
        <a
          href={links.quote}
          className="mt-7 inline-flex h-12 items-center justify-center rounded-2xl bg-ember-500 px-7 text-base font-bold text-white shadow-lg shadow-ember-600/25 transition hover:bg-ember-600"
        >
          Get My Free Estimate →
        </a>
      </div>
    </section>
  );
}

/** A short band between sections: one question, call or request. */
export function CtaBand({ config = business, links = defaultLinks }: SectionProps) {
  return (
    <section className="bg-night px-3 py-6 text-center sm:px-10 sm:py-12 lg:px-16">
      <div className="mx-auto max-w-2xl">
        <h2 className="text-[28px] font-bold leading-tight text-cream sm:text-4xl">Need a tree taken care of this week?</h2>
        <p className="mx-auto mt-3 max-w-md text-[15px] leading-7 text-cream/65 sm:text-lg">
          One call gets it on the schedule. Emergencies get a same-day answer.
        </p>
        <div className="mx-auto mt-6 flex max-w-sm flex-col gap-3">
          {config.phone && (
            <a
              href={`tel:${config.phone}`}
              className="call-ring inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-lime px-6 text-base font-bold text-white transition hover:bg-lime-600"
            >
              <IconPhoneCall size={19} stroke={2.2} aria-hidden="true" />
              Call {config.phone}
            </a>
          )}
          <a
            href={links.quote}
            className="inline-flex h-12 items-center justify-center rounded-2xl border-2 border-lime px-6 text-base font-bold text-lime transition hover:bg-lime/10"
          >
            Request Free Estimate
          </a>
        </div>
      </div>
    </section>
  );
}

/** The closing band: green, one promise, and the chat/quote panel that used to sit in the hero. */
export function QuoteCta({ config = business, slug, lockHref = "" }: SectionProps & { slug?: string; lockHref?: string }) {
  return (
    <section id="quote" className="scroll-mt-20 bg-night px-4 py-10 text-forest-900 sm:px-10 sm:py-14 lg:px-16">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-12">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-forest-900/8 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-white">
            <span className="h-2 w-2 shrink-0 rounded-full bg-ember-500" aria-hidden="true" />
            Free estimate
          </span>
          <h2 className="mt-5 text-[26px] font-bold leading-tight sm:text-4xl lg:text-[42px]">
            Tell us about the tree. We&apos;ll tell you the price.
          </h2>
          <p className="mt-4 max-w-md text-base leading-6 text-forest-900/70 sm:text-lg sm:leading-8">
            Ask a question or send a few details. A real person from {config.companyName} replies the same day.
          </p>
          {config.phone && (
            <a
              href={`tel:${config.phone}`}
              className="mt-6 hidden h-12 items-center gap-2 rounded-2xl bg-night-2 px-6 text-base font-bold text-cream shadow-lg transition hover:bg-forest-900/5 sm:inline-flex"
            >
              <IconPhoneCall size={19} stroke={2.2} aria-hidden="true" />
              Call {config.phone}
            </a>
          )}
        </div>
        <div className="hidden h-[420px] sm:block lg:h-[480px]">
          <HeroPanel config={config} slug={slug} lockHref={lockHref} />
        </div>
        <div className="grid grid-cols-2 gap-2.5 sm:hidden">
          <OpenPanelButton tab="chat" className="border-2 border-forest-900/20 text-forest-900">
            💬 Ask a question
          </OpenPanelButton>
          <OpenPanelButton tab="form" className="bg-ember-500 text-white">
            📋 Free quote
          </OpenPanelButton>
        </div>
      </div>
    </section>
  );
}

export function QuoteSection({ config = business, slug }: SectionProps & { slug?: string }) {
  return (
    <section id="quote" className="scroll-mt-20 bg-night px-3 py-5 sm:px-10 sm:py-10 lg:px-16">
      <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div>
          <Pill>{demoCopy.quote.eyebrow}</Pill>
          <h2 className="mt-5 text-[26px] font-bold leading-tight text-cream sm:text-4xl lg:text-[42px]">
            {demoCopy.quote.heading}
          </h2>
          <p className="mt-5 max-w-md text-base leading-6 text-cream/65 sm:text-lg sm:leading-8">{demoCopy.quote.sub}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            {config.aboutTrustPoints.map((point) => (
              <span
                key={point}
                className="rounded-full border border-forest-900/10 bg-night-2 px-3 py-1 text-[13px] font-semibold text-cream"
              >
                {point}
              </span>
            ))}
          </div>
        </div>
        <div className="rounded-[10px] border border-forest-900/10 bg-night-2 p-6 shadow-soft sm:p-9">
          <QuoteForm config={config} slug={slug} />
        </div>
      </div>
    </section>
  );
}

/**
 * The footer every page ends on.
 *
 * Rendered from the config like everything else here, so the same markup
 * serves the showcase site and a generated demo. Every block is guarded: a
 * demo that knows only a name, a city and a phone number still renders a
 * footer with no holes in it, and nothing is invented to fill a column.
 */
export function Footer({ config = business, links = defaultLinks }: SectionProps) {
  const services = (config.services?.length ? config.services : config.serviceCards).slice(0, 6);
  const areas = config.serviceAreas.slice(0, 12);
  const locality = [config.city, config.stateAbbr].filter(Boolean).join(", ");
  const rating = Number(config.reviewSummary?.rating);

  return (
    <footer className="bg-forest-900 text-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-5 sm:py-14 lg:px-8 lg:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.15fr] lg:gap-12">
          {/* Who they are */}
          <div>
            <a href={links.home} className="flex items-center gap-3" aria-label={`${config.companyName} home`}>
              {/*
                Same logo-or-initials fallback as the header, but the mark sits
                on a white tile here. Logos in this trade are overwhelmingly
                opaque white-background files (Oakline's own is RGB with no
                alpha), and dropped straight onto the dark band they read as a
                stray white rectangle. A padded tile makes the white deliberate
                and works for transparent marks too.
              */}
              {config.logoImage ? (
                <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-night-2 p-1.5">
                  <span className="relative block h-full w-full">
                    <Image src={config.logoImage} alt="" fill sizes="48px" className="object-contain" />
                  </span>
                </span>
              ) : (
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/12">
                  <span className="text-sm font-bold" aria-hidden="true">
                    {initials(config.companyName)}
                  </span>
                </span>
              )}
              <span className="text-lg font-extrabold leading-tight">{config.companyName}</span>
            </a>

            <p className="mt-5 max-w-sm text-sm leading-7 text-white/62">{config.tagline}</p>

            {/* Only ever a verified summary; there is no placeholder rating. */}
            {config.reviewSummary && (
              <div className="mt-5 flex flex-wrap items-center gap-x-2.5 gap-y-1">
                <GoogleG size={16} />
                <span className="text-sm font-bold">{config.reviewSummary.rating}</span>
                <GoogleStars rating={Number.isFinite(rating) ? rating : 5} size={14} />
                <span className="text-sm text-white/60">{config.reviewSummary.count} reviews</span>
              </div>
            )}

            {config.trustBadges && config.trustBadges.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {config.trustBadges.map((badge) => (
                  <span
                    key={badge.label}
                    className="inline-flex items-center gap-1.5 rounded-full bg-forest-900/8 px-3 py-1.5 text-xs font-bold text-white/85"
                  >
                    <IconCheck size={13} stroke={3} className="text-ember-400" aria-hidden="true" />
                    {badge.label}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Services */}
          {services.length > 0 && (
            <div>
              <FooterHeading>Services</FooterHeading>
              <ul className="mt-5 space-y-3">
                {services.map((service) => (
                  <li key={service.title}>
                    <a href={links.services} className="text-sm text-white/70 transition hover:text-white">
                      {service.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* The same nav as the header, so the foot of the page is a way back up. */}
          <div>
            <FooterHeading>Company</FooterHeading>
            <ul className="mt-5 space-y-3">
              {links.nav.map((item) => (
                <li key={item.label}>
                  <a href={item.href} className="text-sm text-white/70 transition hover:text-white">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Get in touch */}
          <div>
            <FooterHeading>Get in touch</FooterHeading>
            <ul className="mt-5 space-y-4">
              {config.phone && (
                <li>
                  <a
                    href={`tel:${config.phone}`}
                    className="flex items-center gap-2.5 text-base font-bold transition hover:text-ember-400"
                  >
                    <IconPhoneCall size={17} stroke={2.2} className="shrink-0 text-ember-400" aria-hidden="true" />
                    {config.phone}
                  </a>
                </li>
              )}
              {config.email && (
                <li>
                  <a
                    href={`mailto:${config.email}`}
                    className="flex items-start gap-2.5 text-sm text-white/70 transition hover:text-white"
                  >
                    <IconMail size={17} stroke={2} className="mt-0.5 shrink-0 text-ember-400" aria-hidden="true" />
                    <span className="break-all">{config.email}</span>
                  </a>
                </li>
              )}
              {locality && (
                <li className="flex items-start gap-2.5 text-sm text-white/70">
                  <IconMapPin size={17} stroke={2} className="mt-0.5 shrink-0 text-ember-400" aria-hidden="true" />
                  <span>{locality}</span>
                </li>
              )}
            </ul>

            {config.responseNote && <p className="mt-5 text-sm leading-7 text-white/55">{config.responseNote}</p>}

            <a
              href={links.quote}
              className="mt-6 inline-flex h-12 items-center justify-center rounded-2xl bg-ember-500 px-6 text-sm font-bold text-white shadow-lg shadow-ember-600/20 transition hover:bg-ember-600"
            >
              Get a Free Estimate
            </a>
          </div>
        </div>

        {/*
          Areas link to their landing pages on the showcase site only. A demo
          gets no `areaBase`, so its areas render as plain text rather than
          walking a prospect into the showcase site's own pages.
        */}
        {areas.length > 0 && (
          <div className="mt-12 border-t border-forest-900/10 pt-8">
            <FooterHeading>Areas we serve</FooterHeading>
            <div className="mt-4 flex flex-wrap gap-2">
              {areas.map((area) => {
                const slug = slugify(area);
                const href = links.areaBase && findArea(slug) ? `${links.areaBase}/${slug}` : null;
                return href ? (
                  <a
                    key={area}
                    href={href}
                    className="rounded-full bg-white/8 px-3.5 py-1.5 text-sm text-white/70 transition hover:bg-white/16 hover:text-white"
                  >
                    {area}
                  </a>
                ) : (
                  <span key={area} className="rounded-full bg-white/8 px-3.5 py-1.5 text-sm text-white/70">
                    {area}
                  </span>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-forest-900/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-sm sm:px-5 text-white/50 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <p>
            &copy; {new Date().getFullYear()} {config.companyName}. All rights reserved.
          </p>
          {locality && <p>Serving {locality} and the surrounding area.</p>}
        </div>
      </div>
    </footer>
  );
}

function FooterHeading({ children }: { children: React.ReactNode }) {
  return <h2 className="text-xs font-extrabold uppercase tracking-[0.18em] text-ember-400">{children}</h2>;
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-forest-50 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-forest-900">
      <span className="h-2 w-2 shrink-0 rounded-full bg-ember-500" aria-hidden="true" />
      {children}
    </span>
  );
}

const badgePaths: Record<string, string> = {
  shield: "M12 2 4 5v6c0 5 3.4 9.4 8 11 4.6-1.6 8-6 8-11V5l-8-3Z",
  license: "M4 4h16v16H4V4Zm3 4h10M7 12h10M7 16h6",
  home: "M3 11 12 3l9 8v10H3V11Z",
  bolt: "M13 2 4 14h6l-1 8 9-12h-6l1-8Z",
  clock: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 7v5l3 2",
  leaf: "M4 20c0-8 6-14 16-15 0 10-6 15-13 15H4Zm2 0c3-4 6-6 10-8",
  truck: "M3 7h11v10H3V7Zm11 3h4l3 3v4h-7v-7Z",
  check: "m4 12 5 5L20 6"
};

function BadgeIcon({ name }: { name: string }) {
  const path = badgePaths[name] ?? badgePaths.check;
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5 shrink-0 text-lime"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={path} />
    </svg>
  );
}
