using Books.DTO;
using Microsoft.EntityFrameworkCore;
using ORM;

namespace Books.Repository
{
    public interface IUserRepository
    {
        Task<List<User>> GetAllUsers();
        Task<User?> GetUserById(int id);
        Task<User?> AddUser(User user);
        Task<User?> GetUserByEmail(LoginUserDto userDto);
        Task SaveChanges();
        Task DeleteUser(User user);
    }
    public class DuplicateEmailException : Exception
    {
        // Конструктор по умолчанию
        public DuplicateEmailException()
        {
        }

        // Конструктор, принимающий сообщение
        public DuplicateEmailException(string message)
            : base(message)
        {
        }
    }

        public class UserRepository : IUserRepository
    {
        private readonly ApplicationDbContext _context;
        public UserRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<User>> GetAllUsers()
        {
            return await _context.Users.ToListAsync();
        }
        public async Task<User?> GetUserById(int id)
        {
            return await _context.Users.FirstOrDefaultAsync(b => b.IdUser == id);
        }
        public async Task<User?> AddUser(User user)
        {
            try
            {

                _context.Users.Add(user);
                await _context.SaveChangesAsync();
                return user;
            }
            catch (DbUpdateException ex)
            {
                throw new DuplicateEmailException("Пользователь с таким email уже существует.");
            }
        }
        public async Task<User?> GetUserByEmail(LoginUserDto userDto)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Email == userDto.Email);
        }
        public async Task SaveChanges()
        {
            await _context.SaveChangesAsync();
        }

        public async Task DeleteUser(User user)
        {
            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
        }

    }
}
