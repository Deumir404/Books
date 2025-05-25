using Books.DTO;
using ORM;
using Books.Repository;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Books.Services
{
   
    public interface IUserBookService
    {
        Task<List<BookMarkDto>> GetBookMarkById(int id);
        Task<BookMarkDto> AddBookMark(CreateBookMarkDto bookMarkDto, int userId);
        Task<BookMarkDto?> GetBookMark(int id);
        Task<BookMarkDto?> ChangeBookById(CreateBookMarkDto bookMarkDto, int id);
        Task<bool> RemoveBookMarkById(int id);

    }
    public class UserBookService : IUserBookService
    {
        private readonly IUserBookRepository _userBookRepository;

        public UserBookService(IUserBookRepository userRepository)
        {

            _userBookRepository = userRepository;
        }

        public async Task<List<BookMarkDto>> GetBookMarkById(int id)
        {
            List<UserBook> bookmarks = await _userBookRepository.GetAllBookMarkByUsersId(id);
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
            return answer;
        }
        public async Task<BookMarkDto> AddBookMark(CreateBookMarkDto bookMarkDto, int userId)
        {

            var userbook = new UserBook { IdBook = bookMarkDto.IdBook, IdChapter = bookMarkDto.IdChapter, IdUser = userId, Status = bookMarkDto.Category };
            await _userBookRepository.AddBookMark(userbook);
            var answer = await GetBookMark(userbook.IdUserBook); 
            return answer;

        }
        public async Task<BookMarkDto?> GetBookMark(int id)
        {
            var bookmark = await _userBookRepository.GetUserBook(id);
            if (bookmark == null)
            {
                return null;
            }
            var bookmarkDto = new BookMarkDto
            {
                IdUserBook = bookmark.IdUserBook,
                Book = new BookDto { Id = bookmark.IdBook, Title = bookmark.Book.Title, PublishedDate = bookmark.Book.PublishedDate },
                Chapter = new ChapterDto { Id = bookmark.IdChapter, Num = bookmark.Chapter.Num, Title = bookmark.Chapter.Title, PublishedDate = bookmark.Chapter.PublishedDate },
                Category = bookmark.Status
            };
            return bookmarkDto;

        }

        public async Task<BookMarkDto?> ChangeBookById(CreateBookMarkDto bookMarkDto, int id)
        {
            var bookmark = await _userBookRepository.GetUserBook(id);
            if (bookmark == null)
            {
                return null;
            }
            bookmark.IdUser = bookMarkDto.IdBook;
            bookmark.IdChapter = bookMarkDto.IdChapter;
            bookmark.Status = bookMarkDto.Category;
            await _userBookRepository.SaveChanges();
            return await GetBookMark(bookmark.IdBook);
        }

        public async Task<bool> RemoveBookMarkById(int id)
        {
            var bookMark = await _userBookRepository.GetUserBook(id) ;
            if (bookMark == null)
            {
                return false;
            }
            await _userBookRepository.RemoveBookMark(bookMark);
            return true;
        }


    }
}
