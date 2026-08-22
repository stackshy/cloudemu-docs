'use client';

import { useDocsSearch } from 'fumadocs-core/search/client';
import {
  SearchDialog,
  SearchDialogOverlay,
  SearchDialogContent,
  SearchDialogHeader,
  SearchDialogIcon,
  SearchDialogInput,
  SearchDialogClose,
  SearchDialogList,
  SearchDialogFooter,
} from 'fumadocs-ui/components/dialog/search';
import type { SharedProps } from 'fumadocs-ui/contexts/search';

export default function CustomSearchDialog(props: SharedProps) {
  // Static export: download the prebuilt index from /api/search and run the
  // search engine in the browser. (`type: 'fetch'` expects a live query server,
  // which a static export doesn't have — so it returned no results.)
  const { search, setSearch, query } = useDocsSearch({
    type: 'static',
    from: '/api/search',
  });

  const items =
    query.data === 'empty'
      ? null
      : query.data && query.data.length > 0
        ? query.data
        : null;

  return (
    <SearchDialog
      search={search}
      onSearchChange={setSearch}
      isLoading={query.isLoading}
      {...props}
    >
      <SearchDialogOverlay />
      <SearchDialogContent>
        <SearchDialogHeader>
          <SearchDialogIcon />
          <SearchDialogInput />
          <SearchDialogClose />
        </SearchDialogHeader>
        <SearchDialogList
          items={items}
          Empty={() =>
            search.length > 0 ? (
              <div className="py-12 text-center text-sm text-fd-muted-foreground">
                No results found for &quot;{search}&quot;
              </div>
            ) : (
              <div className="py-12 text-center text-sm text-fd-muted-foreground">
                Type to search documentation...
              </div>
            )
          }
        />
      </SearchDialogContent>
      <SearchDialogFooter />
    </SearchDialog>
  );
}
