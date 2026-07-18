'use client';

import { useSyncExternalStore } from 'react';
import type { Provider } from '@/components/ui';

/**
 * Global provider-tab state: choosing AWS in one code block switches every
 * block on the site and persists across visits (localStorage).
 */

const STORAGE_KEY = 'cloudemu-provider';
const EVENT = 'cloudemu-provider-change';

let current: Provider | null = null;

function read(): Provider {
  if (current) return current;
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'aws' || stored === 'azure' || stored === 'gcp') {
      current = stored;
      return stored;
    }
  }
  return 'aws';
}

export function setProvider(p: Provider) {
  current = p;
  localStorage.setItem(STORAGE_KEY, p);
  window.dispatchEvent(new CustomEvent(EVENT));
}

function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb);
  window.addEventListener('storage', cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener('storage', cb);
  };
}

export function useProvider(): Provider {
  // Server snapshot is always 'aws' to keep SSR deterministic.
  return useSyncExternalStore(subscribe, read, () => 'aws');
}
