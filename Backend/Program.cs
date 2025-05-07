using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using ORM;
using System.Runtime;

internal class Program
{
    private static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);
        var Dbconfig = builder.Configuration["DefaultConnection"];
        builder.Services.AddDbContext<ApplicationDbContext>(option =>
        {
            option.LogTo(Console.WriteLine);
            option.UseMySql(
                Dbconfig,
                new MySqlServerVersion(new Version(8, 0, 11)));
        }
        );

        var app = builder.Build();

        app.MapGet("/", () => "Hello World!");

        app.UseWelcomePage();
        app.Run();
    }
}