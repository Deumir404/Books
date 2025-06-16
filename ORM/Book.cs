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

    public class CommentBook
    {
        [Key]
        public int IdComment { get; set; }
        [Required]
        public string Text { get; set; } = string.Empty;
        [Required]
        public DateTime PublishedDate { get; set; } = DateTime.Now;
        public int IdBook { get; set; }
        [ForeignKey(nameof(IdBook))]
        public Book Book { get; set; } = null!;

        public int Iduser { get; set; }
        [ForeignKey(nameof(Iduser))]
        public User User { get; set; } = null!;
    }

    public enum ComplaintStatus
    {
        New,            // Новая жалоба
        InProgress,     // В процессе рассмотрения
        Resolved,       // Решена
        Rejected        // Отклонена
    }

    public class CommentComplaint
    {
        [Key]
        public int IdComplaint { get; set; }
        [Required]
        public string Text { get; set; } = string.Empty;
        public int Idcomment { get; set; }
        [ForeignKey(nameof(Idcomment))]
        public CommentBook comment { get; set; } = null!;
        public int IdUser { get; set; }
        [ForeignKey(nameof(IdUser))]
        public User User { get; set; } = null!;
        public ComplaintStatus ComplaintStatus { get; set; }

        [Required]
        public DateTime PublishedDate { get; set; } = DateTime.Now;
    }

    public class ReviewBook
    {
        [Key]
        public int IdReview { get; set; }

        [Required]
        public int Review;
        public int IdBook { get; set; }
        [ForeignKey(nameof(IdBook))]
        public Book Book { get; set; } = null!;

        public int IdUser { get; set; }
        [ForeignKey(nameof(IdUser))]
        public User User { get; set; } = null!;
    }

}
