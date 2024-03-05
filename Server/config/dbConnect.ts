import { Sequelize } from "sequelize";
const config = require(__dirname + '/../config/config.json')["development"]

const dbName = config.database as string;
const dbHost = config.host;
const dbUsername = config.username as string;
const dbPassword = config.password;
const dbDialect = "mysql";

const sequelizeConnection = new Sequelize(dbName, dbUsername, dbPassword, {
	host: dbHost,
	dialect: dbDialect
});

export default sequelizeConnection;