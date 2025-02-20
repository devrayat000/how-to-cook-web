using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HowToCook.Server.Models
{
    public class Area
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
    }

    public class JsonArea
    {
        public string StrArea { get; set; }
    }

    // Helper class for JSON mapping
    public class AreaData
    {
        public List<JsonArea> Meals { get; set; }
    }

    public class AreaListResponse : ListResponse<Area>
    {
    }

    public class AreaResponse : SingleResponse<Area>
    {
    }
}
