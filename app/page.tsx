import { readFile } from 'node:fs/promises';
import path from 'node:path';
import Link from 'next/link';

import { formatPublishedDate, parseFeedXml, summariseItems } from '@/lib/rss';

async function loadSampleFeed() {
  const filePath = path.join(process.cwd(), 'data', 'sample-feed.xml');
  const xml = await readFile(filePath, 'utf8');
  const items = await parseFeedXml(xml);
  return summariseItems(items, 5);
}

function getHostname(link: string): string {
  try {
    return new URL(link).hostname.replace(/^www\./, '');
  } catch (error) {
    return 'unknown';
  }
}

export default async function HomePage() {
  const items = await loadSampleFeed();

  return (
    <main>
      <header>
        <h1>Daily Tech Digest</h1>
        <p>
          Preview of how RSS headlines are summarised before being sent to your inbox. Update the{' '}
          <code>sample-feed.xml</code> file or point to a live feed to customise the dashboard.
        </p>
      </header>

      <section className="feed-list">
        {items.map((item) => (
          <article key={item.link} className="feed-item">
            <h2>
              <Link href={item.link} target="_blank" rel="noreferrer">
                {item.title}
              </Link>
            </h2>
            <p>{item.summary}</p>
            <div className="feed-meta">
              <span aria-label="Published">
                <strong>Published</strong>
                {formatPublishedDate(item.published)}
              </span>
              <span aria-label="Link">
                <strong>Source</strong>
                {getHostname(item.link)}
              </span>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
