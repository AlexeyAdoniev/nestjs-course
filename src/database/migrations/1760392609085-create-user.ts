import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUser1760392609085 implements MigrationInterface {
    name = 'CreateUser1760392609085'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "user" DROP COLUMN "registryDatesCreatedat"
        `);
        await queryRunner.query(`
            ALTER TABLE "user" DROP COLUMN "registryDatesUpdatedat"
        `);
        await queryRunner.query(`
            ALTER TABLE "user"
            ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()
        `);
        await queryRunner.query(`
            ALTER TABLE "user"
            ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "user" DROP COLUMN "updatedAt"
        `);
        await queryRunner.query(`
            ALTER TABLE "user" DROP COLUMN "createdAt"
        `);
        await queryRunner.query(`
            ALTER TABLE "user"
            ADD "registryDatesUpdatedat" TIMESTAMP NOT NULL DEFAULT now()
        `);
        await queryRunner.query(`
            ALTER TABLE "user"
            ADD "registryDatesCreatedat" TIMESTAMP NOT NULL DEFAULT now()
        `);
    }

}
