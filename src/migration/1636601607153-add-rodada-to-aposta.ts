import {MigrationInterface, QueryRunner} from "typeorm";

export class addRodadaToAposta1636601607153 implements MigrationInterface {
    name = 'addRodadaToAposta1636601607153'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`aposta\` ADD \`rodadaId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`aposta\` ADD CONSTRAINT \`FK_b3fa8fd1145f225f98ea52dc422\` FOREIGN KEY (\`rodadaId\`) REFERENCES \`rodada\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`aposta\` DROP FOREIGN KEY \`FK_b3fa8fd1145f225f98ea52dc422\``);
        await queryRunner.query(`ALTER TABLE \`aposta\` DROP COLUMN \`rodadaId\``);
    }

}
