using Microsoft.EntityFrameworkCore;
using ORM;

namespace Books.Repository
{
    public interface IReviewRepository
    {
        Task<IEnumerable<ReviewBook>> GetAllReview();
        Task<ReviewBook?> GetReview(int idUser, int idBook);
        Task<ReviewBook?> GetReviewById(int idReview);
        Task CreateReview(ReviewBook review);
        Task SaveChanges();
        Task RemoveReview(ReviewBook review);

    }

    public class ReviewRepository : IReviewRepository
    {
        private readonly ApplicationDbContext _context;
        public ReviewRepository(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<IEnumerable<ReviewBook>> GetAllReview()
        {
            var commentBook = await _context.Reviews.Include(c => c.User).Include(c => c.Book).ToListAsync();
            return commentBook;
        }
        public async Task<ReviewBook?> GetReview(int idUser, int idBook)
        {
            var commentBook = await _context.Reviews.Include(c => c.User).Include(c=> c.Book).FirstOrDefaultAsync(c=> c.IdUser == idUser && c.IdBook == idBook);
            if (commentBook == null) { 
                return null;
            }
            return commentBook;
        }
        public async Task<ReviewBook?> GetReviewById(int idReview)
        {
            var commentBook = await _context.Reviews.Include(c => c.User).Include(c => c.Book).FirstOrDefaultAsync(c => c.IdReview == idReview);
            if (commentBook == null)
            {
                return null;
            }
            return commentBook;
        }
        public async Task CreateReview(ReviewBook review)
        {
            _context.Reviews.Add(review);
            await _context.SaveChangesAsync();
        }
        public async Task SaveChanges()
        {
            await _context.SaveChangesAsync();
        }
        public async Task RemoveReview(ReviewBook review)
        {
            _context.Reviews.Remove(review);
            await _context.SaveChangesAsync();
        }
    }
}
