import { expect, test } from "@playwright/test";

const demoFeedItems = [
  {
    title: "Latest from Vercel",
    link: "https://vercel.com/blog/example",
    pubDate: new Date("2024-02-01T12:00:00Z").toISOString(),
    summary: "Vercelからの最新アップデートをお届けします。"
  },
  {
    title: "Next.js News",
    link: "https://nextjs.org/blog/example",
    pubDate: new Date("2024-02-02T15:00:00Z").toISOString(),
    summary: "Next.jsのリリース情報と開発者向けのヒントです。"
  }
];

const demoFeedUrl = "https://vercel.com/blog/rss.xml";

const invalidResponse = {
  message: "サポートされていないURL形式です"
};

test("デモFeedボタンで記事が表示される", async ({ page }) => {
  await page.route("**/api/feed?url=**", (route) => {
    if (route.request().url().includes(encodeURIComponent(demoFeedUrl))) {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(demoFeedItems)
      });
    }
    return route.continue();
  });

  await page.goto("/");
  await page.getByRole("button", { name: "デモFeed" }).click();
  const cards = page.locator('[data-testid="feed-grid"] article');

  await expect(cards).toHaveCount(demoFeedItems.length);
  await expect(cards.first().getByRole("heading", { level: 2 })).toHaveText(
    demoFeedItems[0].title
  );
});

test("無効なURLではエラー表示になる", async ({ page }) => {
  const invalidUrl = "ftp://invalid.example.com";

  await page.route("**/api/feed?url=**", (route) => {
    if (route.request().url().includes(encodeURIComponent(invalidUrl))) {
      return route.fulfill({
        status: 400,
        contentType: "application/json",
        body: JSON.stringify(invalidResponse)
      });
    }
    return route.continue();
  });

  await page.goto("/");
  await page.fill("input#feed-url", invalidUrl);
  await page.getByRole("button", { name: "読み込み" }).click();

  await expect(page.getByRole("alert")).toHaveText(invalidResponse.message);
});

test("モバイル幅ではカードが縦に並ぶ", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });

  await page.route("**/api/feed?url=**", (route) => {
    if (route.request().url().includes(encodeURIComponent(demoFeedUrl))) {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(demoFeedItems)
      });
    }
    return route.continue();
  });

  await page.goto("/");
  await page.getByRole("button", { name: "デモFeed" }).click();

  const cards = page.locator('[data-testid="feed-grid"] article');
  await expect(cards).toHaveCount(demoFeedItems.length);

  const firstBox = await cards.first().boundingBox();
  const secondBox = await cards.nth(1).boundingBox();

  expect(firstBox).not.toBeNull();
  expect(secondBox).not.toBeNull();

  if (!firstBox || !secondBox) {
    return;
  }

  expect(secondBox.x).toBeCloseTo(firstBox.x, 1);
  expect(secondBox.y).toBeGreaterThan(firstBox.y + firstBox.height - 10);
});
