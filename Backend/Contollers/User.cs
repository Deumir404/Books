using Microsoft.AspNetCore.Mvc;
using Books.DTO;
using System.Security.Claims;
using Books.Services;
using Microsoft.AspNetCore.Authorization;

namespace Books.Contollers
{
    public static class ClaimsPrincipalExtensions
    {
        public static int? GetUserId(this ClaimsPrincipal user)
        {
            var claim = user.FindFirst(ClaimTypes.NameIdentifier) ??  user.FindFirst("id");
            return claim != null ? int.Parse(claim.Value) : null;
        }
    }

    [ApiController]
    [Route("[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IUserBookService _userBookService;
        public UsersController( IUserService userService, IUserBookService userBookService)
        {           
            _userService = userService;
            _userBookService = userBookService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserDto>>> GetUsers()
        {
            List<UserDto> answer = await _userService.GetUserService();
            return Ok(answer);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<UserDto>> GetUser(int id)
        {
            UserDto? userDto = await _userService.GetUserByIdDTO(id);
            if (userDto == null)
            {
                return NotFound();
            }
            return Ok(userDto);
        }

        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> RegisterUser(CreateUserDto userDto)
        {
            if (userDto == null)
            {
                return BadRequest();
            }
            var answer = await _userService.AddUserDTO(userDto);
            return Ok(answer);
        }

        [HttpPost("login")]
        public async Task<ActionResult<string>> Login(LoginUserDto userDto)
        {
            var token = await _userService.Autorization(userDto);
            if (token == null)
            {
                return Unauthorized("Invalid credentials");
            }
            return Ok(token);
        }





        [Authorize]
        [HttpGet("MyBookmark")]
        public async Task<ActionResult<IEnumerable<BookMarkDto>>> GetMyBookmarks()
        {
            var idUser = User.GetUserId();
            if (idUser == null)
            {
                return Unauthorized();
            }
            var idUserInt = idUser.Value;
            var bookmark = await _userBookService.GetBookMark(idUserInt);
            if (bookmark == null)
            {
                return NotFound();
            }
            return Ok(bookmark);
        }

        [Authorize]
        [HttpGet("MyProfile")]
        public async Task<ActionResult<UserDto>> GetMyProfile()
        {
            var idUser = User.GetUserId();
            if (idUser == null)
            {
                return Unauthorized();
            }
            var idUserInt = idUser.Value;
            var profile = await _userService.GetUserByIdDTO(idUserInt);
            return Ok(profile);
        }



        [HttpPut("{id}")]
        public async Task<ActionResult<UserDto>> ChangeUser(ChangeUserDto userDto, int id)
        {
            if (userDto == null)
            {
                return BadRequest();
            }
            var answer = await _userService.ChangeUserDto(userDto, id);
            if (answer == null)
            {
                return NotFound();
            }
            return Ok(answer);

        }

       

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteUser(int id)
        {
            var user = await _userService.DeleteUserById(id);
            if (user == false)
            {
                return NotFound();
            }
            return Ok("User deleted");
        }

    }

    [ApiController]
    [Route("Users/{userId}/[controller]")]
    public class UserBookController : ControllerBase
    {
        private readonly IUserBookService _userBookService;
        public UserBookController(IUserBookService userBookService)
        {
            _userBookService = userBookService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<BookMarkDto>>> GetBookmarks(int userId)
        {
            List<BookMarkDto> answer = await _userBookService.GetBookMarkById(userId);
            return Ok(answer);
        }

        [HttpPost]
        public async Task<ActionResult<BookMarkDto>> CreateBookmark(CreateBookMarkDto bookMarkDto, int userId)
        {
            if (bookMarkDto == null)
            {
                return BadRequest();
            }
            var bookmark = await _userBookService.AddBookMark(bookMarkDto, userId);

            return Ok(bookmark);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<BookMarkDto>> ChangeBook(CreateBookMarkDto bookMarkDto, int id)
        {
            
            if (bookMarkDto == null)
            {
                return BadRequest();
            }
            var answer = await _userBookService.ChangeBookById(bookMarkDto,id);
            if (answer == null)
            {
                return NotFound();
            }
            return Ok(answer);
        }

        

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteBook(int id)
        {
            var answer = await _userBookService.RemoveBookMarkById(id);
            if (!answer)
            {
                return NotFound();
            }
            return Ok("Bookmark deleted");
        }

       
    }
}
