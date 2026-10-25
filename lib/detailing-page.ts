import { readFileSync } from "fs";
import path from "path";
import { render } from "@/scripts/render-template.mjs";
import { resolveAssets } from "@/scripts/detailing-assets.mjs";

/**
 * The demo templates rendered at request time, for sites the Replymint site
 * maker stored (hand-built pages are rendered once, at build time, by
 * scripts/build-detailing-demo.mjs). Same templates, same engine, so the two
 * never drift apart. A value a template needs and the data lacks throws,
 * which the sites API uses to refuse a site before it is stored.
 *
 *   detailing          demo-templates/detailing/template.html
 *   pressure-washing   demo-templates/pressure-washing/template.html (a plain
 *                      local-contractor page; its pictures sit in the same
 *                      data fields, so the same asset resolver serves both)
 */

export const TEMPLATES = ["detailing", "pressure-washing"] as const;
export type TemplateName = (typeof TEMPLATES)[number];

export const isTemplate = (v: unknown): v is TemplateName => typeof v === "string" && (TEMPLATES as readonly string[]).includes(v);

const cache = new Map<TemplateName, string>();
function templateHtml(name: TemplateName): string {
  let html = cache.get(name);
  if (!html) {
    html = readFileSync(path.join(process.cwd(), `demo-templates/${name}/template.html`), "utf8");
    cache.set(name, html);
  }
  return html;
}

export function renderSite(name: TemplateName, data: Record<string, unknown>): string {
  return render(templateHtml(name), resolveAssets(data)) as string;
}

export function renderDetailing(data: Record<string, unknown>): string {
  return renderSite("detailing", data);
}
