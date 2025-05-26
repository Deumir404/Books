using Books.DTO;
using ORM;
using Books.Repository;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Books.Services
{

    public interface IChapterService
    {
        Task<ChapterDtoWithText?> GetChapterDto(int id);
        Task<ChapterDtoWithText> CreateChapterDto(CreateChapterDto chapterdto);
        Task<ChapterDtoWithText?> ChangeChapterDto(CreateChapterDto chapterDto, int id);
        Task<bool> DeleteChapterDto(int id);

    }
    public class ChapterService : IChapterService
    {
        private readonly IChapterRepository _chapterRepository;

        public ChapterService(IChapterRepository chapterRepository)
        {
            _chapterRepository = chapterRepository;
        }

        public async Task<ChapterDtoWithText?> GetChapterDto(int id)
        {
            Chapter? text = await _chapterRepository.GetChapterById(id);
            if (text == null)
            {
                return null;
            }
            var chapter = new ChapterDtoWithText
            {
                Id = text.IdChapter,
                Num = text.Num,
                Title = text.Title,
                PublishedDate = text.PublishedDate,
                Text = text.TextChapter.Text,
            };
            return chapter;
        }

        public async Task<ChapterDtoWithText> CreateChapterDto(CreateChapterDto chapterdto)
        {
            var chapter = new Chapter { Title = chapterdto.Title, Num = chapterdto.Num, IdBook = chapterdto.Book };
            await _chapterRepository.CreateChapter(chapter, chapterdto.Text);
            var answer = await GetChapterDto(chapter.IdChapter);
            return answer;
        }

        public async Task<ChapterDtoWithText?> ChangeChapterDto(CreateChapterDto chapterDto, int id)
        {
            var chapter = await _chapterRepository.GetChapterById(id);
            if (chapter == null)
            {
                return null;
            }
            chapter.Title = chapterDto.Title;
            chapter.Num = chapterDto.Num;
            chapter.IdBook = chapterDto.Book;
            await _chapterRepository.SaveChanges();
            var chapterText = await _chapterRepository.GetTextById(id);
            if (chapterText == null)
            {
                return null;
            }
            chapterText.Text = chapterDto.Text;
            await _chapterRepository.SaveChanges();
            return await GetChapterDto(id);
        }

        public async Task<bool> DeleteChapterDto(int id)
        {
            var chapter = await _chapterRepository.GetChapterById(id);
            if (chapter == null)
            {
                return false;
            }
            await _chapterRepository.DeleteChapter(chapter);
            return true;
        }
    }
}
