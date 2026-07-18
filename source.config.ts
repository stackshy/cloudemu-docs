import {
  defineDocs,
  defineConfig,
  frontmatterSchema,
} from 'fumadocs-mdx/config';
import { z } from 'zod';
import { rehypeCodeDefaultOptions } from 'fumadocs-core/mdx-plugins';
import { cloudemuDark, cloudemuLight } from './lib/shiki-themes';

export const { docs, meta } = defineDocs({
  dir: 'content/docs',
  docs: {
    schema: frontmatterSchema.extend({
      // service pages: per-provider service names, rendered as chips
      aws: z.string().optional(),
      azure: z.string().optional(),
      gcp: z.string().optional(),
    }),
  },
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
