
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System.Configuration;



namespace ORM;

public class ApplicationDbContext: DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
        Database.Migrate();
    }
    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        if (!optionsBuilder.IsConfigured) 
        {
            optionsBuilder.LogTo(Console.WriteLine);
            optionsBuilder.UseMySql(
                Dbsettings.Dbconfig,
                new MySqlServerVersion(new Version(8, 0, 11)));
        }
    }
    public DbSet<Author> Authors { get; set; }
    public DbSet<Book> Books { get; set; }
}