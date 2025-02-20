import { apiClient } from "@/lib/query-client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { notUndefined, useVirtualizer } from "@tanstack/react-virtual";
import { useRef } from "react";
import { Link } from "react-router";

export default function RandomRecipesList() {
  const {
    data: { items: recipes },
  } = useSuspenseQuery({
    queryKey: ["recipes/random"],
    queryFn: async () => {
      const data = await apiClient.random(undefined);
      return data;
    },
  });
  const parentRef = useRef<HTMLDivElement>(null);
  const rowVirtualizer = useVirtualizer({
    count: recipes?.length ?? 0,
    getScrollElement: () => parentRef.current,
    horizontal: true,
    estimateSize: () => 224,
    getItemKey: (i) => notUndefined(recipes?.[i].id?.toString()),
    gap: 8,
  });

  return (
    <section className="w-screen h-48 overflow-x-auto" ref={parentRef}>
      <div
        className="relative h-full"
        style={{ width: rowVirtualizer.getTotalSize() }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualItem) => {
          const recipe = notUndefined(recipes?.[virtualItem.index]);
          return (
            <Link
              to={`/recipe/${recipe.id}`}
              key={virtualItem.key}
              className="absolute top-0 left-0 block shrink-0 border border-slate-200 rounded-md"
              style={{
                width: virtualItem.size,
                transform: `translateX(${virtualItem.start}px)`,
              }}
            >
              <img
                src={recipe.thumb}
                alt={recipe.name}
                className="block w-full aspect-video rounded-t-md"
              />
              <div className="p-1">
                <p className="block text-sm font-medium">{recipe.name}</p>
                <div className="flex justify-between items-start mt-1">
                  <p className="text-xs text-slate-400">{recipe.category}</p>
                  <p className="text-xs text-slate-400">{recipe.area}</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
