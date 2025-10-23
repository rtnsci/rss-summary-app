import { describe, expect, it } from "vitest";

import { summarizeFeedItem } from "@/lib/summarize";

describe("summarizeFeedItem", () => {
  it("combines title and description and limits to 150 characters", () => {
    const title = "テスト記事のタイトル";
    const description =
      "これはテストの説明文です。日本語とEnglish textが混在しており、要約が正しく動作するかを確認します。" +
      "余分な文章を追加して150文字を超えるようにしてみます。";

    const summary = summarizeFeedItem({ title, description });

    expect(summary.startsWith(title)).toBe(true);
    expect(Array.from(summary).length).toBeLessThanOrEqual(150);
    expect(summary.endsWith("…")).toBe(true);
  });

  it("strips HTML tags and decodes entities", () => {
    const summary = summarizeFeedItem({
      title: "Sample",
      description: "<p>Hello &amp; こんにちは &#12354;</p>"
    });

    expect(summary).toContain("Hello & こんにちは あ");
  });

  it("returns empty string when no content is provided", () => {
    expect(summarizeFeedItem({})).toBe("");
  });
});
