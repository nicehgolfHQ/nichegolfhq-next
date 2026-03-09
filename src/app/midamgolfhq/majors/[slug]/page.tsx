import { redirect } from "next/navigation";

export const dynamicParams = true;

export default async function MajorHubRedirectPage({
  params,
}: {
  params: { slug?: string } | Promise<{ slug?: string }>;
}) {
  const p: any = await Promise.resolve(params as any);
  const slug = p?.slug ?? "";
  if (!slug) redirect("/midamgolfhq");
  redirect(`/midamgolfhq/${slug}`);
}
