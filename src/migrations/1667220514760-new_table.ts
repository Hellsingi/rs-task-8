import { MigrationInterface, QueryRunner } from 'typeorm';

export class newTable1667220514760 implements MigrationInterface {
  name = 'newTable1667220514760';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "Orders" ("id" uuid NOT NULL, "items" jsonb NOT NULL, "payment" jsonb NOT NULL, "delivery" jsonb NOT NULL, "comments" character varying, "status" character varying NOT NULL, "total" integer NOT NULL, "cartId" uuid, "userId" uuid, CONSTRAINT "PK_ce8e3c4d56e47ff9c8189c26213" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "Users" ("id" uuid NOT NULL, "name" character varying NOT NULL, "email" character varying, "password" character varying, "cartId" uuid, CONSTRAINT "REL_669d33e88144db7f7916c0eea8" UNIQUE ("cartId"), CONSTRAINT "PK_16d4f7d636df336db11d87413e3" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "Carts" ("id" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_6088efe237f1e59de8fff0032d5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "CartItems" ("id" uuid NOT NULL, "productId" character varying NOT NULL, "count" integer NOT NULL, "cartId" uuid NOT NULL, CONSTRAINT "PK_3bd084e7aaedba88bd7a0973561" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "Orders" ADD CONSTRAINT "FK_703cc374f422472471b699dff26" FOREIGN KEY ("cartId") REFERENCES "Carts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "Orders" ADD CONSTRAINT "FK_cc257418e0228f05a8d7dcc5553" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "Users" ADD CONSTRAINT "FK_669d33e88144db7f7916c0eea80" FOREIGN KEY ("cartId") REFERENCES "Carts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "CartItems" ADD CONSTRAINT "FK_8c6d0eaa716d64605b55f8d9476" FOREIGN KEY ("cartId") REFERENCES "Carts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "CartItems" DROP CONSTRAINT "FK_8c6d0eaa716d64605b55f8d9476"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Users" DROP CONSTRAINT "FK_669d33e88144db7f7916c0eea80"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Orders" DROP CONSTRAINT "FK_cc257418e0228f05a8d7dcc5553"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Orders" DROP CONSTRAINT "FK_703cc374f422472471b699dff26"`,
    );
    await queryRunner.query(`DROP TABLE "CartItems"`);
    await queryRunner.query(`DROP TABLE "Carts"`);
    await queryRunner.query(`DROP TABLE "Users"`);
    await queryRunner.query(`DROP TABLE "Orders"`);
  }
}
