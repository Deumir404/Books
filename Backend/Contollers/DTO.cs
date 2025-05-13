namespace Books.DTO
{
    public class BookWithAuthorDto
    {
        public string Title { get; set; } = string.Empty;
        public DateTime PublishedDate { get; set; }
        public AuthorDto Author { get; set; } = new();
    }
    public class BookDto
    {
        public string Title { get; set; } = string.Empty;
        public DateTime PublishedDate { get; set; }
    }

    public class AuthorDto
    {
        public string Firstname { get; set; } = string.Empty;
        public string Surname { get; set; } = string.Empty;
        public string Nickname { get; set; } = string.Empty;
    }

    public class AuthorWithBooksDto
    {
        public string Firstname { get; set; } = string.Empty;
        public string Surname { get; set; } = string.Empty;
        public string Nickname { get; set; } = string.Empty;

        public List<BookDto> Books { get; set; } = new();
    }
}
