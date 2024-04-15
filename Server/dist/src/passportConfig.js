"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_local_1 = require("passport-local");
const models_1 = __importDefault(require("../models"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
let id = "";
const PassportInitialize = (passport) => {
    passport.use(new passport_local_1.Strategy((username, password, done) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // Find user by username
            let user = yield models_1.default.User.findOne({ where: { username } });
            console.log(username, "vyjjhh0" + password);
            console.log(user.username);
            console.log(user.password);
            id = user.username;
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
            const isPasswordValid = bcryptjs_1.default.compareSync(password, user.password);
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
    })));
    passport.serializeUser(function (user, done) {
        console.log(user);
        console.log("11111111111111111111111111111111111");
        done(null, user.username);
        console.log("11111111111111111111111111111111111");
    });
    passport.deserializeUser((username, done) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const user = yield models_1.default.User.findOne({ where: { username } });
            if (!user) {
                console.log('User not found');
                return done(null, false);
            }
            return done(null, user);
        }
        catch (error) {
            console.error('Error deserializing user:', error);
            done(error);
        }
    }));
};
exports.default = PassportInitialize;
