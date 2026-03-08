import Image from "next/image";
import Link from "next/link";
import type { RssItem } from "@/lib/rss";

function cleanSnippet(input?: string) {
  if (!input) return "";
  // Beehiiv RSS snippets sometimes contain decorative divider lines. Strip them.
  let s = input
    .replace(/\r\n/g, "\n")
    // Remove divider runs even if they show up mid-text.
    .replace(/\s*[—–\-_=*•·]{3,}\s*/g, " ")
    // Normalize line breaks
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  // Collapse extra whitespace after divider removal.
  s = s.replace(/\s{2,}/g, " ").trim();

  // If the snippet is basically just a divider after cleanup, drop it.
  if (/^[—–\-_=*•·\s]+$/.test(s)) return "";
  return s;
}

function issueSlugFromUrl(urlStr: string): string {
  try {
    const u = new URL(urlStr);
    const parts = u.pathname.split("/").filter(Boolean);
    return parts[parts.length - 1] || "issue";
  } catch {
    return "issue";
  }
}

export function IssueCard({ item, newsletterSlug }: { item: RssItem; newsletterSlug: string }) {
  const snippet = cleanSnippet(item.contentSnippet);

  const issueSlug = issueSlugFromUrl(item.link);

  return (
    <Link
      href={`/${newsletterSlug}/issue/${issueSlug}`}
      className="group block overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.04] transition hover:border-white/[0.12] hover:-translate-y-0.5"
    >
      {item.imageUrl ? (
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-white/5">
          <Image
            src={item.imageUrl}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition duration-300 group-hover:scale-[1.02]"
          />
        </div>
      ) : null}

      <div className="p-5 text-center">
        <div className="text-sm text-white/35">
          {item.isoDate ? new Date(item.isoDate).toLocaleDateString() : ""}
        </div>
        <div className="mt-2 font-semibold tracking-tight text-white/90 group-hover:underline">
          {item.title}
        </div>
        {snippet ? (
          <p className="mt-2 line-clamp-3 text-sm text-white/40">
            {snippet}
          </p>
        ) : null}
      </div>
    </Link>
  );
}
