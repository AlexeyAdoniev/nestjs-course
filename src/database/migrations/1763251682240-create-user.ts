import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUser1763251682240 implements MigrationInterface {
    name = 'CreateUser1763251682240'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "user"
            ADD "salt" character varying
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "user" DROP COLUMN "salt"
        `);
    }

}
