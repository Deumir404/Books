using Books.DTO;
using ORM;
using Books.Repository;

namespace Books.Services
{

    public interface IRoleAppService
    {
        Task<List<RoleApplicatonDto>> GetRoleApptDto();
        Task<List<RoleApplicatonDto>> GetRoleAppDtoByUser(int id);
        Task<RoleApplicatonDto> CreateRoleAppDto(CreateRoleApplicatonDto roleApplicationDto);
        Task<RoleApplicatonDto?> ChangeRoleAppDto(CreateRoleApplicatonDto commentDto, int id);
        Task<bool> DeleteRoleAppDto(int id);

    }
    public class RoleAppService : IRoleAppService
    {
        private readonly IRoleAppRepository _roleAppRepository;

        public RoleAppService(IRoleAppRepository roleAppRepository)
        {
            _roleAppRepository = roleAppRepository;
        }

        public async Task<List<RoleApplicatonDto>> GetRoleApptDto()
        {
            var roleApplications = await _roleAppRepository.GetRoleApplication();
            var list = new List<RoleApplicatonDto>();
            foreach (var roleApplication in roleApplications)
            {
                var roleAppDto = new RoleApplicatonDto
                {
                    Id = roleApplication.IdRoleApplication,
                    Text = roleApplication.Text,
                    PublishedDate = roleApplication.PublishedDate,
                    User = new SimpleUserDto { Id = roleApplication.User.IdUser, Username = roleApplication.User.Username },
                    RoleUser = roleApplication.Role,
                };
                list.Add(roleAppDto);
            }
            return list;
        }

        public async Task<List<RoleApplicatonDto>> GetRoleAppDtoByUser(int id)
        {
            var roleApplications = await _roleAppRepository.GetRoleApplicationByUser(id);
            var list = new List<RoleApplicatonDto>();
            foreach (var roleApplication in roleApplications)
            {
                var roleAppDto = new RoleApplicatonDto
                {
                    Id = roleApplication.IdRoleApplication,
                    Text = roleApplication.Text,
                    PublishedDate = roleApplication.PublishedDate,
                    User = new SimpleUserDto { Id = roleApplication.User.IdUser, Username = roleApplication.User.Username },
                    RoleUser = roleApplication.Role,
                };
                list.Add(roleAppDto);
            }
            return list;
        }

        public async Task<RoleApplicatonDto> CreateRoleAppDto(CreateRoleApplicatonDto roleApplicationDto)
        {
            var roleApp = new RoleApplication { Text = roleApplicationDto.Text, IdUser = roleApplicationDto.IdUser,  Role = roleApplicationDto.RoleUser };
            await _roleAppRepository.CreateRoleApplication(roleApp);
            roleApp = await _roleAppRepository.GetRoleApplicationById(roleApp.IdRoleApplication);
            var answer = new RoleApplicatonDto
            {
                Id = roleApp.IdRoleApplication,
                Text = roleApp.Text,
                PublishedDate = roleApp.PublishedDate,
                User = new SimpleUserDto { Id = roleApp.User.IdUser, Username = roleApp.User.Username },
                RoleUser = roleApp.Role,
            };
            return answer;
        }

        public async Task<RoleApplicatonDto?> ChangeRoleAppDto(CreateRoleApplicatonDto commentDto, int id)
        {
            var roleApp = await _roleAppRepository.GetRoleApplicationById(id);
            if (roleApp == null)
            {
                return null;
            }
            roleApp.Text = commentDto.Text;
            roleApp.IdUser = commentDto.IdUser;
            roleApp.Role = commentDto.RoleUser;
            await _roleAppRepository.SaveChanges();
            var answer = new RoleApplicatonDto
            {
                Id = roleApp.IdRoleApplication,
                Text = roleApp.Text,
                PublishedDate = roleApp.PublishedDate,
                User = new SimpleUserDto { Id = roleApp.User.IdUser, Username = roleApp.User.Username },
                RoleUser = roleApp.Role,
            };

            return answer;
        }

        public async Task<bool> DeleteRoleAppDto(int id)
        {
            var complaint = await _roleAppRepository.GetRoleApplicationById(id);
            if (complaint == null)
            {
                return false;
            }
            await _roleAppRepository.RemoveRoleApplication(complaint);
            return true;
        }
    }
}
