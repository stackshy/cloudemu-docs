import { source } from '@/lib/source';
import { createFromSource } from 'fumadocs-core/search/server';

// Static export: emit the search index as a prebuilt static file at
// /api/search (staticGET) instead of a live server endpoint, so the site needs
// no running Node server. `revalidate = false` marks the route fully static so
// `output: 'export'` can render it at build time. The client (components/
// search-dialog.tsx) reads this index and runs Orama in the browser — same
// search UX, no server round-trip.
export const revalidate = false;

export const { staticGET: GET } = createFromSource(source);
