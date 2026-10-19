export {};

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }

  interface Navigator {
    globalPrivacyControl?: boolean;
  }
}
