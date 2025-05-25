using Microsoft.AspNetCore.Mvc;
using Books.DTO;
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
        private readonly ITagService _tagService;
        public TagsController(ITagService tagService)
        {
            _tagService = tagService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TagDto>>> GetTag()
        {
            var tags = await _tagService.GetTag();
            return Ok(tags);
        }

        [HttpPost]
        public async Task<ActionResult<TagDto>> CreateTag(CreateTagDto tagDto)
        {
            if (tagDto == null)
            {
                return BadRequest();
            }
            var answer = await _tagService.CreateCategoryDTO(tagDto);
            return Ok(answer);
            
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<TagDto>> ChangeTag(CreateTagDto tagDto, int id)
        {
            if (tagDto == null)
            {
                return BadRequest();
            }
            var tag = await _tagService.ChangeCategoryDTO(tagDto, id);
            if (tag == null)
            {
                return NotFound();
            }
            return Ok(tag);
        }
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteTag(int id)
        {
            var tag = await _tagService.DeleteCategoryDto(id);
            if (tag == null)
            {
                return NotFound();
            }
            return Ok("Tag deleted");
        }
    }


}
