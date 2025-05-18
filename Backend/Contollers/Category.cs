using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Books.DTO;
using ORM;

namespace Books.Contollers
{
    [ApiController]
    [Route("[controller]")]
    public class CategoriesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public CategoriesController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<CategoryDto>>> GetCategory()
        {
            var category = await _context.Categories.ToListAsync();
            var categoryDto = category.Select(tag => new TagDto { Name = tag.Name });
            return Ok(categoryDto);
        }

    }

    [ApiController]
    [Route("[controller]")]
    public class TagsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public TagsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TagDto>>> GetCategory()
        {
            var tags = await _context.Tags.ToListAsync();
            var tagsDto = tags.Select(tag => new TagDto { Name = tag.Name });
            return Ok(tagsDto);
        }

    }


}
