using Microsoft.EntityFrameworkCore;
using ORM;

namespace Books.Repository
{
    public interface ITagRepository
    {
        Task<List<Tag>> GetAllTag();
        Task CreateTag(Tag tag);
        Task<Tag?> GetTagById(int id);
        Task SaveChanges();
        Task RemoveTag(Tag tag);

    }

    public class TagRepository : ITagRepository
    {
        private readonly ApplicationDbContext _context;
        public TagRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<Tag>> GetAllTag()
        {
            var tags = await _context.Tags.ToListAsync();
            return tags;
        }

        public async Task CreateTag(Tag tag)
        {
            _context.Tags.Add(tag);
            await _context.SaveChangesAsync();
        }
        public async Task<Tag?> GetTagById(int id)
        {
            var tag = await _context.Tags.FirstOrDefaultAsync(c => c.IdTag == id);
            if (tag == null)
            {
                return null;
            }
            return tag;
        }
        public async Task SaveChanges()
        {
            await _context.SaveChangesAsync();
        }

        public async Task RemoveTag(Tag tag)
        {
            _context.Tags.Remove(tag);
            await _context.SaveChangesAsync();
        }
    }
}
