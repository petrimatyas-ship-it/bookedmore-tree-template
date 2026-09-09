import { IconInfoCircleFilled } from "@tabler/icons-react";

/**
 * A note from us to the business owner, sitting inside their own site.
 *
 * Deliberately styled as an aside rather than as page content: it is a
 * different voice talking to a different person, and it must never be
 * mistaken for something their customers would read. Only ever rendered on
 * a demo, which only the owner sees.
 */
export function OwnerNote({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <aside
      className={`flex items-start gap-2.5 rounded-[10px] border border-dashed border-ember-500/45 bg-ember-500/[0.07] px-4 py-3 text-sm leading-6 text-forest-900/80 ${className}`}
    >
      <IconInfoCircleFilled size={17} className="mt-0.5 shrink-0 text-ember-500" aria-hidden="true" />
      <span>{children}</span>
    </aside>
  );
}
