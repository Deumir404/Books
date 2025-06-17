using ORM;

namespace Books.DTO
{
    public class RoleApplicatonDto
    {
        public int Id { get; set; }
        public string Text { get; set; } = string.Empty;
        public SimpleUserDto User { get; set; } = null!;
        public RoleUser RoleUser { get; set; }
        public DateTime PublishedDate { get; set; }

    }
    public class CreateRoleApplicatonDto
    {
        public string Text { get; set; } = string.Empty;
        public int IdUser { get; set; }
        public RoleUser RoleUser { get; set; }
    }
}
