using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace ORM
{
    public class Tag
    {
        [Key]
        public int IdTag { get; set; }

        [Required]
        [MaxLength(250)]
        public string Name { get; set; } = string.Empty;

        public ICollection<Book> Books { get; set; } = new List<Book>();

    }
    public class Category
    {
        [Key]
        public int IdCategory { get; set; }

        [Required]
        [MaxLength(250)]
        public string Name { get; set; } = string.Empty;

        public ICollection<Book> Books { get; set; } = new List<Book>();

    }
    public class Author
    {
        [Key]
        public int IdAuthor { get; set; }

        [MaxLength(250)]
        public string Surname { get; set; } = string.Empty ;

        [MaxLength(250)]
        public string Firstname { get; set; } = string.Empty ;

        [Required]
        [MaxLength(250)]
        public string Nickname { get; set; } = string.Empty ;

        public ICollection<Book> Books { get; set; } = new List<Book>();

    }

    public enum StatusBook
    {
        Ongoing,
        Suspended,
        Completed
    }
    public class Book
    {
        [Key]
        public int IdBook { get; set; }

        [Required]
        [MaxLength(250)]
        public string Title { get; set; } = string.Empty;

        [Required]
        public DateTime PublishedDate { get; set; } = DateTime.Now;

        [Required]
        [MaxLength(500)]
        public string Description { get; set; } = string.Empty;

        public int IdAuthor { get; set; }
        [ForeignKey(nameof(IdAuthor))]
        public Author Author { get; set; } = null!;

        public float? Rating { get; set; } = null;

        [Required]
        public StatusBook Status { get; set; }

        public ICollection<Chapter> Chapters { get; set; } = new List<Chapter>();
        public ICollection<Category> Categories { get; set; } = new List<Category>();
        public ICollection<Tag> Tags { get; set; } = new List<Tag>();

    }

    public class Chapter
    {
        [Key]
        public int IdChapter { get; set; }

        [Required]
        public float Num { get; set; }

        [Required]
        [MaxLength(250)]
        public string Title { get; set; } = string.Empty;

        [Required]
        public DateTime PublishedDate { get; set; } = DateTime.Now;

        public int IdBook { get; set; }
        [ForeignKey(nameof(IdBook))]
        public Book Book { get; set; } = null!;

        public TextChapter TextChapter { get; set; } = null!;

    }

    public class TextChapter
    {
        [Key]
        public int IdChapter { get; set; }
        [Required]
        public string Text {  get; set; } = string.Empty;

        [ForeignKey(nameof(IdChapter))]
        public Chapter Chapter { get; set; } = null!;
    }
}
