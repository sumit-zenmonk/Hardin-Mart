import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class orderMigration1778505600003 implements MigrationInterface {
    name = "orderMigration1778505600003";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "billing_schema"."payment_status_type_enum" AS ENUM('pending', 'paid', 'cancelled','refund');`);
        await queryRunner.query(`CREATE TYPE "billing_schema"."order_status_type_enum" AS ENUM('pending', 'processing','packed','delivered','returned');`);

        await queryRunner.createTable(new Table({
            name: "order",
            columns: [
                { name: "uuid", type: "uuid", isPrimary: true, generationStrategy: "uuid", default: "uuid_generate_v4()" },
                { name: "id", type: "bigint", isGenerated: true, generationStrategy: "increment", isUnique: true, isNullable: false },
                { name: "user_uuid", type: "uuid", isNullable: false },
                { name: "order_status", type: `"billing_schema"."order_status_type_enum"`, default: `'pending'` },
                { name: "payment_status", type: `"billing_schema"."payment_status_type_enum"`, default: `'pending'` },
                { name: "created_at", type: "timestamp", default: "now()" },
                { name: "updated_at", type: "timestamp", default: "now()" },
                { name: "deleted_at", type: "timestamp", isNullable: true }
            ]
        }), true);

        await queryRunner.createForeignKey(
            "order",
            new TableForeignKey({
                columnNames: ["user_uuid"],
                referencedTableName: "user",
                referencedColumnNames: ["uuid"],
                name: "FK_order_user",
                onDelete: "CASCADE"
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey("order", "FK_order_user");
        await queryRunner.dropTable("order", true);
    }
}