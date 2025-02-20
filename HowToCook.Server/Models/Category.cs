using System.ComponentModel.DataAnnotations;

namespace HowToCook.Server.Models
{
    public class CategoryBase
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public string Description { get; set; }
        public string Thumb { get; set; }
    }
    public class Category : CategoryBase
    {
        public List<Recipe> Recipes { get; set; }
    }

    public class JsonCategory
    {
        public string IdCategory { get; set; }
        public string StrCategory { get; set; }
        public string StrCategoryThumb { get; set; }
        public string StrCategoryDescription { get; set; }
    }

    // Helper class for JSON mapping
    public class CategoryData
    {
        public List<JsonCategory> Categories { get; set; }
    }

    public class CategoryListResponseJson : CategoryBase
    {
    }

    public class CategoryResponseJson : CategoryBase
    {
    }

    public class CategoryResponse : SingleResponse<CategoryResponseJson>
    {
    }

    public class CategoryListResponse : ListResponse<CategoryListResponseJson>
    {
    }

}