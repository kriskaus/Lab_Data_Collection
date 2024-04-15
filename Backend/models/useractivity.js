'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class userActivity extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  userActivity.init({
    userId: DataTypes.STRING,
    loginTime: DataTypes.DATE,
    logoutTime: DataTypes.DATE,
    IPAddress: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'userActivity',
    timestamps: false
  });
  return userActivity;
};