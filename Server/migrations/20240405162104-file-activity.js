'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
     await queryInterface.createTable('FileActivity', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        userId: {
          type: Sequelize.INTEGER
        },
        uploadTime: {
          type: Sequelize.DATE
        },
        downloadTime: {
          type: Sequelize.DATE
        },
        filename: {
          type: Sequelize.STRING
        },
        IPAddress: {
          type: Sequelize.STRING
      }
    });
  },

  async down (queryInterface, Sequelize) {
     await queryInterface.dropTable('users');
     
  }
};
