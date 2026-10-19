export const PRIVACY_REQUEST_TYPES = ["access", "delete", "correct", "opt-out"] as const;

export type PrivacyRequestType = (typeof PRIVACY_REQUEST_TYPES)[number];

export const OPT_OUT_SCOPE = "all";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_WINDOW = 5;

type Bucket = { count: number; reset: number };
const buckets = new Map<string, Bucket>();

export type PrivacyRequestInput = {
  type: PrivacyRequestType;
  email: string;
  name: string | null;
  state: string;
  details: string | null;
  gpc: boolean;
  honeypot: string;
};

export function rateLimitPrivacyRequest(key: string, now = Date.now()): boolean {
  const bucket = buckets.get(key);
  if (!bucket || now > bucket.reset) {
    buckets.set(key, { count: 1, reset: now + WINDOW_MS });
    return true;
  }
  if (bucket.count >= MAX_PER_WINDOW) return false;
  bucket.count += 1;
  return true;
}

export function parsePrivacyRequest(body: unknown): { ok: true; value: PrivacyRequestInput } | { ok: false; error: string } {
  if (!body || typeof body !== "object") {
    return { ok: false, error: "Missing request." };
  }
  const raw = body as Record<string, unknown>;
  const type = typeof raw.type === "string" ? raw.type.trim() : "";
  if (!PRIVACY_REQUEST_TYPES.includes(type as PrivacyRequestType)) {
    return { ok: false, error: "Choose a request type." };
  }
  const email = typeof raw.email === "string" ? raw.email.trim() : "";
  if (!email || email.length > 254 || !EMAIL_RE.test(email)) {
    return { ok: false, error: "Enter a valid email address." };
  }
  const nameRaw = typeof raw.name === "string" ? raw.name.trim() : "";
  if (nameRaw.length > 120) {
    return { ok: false, error: "Name is too long." };
  }
  const state = typeof raw.state === "string" ? raw.state.trim() : "";
  if (!state || state.length > 80) {
    return { ok: false, error: "Enter your state or region." };
  }
  const detailsRaw = typeof raw.details === "string" ? raw.details.trim() : "";
  if (detailsRaw.length > 4000) {
    return { ok: false, error: "Details are too long." };
  }
  const honeypot = typeof raw.website === "string" ? raw.website.trim() : "";
  return {
    ok: true,
    value: {
      type: type as PrivacyRequestType,
      email,
      name: nameRaw || null,
      state,
      details: detailsRaw || null,
      gpc: raw.gpc === true,
      honeypot,
    },
  };
}
