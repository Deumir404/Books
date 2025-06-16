using global::Books.DTO;
using global::Books.Services;
using Microsoft.AspNetCore.Mvc;
namespace Books.Contollers
{
    [Route("[controller]")]
    [ApiController]
    public class ComplaintController : ControllerBase
    {
        private readonly IComplaintService _complaintService;
        public ComplaintController(IComplaintService complaintService)
        {
            _complaintService = complaintService;
        }

        
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ComplaintDto>>> GetComplaints()
        {
            var answer = await _complaintService.GetComplaintDto();
            return Ok(answer);
        }
        [HttpGet("user/{id}")]
        public async Task<ActionResult<IEnumerable<ComplaintDto>>> GetComplaintsByUser(int id)
        {
            var answer = await _complaintService.GetComplaintDtoByUser(id);
            return Ok(answer);
        }
        [HttpPost]
        public async Task<ActionResult<ComplaintDto>> CreateComplaint(CreateComplaintDto complaintDto)
        {
            if (complaintDto == null)
            {
                return BadRequest();
            }
            var complaint = await _complaintService.CreateComplaintDto(complaintDto);
            return Ok(complaint);
        }
        [HttpPut("{id}")]
        public async Task<ActionResult<CommentDto>> ChangeComplaint(CreateComplaintDto complaintDto, int id)
        {
            if (complaintDto == null)
            {
                return BadRequest();
            }
            var complaint = await _complaintService.ChangeComplaintDto(complaintDto, id);
            if (complaint == null)
            {
                return NotFound();
            }
            return Ok(complaint);
        }
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteComplaint(int id)
        {
            var answer = await _complaintService.DeleteComplaintDto(id);
            if (!answer)
            {
                return NotFound();
            }
            return Ok("Complaint deleted");
        }



    }
}
