import Image from "next/image";
import Link from "next/link";
import { KetchPreferencesLink } from "@/components/KetchPreferencesLink";

const SOCIAL = {
  midamgolfhq: { x: "https://www.x.com/midamgolfhq", instagram: "https://www.instagram.com/midamgolfhq" },
  juniorgolfhq: { x: "https://www.x.com/juniorgolfhq", instagram: "https://www.instagram.com/juniorgolfhq" },
  seniorgolfhq: { x: "https://www.x.com/seniorgolfhq", instagram: "https://www.instagram.com/seniorgolfhq" },
} as const;

type BrandKey = keyof typeof SOCIAL;

export function SiteShell({
  children,
  brandSlug,
}: {
  children: React.ReactNode;
  brandSlug?: string;
}) {
  const headerBrand =
    brandSlug === "midamgolfhq" || brandSlug === "juniorgolfhq" || brandSlug === "seniorgolfhq"
      ? brandSlug
      : "nichegolfhq";

  const logoSrc = headerBrand === "nichegolfhq" ? "/brand/nichegolfhq/logo-v2.png" : `/brand/${headerBrand}/logo.png`;

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-950 antialiased">
      <header className="sticky top-0 z-50 bg-black/20 backdrop-blur-sm">
        <div className="mx-auto grid w-full max-w-6xl grid-cols-3 items-center px-5 py-3">
          {/* left: menu */}
          <div className="flex items-center justify-start">
            <details className="group relative">
              <summary className="inline-flex cursor-pointer list-none items-center justify-center rounded-xl p-3 hover:bg-zinc-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400/60">
                <span className="sr-only">Open menu</span>
                <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6 text-zinc-700">
                  <path
                    fill="currentColor"
                    d="M4 6.75A.75.75 0 0 1 4.75 6h14.5a.75.75 0 0 1 0 1.5H4.75A.75.75 0 0 1 4 6.75Zm0 5.25A.75.75 0 0 1 4.75 11.25h14.5a.75.75 0 0 1 0 1.5H4.75A.75.75 0 0 1 4 12Zm.75 4.5a.75.75 0 0 0 0 1.5h14.5a.75.75 0 0 0 0-1.5H4.75Z"
                  />
                </svg>
              </summary>

              <div className="absolute left-0 mt-2 w-64 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-lg shadow-zinc-900/10">
                <div className="p-2">
                  <Link href="/" className="block rounded-xl px-3 py-2 text-sm text-zinc-800 hover:bg-zinc-50">
                    home
                  </Link>
                  <Link
                    href="/midamgolfhq"
                    className="mt-1 block rounded-xl px-3 py-2 text-sm text-zinc-800 hover:bg-zinc-50"
                  >
                    midamgolfHQ
                  </Link>
                  <Link
                    href="/juniorgolfhq"
                    className="mt-1 block rounded-xl px-3 py-2 text-sm text-zinc-800 hover:bg-zinc-50"
                  >
                    juniorgolfHQ
                  </Link>
                  <Link
                    href="/seniorgolfhq"
                    className="mt-1 block rounded-xl px-3 py-2 text-sm text-zinc-800 hover:bg-zinc-50"
                  >
                    seniorgolfHQ
                  </Link>

                  <div className="my-2 border-t border-zinc-200" />

                  <Link href="/briefs" className="block rounded-xl px-3 py-2 text-sm text-zinc-800 hover:bg-zinc-50">
                    briefs
                  </Link>

                  <div className="my-2 border-t border-zinc-200" />

                  <details className="group">
                    <summary className="flex cursor-pointer list-none items-center justify-between rounded-xl px-3 py-2 text-sm text-zinc-800 hover:bg-zinc-50">
                      <span>more</span>
                      <span className="text-zinc-400">▾</span>
                    </summary>
                    <div className="mt-1 space-y-1 pl-2">
                      <Link
                        href="/majors"
                        className="block rounded-xl px-3 py-2 text-sm text-zinc-800 hover:bg-zinc-50"
                      >
                        majors
                      </Link>
                      <Link href="/about" className="block rounded-xl px-3 py-2 text-sm text-zinc-800 hover:bg-zinc-50">
                        about
                      </Link>
                      <Link
                        href="/sponsors"
                        className="block rounded-xl px-3 py-2 text-sm text-zinc-800 hover:bg-zinc-50"
                      >
                        sponsor
                      </Link>
                      <Link
                        href="https://midamgolfhq.myshopify.com/?utm_source=shop_app"
                        target="_blank"
                        rel="noreferrer"
                        className="block rounded-xl px-3 py-2 text-sm text-zinc-800 hover:bg-zinc-50"
                      >
                        shop
                      </Link>
                      <Link
                        href="/contact"
                        className="block rounded-xl px-3 py-2 text-sm text-zinc-800 hover:bg-zinc-50"
                      >
                        contact us
                      </Link>
                    </div>
                  </details>
                </div>
              </div>
            </details>
          </div>

          {/* center: brand logo */}
          <div className="flex items-center justify-center">
            <Link href={headerBrand === "nichegolfhq" ? "/" : `/${headerBrand}`} className="rounded-xl px-2 py-1">
              <Image
                src={logoSrc}
                alt={headerBrand === "nichegolfhq" ? "nichegolfHQ" : headerBrand}
                width={420}
                height={120}
                priority
                className="h-[72px] w-auto md:h-[92px]"
              />
            </Link>
          </div>

          {/* right: subscribe */}
          <div className="flex items-center justify-end">
            <Link
              href="/subscribe"
              className="rounded-full bg-zinc-950 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
            >
              subscribe
            </Link>
          </div>
        </div>

        {/* top nav */}
        <nav className="mx-auto w-full max-w-6xl px-5 pb-3">
          <div className="flex items-center justify-center gap-6 overflow-x-auto border-t border-zinc-200/60 pt-3 text-sm text-zinc-700 [scrollbar-width:none]">
            <Link href="/" className="whitespace-nowrap border-b-2 border-transparent pb-1 hover:border-zinc-900 hover:text-zinc-900">Home</Link>
            <Link href="/juniorgolfhq" className="whitespace-nowrap border-b-2 border-transparent pb-1 hover:border-zinc-900 hover:text-zinc-900">Junior</Link>
            <Link href="/midamgolfhq" className="whitespace-nowrap border-b-2 border-transparent pb-1 hover:border-zinc-900 hover:text-zinc-900">Mid-Am</Link>
            <Link href="/seniorgolfhq" className="whitespace-nowrap border-b-2 border-transparent pb-1 hover:border-zinc-900 hover:text-zinc-900">Senior</Link>
            <Link href="/briefs" className="whitespace-nowrap border-b-2 border-transparent pb-1 hover:border-zinc-900 hover:text-zinc-900">Daily Briefs</Link>
          </div>
        </nav>
      </header>

      <main>{children}</main>

      <footer className="border-t border-zinc-200 bg-white">
        <div className="mx-auto w-full max-w-6xl px-5 py-8">
          <div className="flex flex-col items-center justify-center gap-3 text-center">
            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
              <KetchPreferencesLink label="Privacy Settings" />
              <Link href="/privacy" className="text-sm font-semibold text-zinc-900 underline underline-offset-2 hover:text-zinc-700">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-sm font-semibold text-zinc-900 underline underline-offset-2 hover:text-zinc-700">
                Terms of Use
              </Link>
            </div>
            <div className="max-w-3xl text-sm leading-6 text-zinc-500">
              nichegolfHQ is an independent media and intelligence platform covering amateur golf across junior, mid-amateur, and senior competitive play.
            </div>
            <div className="text-sm text-zinc-600">2026 nichegolfHQ all rights reserved</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
