using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace ORM
{
    public class Author
    {
        [Key]
        public int IdAuthor { get; set; }

        [Required]
        [MaxLength(250)]
        public string Surname { get; set; }

        [Required]
        [MaxLength(250)]
        public string Firstname { get; set; }

        [Required]
        [MaxLength(250)]
        public string Nickname { get; set; }

    }

    public enum StatusBook
    {
        Pending,
        Shipped,
        Delivered,
        Canceled
    }
    public class Book
    {
        [Key]
        public int IdBook { get; set; }

        [Required]
        [MaxLength(250)]
        public string Title { get; set; }

        [Required]
        public DateTime PublishedDate { get; set; }

        public int AuthorId { get; set; }
        [ForeignKey(nameof(AuthorId))]
        public Author Author { get; set; }

        public float Rating {  get; set; }
        [Required]
        public StatusBook Status { get; set; }

    }
}
