# REVAMP_SUMMARY — "The Wire" design system

Concept: **an instrument, not a brochure.** Monospace-forward, one phosphor-green
signal accent, semantic provider accents, depth from surface steps + 1px borders,
and every signature animation modeled on traffic moving between an SDK and cloudemu.

## Per-phase changes

### Phase 0 — Audit
`REVAMP_AUDIT.md`: full route/component inventory, 10 Kill-List patterns located,
hardcoded colors catalogued, two stale-content bugs found (7/16 SDK coverage claims).

### Phase 1 — Foundation
- `app/tokens.css`: the single source of truth — dark (primary) + light (first-class)
  surfaces, text, **one** signal accent (`#4ade80` dark / `#047857` light), semantic
  provider accents (AWS amber / Azure blue / GCP green, text-safe + vivid variants),
  callout semantics, code palette, one popover shadow, the signal easing curve.
- Tailwind v4 `@theme inline` mapping (`bg-surface`, `text-ink`, `text-signal`, …)
  and a full `--color-fd-*` retint so every fumadocs surface consumes the tokens.
- Fonts: **Instrument Sans** (UI/display) + **JetBrains Mono** (identity mono) via
  `next/font`, `display: swap`, zero CLS.
- Primitives: `.u-eyebrow` mono labels, the one inline-code chip, `.u-btn` pair
  (inner-glow hover, 0.98 press), focus rings (2px accent, offset 2), global
  reduced-motion kill, sub-perceptual dot-grid canvas texture (dark only, 3%).
- Thin mono announcement bar (accent-chipped `v2.0.0`, dismiss persisted) replaces
  the rainbow banner. Skip-to-content link. `MotionConfig reducedMotion="user"`.

### Phase 2 — Code system
- Custom Shiki themes (`cloudemu-dark` / `cloudemu-light`) written against the token
  palette; wired via `rehypeCodeOptions` with fumadocs' notation transformers kept
  (highlight / word-highlight / diff / focus) plus a transformer stamping
  `data-language` on every pre.
- `CodePre` — the ONE code surface: filename header with mono language mark + copy
  morph (icon→check); **terminal chrome** for bash/sh/console — always-dark inset
  pane, CSS-drawn accent `$` prompts that copy can never pick up.
- Focus lines dim to 40% (not blurred); highlighted lines get accent wash + rail;
  diff rails retinted to ok/error tokens.
- **Globally-synced provider tabs**: `ProviderTabs`/`ProviderTab` on a
  localStorage-backed store (`useSyncExternalStore`) — choose AWS once, every block
  on the site follows, persisted across visits.
- `MorphCode` — the **Tab Morph**: per-line keyed framer-motion transitions; lines
  identical across providers hold perfectly still, changed lines slide out/in
  (200ms, 15ms/line stagger). The product's pitch as an interaction.
- Landing tokenizer re-emits `.tok-*` classes from the same `--code-*` palette.

### Phase 3 — Docs shell
Sidebar: accent left-rail + `--accent-dim` wash on the active item, mono group
labels. TOC: mono "ON THIS PAGE" eyebrow, accent scroll-spy. Prose: 70ch measure,
h2 24px accent top-rules, accent heading anchors, mono uppercase table headers with
horizontal-only rules + row hover, retinted search dialog with mono input and kbd
chips. (The bulk of the shell rides on the Phase-1 fd-token retint.)

### Phase 4 — Landing
- **Hero**: asymmetric two-column; `// zero-cost cloud emulation for Go` eyebrow;
  solid headline with one accent-underlined phrase; **Terminal Type-On** install
  command as the hero CTA (30ms/char, block cursor, copy after settle); **Packet
  Flow** diagram — provider-accent wires, protocol-labeled square packets
  (`S3 REST`, `ARM JSON`, `GCP REST`), arrival pulses, return packets; mono stat
  strip `3 PROVIDERS · 16 DOMAINS · 48 SERVICES · ~10MS · 0 DEPS` with the
  **Latency Ticker** (2,400ms → ~10ms, once, on view).
- "Don't rewrite your tests. **Repoint them.**" — solid accent phrase, MorphCode
  with endpoint-line focus.
- Comparison table: mono `✓`(ok) / `✗`(muted) / `◐`(warn) glyphs — the
  empty-cell bug is gone; cloudemu column accent-washed with accent top border.
- Feature grid with hierarchy: 2 hero cards carrying live mini-visuals (packet
  wire; chaos strip) + 6 compact mono-titled cards.
- **Coverage Matrix**: 16 domains × 3 providers, diagonal power-on sweep,
  breathing accent dots, provider-tinted service names per cell.
- Portable-API section on MorphCode; terminal CTA band on the inset surface.
- Content fix shipped with the rebuild: coverage is **16/16 SDK-live** (the old
  page claimed 7/16 "in progress" — stale since cloudemu v1.9.0).

### Phase 5 — Content
Installation migration guide uses a real diff block; Quick Start spotlights
`BaseEndpoint` via `[!code focus]`, replaces the ASCII art with PacketFlow
(plays once on view), unifies provider snippets into synced ProviderTabs, and
drops the stale "remaining 7 domains" paragraph; Chaos gets the failure-window
timeline; blog index is a dated list (mono dates, display titles); 404 is a
terminal: `$ cloudemu route /this-page → Error: RouteNotFound (code 404)`.

### Phase 6 — QA gate
- Kill-List greps: zero gradient text, zero rainbow banner, zero glow/blur orbs,
  zero traffic lights, zero emoji icons, zero stock-card patterns, zero palette
  classes as semantics, zero hex outside `tokens.css`/`shiki-themes.ts`.
- All route types return 200 (landing, docs root, quick-start, installation,
  chaos, service page, blog index/post) and 404 renders the terminal page.
- 46/46 pages generate; TypeScript clean.
- Reduced motion honored at three layers (CSS kill, MotionConfig, matchMedia in
  every bespoke animation); ambient animations pause off-viewport
  (IntersectionObserver in PacketFlow / matrix / ticker / type-on).
- Keyboard: skip link, 2px accent focus-visible everywhere, tabs/copy are real
  buttons with labels.

## Deliberate deviations from the brief (with reasoning)

1. **Logo icon keeps its two-hue gradient.** The audit scoped gradient removal to
   *text*; the icon is the established brand mark (same SVG ships in the cloudemu
   repo/releases). Wordmark gradient removed — `cloud` ink + `emu` accent.
2. **Code-block "wrap" toggle and hover annotation popovers not built.** Copy,
   filename header, line-highlight, diff, and focus cover every current content
   need; both extras add chrome with no present call sites. Revisit when a page
   needs them.
3. **Line numbers off by default.** Most snippets are <15 lines; numbers are
   opt-in per block via the standard `lineNumbers` meta.
4. **Sidebar active rail doesn't FLIP-slide between items** — it's a per-item
   rail via CSS on fumadocs' `data-active`. A shared-layout slide requires
   forking the sidebar component; poor cost/benefit.
5. **22 service pages were not rewritten onto a bespoke header template.** They
   inherit the full system (tokens, code chrome, tables, callouts). A per-page
   provider-chip header is a content project; recommended follow-up.
6. **Terminal panes stay dark in light theme** — instrument screens are dark;
   this is the deliberate `--bg-inset` behavior, tested for contrast.
7. **Display size tops at ~54px** (brief: 56–72) — balanced against the
   two-column hero; at 72px the headline wraps badly at laptop widths.
8. **White-alpha hairlines (`border-white/10`) on inset surfaces** (terminal
   chrome, CTA band) instead of a dedicated token — they only ever sit on the
   always-dark inset, where theme-invariant hairlines are correct.
