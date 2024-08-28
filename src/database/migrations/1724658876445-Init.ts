import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1724658876445 implements MigrationInterface {
    name = 'Init1724658876445'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`user_login_data_external\` (\`id\` bigint NOT NULL AUTO_INCREMENT, \`uuid\` varchar(36) NOT NULL, \`user_account_id\` bigint NOT NULL, \`social_id\` varchar(255) NULL, \`provider\` enum ('facebook', 'google', 'linkedin', 'twitter') NULL, \`token\` varchar(2048) NOT NULL, \`expired_at\` datetime NOT NULL, \`created_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`deleted_at\` datetime(6) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user_login_data\` (\`id\` bigint NOT NULL AUTO_INCREMENT, \`uuid\` varchar(36) NOT NULL, \`user_account_id\` bigint NOT NULL, \`password_hash\` varchar(250) NULL, \`email\` varchar(255) NULL, \`email_status\` enum ('Pending', 'Valid', 'Invalid', 'Expired', 'Error') NULL DEFAULT 'Pending', \`password_recovery_token\` varchar(1024) NULL, \`confirmation_token\` varchar(1024) NULL, \`is_two_factor_enabled\` tinyint NULL DEFAULT 0, \`is_two_factor_verified\` tinyint NULL DEFAULT 0, \`two_factor_secret\` varchar(255) NULL, \`user_position\` enum ('User', 'CompanyUser', 'CompanyManager', 'Admin') NOT NULL DEFAULT 'User', \`created_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`deleted_at\` datetime(6) NULL, UNIQUE INDEX \`REL_8ae14fa0a8f7632db2c6c19866\` (\`user_account_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user_account\` (\`id\` bigint NOT NULL AUTO_INCREMENT, \`uuid\` varchar(36) NOT NULL, \`first_name\` varchar(100) NULL DEFAULT '', \`last_name\` varchar(100) NULL DEFAULT '', \`gender\` enum ('Male', 'Female') NULL, \`date_of_birth\` datetime NULL, \`phone_number\` varchar(15) NULL, \`avatar\` varchar(255) NULL DEFAULT 'avatar', \`status\` enum ('active', 'blocked', 'inactive') NOT NULL DEFAULT 'inactive', \`company_id\` int NULL, \`created_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`deleted_at\` datetime(6) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`user_login_data_external\` ADD CONSTRAINT \`FK_985701e036e08a4c9d2ce2ff922\` FOREIGN KEY (\`user_account_id\`) REFERENCES \`user_account\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_login_data\` ADD CONSTRAINT \`FK_8ae14fa0a8f7632db2c6c198666\` FOREIGN KEY (\`user_account_id\`) REFERENCES \`user_account\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_login_data\` DROP FOREIGN KEY \`FK_8ae14fa0a8f7632db2c6c198666\``);
        await queryRunner.query(`ALTER TABLE \`user_login_data_external\` DROP FOREIGN KEY \`FK_985701e036e08a4c9d2ce2ff922\``);
        await queryRunner.query(`DROP TABLE \`user_account\``);
        await queryRunner.query(`DROP INDEX \`REL_8ae14fa0a8f7632db2c6c19866\` ON \`user_login_data\``);
        await queryRunner.query(`DROP TABLE \`user_login_data\``);
        await queryRunner.query(`DROP TABLE \`user_login_data_external\``);
    }

}
