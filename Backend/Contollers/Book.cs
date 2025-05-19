using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Books.DTO;
using ORM;
using System.Reflection;
using Humanizer;

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
                Id = book.IdBook,
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
        public async Task<ActionResult<FullBook>> GetBook(int id)
        {
            var book = await _context.Books.Include(b => b.Author).Include(b => b.Categories).Include(b=> b.Tags).FirstOrDefaultAsync(b => b.IdBook == id);
            if (book == null)
            {
                return NotFound();
            }
            var bookDto = new FullBook
            {
                Id = book.IdBook,
                Title = book.Title,
                Description = book.Description,
                Categories = book.Categories.Select(c => new CategoryDto { Name = c.Name}).ToList(),
                Tags = book.Tags.Select(c => new TagDto { Name = c.Name }).ToList(),
                Rating = book.Rating,
                PublishedDate = book.PublishedDate,
                Chapters = book.Chapters.Select(c => new ChapterDto {Id = c.IdChapter, Title = c.Title, PublishedDate = c.PublishedDate }).ToList(),
                Author = new AuthorDto
                {
                    Nickname = book.Author.Nickname,
                    Surname = book.Author.Surname,
                    Firstname = book.Author.Firstname,
                }

            };
            return Ok(bookDto);
        }

        [HttpPost]
        public async Task<ActionResult<FullBook>> CreateBook(CreateBookDTO bookdto)
        {
            if (bookdto == null)
            {
                return BadRequest();
            }
            var categories = await _context.Categories
                .Where(c => bookdto.Categories.Contains(c.IdCategory))
                .ToListAsync();
            var tags = await _context.Tags
                .Where(c => bookdto.Tags.Contains(c.IdTag))
                .ToListAsync();
            var book = new Book { Title = bookdto.Title, Description = bookdto.Description , IdAuthor = bookdto.Author, Categories = categories, Tags = tags};
            _context.Books.Add(book);
            await _context.SaveChangesAsync();
            var answer = await GetBook(id: book.IdBook);
            return answer;
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
            var text = await _context.Chapters.Include(c => c.TextChapter).FirstOrDefaultAsync(c => c.IdChapter == id);
            if (text == null)
            {
                return NotFound();
            }
            var Chapter = new ChapterDtoWithText { 
                Id = text.IdChapter,
                Num = text.Num,
                Title = text.Title,
                PublishedDate = text.PublishedDate,
                Text = text.TextChapter.Text,
            };
            
            return Ok(Chapter);
        }

        [HttpPost]
        public async Task<ActionResult<ChapterDtoWithText>> CreateChapter(CreateChapterDto chapterdto)
        {
            if (chapterdto == null)
            {
                return BadRequest();
            }
            var chapter = new Chapter { Title = chapterdto.Title, Num = chapterdto.Num, IdBook = chapterdto.Book};
            _context.Chapters.Add(chapter);
            await _context.SaveChangesAsync();
            var textchapter = new TextChapter { IdChapter = chapter.IdChapter, Text = chapterdto.Text };
            _context.TextChapters.Add(textchapter);
            await _context.SaveChangesAsync();
            var answer = await GetText(id: chapter.IdChapter);
            return answer;
        }

    }

}
