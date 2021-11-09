import { MigrationInterface, QueryRunner } from "typeorm";

export class updatePartidaConstraint1636438992498
  implements MigrationInterface
{
  name = "updatePartidaConstraint1636438992498";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`partida\` DROP COLUMN \`placar\``);
    await queryRunner.query(
      `ALTER TABLE \`partida\` ADD \`placar\` varchar(80) NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`partida\` CHANGE \`placarMandante\` \`placarMandante\` int NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`partida\` CHANGE \`placarVisitante\` \`placarVisitante\` int NULL`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`partida\` CHANGE \`placarVisitante\` \`placarVisitante\` int NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`partida\` CHANGE \`placarMandante\` \`placarMandante\` int NOT NULL`
    );
    await queryRunner.query(`ALTER TABLE \`partida\` DROP COLUMN \`placar\``);
    await queryRunner.query(
      `ALTER TABLE \`partida\` ADD \`placar\` varchar(50) NOT NULL`
    );
  }
}
