/**
 * changelog-parse — turns GitHub release JSON into safe, structured blocks the
 * Release Ledger renders. Runs in the browser (the changelog fetches releases
 * live) and mirrors the build-time snapshot in scripts/import-changelog.mjs.
 * Parsing to blocks (never raw HTML) keeps arbitrary release notes XSS-safe.
 */

export type ChangelogBlock =
  | { t: 'h'; level: number; text: string }
  | { t: 'li'; text: string }
  | { t: 'p'; text: string }
  | { t: 'details'; summary: string; children: ChangelogBlock[] };

export interface ChangelogRelease {
  version: string;
  tag: string;
  title: string;
  date: string;
  url: string;
  blocks: ChangelogBlock[];
}

export interface RawRelease {
  tag_name: string;
  name?: string | null;
  body?: string | null;
  published_at?: string | null;
  created_at?: string | null;
  html_url: string;
  draft?: boolean;
  prerelease?: boolean;
}

const EMOJI = /[\u{1F000}-\u{1FAFF}\u{2190}-\u{21FF}\u{2300}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}\u{200D}]/gu;

function cleanTitle(name: string | null | undefined, tag: string): string {
  if (!name) return '';
  let t = name.replace(EMOJI, '').trim();
  t = t.replace(new RegExp(`^${tag}\\b`), '').replace(/^v?\d+\.\d+\.\d+\b/, '').trim();
  t = t.replace(/^[—\-:·]+\s*/, '').trim();
  return t;
}

const stripTags = (s: string) =>
  s.replace(
    /<\/?(details|summary|b|strong|i|em|p|div|a|img|picture|source|br|code|pre|h[1-6]|ul|ol|li|table|thead|tbody|tr|td|th|span)(\s[^>]*)?>/gi,
    '',
  );

/** Parse a release body into safe structured blocks (handles <details>). */
export function parseBody(body: string | null | undefined): ChangelogBlock[] {
  const src = (body || '').replace(/\r\n/g, '\n');
  const lines = src.split('\n');
  const root: ChangelogBlock[] = [];
  let det: { t: 'details'; summary: string; children: ChangelogBlock[] } | null = null;
  let awaitingSummary = false;
  let para: string[] = [];
  const target = () => (det ? det.children : root);
  const flush = () => {
    if (para.length) {
      const text = para.join(' ').trim();
      if (text) target().push({ t: 'p', text });
      para = [];
    }
  };

  for (let line of lines) {
    line = line.replace(EMOJI, '');

    if (/<details[\s>]/i.test(line)) {
      flush();
      det = { t: 'details', summary: '', children: [] };
      const sm = line.match(/<summary>([\s\S]*?)<\/summary>/i);
      if (sm) det.summary = stripTags(sm[1]).trim();
      else awaitingSummary = true;
      continue;
    }
    if (awaitingSummary) {
      const sm = line.match(/<summary>([\s\S]*?)<\/summary>/i);
      if (sm && det) { det.summary = stripTags(sm[1]).trim(); awaitingSummary = false; }
      continue;
    }
    if (/<\/details>/i.test(line)) {
      flush();
      if (det) { if (det.children.length || det.summary) root.push(det); det = null; }
      continue;
    }

    if (/^\s*<\/?(p|picture|source|img|div|a)[\s>]/i.test(line)) continue;
    line = stripTags(line);
    const trimmed = line.trim();
    if (!trimmed) { flush(); continue; }
    if (/^\|/.test(trimmed)) continue;
    if (/^\*{0,2}(full changelog)/i.test(trimmed)) continue;

    const h = trimmed.match(/^(#{1,4})\s+(.*)$/);
    if (h) {
      flush();
      const text = h[2].replace(/[:•]+\s*$/, '').trim();
      if (/^(release notes\b|v?\d+\.\d+\.\d+\b|what.s new\b|highlights?\b)/i.test(text) && text.length < 42) continue;
      if (text) target().push({ t: 'h', level: Math.min(Math.max(h[1].length, 2), 4), text });
      continue;
    }
    const li = trimmed.match(/^(?:\d+\.|[-*])\s+(.*)$/);
    if (li) { flush(); target().push({ t: 'li', text: li[1].trim() }); continue; }

    para.push(trimmed);
  }
  flush();
  if (det && (det.children.length || det.summary)) root.push(det);
  return root.slice(0, 80);
}

/** Non-draft, non-prerelease releases → ChangelogRelease[], newest first. */
export function parseReleases(raw: RawRelease[]): ChangelogRelease[] {
  return raw
    .filter((r) => !r.draft && !r.prerelease)
    .map((r) => ({
      version: r.tag_name.replace(/^v/, ''),
      tag: r.tag_name,
      title: cleanTitle(r.name, r.tag_name),
      date: (r.published_at || r.created_at || '').slice(0, 10),
      url: r.html_url,
      blocks: parseBody(r.body),
    }));
}
