'use client';

import { useEffect, useState } from 'react';
import Link from '@/components/link';
import { X } from 'lucide-react';

const STORAGE_KEY = 'cloudemu-banner-v2-release';

/**
 * One thin neutral line. Version as a bordered chip (neutral), muted text,
 * an underlined-neutral link. No accent at rest. Dismiss persists.
 */
export function AnnouncementBanner() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY) !== 'dismissed') setOpen(true);
  }, []);

  if (!open) return null;

  return (
    <div className="relative z-40 flex h-9 items-center justify-center gap-2.5 border-b border-line bg-canvas px-8 font-mono text-xs text-ink-2">
      <span className="rounded-[3px] border border-line-2 px-1.5 py-px font-medium text-ink">
        v2.0.0
      </span>
      <span className="truncate">
        packages reorganized · import path is now{' '}
        <span className="text-ink">/v2</span>
      </span>
      <Link
        href="/docs/installation#migrating-to-v2"
        className="shrink-0 font-medium text-ink underline decoration-line-2 underline-offset-2 transition-colors hover:text-accent hover:decoration-accent"
      >
        Migration notes →
      </Link>
      <button
        type="button"
        aria-label="Dismiss announcement"
        onClick={() => {
          localStorage.setItem(STORAGE_KEY, 'dismissed');
          setOpen(false);
        }}
        className="absolute right-2 rounded p-1 text-ink-3 transition-colors hover:text-ink"
      >
        <X className="size-3.5" />
      </button>
    </div>
  );
}
