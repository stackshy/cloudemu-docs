import type { ThemeRegistration } from 'shiki';

/**
 * Custom Shiki themes written against tokens.css — one palette, two modes.
 * Values are literal because Shiki inlines them; they MUST stay in sync with
 * the --code-* tokens in app/tokens.css.
 *
 * Tuned for Go: keywords accent-adjacent (teal), strings warm, comments muted
 * italic, function calls bright, types violet.
 */

const dark = {
  keyword: '#5eead4',
  string: '#e3b341',
  comment: '#7a8494',
  func: '#93c5fd',
  type: '#c4b5fd',
  number: '#fdba74',
  punct: '#9aa3b2',
  plain: '#dce1e8',
  bg: '#161a23',
};

const light = {
  keyword: '#0f766e',
  string: '#a16207',
  comment: '#74808f',
  func: '#1d4ed8',
  type: '#6d28d9',
  number: '#b45309',
  punct: '#414c5c',
  plain: '#1f2733',
  bg: '#f1f3f7',
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
      // JSON / YAML keys read as types; values as strings
      {
        scope: ['support.type.property-name', 'entity.name.tag.yaml'],
        settings: { foreground: c.func },
      },
      // Diff/patch languages
      { scope: ['markup.inserted'], settings: { foreground: type === 'dark' ? '#4ade80' : '#047857' } },
      { scope: ['markup.deleted'], settings: { foreground: type === 'dark' ? '#f87171' : '#b91c1c' } },
    ],
  };
}

export const cloudemuDark = makeTheme('cloudemu-dark', 'dark', dark);
export const cloudemuLight = makeTheme('cloudemu-light', 'light', light);
