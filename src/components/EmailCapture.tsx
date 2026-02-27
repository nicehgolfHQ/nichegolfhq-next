"use client";

import Link from "next/link";
import { useState } from "react";

export default function EmailCapture() {
  const [email, setEmail] = useState("");
  const [focused, setFocused] = useState(false);

  return (
    <section className="relative overflow-hidden border-y border-white/5 bg-[#0f0f1a]">
      <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />

      <div className="mx-auto w-full max-w-6xl px-5 py-16 md:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl text-white md:text-4xl">
            The amateur golf brief. <span className="gradient-text">Every morning.</span>
          </h2>
          <p className="mt-3 text-base text-zinc-400">
            Junior, mid-am, and senior competitive golf — sourced, summarized, and delivered before your first tee time.
          </p>

          <form
            className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
            onSubmit={(e) => e.preventDefault()}
          >
            <div
              className={`relative w-full max-w-md flex-1 rounded-xl transition-all duration-300 ${
                focused ? "ring-2 ring-emerald-500/30" : ""
              }`}
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder="you@email.com"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-5 py-3.5 text-sm text-white placeholder-zinc-500 outline-none transition-all duration-300 focus:border-emerald-500/40 focus:bg-white/[0.07]"
              />
            </div>

            <Link
              href="/subscribe"
              className="group relative w-full overflow-hidden rounded-xl bg-emerald-600 px-8 py-3.5 text-sm font-bold text-white transition-all duration-300 hover:bg-emerald-500 hover:shadow-lg hover:shadow-emerald-500/25 sm:w-auto"
            >
              <span className="relative z-10">Subscribe free</span>
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
            </Link>
          </form>

          <p className="mt-4 text-xs text-zinc-500">Free. No spam. Unsubscribe anytime.</p>
        </div>
      </div>
    </section>
  );
}
