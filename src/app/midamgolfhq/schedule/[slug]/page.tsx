import { redirect } from "next/navigation";
import { listMidAmTournamentSlugs } from "@/lib/tournaments/midam";

export const dynamicParams = false;

export function generateStaticParams() {
  return listMidAmTournamentSlugs().map((slug) => ({ slug }));
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  redirect(`/midamgolfhq/${slug}`);
}
