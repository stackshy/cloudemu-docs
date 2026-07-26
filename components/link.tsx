'use client';

import NextLink from 'next/link';
import type { ComponentPropsWithoutRef } from 'react';

type LinkProps = Omit<ComponentPropsWithoutRef<'a'>, 'href'> & {
  href?: string;
  prefetch?: boolean;
};

/**
 * Site-wide Link that defaults prefetch OFF.
 *
 * Next.js eagerly prefetches every in-viewport `<Link>` on page load. A page
 * like the docs (large sidebar) fires a burst of parallel `?_rsc=` requests.
 * Behind an HTTP/1.1 edge — the browser caps at ~6 connections per host — that
 * burst saturates the connection pool and stalls the real navigation click, so
 * the page loads but clicking a link hangs.
 *
 * Defaulting prefetch off makes navigation fetch on demand (one request per
 * click), keeping the site responsive regardless of whether the edge speaks
 * HTTP/2 or HTTP/1.1. Callers can still opt back in per-link with `prefetch`.
 *
 * Wired globally via `RootProvider components={{ Link }}` (covers all fumadocs
 * internals) and imported directly by our own components.
 */
export default function Link({ href = '#', prefetch = false, ...props }: LinkProps) {
  return <NextLink href={href} prefetch={prefetch} {...props} />;
}
