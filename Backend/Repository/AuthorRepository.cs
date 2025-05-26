using Microsoft.EntityFrameworkCore;
using ORM;

namespace Books.Repository
{
    public interface IAuthorRepository
    {
        Task<List<Author>> GetAuthorsAll();
        Task CreateAuthor(Author author);
        Task<Author?> GetAuthorById(int id);
        Task SaveChanges();
        Task DeleteAuthor(Author Author);

    }

    public class AuthorRepository : IAuthorRepository
    {
        private readonly ApplicationDbContext _context;
        public AuthorRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<Author>> GetAuthorsAll()
        {
            return await _context.Authors.ToListAsync();
        }

        public async Task CreateAuthor(Author author)
        {
            _context.Authors.Add(author);
            await _context.SaveChangesAsync();
        }
        public async Task<Author?> GetAuthorById(int id)
        {
            return await _context.Authors.Include(a => a.Books).FirstOrDefaultAsync(a => a.IdAuthor == id);
        }
        public async Task SaveChanges()
        {
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAuthor(Author Author)
        {
            _context.Authors.Remove(Author);
            await _context.SaveChangesAsync();
        }
    }
}
