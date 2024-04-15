'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class fileActivity extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  fileActivity.init({
    userId: DataTypes.STRING,
    uploadTime: DataTypes.DATE,
    downloadTime: DataTypes.DATE,
    filename: DataTypes.STRING,
    IPAddress: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'fileActivity',
  });
  return fileActivity;
};