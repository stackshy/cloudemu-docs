import type { ReactNode } from 'react';

/**
 * DiagramFrame — wraps a docs diagram in a Field Manual plate: registration
 * crosses at the corners and a `FIG.` caption beneath. Applied at the MDX
 * component-mapping layer, so diagrams get the manual treatment without
 * touching their internals or the MDX prose.
 */
export function DiagramFrame({
  caption,
  children,
}: {
  caption: string;
  children: ReactNode;
}) {
  return (
    <figure className="not-prose my-7">
      <div className="u-plate px-4 py-2 sm:px-6">
        <span className="u-cross" style={{ top: 8, left: 8 }} />
        <span className="u-cross" style={{ top: 8, right: 8 }} />
        <span className="u-cross" style={{ bottom: 8, left: 8 }} />
        <span className="u-cross" style={{ bottom: 8, right: 8 }} />
        {children}
      </div>
      <figcaption className="u-figcaption">
        <b>FIG.</b>
        <span>{caption}</span>
      </figcaption>
    </figure>
  );
}
