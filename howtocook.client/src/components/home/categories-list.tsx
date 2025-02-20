import { api } from "@/lib/query-client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useVirtualizer, notUndefined } from "@tanstack/react-virtual";
import { useRef } from "react";
import { Link } from "react-router";

export default function CategoriesList() {
  const {
    data: { items: categories },
  } = useSuspenseQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await api.categoriesList(undefined, {
        cache: "force-cache",
        headers: {
          "Cache-Control": "max-age=86400",
        },
      });
      return data;
    },
  });
  const parentRef = useRef<HTMLDivElement>(null);
  const rowVirtualizer = useVirtualizer({
    count: categories?.length ?? 0,
    getScrollElement: () => parentRef.current,
    horizontal: true,
    estimateSize: () => 96,
    getItemKey: (i) => notUndefined(categories?.[i].id?.toString()),
    gap: 8,
  });

  return (
    <section className="w-screen h-28 overflow-x-auto" ref={parentRef}>
      <div
        className="relative h-full"
        style={{ width: rowVirtualizer.getTotalSize() }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualItem) => {
          const category = notUndefined(categories?.[virtualItem.index]);
          return (
            <Link
              to={`/category/${category.id}`}
              key={virtualItem.key}
              className="absolute top-0 left-0 block shrink-0 border p-1 border-slate-200 rounded-md"
              style={{
                width: virtualItem.size,
                transform: `translateX(${virtualItem.start}px)`,
              }}
            >
              <img
                src={category.thumb}
                alt={category.name}
                className="block w-full aspect-video"
              />
              <p className="block text-sm text-center leading-loose font-medium my-1">
                {category.name}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
