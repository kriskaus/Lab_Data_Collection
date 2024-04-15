import express, { Express, NextFunction, Request, Response } from "express";
import session from 'express-session'
import cors from "cors";
import multer from 'multer';
import path from "path";
import fs from 'fs';
import passport from 'passport';
import bcrypt from 'bcryptjs';
import db from '../models';
import sequelize  from "../config/dbConnect";
import PassportInitialize from "./passportConfig";
import {UpdateUserObject} from "../interface/UpdateUser";
const SequelizeStore = require("connect-session-sequelize")(session.Store);

const app = express();

const port = process.env.PORT || 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(session({
  secret: 'Lab_Server', // Change this to a random string
  store: new SequelizeStore({
    db:sequelize
  }),
  resave: false,
  saveUninitialized: false,
  cookie: {
      secure: false, // Set to true if using HTTPS
      maxAge: 24 * 60 * 60 * 1000 // Session expiration time in milliseconds (e.g., 1 day)
  }
}));
// Initialize Passport.js middleware
app.use(passport.initialize());
app.use(passport.authenticate('session'));
PassportInitialize(passport);

let id="";
let ipAddress ;

// Configure Passport.js

  






// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
    cb(null, 'uploads/');
  },
  filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });





//Middleware to see how the params are populated by Passport
let count = 1

const printData = (req: Request, res:Response, next: NextFunction) => {
    console.log("\n==============================")
    console.log(`------------>  ${count++}`)

    console.log(`req.body.username -------> ${req.body.username}`) 
    console.log(`req.body.password -------> ${req.body.password}`)

    console.log(req.user)

    console.log(`\n req.session.passport -------> `)
    console.log(req.session)
   
  
    console.log(`\n req.user -------> `) 
    console.log(req.user) 
  
    console.log("\n Session and Cookie")
    console.log(`req.session.id -------> ${req.session.id}`) 
    console.log(`req.session.cookie -------> `) 
    console.log(req.session.cookie) 
  
    console.log("===========================================\n")

    next()
}

app.use(printData)




// / Serve static files from the React frontend app
// app.use('/downloads', express.static(path.join(new URL('.', import.meta.url).pathname, 'downloads')));
function ensureAuthenticated(req : Request, res:Response, next : NextFunction) {
  if (req.isAuthenticated()) {
    console.log(req.session)
      return next();
  }
  res.status(401).send('Unauthorized');
}

// API endpoint for uploading files
app.post('/upload', upload.single('file'),async (req, res) => {
  try {
    // Extract relevant information from the request
    const userId = id;
    console.log("user iddddddddddddddd",id)
    const filename = req.file?.filename;
    const uploadTime = new Date();
    const IPAddress = req.ip; // Get the client's IP address from the request
    console.log(userId, filename, uploadTime, IPAddress);

    // Create a new FileActivity record in the database
    const newFileActivity = await db.fileactivity.create({
      userId,
      uploadTime,
      filename,
      IPAddress,
    });
    // Log a message to indicate that the file was uploaded successfully
    console.log('File uploaded successfully');
    
    // Send a response to the client
    res.status(200).json({ message: 'File uploaded successfully', fileActivity: newFileActivity });
  } catch (error) {
    // If an error occurs, log the error and send a 500 internal server error response
    console.error('Error uploading file:', error);
    res.status(500).json({ error: 'An error occurred while uploading file' });
  }
});


// API endpoint for downloading files
app.get('/download/:filename', async (req, res) => {
  console.log(__dirname, __filename)
  const filename = req.params.filename; // Extract the filename from the request parameters
  const filePath = path.join(__dirname, '../uploads', filename); // Construct the file path
  console.log(filePath,filename)

  // Check if the file exists
  if (fs.existsSync(filePath)) {
    try {
        // Find the user activity entry for the logged-in user and the current session
        const fileActivity = await db.fileActivity.findOne({
          where: {
            userId: id,
            filename:filename, // Assuming req.user contains the logged-in user's information
            downloadTime: null // Assuming logoutTime is a field that indicates whether the user has already logged out
          }
        });
    console.log(fileActivity)
        if (fileActivity) {
          // Update the user activity entry with the logout time
          fileActivity.downloadTime=  new Date();
          await fileActivity.save();
        }
    }catch (error){
        console.error('Error uploading file:', error);
        return res.status(500).json({ error: 'An error occurred while downloading file' });
    }
    // If the file exists, send it as a download using res.download()
    res.download(filePath, filename, (err) => {
      console.log("File download Successfully")
      if (err) {
        // If an error occurs during download, send an error response
        return res.status(500).send('Error downloading file');
      }
    })
}
     else {
    // If the file does not exist, send a 404 Not Found response
        return  res.status(404).send('File not found');
  }
});

// Register user route
// Register user route
app.post('/register', async (req, res) => {
  try {
    const { username, password, email } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const existingUser = await db.User.findOne({ where: { username } });

    if (existingUser) {
      // If user already exists, send response indicating user already exists
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = await db.User.create({ username, password: hashedPassword, email }); // Use `create` instead of `createUser`
    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'An error occurred while registering user' });
  }
});


// Login route
app.post('/login', passport.authenticate('local'), async (req, res, next) => {
  // req.session.save()
  ipAddress = req.body.IPAddress;
  const newUserActivity = await db.UserActivity.create({
    userId: id,
    loginTime: new Date(),
    IPAddress: ipAddress,
  })
  req.session.regenerate(function (err) {
    if (err) 
    { next(err); return; } // Ensure the function returns after calling next(err)

    req.session.save(function (err) {
      if (err) 
      { next(err); return; } // Ensure the function returns after calling next(err)
    //   res.redirect('/'); //
    return res.status(200).json({ message: 'Login successful', user: req.user, userActivity: newUserActivity });
    })
  })
  });


// Logout route
// Logout route
app.get('/logout', async (req, res) => {
  try {
    // Find the user activity entry for the logged-in user and the current session
    const userActivity = await db.UserActivity.findOne({
      where: {
        userId: id, // Assuming req.user contains the logged-in user's information
        logoutTime: null // Assuming logoutTime is a field that indicates whether the user has already logged out
      }
    });

    if (userActivity) {
      // Update the user activity entry with the logout time
      userActivity.logoutTime = new Date();
      await userActivity.save();
    }

    // Perform logout actions
    req.logout(() => {
      req.session.destroy((err) => {
        if (err) {
          console.error('Error destroying session:', err);
          res.status(500).json({ message: 'Error logging out' });
        } else {
          res.json({ message: 'Logout successful' });
        }
      });
    });
  } catch (error) {
    console.error('Error logging out:', error);
    res.status(500).json({ message: 'Error logging out' });
  }
});


app.get('/files', async (req, res) => {
  try {
    // Query the database to get all files
    const files = await db.FileActivity.findAll({where:{userId : id}});
    console.log(files)

    // If there are no files, return a 404 error
    if (!files || files.length === 0) {
      return res.status(404).json({ error: 'No files found' });
    }

    // If files are found, return them in the response
    res.json(files);
    console.log(files)
  } catch (error) {
    console.error('Error fetching files:', error);
    res.status(500).json({ error: 'An error occurred while fetching files' });
  }})


  app.get('/users', async (req, res) => {
    try {
      const  username  = req.query.username;
      console.log("1122220",username, req.query.username)
      const newUser = await db.User.findOne({where: {username} }); // Use `create` instead of `createUser`
      if(newUser === null){
        // throw new Error('User Not Found !');
        return res.status(404).json({ error: 'User Not Found !' });
      }
      return res.status(201).json({ message: 'User find successfully' , user: newUser });
    } catch (error) {
      console.error('Error finding user:', error);
      return res.status(500).json({ error: 'User Not Found !' });
    }
    
  })

  app.delete('/users/:username', async (req, res) => {
    try{
      const  {username}  = req.params;
      const newUser = await db.User.destroy({where: {username} }); // Use `create` instead of `createUser`
      res.status(201).json({ message: 'User deleted successfully' , user: newUser });
    }
    catch (error){
      console.error('Error finding user:', error);
      res.status(404).json({ error: 'User Not Found !' });
    }
  })

  // Define the route handler for updating a user
app.put('/users/:username', async (req, res) => {
  try {
    const { username } = req.params;
    console.log(username)
    const {  password, email } = req.body;
    console.log(email,username,password)

    // Validate input to prevent SQL injection
    // if (!newUsername || !newPassword || !newEmail) {
    //   return res.status(400).json({ error: 'At least one field (username, password, email) must be provided for update' });
    // }

    // Construct the update object based on provided fields
    const updateObject: UpdateUserObject = {};
    if (username) updateObject['username'] = username;
    if (password) updateObject['password'] = bcrypt.hashSync(password, 10);;
    if (email) updateObject['email'] = email;

    // Update the user in the database
    const [updatedRowsCount] = await db.User.update(
      updateObject,
      { where: { username } }
    );
    console.log(updatedRowsCount, updateObject)
    if (updatedRowsCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Send a success response
    return res.status(200).json({ message: 'User updated successfully' });
  } catch (error) {
    console.error('Error updating user:', error);
    return res.status(500).json({ error: 'An error occurred while updating user' });
  }
});


app.get('/users/role/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const users = await db.User.findOne({where: {username}});
    res.json(users.role);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'An error occurred while fetching users' });
  }
})

db.sequelize.sync().then(() =>{
  app.listen(port, () => {
    console.log(`Server is running on port  http://localhost:${port}`);
  });
})
