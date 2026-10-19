import { ImageResponse } from "next/og";
import briefsData from "@/content/briefs.generated.json";
import { briefDateLabel } from "@/lib/briefSeo";

export const alt = "nichegolfHQ Daily Brief";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type DailyBrief = {
  date: string;
  title: string;
  items: Array<{ title: string; why?: string }>;
};

function getBriefs(): DailyBrief[] {
  const raw: any = briefsData as any;
  const briefs = raw?.briefs ?? raw?.default?.briefs;
  return Array.isArray(briefs) ? (briefs as DailyBrief[]) : [];
}

export default async function BriefOgImage({
  params,
}: {
  params: { date?: string } | Promise<{ date?: string }>;
}) {
  const p = await Promise.resolve(params);
  const date = p?.date ?? "";
  const brief = getBriefs().find((b) => b.date === date) ?? null;
  const headline = brief?.items[0]?.title?.trim() || "Daily Brief";
  const more = brief && brief.items.length > 1 ? `+ ${brief.items.length - 1} more` : "";
  const label = brief ? `Daily Brief · ${briefDateLabel(brief.date)}` : "Daily Brief";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#18181b",
          color: "#fafafa",
          padding: "64px 72px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 28, letterSpacing: 2, color: "#a1a1aa", textTransform: "uppercase" }}>
            nichegolfHQ
          </div>
          <div style={{ marginTop: 18, fontSize: 32, color: "#d4d4d8" }}>{label}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 56, lineHeight: 1.15, fontWeight: 700 }}>{headline}</div>
          {more ? <div style={{ marginTop: 24, fontSize: 32, color: "#a1a1aa" }}>{more}</div> : null}
        </div>
      </div>
    ),
    { ...size }
  );
}
