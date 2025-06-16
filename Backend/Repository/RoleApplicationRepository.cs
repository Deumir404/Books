using Microsoft.EntityFrameworkCore;
using ORM;

namespace Books.Repository
{
    public interface IRoleAppRepository
    {
        Task<IEnumerable<RoleApplication>> GetRoleApplication();
        Task<IEnumerable<RoleApplication>> GetRoleApplicationByUser(int id);
        Task CreateRoleApplication(RoleApplication roleApplication);
        Task<RoleApplication?> GetRoleApplicationById(int id);
        Task SaveChanges();
        Task RemoveRoleApplication(RoleApplication roleApplication);

    }

    public class RoleAppRepository : IRoleAppRepository
    {
        private readonly ApplicationDbContext _context;
        public RoleAppRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<RoleApplication>> GetRoleApplication()
        {
            var roleApplication = await _context.RoleApplications.Include(c => c.User).ToListAsync();
            return roleApplication;
        }
        public async Task<IEnumerable<RoleApplication>> GetRoleApplicationByUser(int id)
        {
            var commentComplaint = await _context.RoleApplications.Include(c => c.User).Where(c => c.IdUser == id).ToListAsync();
            return commentComplaint;
        }

        public async Task CreateRoleApplication(RoleApplication roleApplication)
        {
            _context.RoleApplications.Add(roleApplication);
            await _context.SaveChangesAsync();
        }
        public async Task<RoleApplication?> GetRoleApplicationById(int id)
        {
            var roleApplication = await _context.RoleApplications.Include(c => c.User).FirstOrDefaultAsync(c => c.IdRoleApplication == id);
            if (roleApplication == null)
            {
                return null;
            }
            return roleApplication;
        }

        public async Task SaveChanges()
        {
            await _context.SaveChangesAsync();
        }

        public async Task RemoveRoleApplication(RoleApplication roleApplication)
        {
            _context.RoleApplications.Remove(roleApplication);
            await _context.SaveChangesAsync();
        }
    }
}
