using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using HowToCook.Server.Models;
using Microsoft.Extensions.Options;

namespace HowToCook.Server
{
    public class RecipeDbContext : DbContext
    {
        public RecipeDbContext(DbContextOptions<RecipeDbContext> options)
        : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            var options = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };
            string dataPath = Path.Combine(Directory.GetCurrentDirectory(), "Data");

            string categoryPath = Path.Combine(dataPath, "categories.json");
            var catData = JsonSerializer.Deserialize<CategoryData>(File.ReadAllText(categoryPath), options);
            if (catData?.Categories == null)
            {
                throw new Exception("No categories found in the data file");
            }
            var categories = catData.Categories.Select(c => new Category
            {
                Id = int.Parse(c.IdCategory),
                Name = c.StrCategory,
                Thumb = c.StrCategoryThumb,
                Description = c.StrCategoryDescription
            });

            modelBuilder.Entity<Category>().HasData(categories);

            string areaPath = Path.Combine(dataPath, "areas.json");
            var areaData = JsonSerializer.Deserialize<AreaData>(File.ReadAllText(areaPath), options);

            if (areaData?.Meals == null)
            {
                throw new Exception("No areas found in the data file");
            }
            var areas = areaData.Meals.Select((c, i) => new Area
            {
                Id = 200 + i,
                Name = c.StrArea
            });

            modelBuilder.Entity<Area>().HasData(areas);

            string ingredientPath = Path.Combine(dataPath, "ingredients.json");
            var ingData = JsonSerializer.Deserialize<IngredientData>(File.ReadAllText(ingredientPath), options);

            if (ingData?.Meals == null)
            {
                throw new Exception("No ingredients found in the data file");
            }
            var ingredients = ingData.Meals.Select((c, i) => new Ingredient
            {
                Id = int.Parse(c.IdIngredient),
                Name = c.StrIngredient,
                Description = c.StrDescription,
                Type = c.StrType
            });

            modelBuilder.Entity<Ingredient>().HasData(ingredients);

            string recipePath = Path.Combine(dataPath, "recipes.json");
            var recipeData = JsonSerializer.Deserialize<RecipeData>(File.ReadAllText(recipePath), options);

            if (recipeData?.Meals != null)
            {
                var recipes = recipeData.Meals.Select((r, i) => new Recipe
                {
                    Id = int.Parse(r.IdMeal),
                    Name = r.StrMeal,
                    Thumb = r.StrMealThumb,
                    YoutubeUrl = r.StrYoutube,
                    Instructions = r.StrInstructions,
                    Tags = r.StrTags,
                    CategoryId = categories.First(c => c.Name == r.StrCategory).Id,
                    AreaId = areas.First(a => a.Name == r.StrArea).Id,
                });
                modelBuilder.Entity<Recipe>().HasData(recipes);

                var recipeIngredients = recipeData.Meals
                    .SelectMany(r =>
                        r.Ingredients
                            .TakeWhile(ri => ingredients.Any(i => i.Name.ToLower() == ri.Ingredient.ToLower()))
                            .Select(ri => new RecipeIngredient
                            {
                                RecipeId = int.Parse(r.IdMeal),
                                IngredientId = ingredients.First(i => i.Name.ToLower() == ri.Ingredient.ToLower()).Id,
                                Measure = ri.Measure,
                            })
                    )
                    .GroupBy(ri => new { ri.RecipeId, ri.IngredientId })
                    .Select(g => g.First());
                modelBuilder.Entity<RecipeIngredient>().HasData(recipeIngredients);
            }

        }

        public static void SeedData(DbContext context)
        {
            var options = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };
            string dataPath = Path.Combine(Directory.GetCurrentDirectory(), "Data");

            if (!context.Set<Category>().Any())
            {
                string categoryPath = Path.Combine(dataPath, "categories.json");
                using var reader = new StreamReader(categoryPath);
                var json = reader.ReadToEnd(); // Read the whole file content
                var data = JsonSerializer.Deserialize<CategoryData>(json, options);
                if (data?.Categories != null)
                {
                    var categories = data.Categories.Select(c => new Category
                    {
                        Id = int.Parse(c.IdCategory),
                        Name = c.StrCategory,
                        Thumb = c.StrCategoryThumb,
                        Description = c.StrCategoryDescription
                    });

                    context.Set<Category>().AddRange(categories);
                }
            }

            if (!context.Set<Area>().Any()) // Prevent duplicates
            {
                string areaPath = Path.Combine(dataPath, "areas.json");
                using var reader = new StreamReader(areaPath);
                var json = reader.ReadToEnd(); // Read the whole file content
                var data = JsonSerializer.Deserialize<AreaData>(json, options);

                if (data?.Meals != null)
                {
                    var areas = data.Meals.Select(c => new Area
                    {
                        Name = c.StrArea
                    });

                    context.Set<Area>().AddRange(areas);
                }
            }

            if (!context.Set<Ingredient>().Any()) // Prevent duplicates
            {
                string ingredientPath = Path.Combine(dataPath, "ingredients.json");
                using var reader = new StreamReader(ingredientPath);
                var json = reader.ReadToEnd(); // Read the whole file content
                var data = JsonSerializer.Deserialize<IngredientData>(json, options);

                if (data?.Meals != null)
                {
                    var ingredients = data.Meals.Select((c, i) => new Ingredient
                    {
                        Id = int.Parse(c.IdIngredient),
                        Name = c.StrIngredient,
                        Description = c.StrDescription,
                        Type = c.StrType
                    });

                    context.Set<Ingredient>().AddRange(ingredients);
                }
            }
            Console.WriteLine("Seeding recipes");
            if (!context.Set<Recipe>().Any()) // Prevent duplicates
            {
                string recipePath = Path.Combine(dataPath, "recipes.json");
                using var reader = new StreamReader(recipePath);
                var json = reader.ReadToEnd(); // Read the whole file content
                var data = JsonSerializer.Deserialize<RecipeData>(json, options);

                if (data?.Meals != null)
                {
                    var recipes = data.Meals.Select((r, i) => new Recipe
                    {
                        Id = int.Parse(r.IdMeal),
                        Name = r.StrMeal,
                        Thumb = r.StrMealThumb,
                        YoutubeUrl = r.StrYoutube,
                        Instructions = r.StrInstructions,
                        Tags = r.StrTags,
                        Category = context.Set<Category>().First(c => c.Name == r.StrCategory),
                        Area = context.Set<Area>().First(a => a.Name == r.StrArea),
                        Ingredients = r.Ingredients.Select(ri => new RecipeIngredient
                        {
                            Ingredient = context.Set<Ingredient>().First(i => i.Name == ri.Ingredient),
                            Measure = ri.Measure,
                        }).ToList()
                    });

                    context.Set<Recipe>().AddRange(recipes);
                }
            }

            context.SaveChanges();
        }

        public DbSet<Category> Category { get; set; } = default!;
        public DbSet<Area> Area { get; set; } = default!;
        public DbSet<Ingredient> Ingredient { get; set; } = default!;
        public DbSet<RecipeIngredient> RecipeIngredient { get; set; } = default!;
        public DbSet<Recipe> Recipe { get; set; } = default!;
    }
}
