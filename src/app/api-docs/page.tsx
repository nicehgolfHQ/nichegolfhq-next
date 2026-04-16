import Link from "next/link";
import { SiteShell } from "@/components/SiteShell";

export const metadata = {
  title: "API Docs",
  description:
    "Developer reference for nichegolfHQ APIs and feeds — tournament data, RSS, and JSON feed endpoints.",
  alternates: { canonical: "/api-docs" },
};

const sampleTournament = {
  brand: "midam",
  slug: "gasparilla-invitational",
  name: "Gasparilla Invitational",
  month: 2,
  dates2026: "Feb 27 – Mar 1, 2026",
  typicalDates: "Late February",
  course: "Palma Ceia Golf & Country Club",
  location: "Tampa, FL",
  coursePar: 71,
  courseYardage: 6543,
  courseRating: 72.2,
  courseSlope: 134,
  courseDesigner: "Donald Ross",
  format: "54-hole stroke play",
  fieldSize: "120 players",
  eligibility: "Mid-amateur (25+), index 3.4 or better",
  overview: "One of the premier mid-amateur events in the Southeast.",
  prestige: "Historic Donald Ross layout; strong regional draw.",
  founded: 1948,
  url: "https://www.nichegolfhq.com/midamgolfhq/gasparilla-invitational",
};

const sampleResponse = {
  version: "1.0",
  description:
    "nichegolfHQ tournament data. Brands: midam, juniors, seniors. Filter with ?brand=midam|juniors|seniors.",
  count: 1,
  tournaments: [sampleTournament],
};

export default function ApiDocsPage() {
  return (
    <SiteShell>
      <div className="mx-auto w-full max-w-3xl px-5 py-12">
        <div className="mb-8 text-center">
          <h1 className="font-serif text-4xl font-semibold tracking-tight text-zinc-950">
            API Docs
          </h1>
          <p className="mt-3 text-sm text-zinc-600">
            Machine-readable endpoints for nichegolfHQ data
          </p>
        </div>

        <div className="space-y-10">
          {/* Tournament API */}
          <section className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm shadow-zinc-900/5">
            <h2 className="font-serif text-xl font-semibold tracking-tight text-zinc-950">
              Tournament data API
            </h2>
            <p className="mt-3 text-sm leading-7 text-zinc-700">
              Returns structured tournament data across all three nichegolfHQ
              brands: mid-am, junior, and senior.
            </p>

            <div className="mt-5 space-y-4">
              <div>
                <div className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
                  Endpoint
                </div>
                <code className="mt-1 block rounded-lg bg-zinc-50 px-4 py-3 text-sm text-zinc-900">
                  GET /api/tournaments
                </code>
              </div>

              <div>
                <div className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
                  Query parameters
                </div>
                <div className="mt-2 overflow-hidden rounded-lg border border-zinc-200">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-zinc-200 bg-zinc-50">
                        <th className="px-4 py-2 text-left font-semibold text-zinc-700">
                          Parameter
                        </th>
                        <th className="px-4 py-2 text-left font-semibold text-zinc-700">
                          Values
                        </th>
                        <th className="px-4 py-2 text-left font-semibold text-zinc-700">
                          Description
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 text-zinc-700">
                      <tr>
                        <td className="px-4 py-2 font-mono text-xs">brand</td>
                        <td className="px-4 py-2 font-mono text-xs">
                          midam
                        </td>
                        <td className="px-4 py-2">
                          Mid-amateur tournaments only
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 font-mono text-xs">brand</td>
                        <td className="px-4 py-2 font-mono text-xs">
                          juniors
                        </td>
                        <td className="px-4 py-2">
                          Junior major events only
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 font-mono text-xs">brand</td>
                        <td className="px-4 py-2 font-mono text-xs">
                          seniors
                        </td>
                        <td className="px-4 py-2">
                          Senior major events only
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 text-zinc-400" colSpan={3}>
                          Omit <code className="font-mono text-xs">?brand</code>{" "}
                          to receive all tournaments across all brands.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <div className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
                  Example requests
                </div>
                <div className="mt-2 space-y-2">
                  {[
                    "/api/tournaments",
                    "/api/tournaments?brand=midam",
                    "/api/tournaments?brand=juniors",
                    "/api/tournaments?brand=seniors",
                  ].map((url) => (
                    <code
                      key={url}
                      className="block rounded-lg bg-zinc-50 px-4 py-2 text-sm text-zinc-900"
                    >
                      GET {url}
                    </code>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
                  Response format
                </div>
                <pre className="mt-2 overflow-x-auto rounded-lg bg-zinc-950 px-5 py-4 text-xs leading-6 text-zinc-100">
                  {JSON.stringify(sampleResponse, null, 2)}
                </pre>
              </div>

              <div>
                <div className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
                  Tournament object fields
                </div>
                <div className="mt-2 overflow-hidden rounded-lg border border-zinc-200">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-zinc-200 bg-zinc-50">
                        <th className="px-4 py-2 text-left font-semibold text-zinc-700">
                          Field
                        </th>
                        <th className="px-4 py-2 text-left font-semibold text-zinc-700">
                          Type
                        </th>
                        <th className="px-4 py-2 text-left font-semibold text-zinc-700">
                          Description
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 text-xs text-zinc-700">
                      {[
                        ["brand", "string", '"midam" | "juniors" | "seniors"'],
                        ["slug", "string", "URL slug, e.g. gasparilla-invitational"],
                        ["name", "string", "Full event name"],
                        ["month", "number | string", "Month number (midam) or month string (juniors/seniors)"],
                        ["dates2026", "string | null", "Human-readable 2026 dates (midam only)"],
                        ["typicalDates", "string | null", "Typical annual dates if 2026 TBD (midam only)"],
                        ["course", "string | null", "Host course name"],
                        ["location", "string | null", "City, State"],
                        ["coursePar", "number | null", "Course par"],
                        ["courseYardage", "number | null", "Course yardage"],
                        ["courseRating", "number | null", "Course rating (midam only)"],
                        ["courseSlope", "number | null", "Slope rating (midam only)"],
                        ["courseDesigner", "string | null", "Course architect"],
                        ["format", "string | null", 'e.g. "72-hole stroke play"'],
                        ["fieldSize", "string | null", 'e.g. "64 players"'],
                        ["eligibility", "string | null", "Eligibility requirements"],
                        ["overview", "string | null", "Editorial overview"],
                        ["prestige", "string | null", "Prestige/history note (midam only)"],
                        ["founded", "number | null", "Year founded (midam only)"],
                        ["url", "string", "Canonical URL on nichegolfhq.com"],
                      ].map(([field, type, desc]) => (
                        <tr key={field}>
                          <td className="px-4 py-2 font-mono">{field}</td>
                          <td className="px-4 py-2 text-zinc-500">{type}</td>
                          <td className="px-4 py-2">{desc}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>

          {/* Feed endpoints */}
          <section className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm shadow-zinc-900/5">
            <h2 className="font-serif text-xl font-semibold tracking-tight text-zinc-950">
              Feed endpoints
            </h2>
            <p className="mt-3 text-sm leading-7 text-zinc-700">
              The Daily Briefs are available as RSS and JSON feeds for
              aggregators, readers, and automation.
            </p>

            <div className="mt-5 space-y-6">
              <div>
                <div className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
                  Daily briefs
                </div>
                <div className="mt-2 overflow-hidden rounded-lg border border-zinc-200">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-zinc-200 bg-zinc-50">
                        <th className="px-4 py-2 text-left font-semibold text-zinc-700">
                          Endpoint
                        </th>
                        <th className="px-4 py-2 text-left font-semibold text-zinc-700">
                          Format
                        </th>
                        <th className="px-4 py-2 text-left font-semibold text-zinc-700">
                          Description
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 text-xs text-zinc-700">
                      <tr>
                        <td className="px-4 py-2 font-mono">/briefs/feed.xml</td>
                        <td className="px-4 py-2">RSS 2.0</td>
                        <td className="px-4 py-2">
                          60 most recent daily briefs with titles, source URLs,
                          and why-it-matters text
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 font-mono">/briefs/feed.json</td>
                        <td className="px-4 py-2">JSON Feed 1.0</td>
                        <td className="px-4 py-2">
                          Same 60 briefs; each item&apos;s summary field contains
                          headlines, source URLs, and why text
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <div className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
                  Weekly archives
                </div>
                <div className="mt-2 overflow-hidden rounded-lg border border-zinc-200">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-zinc-200 bg-zinc-50">
                        <th className="px-4 py-2 text-left font-semibold text-zinc-700">
                          Endpoint
                        </th>
                        <th className="px-4 py-2 text-left font-semibold text-zinc-700">
                          Format
                        </th>
                        <th className="px-4 py-2 text-left font-semibold text-zinc-700">
                          Description
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 text-xs text-zinc-700">
                      <tr>
                        <td className="px-4 py-2 font-mono">/briefs/weeks/feed.xml</td>
                        <td className="px-4 py-2">RSS 2.0</td>
                        <td className="px-4 py-2">Weekly brief archives as RSS</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 font-mono">/briefs/weeks/feed.json</td>
                        <td className="px-4 py-2">JSON Feed 1.0</td>
                        <td className="px-4 py-2">Weekly brief archives as JSON</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>

          {/* LLM / discovery */}
          <section className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm shadow-zinc-900/5">
            <h2 className="font-serif text-xl font-semibold tracking-tight text-zinc-950">
              LLM &amp; discovery
            </h2>
            <p className="mt-3 text-sm leading-7 text-zinc-700">
              These plain-text files follow the{" "}
              <span className="font-semibold">llms.txt</span> convention for
              helping AI crawlers and assistants understand the site.
            </p>
            <div className="mt-5 overflow-hidden rounded-lg border border-zinc-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-200 bg-zinc-50">
                    <th className="px-4 py-2 text-left font-semibold text-zinc-700">
                      URL
                    </th>
                    <th className="px-4 py-2 text-left font-semibold text-zinc-700">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 text-xs text-zinc-700">
                  <tr>
                    <td className="px-4 py-2 font-mono">/llms.txt</td>
                    <td className="px-4 py-2">
                      Summary guidance: what the site is, canonical URLs,
                      discovery links
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-mono">/llms-full.txt</td>
                    <td className="px-4 py-2">
                      Full extended guidance: feed details, tournament schema,
                      sample brief format, attribution
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-mono">/sitemap.xml</td>
                    <td className="px-4 py-2">Standard sitemap for crawlers</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="text-sm text-zinc-700 underline-offset-4 hover:underline"
          >
            ← Back home
          </Link>
        </div>
      </div>
    </SiteShell>
  );
}
