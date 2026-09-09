import type { Review, ReviewSummary } from "@/lib/site-config";

/**
 * Reviews presented the way Google presents them.
 *
 * These are the business's real Google reviews, pulled from their listing.
 * The point of the styling is not decoration: a name and a quote in our own
 * house style is indistinguishable from a testimonial we wrote ourselves,
 * and a visitor has no way to check it. Google's mark, the reviewer's own
 * photo, the relative date and a link straight to the listing turn the same
 * words into something verifiable in one click.
 *
 * Everything here is only ever rendered from pulled data. `reviewsUrl` is
 * set by the enricher and by nothing else, so it doubles as the guard: no
 * real listing, no Google branding.
 */

/** Google's four-colour G. */
export function GoogleG({ size = 18, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" className={className} aria-hidden="true" focusable="false">
      <path
        fill="#4285F4"
        d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"
      />
      <path
        fill="#34A853"
        d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"
      />
      <path
        fill="#FBBC05"
        d="M11.69 28.18C11.25 26.86 11 25.45 11 24s.25-2.86.69-4.18v-5.7H4.34C2.85 17.09 2 20.45 2 24s.85 6.91 2.34 9.88l7.35-5.7z"
      />
      <path
        fill="#EA4335"
        d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z"
      />
    </svg>
  );
}

/** Google's star row: filled to the rating, in Google's amber. */
export function GoogleStars({ rating, size = 15 }: { rating: number; size?: number }) {
  const filled = Math.max(0, Math.min(5, Math.round(rating)));
  return (
    <span className="inline-flex gap-0.5" role="img" aria-label={`${filled} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path
            fill={i < filled ? "#FBBC04" : "#DADCE0"}
            d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
          />
        </svg>
      ))}
    </span>
  );
}

/** Initial in a coloured circle, the way Google does when there is no photo. */
const AVATAR_COLOURS = ["#1a73e8", "#d93025", "#188038", "#e37400", "#9334e6", "#0b8043"];

function Avatar({ name, src }: { name: string; src?: string }) {
  if (src) {
    // Served from Google's CDN, like the review itself.
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={src}
        alt=""
        width={40}
        height={40}
        loading="lazy"
        referrerPolicy="no-referrer"
        className="h-10 w-10 shrink-0 rounded-full object-cover"
      />
    );
  }
  const letter = name.trim().charAt(0).toUpperCase() || "?";
  const colour = AVATAR_COLOURS[letter.charCodeAt(0) % AVATAR_COLOURS.length];
  return (
    <span
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-base font-medium text-white"
      style={{ backgroundColor: colour }}
      aria-hidden="true"
    >
      {letter}
    </span>
  );
}

/**
 * One review, in Google's card shape: avatar, name, stars, relative date,
 * the text, and any photos the customer attached.
 */
export function GoogleReviewCard({
  review,
  className = ""
}: {
  review: Review;
  className?: string;
}) {
  const photos = review.photos ?? [];
  return (
    <article
      className={`flex h-full flex-col rounded-[10px] border border-forest-900/10 bg-white p-5 shadow-[0_10px_30px_rgba(18,49,25,0.07)] ${className}`}
    >
      <div className="flex items-center gap-3">
        <Avatar name={review.name} src={review.avatar} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[15px] font-medium leading-tight text-forest-900">{review.name}</p>
          <div className="mt-1 flex items-center gap-2">
            <GoogleStars rating={review.rating} size={14} />
            {review.date && <span className="text-xs text-forest-900/50">{review.date}</span>}
          </div>
        </div>
        <GoogleG size={18} className="shrink-0" />
      </div>

      <p className="mt-3.5 flex-1 text-sm leading-7 text-forest-900/75">{review.text}</p>

      {photos.length > 0 && (
        <div className="mt-4 flex gap-2">
          {photos.slice(0, 3).map((photo) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={photo}
              src={photo}
              alt=""
              loading="lazy"
              referrerPolicy="no-referrer"
              className="h-16 w-16 rounded-[8px] object-cover"
            />
          ))}
        </div>
      )}
    </article>
  );
}

/**
 * The rating block: big number, stars, review count, Google attribution and
 * a link to the listing so any of it can be checked.
 */
export function GoogleRatingSummary({
  summary,
  reviewsUrl,
  className = ""
}: {
  summary: ReviewSummary;
  reviewsUrl?: string;
  className?: string;
}) {
  const numeric = Number(summary.rating);
  return (
    <div className={`rounded-[10px] border border-forest-900/10 bg-white p-5 ${className}`}>
      <div className="flex items-center gap-4">
        <div className="text-4xl font-bold leading-none text-forest-900">{summary.rating}</div>
        <div className="min-w-0">
          <GoogleStars rating={Number.isFinite(numeric) ? numeric : 5} size={16} />
          <div className="mt-1.5 flex items-center gap-1.5 text-sm text-forest-900/65">
            <GoogleG size={14} />
            <span>{summary.count} Google reviews</span>
          </div>
        </div>
      </div>
      {reviewsUrl && (
        <a
          href={reviewsUrl}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[#1a73e8] transition hover:underline"
        >
          Read all {summary.count} reviews on Google
          <span aria-hidden="true">↗</span>
        </a>
      )}
    </div>
  );
}
