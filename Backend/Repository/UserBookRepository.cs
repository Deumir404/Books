using Books.DTO;
using Microsoft.EntityFrameworkCore;
using ORM;

namespace Books.Repository
{
    public interface IUserBookRepository
    {
        Task<List<UserBook>> GetAllBookMarkByUsersId(int id);
        Task<UserBook> AddBookMark(UserBook bookmark);
        Task<UserBook?> GetUserBook(int id);
        Task SaveChanges();
        Task RemoveBookMark(UserBook bookMark);

    }

    public class UserBookRepository : IUserBookRepository
    {
        private readonly ApplicationDbContext _context;
        public UserBookRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<UserBook>> GetAllBookMarkByUsersId(int id)
        {
            return await _context.UserBooks.Include(b => b.Book).Include(b => b.Chapter).Where(b => b.IdUser == id).ToListAsync();
        }

        public async Task<UserBook> AddBookMark(UserBook bookmark)
        {
            _context.UserBooks.Add(bookmark);
            await _context.SaveChangesAsync();
            return bookmark;
        }
        public async Task<UserBook?> GetUserBook(int id)
        {
            var answer = await _context.UserBooks.Include(b => b.Book).Include(b => b.Chapter).FirstOrDefaultAsync(bookmark => bookmark.IdUserBook == id);
            if (answer == null)
            {
                return null;
            }
            return answer;
        }
        public async Task SaveChanges()
        {
            await _context.SaveChangesAsync();
        }
        public async Task RemoveBookMark(UserBook bookMark)
        {
            _context.UserBooks.Remove(bookMark);
            await _context.SaveChangesAsync();
        }
    }
}
