using Microsoft.AspNetCore.Mvc;
using Books.DTO;
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
        [HttpPost("{id}/file")]
        public async Task<IActionResult> UploadFile(int id, IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded");
            try
            {
                await _bookService.UploadFileById(id, file);
                return Ok("File uploaded successfully");
            }
            catch (Exception ex) {
                return BadRequest(ex.Message);
            }
           
        }


        [HttpGet("download")]
        public async Task<IActionResult> DownloadFile([FromQuery] string path )
        {
            try
            {
                var fullPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", path.TrimStart('/'));
                if (string.IsNullOrEmpty(fullPath) || !System.IO.File.Exists(fullPath))
                {
                    return NotFound("File not found");
                }

                var fileName = Path.GetFileName(fullPath);
                var fileBytes = await System.IO.File.ReadAllBytesAsync(fullPath);

                return File(fileBytes, "application/octet-stream", fileName);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

    }

    [ApiController]
    [Route("Books/[controller]")]
    public class ChaptersController : ControllerBase
    {
        private readonly IChapterService _chapterService;
        public ChaptersController(IChapterService chapterService)
        {
            _chapterService = chapterService;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ChapterDtoWithText>> GetText(int id)
        {
            var answer = await _chapterService.GetChapterDto(id);
            if (answer == null)
            {
                return NotFound();
            }
            return Ok(answer);
        }

        [HttpPost]
        public async Task<ActionResult<ChapterDtoWithText>> CreateChapter(CreateChapterDto chapterdto)
        {
            if (chapterdto == null)
            {
                return BadRequest();
            }
            var answer = await _chapterService.CreateChapterDto(chapterdto);
            return Ok(answer);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ChapterDtoWithText>> ChangeChapter(CreateChapterDto chapterDto, int id)
        {
            if (chapterDto == null)
            {
                return BadRequest();
            }
            var chapter  = await _chapterService.ChangeChapterDto(chapterDto, id);
            if (chapter == null)
            {
                return NotFound();
            }
            return Ok(chapter);
        }

       

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteChapter(int id)
        {
            var chapter = await _chapterService.DeleteChapterDto(id);
            return Ok("Chapter deleted");
        }

        

    }

}
