import { redirect } from "next/navigation";
import { listSeniorMajorSlugs } from "@/lib/seniorMajors";

export const dynamicParams = false;

export function generateStaticParams() {
  return listSeniorMajorSlugs().map((slug) => ({ slug }));
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  redirect(`/seniorgolfhq/${slug}`);
}
