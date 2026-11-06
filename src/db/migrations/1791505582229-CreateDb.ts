import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateDb1791505582229 implements MigrationInterface {
    name = 'CreateDb1791505582229'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "PENDING_EMAIL" ("id" SERIAL NOT NULL, "payload" character varying NOT NULL, "isPending" boolean NOT NULL, "subject" character varying NOT NULL, "to" character varying NOT NULL, CONSTRAINT "PK_01db8dd94ef7914d695da10f2c9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "LOST_PET" ("id" SERIAL NOT NULL, "type" character varying NOT NULL, "name" character varying NOT NULL, "location" geometry(Point,4326) NOT NULL, "phone" character varying NOT NULL, "race" character varying NOT NULL, "age" integer NOT NULL, "color" character varying NOT NULL, "ownerName" character varying NOT NULL, CONSTRAINT "PK_7fda532c785dfc07c9c2a814365" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "SYSTEM_USER" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "lastName" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "isPetAlertEnabled" boolean NOT NULL, "location" geometry(Point,4326) NOT NULL, "radius" integer NOT NULL, CONSTRAINT "PK_3f5912604df1254054eac4f2b5e" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "SYSTEM_USER"`);
        await queryRunner.query(`DROP TABLE "LOST_PET"`);
        await queryRunner.query(`DROP TABLE "PENDING_EMAIL"`);
    }

}
