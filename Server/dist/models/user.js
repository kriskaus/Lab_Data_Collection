'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const dbConnect_1 = __importDefault(require("../config/dbConnect"));
exports.default = (sequelize, DataTypes) => {
    class User extends sequelize_1.Model {
        static async createUser(username, email, password) {
            // Use the Sequelize create method to insert a new record into the database
            const newUser = await User.create({ username, email, password });
            return newUser;
        }
        static associate(models) {
            // define association here
            User.belongsToMany(models.Project, {
                through: 'ProjectAssignments'
            });
            User.hasMany(models.UserActivity, {
                foreignKey: 'userId',
                as: 'user',
            });
            User.hasMany(models.FileActivity, {
                foreignKey: 'userId',
                as: 'user',
            });
        }
    }
    User.init({
        username: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    }, {
        sequelize: dbConnect_1.default,
        modelName: 'User',
    });
    return User;
};
