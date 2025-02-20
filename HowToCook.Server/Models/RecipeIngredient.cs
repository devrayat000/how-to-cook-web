using Microsoft.EntityFrameworkCore;

namespace HowToCook.Server.Models
{
    [PrimaryKey(nameof(RecipeId), nameof(IngredientId))]
    public class RecipeIngredient
    {
        public int RecipeId { get; set; }
        public Recipe Recipe { get; set; } = null!;
        public int IngredientId { get; set; }
        public Ingredient Ingredient { get; set; } = null!;
        public string Measure { get; set; }
    }

    public class JsonRecipeIngredient
    {
        public string Ingredient { get; set; }
        public string Measure { get; set; }
    }

}
