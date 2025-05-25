using Books.DTO;
using Books.Services;
using Microsoft.AspNetCore.Mvc;

namespace Books.Contollers
{
    [Route("[controller]")]
    [ApiController]
    public class AuthorsController : ControllerBase
    {
        private readonly IAuthorService _authorService;
        public AuthorsController(IAuthorService authorService)
        {
            _authorService = authorService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<AuthorDto>>> GetAuthors()
        {
            List<AuthorDto> answer = await _authorService.GetAuthorsDto();
            return Ok(answer);
        }

        
       

        [HttpGet("{id}")]
        public async Task<ActionResult<AuthorWithBooksDto>> GetAuthorWithBooks(int id)
        {
            var answer = await _authorService.GetAuthorDto(id);
            if (answer == null)
            {
                return NotFound();
            }
            return Ok(answer);
        }




        [HttpPost]
        public async Task<ActionResult<AuthorWithBooksDto>> CreateAuthor(CreateAuthorDto authorDto)
        {
            if (authorDto == null)
            {
                return BadRequest();
            }
            var author = await _authorService.CreateAuthorDto(authorDto);
            return Ok(author);
        }

        


        [HttpPut("{id}")]
        public async Task<ActionResult<AuthorWithBooksDto>> ChangeAuthor(CreateAuthorDto authorDto, int id)
        {
            if (authorDto == null)
            {
                return BadRequest();
            }
            var author = await _authorService.ChangeAuthorDto(authorDto, id);
            if (author == null)
            {
                return NotFound();
            }
            return Ok(author);
        }

       

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteAuthor(int id)
        {
            var answer = await _authorService.DeleteAuthorDto(id);
            if (!answer)
            {
                return NotFound();
            }
            return Ok("Author deleted");
        }

        

    }

    
}
