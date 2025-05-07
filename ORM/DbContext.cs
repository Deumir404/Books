
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System.Configuration;


namespace ORM;

public class ApplicationDbContext: DbContext
{
    public ApplicationDbContext()
    {
        Database.EnsureCreated();
    }
    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.LogTo(Console.WriteLine);
        optionsBuilder.UseMySql(
            Dbsettings.Dbconfig,
            new MySqlServerVersion(new Version(8, 0, 11)));
    }
}