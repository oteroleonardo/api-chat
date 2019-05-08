
const { onUpdateTrigger } = require('../knexfile');

exports.up = (knex, Promise) => {
  console.log("Executing DB migration");
  return knex.schema.createTable('user', t => {
    t.increments();
    t.string('email').unique().notNull();
    t.string('password_digest').notNull();
    t.string('username').notNull();
    t.string('status').defaultTo('disconnected'); //connected, disconnected
  }).createTable('message', t => {
    t.increments();
    t.string('receiver').notNull();
    t.string('sender').notNull();
    t.string('message').notNull();
    t.boolean('readed').defaultTo(false);
    t.timestamp('sentOn', { useTz: false }).defaultTo(knex.fn.now());

  });
};

exports.down = (knex, Promise) => {
  knex.schema.hasTable('user').then(function (exists) {
    if (exists) {
      return knex.schema
        //.dropTable('message')
        .dropTable('user');
    } else {
      console.log("Table user does not exist so there is nothing to do");
    }
  });
};
