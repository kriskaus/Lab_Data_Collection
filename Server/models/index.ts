'use strict';

const fs = require('fs');
import path from 'path';
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env["NODE_ENV"] || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db:any = {};

let sequelize: any;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter((file: string) => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      (file.endsWith('.js') || file.endsWith('.ts'))&&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach((file: string) => {
    console.log(file)
    const modelPath = path.join(__dirname, file);
    import(modelPath).then((module) => {
      const model = module.default(sequelize, Sequelize.DataTypes);
      db[model.name] = model;
    });
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;
export default db;
