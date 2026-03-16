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
      className="group block overflow-hidden rounded-2xl border border-zinc-200 bg-white transition hover:border-zinc-300 hover:shadow-sm hover:-translate-y-0.5"
    >
      {item.imageUrl ? (
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-100">
          <Image
            src={item.imageUrl}
            alt={item.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition duration-300 group-hover:scale-[1.02]"
          />
        </div>
      ) : null}

      <div className="p-5 text-center">
        <div className="text-sm text-zinc-500">
          {item.isoDate ? new Date(item.isoDate).toLocaleDateString() : ""}
        </div>
        <div className="mt-2 font-semibold tracking-tight text-zinc-900 group-hover:underline">
          {item.title}
        </div>
        {snippet ? (
          <p className="mt-2 line-clamp-3 text-sm text-zinc-600">
            {snippet}
          </p>
        ) : null}
      </div>
    </Link>
  );
}
