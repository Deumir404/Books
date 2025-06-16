using Books.DTO;
using ORM;
using Books.Repository;

namespace Books.Services
{

    public interface IComplaintService
    {
        Task<List<ComplaintDto>> GetComplaintDto();
        Task<List<ComplaintDto>> GetComplaintDtoByUser(int id);
        Task<ComplaintDto> CreateComplaintDto(CreateComplaintDto commentdto);
        Task<ComplaintDto?> ChangeComplaintDto(CreateComplaintDto commentDto, int id);
        Task<bool> DeleteComplaintDto(int id);

    }
    public class ComplaintService : IComplaintService
    {
        private readonly IComplaintRepository _complaintRepository;

        public ComplaintService(IComplaintRepository commentRepository)
        {
            _complaintRepository = commentRepository;
        }

        public async Task<List<ComplaintDto>> GetComplaintDto()
        {
            var complaints = await _complaintRepository.GetCompaint();
            var list = new List<ComplaintDto>();
            foreach (var complaint in complaints)
            {
                var commentDto = new ComplaintDto
                {
                    Id = complaint.IdComplaint,
                    Text = complaint.Text,
                    PublishedDate = complaint.PublishedDate,
                    Comment = new CommentDto { Id = complaint.Idcomment, Text = complaint.comment.Text, BookId = complaint.comment.IdBook, User = new SimpleUserDto { Id = complaint.comment.User.IdUser, Username = complaint.comment.User.Username}, CreatedDate = complaint.comment.PublishedDate},
                    User = new SimpleUserDto { Id = complaint.User.IdUser, Username = complaint.User.Username },
                    Status = complaint.ComplaintStatus
                };
                list.Add(commentDto);
            }
            return list;
        }

        public async Task<List<ComplaintDto>> GetComplaintDtoByUser(int id)
        {
            var complaints = await _complaintRepository.GetCompaintByUser(id);
            var list = new List<ComplaintDto>();
            foreach (var complaint in complaints)
            {
                var commentDto = new ComplaintDto
                {
                    Id = complaint.IdComplaint,
                    Text = complaint.Text,
                    PublishedDate = complaint.PublishedDate,
                    Comment = new CommentDto { Id = complaint.Idcomment, Text = complaint.comment.Text, BookId = complaint.comment.IdBook, User = new SimpleUserDto { Id = complaint.comment.User.IdUser, Username = complaint.comment.User.Username }, CreatedDate = complaint.comment.PublishedDate },
                    User = new SimpleUserDto { Id = complaint.User.IdUser, Username = complaint.User.Username },
                    Status = complaint.ComplaintStatus,
                };
                list.Add(commentDto);
            }
            return list;
        }

        public async Task<ComplaintDto> CreateComplaintDto(CreateComplaintDto commentdto)
        {
            var complaint = new CommentComplaint { Text = commentdto.Text, IdUser = commentdto.IdUser, Idcomment = commentdto.IdComment, ComplaintStatus = ComplaintStatus.New };
            await _complaintRepository.CreateComplaint(complaint);
            complaint = await _complaintRepository.GetComplaintById(complaint.IdComplaint);
            var answer = new ComplaintDto
            {
                Id = complaint.IdComplaint,
                Text = complaint.Text,
                PublishedDate = complaint.PublishedDate,
                Comment = new CommentDto { Id = complaint.Idcomment, Text = complaint.comment.Text, BookId = complaint.comment.IdBook, User = new SimpleUserDto { Id = complaint.comment.User.IdUser, Username = complaint.comment.User.Username }, CreatedDate = complaint.comment.PublishedDate },
                User = new SimpleUserDto { Id = complaint.User.IdUser, Username = complaint.User.Username },
            };
            return answer;
        }

        public async Task<ComplaintDto?> ChangeComplaintDto(CreateComplaintDto commentDto, int id)
        {
            var complaint = await _complaintRepository.GetComplaintById(id);
            if (complaint == null)
            {
                return null;
            }
            Console.WriteLine($"Current Status: {complaint.ComplaintStatus}");
            Console.WriteLine($"New Status: {commentDto.Status}");
            complaint.Text = commentDto.Text;
            complaint.Idcomment = commentDto.IdComment;
            complaint.IdUser = commentDto.IdUser;
            complaint.ComplaintStatus = commentDto.Status;
            await _complaintRepository.SaveChanges();
            var answer = new ComplaintDto
            {
                Id = complaint.IdComplaint,
                Text = complaint.Text,
                PublishedDate = complaint.PublishedDate,
                Comment = new CommentDto { Id = complaint.Idcomment, Text = complaint.comment.Text, BookId = complaint.comment.IdBook, User = new SimpleUserDto { Id = complaint.comment.User.IdUser, Username = complaint.comment.User.Username }, CreatedDate = complaint.comment.PublishedDate },
                User = new SimpleUserDto { Id = complaint.User.IdUser, Username = complaint.User.Username },
                Status = complaint.ComplaintStatus
            };

            return answer;
        }

        public async Task<bool> DeleteComplaintDto(int id)
        {
            var complaint = await _complaintRepository.GetComplaintById(id);
            if (complaint == null)
            {
                return false;
            }
            await _complaintRepository.RemoveComment(complaint);
            return true;
        }
    }
}
