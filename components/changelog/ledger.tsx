'use client';

import { useState, type ReactNode } from 'react';
import { RELEASES, type ChangelogBlock } from '@/lib/changelog.generated';

const PAGE = 10;

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
function fmtDate(d: string): string {
  const [y, m, day] = d.split('-');
  return `${MONTHS[Number(m) - 1]} ${Number(day)}, ${y}`;
}
const yearOf = (d: string) => d.split('-')[0];
const anchor = (v: string) => 'v' + v.replace(/\./g, '-');

const CAT: { re: RegExp; color: string }[] = [
  { re: /^(features?|added|new)/i, color: 'var(--accent)' },
  { re: /^(enhancement|improvement|changed?|change|highlights?)/i, color: 'var(--azure)' },
  { re: /^(fix|fixes|fixed|bug)/i, color: 'var(--ok)' },
  { re: /^(removed?|deprecat)/i, color: 'var(--danger)' },
  { re: /^security/i, color: 'var(--danger)' },
  { re: /^breaking/i, color: 'var(--warn)' },
];
const catColor = (t: string) => CAT.find((c) => c.re.test(t))?.color ?? null;

/** Plain-text preview: strip inline markdown, collapse, truncate. */
function preview(blocks: ChangelogBlock[], max = 140): string {
  const p = blocks.find((b) => b.t === 'p') as { text: string } | undefined;
  if (!p) return '';
  const plain = p.text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[*`_]/g, '')
    .trim();
  return plain.length > max ? plain.slice(0, max).replace(/\s+\S*$/, '') + '…' : plain;
}

/** Render a small safe subset of inline markdown as React (no HTML). */
function inline(text: string): ReactNode[] {
  const re = /(\*\*([^*]+)\*\*|`([^`]+)`|\[([^\]]+)\]\(([^)]+)\)|\*([^*]+)\*)/g;
  const out: ReactNode[] = [];
  let last = 0;
  let k = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) out.push(text.slice(last, m.index));
    if (m[2] !== undefined) out.push(<strong key={k++}>{m[2]}</strong>);
    else if (m[3] !== undefined) out.push(<code key={k++}>{m[3]}</code>);
    else if (m[4] !== undefined)
      out.push(
        <a key={k++} href={m[5]} target="_blank" rel="noreferrer">
          {m[4]}
        </a>,
      );
    else if (m[6] !== undefined) out.push(<em key={k++}>{m[6]}</em>);
    last = re.lastIndex;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

function Blocks({ blocks }: { blocks: ChangelogBlock[] }) {
  const out: ReactNode[] = [];
  let i = 0;
  while (i < blocks.length) {
    const b = blocks[i];
    if (b.t === 'li') {
      const items: ChangelogBlock[] = [];
      while (i < blocks.length && blocks[i].t === 'li') items.push(blocks[i++]);
      out.push(
        <ul key={i}>
          {items.map((it, j) => (
            <li key={j}>{inline((it as { text: string }).text)}</li>
          ))}
        </ul>,
      );
      continue;
    }
    if (b.t === 'details') {
      out.push(
        <details className="changelog-details" key={i}>
          <summary>{b.summary || 'Technical details'}</summary>
          <div className="changelog-details-body">
            <Blocks blocks={b.children} />
          </div>
        </details>,
      );
      i++;
      continue;
    }
    if (b.t === 'h') {
      if (b.level <= 2) {
        const color = catColor(b.text);
        out.push(
          <p className="changelog-cat" key={i}>
            {color && <span className="dot" style={{ background: color }} aria-hidden />}
            {b.text}
          </p>,
        );
      } else {
        out.push(
          <p className="changelog-sub" key={i}>
            {inline(b.text)}
          </p>,
        );
      }
      i++;
      continue;
    }
    out.push(<p key={i}>{inline(b.text)}</p>);
    i++;
  }
  return <>{out}</>;
}

export function Ledger() {
  const [visible, setVisible] = useState(PAGE);
  const shown = RELEASES.slice(0, visible);
  const remaining = RELEASES.length - shown.length;
  let lastYear = '';

  return (
    <div className="mt-4">
      {shown.map((r, idx) => {
        const y = yearOf(r.date);
        const showYear = y !== lastYear;
        lastYear = y;
        const id = anchor(r.version);
        const headline = r.title || `Release ${r.version}`;
        const lead = preview(r.blocks);

        return (
          <div key={r.tag}>
            {showYear && (
              <div className="sticky top-[57px] z-10 -mx-5 mb-2 bg-canvas/85 px-5 py-2 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-3 backdrop-blur sm:-mx-10 sm:px-10">
                {y}
              </div>
            )}

            <article id={id} className="grid scroll-mt-24 gap-4 py-6 md:grid-cols-[168px_minmax(0,1fr)] md:gap-10">
              <aside className="md:pt-2">
                <a
                  href={`#${id}`}
                  className="font-serif text-[24px] font-semibold leading-none tracking-[-0.02em] text-ink transition-colors hover:text-accent"
                >
                  {r.version}
                </a>
                <div className="mt-2 font-mono text-[12px] text-ink-3">{fmtDate(r.date)}</div>
                <div className="mt-2.5 flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-line-2 px-2.5 py-0.5 font-mono text-[10.5px] tracking-wide text-ink-3">
                    {r.tag}
                  </span>
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-[10.5px] text-ink-3 underline decoration-line-2 underline-offset-2 hover:text-accent"
                  >
                    notes ↗
                  </a>
                </div>
              </aside>

              <details className="release" open={idx === 0}>
                <summary>
                  <span className="release-node" aria-hidden />
                  <span className="release-head">
                    <span className="release-title">{headline}</span>
                    {lead && <span className="release-lead">{lead}</span>}
                  </span>
                  <span className="release-chevron" aria-hidden>▸</span>
                </summary>
                <div className="changelog-prose release-body">
                  <Blocks blocks={r.blocks} />
                </div>
              </details>
            </article>
          </div>
        );
      })}

      {remaining > 0 && (
        <div className="mt-4 flex items-center gap-4 border-t border-line pt-8">
          <button
            type="button"
            onClick={() => setVisible((v) => v + PAGE)}
            className="inline-flex items-center gap-2 rounded-[3px] border border-line-2 px-4 py-2.5 font-mono text-[12px] uppercase tracking-[0.06em] text-ink transition-colors hover:border-accent hover:text-accent"
          >
            Show earlier releases ↓
          </button>
          <span className="font-mono text-[11px] text-ink-3">
            {shown.length} of {RELEASES.length}
          </span>
        </div>
      )}
    </div>
  );
}
