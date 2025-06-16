using Microsoft.EntityFrameworkCore;
using ORM;

namespace Books.Repository
{
    public interface ICommentRepository
    {
        Task<IEnumerable<CommentBook>> GetAllCommentsByUser(int id);
        Task CreateComment(CommentBook comment);
        Task<IEnumerable<CommentBook>> GetCommentsByIdBook(int id);
        Task SaveChanges();
        Task<CommentBook?> GetCommentById(int id);
        Task RemoveComment(CommentBook comment);

    }

    public class CommentRepository : ICommentRepository
    {
        private readonly ApplicationDbContext _context;
        public CommentRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<CommentBook>> GetAllCommentsByUser(int id)
        {
            var commentBook = await _context.CommentBooks.Where(c=> c.Iduser == id).Include(c=> c.User).ToListAsync();
            return commentBook;
        }

        public async Task CreateComment(CommentBook comment)
        {
            _context.CommentBooks.Add(comment);
            await _context.SaveChangesAsync();
        }
        public async Task<IEnumerable<CommentBook>> GetCommentsByIdBook(int id)
        {
            var commentBook = await _context.CommentBooks.Where(c=> c.IdBook == id).Include(c=> c.User).ToListAsync();
            return commentBook;
        }
        public async Task<CommentBook?> GetCommentById(int id)
        {
            var commentBook = await _context.CommentBooks.Include(c => c.User).FirstOrDefaultAsync(c=> c.IdComment == id);
            if (commentBook == null) {
                return null;
            }
            return commentBook;
        }

        public async Task SaveChanges()
        {
            await _context.SaveChangesAsync();
        }

        public async Task RemoveComment(CommentBook comment)
        {
            _context.CommentBooks.Remove(comment);
            await _context.SaveChangesAsync();
        }
    }
}
