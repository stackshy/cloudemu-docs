import { Fragment, type ReactNode } from 'react';

/**
 * Tiny Go syntax highlighter for landing-page code panels. Tokenizes a
 * code string with a single regex (comments, string/raw-string literals,
 * numbers, identifiers) and tags each token with a color.
 *
 * Lighter than pulling in Shiki or Prism for what is effectively a handful of
 * static snippets across the home page. Colors mirror the `vesper` theme the
 * docs code blocks use, so the home panels read identically to the docs.
 */

const KEYWORDS = new Set([
  'break', 'case', 'chan', 'const', 'continue', 'default', 'defer',
  'else', 'fallthrough', 'for', 'func', 'go', 'goto', 'if', 'import',
  'interface', 'map', 'package', 'range', 'return', 'select', 'struct',
  'switch', 'type', 'var',
]);

const BUILTIN_LITERALS = new Set(['true', 'false', 'nil', 'iota']);

// Vesper palette — matches the docs' Shiki theme exactly.
const VESPER = {
  comment: '#8b8b8b',
  keyword: '#A0A0A0',
  peach: '#FFC799', // functions, types, exported names, numbers, constants
  string: '#99FFE4',
};

// Match (in order): line comment, string literal, raw-string literal,
// number, identifier. Anything that doesn't match is passed through.
const TOKEN_RE =
  /(\/\/[^\n]*|"(?:[^"\\\n]|\\.)*"|`[^`]*`|\b\d+(?:\.\d+)?\b|\b[A-Za-z_][A-Za-z0-9_]*\b)/g;

export function HighlightedGo({ code }: { code: string }) {
  const parts: ReactNode[] = [];
  let lastIdx = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  // Reset regex state across calls.
  TOKEN_RE.lastIndex = 0;

  while ((match = TOKEN_RE.exec(code)) !== null) {
    if (match.index > lastIdx) {
      parts.push(
        <Fragment key={key++}>{code.substring(lastIdx, match.index)}</Fragment>,
      );
    }

    const token = match[0];
    const color = classify(token);

    if (color) {
      parts.push(
        <span key={key++} style={{ color }}>
          {token}
        </span>,
      );
    } else {
      parts.push(<Fragment key={key++}>{token}</Fragment>);
    }

    lastIdx = match.index + token.length;
  }

  if (lastIdx < code.length) {
    parts.push(<Fragment key={key++}>{code.substring(lastIdx)}</Fragment>);
  }

  return <>{parts}</>;
}

/**
 * Neutral vesper mapping: gray keywords, warm-peach types/functions/numbers,
 * mint strings, muted comments. Everything else inherits the panel foreground.
 */
function classify(token: string): string {
  if (token.startsWith('//')) return VESPER.comment;
  if (token.startsWith('"') || token.startsWith('`')) return VESPER.string;
  if (KEYWORDS.has(token)) return VESPER.keyword;
  if (BUILTIN_LITERALS.has(token)) return VESPER.peach;
  if (/^\d/.test(token)) return VESPER.peach;
  // Pascal-case identifiers — types, constructors, exported names.
  if (/^[A-Z]/.test(token)) return VESPER.peach;
  return '';
}
