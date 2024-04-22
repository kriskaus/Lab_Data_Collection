import express, { Express, NextFunction, Request, Response } from "express";
import session from 'express-session'
import cors from "cors";
import multer from 'multer';
import path, { resolve } from "path";
import fs from 'fs';
import passport from 'passport';
import bcrypt from 'bcryptjs';
import db from '../models';
import os from "os";
import sequelize  from "../config/dbConnect";
import PassportInitialize from "./passportConfig";
import {UpdateUserObject} from "../interface/UpdateUser";
import csv from "csv-parser"
import ip from 'ip';
// const SequelizeStore = require("connect-session-sequelize")(session.Store);

const app = express();

const port = process.env.PORT || 3000;
const Ipaddress = "192.168.22.204"
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(session({
  secret: 'Lab_Server', // Change this to a random string
  // store: new SequelizeStore({
  //   db:sequelize
  // }),
  resave: false,
  saveUninitialized: false,
  cookie: {
      secure: false, // Set to true if using HTTPS
      maxAge: 24 * 60 * 60 * 1000 // Session expiration time in milliseconds (e.g., 1 day)
  }
}));

app.set('trust proxy', true);
// Initialize Passport.js middleware
app.use(passport.initialize());
app.use(passport.session());
PassportInitialize(passport,
  (  username: any) =>{
    return db.User.findOne({ where: { username } });}
 );

let id="";
let ipAddress:string| null ;

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

const csvFilter = (req: any, file: { mimetype: string | string[]; }, cb: (error: Error | null, acceptFile: boolean)=> void) => {
  if (file.mimetype.includes("csv")) {
    cb(null, true);
  } else {
    cb(new Error("Please upload only csv file."), false);
  }
};

var fileStorage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
    cb(null,"uploads/");
  },
  filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
    console.log(file.originalname);
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
   // @ts-ignore
var uploadFile = multer({ storage: fileStorage, fileFilter: csvFilter });




//Middleware to see how the params are populated by Passport
let count = 1

const printData = (req: Request, res:Response, next: NextFunction) => {
    console.log("\n==============================")
    console.log(`------------>  ${count++}`)
    
    console.log(`\n req.body -------> ` )
    console.log(`req.body.username -------> ${req.body.username}`) 
    console.log(`req.body.password -------> ${req.body.password}`)

    console.log(req.user)

    console.log(`\n req.session.passport -------> ${req.ip}`)
    console.log(req.session)
   
  
    console.log(`\n req.user -------> `) 
    console.log(req.user)
    console.log(req.ips[0])
  
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
  console.log("rewe hc",req.isAuthenticated())
  if (req.user) {
    console.log("ensureAuthenticated",req.isAuthenticated())
      return next();
  }
  res.status(401).send('Unauthorized');
}

// API endpoint for uploading files
app.post('/upload',ensureAuthenticated, upload.single('file'),async (req, res) => {
  try {
    // Extract relevant information from the request
    const userId = id;
    console.log("user iddddddddddddddd",id)
    const filename = req.file?.filename;
    const uploadTime = new Date();
    const IPAddress = ipAddress; // Get the client's IP address from the request
    console.log(userId, filename, uploadTime, IPAddress);

    // Create a new FileActivity record in the database
    const newFileActivity = await db.FileActivity.create({
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
app.get('/download/:filename',ensureAuthenticated, async (req, res) => {
  console.log(__dirname, __filename)
  const filename = req.params.filename; // Extract the filename from the request parameters
  const filePath = path.join(__dirname, '../uploads', filename); // Construct the file path
  console.log(filePath,filename)

  // Check if the file exists
  if (fs.existsSync(filePath)) {
    try {
        // Find the user activity entry for the logged-in user and the current session
        const fileActivity = await db.FileActivity.findOne({
          where: {
            userId: id,
            filename:filename, // Assuming req.user contains the logged-in user's information
            downloadTime: null // Assuming logoutTime is a field that indicates whether the user has already logged out
          }
        });
    // console.log(fileActivity)
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
    const { username, password, email, role } = req.body;
    if (!username || !email || !password || !role) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const existingUser = await db.User.findOne({ where: { username } });

    if (existingUser) {
      // If user already exists, send response indicating user already exists
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = await db.User.create({ username, password: hashedPassword, email, role }); // Use `create` instead of `createUser`
    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'An error occurred while registering user' });
  }
});

function getWifiIPv4Address() {
  const networkInterfaces = os.networkInterfaces();

  // Find the Wi-Fi interface
  const wifiInterface = networkInterfaces['Wi-Fi'];

  if (!wifiInterface) {
    // Wi-Fi interface not found
    return null;
  }

  // Find the first non-internal IPv4 address
  const wifiIPv4Address = wifiInterface.find((addressInfo) => {
    return addressInfo.family === 'IPv4' && !addressInfo.internal;
  });

  if (!wifiIPv4Address) {
    // IPv4 address not found
    return null;
  }

  return wifiIPv4Address.address;
}

// Login route
app.post('/login', passport.authenticate('local'), async (req, res, next) => {
  // req.session.save()
  id = req.body.username
// const wifiIPv4Address = getWifiIPv4Address();
// console.log('Wi-Fi IPv4 Address:', wifiIPv4Address);
const wifiIPv4Address = ip.address()
  // const ipAddress1 = os.networkInterfaces();
  // // res.json({ ipAddress });
  // console.log(ipAddress1);
  // console.log("asdfdsasdfdsasdfdsasdfdsasdfds",req.ip)
  const role = await db.User.findOne({where:{username:id}});
  console.log("c jkjacsl0",role)
  ipAddress = wifiIPv4Address;
 try{
  var newUserActivity = await db.UserActivity.create({
    userId: id,
    loginTime: new Date(),
    IPAddress: ipAddress,
    role: role.role,
  })
  // console.log(newUserActivity, role)
 }
  catch(error){
    console.log(error)
  }
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

// Get All Files
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
    // console.log(files)
  } catch (error) {
    console.error('Error fetching files:', error);
    res.status(500).json({ error: 'An error occurred while fetching files' });
  }})

// Find User
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

  // Delete User
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

  // Route for updating a user
app.put('/users/:username', async (req, res) => {
  try {
    const { username } = req.params;
    console.log(username)
    const {  password, email, role } = req.body;
    console.log(email,username,password, role)
    const updateObject: UpdateUserObject = {};
    if (username) updateObject['username'] = username;
    if (password) updateObject['password'] = bcrypt.hashSync(password, 10);;
    if (email) updateObject['email'] = email;
    if (role) updateObject['role'] = role;

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

// Finding User Role
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

app.get('/all', async (req, res) => {
  try {
    const users = await db.User.findAll();
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'An error occurred while fetching users' });
  }

})

app.get('/users/activity', async (req, res) => {
  try {
    const files = await db.UserActivity.findAll();
    res.json(files);
  } catch (error) {
    console.error('Error fetching files:', error);
    res.status(500).json({ error: 'An error occurred while fetching files' });
  }
})

app.get('/files/activity', async (req, res) => {
  try {
    const files = await db.FileActivity.findAll();
    res.json(files);
  } catch (error) {
    console.error('Error fetching files:', error);
    res.status(500).json({ error: 'An error occurred while fetching files' });
  }
  
})

app.post('/users/csv',upload.single('file'), async (req, res) => {
  try {
    if (req.file == undefined) {
      return res.status(400).send("Please upload a CSV file!");
    }
    console.log("264664654", req.file)
    const details: any[] = [];
    const filename = req.file.filename; // Extract the filename from the request parameters
    const filePath = path.join(__dirname, '../uploads', filename); // Construct the file path
    console.log(filename, filePath);

    fs.createReadStream(filePath)
      .pipe(csv(    )) // <-- Added trim option
      .on("error", (error: { message: any; }) => {
        throw error.message;
      })
      .on("data", (row: any) => {
        details.push(row);
      })
      .on("end", () => {
        details.forEach(async (tutorial) => {
          // Hash the password before inserting into the database
          const hashedPassword = bcrypt.hashSync(tutorial.password, 10);; // Use bcrypt to hash the password
  
          // Modify the tutorial object to replace the plaintext password with the hashed password
          tutorial.password = hashedPassword;
      });
      // Once all passwords are hashed, insert the data into the database
        db.User.bulkCreate(details)
          .then(() => {
            res.status(200).send({
              message:
                "Uploaded the file successfully: " + req.file!.originalname,
            });
          })
          .catch((error: { message: any; }) => {
            res.status(500).send({
              message: "Fail to import data into database!",
              error: error.message,
            });
          });
      });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Could not upload the file: " + req.file!.originalname,
    });
  }
}
)

db.sequelize.sync().then(() =>{
  app.listen(+port,Ipaddress, () => {
    console.log(`Server is running on port  http://localhost:${port}`);
  });
})
// Create a ;local storage having field isLogin, make this login as true , make the expiration time as 5 minutes after which the isLogin will be false
// 