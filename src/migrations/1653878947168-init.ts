import {MigrationInterface, QueryRunner} from "typeorm";

export class init1653878947168 implements MigrationInterface {
    name = 'init1653878947168'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "tour" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "date" TIMESTAMP NOT NULL, "type" character varying(50) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "guideUuid" uuid, CONSTRAINT "PK_ac64fcca476bda9c82afaef35f8" PRIMARY KEY ("uuid"))`);
        await queryRunner.query(`CREATE TABLE "role" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "title" character varying, CONSTRAINT "PK_16fc336b9576146aa1f03fdc7c5" PRIMARY KEY ("uuid"))`);
        await queryRunner.query(`CREATE TABLE "user_profile" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "phone" character varying, "email" character varying, "additionalPhonesString" text, CONSTRAINT "PK_7e67b53e5bc90017b2836ef1b9b" PRIMARY KEY ("uuid"))`);
        await queryRunner.query(`CREATE TABLE "report_detail" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "x" character varying NOT NULL, "y" character varying NOT NULL, "z" character varying, "xx" character varying, "yy" character varying, "zz" character varying, "reportUuid" uuid, CONSTRAINT "PK_0019bd4c1d247c50944989c54e8" PRIMARY KEY ("uuid"))`);
        await queryRunner.query(`CREATE TABLE "report" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "date" TIMESTAMP NOT NULL, "type" character varying(50) NOT NULL, "authorUuid" uuid, CONSTRAINT "PK_6d75f0b67c2116a6f2009308498" PRIMARY KEY ("uuid"))`);
        await queryRunner.query(`CREATE TABLE "sale" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "amount" numeric NOT NULL, "created_at" TIMESTAMP DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "sellerUuid" uuid, CONSTRAINT "PK_873ba473446fe804c0374fd3926" PRIMARY KEY ("uuid"))`);
        await queryRunner.query(`CREATE TABLE "session" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "sessionStart" TIMESTAMP NOT NULL, "sessionEnd" TIMESTAMP, "isActive" boolean NOT NULL, "token" text NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "userUuid" uuid, CONSTRAINT "PK_aa8b10fce4746369616ff6a5978" PRIMARY KEY ("uuid"))`);
        await queryRunner.query(`CREATE TABLE "user" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" character varying NOT NULL, "passwordHash" character varying NOT NULL, "passwordSalt" character varying NOT NULL, "secretHash" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_a95e949168be7b7ece1a2382fed" PRIMARY KEY ("uuid"))`);
        await queryRunner.query(`CREATE TABLE "guide" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "fixedHours" numeric NOT NULL DEFAULT '0', "hoursAggregate" numeric NOT NULL DEFAULT '0', "volunteershipStart" TIMESTAMP NOT NULL, "volunteershipEnd" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_2f1e3b13929acdb63252fba3672" PRIMARY KEY ("uuid"))`);
        await queryRunner.query(`ALTER TABLE "tour" ADD CONSTRAINT "FK_0bd534c195afc6e1ce04b88add5" FOREIGN KEY ("guideUuid") REFERENCES "guide"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "report_detail" ADD CONSTRAINT "FK_0b9f9dbdf60852d6ab49cfd249c" FOREIGN KEY ("reportUuid") REFERENCES "report"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "report" ADD CONSTRAINT "FK_573e2c730aa36c69764b2840a5b" FOREIGN KEY ("authorUuid") REFERENCES "user"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sale" ADD CONSTRAINT "FK_860710c62f5f8f126375df25021" FOREIGN KEY ("sellerUuid") REFERENCES "user"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "session" ADD CONSTRAINT "FK_aeb3b3e1044d22f85a5b705adae" FOREIGN KEY ("userUuid") REFERENCES "user"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "session" DROP CONSTRAINT "FK_aeb3b3e1044d22f85a5b705adae"`);
        await queryRunner.query(`ALTER TABLE "sale" DROP CONSTRAINT "FK_860710c62f5f8f126375df25021"`);
        await queryRunner.query(`ALTER TABLE "report" DROP CONSTRAINT "FK_573e2c730aa36c69764b2840a5b"`);
        await queryRunner.query(`ALTER TABLE "report_detail" DROP CONSTRAINT "FK_0b9f9dbdf60852d6ab49cfd249c"`);
        await queryRunner.query(`ALTER TABLE "tour" DROP CONSTRAINT "FK_0bd534c195afc6e1ce04b88add5"`);
        await queryRunner.query(`DROP TABLE "guide"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "session"`);
        await queryRunner.query(`DROP TABLE "sale"`);
        await queryRunner.query(`DROP TABLE "report"`);
        await queryRunner.query(`DROP TABLE "report_detail"`);
        await queryRunner.query(`DROP TABLE "user_profile"`);
        await queryRunner.query(`DROP TABLE "role"`);
        await queryRunner.query(`DROP TABLE "tour"`);
    }

}
