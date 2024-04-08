import { Strategy as LocalStrategy } from 'passport-local';
import db from '../models';
import bcrypt from 'bcryptjs';

const initializing = (passport: any) => {
    passport.use(new LocalStrategy(
        async (username, password, done) => {
            try {
                // Find user by username
                const user = await db.User.findOne({ where: { username } });
                console.log(username,"vyjjhh0" + password)
                console.log(user)
                console.log(user.dataValues.password)
      
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
            const isPasswordValid = bcrypt.compareSync(password, user.dataValues.password);
            console.log(isPasswordValid)
      
            if (!isPasswordValid) {
              return done(null, false, { message: 'Incorrect username or password' });
            }
      
      
                // If authentication succeeds, return user
                return done(null, user);
            } catch (error) {
                console.error('Error authenticating user:', error);
                return done(error);
            }
        }
      ));
      
      passport.serializeUser((user, done) => {
        console.log("khcbsdkhcsjkvcbsdjvbkwvwjvblsjdvljeWVELWJ"+ user)
        done(null, user);
      });
      
      passport.deserializeUser(async (id:number, done) => {
        try {
            const user = await db.User.findByPk(id);
            done(null, user);
        } catch (error) {
            console.error('Error deserializing user:', error);
            done(error);
        }
      });
}