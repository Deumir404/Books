using Microsoft.EntityFrameworkCore;
using ORM;

namespace Books.Repository
{
    public interface IComplaintRepository
    {
        Task<IEnumerable<CommentComplaint>> GetCompaint();
        Task<IEnumerable<CommentComplaint>> GetCompaintByUser(int id);
        Task CreateComplaint(CommentComplaint complaint);
        Task<CommentComplaint?> GetComplaintById(int id);
        Task SaveChanges();
        Task RemoveComment(CommentComplaint complaint);

    }

    public class ComplaintRepository : IComplaintRepository
    {
        private readonly ApplicationDbContext _context;
        public ComplaintRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<CommentComplaint>> GetCompaint()
        {
            var commentComplaint = await _context.Complaint.Include(c=> c.User).Include(c=> c.comment).ToListAsync();
            return commentComplaint;
        }
        public async Task<IEnumerable<CommentComplaint>> GetCompaintByUser(int id)
        {
            var commentComplaint = await _context.Complaint.Include(c => c.User).Include(c => c.comment).Where(c=> c.IdUser == id).ToListAsync();
            return commentComplaint;
        }

        public async Task CreateComplaint(CommentComplaint complaint)
        {
            _context.Complaint.Add(complaint);
            await _context.SaveChangesAsync();
        }
        public async Task<CommentComplaint?> GetComplaintById(int id)
        {
            var commentComplaint = await _context.Complaint.Include(c => c.User).Include(c => c.comment).FirstOrDefaultAsync(c=> c.IdComplaint == id);
            if (commentComplaint == null) {
                return null;
            }
            return commentComplaint;
        }

        public async Task SaveChanges()
        {
            await _context.SaveChangesAsync();
        }

        public async Task RemoveComment(CommentComplaint complaint)
        {
            _context.Complaint.Remove(complaint);
            await _context.SaveChangesAsync();
        }
    }
}
