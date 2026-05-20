import type { HowToPlayEntry } from "./types";

function howToPlayToText(entries: HowToPlayEntry[]): string {
  return entries
    .map((e) => [e.label, e.note].filter(Boolean).join(" — "))
    .filter(Boolean)
    .join(". ");
}

export function buildFaqLd(t: {
  name: string;
  howToPlay?: HowToPlayEntry[];
  format?: string;
  eligibility?: string;
}) {
  if (!t.howToPlay || t.howToPlay.length === 0) return null;

  const mainEntity: Array<Record<string, unknown>> = [
    {
      "@type": "Question",
      name: `How do I play in the ${t.name}?`,
      acceptedAnswer: {
        "@type": "Answer",
        text: howToPlayToText(t.howToPlay),
      },
    },
  ];

  if (t.format) {
    mainEntity.push({
      "@type": "Question",
      name: `What is the format of the ${t.name}?`,
      acceptedAnswer: {
        "@type": "Answer",
        text: t.format,
      },
    });
  }

  if (t.eligibility) {
    mainEntity.push({
      "@type": "Question",
      name: `What are the eligibility requirements for the ${t.name}?`,
      acceptedAnswer: {
        "@type": "Answer",
        text: t.eligibility,
      },
    });
  }

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity,
  };
}
