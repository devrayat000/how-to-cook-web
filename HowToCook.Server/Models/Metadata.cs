namespace HowToCook.Server.Models
{
    public class Metadata
    {
    }

    public class ListMetadata : Metadata
    {
        public int Count { get; set; }
        public int Total { get; set; }
    }

    public class ListResponse<T>
    {
        public List<T> Items { get; set; }
        public ListMetadata Metadata { get; set; }
    }

    public class SingleResponse<T>
    {
        public T Item { get; set; }
    }
}
