using global::Books.DTO;
using global::Books.Services;
using Microsoft.AspNetCore.Mvc;
namespace Books.Contollers
{
    [Route("[controller]")]
    [ApiController]
    public class CommentController : ControllerBase
    {
        private readonly ICommentBookService _commentService;
        public CommentController(ICommentBookService commentService)
        {
            _commentService = commentService;
        }

        [HttpGet("/book/{id}")]
        public async Task<ActionResult<IEnumerable<CommentDto>>> GetCommentByBook(int id)
        {
            var answer = await _commentService.GetCommentDtoByBook(id);
            return Ok(answer);
        }
        [HttpGet("/user/{id}")]
        public async Task<ActionResult<IEnumerable<CommentDto>>> GetAuthorWithBooks(int id)
        {
            var answer = await _commentService.GetCommentDtoByUser(id);
            return Ok(answer);
        }
        [HttpPost]
        public async Task<ActionResult<CommentDto>> CreateAuthor(CreateCommentDto commentDto)
        {
            if (commentDto == null)
            {
                return BadRequest();
            }
            var author = await _commentService.CreateCommentDto(commentDto);
            return Ok(author);
        }
        [HttpPut("{id}")]
        public async Task<ActionResult<CommentDto>> ChangeAuthor(CreateCommentDto commentDto, int id)
        {
            if (commentDto == null)
            {
                return BadRequest();
            }
            var author = await _commentService.ChangeCommentDto(commentDto, id);
            if (author == null)
            {
                return NotFound();
            }
            return Ok(author);
        }
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteAuthor(int id)
        {
            var answer = await _commentService.DeleteCommentDto(id);
            if (!answer)
            {
                return NotFound();
            }
            return Ok("Comment deleted");
        }



    }
}
