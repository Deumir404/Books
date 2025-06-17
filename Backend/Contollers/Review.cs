using global::Books.DTO;
using global::Books.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
namespace Books.Contollers
{
    [Route("[controller]")]
    [ApiController]
    public class ReviewController : ControllerBase
    {
        private readonly IReviewService _reviewService;
        public ReviewController(IReviewService reviewService)
        {
            _reviewService = reviewService;
        }

        [HttpGet("user/{idUser}/book/{idBook}")]
        public async Task<ActionResult<ReviewDto>> GetReview(int idUser, int idBook)
        {
            var answer = await _reviewService.GetReviewDtoByUser(idUser, idBook);
            if (answer == null)
            {
                return NotFound(answer);
            }
            return Ok(answer);
        }
        [Authorize]
        [HttpPost("book/{idBook}")]
        public async Task<ActionResult<ReviewDto>> CreateReview(CreateReviewDto reviewDto, int idBook)
        {
            var idUser = User.GetUserId();
            if (idUser == null)
            {
                return Unauthorized();
            }
            if (reviewDto == null)
            {
                return BadRequest();
            }
            var review = await _reviewService.CreateReviewDto(reviewDto, idUser.Value, idBook);
            return Ok(review);
        }
       
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteReview(int id)
        {
            var answer = await _reviewService.DeleteReviewDto(id);
            if (!answer)
            {
                return NotFound();
            }
            return Ok("Review deleted");
        }



    }
}
