import Link from "next/link";
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
      <div
        className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-1 border-t border-forest-900/10 bg-white/95 p-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))] backdrop-blur lg:hidden"
      >
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
