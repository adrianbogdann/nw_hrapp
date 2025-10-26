import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("users", (table) => {
    table.increments("id").primary();
    table.string("email").notNullable().unique();
    table.string("password").notNullable();
    table.string("role").notNullable();
    table.timestamps(true, true);
  });

  await knex.schema.createTable("profiles", (table) => {
    table.increments("id").primary();
    table.integer("user_id").unsigned().references("id").inTable("users").onDelete("CASCADE");
    table.string("first_name");
    table.string("last_name");
    table.text("bio");
    table.string("phone");
    table.string("location");
    table.boolean("sensitive_data_visible").defaultTo(false);
    table.timestamps(true, true);
  });

  await knex.schema.createTable('feedbacks', (t) => {
    t.increments('id').primary();
    t.integer('from_user_id').unsigned().notNullable()
      .references('id').inTable('users')
      .onDelete('CASCADE');
    t.integer('to_user_id').unsigned().notNullable()
      .references('id').inTable('users')
      .onDelete('CASCADE');
    t.text('content').notNullable();
    t.text('polished');
    t.timestamp('created_at').defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("feedbacks");
  await knex.schema.dropTableIfExists("profiles");
  await knex.schema.dropTableIfExists("users");
}
