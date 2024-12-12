const bcrypt = require('bcrypt');
const { faker } = require('@faker-js/faker');
const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tokens = [
      {
        user_id: 'user123',
        token: 'abc123token',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        user_id: 'user456',
        token: 'xyz456token',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    return queryInterface.bulkInsert('Tokens', tokens);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Tokens', null, {});
  }
};
