import { defaultConfig } from "@/lib/config/app";
import { useEffect, useState } from "react";
import { useDebounce } from "./use-debounce";

export function useListState() {
  // Pagination
  const [pageIndex, setPageIndex] = useState(0);
  const [cursors, setCursors] = useState<(string | null)[]>([null]);

  // Page Rows
  const [rowsPerPage, setRowsPerPage] = useState(defaultConfig.defaultPageSize);

  // Debounce Search
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, defaultConfig.debounceMs);

  // Reset
  useEffect(() => {
    (setPageIndex(0), setCursors([null]));
  }, [debouncedSearch, rowsPerPage]);

  function setNextPage(newIndex: number, continueCursor?: string | null) {
    if (newIndex > pageIndex && continueCursor) {
      setCursors((prev) => {
        const updated = [...prev];
        updated[newIndex] = continueCursor;
        return updated;
      });
    }

    setPageIndex(newIndex);
  }

  return {
    pageIndex,
    cursors,
    currentCursor: cursors[pageIndex],
    rowsPerPage,
    search,
    debouncedSearch,

    setPageIndex: setNextPage,
    setRowsPerPage,
    setSearch,
  };
}
