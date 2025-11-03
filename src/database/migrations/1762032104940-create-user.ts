import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUser1762032104940 implements MigrationInterface {
    name = 'CreateUser1762032104940'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "order"
                RENAME COLUMN "statis" TO "status"
        `);
        await queryRunner.query(`
            ALTER TYPE "public"."order_statis_enum"
            RENAME TO "order_status_enum"
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TYPE "public"."order_status_enum"
            RENAME TO "order_statis_enum"
        `);
        await queryRunner.query(`
            ALTER TABLE "order"
                RENAME COLUMN "status" TO "statis"
        `);
    }

}
