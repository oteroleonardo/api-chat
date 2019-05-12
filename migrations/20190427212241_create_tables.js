
const { onUpdateTrigger } = require('../knexfile');

exports.up = (knex, Promise) => {
  console.log("Executing DB migration");
  return knex.schema.createTable('user', t => {
    t.increments('id').unsigned().unique().primary();
    t.string('email').unique().notNull();
    t.string('password_digest').notNull();
    t.string('username').unique().notNull();
    t.string('status').defaultTo('disconnected'); //connected, disconnected
  }).createTable('message', t => {
    t.increments('id').unsigned().primary();
    t.string('receiver').references('user.username').notNull();
    t.string('sender').references('user.username').notNull();
    t.integer('relatedToMessage').unsigned().references('message.id');
    t.string('message').notNull();
    t.boolean('readed').defaultTo(false);
    t.timestamp('sentOn', { useTz: false }).defaultTo(knex.fn.now());

  });
};

exports.down = async (knex, Promise) => {
  await knex.schema.hasTable('user').then(exists => {
    if (exists) {
      return knex.schema
        .dropTable('user')
        .catch(e => console.log(e.message));
    } else {
      console.log("Table user does not exist so there is nothing to do");
    }
  });
  await knex.schema.hasTable('message').then(exists => {
    if (exists) {
      return knex.schema
        .dropTable('message')
        .catch(e => console.log(e.message));
    } else {
      console.log("Table message does not exist so there is nothing to do");
    }
  });

};
