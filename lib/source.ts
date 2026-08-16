import { docs, meta, blogDocs, blogMeta } from '@/.source/server';
import { loader } from 'fumadocs-core/source';
import { toFumadocsSource } from 'fumadocs-mdx/runtime/server';

export const source = loader({
  baseUrl: '/docs',
  source: toFumadocsSource(docs, meta) as any,
});

export const blogSource = loader({
  baseUrl: '/blog',
  source: toFumadocsSource(blogDocs, blogMeta) as any,
});
