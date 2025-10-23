const MAX_LENGTH = 150;

const htmlEntityMap: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " "
};

function decodeEntities(input: string): string {
  return input.replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (match, entity: string) => {
    const lower = entity.toLowerCase();
    if (lower.startsWith("#x")) {
      const codePoint = parseInt(lower.slice(2), 16);
      return Number.isFinite(codePoint) ? String.fromCodePoint(codePoint) : match;
    }
    if (lower.startsWith("#")) {
      const codePoint = parseInt(lower.slice(1), 10);
      return Number.isFinite(codePoint) ? String.fromCodePoint(codePoint) : match;
    }
    return htmlEntityMap[lower] ?? match;
  });
}

function stripHtml(input: string): string {
  return input.replace(/<[^>]+>/g, "");
}

function normalizeWhitespace(input: string): string {
  return input.replace(/\s+/g, " ").trim();
}

function truncateToLength(text: string, maxLength: number): string {
  const characters = Array.from(text);
  if (characters.length <= maxLength) {
    return text;
  }
  return `${characters.slice(0, maxLength - 1).join("")}…`;
}

export function summarizeFeedItem({
  title,
  description
}: {
  title?: string | null;
  description?: string | null;
}): string {
  const safeTitle = title?.trim() ?? "";
  const decodedDescription = description ? decodeEntities(description) : "";
  const plainDescription = normalizeWhitespace(stripHtml(decodedDescription));

  const combined = [safeTitle, plainDescription]
    .filter((value) => value.length > 0)
    .join(" ｜ ");

  if (!combined) {
    return "";
  }

  return truncateToLength(combined, MAX_LENGTH);
}

export function summarizeFromContent(
  title: string | undefined,
  content: string | undefined
) {
  return summarizeFeedItem({ title, description: content });
}
