import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePreferencesTable1700708781982 implements MigrationInterface {
    name = 'CreatePreferencesTable1700708781982'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`preference\` (\`id\` int NOT NULL AUTO_INCREMENT, \`date\` date NOT NULL, \`type\` varchar(10) NOT NULL, \`preferenceStrength\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`nurseShiftPreference\` (\`id\` int NOT NULL AUTO_INCREMENT, \`nurseId\` int NULL, \`preferenceId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`nurses\` DROP COLUMN \`preferences\``);
        await queryRunner.query(`ALTER TABLE \`nurseShiftPreference\` ADD CONSTRAINT \`FK_9aa7d967fb9e85daa8684f8860b\` FOREIGN KEY (\`nurseId\`) REFERENCES \`nurses\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`nurseShiftPreference\` ADD CONSTRAINT \`FK_c13f9af61ced05150954538c5f3\` FOREIGN KEY (\`preferenceId\`) REFERENCES \`preference\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`nurseShiftPreference\` DROP FOREIGN KEY \`FK_c13f9af61ced05150954538c5f3\``);
        await queryRunner.query(`ALTER TABLE \`nurseShiftPreference\` DROP FOREIGN KEY \`FK_9aa7d967fb9e85daa8684f8860b\``);
        await queryRunner.query(`ALTER TABLE \`nurses\` ADD \`preferences\` json NULL`);
        await queryRunner.query(`DROP TABLE \`nurseShiftPreference\``);
        await queryRunner.query(`DROP TABLE \`preference\``);
    }

}
