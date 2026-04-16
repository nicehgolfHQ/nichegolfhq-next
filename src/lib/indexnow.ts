export const INDEXNOW_KEY = "ec120083fab42ae247b1f28b18a8807c";

const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";
const HOST = "www.nichegolfhq.com";

export async function submitUrls(urls: string[]): Promise<void> {
  if (urls.length === 0) return;

  try {
    const response = await fetch(INDEXNOW_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host: HOST,
        key: INDEXNOW_KEY,
        urlList: urls,
      }),
    });

    if (!response.ok) {
      console.error(
        `IndexNow submission failed: ${response.status} ${response.statusText}`
      );
    } else {
      console.log(`IndexNow: submitted ${urls.length} URL(s)`);
    }
  } catch (err) {
    console.error("IndexNow submission error:", err);
  }
}
