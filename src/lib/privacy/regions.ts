/**
 * EEA, UK, and Switzerland. Google consent mode denies storage here until
 * the visitor opts in, and the cookie banner is shown only for these codes.
 * Vercel sends ISO 3166-1 alpha-2 in x-vercel-ip-country. UK is included
 * because a few edges emit that alias instead of GB.
 */
export const OPT_IN_COUNTRIES = [
  "AT",
  "BE",
  "BG",
  "CH",
  "CY",
  "CZ",
  "DE",
  "DK",
  "EE",
  "ES",
  "FI",
  "FR",
  "GB",
  "GR",
  "HR",
  "HU",
  "IE",
  "IS",
  "IT",
  "LI",
  "LT",
  "LU",
  "LV",
  "MT",
  "NL",
  "NO",
  "PL",
  "PT",
  "RO",
  "SE",
  "SI",
  "SK",
  "UK",
] as const;

const OPT_IN = new Set<string>(OPT_IN_COUNTRIES);

export function isOptInCountry(country: string | null | undefined): boolean {
  const code = (country ?? "").trim().toUpperCase();
  return OPT_IN.has(code);
}
