import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/query-client";
import { useEffect, useRef } from "react";

const limit = 24;

export default function HomePage() {
  const { data, fetchNextPage, hasNextPage } = useSuspenseInfiniteQuery({
    queryKey: ["weather"],
    queryFn: async ({ pageParam: { skip } }) => {
      const data = await apiClient.recipes(
        undefined,
        undefined,
        skip,
        limit,
        undefined
      );
      return data;
    },
    initialPageParam: { skip: 0 },
    getNextPageParam: (lastPage, __, lastPageParam) => {
      if (limit + (lastPageParam.skip + 1) > (lastPage.metadata?.total ?? 0)) {
        return undefined;
      }
      return {
        skip: lastPageParam.skip + limit,
      };
    },
    getPreviousPageParam: (_, __, firstPageParam) => ({
      skip: Math.max(firstPageParam.skip - limit, 0),
    }),
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

  const recipes = data.pages.flatMap((page) => page.items);

  console.log(recipes.length);

  return (
    <div>
      <h1 className="text-4xl text-bold">Home Page</h1>
      <Button asChild>
        <Link to="about"> About</Link>
      </Button>
      <pre>{JSON.stringify(recipes, null, 2)}</pre>
      <div ref={scrollRef} />
    </div>
  );
}
