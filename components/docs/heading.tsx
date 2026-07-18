import type { ComponentProps, ElementType } from 'react';

/**
 * Docs heading — plain text heading with a muted `#` anchor that appears on
 * hover only. Headings are never colored, never underlined, never look like
 * links; the anchor glyph stays in text-3 even on hover.
 */
export function DocsHeading<T extends ElementType>({
  as,
  id,
  children,
  className = '',
  ...rest
}: { as: T } & ComponentProps<'h2'>) {
  const As = as as ElementType;
  if (!id) {
    return (
      <As className={className} {...rest}>
        {children}
      </As>
    );
  }
  return (
    <As id={id} className={`group scroll-m-28 ${className}`} {...rest}>
      {children}
      <a href={`#${id}`} aria-label="Link to section" className="u-anchor">
        #
      </a>
    </As>
  );
}

export const mdxHeadings = {
  h1: (props: ComponentProps<'h1'>) => <DocsHeading as="h1" {...props} />,
  h2: (props: ComponentProps<'h2'>) => <DocsHeading as="h2" {...props} />,
  h3: (props: ComponentProps<'h3'>) => <DocsHeading as="h3" {...props} />,
  h4: (props: ComponentProps<'h4'>) => <DocsHeading as="h4" {...props} />,
};
