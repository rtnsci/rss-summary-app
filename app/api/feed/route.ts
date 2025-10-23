import Parser from "rss-parser";
import { NextResponse } from "next/server";

import { summarizeFromContent } from "@/lib/summarize";

type FeedItemOutput = {
  title: string;
  link: string;
  pubDate: string;
  summary: string;
};

type FeedParserItem = {
  title?: string;
  link?: string;
  pubDate?: string;
  isoDate?: string;
  content?: string;
  contentSnippet?: string;
  summary?: string;
  description?: string;
  contentEncoded?: string;
};

const parser: Parser<unknown, FeedParserItem> = new Parser({
  customFields: {
    item: [["content:encoded", "contentEncoded"]]
  }
});

export const runtime = "nodejs";

function sanitizeUrl(candidate: string): string | null {
  try {
    const url = new URL(candidate);
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return null;
    }
    return url.toString();
  } catch {
    return null;
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const urlParam = searchParams.get("url");

  if (!urlParam) {
    return NextResponse.json(
      { message: "url クエリパラメータを指定してください" },
      { status: 400 }
    );
  }

  const sanitizedUrl = sanitizeUrl(urlParam);

  if (!sanitizedUrl) {
    return NextResponse.json(
      { message: "サポートされていないURL形式です" },
      { status: 400 }
    );
  }

  try {
    const feed = await parser.parseURL(sanitizedUrl);
    const items: FeedItemOutput[] = (feed.items ?? []).map((item) => {
      const description =
        item.contentSnippet ??
        item.summary ??
        item.description ??
        item.content ??
        item.contentEncoded ??
        "";

      const summary = summarizeFromContent(
        item.title ?? undefined,
        description
      );

      return {
        title: item.title ?? "(タイトル不明)",
        link: item.link ?? sanitizedUrl,
        pubDate: item.isoDate ?? item.pubDate ?? new Date().toISOString(),
        summary: summary || "概要を取得できませんでした"
      };
    });

    return NextResponse.json(items);
  } catch (error) {
    console.error("Failed to parse feed", error);
    return NextResponse.json(
      { message: "フィードの解析に失敗しました" },
      { status: 502 }
    );
  }
}
