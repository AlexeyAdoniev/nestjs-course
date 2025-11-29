import { MigrationInterface, QueryRunner } from 'typeorm';

export class InsertAdmin1764201225272 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            insert into "user"
                ("name", "emailId", "phone", "password", "salt", "role")
            values
                ('admin', 9, '+972584073322', 'Pc8JrNzDt4E1nAI3ImohpTrRnQO8c1JGiaz44KoBzSYN0S2/1UU5PZj9NdSskVBRfBVvONoovyrYbC2oexq/8A==', 'QMOYfv9mr5bMuK8egRlOUA==', 'ADMIN')
            `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            delete from "user" where "emailId" = 9
        `);
  }
}
