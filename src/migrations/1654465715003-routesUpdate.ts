import {MigrationInterface, QueryRunner} from "typeorm";

export class routesUpdate1654465715003 implements MigrationInterface {
    name = 'routesUpdate1654465715003'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "route" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, CONSTRAINT "PK_df31268722334c9193b81a71b4e" PRIMARY KEY ("uuid"))`);
        await queryRunner.query(`CREATE TABLE "route_roles_role" ("routeUuid" uuid NOT NULL, "roleUuid" uuid NOT NULL, CONSTRAINT "PK_3bd50ce39812a714579fd8ecb32" PRIMARY KEY ("routeUuid", "roleUuid"))`);
        await queryRunner.query(`CREATE INDEX "IDX_382f9fc28688e6ada32a20b07b" ON "route_roles_role" ("routeUuid") `);
        await queryRunner.query(`CREATE INDEX "IDX_b95de005f4aa6ebfe9e10f9df1" ON "route_roles_role" ("roleUuid") `);
        await queryRunner.query(`CREATE TABLE "role_routes_route" ("roleUuid" uuid NOT NULL, "routeUuid" uuid NOT NULL, CONSTRAINT "PK_faee60dde12fa1cdf69866dd7cf" PRIMARY KEY ("roleUuid", "routeUuid"))`);
        await queryRunner.query(`CREATE INDEX "IDX_67d2d5ea3626d077952d7e8301" ON "role_routes_route" ("roleUuid") `);
        await queryRunner.query(`CREATE INDEX "IDX_1b14ddbd58d503500488beca69" ON "role_routes_route" ("routeUuid") `);
        await queryRunner.query(`ALTER TABLE "route_roles_role" ADD CONSTRAINT "FK_382f9fc28688e6ada32a20b07be" FOREIGN KEY ("routeUuid") REFERENCES "route"("uuid") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "route_roles_role" ADD CONSTRAINT "FK_b95de005f4aa6ebfe9e10f9df1e" FOREIGN KEY ("roleUuid") REFERENCES "role"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "role_routes_route" ADD CONSTRAINT "FK_67d2d5ea3626d077952d7e83016" FOREIGN KEY ("roleUuid") REFERENCES "role"("uuid") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "role_routes_route" ADD CONSTRAINT "FK_1b14ddbd58d503500488beca698" FOREIGN KEY ("routeUuid") REFERENCES "route"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "role_routes_route" DROP CONSTRAINT "FK_1b14ddbd58d503500488beca698"`);
        await queryRunner.query(`ALTER TABLE "role_routes_route" DROP CONSTRAINT "FK_67d2d5ea3626d077952d7e83016"`);
        await queryRunner.query(`ALTER TABLE "route_roles_role" DROP CONSTRAINT "FK_b95de005f4aa6ebfe9e10f9df1e"`);
        await queryRunner.query(`ALTER TABLE "route_roles_role" DROP CONSTRAINT "FK_382f9fc28688e6ada32a20b07be"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1b14ddbd58d503500488beca69"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_67d2d5ea3626d077952d7e8301"`);
        await queryRunner.query(`DROP TABLE "role_routes_route"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b95de005f4aa6ebfe9e10f9df1"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_382f9fc28688e6ada32a20b07b"`);
        await queryRunner.query(`DROP TABLE "route_roles_role"`);
        await queryRunner.query(`DROP TABLE "route"`);
    }

}
