using Books.DTO;
using ORM;
using Books.Repository;
using System.Collections;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Books.Services
{

    public interface ITagService
    {
        Task<IEnumerable<TagDto>> GetTag();
        Task<TagDto> CreateCategoryDTO(CreateTagDto tagDto);
        Task<TagDto?> ChangeCategoryDTO(CreateTagDto tagDto, int id);
        Task<bool> DeleteCategoryDto(int id);

    }
    public class TagService : ITagService
    {
        private readonly ITagRepository _tagRepository;

        public TagService(ITagRepository tagRepository)
        {
            _tagRepository = tagRepository;
        }

        public async Task<IEnumerable<TagDto>> GetTag()
        {
            List<Tag> tags = await _tagRepository.GetAllTag();
            var tagsDto = tags.Select(c => new TagDto { Id = c.IdTag, Name = c.Name });
            return tagsDto;
        }
        public async Task<TagDto> CreateCategoryDTO(CreateTagDto categoryDto)
        {
            Tag tag = new Tag { Name = categoryDto.Name };
            await _tagRepository.CreateTag(tag);
            return new TagDto { Id = tag.IdTag, Name = tag.Name };
        }

        public async Task<TagDto?> ChangeCategoryDTO(CreateTagDto categoryDto, int id)
        {
            var tag = await _tagRepository.GetTagById(id);
            if (tag == null)
            {
                return null;
            }
            tag.Name = categoryDto.Name;
            await _tagRepository.SaveChanges();
            var answer = new TagDto { Id = tag.IdTag, Name = tag.Name };
            return answer;
        }

        public async Task<bool> DeleteCategoryDto(int id)
        {
            var tag = await _tagRepository.GetTagById(id);
            if (tag == null)
            {
                return false;
            }
            await _tagRepository.RemoveTag(tag);
            return true;
        }


    }
}
