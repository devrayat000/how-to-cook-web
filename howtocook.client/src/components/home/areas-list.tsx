import { api } from "@/lib/query-client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useVirtualizer, notUndefined } from "@tanstack/react-virtual";
import { useRef } from "react";
import { Link } from "react-router";
import { Skeleton } from "../ui/skeleton";

export default function AreasList() {
  const {
    data: { items: areas },
  } = useSuspenseQuery({
    queryKey: ["areas"],
    queryFn: async ({ signal }) => {
      const { data } = await api.areasList({
        cache: "force-cache",
        headers: {
          "Cache-Control": "max-age=86400",
        },
        signal,
      });
      return data;
    },
  });
  const parentRef = useRef<HTMLDivElement>(null);
  const rowVirtualizer = useVirtualizer({
    count: areas?.length ?? 0,
    getScrollElement: () => parentRef.current,
    horizontal: true,
    estimateSize: () => 96,
    getItemKey: (i) => notUndefined(areas?.[i].id?.toString()),
    gap: 8,
  });

  return (
    <section className="w-screen h-12 overflow-x-auto" ref={parentRef}>
      <div
        className="relative h-full"
        style={{ width: rowVirtualizer.getTotalSize() }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualItem) => {
          const area = notUndefined(areas?.[virtualItem.index]);
          return (
            <Link
              to={`/area/${area.id}`}
              key={virtualItem.key}
              className="absolute top-0 left-0 block shrink-0 border py-1 px-2 text-center border-slate-200 rounded-md"
              style={{
                width: virtualItem.size,
                transform: `translateX(${virtualItem.start}px)`,
              }}
            >
              {area.name}
            </Link>
          );
        })}
      </div>
    </section>
  );
}

AreasList.Loader = function AreaListSkeleton(
  props: React.ComponentProps<"div">
) {
  return (
    <div
      className="w-screen h-12 overflow-x-hidden flex gap-2 items-start"
      {...props}
    >
      {Array.from({ length: 10 }).map((_, i) => (
        <Skeleton className="w-24 h-8 rounded-md shrink-0" key={i} />
      ))}
    </div>
  );
};
