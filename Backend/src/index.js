const express = require("express");
const session = require('express-session');
const cors = require("cors");
const multer = require('multer');
const path = require("path");
const fs = require('fs');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const db= require( '../models');
const sequelize = require("../config/config.json");
const PassportInitialize =require("./passportConfig");
// const SequelizeStore = require("connect-session-sequelize")(session.Store);

const app = express();

const port = process.env.PORT || 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(session({
  secret: 'Lab_Server', // Change this to a random string
//   store: new SequelizeStore({
//     db:sequelize
//   }),
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
  destination: (req , file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });





//Middleware to see how the params are populated by Passport
let count = 1

const printData = (req, res, next) => {
    console.log("\n==============================")
    console.log(`------------>  ${count++}`)

    console.log(`req.body.username -------> ${req.body.username}`) 
    console.log(`req.body.password -------> ${req.body.password}`)

    console.log(`\n req.session.passport -------> `)
    console.log(req.session.passport)
   
  
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
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    console.log(req.session)
      return next();
  }
  return res.status(401).send('Unauthorized');
}

// API endpoint for uploading files
app.post('/upload', upload.single('file'),async (req, res) => {
  try {
    // Extract relevant information from the request
    const userId = id;
    console.log("user iddddddddddddddd",id)
    const filename = req.file?.filename;
    const uploadTime = new Date();
    // const IPAddress = req.ip; // Get the client's IP address from the request
    console.log(userId, filename, uploadTime, ipAddress);

    // Create a new FileActivity record in the database
    const newFileActivity = await db.fileActivity.create({
      userId: id,
      uploadTime,
      filename,
      IPAddress : ipAddress,
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
  id = req.user.username
  const newUserActivity = await db.userActivity.create({
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
app.get('/logout', async (req, res) => {
  try {
    // Find the user activity entry for the logged-in user and the current session
    const userActivity = await db.userActivity.findOne({
      where: {
        userId: id, // Assuming req.user contains the logged-in user's information
        logoutTime: null // Assuming logoutTime is a field that indicates whether the user has already logged out
      }
    });
console.log(userActivity)
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
    const files = await db.fileActivity.findAll({where:{userId : id}});
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



db.sequelize.sync().then(() =>{
  app.listen(port, () => {
    console.log(`Server is running on port  http://localhost:${port}`);
  });
})