using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ORM.Migrations
{
    /// <inheritdoc />
    public partial class AddTextChapterTry2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TextChapter_Chapters_IdChapter",
                table: "TextChapter");

            migrationBuilder.DropPrimaryKey(
                name: "PK_TextChapter",
                table: "TextChapter");

            migrationBuilder.RenameTable(
                name: "TextChapter",
                newName: "TextChapters");

            migrationBuilder.AddPrimaryKey(
                name: "PK_TextChapters",
                table: "TextChapters",
                column: "IdChapter");

            migrationBuilder.AddForeignKey(
                name: "FK_TextChapters_Chapters_IdChapter",
                table: "TextChapters",
                column: "IdChapter",
                principalTable: "Chapters",
                principalColumn: "IdChapter",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TextChapters_Chapters_IdChapter",
                table: "TextChapters");

            migrationBuilder.DropPrimaryKey(
                name: "PK_TextChapters",
                table: "TextChapters");

            migrationBuilder.RenameTable(
                name: "TextChapters",
                newName: "TextChapter");

            migrationBuilder.AddPrimaryKey(
                name: "PK_TextChapter",
                table: "TextChapter",
                column: "IdChapter");

            migrationBuilder.AddForeignKey(
                name: "FK_TextChapter_Chapters_IdChapter",
                table: "TextChapter",
                column: "IdChapter",
                principalTable: "Chapters",
                principalColumn: "IdChapter",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
