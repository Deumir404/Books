using ORM;

namespace Books.DTO
{
    public class ComplaintDto
    {
        public int Id { get; set; }
        public string Text { get; set; } = string.Empty;
        public CommentDto Comment { get; set; } = null!;
        public SimpleUserDto User { get; set; } = null!;
        public ComplaintStatus Status { get; set; }
        public DateTime PublishedDate { get; set; }

    }
    public class CreateComplaintDto
    {
        public string Text { get; set; } = string.Empty;
        public int IdComment { get; set; }
        public int IdUser { get; set; } 
        public ComplaintStatus Status { get; set; }
       

    }
}
