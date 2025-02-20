using System.ComponentModel.DataAnnotations;

namespace HowToCook.Server.Models
{
    public class Recipe
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
        [Url]
        public string? Thumb { get; set; }
        public string? YoutubeUrl { get; set; }
        public int CategoryId { get; set; }
        public Category Category { get; set; }
        public int AreaId { get; set; }
        public Area Area { get; set; }
        public string Instructions { get; set; }
        public List<RecipeIngredient> Ingredients { get; set; }
        public string? Tags { get; set; }
    }

    public class JsonRecipe
    {
        public string IdMeal { get; set; }
        public string StrMeal { get; set; }
        public string StrCategory { get; set; }
        public string StrArea { get; set; }
        public string StrInstructions { get; set; }
        public string StrMealThumb { get; set; }
        public string? StrYoutube { get; set; }
        public string? StrTags { get; set; }
        public List<JsonRecipeIngredient> Ingredients { get; set; }
    }

    public class RecipeData
    {
        public List<JsonRecipe> Meals { get; set; }
    }

    public class RecipeListResponseJson
    {
        public int Id { get; set; }
        public string Name { get; set; }
        [Url]
        public string? Thumb { get; set; }
        public string Category { get; set; }
        public string Area { get; set; }
    }

    public class RecipeResponseJson : RecipeListResponseJson
    {
        public string Instructions { get; set; }
        public List<JsonRecipeIngredient> Ingredients { get; set; }
    }

    public class RecipeResponse : SingleResponse<RecipeResponseJson>
    {
    }

    public class RecipeListResponse : ListResponse<RecipeListResponseJson>
    {
    }

    public class RecipeFilter
    {
        public int? Category { get; set; }
        public int? Area { get; set; }
        public int? Skip { get; set; }
        public int? Limit { get; set; }
        //public string? Ingredient { get; set; }
    }
}
