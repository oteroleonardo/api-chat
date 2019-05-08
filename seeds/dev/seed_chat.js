
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('user').del()
    .then(function () {
      // Inserts seed entries
      return knex('user').insert([
        {email: 'pepita@gmail.com', password_digest: '$2b$12$Kx8fbV8ZLL6Q0fGxD3rmh.hd2WaR1NG3shLGCkjvj5Pf7qBef8x2W', username: 'pepita'},
        {email: 'jaime@gmail.com', password_digest: '$2b$12$Kx8fbV8ZLL6Q0fGxD3rmh.hd2WaR1NG3shLGCkjvj5Pf7qBef8x2W', username: 'Jaime'},
        {email: 'fiorella@gmail.com', password_digest: '$2b$12$Kx8fbV8ZLL6Q0fGxD3rmh.hd2WaR1NG3shLGCkjvj5Pf7qBef8x2W', username: 'Fiorella'},
        {email: 'user4@gmail.com', password_digest: '$2b$12$Kx8fbV8ZLL6Q0fGxD3rmh.hd2WaR1NG3shLGCkjvj5Pf7qBef8x2W', username: 'User4'},
      ]);
    });
};
