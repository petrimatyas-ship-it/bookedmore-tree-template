import { readFileSync } from "fs";
import path from "path";
import { render } from "@/scripts/render-template.mjs";
import { resolveAssets } from "@/scripts/detailing-assets.mjs";
import { withView } from "@/scripts/site-pages.mjs";

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
 *   landscaping        demo-templates/landscaping/template.html (photo-led and
 *                      upscale: gold on cream, serif headings; README beside it)
 *   contractor         demo-templates/contractor/template.html (clean and
 *                      direct, Bert Roofing style, colours from the data)
 */

export const TEMPLATES = ["detailing", "pressure-washing", "landscaping", "contractor"] as const;
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

/**
 * One page of a stored site: "" is its home page; a full landscaping site
 * (`pages: true`) has its other pages too (scripts/site-pages.mjs). Null when
 * the site has no page at that path.
 */
export function renderSite(name: TemplateName, data: Record<string, unknown>, path = ""): string | null {
  const viewed = withView(resolveAssets(data), path);
  return viewed ? (render(templateHtml(name), viewed) as string) : null;
}

export function renderDetailing(data: Record<string, unknown>): string {
  return renderSite("detailing", data) ?? "";
}
