import { Strategy as LocalStrategy } from 'passport-local';
import db from '../models';
import { PassportStatic } from 'passport';
import bcrypt from  'bcryptjs';
import { UpdateUserObject } from '../interface/UpdateUser';

// let id ="";
const PassportInitialize = (passport: any, username: any) => {
    
    const authenticateUser = async (username: string, password: string, done:any) => {
        try {
            // Find user by username
            let user :UpdateUserObject = await db.User.findOne({ where: { username } });
            console.log(username,"vyjjhh0" + password)
            console.log(user.username)
            console.log(user.password)
            // id=user.username!
          
  
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
        const isPasswordValid = bcrypt.compareSync(password, user.password!);
        console.log(isPasswordValid)
  
        if (!isPasswordValid) {
          return done(null, false, { message: 'Incorrect username or password' });
        }   return done(null, user);
    } catch (error) {
        console.error('Error authenticating user:', error);
        return done(error);
    }
}

passport.use( new LocalStrategy({usernameField: 'username'}, authenticateUser));

  passport.serializeUser(function(user:UpdateUserObject, done:any) {
   console.log("this is serialize user",user.username);
    console.log("11111111111111111111111111111111111")
    done(null, user);
    console.log("11111111111111111111111111111111111")
   });

   passport.deserializeUser( (userId: string, done:any) => {
    try {
      const user =  db.User.findOne({ where: { username: userId } });
      if (!user) {
        console.log('User not found during deserialization');
        return done(null, false);
      }
      return done(null, user); // Deserialize user object
    } catch (error) {
      console.error('Error deserializing user:', error);
      done(error); // Pass any errors to done callback
    }
  });

}

export default PassportInitialize;