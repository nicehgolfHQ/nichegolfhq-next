import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="relative border-t border-white/[0.06] bg-[#080811]">
      <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />

      <div className="mx-auto w-full max-w-6xl px-5 py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-3">
              <Image src="/brand/nichegolfhq/icon.png" alt="nichegolfHQ" width={32} height={32} />
              <span className="font-display text-lg text-white">nichegolfHQ</span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-zinc-500">
              An independent media and intelligence platform covering amateur golf across junior, mid-amateur, and senior competitive play.
            </p>
          </div>

          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400">Channels</h4>
            <nav className="mt-4 flex flex-col gap-2.5">
              <Link href="/juniorgolfhq" className="animated-underline w-fit text-sm text-zinc-500 transition-colors hover:text-white">
                juniorgolfHQ
              </Link>
              <Link href="/midamgolfhq" className="animated-underline w-fit text-sm text-zinc-500 transition-colors hover:text-white">
                midamgolfHQ
              </Link>
              <Link href="/seniorgolfhq" className="animated-underline w-fit text-sm text-zinc-500 transition-colors hover:text-white">
                seniorgolfHQ
              </Link>
            </nav>
          </div>

          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400">Content</h4>
            <nav className="mt-4 flex flex-col gap-2.5">
              <Link href="/briefs" className="animated-underline w-fit text-sm text-zinc-500 transition-colors hover:text-white">
                Daily Briefs
              </Link>
              <Link href="/subscribe" className="animated-underline w-fit text-sm text-zinc-500 transition-colors hover:text-white">
                Subscribe
              </Link>
              <Link href="/majors" className="animated-underline w-fit text-sm text-zinc-500 transition-colors hover:text-white">
                Majors
              </Link>
            </nav>
          </div>

          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400">Connect</h4>
            <div className="mt-4 flex gap-3">
              <a
                href="https://x.com/midamgolfhq"
                target="_blank"
                rel="noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-zinc-500 transition-all duration-200 hover:border-white/20 hover:bg-white/5 hover:text-white"
                aria-label="X"
              >
                <span className="text-sm font-black">X</span>
              </a>
              <a
                href="https://www.instagram.com/midamgolfhq/"
                target="_blank"
                rel="noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-zinc-500 transition-all duration-200 hover:border-white/20 hover:bg-white/5 hover:text-white"
                aria-label="Instagram"
              >
                <span className="text-sm font-black">IG</span>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/[0.06] pt-8 md:flex-row">
          <p className="text-xs text-zinc-600">© 2026 nichegolfHQ. All rights reserved.</p>
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
            </span>
            <span className="text-xs text-zinc-600">Covering amateur golf daily</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
