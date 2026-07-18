import { defineDocs, defineConfig } from 'fumadocs-mdx/config';
import { cloudemuDark, cloudemuLight } from './lib/shiki-themes';

export const { docs, meta } = defineDocs({
  dir: 'content/docs',
});

export default defineConfig({
  mdxOptions: {
    rehypeCodeOptions: {
      themes: {
        light: cloudemuLight,
        dark: cloudemuDark,
      },
    },
  },
});
