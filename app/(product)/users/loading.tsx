import { FiltersSkeleton } from "@/components/skeletons/filter-skeleton";
import { PageHeaderSkeleton } from "@/components/skeletons/page-header-skeleton";
import { TableSkeleton } from "@/components/skeletons/table-skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col w-full gap-6">
      <PageHeaderSkeleton />
      <FiltersSkeleton />
      <TableSkeleton cols={5} rows={8} />
    </div>
  );
}
