import { api } from "@/lib/query-client";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { notUndefined, useWindowVirtualizer } from "@tanstack/react-virtual";
import { useCallback, useEffect, useRef } from "react";
import { Link, useParams } from "react-router";

export default function CategoryRecipsList() {
  const { id } = useParams();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSuspenseInfiniteQuery({
      queryKey: ["weather", { category: id }] as const,
      queryFn: async ({ pageParam: { skip, limit }, queryKey: [, params] }) => {
        const { data } = await api.recipesList({
          Skip: skip,
          Limit: limit,
          Category: parseInt(params.category!),
        });
        return data;
      },
      initialPageParam: { skip: 0, limit: 24 },
      getNextPageParam: (lastPage, __, lastPageParam) => {
        if (
          lastPageParam.limit + (lastPageParam.skip + 1) >
          (lastPage.metadata?.total ?? 0)
        ) {
          return undefined;
        }
        return {
          skip: lastPageParam.skip + lastPageParam.limit,
          limit: lastPageParam.limit,
        };
      },
      getPreviousPageParam: (_, __, firstPageParam) => ({
        skip: Math.max(firstPageParam.skip - firstPageParam.limit, 0),
        limit: firstPageParam.limit,
      }),
      meta: {
        limit: 24,
      },
    });

  const listRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const columnVirtualizer = useWindowVirtualizer({
    count: data.pages.flatMap((page) => page.items).length,
    estimateSize: () => 280,
    gap: 8,
    scrollMargin: scrollRef.current?.offsetTop ?? 0,
    getItemKey: (i) => {
      const row = Math.floor(i / 24);
      const column = i % 24;
      return notUndefined(data.pages[row]?.items?.[column].id?.toString());
    },
    enabled: !!data,
    useScrollendEvent: true,
    useAnimationFrameWithResizeObserver: true,
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          console.log("end reached...");
          // fetchNextPage();
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(scrollRef.current!);

    return () => {
      // if (scrollRef.current) observer.unobserve(scrollRef.current);
      observer.disconnect();
    };
  }, [hasNextPage, fetchNextPage]);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastItemRef = useCallback(
    (node: HTMLAnchorElement) => {
      if (isFetchingNextPage) return;

      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasNextPage) {
            fetchNextPage();
          }
        },
        { rootMargin: "100px" }
      );

      if (node) observerRef.current.observe(node);
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage]
  );

  return (
    <section ref={listRef}>
      <div
        className="relative"
        style={{ height: columnVirtualizer.getTotalSize() }}
      >
        {columnVirtualizer.getVirtualItems().map((virtualItem, _, items) => {
          const row = Math.floor(virtualItem.index / 24);
          const column = virtualItem.index % 24;
          const recipe = notUndefined(data.pages[row].items?.[column]);

          const isLast = virtualItem.index === items.length - 1;

          return (
            <Link
              to={`/recipe/${recipe.id}`}
              key={virtualItem.key}
              className="absolute w-full top-0 left-0 block shrink-0 border border-slate-200 rounded-md"
              style={{
                height: virtualItem.size,
                transform: `translateY(${
                  virtualItem.start - columnVirtualizer.options.scrollMargin
                }px)`,
              }}
              ref={isLast ? lastItemRef : undefined}
            >
              <img
                src={notUndefined(recipe.thumb)!}
                alt={notUndefined(recipe.name)!}
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
        <div ref={scrollRef} />
      </div>
    </section>
  );
}
