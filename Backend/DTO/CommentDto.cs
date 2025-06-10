namespace Books.DTO
{
    public class CommentDto
    {
        public int Id { get; set; }
        public string Text { get; set; } = string.Empty;
        public DateTime CreatedDate { get; set; }
        public int BookId { get; set; } 
        public SimpleUserDto User { get; set; } = null!;
    }

    public class CreateCommentDto
    {
        public string Text { get; set; } = string.Empty;
        public int BookId { get; set; }
        public int UserId { get; set; } 
    }
}
