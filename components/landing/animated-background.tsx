'use client';

/**
 * AnimatedBackground: a quiet dotted grid that fades at the edges. No glows,
 * no auroras, no competing lights. The hero diagram is the only thing that
 * should pull the eye.
 */
export function AnimatedBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.12] dark:opacity-[0.07]"
        style={{
          backgroundImage:
            'radial-gradient(currentColor 1px, transparent 1px)',
          backgroundSize: '36px 36px',
          color: 'var(--color-fd-muted-foreground, #9ca3af)',
          maskImage:
            'radial-gradient(ellipse 70% 50% at center, black 30%, transparent 80%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 70% 50% at center, black 30%, transparent 80%)',
        }}
      />
    </div>
  );
}
