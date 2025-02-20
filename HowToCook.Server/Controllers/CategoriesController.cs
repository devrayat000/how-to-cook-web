using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HowToCook.Server;
using HowToCook.Server.Models;

namespace HowToCook.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesController : ControllerBase
    {
        private readonly RecipeDbContext _context;

        public CategoriesController(RecipeDbContext context)
        {
            _context = context;
        }

        // GET: api/Categories
        [HttpGet]
        public async Task<ActionResult<CategoryListResponse>> GetCategories(string search = "")
        {
            var categories = await _context.Category
                .Select(c => new CategoryListResponseJson
                {
                    Id = c.Id,
                    Name = c.Name,
                    Description = c.Description,
                    Thumb = c.Thumb
                })
                .Where(c => c.Name.Contains(search) || c.Description.Contains(search))
                .ToListAsync();

            return new CategoryListResponse
            {
                Items = categories,
                Metadata = new ListMetadata
                {
                    Count = categories.Count,
                    Total = await _context.Category
                    .Where(c => c.Name.Contains(search) || c.Description.Contains(search))
                    .CountAsync()
                }
            };
        }

        // GET: api/Categories/5
        [HttpGet("{id}")]
        public async Task<ActionResult<CategoryResponse>> GetCategory(int id)
        {
            var category = await _context.Category
                .Select(c => new CategoryResponseJson
                {
                    Id = c.Id,
                    Name = c.Name,
                    Description = c.Description,
                    Thumb = c.Thumb
                })
                .FirstAsync(c => c.Id == id);

            if (category == null)
            {
                return NotFound();
            }

            return new CategoryResponse { Item = category };
        }
    }
}
