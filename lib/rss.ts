import Parser from 'rss-parser';

export type FeedItem = {
  title: string;
  link: string;
  summary: string;
  published: string | null;
};

type ParserItem = {
  title?: string;
  link?: string;
  contentSnippet?: string;
  isoDate?: string;
  pubDate?: string;
};

const parser = new Parser();

export async function fetchFeedItems(feedUrl: string): Promise<FeedItem[]> {
  const feed = await parser.parseURL(feedUrl);
  return normaliseItems(feed.items ?? []);
}

export async function parseFeedXml(xml: string): Promise<FeedItem[]> {
  const feed = await parser.parseString(xml);
  return normaliseItems(feed.items ?? []);
}

function normaliseItems(items: ParserItem[]): FeedItem[] {
  return items.map((item) => ({
    title: item.title ?? 'Untitled entry',
    link: item.link ?? '#',
    summary: item.contentSnippet?.trim() ?? 'No description available.',
    published: item.isoDate ?? item.pubDate ?? null
  }));
}

export function summariseItems(items: FeedItem[], limit = 3): FeedItem[] {
  const safeLimit = Math.max(1, limit);

  return items
    .slice(0, safeLimit)
    .map((item) => ({
      ...item,
      summary: item.summary.length > 280 ? `${item.summary.slice(0, 277)}...` : item.summary
    }));
}

export function formatPublishedDate(date: string | null): string {
  if (!date) {
    return 'Unknown';
  }

  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) {
    return 'Unknown';
  }

  return parsed.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}
