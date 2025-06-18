using Books.DTO;
using ORM;
using Books.Repository;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;

namespace Books.Services
{

    public interface IBookService
    {
        Task<List<BookWithAuthorDto>> GetBookByParametr(string? title, List<int> category, List<int> tags);
        Task<List<BookWithAuthorDto>> GetBooksDto();
        Task<FullBook?> GetBookDto(int id);
        Task<ActionResult<FullBook>> CreateBookDto(CreateBookDTO bookdto);
        Task<FullBook?> ChangeBookDto(CreateBookDTO bookdto, int id);
        Task<bool> DeleteBookDto(int id);
        Task UploadCoverById(int id, IFormFile file);

        Task UploadFileById(int id, IFormFile file);

        Task RecalculateRating();
    }
    public class BookService : IBookService
    {
        private readonly IBookRepository _bookRepository;
        private readonly IReviewRepository _reviewRepository;
        private readonly static string[] FileFormats = [".fb2", ".epub", ".mobi"];

        private static string GetCoverUrl(Book book)
        {
            var coverPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images", "cover", $"{book.IdBook}.jpg");
            bool exists = System.IO.File.Exists(coverPath);

            string coverUrl = exists
                ? $"/images/cover/{book.IdBook}.jpg"
                : "/images/cover/empty.jpg";
            return coverUrl;
        }

        private static Dictionary<string, string> GetLinksUrl(Book book)
        {
            var links = new Dictionary<string, string>();
            foreach (var format in FileFormats)
            {
                var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "books", $"{book.IdBook}", $"{book.IdBook}{format}");
                if (System.IO.File.Exists(filePath))
                {
                    links[format] = $"/books/{book.IdBook}/{book.IdBook}{format}"; // Ссылка на файл
                }
            }
            return links;
        }

        public BookService(IBookRepository bookRepository, IReviewRepository reviewRepository)
        {
            _bookRepository = bookRepository;
            _reviewRepository = reviewRepository;
        }

        public async Task<List<BookWithAuthorDto>> GetBooksDto()
        {
            List<Book> books = await _bookRepository.GetAllBook();
            var answer = new List<BookWithAuthorDto>();

            foreach (var book in books)
            {
                string coverUrl = GetCoverUrl(book);
                var bookDto = new BookWithAuthorDto
                {
                    Id = book.IdBook,
                    Title = book.Title,
                    Rating = book.Rating,
                    PublishedDate = book.PublishedDate,
                    CoverURL = coverUrl,
                    Author = new AuthorDto
                    {
                        Id = book.Author.IdAuthor,
                        Nickname = book.Author.Nickname,
                        Surname = book.Author.Surname,
                        Firstname = book.Author.Firstname,
                        IdUser = book.Author.IdUser,
                    }

                };
                answer.Add(bookDto);
            }

            return answer;
        }

        public async Task RecalculateRating()
        {
            var books = await _bookRepository.GetAllBook();
            foreach (var book in books)
            {
                var newRating = await _reviewRepository.CalculateRatingByIdBook(book.IdBook);
                book.Rating = newRating;
            }
            await _bookRepository.SaveChanges();
        }

        public async Task<FullBook?> GetBookDto(int id)
        {
            Book? book = await _bookRepository.GetBookById(id);
            if (book == null)
            {
                return null;
            }
            string coverUrl = GetCoverUrl(book);
            Dictionary<string,string> dict = GetLinksUrl(book);
            var chapters = await _bookRepository.GetChaptersByBookId(id);
            var bookDto = new FullBook
            {
                Id = book.IdBook,
                Title = book.Title,
                Description = book.Description,
                Categories = book.Categories.Select(c => new CategoryDto { Id = c.IdCategory, Name = c.Name }).ToList(),
                Tags = book.Tags.Select(c => new TagDto { Id = c.IdTag, Name = c.Name }).ToList(),
                Rating = book.Rating,
                CoverURL = coverUrl,
                PublishedDate = book.PublishedDate,
                Chapters = chapters.Select(c => new ChapterDto { Id = c.IdChapter, Num = c.Num, Title = c.Title, PublishedDate = c.PublishedDate }).ToList(),
                Author = new AuthorDto
                {
                    Id = book.Author.IdAuthor,
                    Nickname = book.Author.Nickname,
                    Surname = book.Author.Surname,
                    Firstname = book.Author.Firstname,
                    IdUser = book.Author.IdUser,
                },
                Links = dict

            };
            return bookDto;
        }

        public async Task<List<BookWithAuthorDto>> GetBookByParametr(string? title, List<int> category, List<int> tags)
        {
            List<Book> bookList = await _bookRepository.GetListByTitle(title);

            if (category.Any())
            {
                bookList = bookList
                    .Where(book => category.All(cat => book.Categories.Select(c => c.IdCategory).Contains(cat)))
                    .ToList();
            }

            if (tags.Any())
            {
                bookList = bookList
                    .Where(book => tags.All(tag => book.Tags.Select(t => t.IdTag).Contains(tag)))
                    .ToList();
            }
            var answer = new List<BookWithAuthorDto>();
            foreach (var book in bookList)
            {
                string coverUrl = GetCoverUrl(book);
                var bookDto = new BookWithAuthorDto
                {
                    Id = book.IdBook,
                    Title = book.Title,
                    Rating = book.Rating,
                    PublishedDate = book.PublishedDate,
                    CoverURL = coverUrl,
                    Author = new AuthorDto
                    {
                        Id = book.Author.IdAuthor,
                        Nickname = book.Author.Nickname,
                        Surname = book.Author.Surname,
                        Firstname = book.Author.Firstname,
                        IdUser = book.Author.IdUser,
                    }
                };
                answer.Add(bookDto);
            }

            return answer;
        }

        public async Task<ActionResult<FullBook>> CreateBookDto(CreateBookDTO bookdto)
        {
            (List<Category> categories, List<Tag> tags) = await _bookRepository.GetCategoriesAndTags(bookdto);
            var book = new Book { Title = bookdto.Title, Description = bookdto.Description, IdAuthor = bookdto.Author, Categories = categories, Tags = tags };
            await _bookRepository.AddBook(book);
            var answer = await GetBookDto(book.IdBook);
            return answer;
        }

        public async Task<FullBook?> ChangeBookDto(CreateBookDTO bookdto, int id)
        {
            (List<Category> categories, List<Tag> tags) = await _bookRepository.GetCategoriesAndTags(bookdto);
            var book = await _bookRepository.GetBookById(id);
            if (book == null)
            {
                return null;
            }
            book.Title = bookdto.Title;
            book.Description = bookdto.Description;
            book.IdAuthor = bookdto.Author;
            book.Categories = categories;
            book.Tags = tags;
            await _bookRepository.SaveChanges();
            return await GetBookDto(book.IdBook);
        }

        public async Task<bool> DeleteBookDto(int id)
        {
            var book = await _bookRepository.GetBookById(id);
            if (book == null)
            {
                return false;
            }
            await _bookRepository.DeleteBook(book);
            return true;
        }

        public async Task UploadCoverById(int id, IFormFile file)
        {
            var allowedExtensions = new[] { ".jpg", ".jpeg", ".png" };
            var fileExtension = Path.GetExtension(file.FileName).ToLowerInvariant();
            if (!allowedExtensions.Contains(fileExtension))
            {
                throw new InvalidOperationException("Недопустимый формат файла. Допустимые форматы: .jpg, .jpeg, .png");
            }

            var filePath = Path.Combine("wwwroot/images/cover", $"{id}.jpg");

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }
        }

        public async Task UploadFileById(int id, IFormFile file)
        {
           
            var fileExtension = Path.GetExtension(file.FileName).ToLowerInvariant();
            if (!FileFormats.Contains(fileExtension))
            {
                throw new InvalidOperationException("Недопустимый формат файла. Допустимые форматы: .fb2, .epub, .mobi");
            }
            var directoryPath = Path.Combine("wwwroot/books", id.ToString());
            var filePath = Path.Combine(directoryPath, $"{id}{fileExtension}");
            if (!Directory.Exists(directoryPath))
            {
                Directory.CreateDirectory(directoryPath);
            }

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }
        }
    }

    public class RatingRecalculationService : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;

        public RatingRecalculationService(IServiceProvider serviceProvider)
        {
            _serviceProvider = serviceProvider;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                using (var scope = _serviceProvider.CreateScope())
                {
                    var bookService = scope.ServiceProvider.GetRequiredService<IBookService>();
                    await bookService.RecalculateRating();
                }

                await Task.Delay(TimeSpan.FromHours(1), stoppingToken); // каждый час
            }
        }
    }

}
