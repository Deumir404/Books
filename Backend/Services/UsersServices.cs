using Books.DTO;
using ORM;
using Books.Repository;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Books.Services
{
    public class Token{
        private readonly IConfiguration _conf;
        public Token(IConfiguration configuration)
        {
            _conf = configuration;
        }
        
        public string CreateToken(User user)
        {
            var claims = new[]
            {
            new Claim(ClaimTypes.NameIdentifier, user.IdUser.ToString()),
            new Claim(ClaimTypes.Name, user.Username)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(s: _conf["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _conf["Jwt:Issuer"],            
                audience: _conf["Jwt:Audience"],        
                claims: claims,
                expires: DateTime.Now.AddHours(24),
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
    public interface IUserService
    {
        Task<List<UserDto>> GetUserService();
        Task<UserDto?> GetUserByIdDTO(int id);
        Task<UserDto> AddUserDTO(CreateUserDto userDto);
        Task<string?> Autorization(LoginUserDto userDto);
        Task<UserDto?> ChangeUserDto(CreateUserDto userDto, int id);
        Task<bool> DeleteUserById(int id);
    }
    public class UserService: IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly Token _token;

        public UserService(IUserRepository userRepository, IConfiguration configuration)
        {
            _token = new Token(configuration);
            _userRepository = userRepository;
        }

        public async Task<List<UserDto>> GetUserService()
        {
            List<User> users = await _userRepository.GetAllUsers();
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
            return answer;
        }
        public async Task<UserDto?> GetUserByIdDTO(int id)
        {
            User? user = await _userRepository.GetUserById(id);
            if (user == null)
            {
                return null;
            }
            var userDto = new UserDto
            {
                Id = user.IdUser,
                Username = user.Username,
                Email = user.Email
            };
            return userDto;
        }
        public async Task<UserDto> AddUserDTO(CreateUserDto userDto)
        {
            var passwordHash = BCrypt.Net.BCrypt.HashPassword(userDto.Password);
            var user = new User { Username = userDto.Username, Email = userDto.Email, PasswordHash = passwordHash };
            user = await _userRepository.AddUser(user);
            return await GetUserByIdDTO(user.IdUser);
        }

        public async Task<string?> Autorization(LoginUserDto userDto)
        {
            User? user = await _userRepository.GetUserByEmail(userDto);
            if (user == null || !BCrypt.Net.BCrypt.Verify(userDto.Password, user.PasswordHash))
                return null;
            var token = _token.CreateToken(user);
            return token;
        }

        public async Task<UserDto?> ChangeUserDto(CreateUserDto userDto, int id)
        {
            var user = await _userRepository.GetUserById(id);
            if (user == null)
            {
                return null;
            }
            user.Username = userDto.Username;
            user.Email = userDto.Email;
            var passwordHash = BCrypt.Net.BCrypt.HashPassword(userDto.Password);
            user.PasswordHash = passwordHash;
            await _userRepository.SaveChanges();
            return await GetUserByIdDTO(user.IdUser);
        }

        public async Task<bool> DeleteUserById(int id)
        {
            var user =  await _userRepository.GetUserById(id);
            if (user == null)
            {
                return false;
            }
            await _userRepository.DeleteUser(user);
            return true;
        }


    }
}
