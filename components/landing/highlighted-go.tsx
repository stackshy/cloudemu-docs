import { Fragment, type ReactNode } from 'react';

/**
 * Tiny Go syntax highlighter for landing-page code panels. Tokenizes a
 * code string with a single regex (comments, string/raw-string literals,
 * numbers, identifiers) and tags each token with a tailwind color class.
 *
 * Lighter than pulling in Shiki or Prism for what is effectively six
 * static snippets across the home page.
 */

const KEYWORDS = new Set([
  'break', 'case', 'chan', 'const', 'continue', 'default', 'defer',
  'else', 'fallthrough', 'for', 'func', 'go', 'goto', 'if', 'import',
  'interface', 'map', 'package', 'range', 'return', 'select', 'struct',
  'switch', 'type', 'var',
]);

const BUILTIN_LITERALS = new Set(['true', 'false', 'nil', 'iota']);

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
    const cls = classify(token);

    if (cls) {
      parts.push(
        <span key={key++} className={cls}>
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
 * Token classes map to the --code-* palette in tokens.css — the exact same
 * colors the Shiki theme uses, so hand-rendered panels match docs code.
 */
function classify(token: string): string {
  if (token.startsWith('//')) return 'tok-c';
  if (token.startsWith('"') || token.startsWith('`')) return 'tok-s';
  if (KEYWORDS.has(token)) return 'tok-k';
  if (BUILTIN_LITERALS.has(token)) return 'tok-n';
  if (/^\d/.test(token)) return 'tok-n';
  // Pascal-case identifiers — types, constructors, exported names.
  if (/^[A-Z]/.test(token)) return 'tok-t';
  return '';
}
