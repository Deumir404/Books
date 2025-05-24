using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace ORM
{
   
    public class User
    {
        [Key]
        public int IdUser { get; set; }

        [Required]
        [MaxLength(250)]
        public string Username { get; set; } = string.Empty;

        [Required]
        public string PasswordHash { get; set; } = string.Empty;

        [Required]
        [MaxLength(250)]
        public string Email { get; set; } = string.Empty;

        public ICollection<UserBook> UserBooks { get; set; } = [];


    }

    public enum UserBookCategory
    {
        Reading,
        Plans,
        Suspended,
        Completed
    }
    public class UserBook
    {
        [Key]
        public int IdUserBook { get; set; }

        public int IdUser { get; set; }
        [ForeignKey(nameof(IdUser))]
        public User User { get; set; } = null!;

        public int IdBook { get; set; }
        [ForeignKey(nameof(IdBook))]
        public Book Book { get; set; } = null!;

        [Required]
        public UserBookCategory Status { get; set; }

        public int IdChapter { get; set; }
        [ForeignKey(nameof(IdChapter))]
        public Chapter Chapter { get; set; } = null!;

    }
}
