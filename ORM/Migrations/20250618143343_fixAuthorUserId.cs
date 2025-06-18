using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ORM.Migrations
{
    /// <inheritdoc />
    public partial class fixAuthorUserId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "IdUser",
                table: "Authors",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Authors_IdUser",
                table: "Authors",
                column: "IdUser");

            migrationBuilder.AddForeignKey(
                name: "FK_Authors_Users_IdUser",
                table: "Authors",
                column: "IdUser",
                principalTable: "Users",
                principalColumn: "IdUser");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Authors_Users_IdUser",
                table: "Authors");

            migrationBuilder.DropIndex(
                name: "IX_Authors_IdUser",
                table: "Authors");

            migrationBuilder.DropColumn(
                name: "IdUser",
                table: "Authors");
        }
    }
}
