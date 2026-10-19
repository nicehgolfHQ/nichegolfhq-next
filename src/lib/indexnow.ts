export const INDEXNOW_KEY = "ec120083fab42ae247b1f28b18a8807c";

const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";
const HOST = "www.nichegolfhq.com";

const HOST_URL = `https://${HOST}`;

export function urlsForThisHost(urls: string[]): string[] {
  return urls.filter((url) => {
    try {
      return new URL(url).hostname === HOST;
    } catch {
      return false;
    }
  });
}

export async function submitUrls(urls: string[]): Promise<void> {
  const urlList = urlsForThisHost(urls);
  if (urlList.length === 0) return;

  try {
    const response = await fetch(INDEXNOW_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host: HOST,
        key: INDEXNOW_KEY,
        keyLocation: `${HOST_URL}/${INDEXNOW_KEY}.txt`,
        urlList,
      }),
    });

    if (!response.ok) {
      console.error(
        `IndexNow submission failed: ${response.status} ${response.statusText}`
      );
    } else {
      console.log(`IndexNow: submitted ${urlList.length} URL(s)`);
    }
  } catch (err) {
    console.error("IndexNow submission error:", err);
  }
}
