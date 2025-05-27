using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ORM.Migrations
{
    /// <inheritdoc />
    public partial class NullableobjectForChapter : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserBooks_Chapters_IdChapter",
                table: "UserBooks");

            migrationBuilder.AlterColumn<int>(
                name: "IdChapter",
                table: "UserBooks",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddForeignKey(
                name: "FK_UserBooks_Chapters_IdChapter",
                table: "UserBooks",
                column: "IdChapter",
                principalTable: "Chapters",
                principalColumn: "IdChapter");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserBooks_Chapters_IdChapter",
                table: "UserBooks");

            migrationBuilder.AlterColumn<int>(
                name: "IdChapter",
                table: "UserBooks",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_UserBooks_Chapters_IdChapter",
                table: "UserBooks",
                column: "IdChapter",
                principalTable: "Chapters",
                principalColumn: "IdChapter",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
