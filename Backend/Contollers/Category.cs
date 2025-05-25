using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Books.DTO;
using ORM;
using Books.Services;

namespace Books.Contollers
{
    [ApiController]
    [Route("[controller]")]
    public class CategoriesController : ControllerBase
    {
        private readonly ICategoryService _categoryService;

        public CategoriesController(ICategoryService categoryService)
        {
            _categoryService = categoryService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<CategoryDto>>> GetCategory()
        {
            var category = await _categoryService.GetCategory();
            return Ok(category);
        }

        [HttpPost]
        public async Task<ActionResult<CategoryDto>> CreateChapter(CreateCategoryDto categoryDto)
        {
            if (categoryDto == null)
            {
                return BadRequest();
            }
            var answer = await _categoryService.CreateCategoryDTO(categoryDto);
            
            return Ok(answer);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<CategoryDto>> ChangeCategory(CreateCategoryDto categoryDto, int id)
        {
            if (categoryDto == null)
            {
                return BadRequest();
            }
            var answer = await _categoryService.ChangeCategoryDTO(categoryDto, id);
            if (answer == null) { 
                return NotFound();
            }
            return Ok(answer);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteCategory(int id)
        {
            var answer = await _categoryService.DeleteCategoryDto(id);
            if (answer)
            {
                return Ok(answer);
            }
            else
            {
                return NotFound();
            }
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
        public async Task<ActionResult<TagDto>> CreateTag(CreateTagDto tagDto)
        {
            if (tagDto == null)
            {
                return BadRequest();
            }
            var tag = new Tag { Name = tagDto.Name };
            _context.Tags.Add(tag);
            var answer = new TagDto {Id = tag.IdTag, Name = tag.Name };
            await _context.SaveChangesAsync();
            return Ok(answer);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<TagDto>> ChangeTag(CreateTagDto tagDto, int id)
        {
            if (tagDto == null)
            {
                return BadRequest();
            }
            var tag = await _context.Tags.FirstOrDefaultAsync(c => c.IdTag == id);
            if (tag == null)
            {
                return NotFound();
            }
            tag.Name = tagDto.Name;
            var answer = new TagDto {Id = tag.IdTag, Name = tag.Name };
            await _context.SaveChangesAsync();
            return Ok(answer);
        }
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteTag(int id)
        {
            var tag = await _context.Tags.FirstOrDefaultAsync(b => b.IdTag == id);
            if (tag == null)
            {
                return NotFound();
            }
            _context.Tags.Remove(tag);
            _context.SaveChanges();
            return Ok("Tag deleted");
        }
    }


}
