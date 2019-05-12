
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('user').del()
    .then(function () {
      // Inserts seed entries
      return knex('user').insert([
        // IMPORTANT: password: 'test-pass'
        {email: 'oteroleonardo@gmail.com', password_digest: '$2b$12$QZOl7Som7IjMpNOoAgr4o.NokujGQ6FCgDEH0SDW7OVWmKFRqFH6i', username: 'oteroleonardo'},
        {email: 'pepita@gmail.com', password_digest: '$2b$12$QZOl7Som7IjMpNOoAgr4o.NokujGQ6FCgDEH0SDW7OVWmKFRqFH6i', username: 'pepita'},
        {email: 'jaime@gmail.com', password_digest: '$2b$12$QZOl7Som7IjMpNOoAgr4o.NokujGQ6FCgDEH0SDW7OVWmKFRqFH6i', username: 'Jaime'},
        {email: 'fiorella@gmail.com', password_digest: '$2b$12$QZOl7Som7IjMpNOoAgr4o.NokujGQ6FCgDEH0SDW7OVWmKFRqFH6i', username: 'Fiorella'},
        {email: 'user4@gmail.com', password_digest: '$2b$12$QZOl7Som7IjMpNOoAgr4o.NokujGQ6FCgDEH0SDW7OVWmKFRqFH6i', username: 'User4'},
      ]);
    });
};
