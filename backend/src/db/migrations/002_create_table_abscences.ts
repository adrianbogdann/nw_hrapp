import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('absences', (t) => {
    t.increments('id').primary();
    t.integer('user_id').unsigned().notNullable()
      .references('id').inTable('users')
      .onDelete('CASCADE');
    t.date('start_date').notNullable();
    t.date('end_date').notNullable();
    t.text('reason').notNullable();
    t.enu('status', ['pending', 'approved', 'rejected']).defaultTo('pending');
    t.timestamp('created_at').defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('absences');
}
