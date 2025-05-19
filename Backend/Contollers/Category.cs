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
            var categoryDto = category.Select(c => new TagDto {Id = c.IdCategory, Name = c.Name });
            return Ok(categoryDto);
        }

        [HttpPost]
        public async Task<ActionResult<CategoryDto>> CreateChapter(CreateCategoryDto categoryDto)
        {
            if (categoryDto == null)
            {
                return BadRequest();
            }
            var category = new Category { Name = categoryDto.Name};
            _context.Categories.Add(category);
            await _context.SaveChangesAsync();
            return Ok(category);
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
        public async Task<ActionResult<IEnumerable<TagDto>>> GetTag()
        {
            var tags = await _context.Tags.ToListAsync();
            var tagsDto = tags.Select(tag => new TagDto {Id = tag.IdTag, Name = tag.Name });
            return Ok(tagsDto);
        }

        [HttpPost]
        public async Task<ActionResult<CategoryDto>> CreateTag(CreateTagDto tagDto)
        {
            if (tagDto == null)
            {
                return BadRequest();
            }
            var tag = new Tag { Name = tagDto.Name };
            _context.Tags.Add(tag);
            await _context.SaveChangesAsync();
            return Ok(tag);
        }

    }


}
