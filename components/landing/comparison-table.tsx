import { Reveal } from '@/components/reveal';

/**
 * Comparison table with real mono glyphs: ✓ in --ok, ✗ in muted, ◐ for
 * partial. The cloudemu column gets an accent wash + accent top border.
 */

type Cell =
  | { kind: 'yes' }
  | { kind: 'no' }
  | { kind: 'partial' }
  | { kind: 'text'; value: string; strong?: boolean };

const yes: Cell = { kind: 'yes' };
const no: Cell = { kind: 'no' };
const partial: Cell = { kind: 'partial' };
const t = (value: string, strong = false): Cell => ({ kind: 'text', value, strong });

const ROWS: { feature: string; cells: [Cell, Cell, Cell] }[] = [
  { feature: 'Cost', cells: [t('$$$'), t('$'), t('Free', true)] },
  { feature: 'Speed', cells: [t('seconds'), t('100ms+'), t('~10ms', true)] },
  { feature: 'Works offline', cells: [no, yes, yes] },
  { feature: 'No Docker', cells: [yes, no, yes] },
  { feature: 'Setup', cells: [t('account + creds'), t('Docker + config'), t('go get', true)] },
  { feature: 'Realistic behavior', cells: [yes, partial, yes] },
  { feature: 'Multi-cloud', cells: [no, no, yes] },
  { feature: 'Real SDKs unchanged', cells: [yes, yes, yes] },
];

function Glyph({ cell }: { cell: Cell }) {
  switch (cell.kind) {
    case 'yes':
      return (
        <span className="font-mono text-sm text-ok" aria-label="yes">
          ✓
        </span>
      );
    case 'no':
      return (
        <span className="font-mono text-sm text-ink-muted" aria-label="no">
          ✗
        </span>
      );
    case 'partial':
      return (
        <span className="font-mono text-sm text-warn" aria-label="partial">
          ◐
        </span>
      );
    case 'text':
      return (
        <span
          className={
            cell.strong ? 'font-mono text-sm font-semibold text-ink' : 'text-sm text-ink-secondary'
          }
        >
          {cell.value}
        </span>
      );
  }
}

export function ComparisonTable() {
  return (
    <section className="w-full border-t border-line">
      <div className="mx-auto w-full max-w-4xl px-6 py-20">
        <Reveal>
          <p className="u-eyebrow mb-3">
            <span className="text-ink-3">02</span> · why cloudemu
          </p>
          <h2 className="text-3xl font-bold tracking-[-0.01em] text-ink">
            Three ways to test cloud code. One is free and instant.
          </h2>
        </Reveal>

        <Reveal delay={60} className="mt-8">
          <div className="overflow-x-auto rounded-lg border border-line">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-line-strong bg-surface">
                  <th className="px-5 py-3 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-ink-muted">
                    Feature
                  </th>
                  <th className="px-5 py-3 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-ink-muted">
                    Real cloud
                  </th>
                  <th className="px-5 py-3 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-ink-muted">
                    LocalStack / emulators
                  </th>
                  <th
                    className="bg-accent/5 px-5 py-3 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-ink"
                    style={{ boxShadow: 'inset 0 2px 0 var(--accent)' }}
                  >
                    cloudemu
                  </th>
                </tr>
              </thead>
              <tbody>
                {ROWS.map((row) => (
                  <tr
                    key={row.feature}
                    className="border-b border-line transition-colors last:border-b-0 hover:bg-surface"
                  >
                    <td className="px-5 py-3 text-sm font-medium text-ink">
                      {row.feature}
                    </td>
                    <td className="px-5 py-3">
                      <Glyph cell={row.cells[0]} />
                    </td>
                    <td className="px-5 py-3">
                      <Glyph cell={row.cells[1]} />
                    </td>
                    <td className="bg-accent/5 px-5 py-3">
                      <Glyph cell={row.cells[2]} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
