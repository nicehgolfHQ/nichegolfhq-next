"use client";

import { useEffect, useState } from "react";
import { DO_NOT_SELL_COOKIE } from "@/lib/privacy/consentScript";

type Status =
  | { status: "idle" }
  | { status: "sending" }
  | { status: "sent" }
  | { status: "error"; message: string };

function readDoNotSell(): boolean {
  return document.cookie.split("; ").some((part) => part === `${DO_NOT_SELL_COOKIE}=1`);
}

function writeDoNotSell(optedOut: boolean) {
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${DO_NOT_SELL_COOKIE}=${optedOut ? "1" : "0"}; Path=/; Max-Age=31536000; SameSite=Lax${secure}`;
}

export function PrivacyChoices({ serverGpc }: { serverGpc: boolean }) {
  const [gpc, setGpc] = useState(serverGpc);
  const [optedOut, setOptedOut] = useState(serverGpc);
  const [status, setStatus] = useState<Status>({ status: "idle" });

  useEffect(() => {
    const signal = serverGpc || navigator.globalPrivacyControl === true;
    setGpc(signal);
    if (signal) {
      writeDoNotSell(true);
      setOptedOut(true);
      return;
    }
    setOptedOut(readDoNotSell());
  }, [serverGpc]);

  function onToggle() {
    if (gpc) return;
    const next = !optedOut;
    writeDoNotSell(next);
    setOptedOut(next);
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status.status === "sending") return;
    const form = e.currentTarget;
    const fd = new FormData(form);
    setStatus({ status: "sending" });
    try {
      const res = await fetch("/api/privacy-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: fd.get("type"),
          name: fd.get("name"),
          email: fd.get("email"),
          state: fd.get("state"),
          details: fd.get("details"),
          website: fd.get("website"),
          gpc: gpc || navigator.globalPrivacyControl === true,
        }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) throw new Error(data.error || "Could not send the request.");
      form.reset();
      setStatus({ status: "sent" });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Could not send the request.";
      setStatus({ status: "error", message });
    }
  }

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm shadow-zinc-900/5">
        <h2 className="text-sm font-semibold tracking-tight text-zinc-950">Do Not Sell or Share</h2>
        <p className="mt-3 text-sm leading-7 text-zinc-700">
          This switch is saved in this browser. We do not sell personal information or share it for targeted advertising.
          Turning it on records your opt-out on this device.
        </p>
        {gpc ? (
          <p className="mt-3 text-sm font-semibold text-zinc-950">GPC signal detected and honored.</p>
        ) : null}
        <button
          type="button"
          role="switch"
          aria-checked={optedOut}
          aria-label="Do Not Sell or Share My Personal Information"
          disabled={gpc}
          onClick={onToggle}
          className="mt-5 inline-flex items-center gap-3 disabled:cursor-not-allowed"
        >
          <span
            className={`relative h-6 w-11 rounded-full transition ${optedOut ? "bg-zinc-950" : "bg-zinc-300"}`}
          >
            <span
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition ${optedOut ? "left-5" : "left-0.5"}`}
            />
          </span>
          <span className="text-sm font-medium text-zinc-900">
            {optedOut ? "Opted out in this browser" : "Not opted out in this browser"}
          </span>
        </button>
      </section>

      <section className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm shadow-zinc-900/5">
        <h2 className="text-sm font-semibold tracking-tight text-zinc-950">Privacy request</h2>
        <p className="mt-3 text-sm leading-7 text-zinc-700">
          Cookie choices stay in this browser. To opt out across devices and from the newsletter, submit this form
          with your email and choose Opt out. We respond within 45 days.
        </p>
        <form onSubmit={onSubmit} className="relative mt-6 grid gap-4">
          <label className="grid gap-2">
            <span className="text-sm font-medium text-zinc-900">Request type</span>
            <select
              name="type"
              required
              defaultValue="opt-out"
              className="h-11 rounded-xl border border-zinc-200 bg-white px-3 text-sm outline-none focus:border-zinc-400"
            >
              <option value="opt-out">Opt out of sale/sharing and the newsletter</option>
              <option value="access">Access my information</option>
              <option value="delete">Delete my information</option>
              <option value="correct">Correct my information</option>
            </select>
          </label>
          <label className="grid gap-2">
            <span className="text-sm font-medium text-zinc-900">Name (optional)</span>
            <input
              name="name"
              maxLength={120}
              className="h-11 rounded-xl border border-zinc-200 bg-white px-4 text-sm outline-none focus:border-zinc-400"
            />
          </label>
          <label className="grid gap-2">
            <span className="text-sm font-medium text-zinc-900">Email</span>
            <input
              name="email"
              type="email"
              required
              maxLength={254}
              autoComplete="email"
              className="h-11 rounded-xl border border-zinc-200 bg-white px-4 text-sm outline-none focus:border-zinc-400"
            />
          </label>
          <label className="grid gap-2">
            <span className="text-sm font-medium text-zinc-900">State</span>
            <input
              name="state"
              required
              maxLength={80}
              className="h-11 rounded-xl border border-zinc-200 bg-white px-4 text-sm outline-none focus:border-zinc-400"
              placeholder="CA"
            />
          </label>
          <label className="grid gap-2">
            <span className="text-sm font-medium text-zinc-900">Details (optional)</span>
            <textarea
              name="details"
              rows={5}
              maxLength={4000}
              className="rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none focus:border-zinc-400"
            />
          </label>
          <div className="absolute -left-[10000px] h-0 w-0 overflow-hidden" aria-hidden="true">
            <label>
              Website
              <input name="website" tabIndex={-1} autoComplete="off" />
            </label>
          </div>
          <button
            type="submit"
            disabled={status.status === "sending"}
            className="h-11 rounded-full bg-zinc-950 text-sm font-medium text-white disabled:opacity-60"
          >
            {status.status === "sending" ? "Sending" : "Submit request"}
          </button>
          {status.status === "sent" ? (
            <p className="text-sm text-zinc-700">Request received. We will reply within 45 days.</p>
          ) : null}
          {status.status === "error" ? <p className="text-sm text-red-700">{status.message}</p> : null}
        </form>
      </section>
    </div>
  );
}
