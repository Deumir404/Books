
namespace Books.DTO
{
    public class ChapterDtoWithText
    {
        public float Num { get; set; }
        public string Title { get; set; } = string.Empty;
        public DateTime PublishedDate { get; set; } = DateTime.Now;

        public string Text { get; set; } = string.Empty;
    }
    public class ChapterDto
    {
        public float Num { get; set; }
        public string Title { get; set; } = string.Empty;
        public DateTime PublishedDate { get; set; } = DateTime.Now;
    }
    public class FullBook
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime PublishedDate { get; set; }

        public List<ChapterDto> Chapters { get; set; } = new List<ChapterDto>();
        public AuthorDto Author { get; set; } = new();
    }

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

    public class CategoryDto
    {
        public string Name { get; set; } = null!;
    }

    public class TagDto
    {
        public string Name { get; set; } = null!;
    }
}
