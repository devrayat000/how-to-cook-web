using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HowToCook.Server;
using HowToCook.Server.Models;
using Microsoft.OpenApi.Any;

namespace HowToCook.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RecipesController : ControllerBase
    {
        private readonly RecipeDbContext _context;

        public RecipesController(RecipeDbContext context)
        {
            _context = context;
        }

        // GET: api/Recipes
        [HttpGet]
        public async Task<ActionResult<RecipeListResponse>> GetRecipes([FromQuery] RecipeFilter? filter, string? search)
        {
            IQueryable<Recipe> recipesQuery = _context.Recipe
                .Include(recipe => recipe.Category)
                .Include(recipe => recipe.Area);
            IQueryable<Recipe> countQuery = _context.Recipe;

            if (filter?.Category != null)
            {
                recipesQuery = recipesQuery.Where(r => r.CategoryId == filter.Category);
                countQuery = countQuery.Where(r => r.CategoryId == filter.Category);
            }

            if (filter?.Area != null)
            {
                recipesQuery = recipesQuery.Where(r => r.AreaId == filter.Area);
                countQuery = countQuery.Where(r => r.AreaId == filter.Area);
            }

            if (search != null)
            {
                recipesQuery = recipesQuery.Where(r => r.Tags.Contains(search)
                || r.Name.Contains(search)
                || r.Instructions.Contains(search));
                countQuery = countQuery.Where(r => r.Name.Contains(search)
                || r.Instructions.Contains(search)
                || r.Tags.Contains(search));
            }

            var recipes = await recipesQuery
                .Select(recipe => new RecipeListResponseJson
                {
                    Id = recipe.Id,
                    Name = recipe.Name,
                    Thumb = recipe.Thumb,
                    Category = recipe.Category.Name,
                    Area = recipe.Area.Name,
                })
                .Skip(filter?.Skip ?? 0)
                .Take(filter?.Limit ?? int.MaxValue)
                .ToListAsync();

            return new RecipeListResponse
            {
                Items = recipes,
                Metadata = new ListMetadata
                {
                    Count = recipes.Count,
                    Total = await countQuery.CountAsync(),
                }
            };
        }

        [HttpGet("random")]
        public async Task<ActionResult<RecipeListResponse>> GetRandomRecipe(int count = 12)
        {
            var recipes = await _context.Recipe
                .Include(recipe => recipe.Category)
                .Include(recipe => recipe.Area)
                .Include(recipe => recipe.Ingredients)
                .ThenInclude(ingredient => ingredient.Ingredient)
                .OrderBy(r => EF.Functions.Random())
                .Take(count)
                .Select(recipe => new RecipeListResponseJson
                {
                    Id = recipe.Id,
                    Name = recipe.Name,
                    Thumb = recipe.Thumb,
                    Category = recipe.Category.Name,
                    Area = recipe.Area.Name,
                })
                .ToListAsync();

            return new RecipeListResponse
            {
                Items = recipes,
                Metadata = new ListMetadata
                {
                    Count = recipes.Count,
                    Total = recipes.Count,
                }
            };
        }

        // GET: api/Recipes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<RecipeResponse>> GetRecipe(int id)
        {
            var recipe = await _context.Recipe
                .Include(recipe => recipe.Category)
                .Include(recipe => recipe.Area)
                .Include(recipe => recipe.Ingredients)
                .ThenInclude(ingredient => ingredient.Ingredient)
                .Select(recipe => new RecipeResponseJson
                {
                    Id = recipe.Id,
                    Name = recipe.Name,
                    Thumb = recipe.Thumb,
                    Category = recipe.Category.Name,
                    Area = recipe.Area.Name,
                    Instructions = recipe.Instructions,
                    Ingredients = recipe.Ingredients.Select(ingredient => new JsonRecipeIngredient
                    {
                        Ingredient = ingredient.Ingredient.Name,
                        Measure = ingredient.Measure,
                    }).ToList(),
                })
                .FirstAsync(r => r.Id == id);

            if (recipe == null)
            {
                return NotFound();
            }

            return new RecipeResponse { Item = recipe };
        }
    }
}
