import { defineDocs, defineConfig } from 'fumadocs-mdx/config';

export const { docs, meta } = defineDocs({
  dir: 'content/docs',
});

export default defineConfig({
  mdxOptions: {
    // Warm, ember-aligned code theme: a light github theme in light mode and
    // Vesper (warm amber/cream on charcoal) in dark mode.
    rehypeCodeOptions: {
      themes: {
        light: 'github-light',
        dark: 'vesper',
      },
    },
  },
});
