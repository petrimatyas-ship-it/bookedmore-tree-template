import { readFileSync } from "fs";
import path from "path";
import { render } from "@/scripts/render-template.mjs";
import { resolveAssets } from "@/scripts/detailing-assets.mjs";

/**
 * The detailing template rendered at request time, for sites the Replymint
 * site maker stored (hand-built pages are rendered once, at build time, by
 * scripts/build-detailing-demo.mjs). Same template, same engine, so the two
 * never drift apart. A value the template needs and the data lacks throws,
 * which the sites API uses to refuse a site before it is stored.
 */

let template: string | null = null;
function detailingTemplate(): string {
  template ??= readFileSync(path.join(process.cwd(), "demo-templates/detailing/template.html"), "utf8");
  return template;
}

export function renderDetailing(data: Record<string, unknown>): string {
  return render(detailingTemplate(), resolveAssets(data)) as string;
}
