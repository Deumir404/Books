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
                Rating = book.Rating,
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

        [HttpGet("{id}")]
        public async Task<ActionResult<BookWithAuthorDto>> GetBook(int id)
        {
            var book = await _context.Books.Include(b => b.Author).FirstOrDefaultAsync(b => b.IdBook == id);
            if (book == null)
            {
                return NotFound();
            }
            var bookDto = new FullBook
            {
                Title = book.Title,
                Description = book.Description,
                Rating = book.Rating,
                PublishedDate = book.PublishedDate,
                Chapters = book.Chapters.Select(c => new ChapterDto { Title = c.Title, PublishedDate = c.PublishedDate }).ToList(),
                Author = new AuthorDto
                {
                    Nickname = book.Author.Nickname,
                    Surname = book.Author.Surname,
                    Firstname = book.Author.Firstname,
                }
            };
            return Ok(bookDto);
        }

    }

    [ApiController]
    [Route("[controller]")]
    public class ChaptersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public ChaptersController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ChapterDtoWithText>> GetText(int id)
        {
            var text = await _context.Chapters.Include(c => c.TextChapters).FirstOrDefaultAsync(c => c.IdChapter == id);
            if (text == null)
            {
                return NotFound();
            }
            var Chapter = new ChapterDtoWithText { 
                Num = text.Num,
                Title = text.Title,
                PublishedDate = text.PublishedDate,
                Text = text.TextChapters.Text,
            };
            
            return Ok(text);
        }

    }

}
