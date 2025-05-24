using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Books.DTO;
using ORM;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authentication.BearerToken;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;

namespace Books.Contollers
{
    [ApiController]
    [Route("[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _conf;
        public UsersController(ApplicationDbContext context, IConfiguration configuration)
        {
            _context = context;
            _conf = configuration;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserDto>>> GetUsers()
        {
            var users = await _context.Users.ToListAsync();
            var answer = new List<UserDto>();
            foreach (var user in users)
            {
                var UserDto = new UserDto
                {
                    Id = user.IdUser,
                    Username = user.Username,
                    Email = user.Email,

                };
                answer.Add(UserDto);
            }
            return Ok(answer);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<UserDto>> GetUser(int id)
        {
            var user = await _context.Users.FirstOrDefaultAsync(b => b.IdUser == id);
            if (user == null)
            {
                return NotFound();
            }
            var userDto = new UserDto
            {
                Id = user.IdUser,
                Username = user.Username,
                Email = user.Email
            };
            return Ok(userDto);
        }

        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> RegisterUser(CreateUserDto userDto)
        {
            if (userDto == null)
            {
                return BadRequest();
            }
            var passwordHash = BCrypt.Net.BCrypt.HashPassword(userDto.Password);
            var user = new User { Username = userDto.Username, Email = userDto.Email, PasswordHash = passwordHash };
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            var answer = await GetUser(id: user.IdUser);
            return answer;
        }

        [HttpPost("login")]
        public async Task<ActionResult<string>> Login(LoginUserDto userDto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == userDto.Email);
            if (user == null || !BCrypt.Net.BCrypt.Verify(userDto.Password, user.PasswordHash))
                return Unauthorized("Invalid credentials");

            var token = CreateToken(user);
            return Ok(token);
        }

        private string CreateToken(User user)
        {
            var claims = new[]
            {
            new Claim(ClaimTypes.NameIdentifier, user.IdUser.ToString()),
            new Claim(ClaimTypes.Name, user.Username)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(s: _conf["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.Now.AddHours(24),
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<UserDto>> ChangeUser(CreateUserDto userDto, int id)
        {
            if (userDto == null)
            {
                return BadRequest();
            }
            var user = await _context.Users.FirstOrDefaultAsync(c => c.IdUser == id);
            if (user == null)
            {
                return NotFound();
            }
            user.Username = userDto.Username;
            user.Email = userDto.Email;
            var passwordHash = BCrypt.Net.BCrypt.HashPassword(userDto.Password);
            user.PasswordHash = passwordHash;
            await _context.SaveChangesAsync();
            return await GetUser(id);
        }
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FirstOrDefaultAsync(b => b.IdUser == id);
            if (user == null)
            {
                return NotFound();
            }
            _context.Users.Remove(user);
            _context.SaveChanges();
            return Ok("User deleted");
        }

    }

    [ApiController]
    [Route("Users/{userId}/[controller]")]
    public class UserBookController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public UserBookController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<BookMarkDto>>> GetBookmarks(int userId)
        {
            var bookmarks = await _context.UserBooks.Include(b => b.Book).Include(b => b.Chapter).Where(b => b.IdUser == userId).ToListAsync();
            var answer = new List<BookMarkDto>();
            foreach (var bookmark in bookmarks)
            {
                var bookmarkDto = new BookMarkDto
                {
                    IdUserBook = bookmark.IdUserBook,
                    Book = new BookDto { Id = bookmark.Book.IdBook, Title = bookmark.Book.Title, PublishedDate = bookmark.Book.PublishedDate },
                    Chapter = new ChapterDto { Id = bookmark.Chapter.IdChapter, Num = bookmark.Chapter.Num, Title = bookmark.Chapter.Title, PublishedDate = bookmark.Chapter.PublishedDate },
                    Category = bookmark.Status,
                };
                answer.Add(bookmarkDto);
            }
            return Ok(answer);
        }
        [HttpPost]
        public async Task<ActionResult<BookMarkDto>> CreateBookmark(CreateBookMarkDto bookMarkDto, int userId)
        {
            if (bookMarkDto == null)
            {
                return BadRequest();
            }
            var bookmark = new UserBook { IdBook = bookMarkDto.IdBook, IdChapter = bookMarkDto.IdChapter, IdUser = userId, Status = bookMarkDto.Category};
            _context.UserBooks.Add(bookmark);
            await _context.SaveChangesAsync();
            return await GetBookMark(id: bookmark.IdUserBook); ;
        }

        private async Task<ActionResult<BookMarkDto>> GetBookMark(int id)
        {
            var bookmark = await _context.UserBooks.Include(b=> b.Book).Include(b=>b.Chapter).FirstOrDefaultAsync(bookmark => bookmark.IdUserBook == id);
            if (bookmark == null)
            {
                return NotFound();
            }
            var bookmarkDto = new BookMarkDto { IdUserBook = bookmark.IdUserBook, 
                Book = new BookDto { Id = bookmark.IdBook, Title = bookmark.Book.Title, PublishedDate = bookmark.Book.PublishedDate}, 
                Chapter = new ChapterDto { Id = bookmark.IdChapter, Num = bookmark.Chapter.Num, Title = bookmark.Chapter.Title, PublishedDate = bookmark.Chapter.PublishedDate}, 
                Category = bookmark.Status };
            return Ok(bookmarkDto);

        }

        [HttpPut("{id}")]
        public async Task<ActionResult<BookMarkDto>> ChangeBook(CreateBookMarkDto bookMarkDto, int id)
        {
            if (bookMarkDto == null)
            {
                return BadRequest();
            }
            var bookmark = await _context.UserBooks.Include(b => b.Book).Include(b => b.Chapter).FirstOrDefaultAsync(bookmark => bookmark.IdBook == id);
            if (bookmark == null)
            {
                return NotFound();
            }
            bookmark.IdUser = bookMarkDto.IdBook;
            bookmark.IdChapter = bookMarkDto.IdChapter;
            bookmark.Status = bookMarkDto.Category;
            await _context.SaveChangesAsync();
            return await GetBookMark(id);
        }
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteBook(int id)
        {
            var bookMark = await _context.UserBooks.FirstOrDefaultAsync(b => b.IdUserBook == id);
            if (bookMark == null)
            {
                return NotFound();
            }
            _context.UserBooks.Remove(bookMark);
            _context.SaveChanges();
            return Ok("Bookmark deleted");
        }

    }
}
