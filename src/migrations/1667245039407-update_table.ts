import { MigrationInterface, QueryRunner } from 'typeorm';

export class updateTable1667245039407 implements MigrationInterface {
  name = 'updateTable1667245039407';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "CartItems" RENAME COLUMN "productId" TO "filmId"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "CartItems" RENAME COLUMN "filmId" TO "productId"`,
    );
  }
}
