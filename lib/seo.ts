import { PRODUCT } from './product';
import { RELEASES } from './changelog.generated';

export const SITE_URL = 'https://cloudemu.info';

const DESCRIPTION =
  'A real emulator of AWS, Azure, and GCP that lives in memory. Point real code, SDKs, or CLIs at it — any language, ~10 ms a call, no cloud accounts.';

type Ld = Record<string, unknown>;

/** Site-wide identity — rendered once in the root layout. */
export const organizationLd: Ld = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'cloudemu',
  url: SITE_URL,
  logo: `${SITE_URL}/icon.svg`,
  description: DESCRIPTION,
  sameAs: [PRODUCT.repo],
};

export const websiteLd: Ld = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'cloudemu',
  url: SITE_URL,
};

/** The product itself — rendered on the landing. */
export const softwareApplicationLd: Ld = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'cloudemu',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Cross-platform',
  url: SITE_URL,
  description: DESCRIPTION,
  softwareVersion: RELEASES[0]?.version,
  codeRepository: PRODUCT.repo,
  license: 'https://opensource.org/licenses/MIT',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  author: { '@type': 'Organization', name: 'cloudemu' },
};

export function techArticleLd(a: { title: string; description?: string; path: string }): Ld {
  return {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: a.title,
    description: a.description,
    url: `${SITE_URL}${a.path}`,
    isPartOf: { '@type': 'WebSite', name: 'cloudemu', url: SITE_URL },
    author: { '@type': 'Organization', name: 'cloudemu' },
  };
}

export function blogPostingLd(a: { title: string; description?: string; path: string; date?: string }): Ld {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: a.title,
    description: a.description,
    url: `${SITE_URL}${a.path}`,
    datePublished: a.date,
    author: { '@type': 'Organization', name: 'cloudemu' },
    publisher: { '@type': 'Organization', name: 'cloudemu', logo: { '@type': 'ImageObject', url: `${SITE_URL}/icon.svg` } },
  };
}

export function breadcrumbLd(items: { name: string; path: string }[]): Ld {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: `${SITE_URL}${it.path}`,
    })),
  };
}
