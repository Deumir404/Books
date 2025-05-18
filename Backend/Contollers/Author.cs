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
        public async Task<ActionResult<IEnumerable<AuthorDto>>> GetAuthor()
        {
            var authors =  _context.Authors;
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
            var authors = _context.Authors.Include(a => a.Books).FirstOrDefault(a => a.IdAuthor == id);
            var answer = new AuthorWithBooksDto
            {
                Firstname = authors.Firstname,
                Surname = authors.Surname,
                Nickname = authors.Nickname,
                Books = authors.Books.Select(b => new BookDto { Title = b.Title, PublishedDate = b.PublishedDate }).ToList()
            };
            return Ok(answer);
        }

    }

    
}
