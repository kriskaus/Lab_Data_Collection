"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_local_1 = require("passport-local");
const models_1 = __importDefault(require("../models"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const initializing = (passport) => {
    passport.use(new passport_local_1.Strategy(async (username, password, done) => {
        try {
            // Find user by username
            const user = await models_1.default.User.findOne({ where: { username } });
            console.log(username, "vyjjhh0" + password);
            console.log(user);
            console.log(user.dataValues.password);
            // Check if user exists
            if (!user) {
                console.log('User not found');
                return done(null, false, { message: 'Incorrect username or password' });
            }
            // Check if password is undefined
            if (!password) {
                console.log('Password is undefined');
                return done(null, false, { message: 'Password is required' });
            }
            // Compare passwords
            const isPasswordValid = bcryptjs_1.default.compareSync(password, user.dataValues.password);
            console.log(isPasswordValid);
            if (!isPasswordValid) {
                return done(null, false, { message: 'Incorrect username or password' });
            }
            // If authentication succeeds, return user
            return done(null, user);
        }
        catch (error) {
            console.error('Error authenticating user:', error);
            return done(error);
        }
    }));
    passport.serializeUser((user, done) => {
        console.log("khcbsdkhcsjkvcbsdjvbkwvwjvblsjdvljeWVELWJ" + user);
        done(null, user);
    });
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await models_1.default.User.findByPk(id);
            done(null, user);
        }
        catch (error) {
            console.error('Error deserializing user:', error);
            done(error);
        }
    });
};
