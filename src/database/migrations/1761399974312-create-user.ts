import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUser1761399974312 implements MigrationInterface {
    name = 'CreateUser1761399974312'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "category" (
                "id" SERIAL NOT NULL,
                "name" character varying NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_23c05c292c439d77b0de816b500" UNIQUE ("name"),
                CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id")
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE "category"
        `);
    }

}
