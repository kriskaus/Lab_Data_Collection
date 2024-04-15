'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('UserActivities', {

        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        userId: {
          type: Sequelize.STRING
        },
        loginTime: {
          type: Sequelize.DATE
        },
        logoutTime: {
          type: Sequelize.DATE
        },
        IPAddress: {
          type: Sequelize.STRING
        }
      
    })
  },

  async down (queryInterface, Sequelize) {
     await queryInterface.dropTable('UserActivities');
  }
};
