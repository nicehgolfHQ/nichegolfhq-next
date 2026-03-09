import { redirect } from "next/navigation";
import { listJuniorMajorSlugs } from "@/lib/juniorMajors";

export const dynamicParams = false;

export function generateStaticParams() {
  return listJuniorMajorSlugs().map((slug) => ({ slug }));
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  redirect(`/juniorgolfhq/${slug}`);
}
