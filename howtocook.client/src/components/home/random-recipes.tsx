import { api } from "@/lib/query-client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { notUndefined, useVirtualizer } from "@tanstack/react-virtual";
import { useRef } from "react";
import { Link } from "react-router";
import { Skeleton } from "../ui/skeleton";

export default function RandomRecipesList() {
  const {
    data: { items: recipes },
  } = useSuspenseQuery({
    queryKey: ["recipes/random"],
    queryFn: async ({ signal }) => {
      const { data } = await api.recipesRandomList(undefined, {
        cache: "force-cache",
        headers: {
          "Cache-Control": "max-age=600",
        },
        signal,
      });
      return data;
    },
  });
  const parentRef = useRef<HTMLDivElement>(null);
  const rowVirtualizer = useVirtualizer({
    count: recipes?.length ?? 0,
    getScrollElement: () => parentRef.current,
    horizontal: true,
    estimateSize: () => 320,
    getItemKey: (i) => notUndefined(recipes?.[i].id?.toString()),
    gap: 8,
  });

  return (
    <section className="w-screen h-60 overflow-x-auto" ref={parentRef}>
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
                src={recipe.thumb!}
                alt={recipe.name!}
                className="block w-full aspect-video rounded-t-md"
              />
              <div className="p-1">
                <p className="text-sm font-medium line-clamp-1">
                  {recipe.name}
                </p>
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

RandomRecipesList.Loader = function RandomRecipesSkeleton(
  props: React.ComponentProps<"div">
) {
  return (
    <div
      {...props}
      className="w-screen h-60 overflow-x-hidden flex gap-2 items-start"
    >
      {Array.from({ length: 8 }, (_, i) => {
        return (
          <div
            className="border shrink-0 border-slate-200 rounded-md animate-pulse"
            style={{ width: 320 }}
            key={i}
          >
            <Skeleton className="aspect-video rounded-t-md" />
            <div className="p-1">
              <Skeleton className="h-5 rounded-md" />
              <div className="flex justify-between items-start mt-1">
                <Skeleton className="h-3 w-1/2 rounded-md" />
                <Skeleton className="h-3 w-1/4 rounded-md" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
