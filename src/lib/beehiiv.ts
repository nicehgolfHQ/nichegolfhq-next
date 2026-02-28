import * as cheerio from "cheerio";

/**
 * Aggressively normalizes Beehiiv RSS HTML into clean, readable article HTML.
 * Goal: premium, consistent on-site reading experience (not pixel-perfect email rendering).
 */
export function normalizeBeehiivHtml(rawHtml?: string): string {
  if (!rawHtml) return "";

  const $ = cheerio.load(rawHtml);

  // Prefer Beehiiv body container.
  const body = $(".beehiiv__body");
  const root = body.length ? body : $("body");

  // Drop obvious junk.
  root.find("script, style, iframe, form, input, button, noscript").remove();

  // Remove tracking pixels / tiny images.
  root.find("img").each((_, el) => {
    const w = Number($(el).attr("width") || 0);
    const h = Number($(el).attr("height") || 0);
    const src = ($(el).attr("src") || "").toLowerCase();
    if ((w && w <= 2) || (h && h <= 2) || src.includes("pixel") || src.includes("tracking")) {
      $(el).remove();
    }
  });

  // Strip layout attributes + inline styles that cause left offsets / cramped layout.
  root.find("*").each((_, el) => {
    $(el)
      .removeAttr("style")
      .removeAttr("align")
      .removeAttr("width")
      .removeAttr("height")
      .removeAttr("border")
      .removeAttr("cellpadding")
      .removeAttr("cellspacing");

    // Remove on* handlers
    for (const attr of Object.keys((el as any).attribs || {})) {
      if (/^on/i.test(attr)) $(el).removeAttr(attr);
    }
  });

  // Convert Beehiiv image blocks to semantic figure.
  root.find(".image").each((_, el) => {
    const img = $(el).find("img").first();
    if (!img.length) return;
    const figure = $("<figure></figure>");
    figure.append(img);
    $(el).replaceWith(figure);
  });

  // Unwrap excessive container divs that don't add meaning.
  // Keep headings, lists, paragraphs, figures, blockquotes, hr.
  root.find("div").each((_, el) => {
    const $el = $(el);
    const cls = ($el.attr("class") || "").toLowerCase();

    // Keep specific divs if they look like intentional sections.
    if (cls.includes("callout") || cls.includes("quote") || cls.includes("pull") || cls.includes("embed")) return;

    // If div has no attributes besides class/id and only contains block elements, unwrap.
    const attrs = Object.keys((el as any).attribs || {}).filter((a) => a !== "class" && a !== "id");
    if (attrs.length) return;

    // unwrap wrapper divs
    $el.replaceWith($el.contents());
  });

  // Table layouts: keep actual data tables, but strip classes and let prose style them.
  root.find("table").each((_, el) => {
    const $t = $(el);
    $t.removeAttr("class");
    $t.find("*").each((_, c) => {
      $(c).removeAttr("class");
    });
  });

  // Normalize <br><br> into paragraph breaks.
  root.find("br").each((_, el) => {
    const next = $(el).nextAll("br").first();
    if (next.length) {
      // Replace first <br> in a run with a paragraph break marker.
      $(el).replaceWith("</p><p>");
      next.remove();
    }
  });

  // Ensure top-level content is wrapped in paragraphs when needed.
  // (Cheerio will keep our injected </p><p> markers as text nodes; fix by reloading.)
  const html = root.html() || "";
  const $$ = cheerio.load(html);

  // Demote any Beehiiv-provided <h1> inside the issue body.
  // We render the page title as the single canonical <h1>, so body headings should be <h2+>.
  $$("h1").each((_, h) => {
    const $h = $$(h);
    const h2 = $$("<h2></h2>");
    h2.html($h.html() || "");
    $h.replaceWith(h2);
  });

  // Remove empty paragraphs
  $$("p").each((_, p) => {
    const txt = $$(p).text().replace(/\s+/g, " ").trim();
    if (!txt && !$$(p).find("img, a, strong, em").length) $$(p).remove();
  });

  // Strip javascript: URLs
  $$(["a", "img"].join(",")).each((_, el) => {
    const $el = $$(el);
    for (const attr of ["href", "src"]) {
      const v = ($el.attr(attr) || "").trim();
      if (/^javascript:/i.test(v)) $el.attr(attr, "#");
    }
  });

  // Return body HTML only.
  return ($$("body").length ? $$("body").html() : $$.root().html())?.trim() || "";
}
