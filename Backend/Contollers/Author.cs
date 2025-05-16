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
                Firstname = author.Firstname,
                Surname = author.Surname,
                Nickname = author.Nickname};
                answer.Add(authorDto);
            }
            return Ok(answer);
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<Author>> GetAuthorWithBooks(int id)
        {
            var author = await _context.Authors.Include(a => a.Books).FirstOrDefaultAsync(a => a.IdAuthor == id);
            if (author == null)
            {
                return NotFound();
            }
            var answer = new AuthorWithBooksDto
            {
                Firstname = author.Firstname,
                Surname = author.Surname,
                Nickname = author.Nickname,
                Books = author.Books.Select(b => new BookDto { Title = b.Title, PublishedDate = b.PublishedDate }).ToList()
            };
            return Ok(answer);
        }

    }

    
}
