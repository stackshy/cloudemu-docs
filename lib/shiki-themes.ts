import type { ThemeRegistration } from 'shiki';

/**
 * Custom Shiki themes written against tokens.css — one calm, low-saturation
 * palette, two modes. Values are literal because Shiki inlines them; they
 * MUST stay in sync with the --code-* tokens in app/tokens.css.
 *
 * Strings warm sand, keywords cool blue, functions text-1, comments muted
 * italic. Nothing saturated; code should read, not shout.
 */

const dark = {
  keyword: '#7eb6ff',
  string: '#c9a97c',
  comment: '#6b7482',
  func: '#f2f4f6',
  type: '#a9b1bc',
  number: '#c9a97c',
  punct: '#8b93a0',
  plain: '#d5dae0',
  bg: '#171b21',
};

const light = {
  keyword: '#1f5fb8',
  string: '#8a6a2f',
  comment: '#6c7178',
  func: '#17191c',
  type: '#494f57',
  number: '#8a6a2f',
  punct: '#5b6169',
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
