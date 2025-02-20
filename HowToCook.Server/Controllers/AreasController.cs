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
    public class AreasController : ControllerBase
    {
        private readonly RecipeDbContext _context;

        public AreasController(RecipeDbContext context)
        {
            _context = context;
        }

        // GET: api/Areas
        [HttpGet]
        public async Task<ActionResult<AreaListResponse>> GetArea()
        {
            var areas = await _context.Area.ToListAsync();
            return new AreaListResponse
            {
                Items = areas,
                Metadata = new ListMetadata
                {
                    Count = areas.Count,
                    Total = areas.Count
                }
            };
        }

        // GET: api/Areas/5
        [HttpGet("{id}")]
        public async Task<ActionResult<AreaResponse>> GetArea(int id)
        {
            var area = await _context.Area.FindAsync(id);

            if (area == null)
            {
                return NotFound();
            }

            return new AreaResponse { Item = area };
        }
    }
}
