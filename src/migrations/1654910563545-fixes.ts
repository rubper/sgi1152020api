import {MigrationInterface, QueryRunner} from "typeorm";

export class fixes1654910563545 implements MigrationInterface {
    name = 'fixes1654910563545'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sale" DROP CONSTRAINT "FK_83a58272a803339a92cbbce304f"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_eb8d9deddefd6a6de9b7013b585"`);
        await queryRunner.query(`ALTER TABLE "tour" DROP CONSTRAINT "FK_0bd534c195afc6e1ce04b88add5"`);
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "guideUuid" TO "volunteerUuid"`);
        await queryRunner.query(`ALTER TABLE "user" RENAME CONSTRAINT "UQ_eb8d9deddefd6a6de9b7013b585" TO "UQ_8f64239b9c274798591492b3efc"`);
        await queryRunner.query(`CREATE TABLE "volunteer" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "volunteershipStart" TIMESTAMP NOT NULL, "volunteershipEnd" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "carreer" character varying, "telephone" character varying, "email" character varying, "previousExperience" character varying, "media" character varying, "reason" character varying, "userUuid" uuid, CONSTRAINT "REL_9614c14fb4406341c5e09ba849" UNIQUE ("userUuid"), CONSTRAINT "PK_11dbc3b64326f78093d467482a1" PRIMARY KEY ("uuid"))`);
        await queryRunner.query(`ALTER TABLE "sale" DROP COLUMN "tourUuid"`);
        await queryRunner.query(`ALTER TABLE "tour" DROP COLUMN "guideUuid"`);
        await queryRunner.query(`ALTER TABLE "sale" ADD "ownerEmail" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "sale" ADD "ownerPhone" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "sale" ADD "kidsQuantity" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "sale" ADD "adultsQuantity" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "sale" ADD "total" numeric NOT NULL`);
        await queryRunner.query(`ALTER TABLE "sale" DROP COLUMN "amount"`);
        await queryRunner.query(`ALTER TABLE "sale" ADD "amount" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "volunteer" ADD CONSTRAINT "FK_9614c14fb4406341c5e09ba849a" FOREIGN KEY ("userUuid") REFERENCES "user"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_8f64239b9c274798591492b3efc" FOREIGN KEY ("volunteerUuid") REFERENCES "volunteer"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_8f64239b9c274798591492b3efc"`);
        await queryRunner.query(`ALTER TABLE "volunteer" DROP CONSTRAINT "FK_9614c14fb4406341c5e09ba849a"`);
        await queryRunner.query(`ALTER TABLE "sale" DROP COLUMN "amount"`);
        await queryRunner.query(`ALTER TABLE "sale" ADD "amount" numeric NOT NULL`);
        await queryRunner.query(`ALTER TABLE "sale" DROP COLUMN "total"`);
        await queryRunner.query(`ALTER TABLE "sale" DROP COLUMN "adultsQuantity"`);
        await queryRunner.query(`ALTER TABLE "sale" DROP COLUMN "kidsQuantity"`);
        await queryRunner.query(`ALTER TABLE "sale" DROP COLUMN "ownerPhone"`);
        await queryRunner.query(`ALTER TABLE "sale" DROP COLUMN "ownerEmail"`);
        await queryRunner.query(`ALTER TABLE "tour" ADD "guideUuid" uuid`);
        await queryRunner.query(`ALTER TABLE "sale" ADD "tourUuid" uuid`);
        await queryRunner.query(`DROP TABLE "volunteer"`);
        await queryRunner.query(`ALTER TABLE "user" RENAME CONSTRAINT "UQ_8f64239b9c274798591492b3efc" TO "UQ_eb8d9deddefd6a6de9b7013b585"`);
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "volunteerUuid" TO "guideUuid"`);
        await queryRunner.query(`ALTER TABLE "tour" ADD CONSTRAINT "FK_0bd534c195afc6e1ce04b88add5" FOREIGN KEY ("guideUuid") REFERENCES "guide"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_eb8d9deddefd6a6de9b7013b585" FOREIGN KEY ("guideUuid") REFERENCES "guide"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sale" ADD CONSTRAINT "FK_83a58272a803339a92cbbce304f" FOREIGN KEY ("tourUuid") REFERENCES "tour"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
