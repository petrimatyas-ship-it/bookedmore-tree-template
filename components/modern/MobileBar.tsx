import { IconArrowUpRight, IconPhone } from "@tabler/icons-react";
import type { SiteConfig } from "@/lib/site-config";

/**
 * The two things a phone visitor came to do, pinned where a thumb rests.
 *
 * Dark on the light page so it reads as a control and not as more content.
 * Hidden on a laptop, where the nav already carries both.
 */
export function ModernMobileBar({ config }: { config: SiteConfig }) {
  return (
    <>
      <div className="h-20 lg:hidden" aria-hidden="true" />
      <div className="fixed inset-x-0 bottom-0 z-40 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:hidden">
        <div className="mx-auto grid max-w-md grid-cols-[1fr_1.4fr] gap-2 rounded-[4px] bg-ink p-1.5 shadow-[0_18px_40px_rgba(20,23,26,0.35)]">
          {config.phone ? (
            <a
              href={`tel:${config.phone}`}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-[4px] text-[15px] font-bold text-bone"
            >
              <IconPhone size={18} stroke={2.2} aria-hidden="true" />
              Call
            </a>
          ) : (
            <span aria-hidden="true" />
          )}
          <a
            href="#quote"
            data-demo-cta="mobile-bar"
            className="inline-flex h-12 items-center justify-center gap-1.5 rounded-[4px] bg-signal text-[15px] font-bold text-ink"
          >
            Free estimate
            <IconArrowUpRight size={17} stroke={2.4} aria-hidden="true" />
          </a>
        </div>
      </div>
    </>
  );
}
