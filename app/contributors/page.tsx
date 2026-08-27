import type { Metadata } from 'next';
import { PRODUCT } from '@/lib/product';
import { CONTRIBUTORS, TOTAL_CONTRIBUTIONS } from '@/lib/contributors.generated';
import { ContributorsBoard } from '@/components/contributors/board';

export const metadata: Metadata = {
  title: 'Contributors',
  description: `The people who built cloudemu — ${CONTRIBUTORS.length} contributors and ${TOTAL_CONTRIBUTIONS} commits, in the open.`,
  alternates: { canonical: '/contributors' },
};

export default function ContributorsPage() {
  return (
    <main className="mx-auto w-full max-w-[1080px] px-5 pb-24 pt-16 sm:px-10">
      <ContributorsBoard initial={CONTRIBUTORS} />

      <div className="mt-14 flex flex-wrap items-center gap-3">
        <a className="cl-btn-p" href={`${PRODUCT.repo}/blob/main/CONTRIBUTING.md`} target="_blank" rel="noreferrer">
          Add your name →
        </a>
        <a className="cl-btn-s" href={PRODUCT.repo} target="_blank" rel="noreferrer">★ GitHub</a>
      </div>
    </main>
  );
}
