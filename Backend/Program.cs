using Microsoft.EntityFrameworkCore;
using ORM;
using Microsoft.OpenApi.Models;

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
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen(c =>
        {
            c.SwaggerDoc("v1", new OpenApiInfo { Title = "Book API", Version = "v1" });
        });
        


        var app = builder.Build();

        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI(c => 
            { 
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "Book API V1"); 
            });
        }
        app.UseRouting();
        app.MapControllers();
        app.Run();
    }
}