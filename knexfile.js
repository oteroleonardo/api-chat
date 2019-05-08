const config = require ('dotenv').config();
// Update with your config settings.
const onUpdateTrigger = table => `
    CREATE TRIGGER ${table}_updated_at
    BEFORE UPDATE ON ${table}
    FOR EACH ROW
    EXECUTE PROCEDURE on_update_timestamp();
  `;


const typeCast = (field, useDefaultTypeCasting) => {
  // We only want to cast bit fields that have a single-bit in them. If the field
  // has more than one bit, then we cannot assume it is supposed to be a Boolean.
  if ((field.type === 'BIT') && (field.length === 1)) {
    const bytes = field.buffer();
    // A Buffer in Node represents a collection of 8-bit unsigned integers.
    // Therefore, our single "bit field" comes back as the bits '0000 0001',
    // which is equivalent to the number 1.
    return (bytes && bytes[0] === 1);
  }
  return (useDefaultTypeCasting());
};

const development = {
  client: 'pg',
  connection: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    charset: 'utf8',
    typeCast, // fix mysql boolean handling      
  },
  migrations: {
    tableName: 'chat_migrations',
    directory: 'migrations',
  },
  seeds: {
    directory: 'seeds/dev',
  },
  pool: {
    min: 1,
    max: 2,
    acquireTimeout: 30 * 1000,
    bailAfter: 30 * 1000,
    afterCreate(connection, callback) {
      connection.query('SET timezone = UTC;', (err) => {
        callback(err, connection);
      });
    },
  },
};
//console.log('development: ', development);
module.exports = {
  development,
  onUpdateTrigger,
};

