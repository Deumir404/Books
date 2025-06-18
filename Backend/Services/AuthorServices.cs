using Books.DTO;
using ORM;
using Books.Repository;

namespace Books.Services
{

    public interface IAuthorService
    {
        Task<List<AuthorDto>> GetAuthorsDto();
        Task<AuthorWithBooksDto?> GetAuthorDto(int id);
        Task<AuthorWithBooksDto> CreateAuthorDto(CreateAuthorDto authorDto);
        Task<AuthorWithBooksDto> ChangeAuthorDto(CreateAuthorDto authorDto, int id);

        Task<AuthorDto?> GetAuthorByIdUserDto(int id);
        Task<bool> DeleteAuthorDto(int id);

    }
    public class AuthorService : IAuthorService
    {
        private readonly IAuthorRepository _authorRepository;

        public AuthorService(IAuthorRepository authorRepository)
        {
            _authorRepository = authorRepository;
        }

        public async Task<List<AuthorDto>> GetAuthorsDto()
        {
            List<Author> authors = await _authorRepository.GetAuthorsAll();
            var answer = new List<AuthorDto>();
            foreach (var author in authors)
            {
                var authorDto = new AuthorDto
                {
                    Id = author.IdAuthor,
                    Firstname = author.Firstname,
                    Surname = author.Surname,
                    Nickname = author.Nickname,
                    IdUser = author.IdUser,
                };
                answer.Add(authorDto);
            }

            return answer;
        }

        public async Task<AuthorWithBooksDto?> GetAuthorDto(int id)
        {
            Author? author = await _authorRepository.GetAuthorById(id);
            if (author == null)
            {
                return null;
            }
            var answer = new AuthorWithBooksDto
            {
                Id = author.IdAuthor,
                Firstname = author.Firstname,
                Surname = author.Surname,
                Nickname = author.Nickname,
                Books = author.Books.Select(b => new BookDto { Id = b.IdBook, Title = b.Title, PublishedDate = b.PublishedDate }).ToList(),
                IdUser = author.IdUser,
            };
            return answer;
        }

        public async Task<AuthorDto?> GetAuthorByIdUserDto(int id)
        {
            Author? author = await _authorRepository.GetAuthorByIdUser(id);
            if (author == null)
            {
                return null;
            }
            var answer = new AuthorDto
            {
                Id = author.IdAuthor,
                Firstname = author.Firstname,
                Surname = author.Surname,
                Nickname = author.Nickname,
                IdUser = author.IdUser,
            };
            return answer;
        }

        public async Task<AuthorWithBooksDto> CreateAuthorDto(CreateAuthorDto authorDto)
        {
            var author = new Author { Surname = authorDto.Surname, Firstname = authorDto.Firstname, Nickname = authorDto.Nickname, IdUser = authorDto.IdUser };
            await _authorRepository.CreateAuthor(author);
            return await GetAuthorDto(author.IdAuthor);
        }

        public async Task<AuthorWithBooksDto> ChangeAuthorDto(CreateAuthorDto authorDto, int id)
        {
            var author = await _authorRepository.GetAuthorById(id);
            if (author == null)
            {
                return null;
            }
            author.Surname = authorDto.Surname;
            author.Firstname = authorDto.Firstname;
            author.Nickname = authorDto.Nickname;
            author.IdUser = authorDto.IdUser;
            await _authorRepository.SaveChanges();
            return await GetAuthorDto(author.IdAuthor);
        }

        public async Task<bool> DeleteAuthorDto(int id)
        {
            var Author = await _authorRepository.GetAuthorById(id);
            if (Author == null)
            {
                return false;
            }
            await _authorRepository.DeleteAuthor(Author);
            return true;
        }


    }
}
