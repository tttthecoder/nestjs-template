import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1724825551019 implements MigrationInterface {
    name = 'Migrations1724825551019'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`blacklist_token\` (\`id\` int NOT NULL AUTO_INCREMENT, \`user_account_id\` bigint NOT NULL, \`token\` varchar(2048) NULL, \`expired_at\` datetime NOT NULL, \`created_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`deleted_at\` datetime(6) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user_tokens\` (\`id\` int NOT NULL AUTO_INCREMENT, \`user_account_id\` bigint NOT NULL, \`type\` enum ('REFRESH_TOKEN', 'ACCESS_TOKEN') NOT NULL DEFAULT 'ACCESS_TOKEN', \`ip_address\` varchar(45) NOT NULL DEFAULT '', \`user_agent\` text NULL, \`token\` varchar(2048) NULL, \`expired_at\` datetime NULL, \`created_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`deleted_at\` datetime(6) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`user_account\` DROP COLUMN \`company_id\``);
        await queryRunner.query(`ALTER TABLE \`blacklist_token\` ADD CONSTRAINT \`FK_7b1693820adc9bdbc6023fee62c\` FOREIGN KEY (\`user_account_id\`) REFERENCES \`user_account\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_tokens\` ADD CONSTRAINT \`FK_4a05de82b55d230ff2f0edf1bba\` FOREIGN KEY (\`user_account_id\`) REFERENCES \`user_account\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_tokens\` DROP FOREIGN KEY \`FK_4a05de82b55d230ff2f0edf1bba\``);
        await queryRunner.query(`ALTER TABLE \`blacklist_token\` DROP FOREIGN KEY \`FK_7b1693820adc9bdbc6023fee62c\``);
        await queryRunner.query(`ALTER TABLE \`user_account\` ADD \`company_id\` int NULL`);
        await queryRunner.query(`DROP TABLE \`user_tokens\``);
        await queryRunner.query(`DROP TABLE \`blacklist_token\``);
    }

}
