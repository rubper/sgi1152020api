import {MigrationInterface, QueryRunner} from "typeorm";

export class fixRoles1654403751567 implements MigrationInterface {
    name = 'fixRoles1654403751567'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "role_users_user" ("roleUuid" uuid NOT NULL, "userUuid" uuid NOT NULL, CONSTRAINT "PK_155cef688db3b75407cd3901a2b" PRIMARY KEY ("roleUuid", "userUuid"))`);
        await queryRunner.query(`CREATE INDEX "IDX_2d9804c888333736c27f264131" ON "role_users_user" ("roleUuid") `);
        await queryRunner.query(`CREATE INDEX "IDX_cabd459b60bb1fdd8ac65aa7bc" ON "role_users_user" ("userUuid") `);
        await queryRunner.query(`CREATE TABLE "user_roles_role" ("userUuid" uuid NOT NULL, "roleUuid" uuid NOT NULL, CONSTRAINT "PK_0a82b94535d8d854f68e7275086" PRIMARY KEY ("userUuid", "roleUuid"))`);
        await queryRunner.query(`CREATE INDEX "IDX_cb4b662488d0ac6eabe79094b2" ON "user_roles_role" ("userUuid") `);
        await queryRunner.query(`CREATE INDEX "IDX_75992747142330886c45087fc4" ON "user_roles_role" ("roleUuid") `);
        await queryRunner.query(`ALTER TABLE "role_users_user" ADD CONSTRAINT "FK_2d9804c888333736c27f2641310" FOREIGN KEY ("roleUuid") REFERENCES "role"("uuid") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "role_users_user" ADD CONSTRAINT "FK_cabd459b60bb1fdd8ac65aa7bc0" FOREIGN KEY ("userUuid") REFERENCES "user"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_roles_role" ADD CONSTRAINT "FK_cb4b662488d0ac6eabe79094b2e" FOREIGN KEY ("userUuid") REFERENCES "user"("uuid") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_roles_role" ADD CONSTRAINT "FK_75992747142330886c45087fc42" FOREIGN KEY ("roleUuid") REFERENCES "role"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_roles_role" DROP CONSTRAINT "FK_75992747142330886c45087fc42"`);
        await queryRunner.query(`ALTER TABLE "user_roles_role" DROP CONSTRAINT "FK_cb4b662488d0ac6eabe79094b2e"`);
        await queryRunner.query(`ALTER TABLE "role_users_user" DROP CONSTRAINT "FK_cabd459b60bb1fdd8ac65aa7bc0"`);
        await queryRunner.query(`ALTER TABLE "role_users_user" DROP CONSTRAINT "FK_2d9804c888333736c27f2641310"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_75992747142330886c45087fc4"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_cb4b662488d0ac6eabe79094b2"`);
        await queryRunner.query(`DROP TABLE "user_roles_role"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_cabd459b60bb1fdd8ac65aa7bc"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2d9804c888333736c27f264131"`);
        await queryRunner.query(`DROP TABLE "role_users_user"`);
    }

}
