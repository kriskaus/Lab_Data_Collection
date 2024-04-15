"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const cors_1 = __importDefault(require("cors"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const passport_1 = __importDefault(require("passport"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const models_1 = __importDefault(require("../models"));
const passport_local_1 = require("passport-local");
const app = (0, express_1.default)();
app.use(express_1.default.json());
const port = process.env.PORT || 3000;
const body_parser_1 = __importDefault(require("body-parser"));
// Parse JSON bodies
let user = {};
app.use(body_parser_1.default.json());
let id = "";
// // Parse URL-encoded bodies
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)());
app.use((0, express_session_1.default)({
    secret: 'Lab_Server', // Change this to a random string
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // Set to true if using HTTPS
        maxAge: 24 * 60 * 60 * 1000 // Session expiration time in milliseconds (e.g., 1 day)
    }
}));
// Initialize Passport.js middleware
app.use(passport_1.default.initialize());
// // Use session middleware for persisting login sessions
app.use(passport_1.default.session());
// Configure Passport.js
passport_1.default.serializeUser(function (user, done) {
    console.log("11111111111111111111111111111111111");
    done(null, user);
    console.log("11111111111111111111111111111111111");
});
passport_1.default.deserializeUser(async (id, done) => {
    try {
        const user = await models_1.default.User.findByPk(id);
        done(null, user);
    }
    catch (error) {
        console.error('Error deserializing user:', error);
        done(error);
    }
});
passport_1.default.use(new passport_local_1.Strategy(async (username, password, done) => {
    try {
        // Find user by username
        let user = await models_1.default.User.findOne({ where: { username } });
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
}));
// Configure Multer storage
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
const upload = (0, multer_1.default)({ storage: storage });
//Middleware to see how the params are populated by Passport
let count = 1;
const printData = (req, res, next) => {
    console.log("\n==============================");
    console.log(`------------>  ${count++}`);
    console.log(`req.body.username -------> ${req.body.username}`);
    console.log(`req.body.password -------> ${req.body.password}`);
    console.log(req.user?.passport.user);
    console.log(`\n req.session.passport -------> `);
    console.log(req.session.passport);
    console.log(`\n req.user -------> `);
    console.log(req.user);
    console.log("\n Session and Cookie");
    console.log(`req.session.id -------> ${req.session.id}`);
    console.log(`req.session.cookie -------> `);
    console.log(req.session.cookie);
    console.log("===========================================\n");
    next();
};
app.use(printData);
// / Serve static files from the React frontend app
// app.use('/downloads', express.static(path.join(new URL('.', import.meta.url).pathname, 'downloads')));
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        console.log(req.user);
        return next();
    }
    res.status(401).send('Unauthorized');
}
// API endpoint for uploading files
app.post('/upload', upload.single('file'), async (req, res) => {
    try {
        // Extract relevant information from the request
        const userId = id;
        console.log("user iddddddddddddddd", id);
        const filename = req.file?.filename;
        const uploadTime = new Date();
        const IPAddress = req.ip; // Get the client's IP address from the request
        console.log(userId, filename, uploadTime, IPAddress);
        // Create a new FileActivity record in the database
        const newFileActivity = await models_1.default.FileActivity.create({
            userId,
            uploadTime,
            filename,
            IPAddress,
        });
        // Log a message to indicate that the file was uploaded successfully
        console.log('File uploaded successfully');
        // Send a response to the client
        res.status(200).json({ message: 'File uploaded successfully', fileActivity: newFileActivity });
    }
    catch (error) {
        // If an error occurs, log the error and send a 500 internal server error response
        console.error('Error uploading file:', error);
        res.status(500).json({ error: 'An error occurred while uploading file' });
    }
});
// API endpoint for downloading files
app.get('/download/:filename', (req, res) => {
    console.log(__dirname, __filename);
    const filename = req.params.filename; // Extract the filename from the request parameters
    const filePath = path_1.default.join(__dirname, '../uploads', filename); // Construct the file path
    console.log(filePath, filename);
    // Check if the file exists
    if (fs_1.default.existsSync(filePath)) {
        // If the file exists, send it as a download using res.download()
        res.download(filePath, filename, (err) => {
            console.log("File download Successfully");
            if (err) {
                // If an error occurs during download, send an error response
                res.status(500).send('Error downloading file');
            }
        });
    }
    else {
        // If the file does not exist, send a 404 Not Found response
        res.status(404).send('File not found');
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
        const hashedPassword = bcryptjs_1.default.hashSync(password, 10);
        const newUser = await models_1.default.User.create({ username, password: hashedPassword, email }); // Use `create` instead of `createUser`
        res.status(201).json({ message: 'User registered successfully', user: newUser });
    }
    catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'An error occurred while registering user' });
    }
});
// Login route
app.post('/login', passport_1.default.authenticate('local'), (req, res) => {
    res.status(200).json({ message: 'Login successful', user: req.user });
});
// Logout route
app.get('/logout', (req, res) => {
    req.logout(() => {
        req.session.destroy((err) => {
            if (err) {
                console.error('Error destroying session:', err);
                res.status(500).json({ message: 'Error logging out' });
            }
            else {
                res.json({ message: 'Logout successful' });
            }
        });
    });
});
app.get('/files', async (req, res) => {
    try {
        // Query the database to get all files
        const files = await models_1.default.FileActivity.findAll();
        console.log(files);
        // If there are no files, return a 404 error
        if (!files || files.length === 0) {
            return res.status(404).json({ error: 'No files found' });
        }
        // If files are found, return them in the response
        res.json(files);
        console.log(files);
    }
    catch (error) {
        console.error('Error fetching files:', error);
        res.status(500).json({ error: 'An error occurred while fetching files' });
    }
});
models_1.default.sequelize.sync().then(() => {
    app.listen(port, () => {
        console.log(`Server is running on port  http://localhost:${port}`);
    });
});
