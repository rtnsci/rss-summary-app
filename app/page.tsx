"use client";

import { FormEvent, useMemo, useState } from "react";

import styles from "./page.module.css";

type FeedItem = {
  title: string;
  link: string;
  pubDate: string;
  summary: string;
};

type FetchState = "idle" | "loading" | "success" | "error";

const DEMO_FEED_URL = "https://vercel.com/blog/rss.xml";

export default function HomePage() {
  const [feedUrl, setFeedUrl] = useState("");
  const [items, setItems] = useState<FeedItem[]>([]);
  const [state, setState] = useState<FetchState>("idle");
  const [error, setError] = useState<string | null>(null);

  const isEmpty = useMemo(
    () => state === "success" && items.length === 0,
    [items.length, state]
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await loadFeed(feedUrl.trim());
  };

  const loadFeed = async (url: string) => {
    if (!url) {
      setError("URLを入力してください");
      setState("error");
      setItems([]);
      return;
    }
    try {
      setState("loading");
      setError(null);
      const response = await fetch(`/api/feed?url=${encodeURIComponent(url)}`);
      if (!response.ok) {
        let message = "フィードの読み込みに失敗しました";
        try {
          const payload = await response.json();
          if (typeof payload?.message === "string") {
            message = payload.message;
          }
        } catch {
          // ignore json parsing errors
        }
        throw new Error(message);
      }
      const data: FeedItem[] = await response.json();
      setItems(data);
      setState("success");
    } catch (err) {
      console.error(err);
      setItems([]);
      setError(
        err instanceof Error ? err.message : "予期しないエラーが発生しました"
      );
      setState("error");
    }
  };

  const handleDemo = () => {
    setFeedUrl(DEMO_FEED_URL);
    void loadFeed(DEMO_FEED_URL);
  };

  return (
    <main className={styles.main}>
      <header className={styles.hero}>
        <h1 className={styles.title}>RSS Summary App</h1>
        <p className={styles.lead}>
          お気に入りのRSS/Atomフィードを読み込み、記事を約150字で素早く把握できます。
        </p>
      </header>

      <section className={styles.panel}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <label htmlFor="feed-url" className="visually-hidden">
            フィードURL
          </label>
          <input
            id="feed-url"
            name="feed-url"
            type="url"
            inputMode="url"
            placeholder="https://example.com/feed.xml"
            value={feedUrl}
            onChange={(event) => setFeedUrl(event.target.value)}
            className={styles.input}
            aria-invalid={state === "error" && !!error}
          />
          <div className={styles.actions}>
            <button type="submit" className={styles.primaryButton}>
              読み込み
            </button>
            <button
              type="button"
              className={styles.secondaryButton}
              onClick={handleDemo}
            >
              デモFeed
            </button>
          </div>
        </form>
        {state === "loading" && <p className={styles.status}>読み込み中...</p>}
        {state === "error" && error && (
          <p role="alert" className={styles.error}>
            {error}
          </p>
        )}
        {isEmpty && <p className={styles.status}>記事が見つかりませんでした。</p>}
      </section>

      <section className={styles.feedSection} aria-live="polite">
        <div className={styles.feedGrid} data-testid="feed-grid">
          {items.map((item) => (
            <article key={item.link} className={styles.card}>
              <h2 className={styles.cardTitle}>{item.title}</h2>
              <p className={styles.summary}>{item.summary}</p>
              <dl className={styles.meta}>
                <dt className="visually-hidden">公開日</dt>
                <dd>{new Date(item.pubDate).toLocaleString("ja-JP")}</dd>
              </dl>
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.cardLink}
              >
                記事を読む
              </a>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
