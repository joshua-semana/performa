import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { defaultConfig } from "@/lib/config/app";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ListFooterProps {
  className?: string;

  isLoading: boolean;

  pageIndex: number;
  setPageIndex: (index: number) => void;

  rowsPerPage: number;
  onRowsPerPageChange: (value: number) => void;

  totalSearchCount?: number;
  totalItemCount?: number;
}

export function ListFooter({
  className,
  isLoading,
  pageIndex,
  setPageIndex,
  rowsPerPage,
  onRowsPerPageChange,
  totalSearchCount,
  totalItemCount,
}: ListFooterProps) {
  const totalPages = Math.max(
    1,
    Math.ceil((totalSearchCount ?? totalItemCount ?? 0) / rowsPerPage),
  );

  return (
    <div className={cn("flex justify-between w-full", className)}>
      <div className="items-center gap-4 hidden sm:flex">
        <Select
          disabled={isLoading}
          value={rowsPerPage.toString()}
          onValueChange={(e) => onRowsPerPageChange(Number(e))}
        >
          <SelectTrigger size="sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Sizes</SelectLabel>
              {defaultConfig.pageSizeOptions.map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant={"outline"}
          size={"icon-sm"}
          onClick={() => setPageIndex(pageIndex - 1)}
          disabled={pageIndex === 0}
        >
          <ChevronLeft />
        </Button>
        <span>
          {pageIndex + 1} of {totalPages}
        </span>
        <Button
          variant={"outline"}
          size={"icon-sm"}
          onClick={() => setPageIndex(pageIndex + 1)}
          disabled={pageIndex + 1 >= totalPages}
        >
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
}
