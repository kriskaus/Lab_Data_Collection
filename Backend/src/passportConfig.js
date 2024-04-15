const LocalStrategy = require('passport-local').Strategy
const db = require('../models');
const bcrypt =  require('bcryptjs');

module.exports = PassportInitialize = (passport) => {

passport.use(new LocalStrategy(
    async (username, password, done) => {
        try {
            // Find user by username
            let user = await db.User.findOne({ where: { username } });
            console.log(username,"vyjjhh0" + password)
            console.log(user.username)
            console.log(user.password)
          
  
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
        const isPasswordValid = bcrypt.compareSync(password, user.password);
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

  passport.serializeUser(function(user, done) {
   console.log(user)
    console.log("11111111111111111111111111111111111", user.username)
    done(null, user);
    console.log("11111111111111111111111111111111111")
   });

   passport.deserializeUser(async (id, done) => {
    try {
        const user = await db.User.findOne(id);
        console.log("22222222222222222222",user)
        if (!user) {
            console.log('User not found');
            return done(null, false);
        }
        return done(null, user);
    } catch (error) {
        console.error('Error deserializing user:', error);
        done(error);
    }
});

}
;