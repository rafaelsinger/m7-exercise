import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatePreferencesTable1700709344869 implements MigrationInterface {
    name = 'UpdatePreferencesTable1700709344869'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`preference\` CHANGE \`date\` \`dayOfWeek\` date NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`preference\` DROP COLUMN \`dayOfWeek\``);
        await queryRunner.query(`ALTER TABLE \`preference\` ADD \`dayOfWeek\` varchar(15) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`preference\` DROP COLUMN \`dayOfWeek\``);
        await queryRunner.query(`ALTER TABLE \`preference\` ADD \`dayOfWeek\` date NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`preference\` CHANGE \`dayOfWeek\` \`date\` date NOT NULL`);
    }

}
