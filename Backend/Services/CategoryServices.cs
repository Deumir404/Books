using Books.DTO;
using ORM;
using Books.Repository;
using System.Collections;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Books.Services
{

    public interface ICategoryService
    {
        Task<IEnumerable<CategoryDto>> GetCategory();
        Task<CategoryDto> CreateCategoryDTO(CreateCategoryDto categoryDto);
        Task<ActionResult<CategoryDto?>> ChangeCategoryDTO(CreateCategoryDto categoryDto, int id);
        Task<bool> DeleteCategoryDto(int id);

    }
    public class CategoryService : ICategoryService
    {
        private readonly ICategoryRepository _categoryRepository;

        public CategoryService(ICategoryRepository categoryRepository)
        {
            _categoryRepository = categoryRepository;
        }

        public async Task<IEnumerable<CategoryDto>> GetCategory()
        {
            List<Category> category = await _categoryRepository.GetAllCategory();
            var categoryDto = category.Select(c => new CategoryDto { Id = c.IdCategory, Name = c.Name });
            return categoryDto;
        }
        public async Task<CategoryDto> CreateCategoryDTO(CreateCategoryDto categoryDto)
        {
            Category category;
            category = new Category { Name = categoryDto.Name };
            await _categoryRepository.CreateCategory(category);
            return new CategoryDto { Id = category.IdCategory, Name= category.Name };

        }

        public async Task<ActionResult<CategoryDto?>> ChangeCategoryDTO(CreateCategoryDto categoryDto, int id)
        {
            var category = await _categoryRepository.GetCategoryById(id);
            if (category == null)
            {
                return null;
            }
            category.Name = categoryDto.Name;
            await _categoryRepository.SaveChanges();
            var answer = new CategoryDto { Id = category.IdCategory, Name = category.Name };
            return answer;
        }

        public async Task<bool> DeleteCategoryDto(int id)
        {
            var category = await _categoryRepository.GetCategoryById(id);
            if (category == null)
            {
                return false;
            }
            await _categoryRepository.RemoveCategory(category);
            return true;
        }


    }
}
