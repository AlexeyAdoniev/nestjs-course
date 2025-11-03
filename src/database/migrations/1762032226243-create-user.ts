import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUser1762032226243 implements MigrationInterface {
    name = 'CreateUser1762032226243'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "order_item" DROP CONSTRAINT "FK_904370c093ceea4369659a3c810"
        `);
        await queryRunner.query(`
            ALTER TABLE "order_item"
            ADD CONSTRAINT "FK_904370c093ceea4369659a3c810" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "order_item" DROP CONSTRAINT "FK_904370c093ceea4369659a3c810"
        `);
        await queryRunner.query(`
            ALTER TABLE "order_item"
            ADD CONSTRAINT "FK_904370c093ceea4369659a3c810" FOREIGN KEY ("productId") REFERENCES "order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

}
