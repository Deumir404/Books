using Books.DTO;
using Microsoft.EntityFrameworkCore;
using ORM;
using System.Collections;

namespace Books.Repository
{
    public interface IBookRepository
    {
        Task<List<Book>> GetAllBook();
        Task AddBook(Book book);
        Task<Book?> GetBookById(int id);
        Task SaveChanges();
        Task DeleteBook(Book book);
        Task<List<Book>> GetListByTitle(string? title);
        Task<(List<Category> categories, List<Tag> tags)> GetCategoriesAndTags(CreateBookDTO bookdto);
        Task<IEnumerable<Chapter>> GetChaptersByBookId(int id);


    }

    public class BookRepository : IBookRepository
    {
        private readonly ApplicationDbContext _context;
        public BookRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<Book>> GetAllBook()
        {
            return await _context.Books.Include(b => b.Author).ToListAsync();
        }

        public async Task<Book?> GetBookById(int id)
        {
            return await _context.Books.Include(b => b.Author).Include(b => b.Categories).Include(b => b.Tags).FirstOrDefaultAsync(b => b.IdBook == id);
        }
        public async Task SaveChanges()
        {
            await _context.SaveChangesAsync();
        }
        public async Task DeleteBook(Book book)
        {
            _context.Books.Remove(book);
            await _context.SaveChangesAsync();
        }

        public async Task<List<Book>> GetListByTitle(string? title)
        {
            var books = _context.Books
                .Include(c => c.Author)
                .Include(c => c.Tags)
                .Include(c => c.Categories)
                .AsQueryable();

            if (!string.IsNullOrEmpty(title))
            {
                books = books.Where(b => b.Title.Contains(title));
            }

            var bookList = await books.ToListAsync();
            return bookList;
        }
        public async Task AddBook(Book book)
        {
            _context.Books.Add(book);
            await _context.SaveChangesAsync();
        }

        public async Task<(List<Category> categories, List<Tag> tags)> GetCategoriesAndTags(CreateBookDTO bookdto)
        {
            var categories = await _context.Categories
                            .Where(c => bookdto.Categories.Contains(c.IdCategory))
                            .ToListAsync();
            var tags = await _context.Tags
                .Where(c => bookdto.Tags.Contains(c.IdTag))
                .ToListAsync();
            return (categories, tags);
        }

        public async Task<IEnumerable<Chapter>> GetChaptersByBookId(int id)
        {
            return await _context.Chapters.Where(c => c.IdBook == id).ToListAsync();
        }
    }
}
