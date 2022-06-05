import {MigrationInterface, QueryRunner} from "typeorm";

export class fixUniquenessAndForeignKeys1654389471492 implements MigrationInterface {
    name = 'fixUniquenessAndForeignKeys1654389471492'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_profile" ADD "identityDocument" character varying(10) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_profile" ADD "userUuid" uuid`);
        await queryRunner.query(`ALTER TABLE "user_profile" ADD CONSTRAINT "UQ_599d0f5f9b6c7ea7ece2906e41a" UNIQUE ("userUuid")`);
        await queryRunner.query(`ALTER TABLE "report" ADD "dataType" character varying(21) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD "profileUuid" uuid`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_c417cf0aeea992e514a4e8453ef" UNIQUE ("profileUuid")`);
        await queryRunner.query(`ALTER TABLE "user" ADD "guideUuid" uuid`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_eb8d9deddefd6a6de9b7013b585" UNIQUE ("guideUuid")`);
        await queryRunner.query(`ALTER TABLE "sale" ADD "ownerFirstName" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "sale" ADD "ownerLastName" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "sale" ADD "userUuid" uuid`);
        await queryRunner.query(`ALTER TABLE "sale" ADD "tourUuid" uuid`);
        await queryRunner.query(`ALTER TABLE "guide" ADD "userUuid" uuid`);
        await queryRunner.query(`ALTER TABLE "guide" ADD CONSTRAINT "UQ_a523377d7c134596b02d050dc4b" UNIQUE ("userUuid")`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username")`);
        await queryRunner.query(`ALTER TABLE "sale" ALTER COLUMN "created_at" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "sale" ALTER COLUMN "updated_at" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_profile" ADD CONSTRAINT "FK_599d0f5f9b6c7ea7ece2906e41a" FOREIGN KEY ("userUuid") REFERENCES "user"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_c417cf0aeea992e514a4e8453ef" FOREIGN KEY ("profileUuid") REFERENCES "user_profile"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_eb8d9deddefd6a6de9b7013b585" FOREIGN KEY ("guideUuid") REFERENCES "guide"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sale" ADD CONSTRAINT "FK_271f1f25b894c306d70f351927a" FOREIGN KEY ("userUuid") REFERENCES "user"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sale" ADD CONSTRAINT "FK_83a58272a803339a92cbbce304f" FOREIGN KEY ("tourUuid") REFERENCES "tour"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "guide" ADD CONSTRAINT "FK_a523377d7c134596b02d050dc4b" FOREIGN KEY ("userUuid") REFERENCES "user"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "guide" DROP CONSTRAINT "FK_a523377d7c134596b02d050dc4b"`);
        await queryRunner.query(`ALTER TABLE "sale" DROP CONSTRAINT "FK_83a58272a803339a92cbbce304f"`);
        await queryRunner.query(`ALTER TABLE "sale" DROP CONSTRAINT "FK_271f1f25b894c306d70f351927a"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_eb8d9deddefd6a6de9b7013b585"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_c417cf0aeea992e514a4e8453ef"`);
        await queryRunner.query(`ALTER TABLE "user_profile" DROP CONSTRAINT "FK_599d0f5f9b6c7ea7ece2906e41a"`);
        await queryRunner.query(`ALTER TABLE "sale" ALTER COLUMN "updated_at" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "sale" ALTER COLUMN "created_at" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb"`);
        await queryRunner.query(`ALTER TABLE "guide" DROP CONSTRAINT "UQ_a523377d7c134596b02d050dc4b"`);
        await queryRunner.query(`ALTER TABLE "guide" DROP COLUMN "userUuid"`);
        await queryRunner.query(`ALTER TABLE "sale" DROP COLUMN "tourUuid"`);
        await queryRunner.query(`ALTER TABLE "sale" DROP COLUMN "userUuid"`);
        await queryRunner.query(`ALTER TABLE "sale" DROP COLUMN "ownerLastName"`);
        await queryRunner.query(`ALTER TABLE "sale" DROP COLUMN "ownerFirstName"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_eb8d9deddefd6a6de9b7013b585"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "guideUuid"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_c417cf0aeea992e514a4e8453ef"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "profileUuid"`);
        await queryRunner.query(`ALTER TABLE "report" DROP COLUMN "dataType"`);
        await queryRunner.query(`ALTER TABLE "user_profile" DROP CONSTRAINT "UQ_599d0f5f9b6c7ea7ece2906e41a"`);
        await queryRunner.query(`ALTER TABLE "user_profile" DROP COLUMN "userUuid"`);
        await queryRunner.query(`ALTER TABLE "user_profile" DROP COLUMN "identityDocument"`);
    }

}
