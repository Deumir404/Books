using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ORM.Migrations
{
    /// <inheritdoc />
    public partial class ChangeStructureUserBook : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "MarkBooks");

            migrationBuilder.AddColumn<int>(
                name: "IdChapter",
                table: "UserBooks",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_UserBooks_IdChapter",
                table: "UserBooks",
                column: "IdChapter");

            migrationBuilder.AddForeignKey(
                name: "FK_UserBooks_Chapters_IdChapter",
                table: "UserBooks",
                column: "IdChapter",
                principalTable: "Chapters",
                principalColumn: "IdChapter",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserBooks_Chapters_IdChapter",
                table: "UserBooks");

            migrationBuilder.DropIndex(
                name: "IX_UserBooks_IdChapter",
                table: "UserBooks");

            migrationBuilder.DropColumn(
                name: "IdChapter",
                table: "UserBooks");

            migrationBuilder.CreateTable(
                name: "MarkBooks",
                columns: table => new
                {
                    IdMarkbook = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    IdChapter = table.Column<int>(type: "int", nullable: false),
                    IdUserBook = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MarkBooks", x => x.IdMarkbook);
                    table.ForeignKey(
                        name: "FK_MarkBooks_Chapters_IdChapter",
                        column: x => x.IdChapter,
                        principalTable: "Chapters",
                        principalColumn: "IdChapter",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_MarkBooks_UserBooks_IdUserBook",
                        column: x => x.IdUserBook,
                        principalTable: "UserBooks",
                        principalColumn: "IdUserBook",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_MarkBooks_IdChapter",
                table: "MarkBooks",
                column: "IdChapter");

            migrationBuilder.CreateIndex(
                name: "IX_MarkBooks_IdUserBook",
                table: "MarkBooks",
                column: "IdUserBook");
        }
    }
}
