import type { ThemeRegistration } from 'shiki';

/**
 * Custom Shiki themes written against tokens.css — one calm, low-saturation
 * palette, two modes. Values are literal because Shiki inlines them; they
 * MUST stay in sync with the --code-* tokens in app/tokens.css.
 *
 * Strings warm sand, keywords cool blue, functions text-1, comments muted
 * italic. Nothing saturated; code should read, not shout.
 */

// Colours meet WCAG AA (4.5:1) against the code surface (--bg-3): #eae5d6
// (light) / #201f17 (dark). Shiki's own bg is transparent, so contrast is
// measured against the warm paper, not the theme bg.
const dark = {
  keyword: '#7eb6ff',
  string: '#c9a97c',
  comment: '#8c95a2', // lifted for AA on dark paper
  func: '#f2f4f6',
  type: '#a9b1bc',
  number: '#c9a97c',
  punct: '#9aa2b0',
  plain: '#d5dae0',
  bg: '#171b21',
};

const light = {
  keyword: '#1c56a8', // darkened for AA
  string: '#705625',
  comment: '#565a61',
  func: '#17191c',
  type: '#494f57',
  number: '#705625',
  punct: '#4f545c',
  plain: '#24272c',
  bg: '#f1f1ef',
};

function makeTheme(
  name: string,
  type: 'dark' | 'light',
  c: typeof dark,
): ThemeRegistration {
  return {
    name,
    type,
    colors: {
      'editor.background': c.bg,
      'editor.foreground': c.plain,
    },
    settings: [
      { settings: { foreground: c.plain, background: c.bg } },
      {
        scope: ['comment', 'punctuation.definition.comment'],
        settings: { foreground: c.comment, fontStyle: 'italic' },
      },
      {
        scope: [
          'string',
          'string.quoted',
          'string.quoted.raw',
          'punctuation.definition.string',
        ],
        settings: { foreground: c.string },
      },
      {
        scope: [
          'keyword',
          'keyword.control',
          'keyword.operator.assignment',
          'storage',
          'storage.type',
          'storage.modifier',
          'keyword.import',
          'keyword.package',
        ],
        settings: { foreground: c.keyword },
      },
      {
        scope: [
          'entity.name.function',
          'support.function',
          'meta.function-call entity.name.function',
        ],
        settings: { foreground: c.func },
      },
      {
        scope: [
          'entity.name.type',
          'support.type',
          'support.class',
          'entity.name.tag',
          'entity.name.namespace',
          'entity.other.attribute-name',
        ],
        settings: { foreground: c.type },
      },
      {
        scope: [
          'constant.numeric',
          'constant.language',
          'constant.other',
          'variable.other.constant',
        ],
        settings: { foreground: c.number },
      },
      {
        scope: ['keyword.operator', 'punctuation'],
        settings: { foreground: c.punct },
      },
      {
        scope: ['variable', 'variable.other', 'variable.parameter'],
        settings: { foreground: c.plain },
      },
      // JSON / YAML keys read slightly cool; values as strings
      {
        scope: ['support.type.property-name', 'entity.name.tag.yaml'],
        settings: { foreground: c.keyword },
      },
      // Diff/patch languages
      {
        scope: ['markup.inserted'],
        settings: { foreground: type === 'dark' ? '#3ba55d' : '#1e7a44' },
      },
      {
        scope: ['markup.deleted'],
        settings: { foreground: type === 'dark' ? '#e5534b' : '#bd3934' },
      },
    ],
  };
}

export const cloudemuDark = makeTheme('cloudemu-dark', 'dark', dark);
export const cloudemuLight = makeTheme('cloudemu-light', 'light', light);
