'use client';

import { useEffect, useRef } from 'react';

const COPY_ICON =
  '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>';
const CHECK_ICON =
  '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--ok)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>';

/**
 * Adds the site-standard copy button to code blocks rendered from raw HTML
 * (the blog's markdown renderer). Wrap the rendered article with this.
 */
export function CodeCopy({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const pres = Array.from(root.querySelectorAll('pre'));
    const cleanups = pres.map((pre) => {
      const wrapper = document.createElement('div');
      wrapper.className = 'u-copywrap';
      pre.parentNode?.insertBefore(wrapper, pre);
      wrapper.appendChild(pre);

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.setAttribute('aria-label', 'Copy code');
      btn.className = 'u-copybtn';
      btn.innerHTML = COPY_ICON;
      let timer: ReturnType<typeof setTimeout>;
      btn.addEventListener('click', async () => {
        await navigator.clipboard.writeText(pre.textContent ?? '');
        btn.innerHTML = CHECK_ICON;
        clearTimeout(timer);
        timer = setTimeout(() => {
          btn.innerHTML = COPY_ICON;
        }, 1600);
      });
      wrapper.appendChild(btn);
      return () => {
        clearTimeout(timer);
        btn.remove();
        wrapper.parentNode?.insertBefore(pre, wrapper);
        wrapper.remove();
      };
    });
    return () => cleanups.forEach((fn) => fn());
  }, []);

  return <div ref={ref}>{children}</div>;
}
