using HowToCook.Server;
using Microsoft.EntityFrameworkCore;
using HowToCook.Server.Models;
using System.Text.Json;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddDbContext<RecipeDbContext>(options =>
    options
        .UseSqlite(Environment.GetEnvironmentVariable("DATABASE_CONNECTION"))
        //.UseSeeding((context, _) => RecipeDbContext.SeedData(context))
);

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

//using (var scope = app.Services.CreateScope())
//{
//    var context = scope.ServiceProvider.GetRequiredService<RecipeDbContext>();
//    context.Database.Migrate(); // Apply any pending migrations

//    RecipeDbContext.SeedData(context);
//}

app.UseDefaultFiles();
app.UseStaticFiles();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");

app.Run();
