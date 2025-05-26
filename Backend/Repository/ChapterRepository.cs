using Microsoft.EntityFrameworkCore;
using ORM;

namespace Books.Repository
{
    public interface IChapterRepository
    {
        Task<Chapter?> GetChapterById(int id);
        Task CreateChapter(Chapter chapter, string text);
        Task SaveChanges();
        Task DeleteChapter(Chapter chapter);
        Task<TextChapter?> GetTextById(int id);

    }

    public class ChapterRepository : IChapterRepository
    {
        private readonly ApplicationDbContext _context;
        public ChapterRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Chapter?> GetChapterById(int id)
        {
            return await _context.Chapters.Include(c => c.TextChapter).FirstOrDefaultAsync(c => c.IdChapter == id);
        }

        public async Task<TextChapter?> GetTextById(int id)
        {
            return await _context.TextChapters.FirstOrDefaultAsync(c => c.IdChapter == id);
        }

        public async Task CreateChapter(Chapter chapter, string text)
        {
            _context.Chapters.Add(chapter);
            await _context.SaveChangesAsync();
            var textchapter = new TextChapter { IdChapter = chapter.IdChapter, Text = text };
            _context.TextChapters.Add(textchapter);
            await _context.SaveChangesAsync();
        }

        public async Task SaveChanges()
        {
            await _context.SaveChangesAsync();
        }

        public async Task DeleteChapter(Chapter chapter)
        {
            var text = _context.TextChapters.FirstOrDefault(c => c.Chapter == chapter);
            _context.Chapters.Remove(chapter);
            if (text != null)
            {
                _context.TextChapters.Remove(text);
            }
            await _context.SaveChangesAsync();
        }
    }
}
