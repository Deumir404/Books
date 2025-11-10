
using Microsoft.EntityFrameworkCore;



namespace ORM;

public class ApplicationDbContext: DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
        Database.Migrate();
    }
    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        
    }
    public DbSet<Author> Authors { get; set; }
    public DbSet<Book> Books { get; set; }
    public DbSet<Tag> Tags { get; set; }
    public DbSet<Category> Categories { get; set; }
    public DbSet<Chapter> Chapters { get; set; }
    public DbSet<TextChapter> TextChapters { get; set; }
    public DbSet<CommentBook> CommentBooks { get; set; }
    public DbSet<ReviewBook> Reviews { get; set; }
    public DbSet<CommentComplaint> Complaint { get; set; }

    public DbSet<User> Users { get; set; }
    public DbSet<UserBook> UserBooks { get; set; }
    public DbSet<RoleApplication> RoleApplications { get; set; }


    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>().HasIndex(e => e.Email).IsUnique();
        modelBuilder.Entity<Book>()
            .HasMany(s => s.Categories)
            .WithMany(c => c.Books)
            .UsingEntity(j => j.ToTable("BookCategory"));
        modelBuilder.Entity<Book>()
            .HasMany(s => s.Tags)
            .WithMany(c => c.Books)
            .UsingEntity(j => j.ToTable("BookTag"));
        modelBuilder.Entity<Chapter>()
            .HasOne(c => c.TextChapter)
            .WithOne(t => t.Chapter)
            .HasForeignKey<TextChapter>(t => t.IdChapter);
    }
}