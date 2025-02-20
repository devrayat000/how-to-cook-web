import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Suspense } from "react";
import CategoriesList from "@/components/home/categories-list";
import RandomRecipesList from "@/components/home/random-recipes";

export default function HomePage() {
  return (
    <div className="p-2">
      <section>
        <small className="text-sm font-medium leading-none">
          Email address
        </small>
        <Suspense>
          <CategoriesList />
        </Suspense>
      </section>
      <section>
        <small className="text-sm font-medium leading-none">
          Email address
        </small>
        <Suspense>
          <RandomRecipesList />
        </Suspense>
      </section>
      <h1 className="text-4xl text-bold">Home Page</h1>
      <Button asChild>
        <Link to="about"> About</Link>
      </Button>
    </div>
  );
}
