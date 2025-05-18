using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Books.DTO;
using ORM;
using System.Reflection;

namespace Books.Contollers
{
    [ApiController]
    [Route("[controller]")]
    public class BooksController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public BooksController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<BookWithAuthorDto>>> GetBooks(){
            var books = await _context.Books.Include(b => b.Author).ToListAsync();
            var answer = new List<BookWithAuthorDto>();
            foreach (var book in books) {
                var bookDto = new BookWithAuthorDto
                { 
                Title = book.Title,
                PublishedDate = book.PublishedDate,
                Author = new AuthorDto { 
                    Nickname = book.Author.Nickname,
                    Surname = book.Author.Surname,
                    Firstname = book.Author.Firstname
                }
                };
                answer.Add(bookDto);
            }
            return Ok(answer);
        }

    }


}
