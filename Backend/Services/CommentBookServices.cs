using Books.DTO;
using ORM;
using Books.Repository;

namespace Books.Services
{

    public interface ICommentBookService
    {
        Task<List<CommentDto>> GetCommentDtoByUser(int id);
        Task<List<CommentDto>> GetCommentDtoByBook(int id);
        Task<CommentDto> CreateCommentDto(CreateCommentDto commentdto);
        Task<CommentDto?> ChangeCommentDto(CreateCommentDto commentDto, int id);
        Task<bool> DeleteCommentDto(int id);

    }
    public class CommentBookService : ICommentBookService
    {
        private readonly ICommentRepository _commentRepository;

        public CommentBookService(ICommentRepository commentRepository)
        {
            _commentRepository = commentRepository;
        }

        public async Task<List<CommentDto>> GetCommentDtoByUser(int id)
        {
            var comments = await _commentRepository.GetAllCommentsByUser(id);
            var list = new List<CommentDto>();
            foreach (var comment in comments)
            {
                var commentDto = new CommentDto
                {
                    Id = comment.IdComment,
                    Text = comment.Text,
                    CreatedDate = comment.PublishedDate,
                    BookId = comment.IdBook,
                    User = new SimpleUserDto { Id = comment.User.IdUser, Username = comment.User.Username},
                };
                list.Add(commentDto);
            }
            return list;
        }

        public async Task<List<CommentDto>> GetCommentDtoByBook(int id)
        {
            var comments = await _commentRepository.GetCommentsByIdBook(id);
            var list = new List<CommentDto>();
            foreach (var comment in comments)
            {
                var commentDto = new CommentDto
                {
                    Id = comment.IdComment,
                    Text = comment.Text,
                    CreatedDate = comment.PublishedDate,
                    BookId = comment.IdBook,
                    User = new SimpleUserDto { Id = comment.User.IdUser, Username = comment.User.Username },
                };
                list.Add(commentDto);
            }
            return list;
        }

        public async Task<CommentDto> CreateCommentDto(CreateCommentDto commentdto)
        {
            var comment = new CommentBook { Text = commentdto.Text, Iduser = commentdto.UserId, IdBook = commentdto.BookId };
            await _commentRepository.CreateComment(comment);
            comment = await _commentRepository.GetCommentById(comment.IdComment);
            var answer = new CommentDto
            {
                Id = comment.IdComment,
                Text = comment.Text,
                CreatedDate = comment.PublishedDate,
                BookId = comment.IdBook,
                User = new SimpleUserDto { Id = comment.User.IdUser, Username = comment.User.Username },
            };
            return answer;
        }

        public async Task<CommentDto?> ChangeCommentDto(CreateCommentDto commentDto, int id)
        {
            var comment = await _commentRepository.GetCommentById(id);
            if (comment == null)
            {
                return null;
            }
            comment.Text = commentDto.Text;
            comment.IdBook = commentDto.BookId;
            comment.Iduser = commentDto.UserId;
            await _commentRepository.SaveChanges();
            var answer = new CommentDto
            {
                Id = comment.IdComment,
                Text = comment.Text,
                CreatedDate = comment.PublishedDate,
                BookId = comment.IdBook,
                User = new SimpleUserDto { Id = comment.User.IdUser, Username = comment.User.Username },
            };

            return answer;
        }

        public async Task<bool> DeleteCommentDto(int id)
        {
            var chapter = await _commentRepository.GetCommentById(id);
            if (chapter == null)
            {
                return false;
            }
            await _commentRepository.RemoveComment(chapter);
            return true;
        }
    }
}
