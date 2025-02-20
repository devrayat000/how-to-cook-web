import { apiClient } from "@/lib/query-client";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";

export default function CategoryRecipsList() {
  const { data, fetchNextPage, hasNextPage } = useSuspenseInfiniteQuery({
    queryKey: ["weather"],
    queryFn: async ({ pageParam: { skip, limit } }) => {
      const data = await apiClient.recipes(
        undefined,
        undefined,
        skip,
        limit,
        undefined
      );
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

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(scrollRef.current!);

    return () => {
      if (scrollRef.current) observer.unobserve(scrollRef.current);
      observer.disconnect();
    };
  }, [hasNextPage, fetchNextPage]);

  return <div>CategoryRecipsList</div>;
}
