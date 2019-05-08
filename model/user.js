
const knex = require('knex');
const knexCfg = require('../knexfile.js')[process.env.NODE_ENV];
const knexDb = knex(knexCfg);
const bookshelf = require('bookshelf');
const securePassword = require('bookshelf-secure-password');

const db = bookshelf(knexDb);

db.plugin(securePassword);
const User = db.Model.extend({
  tableName: 'user',
  hasSecurePassword: 'password_digest',

});

module.exports = User;
