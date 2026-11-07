import Image from "next/image";
import type { NewsArticleHeader } from "@/lib/tournaments/types";

export function ArticleHeader({
  header,
  priority = false,
}: {
  header: NewsArticleHeader;
  priority?: boolean;
}) {
  return (
    <div
      className="relative mb-6 w-full overflow-hidden rounded-2xl bg-zinc-900"
      style={{ aspectRatio: "16 / 9" }}
    >
      <Image
        src={header.src}
        alt={header.alt}
        fill
        priority={priority}
        className="object-cover"
        style={{ objectPosition: header.objectPosition ?? "center" }}
        sizes="(max-width: 768px) 100vw, 768px"
      />
    </div>
  );
}
