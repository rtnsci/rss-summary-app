import { describe, expect, it } from 'vitest';

import { formatPublishedDate, summariseItems, type FeedItem } from '@/lib/rss';

const baseItems: FeedItem[] = Array.from({ length: 4 }, (_, index) => ({
  title: `Article ${index + 1}`,
  link: `https://example.com/article-${index + 1}`,
  summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'.repeat(index + 1),
  published: '2024-05-20T12:00:00.000Z'
}));

describe('summariseItems', () => {
  it('limits entries and truncates long summaries', () => {
    const result = summariseItems(baseItems, 2);
    expect(result).toHaveLength(2);
    expect(result[0].summary.endsWith('...')).toBe(false);
    expect(result[1].summary.endsWith('...')).toBe(true);
  });
});

describe('formatPublishedDate', () => {
  it('formats ISO date strings for display', () => {
    expect(formatPublishedDate('2024-05-22T09:15:00.000Z')).toContain('2024');
  });

  it('returns fallback for invalid dates', () => {
    expect(formatPublishedDate('invalid-date')).toBe('Unknown');
    expect(formatPublishedDate(null)).toBe('Unknown');
  });
});
