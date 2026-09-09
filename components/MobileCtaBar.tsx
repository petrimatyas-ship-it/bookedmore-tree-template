import Link from "next/link";
import { IconPhoneCall } from "@tabler/icons-react";
import { business } from "@/lib/business";
import { defaultLinks, type SiteConfig, type SiteLinks } from "@/lib/site-config";

export function MobileCtaBar({
  config = business,
  links = defaultLinks
}: {
  config?: SiteConfig;
  links?: SiteLinks;
}) {
  return (
    <>
      <div className="h-[72px] lg:hidden" aria-hidden="true" />
      {/* One column when there is no number to call, so nothing looks broken. */}
      <div
        className={`fixed inset-x-0 bottom-0 z-40 grid gap-2 border-t border-forest-900/10 bg-white/95 p-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))] backdrop-blur lg:hidden ${
          config.phone ? "grid-cols-2" : "grid-cols-1"
        }`}
      >
        {config.phone && (
          <a
            href={`tel:${config.phone}`}
            className="inline-flex h-12 items-center justify-center gap-1.5 whitespace-nowrap rounded-xl bg-lime px-2 text-[13px] font-bold text-white shadow-lg"
          >
            <IconPhoneCall size={17} stroke={2.2} className="shrink-0" aria-hidden="true" />
            {config.phone}
          </a>
        )}
        <Link
          href={links.quote}
          className="inline-flex h-12 items-center justify-center rounded-xl bg-ember-500 text-sm font-bold text-white shadow-lg shadow-ember-600/20"
        >
          Free Estimate
        </Link>
      </div>
    </>
  );
}
