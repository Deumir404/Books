using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Books.DTO;
using ORM;
using Books.Services;

namespace Books.Contollers
{
    [ApiController]
    [Route("[controller]")]
    public class BooksController : ControllerBase
    {
        private readonly IBookService _bookService;
        public BooksController(IBookService bookService)
        {
            _bookService = bookService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<BookWithAuthorDto>>> GetBooks()
        {
            List<BookWithAuthorDto> answer = await _bookService.GetBooksDto();
            return Ok(answer);
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<FullBook>> GetBook(int id)
        {
            FullBook bookDto = await _bookService.GetBookDto(id);
            if (bookDto == null) {
                return NotFound();
            }
            return Ok(bookDto);
        }

        [HttpGet("search")]
        public async Task<ActionResult<FullBook>> GetBookByFilter(string? title, [FromQuery]List<int> category, [FromQuery] List<int> tags)
        {
            List<BookWithAuthorDto> answer = await _bookService.GetBookByParametr(title, category, tags);
            return Ok(answer);
        }

        [HttpPost]
        public async Task<ActionResult<FullBook>> CreateBook(CreateBookDTO bookdto)
        {
            if (bookdto == null)
            {
                return BadRequest();
            }
            ActionResult<FullBook> answer = await _bookService.CreateBookDto(bookdto);
            return answer;
        }


        [HttpPut("{id}")]
        public async Task<ActionResult<FullBook>> ChangeBook(CreateBookDTO bookdto, int id)
        {
            if (bookdto == null)
            {
                return BadRequest();
            }
            var answer = await _bookService.ChangeBookDto(bookdto, id);
            if (answer == null)
            {
                return NotFound();
            }
            return await GetBook(id);
        }


        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteBook(int id)
        {
            var answer = await _bookService.DeleteBookDto(id);
            if (!answer)
            {
                return NotFound();
            }
            return Ok("Book deleted");
        }


        [HttpPost("{id}/cover")]
        public async Task<IActionResult> UploadCover(int id, IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded");
            await _bookService.UploadCoverById(id, file);
            return Ok("Cover uploaded successfully");
        }

       



    }

    [ApiController]
    [Route("Books/[controller]")]
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

        [HttpPut("{id}")]
        public async Task<ActionResult<ChapterDtoWithText>> ChangeChapter(CreateChapterDto chapterDto, int id)
        {
            if (chapterDto == null)
            {
                return BadRequest();
            }
            var chapter = await _context.Chapters.FirstOrDefaultAsync(c => c.IdChapter == id);
            if (chapter == null)
            {
                return NotFound();
            }
            chapter.Title = chapterDto.Title;
            chapter.Num = chapterDto.Num;
            chapter.IdBook = chapterDto.Book;
            await _context.SaveChangesAsync();
            var chapterText = await _context.TextChapters.FirstOrDefaultAsync(c => c.IdChapter == chapter.IdChapter);
            if (chapterText == null)
            {
                return NotFound();
            }
            chapterText.Text = chapterDto.Text;
            return await GetText(id);
        }
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteChapter(int id)
        {
            var chapter = await _context.Chapters.FirstOrDefaultAsync(b => b.IdChapter == id);
            if (chapter == null)
            {
                return NotFound();
            }
            var chapterText = await _context.TextChapters.FirstOrDefaultAsync(_ => _.IdChapter == id);
            if (chapterText == null)
            {
                return NotFound();
            }
            _context.Chapters.Remove(chapter);
            _context.TextChapters.Remove(chapterText);
            _context.SaveChanges();
            return Ok("Chapter deleted");
        }

    }

}
