using System.ComponentModel.DataAnnotations;

namespace HowToCook.Server.Models
{
    public class Ingredient
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
        public string? Description { get; set; }
        public string? Type { get; set; }
    }

    public class JsonIngredient
    {
        public string IdIngredient { get; set; }
        public string StrIngredient { get; set; }
        public string? StrDescription { get; set; }
        public string? StrType { get; set; }
    }

    public class IngredientData
    {
        public List<JsonIngredient> Meals { get; set; }
    }
}
