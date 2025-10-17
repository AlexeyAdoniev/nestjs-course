import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUser1760394971727 implements MigrationInterface {
    name = 'CreateUser1760394971727'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "user"
            ADD "emailId" integer
        `);
        await queryRunner.query(`
            ALTER TABLE "user"
            ADD CONSTRAINT "FK_1af105e69b4350d9b89728a52a6" FOREIGN KEY ("emailId") REFERENCES "email"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "user" DROP CONSTRAINT "FK_1af105e69b4350d9b89728a52a6"
        `);
        await queryRunner.query(`
            ALTER TABLE "user" DROP COLUMN "emailId"
        `);
    }

}
