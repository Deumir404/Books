
using ORM;

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
        public List<int> Categories { get; set; } = [];
        public List<int> Tags { get; set; } = [];
    }
    public class FullBook
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime PublishedDate { get; set; }

        public float? Rating { get; set; } = null;

        public List<ChapterDto> Chapters { get; set; } = [];
        public AuthorDto Author { get; set; } = new();
        public List<CategoryDto> Categories { get; set; } = [];
        public List<TagDto> Tags { get; set; } = [];

        public string CoverURL { get; set; } = string.Empty;

    }
    public class BookWithAuthorDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;

        public float? Rating { get; set; } = null;
        public DateTime PublishedDate { get; set; }

        public AuthorDto Author { get; set; } = new();
        public string CoverURL { get; set; } = string.Empty;
    }
    public class BookDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public DateTime PublishedDate { get; set; }
        public string CoverURL { get; set; } = string.Empty;
    }

    public class CreateAuthorDto
    {
        public string Firstname { get; set; } = string.Empty;
        public string Surname { get; set; } = string.Empty;
        public string Nickname { get; set; } = string.Empty;
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

        public List<BookDto> Books { get; set; } = [];
    }

    public class CategoryDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
    }
    public class CreateCategoryDto
    {
        public string Name { get; set; } = null!;
    }

    public class TagDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
    }
    public class CreateTagDto
    {
        public string Name { get; set; } = null!;
    }

    public class UserDto
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty!;
        public string Email { get; set; } = string.Empty!;
        public RoleUser Role { get; set; }

    }
    public class SimpleUserDto
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty!;
        
    }

    public class CreateUserDto { 
        public string Username { get; set; } = string.Empty!;
        public string Email { get; set; } = string.Empty!;
        public string Password { get; set; } = string.Empty!;
        public RoleUser Role { get; set; } = RoleUser.Reader;
    }
    public class LoginUserDto
    {
        public string Email { get; set; } = string.Empty!;
        public string Password { get; set; } = string.Empty!;
    }

   
    public class BookMarkDto
    {
        public int IdUserBook { get; set; }
        public BookDto Book { get; set; } = null!;
        public ChapterDto Chapter { get; set; } = null!;
        public UserBookCategory Category { get; set; }

    }
    public class CreateBookMarkDto
    {
        public int IdBook { get; set; }
        public int? IdChapter { get; set; }
        public UserBookCategory Category { get; set; }

    }
}
