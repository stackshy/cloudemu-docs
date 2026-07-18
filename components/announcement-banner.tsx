'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';

const STORAGE_KEY = 'cloudemu-banner-v2-release';

/**
 * Thin announcement bar: surface background, mono text, the version as an
 * accent-bordered chip, one accent link. Dismiss persists in localStorage.
 */
export function AnnouncementBanner() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY) !== 'dismissed') setOpen(true);
  }, []);

  if (!open) return null;

  return (
    <div className="relative z-40 flex h-9 items-center justify-center gap-2.5 border-b border-line bg-surface px-8 font-mono text-xs text-ink-secondary">
      <span className="rounded-[3px] border border-signal/40 bg-signal/10 px-1.5 py-px font-medium text-signal">
        v2.0.0
      </span>
      <span className="truncate">
        packages reorganized · import path is now{' '}
        <span className="text-ink">/v2</span>
      </span>
      <Link
        href="/docs/installation#migrating-to-v2"
        className="shrink-0 font-medium text-signal underline decoration-signal/40 underline-offset-2 transition-colors hover:decoration-signal"
      >
        migration notes →
      </Link>
      <button
        type="button"
        aria-label="Dismiss announcement"
        onClick={() => {
          localStorage.setItem(STORAGE_KEY, 'dismissed');
          setOpen(false);
        }}
        className="absolute right-2 rounded p-1 text-ink-muted transition-colors hover:text-ink"
      >
        <X className="size-3.5" />
      </button>
    </div>
  );
}
