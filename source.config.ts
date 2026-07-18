import { defineDocs, defineConfig } from 'fumadocs-mdx/config';
import { rehypeCodeDefaultOptions } from 'fumadocs-core/mdx-plugins';
import { cloudemuDark, cloudemuLight } from './lib/shiki-themes';

export const { docs, meta } = defineDocs({
  dir: 'content/docs',
});

const defaults = rehypeCodeDefaultOptions;

export default defineConfig({
  mdxOptions: {
    rehypeCodeOptions: {
      ...defaults,
      themes: {
        light: cloudemuLight,
        dark: cloudemuDark,
      },
      transformers: [
        ...(defaults.transformers ?? []),
        {
          name: 'cloudemu:pre-language',
          pre(pre) {
            pre.properties['data-language'] = this.options.lang;
          },
        },
      ],
    },
  },
});
