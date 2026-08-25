import {
  defineDocs,
  defineConfig,
  frontmatterSchema,
} from 'fumadocs-mdx/config';
import { z } from 'zod';
import { rehypeCodeDefaultOptions } from 'fumadocs-core/mdx-plugins';
import { cloudemuLight } from './lib/shiki-themes';

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

// Blog runs on the same MDX pipeline as docs (same Shiki theme + components)
// — no more hand-rolled markdown renderer.
export const { docs: blogDocs, meta: blogMeta } = defineDocs({
  dir: 'content/blog',
  docs: {
    schema: frontmatterSchema.extend({
      date: z.string().optional(),
      author: z.string().optional(),
    }),
  },
});

const defaults = rehypeCodeDefaultOptions;

export default defineConfig({
  mdxOptions: {
    rehypeCodeOptions: {
      ...defaults,
      // The site is light-only. Keep Shiki's dual-theme shape (fumadocs expects
      // it) but map BOTH modes to the light palette — otherwise dark-OS visitors
      // get the dark (light-coloured) palette on our light code surface, which
      // is unreadable.
      themes: {
        light: cloudemuLight,
        dark: cloudemuLight,
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
