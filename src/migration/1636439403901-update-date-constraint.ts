import {MigrationInterface, QueryRunner} from "typeorm";

export class updateDateConstraint1636439403901 implements MigrationInterface {
    name = 'updateDateConstraint1636439403901'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`partida\` CHANGE \`dataRealizacao\` \`dataRealizacao\` datetime NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`partida\` CHANGE \`dataRealizacao\` \`dataRealizacao\` datetime NOT NULL`);
    }

}
