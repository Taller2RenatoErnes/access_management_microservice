const bcrypt = require('bcrypt');
const { faker } = require('@faker-js/faker');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

module.exports = {
  up: async (queryInterface, Sequelize) => {

    const usersData = JSON.parse(fs.readFileSync(path.join(__dirname, '../users.json')));

    const users = await Promise.all(usersData.map(async (user) => {
      const encryptedPassword = await bcrypt.hash(user.password, 10);
      return {
        id: uuidv4(),
        name: user.name,
        email: user.email,
        password: encryptedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }));

    // Insertar los usuarios en la base de datos
    await queryInterface.bulkInsert('Users', users);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {});
    return queryInterface.bulkDelete('Tokens', null, {});
  },
};
