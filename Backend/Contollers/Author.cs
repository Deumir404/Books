using Books.DTO;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ORM;

namespace Books.Contollers
{
    [Route("[controller]")]
    [ApiController]
    public class AuthorsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public AuthorsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<AuthorDto>>> GetAuthors()
        {
            var authors =  await _context.Authors.ToListAsync();
            var answer = new List<AuthorDto>();
            foreach (var author in authors)
            {
                var authorDto = new AuthorDto { 
                Id = author.IdAuthor,
                Firstname = author.Firstname,
                Surname = author.Surname,
                Nickname = author.Nickname};
                answer.Add(authorDto);
            }
            return Ok(answer);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<AuthorWithBooksDto>> GetAuthorWithBooks(int id)
        {
            var author = await _context.Authors.Include(a => a.Books).FirstOrDefaultAsync(a => a.IdAuthor == id);
            if (author == null)
            {
                return NotFound();
            }
            var answer = new AuthorWithBooksDto
            {
                Id = author.IdAuthor,
                Firstname = author.Firstname,
                Surname = author.Surname,
                Nickname = author.Nickname,
                Books = author.Books.Select(b => new BookDto {Id = b.IdBook, Title = b.Title, PublishedDate = b.PublishedDate }).ToList()
            };
            return Ok(answer);
        }

        [HttpPost]
        public async Task<ActionResult<AuthorWithBooksDto>> CreateAuthor(CreateAuthorDto authorDto)
        {
            if (authorDto == null)
            {
                return BadRequest();
            }
            var author = new Author { Surname = authorDto.Surname , Firstname = authorDto.Firstname, Nickname = authorDto.Nickname};
            _context.Authors.Add(author);
            await _context.SaveChangesAsync();
            return await GetAuthorWithBooks(author.IdAuthor);
        }

    }

    
}
