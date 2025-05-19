
namespace Books.DTO
{
    public class ChapterDtoWithText
    {
        public int Id { get; set; }
        public float Num { get; set; }
        public string Title { get; set; } = string.Empty;
        public DateTime PublishedDate { get; set; } = DateTime.Now;

        public string Text { get; set; } = string.Empty;
    }
    public class ChapterDto
    {
        public int Id { get; set; }
        public float Num { get; set; }
        public string Title { get; set; } = string.Empty;
        public DateTime PublishedDate { get; set; } = DateTime.Now;
    }
    public class CreateChapterDto
    {
        public float Num { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Text { get; set; } = string.Empty;
        public int Book {  get; set; }
    }

    public class CreateBookDTO
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public int Author { get; set; } 
    }
    public class FullBook
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime PublishedDate { get; set; }

        public float? Rating { get; set; } = null;

        public List<ChapterDto> Chapters { get; set; } = new List<ChapterDto>();
        public AuthorDto Author { get; set; } = new();
    }
    public class BookWithAuthorDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;

        public float? Rating { get; set; } = null;
        public DateTime PublishedDate { get; set; }

        public AuthorDto Author { get; set; } = new();
    }
    public class BookDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public DateTime PublishedDate { get; set; }
    }

  
    public class AuthorDto
    {
        public int Id { get; set; }
        public string Firstname { get; set; } = string.Empty;
        public string Surname { get; set; } = string.Empty;
        public string Nickname { get; set; } = string.Empty;
    }
    public class AuthorWithBooksDto
    {
        public int Id { get; set; }
        public string Firstname { get; set; } = string.Empty;
        public string Surname { get; set; } = string.Empty;
        public string Nickname { get; set; } = string.Empty;

        public List<BookDto> Books { get; set; } = new();
    }

    public class CategoryDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
    }

    public class TagDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
    }
}
