using Microsoft.EntityFrameworkCore;
using ORM;

namespace Books.Repository
{
    public interface ICategoryRepository
    {
        Task<List<Category>> GetAllCategory();
        Task CreateCategory(Category category);
        Task<Category?> GetCategoryById(int id);
        Task SaveChanges();
        Task RemoveCategory(Category category);

    }

    public class CategoryRepository : ICategoryRepository
    {
        private readonly ApplicationDbContext _context;
        public CategoryRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<Category>> GetAllCategory()
        {
            var category = await _context.Categories.ToListAsync();
            return category;
        }

        public async Task CreateCategory(Category category)
        {
            _context.Categories.Add(category);
            await _context.SaveChangesAsync();
        }
        public async Task<Category?> GetCategoryById(int id)
        {
            var category = await _context.Categories.FirstOrDefaultAsync(c => c.IdCategory == id);
            if (category == null) {
                return null;
            }
            return category;
        }
        public async Task SaveChanges()
        {
            await _context.SaveChangesAsync();
        }

        public async Task RemoveCategory(Category category)
        {
            _context.Categories.Remove(category);
            await _context.SaveChangesAsync();
        }
    }
}
