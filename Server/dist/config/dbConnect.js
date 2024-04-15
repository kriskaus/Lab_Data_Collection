"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const config_json_1 = __importDefault(require("../config/config.json"));
const config = config_json_1.default.development;
const dbName = config.database;
const dbHost = config.host;
const dbUsername = config.username;
const dbPassword = config.password;
const dbDialect = "mysql";
const sequelize = new sequelize_1.Sequelize(dbName, dbUsername, dbPassword, {
    host: dbHost,
    dialect: dbDialect,
    // storage: "./session.mysql"
});
exports.default = sequelize;
