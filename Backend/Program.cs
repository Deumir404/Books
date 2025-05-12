using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using ORM;
using System.Runtime;

internal class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);
        var Dbconfig = builder.Configuration.GetConnectionString("DefaultConnection");
        builder.Services.AddDbContext<ApplicationDbContext>(option =>
        {
            option.LogTo(Console.WriteLine);
            option.UseMySql(
                Dbconfig,
                new MySqlServerVersion(new Version(8, 0, 11)));
        }
        );
        builder.Services.AddControllers();

        var app = builder.Build();
        app.UseRouting();
        app.MapControllers();
        app.Run();
    }
}