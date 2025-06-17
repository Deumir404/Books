using global::Books.DTO;
using global::Books.Services;
using Microsoft.AspNetCore.Mvc;
namespace Books.Contollers
{
    [Route("[controller]")]
    [ApiController]
    public class RoleApplicationController : ControllerBase
    {
        private readonly IRoleAppService _roleAppService;
        public RoleApplicationController(IRoleAppService roleAppService)
        {
            _roleAppService = roleAppService;
        }


        [HttpGet]
        public async Task<ActionResult<IEnumerable<RoleApplicatonDto>>> GetRoleApp()
        {
            var answer = await _roleAppService.GetRoleApptDto();
            return Ok(answer);
        }
        [HttpGet("user/{id}")]
        public async Task<ActionResult<IEnumerable<RoleApplicatonDto>>> GetRoleAppByUser(int id)
        {
            var answer = await _roleAppService.GetRoleAppDtoByUser(id);
            return Ok(answer);
        }
        [HttpPost]
        public async Task<ActionResult<RoleApplicatonDto>> CreateRoleApp(CreateRoleApplicatonDto roleAppDto)
        {
            if (roleAppDto == null)
            {
                return BadRequest();
            }
            var complaint = await _roleAppService.CreateRoleAppDto(roleAppDto);
            return Ok(complaint);
        }
        [HttpPut("{id}")]
        public async Task<ActionResult<RoleApplicatonDto>> ChangeRoleApp(CreateRoleApplicatonDto roleAppDto, int id)
        {
            if (roleAppDto == null)
            {
                return BadRequest();
            }
            var complaint = await _roleAppService.ChangeRoleAppDto(roleAppDto, id);
            if (complaint == null)
            {
                return NotFound();
            }
            return Ok(complaint);
        }
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteComplaint(int id)
        {
            var answer = await _roleAppService.DeleteRoleAppDto(id);
            if (!answer)
            {
                return NotFound();
            }
            return Ok("Role application deleted");
        }



    }
}
