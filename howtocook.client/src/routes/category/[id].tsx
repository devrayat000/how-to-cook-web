import CategoryRecipsList from "@/components/category/recipes-list";
import { CategoryListResponse } from "@/generated/api";
import { api } from "@/lib/query-client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import { useParams } from "react-router";

export default function CategoryDetailsPage() {
  const { id } = useParams();

  const {
    data: { item: category },
  } = useSuspenseQuery({
    queryKey: ["category", id],
    queryFn: async ({ queryKey: [, id], signal, client }) => {
      const cache = client
        .getQueryCache()
        .find<CategoryListResponse>({ queryKey: ["categories"], exact: true });
      const cachedData = cache?.state.data?.items?.find(
        (category) => category.id === parseInt(id!)
      );

      if (cachedData) {
        return { item: cachedData };
      }

      const { data } = await api.categoriesDetail(parseInt(id!), {
        cache: "force-cache",
        headers: {
          "Cache-Control": "max-age=86400",
        },
        signal,
      });
      return data;
    },
  });

  if (!id) {
    return <div>Category not found</div>;
  }

  return (
    <div className="p-2">
      <pre>{JSON.stringify(category, null, 2)}</pre>
      <section>
        <Suspense>
          <CategoryRecipsList />
        </Suspense>
      </section>
    </div>
  );
}
