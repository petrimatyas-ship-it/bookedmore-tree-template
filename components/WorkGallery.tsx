import { business } from "@/lib/business";
import type { SiteConfig } from "@/lib/site-config";
import { IconLock } from "@tabler/icons-react";
import { GoogleG } from "@/components/GoogleReview";
import { OwnerNote } from "@/components/OwnerNote";
import { demoCopy } from "@/lib/demo-copy";

/**
 * Their own photos, shown without captions.
 *
 * The rule this section exists to obey: we do not know what is in any given
 * photo. Put one under a heading that says "Stump Grinding" and half the time
 * it contradicts itself. Put the same photo in an unlabelled grid of their
 * work and it is simply true — and it is the only thing on the page a
 * competitor cannot copy.
 *
 * A magazine-style mosaic rather than a uniform grid: the first photo runs
 * large, the rest fill around it, so a handful of pictures still reads as a
 * designed section instead of a thin row.
 */
export function WorkGallery({ config = business, lockHref = "" }: { config?: SiteConfig; lockHref?: string }) {
  /*
    Exactly five: one large tile plus four fills the 4x2 mosaic squarely.
    A sixth starts a third row on its own and the shape falls apart.
  */
  const photos = (config.gallery ?? []).slice(0, 5);
  if (photos.length < 3) return null;

  // Their own listing, so a visitor can see the rest of the photos there.
  const href = config.listingUrl;

  /*
    A demo keeps one cell back. Four of their photos are shown and the last
    tile is blurred, so the section still proves the photos are real while
    leaving something behind the glass.
  */
  const shown = config.isDemo ? photos.slice(0, 4) : photos;
  const [lead, ...rest] = shown;
  const lockedTile = config.isDemo ? photos[4] ?? photos[0] : undefined;
  const moreCount = Math.max(0, (config.galleryTotal ?? photos.length) - shown.length);

  return (
    <section id="work" className="scroll-mt-20 bg-night px-4 py-10 sm:px-10 sm:py-12 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <span className="inline-flex rounded-full bg-forest-50 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-forest-900">
              Our Work
            </span>
            <h2 className="mt-5 text-[28px] font-bold leading-tight text-cream sm:text-4xl lg:text-[42px]">
              Real jobs, real yards.
            </h2>
          </div>
          {config.listingUrl && (
            <p className="flex items-center gap-2 text-sm text-cream/55">
              <GoogleG size={15} />
              Photos from our Google listing
            </p>
          )}
        </div>

        <div className="mt-9 grid auto-rows-[150px] grid-cols-2 gap-3 sm:auto-rows-[190px] lg:grid-cols-4">
          <Tile photo={lead} href={href} name={config.companyName} className="col-span-2 row-span-2" />
          {rest.map((photo) => (
            <Tile key={photo} photo={photo} href={href} name={config.companyName} />
          ))}
          {/*
            On a demo the last cell is a locked one rather than a fifth photo.
            The mosaic is exactly eight cells, so this costs one picture and
            buys the gap that makes them ask what else is in there.
          */}
          {config.isDemo && lockedTile && lockHref && (
            <LockedTile photo={lockedTile} more={moreCount} href={lockHref} />
          )}
        </div>

        {href && (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[#1a73e8] transition hover:underline"
          >
            See more photos on Google
            <span aria-hidden="true">↗</span>
          </a>
        )}

        {config.isDemo && <OwnerNote className="mt-6 max-w-2xl">{demoCopy.notes.gallery}</OwnerNote>}
      </div>
    </section>
  );
}

/**
 * One photo. A link to their Google listing when we have one, so a visitor
 * who wants to see more of their work can, and a plain figure otherwise —
 * a tile that looks clickable and is not is worse than one that does not.
 */
/** One of their photos behind glass, with the count of what else there is. */
function LockedTile({ photo, more, href }: { photo: string; more: number; href: string }) {
  return (
    <a
      href={href}
      data-demo-cta="gallery-lock"
      className="group relative block overflow-hidden rounded-[18px] bg-forest-900/5"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={photo}
        alt=""
        aria-hidden="true"
        loading="lazy"
        referrerPolicy="no-referrer"
        className="h-full w-full scale-105 object-cover blur-[6px]"
      />
      <span className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-forest-900/55 px-3 text-center">
        <IconLock size={20} stroke={2} className="text-white/90" aria-hidden="true" />
        <span className="text-[13px] font-bold leading-5 text-white">{demoCopy.galleryLock(more)}</span>
      </span>
    </a>
  );
}

function Tile({
  photo,
  href,
  name,
  className = ""
}: {
  photo: string;
  href?: string;
  name: string;
  className?: string;
}) {
  const image = (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={photo}
      alt={`${name} tree work`}
      loading="lazy"
      referrerPolicy="no-referrer"
      className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
    />
  );

  const shell = `group relative block overflow-hidden rounded-[18px] bg-forest-900/5 ${className}`;

  if (!href) return <figure className={shell}>{image}</figure>;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer nofollow"
      aria-label={`See more ${name} photos on Google`}
      className={`${shell} outline-none focus-visible:ring-2 focus-visible:ring-forest-600`}
    >
      {image}
      <span className="pointer-events-none absolute inset-0 bg-forest-900/0 transition duration-300 group-hover:bg-forest-900/20" />
      <span className="pointer-events-none absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-cream opacity-0 shadow-md transition duration-300 group-hover:opacity-100">
        <GoogleG size={15} />
      </span>
    </a>
  );
}
