using Books.DTO;
using ORM;
using Books.Repository;

namespace Books.Services
{

    public interface IReviewService
    {
        Task<ReviewDto?> GetReviewDtoByUser(int idUser, int idBook);
        Task<ReviewDto?> CreateReviewDto(CreateReviewDto reviewDto, int idUser, int idBook);
        Task<bool> DeleteReviewDto(int id);

    }
    public class ReviewService : IReviewService
    {
        private readonly IReviewRepository _reviewRepository;

        public ReviewService(IReviewRepository reviewRepository)
        {
            _reviewRepository = reviewRepository;
        }

        public async Task<ReviewDto?> GetReviewDtoByUser(int idUser, int idBook)
        {
            var review = await _reviewRepository.GetReview(idUser , idBook);
            if (review == null)
            {
                return null;
            }
            var reviewDto = new ReviewDto { Id = review.IdReview, Review = review.Review };
            return reviewDto;
        }
        
        public async Task<ReviewDto?> CreateReviewDto(CreateReviewDto reviewDto, int idUser, int idBook)
        {
            var review = await _reviewRepository.GetReview(idUser , idBook);
            
            if (review != null)
            {
                review.Review = reviewDto.Review;
                await _reviewRepository.SaveChanges();
            }
            else {
                review = new ReviewBook { Review = reviewDto.Review, IdUser = idUser, IdBook = idBook };
                await _reviewRepository.CreateReview(review);
            }
            
            
            review = await _reviewRepository.GetReviewById(review.IdReview);
            if (review == null)
            {
                return null;
            }
            var answer = new ReviewDto
            {
                Id = review.IdReview,
                Review = review.Review,
            };
            return answer;
        }
       
        public async Task<bool> DeleteReviewDto(int id)
        {
            var review = await _reviewRepository.GetReviewById(id);
            if (review == null)
            {
                return false;
            }
            await _reviewRepository.RemoveReview(review);
            return true;
        }
    }
}
