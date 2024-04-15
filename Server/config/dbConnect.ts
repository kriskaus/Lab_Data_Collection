import { Sequelize } from "sequelize";
import Config  from  "../config/config.json";

const config = Config.development

const dbName = config.database as string;
const dbHost = config.host;
const dbUsername = config.username as string;
const dbPassword = config.password;
const dbDialect = "mysql";

const sequelize = new Sequelize(dbName, dbUsername, dbPassword, {
	host: dbHost,
	dialect: dbDialect,
	// storage: "./session.mysql"

});



export default sequelize;