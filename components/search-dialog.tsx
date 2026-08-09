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
  // Static search: download the prebuilt index from /api/search (the staticGET
  // output) and run Orama in the browser. Same dialog, same results as the old
  // server 'fetch' client — just no server round-trip, so the site can ship as
  // static files.
  const { search, setSearch, query } = useDocsSearch({
    type: 'static',
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
        <SearchDialogFooter className="flex items-center gap-3 font-mono text-[11px] text-ink-3">
        <span className="flex items-center gap-1">
          <kbd>↑</kbd>
          <kbd>↓</kbd> navigate
        </span>
        <span className="flex items-center gap-1">
          <kbd>↵</kbd> open
        </span>
        <span className="flex items-center gap-1">
          <kbd>esc</kbd> close
        </span>
        </SearchDialogFooter>
      </SearchDialogContent>
    </SearchDialog>
  );
}
