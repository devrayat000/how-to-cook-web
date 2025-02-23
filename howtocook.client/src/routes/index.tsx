import { Suspense } from "react";
import CategoriesList from "@/components/home/categories-list";
import RandomRecipesList from "@/components/home/random-recipes";
import AreasList from "@/components/home/areas-list";

export default function HomePage() {
  return (
    <div className="p-2 space-y-4">
      <section>
        <small className="text-2xl font-medium leading-relaxed">
          What's your favorite category?
        </small>
        <Suspense fallback={<CategoriesList.Loader />}>
          <CategoriesList />
        </Suspense>
      </section>
      <section>
        <small className="text-2xl font-medium leading-relaxed">
          Want something area specific?
        </small>
        <Suspense fallback={<AreasList.Loader />}>
          <AreasList />
        </Suspense>
      </section>
      <section>
        <small className="text-2xl font-medium leading-relaxed">
          Here are some suggestions
        </small>
        <Suspense fallback={<RandomRecipesList.Loader />}>
          <RandomRecipesList />
        </Suspense>
      </section>
    </div>
  );
}
