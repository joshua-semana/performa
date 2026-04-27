import { tableConfig } from "@/lib/config/table";
import { useEffect, useState } from "react";
import { useDebounce } from "./use-debounce";

export function useTableState() {
  // Pagination
  const [pageIndex, setPageIndex] = useState(0);
  const [cursors, setCursors] = useState<(string | null)[]>([null]);

  // Page Rows
  const [rowsPerPage, setRowsPerPage] = useState(tableConfig.defaultPageSize);

  // Debounce Search
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, tableConfig.debounceMs);

  // Sorting
  const [sorting, setSorting] = useState<{ id: string; desc: boolean }[]>([]);
  const sort = sorting[0];
  const sortBy = sort?.id;
  const sortOrder: "asc" | "desc" | undefined = sort
    ? sort.desc
      ? "desc"
      : "asc"
    : undefined;

  // Reset
  useEffect(() => {
    setPageIndex(0);
    setCursors([null]);
  }, [debouncedSearch, rowsPerPage, sorting]);

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
    sorting,
    sortBy,
    sortOrder,

    setPageIndex: setNextPage,
    setRowsPerPage,
    setSearch,
    setSorting,
  };
}
