"use client";

import { FieldSearch } from "@/components/field-search";
import { EmptyState } from "@/components/states/empty-state";
import { LoadingState } from "@/components/states/loading-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/convex/_generated/api";
import { useDebounce } from "@/hooks/use-debounce";
import { defaultConfig } from "@/lib/config/app";
import { colorMap } from "@/lib/constants/color";
import {
  GROUP_TYPES,
  groupMap,
  GroupType,
  groupTypeOptions,
} from "@/lib/constants/group";
import { capitalize, cn } from "@/lib/utils";
import { useQuery } from "convex/react";
import { X } from "lucide-react";
import { useState } from "react";
import { ListFooter } from "./list-footer";
import { useListState } from "@/hooks/use-list-state";
import { useRouter } from "next/navigation";

export function GroupList() {
  const router = useRouter();

  const listState = useListState();
  const [selectedGroupId, setSelectedGroupId] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [type, setType] = useState<GroupType | undefined>(undefined);

  const debouncedSearch = useDebounce(searchValue, defaultConfig.debounceMs);
  const result = useQuery(api.groups.getGroups, {
    paginationOpts: {
      numItems: listState.rowsPerPage,
      cursor: listState.currentCursor,
    },
    search: debouncedSearch,
    type: type,
  });

  const isLoading = result?.page === undefined;
  const isEmpty = result?.page.length === 0;

  const isFiltered = searchValue.length > 0 || type !== undefined;

  const handleTypeChange = (val: string) => {
    if (val === "all") {
      setType(undefined);
      return;
    }

    if (GROUP_TYPES.includes(val as GroupType)) {
      setType(val as GroupType);
    }
  };

  const handleClear = () => (setSearchValue(""), setType(undefined));

  return (
    <Card className="w-sm h-fit">
      <CardHeader>
        <CardTitle>Groups</CardTitle>
        <CardDescription>
          There are <strong>{result?.totalGroupCount ?? 0}</strong> active
          groups
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col">
          <div className="flex gap-2 mb-6 items-center">
            <FieldSearch searchValue={searchValue} onSearch={setSearchValue} />
            <Select value={type ?? "all"} onValueChange={handleTypeChange}>
              <SelectTrigger className="w-36 min-w-0">
                <div className="flex-1 truncate text-left">
                  <SelectValue placeholder="Select type" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Type</SelectLabel>
                  <SelectItem key="all" value="all">
                    All
                  </SelectItem>
                  {groupTypeOptions.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {isFiltered && (
              <Button size={"icon"} variant={"outline"} onClick={handleClear}>
                <X className="size-4 shrink-0" />
              </Button>
            )}
          </div>

          {isLoading ? (
            <LoadingState searchText={debouncedSearch} />
          ) : isEmpty ? (
            <EmptyState searchText={debouncedSearch} />
          ) : (
            <div className="flex flex-col gap-1">
              {result.page.map((g) => {
                const group = groupMap[g.type];
                const Icon = group.icon;
                return (
                  <Button
                    variant={selectedGroupId === g._id ? "outline" : "ghost"}
                    key={g._id}
                    className="w-full justify-start px-3 h-14"
                    onClick={() => {
                      router.push(`/groups/${g._id}`);
                      setSelectedGroupId(g._id);
                    }}
                  >
                    <div className="flex items-center gap-2.5 w-full">
                      <div
                        className={cn(
                          "p-2.5 rounded-md",
                          colorMap[g.color].badge,
                        )}
                      >
                        <Icon className="size-4 shrink-0" />
                      </div>
                      <div className="flex flex-col text-left min-w-0">
                        <span className="truncate tracking-tight">
                          {g.name}
                        </span>
                        <span className="text-muted-foreground text-xs">
                          {g.memberCount} member{g.memberCount > 0 ? "s" : ""}
                        </span>
                      </div>
                      <Badge
                        variant={"outline"}
                        className="rounded-sm px-2 py-1.5 ml-auto"
                      >
                        {capitalize(group.acronym)}
                      </Badge>
                    </div>
                  </Button>
                );
              })}
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter>
        <ListFooter
          isLoading={result === undefined}
          onRowsPerPageChange={listState.setRowsPerPage}
          pageIndex={listState.pageIndex}
          rowsPerPage={listState.rowsPerPage}
          setPageIndex={(index) =>
            listState.setPageIndex(index, result?.continueCursor)
          }
          totalSearchCount={result?.totalSearchCount}
          totalItemCount={result?.totalGroupCount ?? 0}
        />
      </CardFooter>
    </Card>
  );
}
